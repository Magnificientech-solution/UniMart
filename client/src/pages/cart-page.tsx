import { useEffect } from "react";
import { Link } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/context/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, ShoppingCart, Loader2, LogIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CartPage() {
  const { user } = useAuth();
  const { cart, cartItemsCount, isLoading, refreshCart } = useCartContext();

  // Refresh cart data when page loads
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container px-4 md:px-6 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Empty cart state (either guest or logged in user)
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="container px-4 md:px-6 py-8">
          <div className="flex flex-col">
            <div className="flex flex-col mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <Badge variant="outline" className="text-sm">
                  0 items
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                All prices include UK VAT at 20%
              </p>
            </div>
            
            <div className="max-w-md mx-auto text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-6">
                {user ? "Looks like you haven't added any items to your cart yet." : "Browse our products and add items to your cart."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <Button>
                    Start Shopping
                  </Button>
                </Link>
                {!user && (
                  <Link to="/auth">
                    <Button variant="outline">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }



  return (
    <MainLayout>
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col">
          <div className="flex flex-col mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <Badge variant="outline" className="text-sm">
                {cartItemsCount} {cartItemsCount === 1 ? "item" : "items"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              All prices include UK VAT at 20%
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              
              <div className="mt-6 flex items-center">
                <Link to="/products">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
            
            <div>
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
