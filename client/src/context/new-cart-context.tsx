import { 
  createContext, 
  ReactNode, 
  useContext, 
  useState, 
  useEffect 
} from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CartItem, Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface CartContextType {
  cart: {
    id: number;
    items: (CartItem & { product?: Product })[];
  } | null;
  cartItemsCount: number;
  isLoading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItemQuantity: (productId: number, quantity: number) => Promise<void>;
  removeCartItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

interface CartProviderProps {
  children: ReactNode;
}

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: CartProviderProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [guestCart, setGuestCart] = useState<{
    id: number;
    items: (CartItem & { product?: Product })[];
  } | null>(null);

  // Initialize guest cart from localStorage on mount
  useEffect(() => {
    if (!user) {
      const storedCart = localStorage.getItem('guestCart');
      if (storedCart) {
        try {
          setGuestCart(JSON.parse(storedCart));
        } catch (error) {
          console.error('Failed to parse guest cart:', error);
          localStorage.removeItem('guestCart');
          setGuestCart({ id: 0, items: [] });
        }
      } else {
        // Initialize an empty guest cart
        setGuestCart({
          id: 0,
          items: []
        });
      }
    }
  }, [user]);

  // Save guest cart to localStorage whenever it changes
  useEffect(() => {
    if (!user && guestCart) {
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
    }
  }, [guestCart, user]);

  const { 
    data: userCart, 
    isLoading: isUserCartLoading, 
    refetch 
  } = useQuery({
    queryKey: ["/api/cart"],
    enabled: !!user, // Only fetch cart if user is logged in
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Determine which cart to use based on user authentication status
  const currentCart = user ? userCart : guestCart;
  const isLoading = user ? isUserCartLoading : false;
  
  // Update cart items count when cart changes
  useEffect(() => {
    if (currentCart?.items) {
      const count = currentCart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
      setCartItemsCount(count);
    } else {
      setCartItemsCount(0);
    }
  }, [currentCart]);

  // Handle adding to cart for guest users
  const addToGuestCart = async (productId: number, quantity: number) => {
    // Fetch product details
    try {
      const response = await fetch(`/api/products/${productId}`);
      const product = await response.json();
      
      setGuestCart(prevCart => {
        if (!prevCart) return { id: 0, items: [] };
        
        // Check if item already exists in cart
        const existingItemIndex = prevCart.items.findIndex(item => item.productId === productId);
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          const updatedItems = [...prevCart.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity
          };
          
          return {
            ...prevCart,
            items: updatedItems
          };
        } else {
          // Add new item if it doesn't exist
          return {
            ...prevCart,
            items: [
              ...prevCart.items,
              {
                id: Math.random(), // Temporary ID for guest cart
                cartId: prevCart.id,
                productId,
                quantity,
                product
              } as CartItem & { product?: Product }
            ]
          };
        }
      });
      
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      await apiRequest("POST", "/api/cart", { productId, quantity });
    },
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  // Handle updating cart items for guest users
  const updateGuestCartItem = async (productId: number, quantity: number) => {
    setGuestCart(prevCart => {
      if (!prevCart) return null;
      
      const existingItemIndex = prevCart.items.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevCart.items];
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          updatedItems.splice(existingItemIndex, 1);
        } else {
          // Update quantity
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity
          };
        }
        
        return {
          ...prevCart,
          items: updatedItems
        };
      }
      
      return prevCart;
    });
    
    toast({
      title: "Cart updated",
      description: "Your cart has been updated",
    });
  };

  const updateCartItemMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      await apiRequest("PUT", `/api/cart/${productId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update cart item",
        variant: "destructive",
      });
    },
  });

  // Handle removing cart items for guest users
  const removeGuestCartItem = async (productId: number) => {
    setGuestCart(prevCart => {
      if (!prevCart) return null;
      
      return {
        ...prevCart,
        items: prevCart.items.filter(item => item.productId !== productId)
      };
    });
    
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };

  const removeCartItemMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest("DELETE", `/api/cart/${productId}`);
    },
    onSuccess: () => {
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
        variant: "destructive",
      });
    },
  });

  // Handle clearing cart for guest users
  const clearGuestCart = async () => {
    setGuestCart({ id: 0, items: [] });
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart",
        variant: "destructive",
      });
    },
  });

  const addToCart = async (productId: number, quantity: number) => {
    if (user) {
      await addToCartMutation.mutateAsync({ productId, quantity });
    } else {
      // For guest users, add to local storage
      await addToGuestCart(productId, quantity);
    }
  };

  const updateCartItemQuantity = async (productId: number, quantity: number) => {
    if (user) {
      await updateCartItemMutation.mutateAsync({ productId, quantity });
    } else {
      await updateGuestCartItem(productId, quantity);
    }
  };

  const removeCartItem = async (productId: number) => {
    if (user) {
      await removeCartItemMutation.mutateAsync(productId);
    } else {
      await removeGuestCartItem(productId);
    }
  };

  const clearCart = async () => {
    if (user) {
      await clearCartMutation.mutateAsync();
    } else {
      await clearGuestCart();
    }
  };

  const refreshCart = async () => {
    if (user) {
      await refetch();
    } else {
      // For guest users, we already have the cart in state
      // Just trigger a re-render by making a copy
      setGuestCart(prev => prev ? {...prev} : null);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart: currentCart || null,
        cartItemsCount,
        isLoading,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}