import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { formatCurrency } from "@/lib/utils";

interface ProductFiltersProps {
  selectedCategories: number[];
  priceRange: [number, number];
  maxPrice: number;
  onCategoryChange: (categoryId: number, isChecked: boolean) => void;
  onPriceChange: (values: [number, number]) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  selectedCategories,
  priceRange,
  maxPrice,
  onCategoryChange,
  onPriceChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [location] = useLocation();
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Update local price range when prop changes
  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  const handlePriceChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    setLocalPriceRange(newRange);
  };

  const applyPriceFilter = () => {
    onPriceChange(localPriceRange);
  };

  // Use the formatCurrency utility function from utils.ts
  const formatPrice = (price: number) => {
    return formatCurrency(price);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearFilters} 
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Clear all filters
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price"]} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {categories?.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => {
                      onCategoryChange(category.id, checked as boolean);
                    }}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 mt-2">
              <Slider
                defaultValue={[0, maxPrice]}
                min={0}
                max={maxPrice}
                step={1}
                value={[localPriceRange[0], localPriceRange[1]]}
                onValueChange={handlePriceChange}
                className="py-4"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">{formatPrice(localPriceRange[0])}</span>
                <span className="text-sm">{formatPrice(localPriceRange[1])}</span>
              </div>
              <Button size="sm" className="w-full mt-4" onClick={applyPriceFilter}>
                Apply Price Filter
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger className="text-sm font-medium">Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox id={`rating-${rating}`} />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="text-sm font-normal cursor-pointer flex items-center"
                  >
                    {Array(rating)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    {Array(5 - rating)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-gray-300 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    <span className="ml-1">& Up</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm font-medium">Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="in-stock" />
                <Label
                  htmlFor="in-stock"
                  className="text-sm font-normal cursor-pointer"
                >
                  In Stock
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="out-of-stock" />
                <Label
                  htmlFor="out-of-stock"
                  className="text-sm font-normal cursor-pointer"
                >
                  Out of Stock
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
