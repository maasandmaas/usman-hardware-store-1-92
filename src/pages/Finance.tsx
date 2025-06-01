
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Plus, ArrowUp, ArrowDown, Calendar, TrendingUp, TrendingDown, CreditCard, DollarSign, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { financeApi, type FinanceOverview, type AccountsReceivable, type Expense } from "@/services/financeApi";

const Finance = () => {
  const { toast } = useToast();
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [overview, setOverview] = useState<FinanceOverview | null>(null);
  const [receivables, setReceivables] = useState<AccountsReceivable[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  useEffect(() => {
    fetchFinanceData();
  }, [period]);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      
      // Fetch overview data
      const overviewResponse = await financeApi.getOverview(period);
      if (overviewResponse.success) {
        setOverview(overviewResponse.data);
      }

      // Fetch accounts receivable
      const receivablesResponse = await financeApi.getAccountsReceivable({ limit: 10 });
      if (receivablesResponse.success) {
        setReceivables(receivablesResponse.data.receivables);
      }

      // Fetch recent expenses
      const expensesResponse = await financeApi.getExpenses({ limit: 10 });
      if (expensesResponse.success) {
        setExpenses(expensesResponse.data.expenses);
      }

    } catch (error) {
      console.error('Error fetching finance data:', error);
      toast({
        title: "Error",
        description: "Failed to load finance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (paymentData: any) => {
    try {
      const response = await financeApi.recordPayment(paymentData);
      if (response.success) {
        toast({
          title: "Payment Recorded",
          description: response.message,
        });
        setIsPaymentDialogOpen(false);
        fetchFinanceData(); // Refresh data
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading finance data...</div>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">No finance data available</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Finance</h1>
            <p className="text-gray-600">Financial overview and management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </DialogTrigger>
            <PaymentDialog onSubmit={handleRecordPayment} onClose={() => setIsPaymentDialogOpen(false)} />
          </Dialog>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ArrowUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">Rs. {overview.revenue.total.toLocaleString()}</p>
                <p className="text-xs text-green-500">+{overview.revenue.growth}% growth</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ArrowDown className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">Rs. {overview.expenses.total.toLocaleString()}</p>
                <p className="text-xs text-red-500">+{overview.expenses.growth}% growth</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold text-blue-600">Rs. {overview.profit.net.toLocaleString()}</p>
                <p className="text-xs text-blue-500">{overview.profit.margin}% margin</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Cash Flow</p>
                <p className="text-2xl font-bold text-purple-600">Rs. {overview.cashFlow.net.toLocaleString()}</p>
                <p className="text-xs text-purple-500">Net flow</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-500" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="font-medium">Cash Sales</span>
                <span className="font-bold text-green-600">Rs. {overview.revenue.cash.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="font-medium">Credit Sales</span>
                <span className="font-bold text-blue-600">Rs. {overview.revenue.credit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded border-t-2">
                <span className="font-bold">Total Revenue</span>
                <span className="font-bold text-gray-900">Rs. {overview.revenue.total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDown className="h-5 w-5 text-red-500" />
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <span className="font-medium">Purchases</span>
                <span className="font-bold text-red-600">Rs. {overview.expenses.purchases.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                <span className="font-medium">Operational</span>
                <span className="font-bold text-orange-600">Rs. {overview.expenses.operational.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded border-t-2">
                <span className="font-bold">Total Expenses</span>
                <span className="font-bold text-gray-900">Rs. {overview.expenses.total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="receivables" className="space-y-6">
        <TabsList>
          <TabsTrigger value="receivables">Accounts Receivable</TabsTrigger>
          <TabsTrigger value="expenses">Recent Expenses</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="receivables">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Accounts Receivable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receivables.map((receivable) => (
                  <div key={receivable.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{receivable.customerName}</p>
                      <p className="text-sm text-gray-500">
                        Invoice: {receivable.invoiceNumber} • Due: {receivable.dueDate}
                      </p>
                      {receivable.daysOverdue > 0 && (
                        <Badge variant="destructive" className="mt-1">
                          {receivable.daysOverdue} days overdue
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">Rs. {receivable.balance.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">
                        Paid: Rs. {receivable.paidAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDown className="h-5 w-5 text-red-500" />
                Recent Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{expense.category}</Badge>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{expense.date}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500 capitalize">{expense.paymentMethod.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">Rs. {expense.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{expense.reference}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <ArrowUp className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-2xl font-bold text-green-600">Rs. {overview.cashFlow.inflow.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Cash Inflow</p>
            </Card>
            <Card className="text-center p-6">
              <ArrowDown className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <p className="text-2xl font-bold text-red-600">Rs. {overview.cashFlow.outflow.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Cash Outflow</p>
            </Card>
            <Card className="text-center p-6">
              <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-3" />
              <p className={`text-2xl font-bold ${overview.cashFlow.net >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                Rs. {overview.cashFlow.net.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Net Cash Flow</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Payment Dialog Component
const PaymentDialog = ({ onSubmit, onClose }: { onSubmit: (data: any) => void; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    customerId: "",
    amount: "",
    paymentMethod: "",
    reference: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      customerId: parseInt(formData.customerId),
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle className="text-green-600">Record Payment</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerId">Customer ID</Label>
            <Input
              id="customerId"
              type="number"
              value={formData.customerId}
              onChange={(e) => setFormData({...formData, customerId: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount (Rs.)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="reference">Reference</Label>
          <Input
            id="reference"
            value={formData.reference}
            onChange={(e) => setFormData({...formData, reference: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Optional notes about the payment"
            rows={2}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={!formData.customerId || !formData.amount || !formData.paymentMethod || !formData.reference}
          >
            Record Payment
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default Finance;
