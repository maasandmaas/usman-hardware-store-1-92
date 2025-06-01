
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Calendar, TrendingUp, Users, Package, CreditCard, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/services/reportsApi";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const DynamicReports = () => {
  const [salesPeriod, setSalesPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [financialPeriod, setFinancialPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [financialYear, setFinancialYear] = useState(2024);

  // Fetch reports data
  const { data: salesReport, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-report', salesPeriod],
    queryFn: () => reportsApi.getSalesReport({ period: salesPeriod }),
  });

  const { data: inventoryReport, isLoading: inventoryLoading } = useQuery({
    queryKey: ['inventory-report'],
    queryFn: reportsApi.getInventoryReport,
  });

  const { data: financialReport, isLoading: financialLoading } = useQuery({
    queryKey: ['financial-report', financialPeriod, financialYear],
    queryFn: () => reportsApi.getFinancialReport({ period: financialPeriod, year: financialYear }),
  });

  const handleExportReport = (reportType: string) => {
    console.log(`Exporting ${reportType} report`);
    alert(`${reportType} report would be downloaded`);
  };

  if (salesLoading || inventoryLoading || financialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const salesData = salesReport?.data;
  const inventoryData = inventoryReport?.data?.inventoryReport;
  const financialData = financialReport?.data?.financialReport;

  // Chart configurations
  const revenueChartConfig = {
    totalSales: { label: "Sales", color: "#3b82f6" },
    totalOrders: { label: "Orders", color: "#10b981" },
  };

  const expenseChartConfig = {
    amount: { label: "Amount", color: "#ef4444" },
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="sales" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
            Sales Reports
          </TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
            Inventory Reports
          </TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
            Financial Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex gap-4 items-center">
              <Select value={salesPeriod} onValueChange={(value: any) => setSalesPeriod(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => handleExportReport('Sales')} className="bg-blue-700 hover:bg-blue-800">
                <Download className="h-4 w-4 mr-2" />
                Export Sales Report
              </Button>
            </div>

            {/* Sales Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-blue-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-blue-700" />
                    <div>
                      <p className="text-sm text-slate-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-blue-700">
                        Rs. {salesData?.summary?.totalRevenue?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-8 w-8 text-green-700" />
                    <div>
                      <p className="text-sm text-slate-600">Total Orders</p>
                      <p className="text-2xl font-bold text-green-700">
                        {salesData?.summary?.totalOrders?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-orange-700" />
                    <div>
                      <p className="text-sm text-slate-600">Avg Order Value</p>
                      <p className="text-2xl font-bold text-orange-700">
                        Rs. {salesData?.summary?.avgOrderValue?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-purple-700" />
                    <div>
                      <p className="text-sm text-slate-600">Growth Rate</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {salesData?.summary?.growth?.toFixed(1) || '0'}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sales Chart */}
            {salesData?.salesReport && (
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={revenueChartConfig} className="h-[400px] w-full">
                    <BarChart data={salesData.salesReport}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="totalSales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => handleExportReport('Inventory')} className="bg-blue-700 hover:bg-blue-800">
                <Download className="h-4 w-4 mr-2" />
                Export Inventory Report
              </Button>
            </div>

            {/* Inventory Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <Package className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-blue-600">
                  {inventoryData?.totalProducts?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-gray-600">Total Products</p>
              </Card>
              
              <Card className="text-center p-6">
                <CreditCard className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-green-600">
                  Rs. {inventoryData?.totalValue?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-gray-600">Total Value</p>
              </Card>
              
              <Card className="text-center p-6">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-red-600">
                  {inventoryData?.lowStockItems?.length || '0'}
                </p>
                <p className="text-sm text-gray-600">Low Stock Items</p>
              </Card>
            </div>

            {/* Low Stock Items */}
            {inventoryData?.lowStockItems && inventoryData.lowStockItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Low Stock Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventoryData.lowStockItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-500">
                            Current: {item.currentStock} | Minimum: {item.minStock}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive">Critical</Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            Reorder: {item.reorderQuantity} units
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fast Moving Items */}
            {inventoryData?.fastMovingItems && inventoryData.fastMovingItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Fast Moving Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventoryData.fastMovingItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-500">
                            Sold: {item.soldQuantity} units
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">Rs. {item.revenue.toLocaleString()}</p>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Top Seller
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex gap-4 items-center">
              <Select value={financialPeriod} onValueChange={(value: any) => setFinancialPeriod(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Select value={financialYear.toString()} onValueChange={(value) => setFinancialYear(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => handleExportReport('Financial')} className="bg-blue-700 hover:bg-blue-800">
                <Download className="h-4 w-4 mr-2" />
                Export Financial Report
              </Button>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Revenue Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-green-50 rounded border-t-2 border-green-300">
                      <span className="font-bold">Total Revenue</span>
                      <span className="font-bold text-green-600">
                        Rs. {financialData?.revenue?.total?.toLocaleString() || '0'}
                      </span>
                    </div>
                    {financialData?.revenue?.breakdown?.map((item, index) => (
                      <div key={index} className="flex justify-between p-3 bg-green-50 rounded">
                        <span>{item.month}</span>
                        <span className="font-bold">Rs. {item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Expense Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-red-50 rounded border-t-2 border-red-300">
                      <span className="font-bold">Total Expenses</span>
                      <span className="font-bold text-red-600">
                        Rs. {financialData?.expenses?.total?.toLocaleString() || '0'}
                      </span>
                    </div>
                    {financialData?.expenses?.breakdown?.map((item, index) => (
                      <div key={index} className="flex justify-between p-3 bg-red-50 rounded">
                        <span>{item.category}</span>
                        <span className="font-bold">Rs. {item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profit & Loss */}
            {financialData?.profit && (
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
                    <p className="text-4xl font-bold text-blue-600 mb-2">
                      Rs. {financialData.profit.net.toLocaleString()}
                    </p>
                    <p className="text-lg text-gray-600 mb-4">Net Profit</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Gross Profit</p>
                        <p className="font-bold text-green-600">
                          Rs. {financialData.profit.gross.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Net Margin</p>
                        <p className="font-bold text-blue-600">{financialData.profit.margin.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cash Flow</p>
                        <p className="font-bold text-purple-600">
                          Rs. {financialData.cashFlow?.closing?.toLocaleString() || '0'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DynamicReports;
