import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";

export function HeroSection() {
  return (
    <section className="hero-section">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80" style={{ backgroundColor: 'rgba(0, 179, 134, 0.1)', borderRadius: '100%', filter: 'blur(40px)' }}></div>
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col gap-6 p-6 md:p-8 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/40 shadow-lg animate-fade-in">
            <div>
              <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
                <span className="text-primary font-medium text-sm">Welcome to UniMart</span>
              </div>
              <h1 className="display-large mb-4">
                Your One-Stop Shop for <span style={{ 
                  backgroundImage: 'linear-gradient(to right, #0B1F3A, #00B386)', 
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  display: 'inline-block'
                }}>Everything</span>
              </h1>
              <p className="body-large text-muted-foreground mb-6">
                Discover thousands of products from trusted vendors. Shop with confidence and enjoy seamless delivery right to your doorstep.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button size="lg" className="btn-large btn-primary rounded-full shadow-lg hover-lift">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="btn-large btn-secondary rounded-full hover-lift">
                  Become a Vendor
                </Button>
              </Link>
            </div>
            
            {/* Category quick links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 animate-slide-up">
              {[
                { name: 'Food', slug: 'food-beverages', icon: '🍲' },
                { name: 'Grocery', slug: 'grocery', icon: '🛒' },
                { name: 'Electronics', slug: 'electronics', icon: '🔌' },
                { name: 'Fashion', slug: 'fashion', icon: '👕' }
              ].map((category, index) => (
                <Link key={category.name} to={`/categories/${category.slug}`}>
                  <div className="group flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-background to-primary/5 hover:bg-primary/10 border border-primary/10 transition-all shadow-sm hover-lift hover:shadow-md" 
                       style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      <span className="font-medium text-sm">{category.name}</span>
                      <ArrowRight className="ml-2 h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="relative flex items-center justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative w-full max-w-[500px] aspect-square rounded-3xl bg-gradient-to-tr from-primary/20 to-amber-500/20 flex items-center justify-center overflow-hidden shadow-xl border border-white/10">
              <div className="absolute inset-4 rounded-2xl bg-background/80 backdrop-blur-sm flex items-center justify-center overflow-hidden border border-white/20">
                <div className="grid grid-cols-2 gap-4 p-4 w-full h-full">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 rounded-xl p-4 flex items-center justify-center shadow-md hover-lift">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40 rounded-xl p-4 flex items-center justify-center shadow-md hover-lift">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m16 8-8 8" />
                      <path d="m8 8 8 8" />
                    </svg>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/40 rounded-xl p-4 flex items-center justify-center shadow-md hover-lift">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40 rounded-xl p-4 flex items-center justify-center shadow-md hover-lift">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
                      <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
                      <rect x="3" y="8" width="18" height="8" rx="1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
