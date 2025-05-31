
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar, CalendarIcon, CreditCard, DollarSign, Package, Plus, Printer, Search, ShoppingCart, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuickCustomerForm } from "@/components/QuickCustomerForm";
import { salesApi, productsApi, customersApi } from "@/services/api";

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const Sales = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isQuickCustomerOpen, setIsQuickCustomerOpen] = useState(false);
  const [saleForm, setSaleForm] = useState({
    paymentMethod: "cash",
    discount: 0,
    notes: ""
  });
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchSales();
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await salesApi.getAll({
        dateFrom: today,
        dateTo: today,
        limit: 50
      });
      
      if (response.success && response.data.sales) {
        setSales(response.data.sales);
      }
    } catch (error) {
      console.error('Failed to fetch sales:', error);
      toast({
        title: "Error",
        description: "Failed to load sales data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsApi.getAll({ limit: 50, status: 'active' });
      if (response.success && response.data.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customersApi.getAll({ limit: 100, status: 'active' });
      if (response.success && response.data.customers) {
        setCustomers(response.data.customers);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        total: product.price
      }]);
    }

    toast({
      title: "Added to Cart",
      description: `${product.name} added to cart`,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item => 
      item.productId === productId 
        ? { ...item, quantity, total: quantity * item.unitPrice }
        : item
    ));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const discount = saleForm.discount || 0;
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * 0.1; // 10% tax
    return {
      subtotal,
      discount,
      tax,
      total: afterDiscount + tax
    };
  };

  const handleCreateSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to cart",
        variant: "destructive"
      });
      return;
    }

    try {
      const totals = calculateTotal();
      const saleData = {
        customerId: selectedCustomer?.id || null,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        discount: saleForm.discount,
        paymentMethod: saleForm.paymentMethod,
        notes: saleForm.notes
      };

      const response = await salesApi.create(saleData);
      
      if (response.success) {
        toast({
          title: "Sale Created",
          description: "Sale has been created successfully",
        });
        
        // Reset form
        setCart([]);
        setSelectedCustomer(null);
        setSaleForm({ paymentMethod: "cash", discount: 0, notes: "" });
        setIsNewSaleOpen(false);
        
        // Refresh sales data
        fetchSales();
      }
    } catch (error) {
      console.error('Failed to create sale:', error);
      toast({
        title: "Error",
        description: "Failed to create sale",
        variant: "destructive"
      });
    }
  };

  const handleQuickCustomerAdded = (customer: any) => {
    setSelectedCustomer(customer);
    setIsQuickCustomerOpen(false);
    fetchCustomers(); // Refresh customer list
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totals = calculateTotal();

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6 min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading sales...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 min-h-screen bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sales Management</h1>
            <p className="text-muted-foreground">Process sales and manage transactions</p>
          </div>
        </div>
        <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Create New Sale</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
              {/* Products Section */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => addToCart(product)}>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm text-foreground">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                        <p className="text-lg font-bold text-green-600">PKR {product.price}</p>
                        <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Cart Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Cart</h3>
                  <Badge variant="secondary">{cart.length} items</Badge>
                </div>

                {/* Customer Selection */}
                <div className="space-y-2">
                  <Label>Customer</Label>
                  <div className="flex gap-2">
                    <Select value={selectedCustomer?.id?.toString() || ""} onValueChange={(value) => {
                      const customer = customers.find(c => c.id.toString() === value);
                      setSelectedCustomer(customer);
                    }}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select customer" />
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
                      size="icon"
                      onClick={() => setIsQuickCustomerOpen(true)}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">PKR {item.unitPrice} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateCartQuantity(item.productId, parseInt(e.target.value) || 0)}
                          className="w-16 h-8 text-center"
                          min="1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Sale Details */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={saleForm.paymentMethod} onValueChange={(value) => setSaleForm({...saleForm, paymentMethod: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="credit">Credit</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="discount">Discount (PKR)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={saleForm.discount}
                      onChange={(e) => setSaleForm({...saleForm, discount: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={saleForm.notes}
                      onChange={(e) => setSaleForm({...saleForm, notes: e.target.value})}
                      placeholder="Sale notes..."
                    />
                  </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-foreground">PKR {totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="text-foreground">- PKR {totals.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%):</span>
                    <span className="text-foreground">PKR {totals.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">Total:</span>
                    <span className="text-foreground">PKR {totals.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCreateSale} 
                  className="w-full"
                  disabled={cart.length === 0}
                >
                  Complete Sale
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* QuickCustomerForm Modal */}
      <QuickCustomerForm 
        open={isQuickCustomerOpen}
        onOpenChange={setIsQuickCustomerOpen}
        onCustomerCreated={handleQuickCustomerAdded}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Sales</p>
                <p className="text-2xl font-bold text-green-600">
                  PKR {sales.reduce((sum, sale) => sum + (sale.total || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="text-2xl font-bold text-blue-600">{sales.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Items Sold</p>
                <p className="text-2xl font-bold text-purple-600">
                  {sales.reduce((sum, sale) => sum + (sale.items?.length || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg. Order</p>
                <p className="text-2xl font-bold text-orange-600">
                  PKR {sales.length > 0 ? (sales.reduce((sum, sale) => sum + (sale.total || 0), 0) / sales.length).toFixed(0) : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales List */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No sales found for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium text-foreground">{sale.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.customerName || 'Walk-in Customer'} • {sale.time}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sale.items?.length || 0} items • {sale.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={sale.status === 'completed' ? 'default' : 'secondary'}>
                      {sale.status}
                    </Badge>
                    <div className="text-right">
                      <p className="font-bold text-green-600">PKR {sale.total?.toLocaleString()}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
