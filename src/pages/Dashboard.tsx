
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Users, Package, ShoppingCart, Database } from "lucide-react";

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

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to Usman Hardware Store Management System</p>
          </div>
        </div>
        <Badge variant="outline" className="text-green-700 border-green-300">
          Store Open
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
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

        <Card className="border-l-4 border-l-green-500">
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

        <Card className="border-l-4 border-l-orange-500">
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

        <Card className="border-l-4 border-l-red-500">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
              Recent Sales Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-500" />
              Low Stock Alerts
              <Badge variant="destructive" className="ml-2">{lowStockItems.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-red-600">Current: {item.current} | Min: {item.minimum}</p>
                  </div>
                  <Badge variant="destructive">Low Stock</Badge>
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
