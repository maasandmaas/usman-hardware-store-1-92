
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Plus, Minus, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Inventory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [stockAction, setStockAction] = useState("in");

  // Mock inventory data
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "Door Hinges - Heavy Duty",
      sku: "DH001",
      currentStock: 5,
      minStock: 20,
      maxStock: 100,
      lastUpdated: "2024-01-15",
      movements: [
        { date: "2024-01-15", type: "out", quantity: 2, reason: "Sale", reference: "ORD-001" },
        { date: "2024-01-10", type: "in", quantity: 50, reason: "Purchase", reference: "PUR-001" }
      ]
    },
    {
      id: 2,
      name: "Cabinet Handles - Chrome",
      sku: "CH002",
      currentStock: 8,
      minStock: 25,
      maxStock: 100,
      lastUpdated: "2024-01-14",
      movements: [
        { date: "2024-01-14", type: "out", quantity: 5, reason: "Sale", reference: "ORD-002" },
        { date: "2024-01-08", type: "in", quantity: 30, reason: "Purchase", reference: "PUR-002" }
      ]
    }
  ]);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <p className="text-xl font-bold text-red-600">
                  {inventory.filter(item => item.currentStock <= item.minStock).length}
                </p>
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
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
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

export default Inventory;
