
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowUp, ArrowDown, Users, Package, ShoppingCart, Database, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { 
  dashboardStats, 
  salesData, 
  categoryData, 
  monthlyTrend, 
  recentSales, 
  lowStockItems 
} from "@/data/storeData";

const Dashboard = () => {
  const { toast } = useToast();

  const chartConfig = {
    cash: { label: "Cash Sales", color: "#1f2937" },
    credit: { label: "Credit Sales", color: "#374151" },
    sales: { label: "Sales", color: "#111827" }
  };

  const handleInstantOrder = (productName: string, productId: number) => {
    toast({
      title: "Order Initiated",
      description: `Creating purchase order for ${productName}`,
    });
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Usman Hardware Store Management System</p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
          Store Open
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-gray-800 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Sales</CardTitle>
            <ShoppingCart className="h-5 w-5 text-gray-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">Rs. {dashboardStats.totalSales.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              12% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-700 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cash Sales</CardTitle>
            <Database className="h-5 w-5 text-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">Rs. {dashboardStats.cashSales.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">
              {((dashboardStats.cashSales / dashboardStats.totalSales) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-600 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Credit Sales</CardTitle>
            <Users className="h-5 w-5 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">Rs. {dashboardStats.creditSales.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">
              {((dashboardStats.creditSales / dashboardStats.totalSales) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-600 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Dues</CardTitle>
            <ArrowDown className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Rs. {dashboardStats.customersDue.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">
              From {dashboardStats.totalCustomers} customers
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Sales Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <TrendingUp className="h-5 w-5 text-gray-700" />
              Weekly Sales Overview
            </CardTitle>
            <p className="text-sm text-gray-500">Cash vs Credit sales comparison for the week</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <Bar dataKey="cash" fill="#1f2937" name="Cash Sales" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="credit" fill="#374151" name="Credit Sales" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Package className="h-5 w-5 text-gray-700" />
              Sales by Category
            </CardTitle>
            <p className="text-sm text-gray-500">Distribution of sales across product categories</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TrendingUp className="h-5 w-5 text-gray-700" />
            Monthly Sales Trend
          </CardTitle>
          <p className="text-sm text-gray-500">Sales performance over the last 6 months</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#111827" 
                  strokeWidth={3}
                  dot={{ fill: "#111827", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "#111827" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              Recent Sales Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{sale.customer}</p>
                    <p className="text-sm text-gray-500">{sale.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">Rs. {sale.amount.toLocaleString()}</p>
                    <Badge 
                      className={sale.type === 'cash' 
                        ? 'bg-gray-100 text-gray-800 border-gray-300' 
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                      }
                    >
                      {sale.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="hover:shadow-lg transition-shadow duration-300 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Low Stock Alerts
              <Badge className="bg-red-100 text-red-800 border-red-300">
                {lowStockItems.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-red-600">Current: {item.current} | Min: {item.minimum}</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gray-800 hover:bg-gray-900 text-white"
                    onClick={() => handleInstantOrder(item.name, item.id)}
                  >
                    Order Now
                  </Button>
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
