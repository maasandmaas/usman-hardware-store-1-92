
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
import { ShoppingCart, Plus, Minus, Trash2, Search, User, CreditCard, FileText, Pin, PinOff, Store, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import centralized data
import { products as allProducts, customers, Product } from "@/data/storeData"; 

const Sales = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orders, setOrders] = useState([]);
  const [pinnedProducts, setPinnedProducts] = useState([1, 2]); // Default pinned products

  // Filter and sort products: pinned first, then by search
  const getFilteredProducts = () => {
    let filtered = allProducts;
    
    if (productSearch) {
      filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.sku.toLowerCase().includes(productSearch.toLowerCase())
      );
    }

    // Separate pinned and unpinned products
    const pinned = filtered.filter(product => pinnedProducts.includes(product.id));
    const unpinned = filtered.filter(product => !pinnedProducts.includes(product.id));

    // Sort unpinned by sales (highest first)
    unpinned.sort((a, b) => b.sales - a.sales);

    return [...pinned, ...unpinned];
  };

  const togglePin = (productId) => {
    setPinnedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

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
          title: "Out of Stock",
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
      const product = allProducts.find(p => p.id === id);
      if (newQuantity <= product.stock) {
        setCart(cart.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        ));
      } else {
        toast({
          title: "Out of Stock",
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

  const generateOrderId = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = Date.now().toString().slice(-4);
    return `ORD-${dateStr}-${timeStr}`;
  };

  const handleCheckout = () => {
    const orderId = generateOrderId();
    const order = {
      id: orderId,
      items: cart,
      total: calculateTotal(),
      customer: selectedCustomer,
      paymentMethod,
      timestamp: new Date().toISOString(),
      type: paymentMethod === "cash" ? "Cash" : "Credit",
      status: "Completed"
    };

    setOrders([order, ...orders]);
    console.log("Order completed:", order);
    
    // Clear cart and reset
    setCart([]);
    setSelectedCustomer(null);
    setPaymentMethod("cash");
    
    toast({
      title: "Order Completed",
      description: `PKR ${calculateTotal().toLocaleString()} order completed successfully`,
    });
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );

  const filteredProducts = getFilteredProducts();

  return (
    <div className="flex-1 p-6 space-y-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales System (POS)</h1>
            <p className="text-gray-600">Usman Hardware - Hafizabad</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <Badge variant="outline" className="text-blue-700 border-blue-300 text-sm">
            <ShoppingCart className="h-3 w-3 mr-1" />
            {cart.length} items in cart
          </Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Today's Orders
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Today's Orders List</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No orders today</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold">Order ID: {order.id}</p>
                          <p className="text-sm text-gray-600">
                            Customer: {order.customer ? order.customer.name : "Walk-in Customer"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Time: {new Date(order.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">PKR {order.total.toLocaleString()}</p>
                          <Badge variant={order.type === "Cash" ? "default" : "secondary"}>
                            {order.type}
                          </Badge>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} x {item.quantity}</span>
                            <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-blue-500" />
                  Products
                </CardTitle>
                <Badge variant="outline" className="text-blue-600">
                  <Pin className="h-3 w-3 mr-1" />
                  {pinnedProducts.length} pinned
                </Badge>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[65vh] overflow-y-auto p-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors relative ${
                      pinnedProducts.includes(product.id) ? 'border-blue-300 bg-blue-50' : ''
                    }`}
                    onClick={() => addToCart(product)}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 p-1 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(product.id);
                      }}
                    >
                      {pinnedProducts.includes(product.id) ? (
                        <Pin className="h-3 w-3 text-blue-600" />
                      ) : (
                        <PinOff className="h-3 w-3 text-gray-400" />
                      )}
                    </Button>
                    
                    <div className="flex justify-between items-start mb-2 pr-8">
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <BarChart className="h-3 w-3" />
                          Sales: {product.sales}
                        </div>
                      </div>
                      <Badge variant={product.stock > 10 ? "default" : "destructive"} className="whitespace-nowrap">
                        {product.stock} {product.unit}{product.stock !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold text-green-600">PKR {product.price}</span>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4" />
                        Add
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
                  placeholder="Search customer by name or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {customerSearch && (
                <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2">
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
                      <p className="text-xs text-gray-400">{customer.address}</p>
                      {customer.dueAmount > 0 && (
                        <Badge variant="destructive" className="mt-1">
                          Due: PKR {customer.dueAmount.toLocaleString()}
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
                  <p className="text-xs text-blue-600">{selectedCustomer.address}</p>
                  {selectedCustomer.dueAmount > 0 && (
                    <Badge variant="destructive" className="mt-1">
                      Previous Due: PKR {selectedCustomer.dueAmount.toLocaleString()}
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
                          <p className="text-xs text-gray-500">PKR {item.price} per {item.unit}</p>
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
                      <span>Total Amount:</span>
                      <span>PKR {calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>PKR {calculateTotal().toLocaleString()}</span>
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
                      <p className="text-sm text-red-600">Please select a customer for credit sale</p>
                    )}

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleCheckout}
                      disabled={cart.length === 0 || (paymentMethod === "credit" && !selectedCustomer)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Complete Order - PKR {calculateTotal().toLocaleString()}
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
