import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Category } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

export function CategorySection() {
  const { data: allCategories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const categories = allCategories?.filter(category => !category.isSubcategory);

  // Featured categories that should appear in this specific order
  const featuredCategories = [
    'electronics',
    'fashion',
    'phones-tablets',
    'computing',
    'food-beverages',
    'grocery'
  ];

  // Category images mapping
  const getCategoryImage = (slug: string) => {
    const images = {
      'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80',
      'phones-tablets': 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&auto=format&fit=crop&q=80',
      'computing': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
      'fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80',
      'food-beverages': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
      'grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'
    };
    return images[slug as keyof typeof images] || images.electronics;
  };

  return (
    <section className="relative py-14 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-primary/5 to-transparent"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">Shop by Category</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Browse our wide range of products across various categories to find exactly what you need.
            </p>
          </div>
          <Link to="/categories">
            <Button variant="outline" className="rounded-full gap-1 shadow-sm border-primary/20 hover:bg-primary/5">
              View All Categories <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-6 w-24 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
            {/* Display categories in the specific order defined in featuredCategories */}
            {featuredCategories.map((featuredSlug) => {
              const category = categories?.find(cat => cat.slug === featuredSlug);
              if (!category) return null;
              
              return (
                <Link key={category.id} to={`/categories/${category.slug}`}>
                  <div className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                    <Card className="overflow-hidden border-primary/10 shadow-lg relative">
                      <div className="relative h-48 sm:h-56 overflow-hidden">
                        <img 
                          src={getCategoryImage(category.slug)}
                          alt={category.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = getCategoryImage('electronics'); // Fallback image
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Overlay with text that appears on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-primary/80 backdrop-blur-sm px-4 py-2 rounded-full">
                            <span className="text-white font-medium flex items-center">
                              Browse Now <ArrowRight className="ml-1 h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                        <h3 className="font-semibold text-base md:text-lg text-white backdrop-blur-sm bg-gradient-to-r from-primary/80 to-indigo-600/80 py-2 px-4 rounded-full inline-block shadow-md">
                          {category.name}
                        </h3>
                      </div>
                    </Card>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-14">
        <Link to="/categories">
          <Button className="rounded-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-md">
            Explore All Categories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}