
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Diverse product categories for Pakistani hardware store
  const [products, setProducts] = useState([
    // Hardware & Fittings
    { id: 1, name: "Door Hinges - Heavy Duty", sku: "DH001", price: 450, stock: 15, category: "hardware", unit: "piece", minStock: 5 },
    { id: 2, name: "Cabinet Handles - Chrome", sku: "CH002", price: 250, stock: 28, category: "hardware", unit: "piece", minStock: 10 },
    { id: 3, name: "Drawer Slides - 18 inch", sku: "DS003", price: 850, stock: 12, category: "hardware", unit: "pair", minStock: 8 },
    { id: 4, name: "Window Latches", sku: "WL008", price: 180, stock: 40, category: "hardware", unit: "piece", minStock: 15 },
    
    // Screws & Fasteners (quantity based)
    { id: 5, name: "Wood Screws - 2 inch", sku: "WS004", price: 120, stock: 150, category: "fasteners", unit: "box", minStock: 20 },
    { id: 6, name: "Machine Bolts - M8", sku: "MB005", price: 8, stock: 500, category: "fasteners", unit: "piece", minStock: 100 },
    { id: 7, name: "Wall Plugs", sku: "WP006", price: 2, stock: 1000, category: "fasteners", unit: "piece", minStock: 200 },
    
    // Oils & Spirits (liquid based)
    { id: 8, name: "Turpentine Oil", sku: "TO007", price: 180, stock: 25, category: "oils", unit: "liter", minStock: 10 },
    { id: 9, name: "White Spirit", sku: "WS009", price: 220, stock: 18, category: "oils", unit: "liter", minStock: 8 },
    { id: 10, name: "Linseed Oil", sku: "LO010", price: 350, stock: 12, category: "oils", unit: "liter", minStock: 5 },
    
    // Paints & Chemicals (kg/liter based)
    { id: 11, name: "White Cement", sku: "WC011", price: 180, stock: 50, category: "cement", unit: "kg", minStock: 20 },
    { id: 12, name: "Wall Putty", sku: "WP012", price: 280, stock: 35, category: "cement", unit: "kg", minStock: 15 },
    { id: 13, name: "Primer Paint", sku: "PP013", price: 420, stock: 22, category: "paints", unit: "liter", minStock: 10 },
    
    // Tools & Equipment
    { id: 14, name: "Hammer - Claw", sku: "HC014", price: 650, stock: 8, category: "tools", unit: "piece", minStock: 3 },
    { id: 15, name: "Measuring Tape", sku: "MT015", price: 380, stock: 15, category: "tools", unit: "piece", minStock: 5 },
    
    // Pipes & Fittings (open boxes/bulk)
    { id: 16, name: "PVC Pipe - 1 inch", sku: "PV016", price: 85, stock: 200, category: "plumbing", unit: "foot", minStock: 50 },
    { id: 17, name: "Elbow Joint - 1 inch", sku: "EJ017", price: 25, stock: 80, category: "plumbing", unit: "piece", minStock: 20 },
  ]);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "hardware", label: "Hardware & Fittings" },
    { value: "fasteners", label: "Screws & Fasteners" },
    { value: "oils", label: "Oils & Spirits" },
    { value: "cement", label: "Cement & Putty" },
    { value: "paints", label: "Paints & Chemicals" },
    { value: "tools", label: "Tools & Equipment" },
    { value: "plumbing", label: "Pipes & Plumbing" },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(product => product.stock <= product.minStock);

  const handleAddProduct = (formData) => {
    const newProduct = {
      id: products.length + 1,
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock)
    };
    setProducts([...products, newProduct]);
    setIsDialogOpen(false);
    toast({
      title: "Product Added",
      description: "New product has been added successfully.",
    });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product Deleted",
      description: "Product has been removed from inventory.",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      hardware: "bg-blue-100 text-blue-800",
      fasteners: "bg-green-100 text-green-800",
      oils: "bg-orange-100 text-orange-800",
      cement: "bg-gray-100 text-gray-800",
      paints: "bg-purple-100 text-purple-800",
      tools: "bg-red-100 text-red-800",
      plumbing: "bg-cyan-100 text-cyan-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex-1 p-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
            <p className="text-gray-600">Manage your inventory and product catalog</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <ProductDialog onSubmit={handleAddProduct} onClose={() => setIsDialogOpen(false)} />
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-blue-600">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">{products.filter(p => p.stock > p.minStock).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-red-600">{lowStockProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-purple-600">{categories.length - 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      </div>
                      <Badge className={`text-xs ${getCategoryColor(product.category)}`}>
                        {categories.find(c => c.value === product.category)?.label.split(' ')[0]}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">PKR {product.price}</span>
                      <span className="text-xs text-gray-500">per {product.unit}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant={product.stock <= product.minStock ? "destructive" : "default"}>
                        {product.stock} {product.unit}s
                      </Badge>
                      {product.stock <= product.minStock && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Product Dialog Component
const ProductDialog = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: "", sku: "", price: "", stock: "", category: "", unit: "", minStock: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", sku: "", price: "", stock: "", category: "", unit: "", minStock: "" });
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add New Product</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Price (PKR)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="minStock">Minimum Stock</Label>
            <Input
              id="minStock"
              type="number"
              value={formData.minStock}
              onChange={(e) => setFormData({...formData, minStock: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hardware">Hardware & Fittings</SelectItem>
                <SelectItem value="fasteners">Screws & Fasteners</SelectItem>
                <SelectItem value="oils">Oils & Spirits</SelectItem>
                <SelectItem value="cement">Cement & Putty</SelectItem>
                <SelectItem value="paints">Paints & Chemicals</SelectItem>
                <SelectItem value="tools">Tools & Equipment</SelectItem>
                <SelectItem value="plumbing">Pipes & Plumbing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="piece">Piece</SelectItem>
                <SelectItem value="pair">Pair</SelectItem>
                <SelectItem value="box">Box</SelectItem>
                <SelectItem value="kg">Kilogram</SelectItem>
                <SelectItem value="liter">Liter</SelectItem>
                <SelectItem value="foot">Foot</SelectItem>
                <SelectItem value="meter">Meter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">Add Product</Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default Products;
