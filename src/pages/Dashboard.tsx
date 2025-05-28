
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowUp, ArrowDown, Users, Package, ShoppingCart, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  // Mock data - in real app, this would come from API
  const todayStats = {
    totalSales: 15420,
    cashSales: 8950,
    creditSales: 6470,
    customersDue: 12340,
    lowStockItems: 8,
    totalCustomers: 156,
    totalProducts: 1248
  };

  const recentSales = [
    { id: "001", customer: "Afzal Hardware Co.", amount: 2340, type: "credit", time: "10:30 AM" },
    { id: "002", customer: "Cash Sale", amount: 450, type: "cash", time: "11:15 AM" },
    { id: "003", customer: "ABC Furniture", amount: 1890, type: "credit", time: "12:45 PM" },
    { id: "004", customer: "Cash Sale", amount: 230, type: "cash", time: "1:20 PM" },
  ];

  const lowStockItems = [
    { name: "Door Hinges - Heavy Duty", current: 5, minimum: 20 },
    { name: "Screws - 2 inch", current: 12, minimum: 50 },
    { name: "Cabinet Handles - Chrome", current: 8, minimum: 25 },
    { name: "Drawer Slides - 18 inch", current: 3, minimum: 15 },
  ];

  // Chart data
  const salesData = [
    { name: "Mon", cash: 4000, credit: 2400 },
    { name: "Tue", cash: 3000, credit: 1398 },
    { name: "Wed", cash: 2000, credit: 9800 },
    { name: "Thu", cash: 2780, credit: 3908 },
    { name: "Fri", cash: 1890, credit: 4800 },
    { name: "Sat", cash: 2390, credit: 3800 },
    { name: "Sun", cash: 3490, credit: 4300 },
  ];

  const categoryData = [
    { name: "Hardware", value: 35, color: "#3b82f6" },
    { name: "Fasteners", value: 25, color: "#10b981" },
    { name: "Oils", value: 15, color: "#f59e0b" },
    { name: "Cement", value: 12, color: "#ef4444" },
    { name: "Paints", value: 8, color: "#8b5cf6" },
    { name: "Tools", value: 5, color: "#06b6d4" },
  ];

  const monthlyTrend = [
    { month: "Jan", sales: 45000 },
    { month: "Feb", sales: 52000 },
    { month: "Mar", sales: 48000 },
    { month: "Apr", sales: 61000 },
    { month: "May", sales: 58000 },
    { month: "Jun", sales: 67000 },
  ];

  const chartConfig = {
    cash: { label: "Cash Sales", color: "#10b981" },
    credit: { label: "Credit Sales", color: "#3b82f6" },
    sales: { label: "Sales", color: "#8b5cf6" }
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to Usman Hardware Store Management System</p>
          </div>
        </div>
        <Badge variant="outline" className="text-green-700 border-green-300 animate-pulse">
          Store Open
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Rs. {todayStats.totalSales.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              12% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Sales</CardTitle>
            <Database className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rs. {todayStats.cashSales.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">
              {((todayStats.cashSales / todayStats.totalSales) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Sales</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">Rs. {todayStats.creditSales.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">
              {((todayStats.creditSales / todayStats.totalSales) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Dues</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Rs. {todayStats.customersDue.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">
              From {todayStats.totalCustomers} customers
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Sales Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Weekly Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="cash" fill="var(--color-cash)" name="Cash Sales" />
                <Bar dataKey="credit" fill="var(--color-credit)" name="Credit Sales" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Monthly Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="var(--color-sales)" 
                strokeWidth={3}
                dot={{ fill: "var(--color-sales)", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
              Recent Sales Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{sale.customer}</p>
                    <p className="text-sm text-gray-500">{sale.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">Rs. {sale.amount.toLocaleString()}</p>
                    <Badge variant={sale.type === 'cash' ? 'default' : 'secondary'} className="text-xs">
                      {sale.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-500" />
              Low Stock Alerts
              <Badge variant="destructive" className="ml-2 animate-pulse">{lowStockItems.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-red-600">Current: {item.current} | Min: {item.minimum}</p>
                  </div>
                  <Badge variant="destructive" className="animate-pulse">Low Stock</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
