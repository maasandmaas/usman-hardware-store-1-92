
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowUpIcon, ArrowDownIcon, Package, DollarSign, Users, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { dashboardApi } from "@/services/api";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getStats();
      
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Fallback data for demo
      setDashboardData({
        totalRevenue: 1450000,
        totalOrders: 342,
        totalCustomers: 156,
        lowStockItems: 12,
        recentSales: [
          { id: 1, customerName: "Ahmad Furniture", amount: 15000, date: "2024-11-28", items: 3 }
        ],
        monthlyRevenue: [
          { month: "Jan", revenue: 145000 },
          { month: "Feb", revenue: 165000 }
        ],
        topProducts: [
          { id: 1, name: "Heavy Duty Hinges", sales: 45000, quantity: 120 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6 min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 min-h-screen bg-background">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Usman Hardware Management System</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  PKR {dashboardData?.totalRevenue?.toLocaleString() || '0'}
                </p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpIcon className="h-4 w-4" />
                  <span>+12.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData?.totalOrders || 0}
                </p>
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <ArrowUpIcon className="h-4 w-4" />
                  <span>+8.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardData?.totalCustomers || 0}
                </p>
                <div className="flex items-center gap-1 text-sm text-purple-600">
                  <ArrowUpIcon className="h-4 w-4" />
                  <span>+15.3%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">
                  {dashboardData?.lowStockItems || 0}
                </p>
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <ArrowDownIcon className="h-4 w-4" />
                  <span>-2.1%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData?.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData?.topProducts || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData?.recentSales?.map((sale: any) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{sale.customerName}</p>
                  <p className="text-sm text-muted-foreground">{sale.date} • {sale.items} items</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">PKR {sale.amount?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
