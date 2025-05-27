
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, Plus, ArrowUp, ArrowDown, Package, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Inventory = () => {
  const { toast } = useToast();
  const [isStockInOpen, setIsStockInOpen] = useState(false);

  // Mock data
  const [stockMovements, setStockMovements] = useState([
    {
      id: 1,
      productName: "Door Hinges - Heavy Duty",
      sku: "DH001",
      type: "stock_in",
      quantity: 20,
      date: "2024-01-15",
      reference: "PO-001",
      cost: 32,
      notes: "Weekly stock replenishment"
    },
    {
      id: 2,
      productName: "Cabinet Handles - Chrome",
      sku: "CH002",
      type: "sale",
      quantity: -5,
      date: "2024-01-15",
      reference: "SALE-001",
      notes: "Sale to John Hardware Co."
    },
    {
      id: 3,
      productName: "Drawer Slides - 18 inch",
      sku: "DS003",
      type: "adjustment",
      quantity: -2,
      date: "2024-01-14",
      reference: "ADJ-001",
      notes: "Damaged items removed"
    }
  ]);

  const [products] = useState([
    { id: 1, name: "Door Hinges - Heavy Duty", sku: "DH001", stock: 5, minStock: 20, cost: 32 },
    { id: 2, name: "Cabinet Handles - Chrome", sku: "CH002", stock: 8, minStock: 25, cost: 18 },
    { id: 3, name: "Drawer Slides - 18 inch", sku: "DS003", stock: 3, minStock: 15, cost: 65 },
    { id: 4, name: "Wood Screws - 2 inch", sku: "WS004", stock: 50, minStock: 100, cost: 8 }
  ]);

  const lowStockItems = products.filter(product => product.stock <= product.minStock);
  const outOfStockItems = products.filter(product => product.stock === 0);

  const handleStockIn = (formData) => {
    const product = products.find(p => p.id === parseInt(formData.productId));
    if (product) {
      const newMovement = {
        id: stockMovements.length + 1,
        productName: product.name,
        sku: product.sku,
        type: "stock_in",
        quantity: parseInt(formData.quantity),
        date: formData.date,
        reference: formData.reference,
        cost: parseFloat(formData.cost),
        notes: formData.notes
      };
      
      setStockMovements([newMovement, ...stockMovements]);
      setIsStockInOpen(false);
      
      toast({
        title: "Stock Added",
        description: `${formData.quantity} units of ${product.name} added to inventory`,
      });
    }
  };

  const getMovementIcon = (type) => {
    switch (type) {
      case "stock_in":
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case "sale":
        return <ArrowDown className="h-4 w-4 text-blue-500" />;
      case "adjustment":
        return <Package className="h-4 w-4 text-orange-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMovementBadge = (type) => {
    switch (type) {
      case "stock_in":
        return <Badge className="bg-green-100 text-green-800">Stock In</Badge>;
      case "sale":
        return <Badge className="bg-blue-100 text-blue-800">Sale</Badge>;
      case "adjustment":
        return <Badge className="bg-orange-100 text-orange-800">Adjustment</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600">Track stock movements and manage inventory</p>
          </div>
        </div>
        <Dialog open={isStockInOpen} onOpenChange={setIsStockInOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Stock In
            </Button>
          </DialogTrigger>
          <StockInDialog products={products} onSubmit={handleStockIn} onClose={() => setIsStockInOpen(false)} />
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Archive className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-blue-600">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-orange-600">{outOfStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ArrowUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Total Stock Value</p>
                <p className="text-2xl font-bold text-green-600">₹{products.reduce((sum, p) => sum + (p.stock * p.cost), 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="movements" className="space-y-6">
        <TabsList>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
          <TabsTrigger value="valuation">Inventory Valuation</TabsTrigger>
        </TabsList>

        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-blue-500" />
                Recent Stock Movements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      {getMovementIcon(movement.type)}
                      <div>
                        <p className="font-medium text-gray-900">{movement.productName}</p>
                        <p className="text-sm text-gray-500">SKU: {movement.sku}</p>
                        <p className="text-xs text-gray-400">{movement.notes}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        {getMovementBadge(movement.type)}
                        <span className={`font-bold ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{movement.date}</p>
                      <p className="text-xs text-gray-400">Ref: {movement.reference}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="space-y-6">
            {lowStockItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Package className="h-5 w-5" />
                    Low Stock Alerts ({lowStockItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockItems.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-red-600">
                            Current: <span className="font-bold">{product.stock}</span> | 
                            Min: <span className="font-bold">{product.minStock}</span>
                          </p>
                          <Badge variant="destructive">Reorder Now</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {outOfStockItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <Package className="h-5 w-5" />
                    Out of Stock ({outOfStockItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {outOfStockItems.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-red-100 border border-red-300 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                        </div>
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="valuation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-500" />
                Inventory Valuation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Stock: <span className="font-medium">{product.stock} units</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Cost per unit: <span className="font-medium">₹{product.cost}</span>
                      </p>
                      <p className="font-bold text-green-600">
                        Total Value: ₹{(product.stock * product.cost).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Stock In Dialog Component
const StockInDialog = ({ products, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    cost: "",
    date: new Date().toISOString().split('T')[0],
    reference: "",
    notes: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      productId: "", quantity: "", cost: "", 
      date: new Date().toISOString().split('T')[0], 
      reference: "", notes: ""
    });
  };

  const selectedProduct = products.find(p => p.id === parseInt(formData.productId));

  return (
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle>Add Stock</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="productId">Product</Label>
          <Select value={formData.productId} onValueChange={(value) => {
            setFormData({...formData, productId: value});
            const product = products.find(p => p.id === parseInt(value));
            if (product) {
              setFormData(prev => ({...prev, productId: value, cost: product.cost.toString()}));
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name} (Current: {product.stock})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              required
              min="1"
            />
          </div>
          <div>
            <Label htmlFor="cost">Cost per unit (₹)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({...formData, cost: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="reference">Reference (PO/Invoice)</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData({...formData, reference: e.target.value})}
              placeholder="PO-001"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Optional notes"
          />
        </div>

        {selectedProduct && formData.quantity && (
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Summary:</strong> Adding {formData.quantity} units of {selectedProduct.name}
            </p>
            <p className="text-sm text-blue-700">
              New stock level will be: <strong>{selectedProduct.stock + parseInt(formData.quantity || 0)} units</strong>
            </p>
            {formData.cost && (
              <p className="text-sm text-blue-700">
                Total cost: <strong>₹{(parseFloat(formData.cost) * parseInt(formData.quantity || 0)).toLocaleString()}</strong>
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1" disabled={!formData.productId || !formData.quantity}>
            Add Stock
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default Inventory;
