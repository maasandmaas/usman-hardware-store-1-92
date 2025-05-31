
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Package, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { salesApi, customersApi, productsApi } from "@/services/api";
import { QuickCustomerForm } from "@/components/QuickCustomerForm";
import { ProductCard } from "@/components/sales/ProductCard";
import { CartSidebar } from "@/components/sales/CartSidebar";
import { TodaysOrdersModal } from "@/components/sales/TodaysOrdersModal";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  sku: string;
  unit: string;
}

const Sales = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isQuickCustomerOpen, setIsQuickCustomerOpen] = useState(false);
  const [isTodaysOrdersOpen, setIsTodaysOrdersOpen] = useState(false);
  const [todaysOrders, setTodaysOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinnedProducts, setPinnedProducts] = useState<number[]>([]);
  const [orderStatus, setOrderStatus] = useState("completed");
  const [quantityInputs, setQuantityInputs] = useState<{[key: number]: string}>({});

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchTodaysOrders();
    // Load pinned products from localStorage
    const saved = localStorage.getItem('pinnedProducts');
    if (saved) {
      setPinnedProducts(JSON.parse(saved));
    }
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getAll({ limit: 100 });
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
      const response = await customersApi.getAll({ limit: 100 });
      if (response.success) {
        setCustomers(response.data.customers || []);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const fetchTodaysOrders = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const response = await salesApi.getAll({ 
        dateFrom: today,
        dateTo: today,
        limit: 50
      });
      if (response.success) {
        setTodaysOrders(response.data.sales || []);
      }
    } catch (error) {
      console.error('Failed to fetch today\'s orders:', error);
    }
  };

  const togglePinProduct = (productId: number) => {
    const newPinned = pinnedProducts.includes(productId)
      ? pinnedProducts.filter(id => id !== productId)
      : [...pinnedProducts, productId];
    
    setPinnedProducts(newPinned);
    localStorage.setItem('pinnedProducts', JSON.stringify(newPinned));
    
    toast({
      title: pinnedProducts.includes(productId) ? "Product Unpinned" : "Product Pinned",
      description: `Product ${pinnedProducts.includes(productId) ? 'removed from' : 'added to'} pinned items`,
    });
  };

  const addToCartWithCustomQuantity = (product: any, customQuantity?: number) => {
    const quantity = customQuantity || 1;
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        sku: product.sku,
        unit: product.unit
      }]);
    }

    // Clear the quantity input for this product
    setQuantityInputs(prev => ({...prev, [product.id]: ""}));

    toast({
      title: "Added to Cart",
      description: `${quantity} ${product.unit} of ${product.name} added to cart`,
    });
  };

  const handleQuantityInputChange = (productId: number, value: string) => {
    // Allow decimal numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setQuantityInputs(prev => ({...prev, [productId]: value}));
    }
  };

  const addCustomQuantityToCart = (product: any) => {
    const inputValue = quantityInputs[product.id];
    const quantity = parseFloat(inputValue);
    
    if (inputValue && !isNaN(quantity) && quantity > 0) {
      addToCartWithCustomQuantity(product, quantity);
    } else {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity",
        variant: "destructive"
      });
    }
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive"
      });
      return;
    }

    try {
      const saleData = {
        customerId: selectedCustomer?.id || null,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price
        })),
        discount: 0,
        paymentMethod: "cash",
        status: orderStatus, // This should now properly use the selected status
        notes: selectedCustomer ? `Sale to ${selectedCustomer.name}` : "Walk-in customer sale"
      };

      console.log('Sending sale data:', saleData); // Debug log to verify status

      const response = await salesApi.create(saleData);
      
      if (response.success) {
        setCart([]);
        setSelectedCustomer(null);
        setQuantityInputs({});
        fetchTodaysOrders();
        toast({
          title: "Sale Completed",
          description: `Order has been processed with status: ${orderStatus}`,
        });
      }
    } catch (error) {
      console.error('Failed to process sale:', error);
      toast({
        title: "Error",
        description: "Failed to process sale",
        variant: "destructive"
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products: pinned first, then by name
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aIsPinned = pinnedProducts.includes(a.id);
    const bIsPinned = pinnedProducts.includes(b.id);
    
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return a.name.localeCompare(b.name);
  });

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6 min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading POS...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main POS Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-background shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <h1 className="text-base font-semibold text-foreground">Sales System (POS)</h1>
                  <p className="text-xs text-muted-foreground">Usman Hardware - Hafizabad</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {cart.length} items
              </span>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsTodaysOrdersOpen(true)}
              >
                Today's Orders
              </Button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="flex-1 p-4 overflow-auto bg-background">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-600" />
                Products
                <Badge variant="outline" className="ml-1 text-xs">{pinnedProducts.length} pinned</Badge>
              </h2>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-background border-input"
              />
            </div>
          </div>

          {/* Enhanced Responsive Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isPinned={pinnedProducts.includes(product.id)}
                quantityInput={quantityInputs[product.id] || ""}
                onTogglePin={togglePinProduct}
                onQuantityChange={handleQuantityInputChange}
                onAddToCart={addToCartWithCustomQuantity}
                onAddCustomQuantity={addCustomQuantityToCart}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        cart={cart}
        selectedCustomer={selectedCustomer}
        customers={customers}
        orderStatus={orderStatus}
        isCustomerDialogOpen={isCustomerDialogOpen}
        isQuickCustomerOpen={isQuickCustomerOpen}
        onSetSelectedCustomer={setSelectedCustomer}
        onSetIsCustomerDialogOpen={setIsCustomerDialogOpen}
        onSetIsQuickCustomerOpen={setIsQuickCustomerOpen}
        onSetOrderStatus={setOrderStatus}
        onUpdateCartQuantity={updateCartQuantity}
        onRemoveFromCart={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Today's Orders Modal */}
      <TodaysOrdersModal
        open={isTodaysOrdersOpen}
        onOpenChange={setIsTodaysOrdersOpen}
        orders={todaysOrders}
      />

      {/* Quick Customer Form */}
      <QuickCustomerForm
        open={isQuickCustomerOpen}
        onOpenChange={setIsQuickCustomerOpen}
        onCustomerCreated={(customer) => {
          setCustomers([...customers, customer]);
          setSelectedCustomer(customer);
        }}
      />
    </div>
  );
};

export default Sales;
