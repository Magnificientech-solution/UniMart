import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { ProductCard } from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FeaturedProducts() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  return (
    <section className="relative py-16 md:py-24">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-background to-background"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
              <span className="text-primary font-medium text-sm">Top Picks</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">Featured Products</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover our handpicked selection of trending and popular products from trusted vendors.
            </p>
          </div>
          <Link to="/products">
            <Button variant="outline" className="rounded-full gap-1 shadow-sm border-primary/20 hover:bg-primary/5">
              View All Products <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Featured products spotlight */}
        <div className="mb-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-indigo-500/5 border border-primary/10 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col justify-center">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-1 w-12 bg-primary rounded-full mr-3"></div>
                  <span className="text-primary font-medium">Trending Now</span>
                </div>
                <h3 className="text-2xl font-bold">Products Everyone Loves</h3>
                <p className="text-muted-foreground">
                  Our featured selection is updated regularly to showcase the best our marketplace has to offer. Don't miss these popular items!
                </p>
                <Link to="/products">
                  <Button className="rounded-full mt-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-md">
                    Shop All Products
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Featured product tiles */}
            {!isLoading && products?.slice(0, 2).map((product) => (
              <div key={product.id} className="rounded-xl overflow-hidden shadow-lg border border-primary/10 group hover:shadow-xl transition-all duration-300">
                <Link to={`/products/${product.slug}`}>
                  <ProductCard product={product} />
                </Link>
              </div>
            ))}
            
            {isLoading && Array(2).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-lg border border-primary/10">
                <div className="space-y-3">
                  <Skeleton className="h-60 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-8 w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="space-y-3 rounded-xl overflow-hidden shadow-md border border-border">
                  <Skeleton className="h-60 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-8 w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products?.slice(0, 8).map((product) => (
                <div key={product.id} className="rounded-xl overflow-hidden shadow-md border border-border hover:shadow-lg transition-all duration-300">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* View more button */}
        <div className="flex justify-center mt-14">
          <Link to="/products">
            <Button className="rounded-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-md">
              Explore All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
