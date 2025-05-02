import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { Product, Category } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, X } from "lucide-react";

export default function ProductsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get search query from URL
  const initialSearchQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [categorySlug, setCategorySlug] = useState<string | null>(slug || null);
  
  // Filters
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  
  // Get current category title
  const [categoryTitle, setCategoryTitle] = useState<string | null>(null);

  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products", searchQuery, selectedCategories, priceRange, sortBy, categorySlug],
    queryFn: async () => {
      const url = new URL("/api/products", window.location.origin);
      
      // Add search query if it exists
      if (searchQuery) {
        url.searchParams.append("search", searchQuery);
      }
      
      // Add category filter if selected
      if (selectedCategories.length > 0) {
        url.searchParams.append("categoryId", selectedCategories.join(","));
      }
      
      // Add category slug if present
      if (categorySlug) {
        url.searchParams.append("categorySlug", categorySlug);
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      
      let data = await response.json();
      
      // Client-side filtering for price range
      data = data.filter((product: Product) => 
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );
      
      // Client-side sorting
      switch (sortBy) {
        case "price-low-high":
          data.sort((a: Product, b: Product) => a.price - b.price);
          break;
        case "price-high-low":
          data.sort((a: Product, b: Product) => b.price - a.price);
          break;
        case "rating":
          data.sort((a: Product, b: Product) => (b.rating || 0) - (a.rating || 0));
          break;
        default: // "newest"
          data.sort((a: Product, b: Product) => {
            // Handle nullable dates safely
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
      }
      
      return data;
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Effect to load category data when slug is present
  useEffect(() => {
    if (categorySlug && categories) {
      const category = categories.find(cat => cat.slug === categorySlug);
      if (category) {
        setCategoryTitle(category.name);
        setSelectedCategories([category.id]);
      }
    }
  }, [categorySlug, categories]);

  // Update search parameters
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL parameters with the new search term
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    
    setSearchParams(params);
  };

  const handleCategoryChange = (categoryId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const handlePriceChange = (values: [number, number]) => {
    setPriceRange(values);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setSortBy("newest");
  };

  // Calculate max price from products for price range filter
  const maxPrice = products ? 
    Math.max(...products.map(product => product.price), 1000) : 
    1000;

  return (
    <MainLayout>
      <div className="container px-4 md:px-6 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {categoryTitle ? categoryTitle : "Products"}
            </h1>
            {searchQuery && (
              <p className="text-muted-foreground">
                Showing results for "{searchQuery}"
              </p>
            )}
            {categoryTitle && (
              <p className="text-muted-foreground">
                Browse all products in the {categoryTitle} category
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block">
            <ProductFilters
              selectedCategories={selectedCategories}
              priceRange={priceRange}
              maxPrice={maxPrice}
              onCategoryChange={handleCategoryChange}
              onPriceChange={handlePriceChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Filters - Mobile */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-background p-4 md:hidden overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Separator className="mb-4" />
              
              <ProductFilters
                selectedCategories={selectedCategories}
                priceRange={priceRange}
                maxPrice={maxPrice}
                onCategoryChange={handleCategoryChange}
                onPriceChange={handlePriceChange}
                onClearFilters={handleClearFilters}
              />
              
              <div className="mt-6 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowFilters(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}

          {/* Products */}
          <div className="md:col-span-3">
            <ProductGrid
              products={products}
              isLoading={isLoadingProducts}
              emptyMessage={searchQuery ? `No products found for "${searchQuery}"` : "No products found"}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
