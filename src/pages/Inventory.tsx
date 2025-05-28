
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Plus, Minus, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { products as initialProducts } from "@/data/storeData";

const Inventory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [stockAction, setStockAction] = useState("in");
  const [inventory, setInventory] = useState(initialProducts);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockUpdate = (formData) => {
    const quantity = parseInt(formData.quantity);
    const updatedInventory = inventory.map(item => {
      if (item.id === selectedProduct.id) {
        const newStock = stockAction === "in" 
          ? item.stock + quantity 
          : item.stock - quantity;
        
        return {
          ...item,
          stock: Math.max(0, newStock),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });

    setInventory(updatedInventory);
    setIsStockDialogOpen(false);
    setSelectedProduct(null);
    
    toast({
      title: "Stock Updated Successfully",
      description: `${quantity} ${selectedProduct.unit} ${stockAction === "in" ? "added to" : "removed from"} ${selectedProduct.name}`,
    });
  };

  const openStockDialog = (product, action) => {
    setSelectedProduct(product);
    setStockAction(action);
    setIsStockDialogOpen(true);
  };

  const getStockStatus = (current, min) => {
    if (current === 0) return { status: "out", color: "bg-red-500", text: "Out of Stock", textColor: "text-red-600" };
    if (current <= min) return { status: "low", color: "bg-orange-500", text: "Low Stock", textColor: "text-orange-600" };
    return { status: "good", color: "bg-green-500", text: "In Stock", textColor: "text-green-600" };
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'hardware': return '🔧';
      case 'electrical': return '⚡';
      case 'plumbing': return '🚿';
      case 'tools': return '🔨';
      case 'paints': return '🎨';
      case 'building_materials': return '🏗️';
      case 'safety': return '🦺';
      case 'automotive': return '🚗';
      default: return '📦';
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:scale-110 transition-transform duration-200" />
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Inventory Management
            </h1>
            <p className="text-gray-600 text-sm md:text-base">Track stock levels and movements across all categories</p>
          </div>
        </div>
      </div>

      {/* Search and Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in animation-delay-300">
        <Card className="md:col-span-2 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by product name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-2 border-purple-200 focus:border-purple-400 transition-colors duration-200"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <p className="text-red-100 text-sm">Low Stock Items</p>
                <p className="text-2xl font-bold">
                  {inventory.filter(item => item.stock <= item.minStock).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-blue-100 text-sm">Total Products</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 animate-fade-in animation-delay-600">
        {Array.from(new Set(inventory.map(item => item.category))).map((category, index) => {
          const categoryCount = inventory.filter(item => item.category === category).length;
          return (
            <Card key={category} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm group">
              <CardContent className="p-3">
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">
                  {getCategoryIcon(category)}
                </div>
                <p className="text-xs text-gray-600 capitalize">{category.replace('_', ' ')}</p>
                <p className="text-lg font-bold text-purple-600">{categoryCount}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Inventory List */}
      <Card className="hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm animate-fade-in animation-delay-900">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-purple-500 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            Stock Overview
            <Badge className="ml-auto bg-purple-500 text-white">{filteredInventory.length} Items</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredInventory.map((item, index) => {
              const stockStatus = getStockStatus(item.stock, item.minStock);
              return (
                <div key={item.id} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {item.name}
                          </h3>
                          <Badge variant="outline" className={`${stockStatus.color} text-white border-0 text-xs`}>
                            {stockStatus.text}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>SKU: <span className="font-mono">{item.id}</span></span>
                          <span className="capitalize">{item.category.replace('_', ' ')}</span>
                          <span>Supplier: {item.supplier}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Current</p>
                      <p className={`text-xl font-bold ${stockStatus.textColor}`}>
                        {item.stock} {item.unit}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Min/Max</p>
                      <p className="text-sm">
                        {item.minStock}/{item.maxStock}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="text-sm font-semibold">
                        Rs. {item.price}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-300 hover:bg-green-50 hover:border-green-400 hover:scale-105 transition-all duration-200"
                        onClick={() => openStockDialog(item, "in")}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 hover:scale-105 transition-all duration-200"
                        onClick={() => openStockDialog(item, "out")}
                        disabled={item.stock === 0}
                      >
                        <Minus className="h-4 w-4 mr-1" />
                        Remove
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
        <DialogContent className="bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-sm font-medium">Quantity ({product?.unit})</Label>
        <Input
          id="quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({...formData, quantity: e.target.value})}
          placeholder={`Enter quantity in ${product?.unit}`}
          className="h-12 border-2 border-purple-200 focus:border-purple-400 transition-colors duration-200"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason" className="text-sm font-medium">Reason</Label>
        <Select value={formData.reason} onValueChange={(value) => setFormData({...formData, reason: value})}>
          <SelectTrigger className="h-12 border-2 border-purple-200 focus:border-purple-400">
            <SelectValue placeholder="Select reason" />
          </SelectTrigger>
          <SelectContent>
            {action === "in" ? (
              <>
                <SelectItem value="Purchase">Purchase from Supplier</SelectItem>
                <SelectItem value="Return">Customer Return</SelectItem>
                <SelectItem value="Adjustment">Stock Adjustment</SelectItem>
                <SelectItem value="Transfer">Transfer from Other Store</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="Sale">Sale to Customer</SelectItem>
                <SelectItem value="Damage">Damaged/Lost</SelectItem>
                <SelectItem value="Return">Return to Supplier</SelectItem>
                <SelectItem value="Adjustment">Stock Adjustment</SelectItem>
                <SelectItem value="Transfer">Transfer to Other Store</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference" className="text-sm font-medium">Reference</Label>
        <Input
          id="reference"
          value={formData.reference}
          onChange={(e) => setFormData({...formData, reference: e.target.value})}
          placeholder="Order/Invoice/Bill number"
          className="h-12 border-2 border-purple-200 focus:border-purple-400 transition-colors duration-200"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          className={`flex-1 h-12 ${action === "in" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} transition-all duration-200 hover:scale-105`}
        >
          {action === "in" ? (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </>
          ) : (
            <>
              <Minus className="h-4 w-4 mr-2" />
              Remove Stock
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className="px-6 h-12 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 hover:scale-105"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default Inventory;
