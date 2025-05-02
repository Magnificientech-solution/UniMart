
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Heart, CreditCard, User, Clock, Truck, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function UserGuide() {
  return (
    <div className="space-y-12 py-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-4">UniMart Customer Guide</h2>
        <p className="text-muted-foreground text-lg">
          Everything you need to know to make the most of your UniMart shopping experience
        </p>
      </div>
      
      <section className="mb-12">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <User className="mr-2 h-6 w-6 text-primary" />
          Getting Started with UniMart
        </h3>
        
        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="bg-primary/5 rounded-t-lg">
            <CardTitle>Creating Your UniMart Account</CardTitle>
            <CardDescription>Setting up your account takes just a few moments</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 text-primary font-medium">1</span>
                <div>
                  <h4 className="font-semibold mb-1">Sign Up</h4>
                  <p className="text-muted-foreground">Click the "Sign Up" button in the top right corner of any UniMart page. You can register with your email or use your Google or Facebook account for one-click signup.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 text-primary font-medium">2</span>
                <div>
                  <h4 className="font-semibold mb-1">Verify Your Account</h4>
                  <p className="text-muted-foreground">Check your email for a verification link from UniMart. Click the link to confirm your email address and secure your account.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 text-primary font-medium">3</span>
                <div>
                  <h4 className="font-semibold mb-1">Complete Your Profile</h4>
                  <p className="text-muted-foreground">Add your delivery addresses, save your payment methods, and set your communication preferences for a personalized shopping experience.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 text-primary font-medium">4</span>
                <div>
                  <h4 className="font-semibold mb-1">Join UniMart Rewards</h4>
                  <p className="text-muted-foreground">Opt in to our loyalty program to start earning UniCoins on every purchase, which can be redeemed for exclusive discounts and promotions.</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>
      
      <section className="mb-12">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCart className="mr-2 h-6 w-6 text-primary" />
          Shopping on UniMart
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Finding Products</CardTitle>
              <CardDescription>
                Discover millions of products across our marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Use our intelligent search bar with auto-suggestions</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Browse our hierarchical category system</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Apply filters for price, rating, shipping options, and more</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">View personalized recommendations based on your browsing history</p>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Managing Your Cart</CardTitle>
              <CardDescription>
                Easily add and manage items in your shopping cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Add items to your cart with a single click</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Adjust quantities or remove items in the cart page</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Your cart syncs across devices when logged in</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Save items for later in your wishlist</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="mb-12">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <CreditCard className="mr-2 h-6 w-6 text-primary" />
          Checkout & Payment
        </h3>
        
        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="bg-primary/5 rounded-t-lg">
            <CardTitle>Secure Checkout Process</CardTitle>
            <CardDescription>Complete your purchase with our streamlined checkout</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-4 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-primary" /> 
                  Payment Options
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">All major credit and debit cards (Visa, Mastercard, Amex)</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">PayPal integration for quick checkout</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">Apple Pay and Google Pay for mobile users</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">Save payment methods securely for faster future checkouts</p>
                  </li>
                </ul>
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-4 flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-primary" /> 
                  Shipping Options
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">Standard delivery (3-7 business days)</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">Express delivery (1-2 business days)</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">Free delivery on orders over £50</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                    <p className="text-sm">Save multiple shipping addresses for convenience</p>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section>
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <Clock className="mr-2 h-6 w-6 text-primary" />
          After Your Purchase
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
              <CardDescription>
                Monitor your orders from purchase to delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">View order history and current order status</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Receive email notifications at each step</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Track packages with interactive maps</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Get estimated delivery time updates</p>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle>Returns & Refunds</CardTitle>
              <CardDescription>
                Easy and hassle-free return process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">30-day return policy on most items</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Initiate returns through your account dashboard</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Print return labels or schedule pickup</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mr-2 mt-0.5">✓</span>
                  <p className="text-sm">Refunds typically processed within 5-7 business days</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <div className="mt-10 text-center">
        <p className="text-muted-foreground mb-4">Ready to start shopping on UniMart?</p>
        <Link href="/">
          <Button size="lg" className="rounded-md">
            Shop Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
