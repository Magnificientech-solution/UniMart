
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Store, PieChart, Package, DollarSign, Bell, Settings, TagIcon, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function VendorGuide() {
  return (
    <div className="space-y-12 py-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-4">UniMart Vendor Guide</h2>
        <p className="text-muted-foreground text-lg">
          Everything you need to know to sell successfully on the UniMart marketplace
        </p>
      </div>
      
      <section className="mb-12">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <Store className="mr-2 h-6 w-6 text-primary" />
          Getting Started as a UniMart Vendor
        </h3>
        
        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="bg-primary/5 rounded-t-lg">
            <CardTitle>Setting Up Your UniMart Store</CardTitle>
            <CardDescription>Create your vendor profile in just a few simple steps</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 text-primary font-medium">1</span>
                <div>
                  <h4 className="font-semibold mb-1">Apply for a Vendor Account</h4>
                  <p className="text-muted-foreground">Go to your UniMart profile settings and select "Become a Vendor" or register directly as a vendor during account creation. You'll need to provide your business details including name, address, and tax identification number.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 text-primary font-medium">2</span>
                <div>
                  <h4 className="font-semibold mb-1">Complete Verification</h4>
                  <p className="text-muted-foreground">Upload the required business documents for verification. Our team will review your application and typically approve it within 24 hours. You'll receive an email notification once approved.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 text-primary font-medium">3</span>
                <div>
                  <h4 className="font-semibold mb-1">Set Up Your Store Profile</h4>
                  <p className="text-muted-foreground">Customize your UniMart storefront with your logo, banner, business description, refund policy, and shipping information. A complete profile builds trust with customers and improves your visibility in search results.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 text-primary font-medium">4</span>
                <div>
                  <h4 className="font-semibold mb-1">Configure Payment Settings</h4>
                  <p className="text-muted-foreground">Connect your bank account or payment method to receive your earnings. Set up your tax information and choose your preferred payout schedule (bi-weekly or monthly).</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>
      
      <section className="mb-12">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <Package className="mr-2 h-6 w-6 text-primary" />
          Managing Your Products
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <TagIcon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Adding Products</CardTitle>
              <CardDescription>
                Create compelling product listings that sell
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Use the "Add Product" button in your vendor dashboard</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Upload multiple high-quality images (min. 1000x1000px)</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Write detailed descriptions with SEO-friendly keywords</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Use our AI assistant to generate optimized descriptions</p>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>
                Keep track of your stock efficiently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Use bulk upload tools for managing multiple products</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Set low stock alerts for automatic notifications</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Create product variations (size, color, material, etc.)</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Enable automated inventory syncing with other platforms</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="mb-12">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <DollarSign className="mr-2 h-6 w-6 text-primary" />
          Processing Orders & Payments
        </h3>
        
        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="bg-primary/5 rounded-t-lg">
            <CardTitle>Order Management</CardTitle>
            <CardDescription>Streamline your order fulfillment process</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-4 flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-primary" /> 
                  Order Notifications
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">Instant alerts when new orders are placed</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">Order details available in your dashboard</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">Automatically updated inventory levels</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">Bulk order processing for efficiency</p>
                  </li>
                </ul>
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-4 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-primary" /> 
                  Payments & Fees
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">Commission rates from 8-15% based on category</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">Volume-based discount tiers for higher sales</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">Bi-weekly or monthly payment schedules</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">Detailed transaction reports for accounting</p>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section>
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <PieChart className="mr-2 h-6 w-6 text-primary" />
          Growing Your Business
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>
                Data-driven decisions to boost sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Real-time sales dashboards with key metrics</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Customer behavior and demographic insights</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Conversion rate optimization suggestions</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Competitor pricing and market trend analysis</p>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle>Promotion Tools</CardTitle>
              <CardDescription>
                Increase visibility and attract more customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Create limited-time discounts and promotions</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Participate in UniMart's featured collections</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Sponsorship opportunities for increased visibility</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Bundle products to increase average order value</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <div className="mt-10 text-center">
        <p className="text-muted-foreground mb-4">Ready to start selling on UniMart?</p>
        <Link href="/auth">
          <Button size="lg" className="rounded-md">
            Apply Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
