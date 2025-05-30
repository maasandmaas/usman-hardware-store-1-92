
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
import { ShoppingCart, Plus, Minus, Trash2, Search, User, CreditCard, FileText, Pin, PinOff, Store, BarChart3, Calculator, Receipt } from "lucide-react";
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
  const [pinnedProducts, setPinnedProducts] = useState([1, 2]);

  // Filter and sort products: pinned first, then by search
  const getFilteredProducts = () => {
    let filtered = allProducts;
    
    if (productSearch) {
      filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.sku.toLowerCase().includes(productSearch.toLowerCase())
      );
    }

    const pinned = filtered.filter(product => pinnedProducts.includes(product.id));
    const unpinned = filtered.filter(product => !pinnedProducts.includes(product.id));
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
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Point of Sale
                  </h1>
                  <p className="text-slate-600 text-sm">Usman Hardware • Hafizabad</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1 bg-blue-50 border-blue-200 text-blue-700">
                <ShoppingCart className="h-3 w-3 mr-2" />
                {cart.length} Items
              </Badge>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                    <FileText className="h-4 w-4 mr-2" />
                    Today's Sales
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Today's Sales Summary</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Receipt className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No sales recorded today</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-slate-900">#{order.id}</p>
                              <p className="text-sm text-slate-600">
                                {order.customer ? order.customer.name : "Walk-in Customer"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(order.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-emerald-600">
                                PKR {order.total.toLocaleString()}
                              </p>
                              <Badge variant={order.type === "Cash" ? "default" : "secondary"}>
                                {order.type}
                              </Badge>
                            </div>
                          </div>
                          <Separator className="my-3" />
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-slate-700">{item.name} × {item.quantity}</span>
                                <span className="font-medium">PKR {(item.price * item.quantity).toLocaleString()}</span>
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
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Products Section - 3 columns */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Store className="h-4 w-4 text-white" />
                    </div>
                    Product Catalog
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 border-emerald-200 text-emerald-700">
                    <Pin className="h-3 w-3 mr-1" />
                    {pinnedProducts.length} Pinned
                  </Badge>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-10 border-slate-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`group relative bg-white rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                        pinnedProducts.includes(product.id) 
                          ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => addToCart(product)}
                    >
                      {/* Pin Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(product.id);
                        }}
                      >
                        {pinnedProducts.includes(product.id) ? (
                          <Pin className="h-3 w-3 text-blue-600" />
                        ) : (
                          <PinOff className="h-3 w-3 text-slate-400" />
                        )}
                      </Button>

                      <div className="p-3">
                        {/* Product Name */}
                        <h3 className="font-semibold text-sm text-slate-900 mb-2 line-clamp-2 leading-tight">
                          {product.name}
                        </h3>

                        {/* SKU and Stock */}
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs text-slate-500 font-mono">{product.sku}</p>
                          <Badge 
                            variant={product.stock > 10 ? "default" : "destructive"} 
                            className={`text-xs px-2 py-0 ${
                              product.stock > 10 
                                ? "bg-green-100 text-green-700 border-green-200" 
                                : "bg-red-100 text-red-700 border-red-200"
                            }`}
                          >
                            {product.stock}
                          </Badge>
                        </div>

                        {/* Price and Add Button */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-emerald-600">
                              ₨{product.price.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <BarChart3 className="h-3 w-3" />
                              {product.sales}
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1 h-8 text-xs shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart and Customer Section - 1 column */}
          <div className="space-y-6">
            {/* Customer Selection */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search customer..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="pl-10 border-slate-200 bg-white/50"
                  />
                </div>
                
                {customerSearch && (
                  <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-2 border-slate-200 bg-white/50 custom-scrollbar">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedCustomer?.id === customer.id 
                            ? "bg-blue-50 border-blue-300" 
                            : "hover:bg-slate-50 border-slate-200"
                        }`}
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setCustomerSearch("");
                        }}
                      >
                        <p className="font-medium text-slate-900 text-sm">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.phone}</p>
                        {customer.dueAmount > 0 && (
                          <Badge variant="destructive" className="mt-1 text-xs">
                            Due: ₨{customer.dueAmount.toLocaleString()}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {selectedCustomer && (
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <p className="font-semibold text-blue-900 text-sm">{selectedCustomer.name}</p>
                    <p className="text-xs text-blue-700">{selectedCustomer.phone}</p>
                    {selectedCustomer.dueAmount > 0 && (
                      <Badge variant="destructive" className="mt-2 text-xs">
                        Previous Due: ₨{selectedCustomer.dueAmount.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full border-slate-300 hover:bg-slate-50 text-sm"
                  onClick={() => setSelectedCustomer(null)}
                >
                  Walk-in Customer
                </Button>
              </CardContent>
            </Card>

            {/* Shopping Cart */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-white" />
                  </div>
                  Cart ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-sm">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-slate-900 line-clamp-1">{item.name}</p>
                              <p className="text-xs text-slate-500">₨{item.price} each</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0 ml-2"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-7 w-7 p-0 border-slate-300"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-7 w-7 p-0 border-slate-300"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm font-bold text-emerald-600">
                              ₨{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between text-lg">
                        <span className="font-semibold text-slate-900 flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Total:
                        </span>
                        <span className="text-2xl font-bold text-emerald-600">
                          ₨{calculateTotal().toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-slate-700 text-sm font-medium">Payment Method</Label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger className="border-slate-300 bg-white mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">💵 Cash Payment</SelectItem>
                              <SelectItem value="credit">🏪 Credit Sale</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {paymentMethod === "credit" && !selectedCustomer && (
                          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            Please select a customer for credit sale
                          </p>
                        )}

                        <Button
                          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 text-base font-semibold shadow-lg"
                          onClick={handleCheckout}
                          disabled={cart.length === 0 || (paymentMethod === "credit" && !selectedCustomer)}
                        >
                          <CreditCard className="h-5 w-5 mr-2" />
                          Complete Sale • ₨{calculateTotal().toLocaleString()}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
