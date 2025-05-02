import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Package, 
  ShoppingBag, 
  Truck, 
  Shield, 
  HeartHandshake, 
  Users, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin 
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-indigo-500/5 pointer-events-none"></div>
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
              <span className="text-primary font-medium text-sm">About UniMart</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                Your Trusted Marketplace for Quality and Convenience!
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Connecting you with the best local and global vendors, offering a wide range of fresh produce, household essentials, and specialty goods at competitive prices.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/products">
                <Button className="rounded-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-md">
                  Browse Products
                  <ShoppingBag className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5">
                  Explore Categories
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-indigo-500/5">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
                  <span className="text-primary font-medium text-sm">Our Mission</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  Making Everyday Shopping Easy, Affordable, and Reliable
                </h2>
                <p className="text-muted-foreground mb-6">
                  At UniMart, we are committed to connecting you with the best local and global vendors, offering a wide range of fresh produce, household essentials, and specialty goods at competitive prices. Our mission is to make everyday shopping easy, affordable, and reliable through a user-friendly platform that brings the marketplace to your fingertips.
                </p>
                <p className="text-muted-foreground">
                  We believe in supporting local businesses while providing our customers with the highest quality products. Our platform is designed to ensure fast delivery, secure transactions, and a seamless shopping experience.
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-indigo-600/20 mix-blend-overlay"></div>
                <div className="p-8 md:p-12 bg-white/95 dark:bg-black/80 h-full">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <Package className="h-8 w-8 mx-auto text-primary" />
                      <h3 className="font-medium">Quality Products</h3>
                    </div>
                    <div className="space-y-2 text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <Truck className="h-8 w-8 mx-auto text-primary" />
                      <h3 className="font-medium">Fast Delivery</h3>
                    </div>
                    <div className="space-y-2 text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <Shield className="h-8 w-8 mx-auto text-primary" />
                      <h3 className="font-medium">Secure Transactions</h3>
                    </div>
                    <div className="space-y-2 text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <HeartHandshake className="h-8 w-8 mx-auto text-primary" />
                      <h3 className="font-medium">Customer Satisfaction</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
              <span className="text-primary font-medium text-sm">Our Values</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                What Sets UniMart Apart
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our commitment to excellence and customer satisfaction drives everything we do at UniMart.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 p-8 rounded-2xl border border-primary/10 shadow-lg">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Community Focus</h3>
              <p className="text-muted-foreground">
                We support local vendors and businesses, creating a vibrant marketplace that strengthens communities and provides unique offerings.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 p-8 rounded-2xl border border-primary/10 shadow-lg">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Trust & Reliability</h3>
              <p className="text-muted-foreground">
                Every transaction on UniMart is secure, and every product is verified for quality, ensuring you can shop with complete peace of mind.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40 p-8 rounded-2xl border border-primary/10 shadow-lg">
              <HeartHandshake className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Customer-First Approach</h3>
              <p className="text-muted-foreground">
                Your satisfaction is our priority. We continuously improve our platform based on your feedback to deliver the best shopping experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Us */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
                <span className="text-primary font-medium text-sm">Contact Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                  Get in Touch With Our Team
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We're here to help with any questions or concerns you may have about our platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 shadow-lg text-center">
                <Mail className="h-10 w-10 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Email Us</h3>
                <a href="mailto:michael.omotayo@magnificentechsolution.co.uk" className="text-primary hover:underline">
                  michael.omotayo@magnificentechsolution.co.uk
                </a>
              </div>
              
              <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 shadow-lg text-center">
                <Phone className="h-10 w-10 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Call Us</h3>
                <a href="tel:07477573794" className="text-primary hover:underline">
                  07477 573 794
                </a>
              </div>
              
              <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 shadow-lg text-center">
                <MapPin className="h-10 w-10 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Visit Us</h3>
                <p className="text-muted-foreground">
                  Our support team is available
                  <br />Monday - Friday, 9am - 5pm
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-indigo-600/10">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Ready to Experience UniMart?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who enjoy quality products, competitive prices, and exceptional service.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/products">
                <Button className="rounded-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-md">
                  Start Shopping Now
                  <ShoppingBag className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5">
                  Create an Account
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}