
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Phone, Mail, MapPin, Package, DollarSign, TrendingUp, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { suppliers as initialSuppliers, Supplier } from "@/data/storeData";

const Suppliers = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSupplier = (formData: any) => {
    const newSupplier: Supplier = {
      id: Date.now(),
      ...formData,
      totalPurchases: 0,
      pendingPayments: 0,
      lastOrderDate: new Date().toISOString().split('T')[0],
      products: []
    };
    setSuppliers([...suppliers, newSupplier]);
    setIsAddDialogOpen(false);
    toast({ title: "Supplier Added", description: "New supplier has been added successfully" });
  };

  const handleEditSupplier = (formData: any) => {
    setSuppliers(suppliers.map(supplier =>
      supplier.id === editingSupplier?.id ? { ...supplier, ...formData } : supplier
    ));
    setEditingSupplier(null);
    toast({ title: "Supplier Updated", description: "Supplier information has been updated" });
  };

  const handleDeleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    toast({ title: "Supplier Deleted", description: "Supplier has been removed from the system" });
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
            <p className="text-gray-600">Manage your suppliers and vendor relationships</p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <SupplierForm onSubmit={handleAddSupplier} onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Total Suppliers</p>
                <p className="text-2xl font-bold text-blue-600">{suppliers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Active Suppliers</p>
                <p className="text-2xl font-bold text-green-600">
                  {suppliers.filter(s => s.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Total Purchases</p>
                <p className="text-2xl font-bold text-orange-600">
                  Rs. {suppliers.reduce((sum, s) => sum + s.totalPurchases, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Pending Payments</p>
                <p className="text-2xl font-bold text-red-600">
                  Rs. {suppliers.reduce((sum, s) => sum + s.pendingPayments, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search suppliers by name, contact, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suppliers List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Info</TableHead>
                <TableHead>Contact Details</TableHead>
                <TableHead>Financial Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <p className="text-sm text-gray-500">Contact: {supplier.contact}</p>
                      <p className="text-xs text-gray-400">{supplier.city}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {supplier.phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {supplier.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">Total: Rs. {supplier.totalPurchases.toLocaleString()}</p>
                      {supplier.pendingPayments > 0 && (
                        <p className="text-sm text-red-600">Due: Rs. {supplier.pendingPayments.toLocaleString()}</p>
                      )}
                      <p className="text-xs text-gray-500">Last Order: {supplier.lastOrderDate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSupplier(supplier)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingSupplier(supplier)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Supplier Dialog */}
      <Dialog open={!!editingSupplier} onOpenChange={() => setEditingSupplier(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          <SupplierForm 
            supplier={editingSupplier}
            onSubmit={handleEditSupplier}
            onClose={() => setEditingSupplier(null)}
          />
        </DialogContent>
      </Dialog>

      {/* View Supplier Dialog */}
      <Dialog open={!!selectedSupplier} onOpenChange={() => setSelectedSupplier(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
          </DialogHeader>
          {selectedSupplier && <SupplierDetails supplier={selectedSupplier} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Supplier Form Component
const SupplierForm = ({ supplier, onSubmit, onClose }: any) => {
  const [formData, setFormData] = useState({
    name: supplier?.name || "",
    contact: supplier?.contact || "",
    phone: supplier?.phone || "",
    email: supplier?.email || "",
    address: supplier?.address || "",
    city: supplier?.city || "",
    status: supplier?.status || "active"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Supplier Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="contact">Contact Person</Label>
          <Input
            id="contact"
            value={formData.contact}
            onChange={(e) => setFormData({...formData, contact: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {supplier ? "Update" : "Add"} Supplier
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// Supplier Details Component
const SupplierDetails = ({ supplier }: { supplier: Supplier }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="font-semibold mb-3">Contact Information</h3>
        <div className="space-y-2">
          <p><strong>Company:</strong> {supplier.name}</p>
          <p><strong>Contact Person:</strong> {supplier.contact}</p>
          <p><strong>Phone:</strong> {supplier.phone}</p>
          <p><strong>Email:</strong> {supplier.email}</p>
          <p><strong>Address:</strong> {supplier.address}</p>
          <p><strong>City:</strong> {supplier.city}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-3">Financial Summary</h3>
        <div className="space-y-2">
          <p><strong>Total Purchases:</strong> Rs. {supplier.totalPurchases.toLocaleString()}</p>
          <p><strong>Pending Payments:</strong> Rs. {supplier.pendingPayments.toLocaleString()}</p>
          <p><strong>Last Order:</strong> {supplier.lastOrderDate}</p>
          <p><strong>Status:</strong> 
            <Badge className="ml-2" variant={supplier.status === "active" ? "default" : "secondary"}>
              {supplier.status}
            </Badge>
          </p>
        </div>
      </div>
    </div>
    
    <div>
      <h3 className="font-semibold mb-3">Products Supplied</h3>
      <p className="text-gray-600">
        This supplier provides {supplier.products.length} different products
      </p>
    </div>
  </div>
);

export default Suppliers;
