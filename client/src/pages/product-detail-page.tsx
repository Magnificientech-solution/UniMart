import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Product, Review } from "@shared/schema";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/avatar";
import { ProductCard } from "@/components/products/product-card";
import { Badge } from "@/components/ui/badge";
import { useCartContext } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  Minus, 
  Plus, 
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Fetch product details
  const { 
    data: product, 
    isLoading: isLoadingProduct, 
    error 
  } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
  });
  
  // Fetch product reviews
  const { 
    data: reviews,
    isLoading: isLoadingReviews 
  } = useQuery<Review[]>({
    queryKey: [`/api/products/${product?.id}/reviews`],
    enabled: !!product?.id,
  });
  
  // Fetch related products
  const { 
    data: relatedProducts,
    isLoading: isLoadingRelated 
  } = useQuery<Product[]>({
    queryKey: ["/api/products", product?.categoryId],
    enabled: !!product?.categoryId,
  });

  if (isLoadingProduct) {
    return (
      <MainLayout>
        <div className="container px-4 md:px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg animate-pulse" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="mt-8 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="container px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product.quantity && value > product.quantity) {
      toast({
        title: "Maximum quantity reached",
        description: `Only ${product.quantity} items available in stock`,
        variant: "destructive",
      });
      return;
    }
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;
  
  // Filter out the current product from related products
  const filteredRelatedProducts = relatedProducts?.filter(p => p.id !== product.id).slice(0, 4) || [];

  // Display average rating
  const renderRating = () => {
    const rating = product.rating || 0;
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {product.rating ? product.rating.toFixed(1) : "No ratings yet"}
        </span>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="md:w-1/2">
            {product.images && product.images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            ) : (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">No images available</span>
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {renderRating()}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatCurrency(product.compareAtPrice || 0)}
                    </span>
                    <Badge className="bg-red-500 hover:bg-red-600">
                      {discountPercentage}% OFF
                    </Badge>
                  </>
                )}
              </div>
              
              <p className="text-muted-foreground">{product.description}</p>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Availability:</span>
                {product.quantity && product.quantity > 0 ? (
                  <Badge variant="outline" className="text-green-600 bg-green-50">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> In Stock ({product.quantity} available)
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-600 bg-red-50">
                    Out of Stock
                  </Badge>
                )}
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isAddingToCart}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={isAddingToCart || (product.quantity ? quantity >= product.quantity : false)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !product.quantity || product.quantity <= 0}
                  >
                    {isAddingToCart ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Shipping & Returns */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    Free shipping on orders over £50
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    30-day money-back guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews {reviews?.length ? `(${reviews.length})` : ""}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-2">Product Details</h3>
                <p>{product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              {isLoadingReviews ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : !reviews || reviews.length === 0 ? (
                <div className="text-center py-6">
                  <h3 className="text-lg font-medium">No Reviews Yet</h3>
                  <p className="text-muted-foreground mt-1">Be the first to review this product</p>
                  {user ? (
                    <Button className="mt-4">Write a Review</Button>
                  ) : (
                    <Link href="/auth">
                      <Button variant="outline" className="mt-4">Sign in to Write a Review</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <UserAvatar 
                              user={review.user}
                              className="h-8 w-8" 
                            />
                            <div>
                              <p className="font-medium">{review.user?.firstName} {review.user?.lastName}</p>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star}
                                    className={`h-3 w-3 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                  />
                                ))}
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm">{review.comment}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {user && (
                    <div className="mt-6 text-center">
                      <Button>Write a Review</Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        {(isLoadingRelated || filteredRelatedProducts.length > 0) && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            {isLoadingRelated ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-60 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {filteredRelatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
