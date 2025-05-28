
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Calendar, TrendingUp, Users, Package, CreditCard } from "lucide-react";

const Reports = () => {
  const [dateRange, setDateRange] = useState("today");
  const [reportType, setReportType] = useState("sales");

  // Mock data for reports
  const salesData = {
    today: { total: 15420, cash: 8950, credit: 6470, transactions: 12 },
    week: { total: 89540, cash: 52430, credit: 37110, transactions: 67 },
    month: { total: 456780, cash: 278900, credit: 177880, transactions: 289 }
  };

  const topProducts = [
    { name: "Door Hinges - Heavy Duty", quantity: 45, revenue: 2025 },
    { name: "Cabinet Handles - Chrome", quantity: 38, revenue: 950 },
    { name: "Drawer Slides - 18 inch", quantity: 22, revenue: 1870 },
    { name: "Wood Screws - 2 inch", quantity: 156, revenue: 1872 }
  ];

  const customersDue = [
    { name: "Afzal Hardware Co.", amount: 2340, days: 5 },
    { name: "ABC Furniture", amount: 1890, days: 3 },
    { name: "DEF Contractors", amount: 4560, days: 12 },
    { name: "GHI Builders", amount: 890, days: 2 }
  ];

  const inventoryReports = [
    { name: "Door Hinges - Heavy Duty", stock: 5, minStock: 20, status: "critical" },
    { name: "Cabinet Handles - Chrome", stock: 8, minStock: 25, status: "low" },
    { name: "Drawer Slides - 18 inch", stock: 3, minStock: 15, status: "critical" },
    { name: "Wood Screws - 2 inch", stock: 50, minStock: 100, status: "low" }
  ];

  const monthlyTrends = [
    { month: "Oct", sales: 345600, profit: 89400 },
    { month: "Nov", sales: 398700, profit: 103600 },
    { month: "Dec", sales: 425800, profit: 110700 },
    { month: "Jan", sales: 456780, profit: 118800 }
  ];

  const handleExportReport = () => {
    // In real app, this would generate and download the report
    console.log(`Exporting ${reportType} report for ${dateRange}`);
    alert(`${reportType.toUpperCase()} report for ${dateRange} would be downloaded`);
  };

  const getDateRangeData = () => {
    return salesData[dateRange] || salesData.today;
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Comprehensive business analytics and reports</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Sales ({dateRange})</p>
                <p className="text-2xl font-bold text-blue-600">Rs. {getDateRangeData().total.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Cash Sales</p>
                <p className="text-2xl font-bold text-green-600">Rs. {getDateRangeData().cash.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Credit Sales</p>
                <p className="text-2xl font-bold text-orange-600">Rs. {getDateRangeData().credit.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-purple-600">{getDateRangeData().transactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
          <TabsTrigger value="customers">Customer Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Top Selling Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">Qty sold: {product.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">Rs. {product.revenue.toLocaleString()}</p>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyTrends.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{month.month} 2024</p>
                        <p className="text-sm text-gray-500">Sales: Rs. {month.sales.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">Rs. {month.profit.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Profit</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Summary ({dateRange})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-blue-600">Rs. {getDateRangeData().total.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Sales</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                  <CreditCard className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-green-600">
                    {((getDateRangeData().cash / getDateRangeData().total) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Cash Sales</p>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
                  <Users className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-orange-600">
                    {((getDateRangeData().credit / getDateRangeData().total) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Credit Sales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-red-500" />
                  Stock Status Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryReports.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Current: {item.stock} | Minimum: {item.minStock}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={item.status === "critical" ? "destructive" : "secondary"}
                          className={item.status === "critical" ? "" : "bg-orange-100 text-orange-800"}
                        >
                          {item.status === "critical" ? "Critical" : "Low Stock"}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          Need: {item.minStock - item.stock} units
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <Package className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-blue-600">1,248</p>
                <p className="text-sm text-gray-600">Total Products</p>
              </Card>
              <Card className="text-center p-6">
                <Package className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-red-600">{inventoryReports.length}</p>
                <p className="text-sm text-gray-600">Low Stock Items</p>
              </Card>
              <Card className="text-center p-6">
                <Package className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-green-600">Rs. {(456780).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Inventory Value</p>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  Customers with Outstanding Dues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customersDue.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">Outstanding for {customer.days} days</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">Rs. {customer.amount.toLocaleString()}</p>
                        <Badge variant={customer.days > 7 ? "destructive" : "secondary"}>
                          {customer.days > 7 ? "Overdue" : "Due"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-blue-600">156</p>
                <p className="text-sm text-gray-600">Total Customers</p>
              </Card>
              <Card className="text-center p-6">
                <Users className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-green-600">89</p>
                <p className="text-sm text-gray-600">Active Customers</p>
              </Card>
              <Card className="text-center p-6">
                <CreditCard className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-red-600">Rs. {customersDue.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Dues</p>
              </Card>
              <Card className="text-center p-6">
                <Calendar className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-purple-600">12</p>
                <p className="text-sm text-gray-600">Avg Credit Days</p>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Income Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-green-50 rounded">
                      <span>Sales Revenue</span>
                      <span className="font-bold">Rs. 4,56,780</span>
                    </div>
                    <div className="flex justify-between p-3 bg-green-50 rounded">
                      <span>Other Income</span>
                      <span className="font-bold">Rs. 12,450</span>
                    </div>
                    <div className="flex justify-between p-3 bg-green-100 rounded border-t-2 border-green-300">
                      <span className="font-bold">Total Income</span>
                      <span className="font-bold text-green-600">Rs. 4,69,230</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Expense Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-red-50 rounded">
                      <span>Inventory Purchases</span>
                      <span className="font-bold">Rs. 2,85,600</span>
                    </div>
                    <div className="flex justify-between p-3 bg-red-50 rounded">
                      <span>Operational Expenses</span>
                      <span className="font-bold">Rs. 45,800</span>
                    </div>
                    <div className="flex justify-between p-3 bg-red-50 rounded">
                      <span>Other Expenses</span>
                      <span className="font-bold">Rs. 18,200</span>
                    </div>
                    <div className="flex justify-between p-3 bg-red-100 rounded border-t-2 border-red-300">
                      <span className="font-bold">Total Expenses</span>
                      <span className="font-bold text-red-600">Rs. 3,49,600</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Profit & Loss Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-4xl font-bold text-blue-600 mb-2">Rs. 1,19,630</p>
                  <p className="text-lg text-gray-600 mb-4">Net Profit This Month</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Gross Margin</p>
                      <p className="font-bold text-green-600">25.5%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Net Margin</p>
                      <p className="font-bold text-blue-600">25.5%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">ROI</p>
                      <p className="font-bold text-purple-600">34.2%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
