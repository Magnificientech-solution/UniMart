import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { paymentProcessing } from '../services/payment-processing';
import { log } from '../vite';

// Create router
const router = Router();

/**
 * Create payment intent for an order
 * @route POST /api/payment/create-intent
 */
router.post('/create-intent', async (req, res) => {
  try {
    // User must be authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    
    // Get the order
    const order = await storage.getOrder(parseInt(orderId));
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if the order belongs to the authenticated user
    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Create a payment intent
    const paymentIntent = await paymentProcessing.createPaymentIntent(order, req.user);
    
    if (!paymentIntent.success) {
      return res.status(400).json({ error: paymentIntent.error });
    }
    
    res.json({
      clientSecret: paymentIntent.clientSecret,
      orderId: order.id,
      amount: order.totalAmount
    });
  } catch (error) {
    log(`Error creating payment intent: ${error instanceof Error ? error.message : String(error)}`, 'payment');
    res.status(500).json({
      error: 'Unable to create payment intent'
    });
  }
});

/**
 * Process payment webhook (for Stripe)
 * @route POST /api/payment/webhook
 */
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Process successful payment
        // 1. Get the order ID from metadata
        const paymentIntent = event.data.object;
        const orderId = parseInt(paymentIntent.metadata.orderId);
        
        // 2. Get order details
        const order = await storage.getOrder(orderId);
        if (!order) {
          log(`Order not found for payment: ${orderId}`, 'payment');
          return res.sendStatus(400);
        }
        
        // 3. Update order status
        await storage.updateOrderStatus(orderId, 'processing');
        
        // 4. Record the transaction
        await storage.createTransaction({
          id: paymentIntent.id,
          orderId,
          amount: order.totalAmount,
          status: 'succeeded',
          paymentProvider: 'stripe',
          createdAt: new Date()
        });
        
        // 5. Process vendor payouts for multi-vendor orders
        const orderItems = await storage.getOrderItems(orderId);
        
        // Get unique vendor IDs from order items
        const vendorIds = new Set<number>();
        for (const item of orderItems) {
          const product = await storage.getProduct(item.productId);
          if (product) {
            vendorIds.add(product.vendorId);
          }
        }
        
        // Get vendor users
        const vendors = await Promise.all(
          Array.from(vendorIds).map(id => storage.getUser(id))
        );
        
        // Process payouts to vendors
        await paymentProcessing.processVendorPayouts(orderItems, vendors);
        
        break;
      
      case 'payment_intent.payment_failed':
        // Handle failed payment
        const failedPaymentIntent = event.data.object;
        const failedOrderId = parseInt(failedPaymentIntent.metadata.orderId);
        
        // Update order status
        if (failedOrderId) {
          await storage.updateOrderStatus(failedOrderId, 'pending');
        }
        
        break;
    }
    
    res.sendStatus(200);
  } catch (error) {
    log(`Error processing webhook: ${error instanceof Error ? error.message : String(error)}`, 'payment');
    res.status(500).json({
      error: 'Unable to process webhook'
    });
  }
});

/**
 * Generate onboarding link for vendors to set up Stripe Connect
 * @route GET /api/payment/vendor/onboard
 */
router.get('/vendor/onboard', async (req, res) => {
  try {
    // User must be authenticated and be a vendor
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ error: 'Must be a vendor to access this endpoint' });
    }
    
    // Get the vendor
    const vendor = req.user;
    
    // Generate the onboarding link
    const returnUrl = req.query.returnUrl as string || `${req.protocol}://${req.get('host')}/vendor/dashboard`;
    const onboardingUrl = await paymentProcessing.createVendorOnboardingLink(vendor, returnUrl);
    
    res.json({ url: onboardingUrl });
  } catch (error) {
    log(`Error generating onboarding link: ${error instanceof Error ? error.message : String(error)}`, 'payment');
    res.status(500).json({
      error: 'Unable to generate onboarding link'
    });
  }
});

/**
 * Update vendor stripe account
 * @route POST /api/payment/vendor/account
 */
