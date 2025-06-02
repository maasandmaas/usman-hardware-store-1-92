
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, User, Plus, Minus, X, CreditCard, Package } from "lucide-react";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  sku: string;
  unit: string;
}

interface CartPanelProps {
  cart: CartItem[];
  selectedCustomer: any;
  customers: any[];
  paymentMethod: string;
  orderStatus: string;
  onSetSelectedCustomer: (customer: any) => void;
  onSetPaymentMethod: (method: string) => void;
  onSetOrderStatus: (status: string) => void;
  onUpdateCartQuantity: (productId: number, quantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onCheckout: () => void;
  onOpenQuickCustomer: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({
  cart,
  selectedCustomer,
  customers,
  paymentMethod,
  orderStatus,
  onSetSelectedCustomer,
  onSetPaymentMethod,
  onSetOrderStatus,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onCheckout,
  onOpenQuickCustomer
}) => {
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Card className="w-96 h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            Cart
          </div>
          <Badge variant="secondary">{getTotalItems()} items</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Customer Selection */}
        <Card className="bg-muted/30">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Customer</span>
            </div>
            
            {selectedCustomer ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-200">{selectedCustomer.name}</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{selectedCustomer.phone}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSetSelectedCustomer(null)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-3 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium">Walk-in Customer</p>
                </div>
                <div className="flex gap-2">
                  <Select 
                    value="" 
                    onValueChange={(value) => {
                      const customer = customers.find(c => c.id.toString() === value);
                      if (customer) onSetSelectedCustomer(customer);
                    }}
                  >
                    <SelectTrigger className="flex-1 h-8">
                      <span className="text-sm text-muted-foreground">Select customer...</span>
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onOpenQuickCustomer}
                    className="h-8 px-2"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Payment</label>
            <Select value={paymentMethod} onValueChange={onSetPaymentMethod}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <Select value={orderStatus} onValueChange={onSetOrderStatus}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <Card key={item.productId} className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.sku}</p>
                    <p className="text-xs text-blue-600">PKR {item.price.toLocaleString()} / {item.unit}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 flex-shrink-0"
                    onClick={() => onRemoveFromCart(item.productId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-6 w-6 p-0"
                      onClick={() => onUpdateCartQuantity(item.productId, Math.max(0, item.quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-medium min-w-[3rem] text-center">
                      {item.quantity} {item.unit}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-6 w-6 p-0"
                      onClick={() => onUpdateCartQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="font-bold text-green-600 text-sm">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Checkout Section */}
        {cart.length > 0 && (
          <div className="space-y-3 pt-3 border-t">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">PKR {getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-green-600">PKR {getCartTotal().toLocaleString()}</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-medium"
              onClick={onCheckout}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Complete Sale ({paymentMethod})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
