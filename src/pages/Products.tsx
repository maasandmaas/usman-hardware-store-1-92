
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
import { Package, Search, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Mock product data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Door Hinges - Heavy Duty",
      sku: "DH001",
      category: "Hardware",
      price: 45,
      cost: 32,
      stock: 5,
      minStock: 20,
      supplier: "ABC Hardware Co.",
      description: "Heavy duty steel door hinges"
    },
    {
      id: 2,
      name: "Cabinet Handles - Chrome",
      sku: "CH002",
      category: "Furniture Fittings",
      price: 25,
      cost: 18,
      stock: 8,
      minStock: 25,
      supplier: "Chrome Fittings Ltd.",
      description: "Modern chrome cabinet handles"
    },
    {
      id: 3,
      name: "Drawer Slides - 18 inch",
      sku: "DS003",
      category: "Furniture Fittings",
      price: 85,
      cost: 65,
      stock: 3,
      minStock: 15,
      supplier: "Slide Masters",
      description: "Full extension drawer slides"
    },
    {
      id: 4,
      name: "Wood Screws - 2 inch",
      sku: "WS004",
      category: "Fasteners",
      price: 12,
      cost: 8,
      stock: 50,
      minStock: 100,
      supplier: "Fastener World",
      description: "Phillips head wood screws"
    }
  ]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (formData) => {
    const newProduct = {
      id: products.length + 1,
      ...formData,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
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

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Product Deleted",
      description: "Product has been removed from inventory.",
      variant: "destructive"
    });
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <ProductDialog 
            product={editingProduct} 
            onSubmit={handleAddProduct}
            onClose={() => {
              setIsDialogOpen(false);
              setEditingProduct(null);
            }}
          />
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products by name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">{filteredProducts.length} products</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                </div>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Selling Price</p>
                  <p className="font-bold text-green-600">₹{product.price}</p>
                </div>
                <div>
                  <p className="text-gray-500">Cost Price</p>
                  <p className="font-medium">₹{product.cost}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stock Level</span>
                  <span className={product.stock <= product.minStock ? "text-red-600 font-bold" : "text-green-600"}>
                    {product.stock} units
                  </span>
                </div>
                {product.stock <= product.minStock && (
                  <Badge variant="destructive" className="w-full justify-center">
                    Low Stock Alert
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEditProduct(product)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Product Dialog Component
const ProductDialog = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    category: product?.category || "",
    price: product?.price || "",
    cost: product?.cost || "",
    stock: product?.stock || "",
    minStock: product?.minStock || "",
    supplier: product?.supplier || "",
    description: product?.description || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "", sku: "", category: "", price: "", cost: "", stock: "", minStock: "", supplier: "", description: ""
    });
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
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

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hardware">Hardware</SelectItem>
              <SelectItem value="Furniture Fittings">Furniture Fittings</SelectItem>
              <SelectItem value="Fasteners">Fasteners</SelectItem>
              <SelectItem value="Tools">Tools</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cost">Cost Price (₹)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({...formData, cost: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Selling Price (₹)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stock">Current Stock</Label>
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

        <div>
          <Label htmlFor="supplier">Supplier</Label>
          <Input
            id="supplier"
            value={formData.supplier}
            onChange={(e) => setFormData({...formData, supplier: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {product ? "Update Product" : "Add Product"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default Products;
