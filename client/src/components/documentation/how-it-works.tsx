import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Play, ArrowRight, ShoppingCart, Store, ShieldCheck, LineChart, Gift } from "lucide-react";
import { Link } from "wouter";

export function HowItWorksGuide() {
  return (
    <div className="space-y-12 py-8">
      <section>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-4">How UniMart Works</h2>
          <p className="text-muted-foreground text-lg">
            UniMart is designed to make buying and selling seamless, secure, and rewarding. Discover how our platform connects customers with trusted vendors.
          </p>
        </div>

        <Card className="mb-12 border-primary/10 shadow-lg">
          <CardHeader className="pb-0 text-center">
            <CardTitle className="text-2xl">Welcome to UniMart</CardTitle>
            <CardDescription>Watch how our marketplace brings vendors and customers together for a premium shopping experience</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="relative mx-auto rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-video bg-gray-900 relative group">
                <iframe 
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/1W9WMYeD-9Q"
                  title="UniMart Platform Overview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">UniMart Shopping</CardTitle>
              <CardDescription className="text-base">
                Enjoy personalized recommendations, lightning-fast search, hassle-free purchasing, and transparent order tracking at every step.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="#customer-journey">
                <Button variant="ghost" className="px-0">
                  Customer experience <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">UniMart Selling</CardTitle>
              <CardDescription className="text-base">
                Access powerful tools to create your digital storefront, manage products efficiently, and grow your business with market insights.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="#vendor-journey">
                <Button variant="ghost" className="px-0">
                  Vendor tools <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">UniMart Protection</CardTitle>
              <CardDescription className="text-base">
                Shop with confidence thanks to our secure payment processing, buyer protection guarantee, and verified vendor program.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/documentation?tab=video">
                <Button variant="ghost" className="px-0">
                  Security features <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-12 mt-16">
          <div className="text-center">
            <h3 className="text-2xl font-bold tracking-tight mb-4">The UniMart Experience</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our platform is designed to provide a smooth, seamless journey for both shoppers and sellers
            </p>
          </div>

          <div id="customer-journey" className="scroll-mt-24">
            <Card className="border-primary/10 shadow-lg">
              <CardHeader className="bg-primary/5 rounded-t-lg">
                <CardTitle className="text-2xl flex items-center">
                  <div className="bg-primary/20 p-2 rounded-full mr-3">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                  </div>
                  The UniMart Customer Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5">✓</span>
                    <div>
                      <h4 className="font-semibold mb-1">Smart account setup</h4>
                      <p className="text-sm text-muted-foreground">Create your UniMart account in seconds with email, Google, or Facebook, and enjoy personalized recommendations from day one</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5">✓</span>
                    <div>
                      <h4 className="font-semibold mb-1">Intuitive product discovery</h4>
                      <p className="text-sm text-muted-foreground">UniMart's AI-powered search understands natural language queries and offers smart filtering by price range, ratings, shipping speed, and vendor reputation</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5">✓</span>
                    <div>
                      <h4 className="font-semibold mb-1">Persistent shopping cart</h4>
                      <p className="text-sm text-muted-foreground">The UniMart cart syncs across all your devices and even remembers items when you're not logged in, with one-click updates to quantities and options</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5">✓</span>
                    <div>
                      <h4 className="font-semibold mb-1">Express checkout</h4>
                      <p className="text-sm text-muted-foreground">Complete purchases in seconds with saved payment methods, address auto-completion, and optional one-click ordering for registered customers</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5">✓</span>
                    <div>
                      <h4 className="font-semibold mb-1">Live order updates</h4>
                      <p className="text-sm text-muted-foreground">Track your UniMart orders in real-time with interactive delivery maps, accurate ETAs, and instant notifications when your package ships and arrives</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div id="vendor-journey" className="scroll-mt-24 mt-8">
            <Card className="border-primary/10 shadow-lg">
              <CardHeader className="bg-primary/5 rounded-t-lg">
                <CardTitle className="text-2xl flex items-center">
                  <div className="bg-primary/20 p-2 rounded-full mr-3">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                  The UniMart Vendor Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5">✓</span>
                    <div>
                      <h4 className="font-semibold mb-1">Streamlined onboarding</h4>
                      <p className="text-sm text-muted-foreground">Get your UniMart store up and running in under an hour with our guided setup process and automated verification system</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5">✓</span>
                    <div>
                      <h4 className="font-semibold mb-1">Intelligent product management</h4>
                      <p className="text-sm text-muted-foreground">UniMart's dashboard lets you bulk upload products, auto-generates SEO descriptions, optimizes images, and suggests the best categories to reach your target customers</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5">✓</span>
                    <div>
                      <h4 className="font-semibold mb-1">Automated order fulfillment</h4>
                      <p className="text-sm text-muted-foreground">Process orders efficiently with UniMart's integrated shipping label generator, bulk order processing, and automated customer communications</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5">✓</span>
                    <div>
                      <h4 className="font-semibold mb-1">Business intelligence</h4>
                      <p className="text-sm text-muted-foreground">Gain valuable insights with UniMart's custom analytics dashboard showing conversion rates, customer behavior, and competitive pricing information</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5">✓</span>
                    <div>
                      <h4 className="font-semibold mb-1">Reliable payments</h4>
                      <p className="text-sm text-muted-foreground">Receive funds securely through UniMart's payment system with flexible payout schedules, detailed transaction reports, and tax documentation</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="border-primary/10 shadow-lg">
            <CardHeader className="bg-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center">
                <div className="bg-primary/20 p-2 rounded-full mr-3">
                  <LineChart className="w-5 h-5 text-primary" />
                </div>
                UniMart Advantage
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mt-0.5 text-xs">✓</span>
                  <p className="text-sm">AI-powered product recommendations based on browsing behavior</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mt-0.5 text-xs">✓</span>
                  <p className="text-sm">Advanced fraud detection system that protects both buyers and sellers</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mt-0.5 text-xs">✓</span>
                  <p className="text-sm">Rapid dispute resolution with our dedicated support team</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mt-0.5 text-xs">✓</span>
                  <p className="text-sm">Multi-language support for international customers and vendors</p>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-primary/10 shadow-lg">
            <CardHeader className="bg-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center">
                <div className="bg-primary/20 p-2 rounded-full mr-3">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                UniMart Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mt-0.5 text-xs">✓</span>
                  <p className="text-sm">Earn UniCoins with every purchase to redeem for discounts</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mt-0.5 text-xs">✓</span>
                  <p className="text-sm">Vendors receive reduced commission rates based on sales volume</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mt-0.5 text-xs">✓</span>
                  <p className="text-sm">Write verified reviews after purchase to earn additional rewards</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 p-1 rounded-full text-primary mt-0.5 text-xs">✓</span>
                  <p className="text-sm">Loyalty program with exclusive access to flash sales and new product launches</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            className="rounded-md"
            onClick={() => {
              // Navigate to the video tab using DOM API to ensure it works
              const urlWithVideoTab = window.location.pathname + "?tab=video";
              window.history.pushState({}, "", urlWithVideoTab);
              
              // Force a reload of the page to ensure the tab changes
              window.location.href = urlWithVideoTab;
            }}
          >
            Watch UniMart in Action <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}