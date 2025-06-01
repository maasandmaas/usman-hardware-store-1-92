import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from "recharts"
import { DollarSign, TrendingUp, Package, Users, AlertTriangle, CheckCircle, ShoppingCart, Target, ArrowUpDown } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "@/services/api"

// Enhanced Chart configurations with beautiful colors
const cashFlowChartConfig = {
  inflow: {
    label: "Cash Inflow",
    color: "#10b981",
  },
  outflow: {
    label: "Cash Outflow",
    color: "#ef4444",
  },
  net: {
    label: "Net Cash Flow",
    color: "#3b82f6",
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
  if (statsLoading || categoryLoading || salesLoading || inventoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const stats = enhancedStats?.data
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

  // Create cash flow data from stats
  const cashFlowData = [
    {
      period: "Opening",
      inflow: 0,
      outflow: 0,
      net: stats?.cashFlow?.monthlyInflows - stats?.cashFlow?.monthlyOutflows || 0
    },
    {
      period: "Current",
      inflow: stats?.cashFlow?.monthlyInflows || 0,
      outflow: stats?.cashFlow?.monthlyOutflows || 0,
      net: stats?.cashFlow?.netCashFlow || 0
    }
  ]

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
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs sm:text-sm">Reports</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Overview Cards */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Today's Revenue</CardTitle>
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">
                  Rs. {stats?.financial?.todayRevenue?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-green-600">
                  {stats?.financial?.revenueGrowth > 0 ? '+' : ''}
                  {stats?.financial?.revenueGrowth?.toFixed(1) || '0'}% from yesterday
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Today's Orders</CardTitle>
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                  {stats?.sales?.todaySales?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg: Rs. {stats?.sales?.avgOrderValue?.toLocaleString() || '0'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Low Stock Items</CardTitle>
                <Package className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg sm:text-2xl font-bold text-red-600">
                  {stats?.inventory?.lowStockItems || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Value: Rs. {(stats?.inventory?.totalInventoryValue / 1000)?.toFixed(0) || '0'}k
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg sm:text-2xl font-bold text-purple-600">
                  {stats?.customers?.totalCustomers?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg: Rs. {stats?.customers?.avgCustomerValue?.toLocaleString() || '0'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Four Main Charts in a 2x2 Grid with Fixed Height */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mb-8">
            {/* Cash Flow Chart */}
            <Card className="col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <ArrowUpDown className="h-5 w-5 text-blue-600" />
                  Cash Flow Analysis
                </CardTitle>
                <CardDescription className="text-sm">Monthly cash inflow vs outflow</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ChartContainer config={cashFlowChartConfig} className="h-[300px] w-full">
                  <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="period" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value, name) => [
                          `Rs. ${value.toLocaleString()}`,
                          name === 'inflow' ? 'Inflow' : 
                          name === 'outflow' ? 'Outflow' : 'Net Flow'
                        ]}
                      />} 
                    />
                    <Bar dataKey="inflow" fill="#10b981" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="outflow" fill="#ef4444" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="net" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Sales by Category Chart */}
            <Card className="col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Package className="h-5 w-5 text-green-600" />
                  Sales by Category
                </CardTitle>
                <CardDescription className="text-sm">Category performance breakdown</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ChartContainer config={categoryChartConfig} className="h-[300px] w-full">
                  <PieChart>
                    <Pie
                      data={formattedCategoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ percentage }) => `${percentage}%`}
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
                          `${props.payload.name}`
                        ]}
                      />} 
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Sales vs Target */}
            <Card className="col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Target className="h-5 w-5 text-orange-600" />
                  Sales vs Target
                </CardTitle>
                <CardDescription className="text-sm">Performance comparison</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ChartContainer config={salesChartConfig} className="h-[300px] w-full">
                  <BarChart data={salesData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value, name) => [
                          `Rs. ${value.toLocaleString()}`,
                          name === 'sales' ? 'Actual' : 'Target'
                        ]}
                      />} 
                    />
                    <Bar dataKey="sales" fill="#10b981" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="target" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Inventory Status */}
            <Card className="col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Package className="h-5 w-5 text-purple-600" />
                  Inventory Status
                </CardTitle>
                <CardDescription className="text-sm">Stock levels by category</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ChartContainer config={inventoryChartConfig} className="h-[300px] w-full">
                  <BarChart 
                    data={inventoryData} 
                    layout="vertical" 
                    margin={{ top: 10, right: 15, left: 60, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      type="number" 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      dataKey="category" 
                      type="category" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                      width={60}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value, name) => [
                          value,
                          name === 'stock' ? 'Stock' : 
                          name === 'sold' ? 'Sold' : 'Reorder'
                        ]}
                      />} 
                    />
                    <Bar dataKey="stock" fill="#3b82f6" radius={[0, 2, 2, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information Sections - Now properly below charts */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 mt-8">
            {/* Recent High-Value Sales */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Recent High-Value Sales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats?.sales?.highValueSales?.slice(0, 3).map((sale, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{sale.customer}</p>
                      <p className="text-xs text-muted-foreground">#{sale.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">Rs. {sale.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{sale.date}</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-muted-foreground">No recent sales</p>
                )}
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats?.inventory?.lowStockItems > 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Low Stock Alert</p>
                      <p className="text-xs text-muted-foreground">
                        {stats.inventory.lowStockItems} items running low
                      </p>
                    </div>
                  </div>
                )}
                {stats?.inventory?.outOfStockItems > 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">Out of Stock</p>
                      <p className="text-xs text-muted-foreground">
                        {stats.inventory.outOfStockItems} items unavailable
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">System Operational</p>
                    <p className="text-xs text-muted-foreground">All systems running</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Profit Margin</span>
                  <span className="text-sm font-bold text-blue-600">
                    {stats?.financial?.profitMargin?.toFixed(1) || '0'}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">Receivables</span>
                  <span className="text-sm font-bold text-purple-600">
                    Rs. {(stats?.customers?.totalReceivables / 1000)?.toFixed(0) || '0'}k
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Daily Avg Revenue</span>
                  <span className="text-sm font-bold text-green-600">
                    Rs. {(stats?.performance?.dailyAvgRevenue / 1000)?.toFixed(0) || '0'}k
                  </span>
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
