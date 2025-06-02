
import { useState, useEffect } from "react";
import { Plus, Search, Filter, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { financeApi, type Expense } from "@/services/financeApi";
import AddExpenseModal from "@/components/AddExpenseModal";

export default function ExpenseTracking() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    categories: [] as Array<{ category: string; amount: number }>
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [selectedCategory]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const response = await financeApi.getExpenses(params);
      
      if (response.success) {
        setExpenses(response.data.expenses);
        setSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load expense data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = () => {
    fetchExpenses(); // Refresh the data
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate stats from actual data
  const todayExpenses = expenses
    .filter(expense => {
      const today = new Date().toISOString().split('T')[0];
      return expense.date === today;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const thisMonthExpenses = expenses
    .filter(expense => {
      const thisMonth = new Date().toISOString().slice(0, 7);
      return expense.date.startsWith(thisMonth);
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const avgMonthlyExpenses = summary.totalExpenses / 12; // Assuming yearly data

  // Prepare chart data from categories
  const chartData = summary.categories.map(cat => ({
    category: cat.category,
    expenses: cat.amount
  }));

  const getPaymentMethodBadge = (method: string) => {
    const colors = {
      cash: 'bg-green-100 text-green-800',
      bank_transfer: 'bg-blue-100 text-blue-800',
      cheque: 'bg-purple-100 text-purple-800',
      credit_card: 'bg-orange-100 text-orange-800'
    };
    
    return (
      <Badge className={colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {method.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-background min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading expense data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <SidebarTrigger />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-1">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Expense Tracking</h1>
            <p className="text-muted-foreground">Monitor and manage business expenses</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-foreground">Rs. {thisMonthExpenses.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-foreground">Rs. {todayExpenses.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Average Monthly</p>
                <p className="text-2xl font-bold text-foreground">Rs. {Math.round(avgMonthlyExpenses).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Badge className="bg-green-600">{expenses.length}</Badge>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold text-foreground">{expenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Expense Chart */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Expense by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Expenses']} />
                <Bar dataKey="expenses" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Expense Management */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search expenses..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.reference}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>Rs. {expense.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {getPaymentMethodBadge(expense.paymentMethod)}
                  </TableCell>
                  <TableCell>{expense.createdBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No expenses found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>

      <AddExpenseModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onExpenseAdded={handleExpenseAdded}
      />
    </div>
  );
}
