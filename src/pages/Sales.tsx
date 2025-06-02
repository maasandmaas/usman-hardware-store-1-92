
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { salesApi, customersApi, productsApi } from "@/services/api";
import { QuickCustomerForm } from "@/components/QuickCustomerForm";
import { TodaysOrdersModal } from "@/components/sales/TodaysOrdersModal";
import { SalesHeader } from "@/components/sales/SalesHeader";
import { ProductGrid } from "@/components/sales/ProductGrid";
import { CartPanel } from "@/components/sales/CartPanel";

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
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isQuickCustomerOpen, setIsQuickCustomerOpen] = useState(false);
  const [isTodaysOrdersOpen, setIsTodaysOrdersOpen] = useState(false);
  const [todaysOrders, setTodaysOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinnedProducts, setPinnedProducts] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orderStatus, setOrderStatus] = useState("completed");
  const [quantityInputs, setQuantityInputs] = useState<{[key: number]: string}>({});

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchTodaysOrders();
    // Load pinned products from localStorage
    const saved = localStorage.getItem('pinnedProducts');
    if (saved) {
      try {
        setPinnedProducts(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing pinned products from localStorage:', error);
        setPinnedProducts([]);
      }
    }
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getAll({ 
        limit: 100,
        status: 'active'
      });
      if (response.success && response.data) {
        const productsData = response.data?.products || response.data || [];
        const validProducts = Array.isArray(productsData) ? productsData : [];
        setProducts(validProducts);
        
        // Extract unique categories from products
        const uniqueCategories = [...new Set(
          validProducts
            .map(product => product.category)
            .filter(category => category && typeof category === 'string')
        )];
        setCategories(uniqueCategories);
      } else {
        setProducts([]);
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
      setCategories([]);
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
        const customersData = response.data?.customers || response.data || [];
        setCustomers(Array.isArray(customersData) ? customersData : []);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setCustomers([]);
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
        const ordersData = response.data?.sales || response.data || [];
        setTodaysOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        setTodaysOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch today\'s orders:', error);
      setTodaysOrders([]);
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
        customerName: selectedCustomer?.name || "Walk-in Customer",
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity
        })),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        discount: 0,
        paymentMethod: paymentMethod,
        status: orderStatus,
        saleDate: new Date().toISOString(),
        notes: selectedCustomer ? `Sale to ${selectedCustomer.name}` : "Walk-in customer sale"
      };

      console.log('Sending sale data:', saleData);

      const response = await salesApi.create(saleData);
      
      if (response.success) {
        setCart([]);
        setSelectedCustomer(null);
        setQuantityInputs({});
        setPaymentMethod("cash");
        fetchTodaysOrders();
        toast({
          title: "Sale Completed Successfully",
          description: `Order has been processed with status: ${orderStatus}. Total: PKR ${saleData.totalAmount.toFixed(2)}`,
        });
      } else {
        throw new Error(response.message || 'Failed to process sale');
      }
    } catch (error) {
      console.error('Failed to process sale:', error);
      toast({
        title: "Sale Failed",
        description: `Error: ${error.message || 'Unknown error occurred'}`,
        variant: "destructive"
      });
    }
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <SalesHeader
          totalCartItems={totalCartItems}
          todaysOrdersCount={todaysOrders.length}
          onOpenTodaysOrders={() => setIsTodaysOrdersOpen(true)}
        />

        {/* Main Content */}
        <div className="flex-1 flex gap-6 p-6 overflow-hidden">
          {/* Products Section */}
          <ProductGrid
            products={products}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            categories={categories}
            pinnedProducts={pinnedProducts}
            quantityInputs={quantityInputs}
            loading={loading}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onTogglePin={togglePinProduct}
            onQuantityChange={handleQuantityInputChange}
            onAddToCart={addToCartWithCustomQuantity}
            onAddCustomQuantity={addCustomQuantityToCart}
          />

          {/* Cart Section */}
          <CartPanel
            cart={cart}
            selectedCustomer={selectedCustomer}
            customers={customers}
            paymentMethod={paymentMethod}
            orderStatus={orderStatus}
            onSetSelectedCustomer={setSelectedCustomer}
            onSetPaymentMethod={setPaymentMethod}
            onSetOrderStatus={setOrderStatus}
            onUpdateCartQuantity={updateCartQuantity}
            onRemoveFromCart={removeFromCart}
            onCheckout={handleCheckout}
            onOpenQuickCustomer={() => setIsQuickCustomerOpen(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <TodaysOrdersModal
        open={isTodaysOrdersOpen}
        onOpenChange={setIsTodaysOrdersOpen}
        orders={todaysOrders}
      />

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
