
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
import { ShoppingCart, Plus, Minus, Trash2, Search, User, CreditCard, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Sales = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orders, setOrders] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  // Mock data for Pakistani hardware store
  const products = [
    { id: 1, name: "دروازے کے کنڈے - Heavy Duty", nameEng: "Door Hinges - Heavy Duty", sku: "DH001", price: 450, stock: 15 },
    { id: 2, name: "کابینٹ ہینڈل - Chrome", nameEng: "Cabinet Handles - Chrome", sku: "CH002", price: 250, stock: 28 },
    { id: 3, name: "دراز سلائیڈ - 18 انچ", nameEng: "Drawer Slides - 18 inch", sku: "DS003", price: 850, stock: 12 },
    { id: 4, name: "لکڑی کے پیچ - 2 انچ", nameEng: "Wood Screws - 2 inch", sku: "WS004", price: 120, stock: 150 },
    { id: 5, name: "کابینٹ لاک", nameEng: "Cabinet Lock", sku: "CL005", price: 300, stock: 35 },
    { id: 6, name: "شیلف سپورٹ", nameEng: "Shelf Support", sku: "SS006", price: 80, stock: 60 },
  ];

  const customers = [
    { id: 1, name: "محمد احمد", nameEng: "Muhammad Ahmed", phone: "0300-1234567", address: "Model Town, Lahore", dueAmount: 2340 },
    { id: 2, name: "علی حسن", nameEng: "Ali Hassan", phone: "0321-9876543", address: "Gulberg, Lahore", dueAmount: 1890 },
    { id: 3, name: "فاطمہ خان", nameEng: "Fatima Khan", phone: "0333-5555555", address: "DHA, Karachi", dueAmount: 0 },
    { id: 4, name: "احمد کنسٹرکشن", nameEng: "Ahmed Construction", phone: "0345-1111111", address: "Johar Town, Lahore", dueAmount: 5600 },
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
          title: "اسٹاک ختم",
          description: `صرف ${product.stock} یونٹس دستیاب ہیں`,
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
          title: "اسٹاک ختم",
          description: `صرف ${product.stock} یونٹس دستیاب ہیں`,
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
      type: paymentMethod === "cash" ? "نقد" : "ادھار",
      status: "مکمل"
    };

    setOrders([order, ...orders]);
    console.log("آرڈر مکمل:", order);
    
    // Clear cart and reset
    setCart([]);
    setSelectedCustomer(null);
    setPaymentMethod("cash");
    
    toast({
      title: "آرڈر مکمل",
      description: `₹${calculateTotal().toLocaleString()} کا آرڈر کامیابی سے مکمل ہوا`,
    });
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.nameEng.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">سیلز سسٹم (POS)</h1>
            <p className="text-gray-600">Point of Sale System - فروخت کا نظام</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-green-700 border-green-300">
            {cart.length} اشیاء کارٹ میں
          </Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                آج کے آرڈرز
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>آج کے آرڈرز کی فہرست</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">آج کوئی آرڈر نہیں</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold">آرڈر ID: {order.id}</p>
                          <p className="text-sm text-gray-600">
                            کسٹمر: {order.customer ? order.customer.name : "واک-ان کسٹمر"}
                          </p>
                          <p className="text-sm text-gray-600">
                            وقت: {new Date(order.timestamp).toLocaleString('ur-PK')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">₹{order.total.toLocaleString()}</p>
                          <Badge variant={order.type === "نقد" ? "default" : "secondary"}>
                            {order.type}
                          </Badge>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.nameEng} x {item.quantity}</span>
                            <span>₹{(item.price * item.quantity).toLocaleString()}</span>
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                مصنوعات - Products
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
                      <div>
                        <h3 className="font-medium text-gray-900">{product.nameEng}</h3>
                        <p className="text-sm text-blue-600">{product.name}</p>
                      </div>
                      <Badge variant={product.stock > 10 ? "default" : "destructive"}>
                        {product.stock} باقی
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
                کسٹمر - Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="کسٹمر تلاش کریں..."
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
                      <p className="text-sm text-gray-600">{customer.nameEng}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                      {customer.dueAmount > 0 && (
                        <Badge variant="destructive" className="mt-1">
                          واجب الادا: ₹{customer.dueAmount.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedCustomer && (
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="font-medium text-blue-900">{selectedCustomer.name}</p>
                  <p className="text-sm text-blue-700">{selectedCustomer.nameEng}</p>
                  <p className="text-sm text-blue-700">{selectedCustomer.phone}</p>
                  {selectedCustomer.dueAmount > 0 && (
                    <Badge variant="destructive" className="mt-1">
                      پرانا بقایا: ₹{selectedCustomer.dueAmount.toLocaleString()}
                    </Badge>
                  )}
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedCustomer(null)}
              >
                نقد فروخت (واک-ان کسٹمر)
              </Button>
            </CardContent>
          </Card>

          {/* Shopping Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
                کارٹ ({cart.length} اشیاء)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">کارٹ خالی ہے</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.nameEng}</p>
                          <p className="text-xs text-blue-600">{item.name}</p>
                          <p className="text-xs text-gray-500">₹{item.price} فی یونٹ</p>
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
                      <span>کل رقم:</span>
                      <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>ٹوٹل:</span>
                      <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>ادائیگی کا طریقہ</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">نقد ادائیگی</SelectItem>
                        <SelectItem value="credit">ادھار فروخت</SelectItem>
                      </SelectContent>
                    </Select>

                    {paymentMethod === "credit" && !selectedCustomer && (
                      <p className="text-sm text-red-600">ادھار فروخت کے لیے کسٹمر کا انتخاب کریں</p>
                    )}

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleCheckout}
                      disabled={cart.length === 0 || (paymentMethod === "credit" && !selectedCustomer)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      آرڈر مکمل کریں - ₹{calculateTotal().toLocaleString()}
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
