
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, FileText, CreditCard, Receipt, DollarSign, Stamp } from "lucide-react";
import { salesReceipts as initialSalesReceipts, SalesReceipt } from "@/data/storeData";

const SalesReceipts = () => {
  const [salesReceipts] = useState(initialSalesReceipts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<SalesReceipt | null>(null);

  const filteredReceipts = salesReceipts.filter(receipt =>
    receipt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCashSales = salesReceipts
    .filter(r => r.paymentMethod === "cash")
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const totalCreditSales = salesReceipts
    .filter(r => r.paymentMethod === "credit")
    .reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="flex-1 p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Sales Receipts</h1>
            <p className="text-slate-600">View all sales receipts and transaction history</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-700 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Receipt className="h-8 w-8 text-blue-700" />
              <div>
                <p className="text-sm text-slate-600">Total Receipts</p>
                <p className="text-2xl font-bold text-blue-700">{salesReceipts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-700 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-emerald-700" />
              <div>
                <p className="text-sm text-slate-600">Cash Sales</p>
                <p className="text-2xl font-bold text-emerald-700">Rs. {totalCashSales.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-700 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-orange-700" />
              <div>
                <p className="text-sm text-slate-600">Credit Sales</p>
                <p className="text-2xl font-bold text-orange-700">Rs. {totalCreditSales.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-700 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-700" />
              <div>
                <p className="text-sm text-slate-600">Total Sales</p>
                <p className="text-2xl font-bold text-purple-700">
                  Rs. {(totalCashSales + totalCreditSales).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by receipt ID, invoice number, or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-300 focus:border-blue-700 focus:ring-blue-700"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sales Receipts Table */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-slate-900">Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-700">Receipt Details</TableHead>
                <TableHead className="text-slate-700">Customer</TableHead>
                <TableHead className="text-slate-700">Items</TableHead>
                <TableHead className="text-slate-700">Amount</TableHead>
                <TableHead className="text-slate-700">Payment Method</TableHead>
                <TableHead className="text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceipts.map((receipt) => (
                <TableRow key={receipt.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{receipt.id}</p>
                      <p className="text-sm text-slate-500">Invoice: {receipt.invoiceNumber}</p>
                      <p className="text-sm text-slate-500">Date: {receipt.date} at {receipt.time}</p>
                      <p className="text-sm text-slate-500">Cashier: {receipt.cashier}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-900">{receipt.customerName}</p>
                    {receipt.customerId && (
                      <p className="text-sm text-slate-500">ID: {receipt.customerId}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-900">{receipt.items.length} items</p>
                    <p className="text-xs text-slate-500">
                      {receipt.items.slice(0, 2).map(item => item.productName).join(", ")}
                      {receipt.items.length > 2 && "..."}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-900">Rs. {receipt.totalAmount.toLocaleString()}</p>
                    {receipt.taxAmount > 0 && (
                      <p className="text-xs text-slate-500">Tax: Rs. {receipt.taxAmount}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={receipt.paymentMethod === "cash" 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                      }
                    >
                      {receipt.paymentMethod.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-100"
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Receipt Details - {selectedReceipt?.id}</DialogTitle>
          </DialogHeader>
          {selectedReceipt && <ReceiptDetails receipt={selectedReceipt} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Receipt Details Component with Authentication Elements
const ReceiptDetails = ({ receipt }: { receipt: SalesReceipt }) => (
  <div className="space-y-6 bg-white p-6 rounded-lg border">
    {/* Header with Store Info */}
    <div className="text-center border-b pb-4 relative">
      <div className="absolute top-0 right-0">
        <Stamp className="h-8 w-8 text-blue-700 opacity-50" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Usman Hardware Store</h2>
      <p className="text-sm text-slate-600">Furniture Hardware Specialist</p>
      <p className="text-sm text-slate-600">Hafizabad, Punjab, Pakistan</p>
      <p className="text-sm text-slate-600">Phone: +92-300-1234567</p>
      <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
        <p className="text-lg font-bold text-blue-900">Receipt: {receipt.id}</p>
        <p className="text-sm text-blue-700">Invoice: {receipt.invoiceNumber}</p>
      </div>
    </div>

    {/* Customer and Transaction Info */}
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-1">Customer Information</h3>
        <p><strong>Name:</strong> {receipt.customerName}</p>
        {receipt.customerId && <p><strong>Customer ID:</strong> {receipt.customerId}</p>}
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-1">Transaction Details</h3>
        <p><strong>Date:</strong> {receipt.date}</p>
        <p><strong>Time:</strong> {receipt.time}</p>
        <p><strong>Cashier:</strong> {receipt.cashier}</p>
        <p><strong>Payment:</strong> 
          <Badge className="ml-2" variant={receipt.paymentMethod === "cash" ? "default" : "secondary"}>
            {receipt.paymentMethod.toUpperCase()}
          </Badge>
        </p>
      </div>
    </div>
    
    {/* Items Table */}
    <div>
      <h3 className="font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-1">Items Purchased</h3>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="text-slate-700">Product</TableHead>
            <TableHead className="text-slate-700">Quantity</TableHead>
            <TableHead className="text-slate-700">Unit Price</TableHead>
            <TableHead className="text-slate-700">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipt.items.map((item, index) => (
            <TableRow key={index} className="border-b border-slate-100">
              <TableCell className="text-slate-900">{item.productName}</TableCell>
              <TableCell className="text-slate-700">{item.quantity}</TableCell>
              <TableCell className="text-slate-700">Rs. {item.unitPrice.toLocaleString()}</TableCell>
              <TableCell className="text-slate-900 font-medium">Rs. {item.total.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Totals Section */}
      <div className="border-t-2 border-slate-300 pt-4 mt-4 space-y-2">
        <div className="flex justify-between text-slate-700">
          <span>Subtotal:</span>
          <span>Rs. {(receipt.totalAmount - receipt.taxAmount + receipt.discountAmount).toLocaleString()}</span>
        </div>
        {receipt.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Discount:</span>
            <span>- Rs. {receipt.discountAmount.toLocaleString()}</span>
          </div>
        )}
        {receipt.taxAmount > 0 && (
          <div className="flex justify-between text-slate-700">
            <span>Tax (10%):</span>
            <span>Rs. {receipt.taxAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between items-center font-bold text-lg text-slate-900 bg-slate-100 p-3 rounded">
          <span>Total Amount:</span>
          <span>Rs. {receipt.totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>

    {/* Notes Section */}
    {receipt.notes && (
      <div className="bg-amber-50 border border-amber-200 rounded p-3">
        <h4 className="font-medium text-amber-900 mb-1">Notes:</h4>
        <p className="text-amber-800 text-sm">{receipt.notes}</p>
      </div>
    )}

    {/* Authentication Section */}
    <div className="border-t-2 border-slate-300 pt-4 space-y-4">
      <div className="grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="border-b border-slate-400 mb-2 pb-8"></div>
          <p className="text-sm text-slate-600">Customer Signature</p>
        </div>
        <div className="text-center">
          <div className="border-b border-slate-400 mb-2 pb-8 relative">
            <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-lg font-script text-slate-700">
              Muhammad Usman
            </span>
          </div>
          <p className="text-sm text-slate-600">Authorized Signature</p>
          <p className="text-xs text-slate-500">(Store Manager)</p>
        </div>
      </div>
      
      {/* Store Stamp */}
      <div className="text-center mt-6">
        <div className="inline-block border-2 border-blue-700 rounded-full p-4 bg-blue-50">
          <div className="text-center">
            <p className="text-xs font-bold text-blue-900">USMAN HARDWARE</p>
            <p className="text-xs text-blue-700">HAFIZABAD</p>
            <Stamp className="h-4 w-4 text-blue-700 mx-auto mt-1" />
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="text-center text-xs text-slate-500 border-t border-slate-200 pt-4">
      <p>Thank you for your business! For queries, contact: +92-300-1234567</p>
      <p>Generated on: {new Date().toLocaleString()}</p>
    </div>
  </div>
);

export default SalesReceipts;
