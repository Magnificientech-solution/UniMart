import Stripe from 'stripe';
import { Order, User, OrderItem } from '@shared/schema';
import { storage } from '../storage';
import { log } from '../vite';

class PaymentProcessingService {
  private stripe: Stripe | null = null;
  private isDemo: boolean = true;

  constructor() {
    // Initialize Stripe if the API key is available
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2023-10-16',
        });
        this.isDemo = false;
      } catch (error) {
        console.error('Error initializing Stripe:', error);
      }
    } else {
      console.log('Stripe secret key not set - payment processing in demo mode');
    }

    // Initialize Stripe Connect for vendor payouts if available
    if (process.env.STRIPE_CONNECT_CLIENT_ID) {
      // In a real implementation, we would set up Stripe Connect here
      this.isDemo = false;
    }
  }

  /**
   * Create a payment intent for an order
   */
  async createPaymentIntent(order: Order, user: User): Promise<{ 
    success: boolean; 
    clientSecret?: string; 
    error?: string;
  }> {
    try {
      // In demo mode, create a mock payment intent
      if (this.isDemo || !this.stripe) {
        return {
          success: true,
          clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substring(2, 10)}`,
        };
      }

      // Create a real payment intent with Stripe
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(order.totalAmount * 100), // Convert to cents
        currency: 'gbp',
        metadata: {
          orderId: order.id.toString(),
          userId: user.id.toString(),
        },
        receipt_email: user.email,
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment intent',
      };
    }
  }

  /**
   * Process payouts to vendors for order items
   */
  async processVendorPayouts(orderItems: OrderItem[], vendors: (User | undefined)[]): Promise<{ 
    success: boolean; 
    error?: string;
  }> {
    try {
      // In demo mode, simulate successful payouts
      if (this.isDemo || !this.stripe) {
        // Mock transaction IDs for demo purposes
        const vendorPayouts = vendors.map(vendor => ({
          vendorId: vendor?.id,
          amount: 0,
          transactionId: `payout_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        }));
        return { success: true };
      }

      // Group order items by vendor
      const vendorOrderItems = new Map<number, OrderItem[]>();
      
      for (const item of orderItems) {
        const product = await storage.getProduct(item.productId);
        if (!product) continue;

        const vendorId = product.vendorId;
        if (!vendorOrderItems.has(vendorId)) {
          vendorOrderItems.set(vendorId, []);
        }
        vendorOrderItems.get(vendorId)?.push(item);
      }

      // Process payouts for each vendor
      for (const vendor of vendors) {
        if (!vendor) continue;
        
        // Skip vendors without Stripe accounts
        if (!vendor.stripeAccountId) {
          console.log(`Vendor ${vendor.id} has no Stripe account - skipping payout`);
          continue;
        }
        
        const vendorItems = vendorOrderItems.get(vendor.id) || [];
        
        // Calculate vendor's share
        let vendorAmount = 0;
        for (const item of vendorItems) {
          vendorAmount += item.price * item.quantity;
        }
        
        // Apply commission (from vendor rate or default 10%)
        const commissionRate = vendor.commissionRate || 0.1;
        const vendorShare = vendorAmount * (1 - commissionRate);
        
        // Process transfer to vendor's Stripe account
        try {
          await this.stripe.transfers.create({
            amount: Math.round(vendorShare * 100), // Convert to cents
            currency: 'gbp',
            destination: vendor.stripeAccountId,
            description: `Payout for orders on UniMart`,
          });
        } catch (error) {
          console.error(`Error processing payout for vendor ${vendor.id}:`, error);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error processing vendor payouts:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process vendor payouts',
      };
    }
  }

  /**
   * Create onboarding link for vendors
   */
  async createVendorOnboardingLink(vendor: User, returnUrl: string): Promise<string> {
    try {
      // In demo mode, return a mock onboarding link
      if (this.isDemo || !this.stripe) {
        return `${returnUrl}?demo=true&vendor=${vendor.id}`;
      }

      // Check if vendor already has a Stripe account
      if (vendor.stripeAccountId) {
        // Get the account link for the existing account
        const accountLink = await this.stripe.accountLinks.create({
          account: vendor.stripeAccountId,
          refresh_url: returnUrl,
          return_url: returnUrl,
          type: 'account_onboarding',
        });
        return accountLink.url;
      }

      // Create a new Stripe account for the vendor
      const account = await this.stripe.accounts.create({
        type: 'express',
        email: vendor.email,
        business_type: 'individual',
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          vendorId: vendor.id.toString(),
        },
      });

      // Update vendor with Stripe account ID
      await storage.updateUserStripeInfo(vendor.id, {
        stripeAccountId: account.id,
      });

      // Create an account link for onboarding
      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: returnUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
      });

      return accountLink.url;
    } catch (error) {
      console.error('Error creating vendor onboarding link:', error);
      return returnUrl;
    }
  }

  /**
   * Get vendor payouts
   */
  async getVendorPayouts(vendorId: number): Promise<any[]> {
    try {
      // In demo mode, return mock payouts
      if (this.isDemo || !this.stripe) {
        return this.generateDemoPayouts(vendorId);
      }

      // Get vendor
      const vendor = await storage.getUser(vendorId);
      if (!vendor || !vendor.stripeAccountId) {
        return [];
      }

      // Get Stripe transfers for the vendor
      const transfers = await this.stripe.transfers.list({
        destination: vendor.stripeAccountId,
        limit: 100,
      });

      return transfers.data.map(transfer => ({
        id: transfer.id,
        amount: transfer.amount / 100, // Convert from cents
        currency: transfer.currency,
        description: transfer.description,
        created: new Date(transfer.created * 1000),
        status: 'paid',
      }));
    } catch (error) {
      console.error('Error getting vendor payouts:', error);
      return [];
    }
  }

  /**
   * Process a refund for an order
   */
  async processRefund(order: Order, amount?: number, reason?: string): Promise<{ 
    success: boolean; 
    refundId?: string; 
    error?: string;
  }> {
    try {
      // In demo mode, simulate successful refund
      if (this.isDemo || !this.stripe) {
        return {
          success: true,
          refundId: `re_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        };
      }

      // Get transactions for this order
      const transactions = await storage.getTransactionsByOrder(order.id);
      if (transactions.length === 0) {
        return {
          success: false,
          error: 'No transactions found for this order',
        };
      }

      // Find the payment intent transaction
      const paymentTransaction = transactions.find(t => t.status === 'succeeded');
      if (!paymentTransaction) {
        return {
          success: false,
          error: 'No successful payment found for this order',
        };
      }

      // Process the refund with Stripe
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentTransaction.id,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents if specified
        reason: (reason as 'duplicate' | 'fraudulent' | 'requested_by_customer' | undefined) || 'requested_by_customer',
      });

      return {
        success: true,
        refundId: refund.id,
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process refund',
      };
    }
  }

  /**
   * Generate demo payout data for testing
   */
  private generateDemoPayouts(vendorId: number): any[] {
    const now = new Date();
    const payouts = [];

    // Generate 10 random payouts over the last 3 months
    for (let i = 0; i < 10; i++) {
      const daysAgo = Math.floor(Math.random() * 90);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);

      // Random amount between £50 and £500
      const amount = Math.round((Math.random() * 450 + 50) * 100) / 100;

      payouts.push({
        id: `payout_${Date.now()}_${i}`,
        amount,
        currency: 'gbp',
        description: `Vendor payout for UniMart orders`,
        created: date,
        status: 'paid',
      });
    }

    // Sort by date, newest first
    return payouts.sort((a, b) => b.created.getTime() - a.created.getTime());
  }
}

export const paymentProcessing = new PaymentProcessingService();