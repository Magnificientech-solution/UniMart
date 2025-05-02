
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Package, CreditCard, TruckIcon, ShieldCheck, Users } from "lucide-react";

export function FAQSection() {
  return (
    <div className="space-y-12 py-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground text-lg">
          Find answers to the most common questions about using UniMart
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">For Customers</h3>
          </div>
          
          <Card className="border-primary/10">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="account-creation">
                <AccordionTrigger className="px-4">How do I create an account?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  Click the "Sign Up" button in the top right corner and follow the registration process. You'll need to provide your name, email address, and create a password. You'll need to verify your email address to complete the setup.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="order-tracking">
                <AccordionTrigger className="px-4">How do I track my order?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  You can track your order by logging into your account and visiting the "My Orders" section. Each order will have a status indicator and tracking information once it has been shipped.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="returns">
                <AccordionTrigger className="px-4">What is the return policy?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  We offer a 30-day return policy for most items. To initiate a return, go to your order history, select the item you want to return, and follow the return instructions. Please note that some items may have different return conditions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment-methods">
                <AccordionTrigger className="px-4">What payment methods are accepted?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. All payments are processed securely through our trusted payment partners with encryption.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">For Vendors</h3>
          </div>
          
          <Card className="border-primary/10">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="become-vendor">
                <AccordionTrigger className="px-4">How do I become a vendor?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  Choose "Become a Vendor" during registration or convert your existing account through the dashboard. You'll need to provide additional business information such as business name, address, tax ID, and banking details for payments.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="listing-products">
                <AccordionTrigger className="px-4">How do I list products?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  Once your vendor account is approved, you can add products through your vendor dashboard. Click on "Add Product" and fill in the required information including title, description, price, quantity, and upload high-quality images.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="commission-fees">
                <AccordionTrigger className="px-4">What are the commission fees?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  UniMart charges a commission of 8-15% depending on the product category. The exact fee structure is available in your vendor dashboard under "Fee Schedule". Commissions are automatically deducted from your sales before payouts.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payouts">
                <AccordionTrigger className="px-4">When do I receive payments?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  Payments are processed every 14 days for all orders that have been delivered and are past the return period. Funds will be transferred directly to your registered bank account, and you'll receive a detailed payment report.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Platform & Security</h3>
        </div>
        
        <Card className="border-primary/10">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="account-security">
              <AccordionTrigger className="px-4">How secure is my account information?</AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                UniMart employs industry-standard encryption and security measures to protect your data. We use secure HTTPS connections, encrypt sensitive information, and regularly audit our systems for vulnerabilities. We never store complete credit card information on our servers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-privacy">
              <AccordionTrigger className="px-4">What data do you collect and how is it used?</AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                We collect personal information needed for transactions, account management, and platform improvements. This includes contact details, order history, and browsing patterns. We do not sell your personal data to third parties. For complete details, please refer to our Privacy Policy.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery-times">
              <AccordionTrigger className="px-4">What are the shipping and delivery times?</AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                Shipping times vary by vendor and location. Standard delivery typically takes 3-7 business days within the UK, while express options may be available for 1-2 day delivery. International shipping can take 7-21 days depending on the destination country.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="customer-support">
              <AccordionTrigger className="px-4">How do I contact customer support?</AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                You can reach our customer support team through the "Help" section in your account, by email at support@unimart.com, or by phone at +44 20 1234 5678. Our support hours are Monday to Friday, 9am to 6pm UK time.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
}
