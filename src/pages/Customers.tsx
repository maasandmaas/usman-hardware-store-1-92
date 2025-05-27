
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Plus, Edit, CreditCard, Phone, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Customers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Mock customer data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Hardware Co.",
      phone: "9876543210",
      email: "john@hardware.com",
      address: "123 Main Street, Business District",
      gst: "GST123456789",
      dueAmount: 2340,
      creditLimit: 10000,
      totalPurchases: 45600,
      lastPurchase: "2024-01-15",
      transactions: [
        { id: 1, date: "2024-01-15", type: "sale", amount: 2340, balance: 2340, description: "Hardware items" },
        { id: 2, date: "2024-01-10", type: "payment", amount: -1500, balance: 0, description: "Cash payment received" },
      ]
    },
    {
      id: 2,
      name: "ABC Furniture",
      phone: "9876543211",
      email: "abc@furniture.com",
      address: "456 Oak Avenue, Industrial Area",
      gst: "GST987654321",
      dueAmount: 1890,
      creditLimit: 15000,
      totalPurchases: 78900,
      lastPurchase: "2024-01-12",
      transactions: [
        { id: 3, date: "2024-01-12", type: "sale", amount: 1890, balance: 1890, description: "Furniture fittings" },
      ]
    },
    {
      id: 3,
      name: "XYZ Contractors",
      phone: "9876543212",
      email: "xyz@contractors.com",
      address: "789 Pine Street, Construction Zone",
      gst: "GST456789123",
      dueAmount: 0,
      creditLimit: 20000,
      totalPurchases: 125000,
      lastPurchase: "2024-01-14",
      transactions: [
        { id: 4, date: "2024-01-14", type: "payment", amount: -5000, balance: 0, description: "Full payment received" },
      ]
    }
  ]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDues = customers.reduce((sum, customer) => sum + customer.dueAmount, 0);

  const handleAddCustomer = (formData) => {
    const newCustomer = {
      id: customers.length + 1,
      ...formData,
      dueAmount: 0,
      totalPurchases: 0,
      lastPurchase: null,
      transactions: []
    };
    setCustomers([...customers, newCustomer]);
    setIsDialogOpen(false);
    toast({
      title: "Customer Added",
      description: "New customer has been added successfully.",
    });
  };

  const handlePayment = (customerId, amount) => {
    setCustomers(customers.map(customer => {
      if (customer.id === customerId) {
        const newDueAmount = Math.max(0, customer.dueAmount - amount);
        const newTransaction = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          type: "payment",
          amount: -amount,
          balance: newDueAmount,
          description: "Payment received"
        };
        return {
          ...customer,
          dueAmount: newDueAmount,
          transactions: [newTransaction, ...customer.transactions]
        };
      }
      return customer;
    }));
    
    toast({
      title: "Payment Recorded",
      description: `₹${amount} payment has been recorded successfully.`,
    });
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600">Manage customer profiles and dues</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <CustomerDialog onSubmit={handleAddCustomer} onClose={() => setIsDialogOpen(false)} />
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-blue-600">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Total Dues</p>
                <p className="text-2xl font-bold text-red-600">₹{totalDues.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-green-600">{customers.filter(c => c.dueAmount > 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Credit Sales</p>
                <p className="text-2xl font-bold text-purple-600">₹{(totalDues * 2).toLocaleString()}</p>
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
              placeholder="Search customers by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Phone className="h-4 w-4" />
                    {customer.phone}
                  </div>
                </div>
                {customer.dueAmount > 0 && (
                  <Badge variant="destructive">
                    Due: ₹{customer.dueAmount.toLocaleString()}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{customer.address}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Purchases</p>
                  <p className="font-bold text-green-600">₹{customer.totalPurchases.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Credit Limit</p>
                  <p className="font-medium">₹{customer.creditLimit.toLocaleString()}</p>
                </div>
              </div>

              {customer.lastPurchase && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Last purchase: {customer.lastPurchase}</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                {customer.dueAmount > 0 && (
                  <PaymentDialog customer={customer} onPayment={handlePayment} />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <CustomerDetailsDialog
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onPayment={handlePayment}
        />
      )}
    </div>
  );
};

// Customer Dialog Component
const CustomerDialog = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", address: "", gst: "", creditLimit: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      creditLimit: parseFloat(formData.creditLimit) || 0
    });
    setFormData({ name: "", phone: "", email: "", address: "", gst: "", creditLimit: "" });
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add New Customer</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Customer Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gst">GST Number</Label>
            <Input
              id="gst"
              value={formData.gst}
              onChange={(e) => setFormData({...formData, gst: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
            <Input
              id="creditLimit"
              type="number"
              value={formData.creditLimit}
              onChange={(e) => setFormData({...formData, creditLimit: e.target.value})}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">Add Customer</Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </DialogContent>
  );
};

// Payment Dialog Component
const PaymentDialog = ({ customer, onPayment }) => {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handlePayment = () => {
    const paymentAmount = parseFloat(amount);
    if (paymentAmount > 0 && paymentAmount <= customer.dueAmount) {
      onPayment(customer.id, paymentAmount);
      setAmount("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <CreditCard className="h-4 w-4 mr-1" />
          Pay
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment - {customer.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Outstanding Amount: <span className="font-bold text-red-600">₹{customer.dueAmount}</span></p>
          </div>
          <div>
            <Label htmlFor="amount">Payment Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={customer.dueAmount}
              placeholder="Enter payment amount"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePayment} className="flex-1" disabled={!amount || parseFloat(amount) <= 0}>
              Record Payment
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Customer Details Dialog Component
const CustomerDetailsDialog = ({ customer, onClose, onPayment }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{customer.name} - Customer Details</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Contact Information</Label>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><strong>Phone:</strong> {customer.phone}</p>
                    <p><strong>Email:</strong> {customer.email}</p>
                    <p><strong>Address:</strong> {customer.address}</p>
                    <p><strong>GST:</strong> {customer.gst}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Account Summary</Label>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><strong>Total Purchases:</strong> ₹{customer.totalPurchases.toLocaleString()}</p>
                    <p><strong>Credit Limit:</strong> ₹{customer.creditLimit.toLocaleString()}</p>
                    <p><strong>Outstanding Amount:</strong> <span className="text-red-600 font-bold">₹{customer.dueAmount.toLocaleString()}</span></p>
                    <p><strong>Available Credit:</strong> ₹{(customer.creditLimit - customer.dueAmount).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Transaction History</h3>
                {customer.dueAmount > 0 && (
                  <PaymentDialog customer={customer} onPayment={onPayment} />
                )}
              </div>
              <div className="space-y-2">
                {customer.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === 'payment' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'payment' ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">Balance: ₹{transaction.balance.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default Customers;
