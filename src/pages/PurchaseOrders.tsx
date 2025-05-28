
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Eye, FileText, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { purchaseOrders as initialPurchaseOrders, PurchaseOrder } from "@/data/storeData";

const PurchaseOrders = () => {
  const [purchaseOrders] = useState(initialPurchaseOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  const filteredOrders = purchaseOrders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4 text-orange-500" />;
      case "delivered": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      delivered: "default",
      cancelled: "destructive"
    };
    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      pending: "destructive",
      paid: "default",
      partial: "secondary"
    };
    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
            <p className="text-gray-600">Track all your purchase orders and delivery status</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{purchaseOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold text-orange-600">
                  {purchaseOrders.filter(order => order.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Delivered Orders</p>
                <p className="text-2xl font-bold text-green-600">
                  {purchaseOrders.filter(order => order.status === "delivered").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  Rs. {purchaseOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by order ID or supplier name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Details</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-gray-500">Order Date: {order.orderDate}</p>
                      <p className="text-sm text-gray-500">Expected: {order.expectedDelivery}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{order.supplierName}</p>
                    <p className="text-sm text-gray-500">{order.items.length} items</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">Rs. {order.totalAmount.toLocaleString()}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Purchase Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && <OrderDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Order Details Component
const OrderDetails = ({ order }: { order: PurchaseOrder }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="font-semibold mb-3">Order Information</h3>
        <div className="space-y-2">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Supplier:</strong> {order.supplierName}</p>
          <p><strong>Order Date:</strong> {order.orderDate}</p>
          <p><strong>Expected Delivery:</strong> {order.expectedDelivery}</p>
          <p><strong>Notes:</strong> {order.notes}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-3">Status & Payment</h3>
        <div className="space-y-2">
          <p><strong>Order Status:</strong> 
            <Badge className="ml-2" variant={order.status === "delivered" ? "default" : "secondary"}>
              {order.status}
            </Badge>
          </p>
          <p><strong>Payment Status:</strong> 
            <Badge className="ml-2" variant={order.paymentStatus === "paid" ? "default" : "destructive"}>
              {order.paymentStatus}
            </Badge>
          </p>
          <p><strong>Total Amount:</strong> Rs. {order.totalAmount.toLocaleString()}</p>
        </div>
      </div>
    </div>
    
    <div>
      <h3 className="font-semibold mb-3">Order Items</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.productName}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>Rs. {item.unitPrice.toLocaleString()}</TableCell>
              <TableCell>Rs. {item.total.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default PurchaseOrders;
