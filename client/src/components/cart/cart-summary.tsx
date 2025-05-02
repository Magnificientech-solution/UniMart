import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartContext } from "@/context/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { ShoppingBag, LogIn } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CartSummaryProps {
  onCheckout?: () => void;
  isCheckoutPage?: boolean;
}

export function CartSummary({ onCheckout, isCheckoutPage = false }: CartSummaryProps) {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { cart, isLoading } = useCartContext();
  const [isProcessing, setIsProcessing] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="w-24 h-3 bg-muted animate-pulse rounded"></div>
              <div className="w-16 h-3 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="flex justify-between">
              <div className="w-20 h-3 bg-muted animate-pulse rounded"></div>
              <div className="w-12 h-3 bg-muted animate-pulse rounded"></div>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <div className="w-24 h-4 bg-muted animate-pulse rounded"></div>
              <div className="w-16 h-4 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled className="w-full">Loading...</Button>
        </CardFooter>
      </Card>
    );
  }

  const items = cart?.items || [];
  
  // Special case for non-logged in users
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <LogIn className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">Sign In to Checkout</h3>
          <p className="text-muted-foreground mb-4">Sign in to save your cart, track orders, and enjoy a faster checkout.</p>
          <Link to="/auth">
            <Button className="w-full">Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Handle empty cart for logged in users
  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Cart is Empty</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products">
            <Button className="mt-2">Browse Products</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.20; // 20% UK VAT
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    // Free shipping on orders over £50, otherwise £5.99
    return subtotal > 50 ? 0 : 5.99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    
    // If onCheckout is provided, call it, otherwise navigate
    if (onCheckout) {
      onCheckout();
    } else {
      setLocation("/checkout");
    }
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const shipping = calculateShipping();
  const total = calculateTotal();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">VAT (20%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {!isCheckoutPage && (
          <Button 
            onClick={handleCheckout} 
            className="w-full" 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Processing...
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
