
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pin, PinOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: any;
  isPinned: boolean;
  quantityInput: string;
  onTogglePin: (productId: number) => void;
  onQuantityChange: (productId: number, value: string) => void;
  onAddToCart: (product: any, quantity?: number) => void;
  onAddCustomQuantity: (product: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isPinned,
  quantityInput,
  onTogglePin,
  onQuantityChange,
  onAddToCart,
  onAddCustomQuantity
}) => {
  const { toast } = useToast();

  const handleQuantityInputChange = (value: string) => {
    // Allow decimal numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onQuantityChange(product.id, value);
    }
  };

  const handleAddCustomQuantity = () => {
    const quantity = parseFloat(quantityInput);
    
    if (quantityInput && !isNaN(quantity) && quantity > 0) {
      onAddCustomQuantity(product);
    } else {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 h-full ${
      isPinned 
        ? 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20' 
        : 'border-border bg-card'
    } relative`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onTogglePin(product.id)}
        className="absolute top-2 right-2 h-6 w-6 p-0 z-10"
      >
        {isPinned ? 
          <Pin className="h-3 w-3 text-blue-600" /> : 
          <PinOff className="h-3 w-3 text-muted-foreground" />
        }
      </Button>
      
      <CardContent className="p-3 h-full flex flex-col">
        <div className="flex-1 space-y-3">
          {/* Product Info */}
          <div className="space-y-1">
            <h3 className="font-semibold text-card-foreground text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
          </div>
          
          {/* Price and Stock */}
          <div className="space-y-1">
            <div className="text-lg font-bold text-blue-600">
              PKR {product.price.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {product.stock} {product.unit} available
            </div>
          </div>
        </div>

        {/* Actions - Always at bottom */}
        <div className="space-y-2 mt-auto">
          {/* Quantity Input */}
          <div className="flex items-center gap-1">
            <Input
              type="text"
              placeholder={`Qty (${product.unit})`}
              value={quantityInput}
              onChange={(e) => handleQuantityInputChange(e.target.value)}
              className="h-8 text-xs flex-1 bg-background border-input"
              disabled={product.stock <= 0}
            />
            <Button
              onClick={handleAddCustomQuantity}
              className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 text-white flex-shrink-0"
              disabled={product.stock <= 0 || !quantityInput}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Quick Add Button */}
          <Button
            onClick={() => onAddToCart(product, 1)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
            disabled={product.stock <= 0}
          >
            Quick Add (1 {product.unit})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
