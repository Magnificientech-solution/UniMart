import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Category } from "@shared/schema";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Filter to get main categories (not subcategories)
  const mainCategories = categories?.filter(category => !category.isSubcategory) || [];

  // Function to get subcategories of a parent category
  const getSubcategories = (parentId: number) => {
    return categories?.filter(category => category.parentId === parentId) || [];
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container px-4 md:px-6 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none"></div>
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
              <span className="text-primary font-medium text-sm">All Categories</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                Explore Our Categories
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse our wide selection of products organized in categories for your convenience
            </p>
          </div>
        </div>
      </section>
      
      <div className="container px-4 md:px-6 pb-16">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Categories</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="grid gap-12">
          {mainCategories.map((category) => {
            const subcategories = getSubcategories(category.id);
            
            return (
              <section key={category.id} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/10 px-3 py-1">
                      {subcategories.length} Subcategories
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{category.name}</h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                  <Link href={`/categories/${category.slug}`}>
                    <Button className="rounded-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-sm">
                      Browse All {category.name}
                      <ShoppingBag className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                {subcategories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {subcategories.map((subcategory) => (
                      <Link key={subcategory.id} href={`/categories/${subcategory.slug}`}>
                        <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-primary/10 group">
                          <div className="relative h-48 overflow-hidden">
                            {subcategory.imageUrl ? (
                              <img 
                                src={subcategory.imageUrl} 
                                alt={subcategory.name} 
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-primary/5 to-indigo-500/5 flex items-center justify-center">
                                <ShoppingBag className="h-12 w-12 text-primary/40" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{subcategory.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{subcategory.description}</p>
                          </CardContent>
                          <CardFooter className="pt-0 pb-4 px-4">
                            <Button variant="ghost" size="sm" className="w-full rounded-full justify-start p-0 text-primary hover:text-primary hover:bg-transparent group-hover:translate-x-1 transition-transform">
                              Shop Now <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-muted/30 p-6 text-center">
                    <p className="text-muted-foreground">No subcategories available</p>
                  </div>
                )}
                
                <div className="border-t border-border/40"></div>
              </section>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}