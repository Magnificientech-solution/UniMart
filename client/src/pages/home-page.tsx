import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/components/home/hero-section";
import { CategorySection } from "@/components/home/category-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TestimonialSection } from "@/components/home/testimonial-section";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, TruckIcon, CreditCard, LifeBuoy, BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      
      <section className="py-8 bg-background">
        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2 p-4 border rounded-lg">
            <div className="p-2 bg-primary/10 rounded-full">
              <TruckIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On orders over £50</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-4 border rounded-lg">
            <div className="p-2 bg-primary/10 rounded-full">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">Protected & safe</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-4 border rounded-lg">
            <div className="p-2 bg-primary/10 rounded-full">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">30 day guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-4 border rounded-lg">
            <div className="p-2 bg-primary/10 rounded-full">
              <LifeBuoy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Always available</p>
            </div>
          </div>
        </div>
      </section>

      <CategorySection />
      
      <FeaturedProducts />

      {/* Documentation Link Section */}
      <section className="py-12 bg-primary/5">
        <div className="container px-4 md:px-6 text-center">
          <div className="inline-flex rounded-full bg-primary/10 p-3 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Need Help Getting Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Check out our comprehensive documentation to learn how UniMart works, with detailed guides for both customers and vendors.
          </p>
          <Link href="/documentation">
            <Button size="lg" className="rounded-full">
              View Documentation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Become a Vendor</h2>
              <p className="text-muted-foreground mb-6">
                Join our marketplace as a vendor and reach thousands of potential customers. 
                Set up your own shop, manage your products, and grow your business with our 
                comprehensive tools and support.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/20 p-1">
                    <svg className="h-3 w-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Easy product management</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/20 p-1">
                    <svg className="h-3 w-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Detailed analytics and sales reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/20 p-1">
                    <svg className="h-3 w-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Secure payment processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/20 p-1">
                    <svg className="h-3 w-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Dedicated support for vendors</span>
                </li>
              </ul>
              <Link href="/auth">
                <Button size="lg">
                  Apply to be a Vendor <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative rounded-lg overflow-hidden aspect-square md:aspect-auto md:h-[400px] bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-white/80 backdrop-blur-sm rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex rounded-full bg-primary/10 p-3 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Vendor Dashboard</h3>
                    <p className="text-muted-foreground">Manage your products, track orders, and analyze sales all from one place.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialSection />
    </MainLayout>
  );
}
