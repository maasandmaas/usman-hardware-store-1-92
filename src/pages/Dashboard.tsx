
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Users, Package, ShoppingCart, Database, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { products, customers } from "@/data/storeData";

const Dashboard = () => {
  // Calculate real-time stats from centralized data
  const todayStats = {
    totalSales: 15420,
    cashSales: 8950,
    creditSales: 6470,
    customersDue: customers.reduce((sum, customer) => sum + customer.currentDue, 0),
    lowStockItems: products.filter(product => product.stock <= product.minStock).length,
    totalCustomers: customers.length,
    totalProducts: products.length
  };

  const recentSales = [
    { id: "001", customer: "Muhammad Afzal Construction", amount: 5500, type: "credit", time: "10:30 AM" },
    { id: "002", customer: "Walk-in Customer", amount: 2500, type: "cash", time: "11:15 AM" },
    { id: "003", customer: "Shahid Furniture Works", amount: 3200, type: "credit", time: "12:45 PM" },
    { id: "004", customer: "Walk-in Customer", amount: 850, type: "cash", time: "1:20 PM" },
  ];

  const lowStockItems = products
    .filter(product => product.stock <= product.minStock)
    .slice(0, 4);

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Section with Animation */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:scale-110 transition-transform duration-200" />
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 text-sm md:text-base">Welcome to Usman Hardware Store - Hafizabad</p>
          </div>
        </div>
        <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 hover:bg-green-100 transition-colors duration-200 animate-pulse">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></div>
          Store Open
        </Badge>
      </div>

      {/* Key Metrics with Stagger Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            title: "Today's Sales",
            value: `Rs. ${todayStats.totalSales.toLocaleString()}`,
            icon: ShoppingCart,
            color: "blue",
            trend: "+12%",
            delay: "animation-delay-75"
          },
          {
            title: "Cash Sales",
            value: `Rs. ${todayStats.cashSales.toLocaleString()}`,
            icon: DollarSign,
            color: "green",
            percentage: `${((todayStats.cashSales / todayStats.totalSales) * 100).toFixed(1)}% of total`,
            delay: "animation-delay-150"
          },
          {
            title: "Credit Sales",
            value: `Rs. ${todayStats.creditSales.toLocaleString()}`,
            icon: Users,
            color: "orange",
            percentage: `${((todayStats.creditSales / todayStats.totalSales) * 100).toFixed(1)}% of total`,
            delay: "animation-delay-300"
          },
          {
            title: "Pending Dues",
            value: `Rs. ${todayStats.customersDue.toLocaleString()}`,
            icon: AlertTriangle,
            color: "red",
            subtitle: `From ${todayStats.totalCustomers} customers`,
            delay: "animation-delay-500"
          }
        ].map((metric, index) => (
          <Card key={index} className={`group border-l-4 border-l-${metric.color}-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm animate-fade-in ${metric.delay}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{metric.title}</CardTitle>
              <metric.icon className={`h-5 w-5 text-${metric.color}-500 group-hover:scale-110 transition-transform duration-200`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold text-${metric.color}-600 mb-1`}>{metric.value}</div>
              {metric.trend && (
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {metric.trend} from yesterday
                </div>
              )}
              {metric.percentage && (
                <div className="text-xs text-gray-500">{metric.percentage}</div>
              )}
              {metric.subtitle && (
                <div className="text-xs text-gray-500">{metric.subtitle}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all duration-300 animate-fade-in animation-delay-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Products</p>
                <p className="text-3xl font-bold">{todayStats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg transition-all duration-300 animate-fade-in animation-delay-1000">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Low Stock Alerts</p>
                <p className="text-3xl font-bold">{todayStats.lowStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-200 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg transition-all duration-300 animate-fade-in animation-delay-1300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Active Customers</p>
                <p className="text-3xl font-bold">{customers.filter(c => c.status === 'active').length}</p>
              </div>
              <Users className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales with Enhanced Styling */}
        <Card className="hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm animate-fade-in animation-delay-1600">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              Recent Sales Today
              <Badge className="ml-auto bg-blue-500 text-white animate-pulse">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {recentSales.map((sale, index) => (
                <div key={sale.id} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-all duration-200 group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {sale.customer}
                      </p>
                      <p className="text-sm text-gray-500">{sale.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-lg">Rs. {sale.amount.toLocaleString()}</p>
                    <Badge 
                      variant={sale.type === 'cash' ? 'default' : 'secondary'} 
                      className={`text-xs ${sale.type === 'cash' ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'} text-white transition-colors`}
                    >
                      {sale.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts with Enhanced Styling */}
        <Card className="hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm animate-fade-in animation-delay-1900">
          <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-red-500 rounded-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
              Low Stock Alerts
              <Badge variant="destructive" className="ml-2 animate-bounce">
                {lowStockItems.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {lowStockItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-4 border-b last:border-b-0 bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition-all duration-200 group">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-sm text-red-600">
                        Current: <span className="font-semibold">{item.stock}</span> {item.unit} | 
                        Min: <span className="font-semibold">{item.minStock}</span> {item.unit}
                      </p>
                    </div>
                  </div>
                  <Badge variant="destructive" className="animate-pulse">
                    Critical
                  </Badge>
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