router.post('/vendor/account', async (req, res) => {
  try {
    // User must be authenticated and be a vendor
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ error: 'Must be a vendor to access this endpoint' });
    }
    
    const { stripeAccountId } = req.body;
    
    if (!stripeAccountId) {
      return res.status(400).json({ error: 'Stripe account ID is required' });
    }
    
    // Update vendor's stripe account ID
    const updatedVendor = await storage.updateUserStripeInfo(req.user.id, {
      stripeAccountId: stripeAccountId
    });
    
    res.json({ 
      id: updatedVendor.id,
      accountId: updatedVendor.stripeAccountId,
      status: 'connected'
    });
  } catch (error) {
    log(`Error updating vendor stripe account: ${error instanceof Error ? error.message : String(error)}`, 'payment');
    res.status(500).json({
      error: 'Unable to update vendor stripe account'
    });
  }
});

/**
 * Get vendor payouts
 * @route GET /api/payment/vendor/payouts
 */
router.get('/vendor/payouts', async (req, res) => {
  try {
    // User must be authenticated and be a vendor
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ error: 'Must be a vendor to access this endpoint' });
    }
    
    // Get vendor's payouts
    const payouts = await paymentProcessing.getVendorPayouts(req.user.id);
    
    res.json(payouts);
  } catch (error) {
    log(`Error getting vendor payouts: ${error instanceof Error ? error.message : String(error)}`, 'payment');
    res.status(500).json({
      error: 'Unable to get vendor payouts'
    });
  }
});

/**
 * Refund a payment
 * @route POST /api/payment/refund
 */
router.post('/refund', async (req, res) => {
  try {
    // User must be authenticated and be an admin
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { orderId, amount, reason } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    
    // Get the order
    const order = await storage.getOrder(parseInt(orderId));
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Process the refund
    const refundResult = await paymentProcessing.processRefund(
      order, 
      amount ? parseFloat(amount) : undefined, 
      reason
    );
    
    if (!refundResult.success) {
      return res.status(400).json({ error: refundResult.error });
    }
    
    // Update order status
    await storage.updateOrderStatus(order.id, 'cancelled');
    
    // Record the refund transaction
    await storage.createTransaction({
      id: refundResult.refundId || `ref_${Date.now()}`,
      orderId: order.id,
      amount: amount ? -parseFloat(amount) : -order.totalAmount,
      status: 'refunded',
      paymentProvider: 'stripe',
      refundId: refundResult.refundId,
      createdAt: new Date()
    });
    
    res.json({
      success: true,
      orderId: order.id,
      refundId: refundResult.refundId,
      amount: amount || order.totalAmount
    });
  } catch (error) {
    log(`Error processing refund: ${error instanceof Error ? error.message : String(error)}`, 'payment');
    res.status(500).json({
      error: 'Unable to process refund'
    });
  }
});

/**
 * Calculate order total with tax
 * @route POST /api/payment/calculate
 */
router.post('/calculate', async (req, res) => {
  try {
    const { items, shippingCountry, promoCode } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items are required' });
    }
    
    // Get products for the items
    const products = [];
    let subtotal = 0;
    
    for (const item of items) {
      const { productId, quantity } = item;
      
      if (!productId || !quantity) {
        continue;
      }
      
      const product = await storage.getProduct(parseInt(productId));
      
      if (!product) {
        continue;
      }
      
      products.push({
        ...product,
        quantity
      });
      
      subtotal += product.price * quantity;
    }
    
    // Calculate VAT (20% for UK, varies for other countries)
    const isUK = shippingCountry === 'United Kingdom' || shippingCountry === 'UK' || shippingCountry === 'GB';
    const vatRate = isUK ? 0.2 : 0;
    const vat = subtotal * vatRate;
    
    // Calculate shipping (simplified)
    const shipping = isUK ? 3.99 : 9.99;
    
    // Apply promo code discount (simplified)
    let discount = 0;
    if (promoCode) {
      // This would typically check against a database of promo codes
      if (promoCode === 'WELCOME10') {
        discount = subtotal * 0.1; // 10% off
      } else if (promoCode === 'FREESHIP') {
        discount = shipping;
      }
    }
    
    // Calculate total
    const total = subtotal + vat + shipping - discount;
    
    res.json({
      subtotal,
      vat,
      shipping,
      discount,
      total,
      items: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
        total: p.price * p.quantity
      }))
    });
  } catch (error) {
    log(`Error calculating order: ${error instanceof Error ? error.message : String(error)}`, 'payment');
    res.status(500).json({
      error: 'Unable to calculate order'
    });
  }
});

export default router;