
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, Search, User, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Sales = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showCheckout, setShowCheckout] = useState(false);

  // Mock data
  const products = [
    { id: 1, name: "Door Hinges - Heavy Duty", sku: "DH001", price: 45, stock: 5 },
    { id: 2, name: "Cabinet Handles - Chrome", sku: "CH002", price: 25, stock: 8 },
    { id: 3, name: "Drawer Slides - 18 inch", sku: "DS003", price: 85, stock: 3 },
    { id: 4, name: "Wood Screws - 2 inch", sku: "WS004", price: 12, stock: 50 },
  ];

  const customers = [
    { id: 1, name: "John Hardware Co.", phone: "9876543210", address: "123 Main St", dueAmount: 2340 },
    { id: 2, name: "ABC Furniture", phone: "9876543211", address: "456 Oak Ave", dueAmount: 1890 },
    { id: 3, name: "XYZ Contractors", phone: "9876543212", address: "789 Pine St", dueAmount: 0 },
  ];

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.stock} units available`,
          variant: "destructive"
        });
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      const product = products.find(p => p.id === id);
      if (newQuantity <= product.stock) {
        setCart(cart.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        ));
      } else {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.stock} units available`,
          variant: "destructive"
        });
      }
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    const sale = {
      id: Date.now(),
      items: cart,
      total: calculateTotal(),
      customer: selectedCustomer,
      paymentMethod,
      timestamp: new Date().toISOString(),
      type: paymentMethod === "cash" ? "cash" : "credit"
    };

    console.log("Processing sale:", sale);
    
    // Clear cart and reset
    setCart([]);
    setSelectedCustomer(null);
    setPaymentMethod("cash");
    setShowCheckout(false);
    
    toast({
      title: "Sale Completed",
      description: `₹${calculateTotal().toLocaleString()} sale processed successfully`,
    });
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales (POS)</h1>
            <p className="text-gray-600">Point of Sale System</p>
          </div>
        </div>
        <Badge variant="outline" className="text-green-700 border-green-300">
          {cart.length} items in cart
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => addToCart(product)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <Badge variant={product.stock > 10 ? "default" : "destructive"}>
                        {product.stock} left
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                      <Button size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="space-y-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customer..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {customerSearch && (
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`p-3 border rounded cursor-pointer transition-colors ${
                        selectedCustomer?.id === customer.id ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setCustomerSearch("");
                      }}
                    >
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                      {customer.dueAmount > 0 && (
                        <Badge variant="destructive" className="mt-1">
                          Due: ₹{customer.dueAmount}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedCustomer && (
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="font-medium text-blue-900">{selectedCustomer.name}</p>
                  <p className="text-sm text-blue-700">{selectedCustomer.phone}</p>
                  {selectedCustomer.dueAmount > 0 && (
                    <Badge variant="destructive" className="mt-1">
                      Outstanding: ₹{selectedCustomer.dueAmount}
                    </Badge>
                  )}
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedCustomer(null)}
              >
                Cash Sale (Walk-in Customer)
              </Button>
            </CardContent>
          </Card>

          {/* Shopping Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
                Cart ({cart.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">₹{item.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash Payment</SelectItem>
                        <SelectItem value="credit">Credit Sale</SelectItem>
                      </SelectContent>
                    </Select>

                    {paymentMethod === "credit" && !selectedCustomer && (
                      <p className="text-sm text-red-600">Please select a customer for credit sales</p>
                    )}

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleCheckout}
                      disabled={cart.length === 0 || (paymentMethod === "credit" && !selectedCustomer)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Complete Sale - ₹{calculateTotal().toLocaleString()}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sales;
