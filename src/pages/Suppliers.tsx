
import { useState, useEffect } from "react";
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Plus, Edit, Trash2, Phone, Mail, MapPin, Package, DollarSign, TrendingUp, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { suppliersApi } from "@/services/api";

const Suppliers = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });

  useEffect(() => {
    fetchSuppliers();
  }, [searchTerm, statusFilter, pagination.currentPage]);

  const fetchSuppliers = async (page = pagination.currentPage) => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 20
      };
      
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await suppliersApi.getAll(params);
      
      if (response.success) {
        const supplierData = response.data?.suppliers || response.data || [];
        console.log('Suppliers response:', response.data);
        
        setSuppliers(Array.isArray(supplierData) ? supplierData : []);
        
        if (response.data?.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
      setSuppliers([]);
      toast({
        title: "Error",
        description: "Failed to load suppliers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async (formData: any) => {
    try {
      const response = await suppliersApi.create(formData);
      if (response.success) {
        setIsAddDialogOpen(false);
        fetchSuppliers(1);
        toast({ 
          title: "Supplier Added", 
          description: "New supplier has been added successfully" 
        });
      }
    } catch (error) {
      console.error('Failed to add supplier:', error);
      toast({
        title: "Error",
        description: "Failed to add supplier",
        variant: "destructive"
      });
    }
  };

  const handleEditSupplier = async (formData: any) => {
    try {
      if (!editingSupplier?.id) return;
      
      const response = await suppliersApi.update(editingSupplier.id, formData);
      if (response.success) {
        setEditingSupplier(null);
        fetchSuppliers();
        toast({ 
          title: "Supplier Updated", 
          description: "Supplier information has been updated" 
        });
      }
    } catch (error) {
      console.error('Failed to update supplier:', error);
      toast({
        title: "Error",
        description: "Failed to update supplier",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSupplier = async (id: number) => {
    try {
      const response = await suppliersApi.delete(id);
      if (response.success) {
        fetchSuppliers();
        toast({ 
          title: "Supplier Deleted", 
          description: "Supplier has been removed from the system" 
        });
      }
    } catch (error) {
      console.error('Failed to delete supplier:', error);
      toast({
        title: "Error",
        description: "Failed to delete supplier",
        variant: "destructive"
      });
    }
  };

  const handleViewSupplier = async (supplier: any) => {
    try {
      const response = await suppliersApi.getById(supplier.id);
      if (response.success) {
        setSelectedSupplier(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch supplier details:', error);
      setSelectedSupplier(supplier);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading suppliers...</div>
        </div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold text-blue-600">{pagination.totalItems}</p>
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
                  Rs. {suppliers.reduce((sum, s) => sum + (s.totalPurchases || 0), 0).toLocaleString()}
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
                  Rs. {suppliers.reduce((sum, s) => sum + (s.pendingPayments || 0), 0).toLocaleString()}
                </p>
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
                placeholder="Search suppliers by name, contact, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
              {suppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-muted-foreground">No suppliers found</div>
                  </TableCell>
                </TableRow>
              ) : (
                suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-gray-500">Contact: {supplier.contactPerson}</p>
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
                        <p className="text-sm font-medium">Total: Rs. {(supplier.totalPurchases || 0).toLocaleString()}</p>
                        {supplier.pendingPayments > 0 && (
                          <p className="text-sm text-red-600">Due: Rs. {supplier.pendingPayments.toLocaleString()}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          Last Order: {supplier.lastOrderDate || 'N/A'}
                        </p>
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
                          onClick={() => handleViewSupplier(supplier)}
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
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                      className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === pagination.currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                      className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
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
    contactPerson: supplier?.contactPerson || "",
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
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            id="contactPerson"
            value={formData.contactPerson}
            onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
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
const SupplierDetails = ({ supplier }: { supplier: any }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="font-semibold mb-3">Contact Information</h3>
        <div className="space-y-2">
          <p><strong>Company:</strong> {supplier.name}</p>
          <p><strong>Contact Person:</strong> {supplier.contactPerson}</p>
          <p><strong>Phone:</strong> {supplier.phone}</p>
          <p><strong>Email:</strong> {supplier.email}</p>
          <p><strong>Address:</strong> {supplier.address}</p>
          <p><strong>City:</strong> {supplier.city}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-3">Financial Summary</h3>
        <div className="space-y-2">
          <p><strong>Total Purchases:</strong> Rs. {(supplier.totalPurchases || 0).toLocaleString()}</p>
          <p><strong>Pending Payments:</strong> Rs. {(supplier.pendingPayments || 0).toLocaleString()}</p>
          <p><strong>Last Order:</strong> {supplier.lastOrderDate || 'N/A'}</p>
          <p><strong>Products Count:</strong> {supplier.productsCount || 0}</p>
          <p><strong>Status:</strong> 
            <Badge className="ml-2" variant={supplier.status === "active" ? "default" : "secondary"}>
              {supplier.status}
            </Badge>
          </p>
        </div>
      </div>
    </div>
    
    {supplier.products && supplier.products.length > 0 && (
      <div>
        <h3 className="font-semibold mb-3">Products Supplied</h3>
        <div className="space-y-2">
          {supplier.products.map((product: any) => (
            <div key={product.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>{product.name} ({product.sku})</span>
              <span className="font-medium">Rs. {product.costPrice}</span>
            </div>
          ))}
        </div>
      </div>
    )}
    
    {supplier.recentOrders && supplier.recentOrders.length > 0 && (
      <div>
        <h3 className="font-semibold mb-3">Recent Orders</h3>
        <div className="space-y-2">
          {supplier.recentOrders.map((order: any) => (
            <div key={order.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{order.orderNumber}</span>
                <span className="text-sm text-gray-500 ml-2">{order.date}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">Rs. {order.amount.toLocaleString()}</div>
                <Badge variant={order.status === "completed" ? "default" : "secondary"} className="text-xs">
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default Suppliers;
