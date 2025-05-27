
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Plus, ArrowUp, ArrowDown, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Finance = () => {
  const { toast } = useToast();
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

  // Mock financial data
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "income",
      category: "sales",
      amount: 15420,
      description: "Daily sales revenue",
      date: "2024-01-15",
      reference: "SALES-001"
    },
    {
      id: 2,
      type: "expense",
      category: "inventory",
      amount: 8500,
      description: "Stock purchase from ABC Hardware Co.",
      date: "2024-01-15",
      reference: "PO-001"
    },
    {
      id: 3,
      type: "expense",
      category: "operational",
      amount: 2500,
      description: "Monthly rent payment",
      date: "2024-01-14",
      reference: "RENT-001"
    },
    {
      id: 4,
      type: "income",
      category: "sales",
      amount: 12800,
      description: "Daily sales revenue",
      date: "2024-01-14",
      reference: "SALES-002"
    },
    {
      id: 5,
      type: "expense",
      category: "utilities",
      amount: 1200,
      description: "Electricity bill",
      date: "2024-01-13",
      reference: "ELEC-001"
    }
  ]);

  const incomeCategories = ["sales", "other_income", "interest", "refunds"];
  const expenseCategories = ["inventory", "operational", "utilities", "rent", "salaries", "maintenance", "marketing", "other"];

  // Calculate financial summary
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Monthly breakdown
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = monthlyTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const monthlyProfit = monthlyIncome - monthlyExpenses;

  const handleAddTransaction = (type, formData) => {
    const newTransaction = {
      id: transactions.length + 1,
      type,
      ...formData,
      amount: parseFloat(formData.amount),
      date: formData.date
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    if (type === "income") {
      setIsIncomeDialogOpen(false);
    } else {
      setIsExpenseDialogOpen(false);
    }
    
    toast({
      title: `${type === "income" ? "Income" : "Expense"} Added`,
      description: `₹${formData.amount} ${type} has been recorded successfully.`,
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "sales":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "inventory":
        return <Database className="h-4 w-4 text-blue-500" />;
      default:
        return <Database className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finance</h1>
            <p className="text-gray-600">Track income, expenses and financial summary</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Income
              </Button>
            </DialogTrigger>
            <TransactionDialog 
              type="income" 
              categories={incomeCategories}
              onSubmit={(formData) => handleAddTransaction("income", formData)}
              onClose={() => setIsIncomeDialogOpen(false)}
            />
          </Dialog>
          
          <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <TransactionDialog 
              type="expense" 
              categories={expenseCategories}
              onSubmit={(formData) => handleAddTransaction("expense", formData)}
              onClose={() => setIsExpenseDialogOpen(false)}
            />
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
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
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
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{netProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{monthlyProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      {transaction.type === "income" ? (
                        <ArrowUp className="h-6 w-6 text-green-500" />
                      ) : (
                        <ArrowDown className="h-6 w-6 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getCategoryIcon(transaction.category)}
                          <span className="text-sm text-gray-500 capitalize">{transaction.category.replace('_', ' ')}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500">{transaction.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${transaction.type === "income" ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === "income" ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </p>
                      <Badge variant={transaction.type === "income" ? "default" : "destructive"} className="text-xs">
                        {transaction.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <ArrowUp className="h-5 w-5" />
                Income Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.filter(t => t.type === "income").map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <ArrowUp className="h-6 w-6 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500 capitalize">{transaction.category.replace('_', ' ')} • {transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">+₹{transaction.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{transaction.reference}</p>
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
              <CardTitle className="flex items-center gap-2 text-red-600">
                <ArrowDown className="h-5 w-5" />
                Expense Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.filter(t => t.type === "expense").map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <ArrowDown className="h-6 w-6 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500 capitalize">{transaction.category.replace('_', ' ')} • {transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">-₹{transaction.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{transaction.reference}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Income Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {incomeCategories.map(category => {
                    const categoryTotal = transactions
                      .filter(t => t.type === "income" && t.category === category)
                      .reduce((sum, t) => sum + t.amount, 0);
                    
                    if (categoryTotal === 0) return null;
                    
                    return (
                      <div key={category} className="flex justify-between items-center p-3 bg-green-50 rounded">
                        <span className="capitalize font-medium">{category.replace('_', ' ')}</span>
                        <span className="font-bold text-green-600">₹{categoryTotal.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenseCategories.map(category => {
                    const categoryTotal = transactions
                      .filter(t => t.type === "expense" && t.category === category)
                      .reduce((sum, t) => sum + t.amount, 0);
                    
                    if (categoryTotal === 0) return null;
                    
                    return (
                      <div key={category} className="flex justify-between items-center p-3 bg-red-50 rounded">
                        <span className="capitalize font-medium">{category.replace('_', ' ')}</span>
                        <span className="font-bold text-red-600">₹{categoryTotal.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Transaction Dialog Component
const TransactionDialog = ({ type, categories, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    reference: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      category: "", amount: "", description: "", 
      date: new Date().toISOString().split('T')[0], 
      reference: ""
    });
  };

  return (
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle className={type === "income" ? "text-green-600" : "text-red-600"}>
          Add {type === "income" ? "Income" : "Expense"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            placeholder={`Enter ${type} description...`}
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="reference">Reference Number</Label>
          <Input
            id="reference"
            value={formData.reference}
            onChange={(e) => setFormData({...formData, reference: e.target.value})}
            placeholder="Optional reference/invoice number"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            className={`flex-1 ${type === "income" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
            disabled={!formData.category || !formData.amount || !formData.description}
          >
            Add {type === "income" ? "Income" : "Expense"}
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
