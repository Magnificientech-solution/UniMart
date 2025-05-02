
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HowItWorksSection() {
  return (
    <section className="py-16 bg-white" id="how-it-works">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">How UniMart Works</h2>
          <p className="text-lg text-muted-foreground">
            Learn how to buy, sell, and manage your marketplace experience with our comprehensive guide.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
          <div className="aspect-video bg-gray-900 relative group">
            <video 
              className="w-full h-full"
              controls
              poster="/platform-demo-thumbnail.jpg"
            >
              <source src="/platform-tutorial.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-all">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">For Customers</h3>
            <p className="text-muted-foreground">
              Browse products, create an account, shop securely, and track your orders with ease.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">For Vendors</h3>
            <p className="text-muted-foreground">
              Set up your store, manage products, process orders, and grow your business.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Platform Features</h3>
            <p className="text-muted-foreground">
              Enjoy secure payments, customer support, and a responsive experience across all devices.
            </p>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Customer Journey</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full">✓</span>
                Easy account creation and login
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full">✓</span>
                Browse categories and products
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full">✓</span>
                Simple cart management
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full">✓</span>
                Secure checkout process
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full">✓</span>
                Real-time order tracking
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Vendor Journey</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full">✓</span>
                Quick store registration
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full">✓</span>
                Comprehensive product management
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full">✓</span>
                Streamlined order processing
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full">✓</span>
                Detailed analytics dashboard
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full">✓</span>
                Secure payment handling
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="rounded-full">
            Get Started Now
          </Button>
        </div>
      </div>
    </section>
  );
}
