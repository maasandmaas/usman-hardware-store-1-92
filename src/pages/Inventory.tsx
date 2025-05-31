
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Package, Plus, Search, Edit, Trash2, AlertTriangle, TrendingUp, ArrowUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { productsApi } from "@/services/api";

const Inventory = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    category: "",
    unit: "",
    minStock: "",
    description: "",
    costPrice: "",
    maxStock: ""
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 100, status: 'active' };
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== 'all') params.category = selectedCategory;

      const response = await productsApi.getAll(params);
      console.log('Products response:', response);
      
      if (response.success) {
        setProducts(response.data.products || response.data || []);
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

  const fetchCategories = async () => {
    try {
      const response = await productsApi.getCategories();
      if (response.success) {
        const categoryList = [
          { value: "all", label: "All Categories" },
          ...response.data.map((cat: string) => ({ value: cat, label: cat }))
        ];
        setCategories(categoryList);
      }
    } catch (error) {
      // Use fallback categories if API fails
      setCategories([
        { value: "all", label: "All Categories" },
        { value: "hinges", label: "Hinges & Hardware" },
        { value: "locks", label: "Locks & Security" },
        { value: "handles", label: "Handles & Knobs" },
        { value: "fasteners", label: "Fasteners & Screws" },
        { value: "sliding", label: "Sliding Systems" },
        { value: "tools", label: "Tools & Equipment" }
      ]);
    }
  };

  const openEditDialog = (product: any) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      sku: product.sku,
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      category: product.category,
      unit: product.unit,
      minStock: product.minStock?.toString() || "",
      description: product.description || "",
      costPrice: product.costPrice?.toString() || "",
      maxStock: product.maxStock?.toString() || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedProduct) return;

    try {
      const updatedProduct = {
        name: editForm.name,
        sku: editForm.sku,
        price: parseFloat(editForm.price),
        stock: parseInt(editForm.stock),
        category: editForm.category,
        unit: editForm.unit,
        minStock: parseInt(editForm.minStock),
        description: editForm.description,
        costPrice: parseFloat(editForm.costPrice),
        maxStock: parseInt(editForm.maxStock)
      };

      const response = await productsApi.update(selectedProduct.id, updatedProduct);
      
      if (response.success) {
        setIsEditDialogOpen(false);
        fetchProducts();
        toast({
          title: "Product Updated",
          description: `${editForm.name} has been updated successfully.`,
        });
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
    }
  };

  const handleAddSubmit = async () => {
    try {
      const newProduct = {
        name: editForm.name,
        sku: editForm.sku,
        price: parseFloat(editForm.price),
        stock: parseInt(editForm.stock),
        category: editForm.category,
        unit: editForm.unit,
        minStock: parseInt(editForm.minStock),
        description: editForm.description,
        costPrice: parseFloat(editForm.costPrice),
        maxStock: parseInt(editForm.maxStock)
      };

      const response = await productsApi.create(newProduct);
      
      if (response.success) {
        setIsAddDialogOpen(false);
        fetchProducts();
        setEditForm({
          name: "",
          sku: "",
          price: "",
          stock: "",
          category: "",
          unit: "",
          minStock: "",
          description: "",
          costPrice: "",
          maxStock: ""
        });
        toast({
          title: "Product Added",
          description: `${editForm.name} has been added successfully.`,
        });
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      const response = await productsApi.delete(productId);
      if (response.success) {
        fetchProducts();
        toast({
          title: "Product Deleted",
          description: "Product has been removed from inventory.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = products.filter(product => product.stock <= product.minStock).length;
  const totalValue = products.reduce((sum, product) => sum + ((product.price || 0) * (product.stock || 0)), 0);

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6 bg-background min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading inventory...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground">Usman Hardware Store - Hafizabad</p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="add-name">Product Name</Label>
                <Input
                  id="add-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-sku">SKU</Label>
                <Input
                  id="add-sku"
                  value={editForm.sku}
                  onChange={(e) => setEditForm({...editForm, sku: e.target.value})}
                  placeholder="Enter SKU"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-price">Price (PKR)</Label>
                <Input
                  id="add-price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  placeholder="Enter price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-costPrice">Cost Price (PKR)</Label>
                <Input
                  id="add-costPrice"
                  type="number"
                  value={editForm.costPrice}
                  onChange={(e) => setEditForm({...editForm, costPrice: e.target.value})}
                  placeholder="Enter cost price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-stock">Stock Quantity</Label>
                <Input
                  id="add-stock"
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                  placeholder="Enter stock quantity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-unit">Unit</Label>
                <Select value={editForm.unit} onValueChange={(value) => setEditForm({...editForm, unit: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="kg">Kilograms</SelectItem>
                    <SelectItem value="meters">Meters</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                    <SelectItem value="sets">Sets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-category">Category</Label>
                <Select value={editForm.category} onValueChange={(value) => setEditForm({...editForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat.value !== "all").map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-minStock">Minimum Stock Level</Label>
                <Input
                  id="add-minStock"
                  type="number"
                  value={editForm.minStock}
                  onChange={(e) => setEditForm({...editForm, minStock: e.target.value})}
                  placeholder="Enter minimum stock level"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="add-description">Description</Label>
                <Input
                  id="add-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  placeholder="Enter product description"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubmit} className="bg-blue-600 hover:bg-blue-700">
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-600 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{products.length}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              Active inventory
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Need reordering
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">PKR {totalValue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Inventory worth
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            <Package className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{categories.length - 1}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Product categories
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Search className="h-5 w-5 text-muted-foreground" />
            Search & Filter Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by product name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by category" />
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

      {/* Products Table */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Package className="h-5 w-5 text-muted-foreground" />
            Products ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">SKU</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.unit}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{product.sku}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-muted-foreground border-border">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">PKR {product.price?.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        product.stock <= product.minStock ? 'text-red-600' : 'text-foreground'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={product.stock > product.minStock ? "default" : "destructive"}
                        className={product.stock > product.minStock 
                          ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100" 
                          : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100"
                        }
                      >
                        {product.stock > product.minStock ? "In Stock" : "Low Stock"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(product)}
                          className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sku">SKU</Label>
              <Input
                id="edit-sku"
                value={editForm.sku}
                onChange={(e) => setEditForm({...editForm, sku: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (PKR)</Label>
              <Input
                id="edit-price"
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm({...editForm, price: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-costPrice">Cost Price (PKR)</Label>
              <Input
                id="edit-costPrice"
                type="number"
                value={editForm.costPrice}
                onChange={(e) => setEditForm({...editForm, costPrice: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-stock">Stock Quantity</Label>
              <Input
                id="edit-stock"
                type="number"
                value={editForm.stock}
                onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-unit">Unit</Label>
              <Select value={editForm.unit} onValueChange={(value) => setEditForm({...editForm, unit: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pieces">Pieces</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="meters">Meters</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="sets">Sets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={editForm.category} onValueChange={(value) => setEditForm({...editForm, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(cat => cat.value !== "all").map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-minStock">Minimum Stock Level</Label>
              <Input
                id="edit-minStock"
                type="number"
                value={editForm.minStock}
                onChange={(e) => setEditForm({...editForm, minStock: e.target.value})}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} className="bg-blue-600 hover:bg-blue-700">
              Update Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
