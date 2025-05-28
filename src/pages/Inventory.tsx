
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Plus, Minus, TrendingUp, TrendingDown, AlertTriangle, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { products, suppliers } from "@/data/storeData";

const Inventory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [stockAction, setStockAction] = useState("in");

  // Mock inventory data based on products
  const [inventory, setInventory] = useState(
    products.map(product => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      currentStock: product.stock,
      minStock: product.minStock,
      maxStock: product.minStock * 5,
      lastUpdated: "2024-01-15",
      movements: [
        { date: "2024-01-15", type: "out", quantity: 2, reason: "Sale", reference: "ORD-001" },
        { date: "2024-01-10", type: "in", quantity: 50, reason: "Purchase", reference: "PUR-001" }
      ]
    }))
  );

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);

  const handleStockUpdate = (formData) => {
    const quantity = parseInt(formData.quantity);
    const updatedInventory = inventory.map(item => {
      if (item.id === selectedProduct.id) {
        const newStock = stockAction === "in" 
          ? item.currentStock + quantity 
          : item.currentStock - quantity;
        
        const movement = {
          date: new Date().toISOString().split('T')[0],
          type: stockAction,
          quantity: quantity,
          reason: formData.reason,
          reference: formData.reference
        };

        return {
          ...item,
          currentStock: Math.max(0, newStock),
          lastUpdated: movement.date,
          movements: [movement, ...item.movements]
        };
      }
      return item;
    });

    setInventory(updatedInventory);
    setIsStockDialogOpen(false);
    setSelectedProduct(null);
    
    toast({
      title: "Stock Updated",
      description: `Stock ${stockAction === "in" ? "added" : "removed"} successfully`,
    });
  };

  const handleInstantOrder = (product) => {
    setSelectedProduct(product);
    setIsOrderDialogOpen(true);
  };

  const handleCreatePurchaseOrder = (formData) => {
    // In a real app, this would create a purchase order
    toast({
      title: "Purchase Order Created",
      description: `Order for ${formData.quantity} units of ${selectedProduct.name} has been sent to ${formData.supplier}`,
    });
    setIsOrderDialogOpen(false);
    setSelectedProduct(null);
  };

  const openStockDialog = (product, action) => {
    setSelectedProduct(product);
    setStockAction(action);
    setIsStockDialogOpen(true);
  };

  const getStockStatus = (current, min) => {
    if (current === 0) return { status: "out", color: "bg-red-500", text: "Out of Stock" };
    if (current <= min) return { status: "low", color: "bg-orange-500", text: "Low Stock" };
    return { status: "good", color: "bg-green-500", text: "In Stock" };
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600">Track stock levels and movements</p>
          </div>
        </div>
      </div>

      {/* Search and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Low Stock Items</p>
                <p className="text-xl font-bold text-red-600">{lowStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-xl font-bold text-blue-600">{inventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert Section */}
      {lowStockItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alerts ({lowStockItems.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-red-600">Current: {item.currentStock} | Min: {item.minStock}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleInstantOrder(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Order Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInventory.map((item) => {
              const stockStatus = getStockStatus(item.currentStock, item.minStock);
              return (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      </div>
                      <Badge variant="outline" className={`${stockStatus.color} text-white border-0`}>
                        {stockStatus.text}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Current</p>
                      <p className="text-lg font-bold">{item.currentStock}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Min</p>
                      <p className="text-sm">{item.minStock}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Max</p>
                      <p className="text-sm">{item.maxStock}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-300"
                        onClick={() => openStockDialog(item, "in")}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Stock In
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-300"
                        onClick={() => openStockDialog(item, "out")}
                      >
                        <Minus className="h-4 w-4 mr-1" />
                        Stock Out
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stock Movement Dialog */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {stockAction === "in" ? "Add Stock" : "Remove Stock"} - {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          <StockMovementForm 
            product={selectedProduct}
            action={stockAction}
            onSubmit={handleStockUpdate}
            onClose={() => setIsStockDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Instant Order Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Purchase Order - {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <InstantOrderForm 
            product={selectedProduct}
            onSubmit={handleCreatePurchaseOrder}
            onClose={() => setIsOrderDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Stock Movement Form Component
const StockMovementForm = ({ product, action, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    quantity: "",
    reason: "",
    reference: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ quantity: "", reason: "", reference: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({...formData, quantity: e.target.value})}
          placeholder="Enter quantity"
          required
        />
      </div>

      <div>
        <Label htmlFor="reason">Reason</Label>
        <Select value={formData.reason} onValueChange={(value) => setFormData({...formData, reason: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select reason" />
          </SelectTrigger>
          <SelectContent>
            {action === "in" ? (
              <>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Return">Customer Return</SelectItem>
                <SelectItem value="Adjustment">Stock Adjustment</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="Sale">Sale</SelectItem>
                <SelectItem value="Damage">Damaged/Lost</SelectItem>
                <SelectItem value="Return">Return to Supplier</SelectItem>
                <SelectItem value="Adjustment">Stock Adjustment</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="reference">Reference</Label>
        <Input
          id="reference"
          value={formData.reference}
          onChange={(e) => setFormData({...formData, reference: e.target.value})}
          placeholder="Order/Invoice number"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {action === "in" ? "Add Stock" : "Remove Stock"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// Instant Order Form Component
const InstantOrderForm = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    quantity: product?.minStock * 3 || 50,
    supplier: "",
    notes: `Restock order for ${product?.name} - Low stock alert`
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-red-50 rounded border border-red-200">
        <p className="text-sm text-red-700">
          <strong>Low Stock Alert:</strong> Current stock is {product?.currentStock}, minimum required is {product?.minStock}
        </p>
      </div>

      <div>
        <Label htmlFor="quantity">Order Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({...formData, quantity: e.target.value})}
          placeholder="Enter quantity to order"
          required
        />
      </div>

      <div>
        <Label htmlFor="supplier">Select Supplier</Label>
        <Select value={formData.supplier} onValueChange={(value) => setFormData({...formData, supplier: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Choose supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.name}>
                {supplier.name} - {supplier.city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Order notes"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Create Purchase Order
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default Inventory;
