
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, Search, User, CreditCard, FileText, Pin, PinOff, Store, BarChart, UserPlus, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuickCustomerForm } from "@/components/QuickCustomerForm";
import { productsApi, customersApi, salesApi } from "@/services/api";

// Payment methods
const paymentMethods = [
  { value: "cash", label: "Cash Payment" },
  { value: "credit", label: "Credit Sale" },
  { value: "pending", label: "Send to Pending" }
];

const Sales = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orders, setOrders] = useState<any[]>([]);
  const [pinnedProducts, setPinnedProducts] = useState<number[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [quickCustomerFormOpen, setQuickCustomerFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchTodaysSales();
  }, []);

  useEffect(() => {
    if (productSearch) {
      fetchProducts(productSearch);
    }
  }, [productSearch]);

  const fetchProducts = async (search?: string) => {
    try {
      const params: any = { limit: 50, status: 'active' };
      if (search) params.search = search;

      const response = await productsApi.getAll(params);
      if (response.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customersApi.getAll({ limit: 100, status: 'active' });
      if (response.success) {
        const customerList = response.data.customers || [];
        // Add walk-in customer option
        const walkInCustomer = { 
          id: 0, 
          name: "Walk-in Customer", 
          phone: "N/A", 
          address: "Walk-in", 
          type: "walk-in",
          currentBalance: 0 
        };
        setCustomers([walkInCustomer, ...customerList]);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const fetchTodaysSales = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await salesApi.getAll({ 
        dateFrom: today, 
        dateTo: today,
        limit: 50
      });
      if (response.success) {
        setOrders(response.data.sales || []);
      }
    } catch (error) {
      console.error('Failed to fetch today sales:', error);
    }
  };

  const getFilteredProducts = () => {
    let filtered = products;
    
    if (productSearch) {
      filtered = products.filter(product =>
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.sku.toLowerCase().includes(productSearch.toLowerCase())
      );
    }

    // Separate pinned and unpinned products
    const pinned = filtered.filter(product => pinnedProducts.includes(product.id));
    const unpinned = filtered.filter(product => !pinnedProducts.includes(product.id));

    return [...pinned, ...unpinned];
  };

  const togglePin = (productId: number) => {
    setPinnedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product: any) => {
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

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      const product = products.find(p => p.id === id);
      if (product && newQuantity <= product.stock) {
        setCart(cart.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        ));
      } else {
        toast({
          title: "Out of Stock",
          description: `Only ${product?.stock || 0} units available`,
          variant: "destructive"
        });
      }
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    try {
      const saleData = {
        customerId: selectedCustomer?.id || null,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price
        })),
        paymentMethod: paymentMethod === "pending" ? "credit" : paymentMethod,
        discount: 0,
        notes: paymentMethod === "pending" ? "Order sent to pending" : ""
      };

      const response = await salesApi.create(saleData);
      
      if (response.success) {
        if (paymentMethod === "pending") {
          toast({
            title: "Order Sent to Pending",
            description: `PKR ${calculateTotal().toLocaleString()} order added to pending orders`,
            variant: "default"
          });
        } else {
          toast({
            title: "Order Completed",
            description: `PKR ${calculateTotal().toLocaleString()} order completed successfully`,
          });
        }
        
        // Clear cart and reset
        setCart([]);
        setSelectedCustomer(null);
        setPaymentMethod("cash");
        
        // Refresh today's sales
        fetchTodaysSales();
      }
    } catch (error) {
      console.error('Failed to create sale:', error);
      toast({
        title: "Error",
        description: "Failed to complete order",
        variant: "destructive"
      });
    }
  };

  const handleCustomerCreated = (newCustomer: any) => {
    setCustomers([...customers, newCustomer]);
    setSelectedCustomer(newCustomer);
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case "business": return "bg-purple-100 text-purple-800 border-purple-200";
      case "individual": return "bg-blue-100 text-blue-800 border-blue-200";
      case "walk-in": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );

  const filteredProducts = getFilteredProducts();

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading sales system...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 min-h-screen bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Sales System (POS)</h1>
            <p className="text-muted-foreground text-sm md:text-base">Usman Hardware - Hafizabad</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <Badge variant="outline" className="text-blue-700 border-blue-300 text-sm">
            <ShoppingCart className="h-3 w-3 mr-1" />
            {cart.length} items in cart
          </Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-border text-foreground hover:bg-accent">
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
                  <p className="text-center text-muted-foreground py-8">No orders today</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold">Order ID: {order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            Customer: {order.customerName || "Walk-in Customer"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Time: {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">PKR {order.total?.toLocaleString()}</p>
                          <Badge variant={order.paymentMethod === "cash" ? "default" : "secondary"}>
                            {order.paymentMethod?.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div className="space-y-1">
                        {order.items?.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.productName} x {item.quantity}</span>
                            <span>PKR {item.total?.toLocaleString()}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-3 md:pb-4">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="flex items-center gap-2 text-foreground text-lg md:text-xl">
                  <Store className="h-5 w-5 text-blue-600" />
                  Products
                </CardTitle>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <Pin className="h-3 w-3 mr-1" />
                  {pinnedProducts.length} pinned
                </Badge>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-10 border-border"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[65vh] overflow-y-auto custom-scrollbar">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`flex items-center justify-between p-3 border rounded-lg hover:shadow-sm cursor-pointer transition-all duration-200 relative ${
                      pinnedProducts.includes(product.id) ? 'border-blue-300 bg-blue-50 dark:bg-blue-950' : 'border-border hover:border-accent'
                    }`}
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
                        <PinOff className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Button>
                    
                    {/* Product Info */}
                    <div className="flex-1 pr-20">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-foreground text-sm">{product.name}</h3>
                        <span className="text-lg font-bold text-emerald-600">PKR {product.price?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                          <Badge 
                            variant={product.stock > 10 ? "default" : "destructive"} 
                            className={`text-xs ${
                              product.stock > 10 
                                ? "bg-accent text-accent-foreground border-border" 
                                : "bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-100"
                            }`}
                          >
                            {product.stock} {product.unit}
                          </Badge>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 h-8 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          disabled={product.stock === 0}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="space-y-4 md:space-y-6">
          {/* Customer Selection */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Customer
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuickCustomerFormOpen(true)}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Quick Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search customer by name or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-10 border-border"
                />
              </div>
              
              {customerSearch && (
                <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2 border-border custom-scrollbar">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`p-3 border rounded cursor-pointer transition-colors ${
                        selectedCustomer?.id === customer.id ? "bg-blue-50 border-blue-300 dark:bg-blue-950" : "hover:bg-accent border-border"
                      }`}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setCustomerSearch("");
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-foreground">{customer.name}</p>
                        <Badge variant="outline" className={`text-xs ${getCustomerTypeColor(customer.type || 'individual')}`}>
                          {customer.type === 'business' ? 'Business' : customer.type === 'walk-in' ? 'Walk-in' : 'Individual'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                      {customer.type !== 'walk-in' && customer.address && (
                        <p className="text-xs text-muted-foreground">{customer.address}</p>
                      )}
                      {customer.currentBalance > 0 && (
                        <Badge variant="destructive" className="mt-1">
                          Due: PKR {customer.currentBalance?.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedCustomer && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-blue-900 dark:text-blue-100">{selectedCustomer.name}</p>
                    <Badge variant="outline" className={`text-xs ${getCustomerTypeColor(selectedCustomer.type || 'individual')}`}>
                      {selectedCustomer.type === 'business' ? 'Business' : selectedCustomer.type === 'walk-in' ? 'Walk-in' : 'Individual'}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{selectedCustomer.phone}</p>
                  {selectedCustomer.type !== 'walk-in' && selectedCustomer.address && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">{selectedCustomer.address}</p>
                  )}
                  {selectedCustomer.currentBalance > 0 && (
                    <Badge variant="destructive" className="mt-1">
                      Previous Due: PKR {selectedCustomer.currentBalance?.toLocaleString()}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shopping Cart */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                Cart ({cart.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-accent/50 rounded border border-border">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">PKR {item.price} per {item.unit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0 border-border"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-foreground">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0 border-border"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 h-8 w-8 p-0 border-red-300 hover:bg-red-50 dark:hover:bg-red-950"
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
                    <div className="flex justify-between text-muted-foreground">
                      <span>Total Amount:</span>
                      <span>PKR {calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-foreground">
                      <span>Total:</span>
                      <span>PKR {calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-foreground">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            <div className="flex items-center gap-2">
                              {method.value === "pending" && <Clock className="h-4 w-4" />}
                              {method.value === "cash" && <CreditCard className="h-4 w-4" />}
                              {method.value === "credit" && <FileText className="h-4 w-4" />}
                              {method.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {paymentMethod === "credit" && !selectedCustomer && (
                      <p className="text-sm text-red-600">Please select a customer for credit sale</p>
                    )}

                    <Button
                      className={`w-full text-white ${
                        paymentMethod === "pending" 
                          ? "bg-yellow-600 hover:bg-yellow-700" 
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                      onClick={handleCheckout}
                      disabled={cart.length === 0 || (paymentMethod === "credit" && !selectedCustomer)}
                    >
                      {paymentMethod === "pending" ? (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          Send to Pending - PKR {calculateTotal().toLocaleString()}
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Complete Order - PKR {calculateTotal().toLocaleString()}
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <QuickCustomerForm
        open={quickCustomerFormOpen}
        onOpenChange={setQuickCustomerFormOpen}
        onCustomerCreated={handleCustomerCreated}
      />
    </div>
  );
};

export default Sales;
