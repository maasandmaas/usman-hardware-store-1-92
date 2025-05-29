
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    cash: { label: "Cash Sales", color: "#1e40af" },
    credit: { label: "Credit Sales", color: "#3b82f6" },
    sales: { label: "Sales", color: "#1e3a8a" }
  };

  const handleInstantOrder = (productName: string, productId: number) => {
    toast({
      title: "Order Initiated",
      description: `Creating purchase order for ${productName}`,
    });
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Usman Hardware Store - Furniture Hardware Specialist</p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1">
          Store Open
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-700 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Today's Sales</CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">Rs. {dashboardStats.totalSales.toLocaleString()}</div>
            <div className="flex items-center text-xs text-emerald-600 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              15% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-700 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Cash Sales</CardTitle>
            <Database className="h-5 w-5 text-indigo-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">Rs. {dashboardStats.cashSales.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">
              {((dashboardStats.cashSales / dashboardStats.totalSales) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-700 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Credit Sales</CardTitle>
            <Users className="h-5 w-5 text-purple-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">Rs. {dashboardStats.creditSales.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">
              {((dashboardStats.creditSales / dashboardStats.totalSales) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-700 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Dues</CardTitle>
            <ArrowDown className="h-5 w-5 text-red-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">Rs. {dashboardStats.customersDue.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">
              From {dashboardStats.totalCustomers} customers
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Responsive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Weekly Sales Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <TrendingUp className="h-5 w-5 text-blue-700" />
              Weekly Sales Overview
            </CardTitle>
            <p className="text-sm text-slate-500">Cash vs Credit sales comparison for the week</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    label={{ value: 'Amount (PKR)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
                  <Bar dataKey="cash" fill="#1e40af" name="Cash Sales" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="credit" fill="#3b82f6" name="Credit Sales" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Package className="h-5 w-5 text-blue-700" />
              Sales by Category
            </CardTitle>
            <p className="text-sm text-slate-500">Distribution of sales across furniture hardware categories</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    style={{ fontSize: '11px' }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend - Full Width */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <TrendingUp className="h-5 w-5 text-blue-700" />
            Monthly Sales Trend
          </CardTitle>
          <p className="text-sm text-slate-500">Sales performance over the last 6 months</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  label={{ value: 'Sales (PKR)', angle: -90, position: 'insideLeft' }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#1e3a8a" 
                  strokeWidth={3}
                  dot={{ fill: "#1e3a8a", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: "#1e3a8a" }}
                  name="Monthly Sales"
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
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <ShoppingCart className="h-5 w-5 text-blue-700" />
              Recent Sales Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                  <div>
                    <p className="font-medium text-slate-900">{sale.customer}</p>
                    <p className="text-sm text-slate-500">{sale.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">Rs. {sale.amount.toLocaleString()}</p>
                    <Badge 
                      className={sale.type === 'cash' 
                        ? 'bg-slate-100 text-slate-800 border-slate-300' 
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
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <AlertTriangle className="h-5 w-5 text-red-700" />
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
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-sm text-red-700">Current: {item.current} | Min: {item.minimum}</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-700 hover:bg-blue-800 text-white"
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
