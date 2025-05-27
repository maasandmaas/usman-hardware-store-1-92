
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

  // Mock product data for Pakistani hardware store
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "دروازے کے کنڈے - Heavy Duty",
      nameEng: "Door Hinges - Heavy Duty",
      sku: "DH001",
      category: "دروازے کا سامان",
      categoryEng: "Door Hardware",
      price: 450,
      cost: 320,
      stock: 15,
      minStock: 20,
      supplier: "ABC Hardware Co.",
      description: "Heavy duty steel door hinges - مضبوط اسٹیل کے دروازے کے کنڈے"
    },
    {
      id: 2,
      name: "کابینٹ ہینڈل - Chrome",
      nameEng: "Cabinet Handles - Chrome",
      sku: "CH002",
      category: "فرنیچر فٹنگز",
      categoryEng: "Furniture Fittings",
      price: 250,
      cost: 180,
      stock: 28,
      minStock: 25,
      supplier: "Chrome Fittings Ltd.",
      description: "Modern chrome cabinet handles - جدید کروم کابینٹ ہینڈل"
    },
    {
      id: 3,
      name: "دراز سلائیڈ - 18 انچ",
      nameEng: "Drawer Slides - 18 inch",
      sku: "DS003",
      category: "فرنیچر فٹنگز",
      categoryEng: "Furniture Fittings",
      price: 850,
      cost: 650,
      stock: 12,
      minStock: 15,
      supplier: "Slide Masters",
      description: "Full extension drawer slides - مکمل کھینچنے والے دراز سلائیڈ"
    },
    {
      id: 4,
      name: "لکڑی کے پیچ - 2 انچ",
      nameEng: "Wood Screws - 2 inch",
      sku: "WS004",
      category: "پیچ و کیل",
      categoryEng: "Fasteners",
      price: 120,
      cost: 80,
      stock: 150,
      minStock: 100,
      supplier: "Fastener World",
      description: "Phillips head wood screws - فلپس ہیڈ لکڑی کے پیچ"
    }
  ]);

  const categories = [
    { urdu: "دروازے کا سامان", english: "Door Hardware" },
    { urdu: "فرنیچر فٹنگز", english: "Furniture Fittings" },
    { urdu: "پیچ و کیل", english: "Fasteners" },
    { urdu: "اوزار", english: "Tools" },
    { urdu: "دیگر", english: "Other" }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nameEng.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (formData) => {
    const selectedCategory = categories.find(cat => cat.english === formData.categoryEng);
    const newProduct = {
      id: products.length + 1,
      ...formData,
      category: selectedCategory?.urdu || formData.categoryEng,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock)
    };
    setProducts([...products, newProduct]);
    setIsDialogOpen(false);
    toast({
      title: "پروڈکٹ شامل کر دیا گیا",
      description: "نئی پروڈکٹ کامیابی سے شامل ہو گئی",
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "پروڈکٹ ڈیلیٹ کر دی گئی",
      description: "پروڈکٹ انوینٹری سے ہٹا دی گئی",
      variant: "destructive"
    });
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مصنوعات - Products</h1>
            <p className="text-gray-600">اپنی پروڈکٹ انوینٹری کا انتظام کریں</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              نئی پروڈکٹ شامل کریں
            </Button>
          </DialogTrigger>
          <ProductDialog 
            product={editingProduct} 
            categories={categories}
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
                placeholder="نام، SKU، یا کیٹگری سے تلاش کریں..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">{filteredProducts.length} پروڈکٹس</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{product.nameEng}</CardTitle>
                  <p className="text-sm text-blue-600 font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                </div>
                <Badge variant="secondary">{product.categoryEng}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">فروخت کی قیمت</p>
                  <p className="font-bold text-green-600">₹{product.price}</p>
                </div>
                <div>
                  <p className="text-gray-500">خریداری قیمت</p>
                  <p className="font-medium">₹{product.cost}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>اسٹاک لیول</span>
                  <span className={product.stock <= product.minStock ? "text-red-600 font-bold" : "text-green-600"}>
                    {product.stock} یونٹس
                  </span>
                </div>
                {product.stock <= product.minStock && (
                  <Badge variant="destructive" className="w-full justify-center">
                    کم اسٹاک الرٹ
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
                  ایڈٹ
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
const ProductDialog = ({ product, categories, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    nameEng: product?.nameEng || "",
    sku: product?.sku || "",
    categoryEng: product?.categoryEng || "",
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
      name: "", nameEng: "", sku: "", categoryEng: "", price: "", cost: "", stock: "", minStock: "", supplier: "", description: ""
    });
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{product ? "پروڈکٹ ایڈٹ کریں" : "نئی پروڈکٹ شامل کریں"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="nameEng">Product Name (English)</Label>
            <Input
              id="nameEng"
              value={formData.nameEng}
              onChange={(e) => setFormData({...formData, nameEng: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="name">نام (اردو میں)</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="اردو میں پروڈکٹ کا نام"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="categoryEng">Category</Label>
            <Select value={formData.categoryEng} onValueChange={(value) => setFormData({...formData, categoryEng: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.english} value={category.english}>
                    {category.english} - {category.urdu}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cost">خریداری قیمت (₹)</Label>
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
            <Label htmlFor="price">فروخت قیمت (₹)</Label>
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
            <Label htmlFor="stock">موجودہ اسٹاک</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="minStock">کم سے کم اسٹاک</Label>
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
          <Label htmlFor="supplier">سپلائر</Label>
          <Input
            id="supplier"
            value={formData.supplier}
            onChange={(e) => setFormData({...formData, supplier: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="description">تفصیل</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {product ? "پروڈکٹ اپڈیٹ کریں" : "پروڈکٹ شامل کریں"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            منسوخ
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default Products;
