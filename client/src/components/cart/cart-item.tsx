import { useState } from "react";
import { Product, CartItem as CartItemType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCartContext } from "@/context/cart-context";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType & { product?: Product };
}

export function CartItem({ item }: CartItemProps) {
  const { updateCartItemQuantity, removeCartItem } = useCartContext();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  if (!item.product) {
    return null;
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) {
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleUpdateQuantity = async () => {
    if (quantity === item.quantity) return;

    setIsUpdating(true);
    try {
      await updateCartItemQuantity(item.productId, quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrement = async () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setIsUpdating(true);
    try {
      await updateCartItemQuantity(item.productId, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrement = async () => {
    if (quantity <= 1) return;
    
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    setIsUpdating(true);
    try {
      await updateCartItemQuantity(item.productId, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeCartItem(item.productId);
    } finally {
      setIsRemoving(false);
    }
  };

  const subtotal = item.product.price * quantity;
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-24 h-24 bg-muted rounded-md overflow-hidden">
            {item.product.images && item.product.images.length > 0 ? (
              <img 
                src={item.product.images[0]} 
                alt={item.product.name}
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <div>
                <Link to={`/products/${item.product.slug}`}>
                  <h3 className="font-medium hover:text-primary cursor-pointer">{item.product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{item.product.description}</p>
                <p className="text-sm font-medium mt-1">{formatCurrency(item.product.price)}</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-r-none"
                    onClick={handleDecrement}
                    disabled={isUpdating || quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    onBlur={handleUpdateQuantity}
                    className="h-8 w-14 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-l-none"
                    onClick={handleIncrement}
                    disabled={isUpdating}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="text-right min-w-[80px]">
                  <p className="font-semibold">{formatCurrency(subtotal)}</p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={handleRemove}
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <span className="h-3 w-3 animate-spin border-2 border-foreground border-t-transparent rounded-full" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
