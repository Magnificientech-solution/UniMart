import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
 } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartContext } from "@/context/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CreditCard, ShoppingCart, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Form schema for checkout
const checkoutSchema = z.object({
  shippingAddress: z.string().min(5, "Address is required"),
  shippingCity: z.string().min(2, "City is required"),
  shippingState: z.string().min(2, "State is required"),
  shippingZipCode: z.string().min(5, "ZIP code is required"),
  shippingCountry: z.string().min(2, "Country is required"),
  paymentMethod: z.enum(["credit_card", "paypal"]),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, cartItemsCount, isLoading: isLoadingCart, clearCart } = useCartContext();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Redirect to cart page if cart is empty
    if (!isLoadingCart && (!cart || !cart.items || cart.items.length === 0)) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items before checkout.",
        variant: "destructive",
      });
      navigate("/cart");
    }
  }, [cart, isLoadingCart, navigate, toast]);

  // Create form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: user?.address || "",
      shippingCity: user?.city || "",
      shippingState: user?.state || "",
      shippingZipCode: user?.zipCode || "",
      shippingCountry: user?.country || "United States",
      paymentMethod: "credit_card",
      notes: "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormValues) => {
      // Calculate subtotal from cart items
      const subtotal = cart?.items.reduce((sum, item) => {
        const price = item.product?.price || 0;
        return sum + price * item.quantity;
      }, 0) || 0;
      
      // Calculate VAT (20%)
      const vat = subtotal * 0.20;
      
      // Calculate shipping (free over £50)
      const shipping = subtotal > 50 ? 0 : 5.99;
      
      // Calculate total with VAT and shipping
      const totalAmount = subtotal + vat + shipping;

      const orderData = {
        ...data,
        subtotal,
        vat,
        shipping,
        totalAmount,
      };

      const res = await apiRequest("POST", "/api/orders", orderData);
      return await res.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Checkout Failed",
        description: error.message || "There was an error processing your order",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    createOrderMutation.mutate(data);
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container px-4 md:px-6 py-8">
          <div className="max-w-md mx-auto text-center py-12">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Sign In to Checkout</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to complete your purchase.
            </p>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isLoadingCart) {
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

  if (isSubmitted) {
    return (
      <MainLayout>
        <div className="container px-4 md:px-6 py-8">
          <div className="max-w-md mx-auto text-center py-12">
            <div className="mb-6 bg-green-100 text-green-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Order Successful!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been placed and will be processed shortly.
              All prices include UK VAT at 20%.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate("/orders")}>
                View Orders
              </Button>
              <Button variant="outline" onClick={() => navigate("/products")}>
                Continue Shopping
              </Button>
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-sm text-muted-foreground mt-2">
              All prices include UK VAT at 20%
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="shippingAddress"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your state" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingZipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your ZIP code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />

                  <div>
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-2 border rounded-md p-3">
                                <RadioGroupItem value="credit_card" id="credit_card" />
                                <FormLabel htmlFor="credit_card" className="flex items-center cursor-pointer">
                                  <CreditCard className="mr-2 h-5 w-5" />
                                  Credit/Debit Card
                                </FormLabel>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-md p-3">
                                <RadioGroupItem value="paypal" id="paypal" />
                                <FormLabel htmlFor="paypal" className="flex items-center cursor-pointer">
                                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.897 8.565c.222-1.425 0-2.43-.761-3.324-.843-.978-2.264-1.39-4.116-1.39H9.69c-.332 0-.634.217-.736.54L6.2 17.094a.45.45 0 0 0 .42.559h3.12l-.22 1.37a.45.45 0 0 0 .42.559h2.939a.73.73 0 0 0 .728-.623l.031-.126.591-3.516.038-.199a.73.73 0 0 1 .728-.623h.46c2.966 0 5.287-1.38 5.963-3.747.283-.975.364-1.79.022-2.496a1.88 1.88 0 0 0-.548-.685l.005-.002z"/>
                                    <path d="M9.81 8.107l.038-.198a.73.73 0 0 1 .728-.623h4.627c.55 0 1.062.102 1.528.274a4.14 4.14 0 0 1 .686.299c.17.092.327.2.468.325.222-1.425 0-2.43-.76-3.324-.844-.978-2.264-1.39-4.117-1.39H6.79c-.332 0-.634.217-.736.54L3.3 16.711a.45.45 0 0 0 .42.559h3.12l.78-4.95 2.19-4.213z"/>
                                  </svg>
                                  PayPal
                                </FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any special instructions for delivery" 
                              className="min-h-24"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/cart")}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Cart
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createOrderMutation.isPending}
                      className="flex-1"
                    >
                      {createOrderMutation.isPending ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            
            <div>
              <CartSummary isCheckoutPage />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
