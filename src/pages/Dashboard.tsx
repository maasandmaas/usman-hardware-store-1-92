import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, Tooltip } from "recharts"
import { DollarSign, TrendingUp, Package, Users, AlertTriangle, CheckCircle, ShoppingCart, Target } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "@/services/api"

// Enhanced Chart configurations with beautiful colors
const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "#3b82f6",
  },
  orders: {
    label: "Orders",
    color: "#10b981",
  },
}

const categoryChartConfig = {
  sheets: { label: "Sheets", color: "#3b82f6" },
  uncategorized: { label: "Uncategorized", color: "#ef4444" },
  new: { label: "New", color: "#10b981" },
  electronics: { label: "Electronics", color: "#f59e0b" },
  plus: { label: "Plus", color: "#8b5cf6" },
}

const salesChartConfig = {
  sales: {
    label: "Actual Sales",
    color: "#10b981",
  },
  target: {
    label: "Target",
    color: "#f59e0b",
  },
}

const inventoryChartConfig = {
  stock: {
    label: "Current Stock",
    color: "#3b82f6",
  },
  sold: {
    label: "Units Sold",
    color: "#10b981",
  },
  reorderLevel: {
    label: "Reorder Level",
    color: "#ef4444",
  },
}

export default function Dashboard() {
  // Fetch dashboard data
  const { data: enhancedStats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-enhanced-stats'],
    queryFn: dashboardApi.getEnhancedStats,
  })

  const { data: revenueTrend, isLoading: revenueLoading } = useQuery({
    queryKey: ['dashboard-revenue-trend'],
    queryFn: dashboardApi.getRevenueTrend,
  })

  const { data: categoryPerformance, isLoading: categoryLoading } = useQuery({
    queryKey: ['dashboard-category-performance'],
    queryFn: dashboardApi.getCategoryPerformance,
  })

  const { data: dailySales, isLoading: salesLoading } = useQuery({
    queryKey: ['dashboard-daily-sales'],
    queryFn: dashboardApi.getDailySales,
  })

  const { data: inventoryStatus, isLoading: inventoryLoading } = useQuery({
    queryKey: ['dashboard-inventory-status'],
    queryFn: dashboardApi.getInventoryStatus,
  })

  // Loading state
  if (statsLoading || revenueLoading || categoryLoading || salesLoading || inventoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const stats = enhancedStats?.data
  const revenueData = revenueTrend?.data || []
  const categoryData = categoryPerformance?.data || []
  const salesData = dailySales?.data || []
  const inventoryData = inventoryStatus?.data || []

  // Format category data for pie chart
  const formattedCategoryData = categoryData.map(item => ({
    name: item.category,
    value: item.amount,
    percentage: item.value,
    unitsSold: item.unitsSold
  }))

  // Get colors for pie chart
  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'Sheets': '#3b82f6',
      'Uncategorized': '#ef4444', 
      'New': '#10b981',
      'Electronics': '#f59e0b',
      'Plus': '#8b5cf6'
    }
    return colorMap[category] || '#6b7280'
  }

  return (
    <div className="flex-1 space-y-4 p-2 sm:p-4 md:p-6 lg:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs sm:text-sm">Reports</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Overview Cards */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Today's Revenue</CardTitle>
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">
                  Rs. {stats?.financial?.todayRevenue?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.financial?.revenueGrowth > 0 ? '+' : ''}
                  {stats?.financial?.revenueGrowth?.toFixed(1) || '0'}% from yesterday
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Today's Orders</CardTitle>
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">
                  {stats?.sales?.todaySales?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg. Order Value: Rs. {stats?.sales?.avgOrderValue?.toLocaleString() || '0'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Low Stock Items</CardTitle>
                <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">
                  {stats?.inventory?.lowStockItems || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total Value: Rs. {stats?.inventory?.totalInventoryValue?.toLocaleString() || '0'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">
                  {stats?.customers?.totalCustomers?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg. Value: Rs. {stats?.customers?.avgCustomerValue?.toLocaleString() || '0'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
            {/* Revenue Trend Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Revenue Trend
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Daily revenue and orders over time</CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <ChartContainer config={revenueChartConfig} className="h-[250px] sm:h-[300px] w-full">
                  <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="period" 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `Rs. ${(value / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value, name) => [
                          name === 'revenue' ? `Rs. ${value.toLocaleString()}` : value,
                          name === 'revenue' ? 'Revenue' : 'Orders'
                        ]}
                      />} 
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Sales by Category Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  Sales by Category
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Product category performance breakdown</CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <ChartContainer config={categoryChartConfig} className="h-[250px] sm:h-[300px] w-full">
                  <PieChart>
                    <Pie
                      data={formattedCategoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      labelLine={false}
                    >
                      {formattedCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value, name, props) => [
                          `Rs. ${props.payload.value.toLocaleString()}`,
                          `${props.payload.name} (${props.payload.unitsSold} units sold)`
                        ]}
                      />} 
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Daily Sales vs Target */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                  Sales vs Target
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Last 14 days performance comparison</CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <ChartContainer config={salesChartConfig} className="h-[250px] sm:h-[300px] w-full">
                  <BarChart data={salesData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `Rs. ${(value / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value, name) => [
                          `Rs. ${value.toLocaleString()}`,
                          name === 'sales' ? 'Actual Sales' : 'Target'
                        ]}
                      />} 
                    />
                    <Bar dataKey="sales" fill="#10b981" radius={[2, 2, 0, 0]} name="Actual Sales" />
                    <Bar dataKey="target" fill="#f59e0b" radius={[2, 2, 0, 0]} name="Target" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Inventory Status */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  Inventory Status
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Current stock levels by category</CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <ChartContainer config={inventoryChartConfig} className="h-[250px] sm:h-[300px] w-full">
                  <BarChart 
                    data={inventoryData} 
                    layout="vertical" 
                    margin={{ top: 5, right: 15, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      type="number" 
                      tick={{ fontSize: 10, fill: '#64748b' }} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      dataKey="category" 
                      type="category" 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                      width={60}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value, name) => [
                          value,
                          name === 'stock' ? 'Current Stock' : 
                          name === 'sold' ? 'Units Sold' : 'Reorder Level'
                        ]}
                      />} 
                    />
                    <Bar dataKey="stock" fill="#3b82f6" radius={[0, 2, 2, 0]} name="Current Stock" />
                    <Bar dataKey="sold" fill="#10b981" radius={[0, 2, 2, 0]} name="Units Sold" />
                    <Bar dataKey="reorderLevel" fill="#ef4444" radius={[0, 2, 2, 0]} name="Reorder Level" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm sm:text-base">Recent High-Value Sales</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Latest high-value transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {stats?.sales?.highValueSales?.slice(0, 5).map((sale, index) => (
                    <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium">{sale.customer}</p>
                          <p className="text-xs text-muted-foreground">Order #{sale.orderNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-medium">Rs. {sale.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{sale.date}</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-xs sm:text-sm text-muted-foreground">No recent sales data</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm sm:text-base">System Alerts</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Important notifications and warnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {stats?.inventory?.lowStockItems > 0 && (
                    <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                      <div>
                        <p className="text-xs sm:text-sm font-medium">Low Stock Alert</p>
                        <p className="text-xs text-muted-foreground">
                          {stats.inventory.lowStockItems} items running low
                        </p>
                      </div>
                    </div>
                  )}
                  {stats?.inventory?.outOfStockItems > 0 && (
                    <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                      <div>
                        <p className="text-xs sm:text-sm font-medium">Out of Stock</p>
                        <p className="text-xs text-muted-foreground">
                          {stats.inventory.outOfStockItems} items out of stock
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium">System Status</p>
                      <p className="text-xs text-muted-foreground">All systems operational</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.financial?.profitMargin?.toFixed(1) || '0'}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Net Profit: Rs. {stats?.financial?.netProfit?.toLocaleString() || '0'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.inventory?.inventoryTurnover?.toFixed(2) || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Times per period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receivables</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rs. {stats?.customers?.totalReceivables?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Outstanding amount
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Avg Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rs. {stats?.performance?.dailyAvgRevenue?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average per day
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view detailed reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Report generation features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>System alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.alerts?.map((alert, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-muted-foreground">No notifications at this time</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
