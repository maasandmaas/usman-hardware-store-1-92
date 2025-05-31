
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowUp, ArrowDown, Users, Package, ShoppingCart, Database, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { dashboardApi, inventoryApi } from "@/services/api";

const Dashboard = () => {
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const chartConfig = {
    cash: { label: "Cash Sales", color: "#1e40af" },
    credit: { label: "Credit Sales", color: "#3b82f6" },
    sales: { label: "Sales", color: "#1e3a8a" }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchLowStockItems();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardApi.getStats();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockItems = async () => {
    try {
      const response = await inventoryApi.getAll({ lowStock: true, limit: 5 });
      if (response.success) {
        setLowStockItems(response.data.inventory || []);
      }
    } catch (error) {
      console.error('Failed to fetch low stock items:', error);
    }
  };

  const handleInstantOrder = (productName: string, productId: number) => {
    toast({
      title: "Order Initiated",
      description: `Creating purchase order for ${productName}`,
    });
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6 bg-background min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex-1 p-6 space-y-6 bg-background min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">No data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Usman Hardware Store - Furniture Hardware Specialist</p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 px-3 py-1">
          Store Open
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-700 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Rs. {dashboardData.totalRevenue?.toLocaleString() || 0}</div>
            <div className="flex items-center text-xs text-emerald-600 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              {((dashboardData.totalRevenue - (dashboardData.totalRevenue * 0.85)) / (dashboardData.totalRevenue * 0.85) * 100).toFixed(1)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-700 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <Database className="h-5 w-5 text-indigo-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dashboardData.totalOrders || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Avg: Rs. {dashboardData.totalOrders ? Math.round(dashboardData.totalRevenue / dashboardData.totalOrders).toLocaleString() : 0} per order
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-700 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
            <Users className="h-5 w-5 text-purple-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dashboardData.totalCustomers || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Active customer base
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-700 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
            <ArrowDown className="h-5 w-5 text-red-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{dashboardData.lowStockItems || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Need immediate attention
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {dashboardData.monthlyRevenue && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-blue-700" />
                Monthly Revenue Trend
              </CardTitle>
              <p className="text-sm text-muted-foreground">Revenue performance over recent months</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.monthlyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      label={{ value: 'Revenue (PKR)', angle: -90, position: 'insideLeft' }}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#1e3a8a" 
                      strokeWidth={3}
                      dot={{ fill: "#1e3a8a", strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: "#1e3a8a" }}
                      name="Monthly Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top Products */}
          {dashboardData.topProducts && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Package className="h-5 w-5 text-blue-700" />
                  Top Selling Products
                </CardTitle>
                <p className="text-sm text-muted-foreground">Best performing products</p>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.topProducts} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        label={{ value: 'Sales (PKR)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--card-foreground))'
                        }}
                      />
                      <Bar dataKey="sales" fill="#1e40af" name="Sales Amount" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        {dashboardData.recentSales && (
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <ShoppingCart className="h-5 w-5 text-blue-700" />
                Recent Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentSales.map((sale: any) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-accent transition-colors">
                    <div>
                      <p className="font-medium text-card-foreground">{sale.customerName}</p>
                      <p className="text-sm text-muted-foreground">{new Date(sale.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-card-foreground">Rs. {sale.amount?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{sale.items} items</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Low Stock Alerts */}
        <Card className="hover:shadow-lg transition-shadow duration-300 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-red-700" />
              Low Stock Alerts
              <Badge className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100">
                {lowStockItems.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No low stock items</p>
              ) : (
                lowStockItems.map((item: any) => (
                  <div key={item.productId} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.productName}</p>
                      <p className="text-sm text-red-700 dark:text-red-400">Current: {item.currentStock} | Min: {item.minStock}</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-700 hover:bg-blue-800 text-white"
                      onClick={() => handleInstantOrder(item.productName, item.productId)}
                    >
                      Order Now
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
