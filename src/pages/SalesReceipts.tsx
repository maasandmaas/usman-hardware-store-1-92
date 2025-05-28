
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, FileText, CreditCard, Receipt, DollarSign } from "lucide-react";
import { salesReceipts as initialSalesReceipts, SalesReceipt } from "@/data/storeData";

const SalesReceipts = () => {
  const [salesReceipts] = useState(initialSalesReceipts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<SalesReceipt | null>(null);

  const filteredReceipts = salesReceipts.filter(receipt =>
    receipt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCashSales = salesReceipts
    .filter(r => r.paymentMethod === "cash")
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const totalCreditSales = salesReceipts
    .filter(r => r.paymentMethod === "credit")
    .reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Receipts</h1>
            <p className="text-gray-600">View all sales receipts and transaction history</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Receipt className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Total Receipts</p>
                <p className="text-2xl font-bold text-blue-600">{salesReceipts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Cash Sales</p>
                <p className="text-2xl font-bold text-green-600">Rs. {totalCashSales.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Credit Sales</p>
                <p className="text-2xl font-bold text-orange-600">Rs. {totalCreditSales.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold text-purple-600">
                  Rs. {(totalCashSales + totalCreditSales).toLocaleString()}
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
              placeholder="Search by receipt ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sales Receipts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt Details</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{receipt.id}</p>
                      <p className="text-sm text-gray-500">Date: {receipt.date}</p>
                      <p className="text-sm text-gray-500">Cashier: {receipt.cashier}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{receipt.customerName}</p>
                    {receipt.customerId && (
                      <p className="text-sm text-gray-500">ID: {receipt.customerId}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{receipt.items.length} items</p>
                    <p className="text-xs text-gray-500">
                      {receipt.items.slice(0, 2).map(item => item.productName).join(", ")}
                      {receipt.items.length > 2 && "..."}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">Rs. {receipt.totalAmount.toLocaleString()}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={receipt.paymentMethod === "cash" ? "default" : "secondary"}>
                      {receipt.paymentMethod.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedReceipt(receipt)}
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

      {/* Receipt Details Dialog */}
      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Receipt Details - {selectedReceipt?.id}</DialogTitle>
          </DialogHeader>
          {selectedReceipt && <ReceiptDetails receipt={selectedReceipt} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Receipt Details Component
const ReceiptDetails = ({ receipt }: { receipt: SalesReceipt }) => (
  <div className="space-y-6">
    <div className="text-center border-b pb-4">
      <h2 className="text-xl font-bold">Usman Hardware Store</h2>
      <p className="text-sm text-gray-600">Hafizabad, Punjab, Pakistan</p>
      <p className="text-sm text-gray-600">Receipt: {receipt.id}</p>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="font-semibold mb-2">Customer Information</h3>
        <p><strong>Name:</strong> {receipt.customerName}</p>
        {receipt.customerId && <p><strong>Customer ID:</strong> {receipt.customerId}</p>}
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Transaction Details</h3>
        <p><strong>Date:</strong> {receipt.date}</p>
        <p><strong>Cashier:</strong> {receipt.cashier}</p>
        <p><strong>Payment:</strong> 
          <Badge className="ml-2" variant={receipt.paymentMethod === "cash" ? "default" : "secondary"}>
            {receipt.paymentMethod.toUpperCase()}
          </Badge>
        </p>
      </div>
    </div>
    
    <div>
      <h3 className="font-semibold mb-3">Items Purchased</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipt.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.productName}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>Rs. {item.unitPrice.toLocaleString()}</TableCell>
              <TableCell>Rs. {item.total.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total Amount:</span>
          <span>Rs. {receipt.totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  </div>
);

export default SalesReceipts;
