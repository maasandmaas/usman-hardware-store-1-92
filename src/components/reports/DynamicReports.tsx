
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Package2, 
  Users, 
  DollarSign,
  Calendar,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { reportsApi } from '@/services/reportsApi';
import { useToast } from '@/hooks/use-toast';

// Sample data for better visualization
const sampleCashFlowData = [
  { month: 'Jan', inflow: 85000, outflow: 45000, net: 40000 },
  { month: 'Feb', inflow: 92000, outflow: 52000, net: 40000 },
  { month: 'Mar', inflow: 78000, outflow: 38000, net: 40000 },
  { month: 'Apr', inflow: 105000, outflow: 65000, net: 40000 },
  { month: 'May', inflow: 125000, outflow: 75000, net: 50000 },
  { month: 'Jun', inflow: 110000, outflow: 60000, net: 50000 }
];

const sampleCategoryData = [
  { name: 'Taj Sheets', value: 45, revenue: 125000, color: '#3b82f6' },
  { name: 'UV Sheets', value: 25, revenue: 85000, color: '#10b981' },
  { name: 'Test Category', value: 20, revenue: 65000, color: '#f59e0b' },
  { name: 'Hardware', value: 10, revenue: 35000, color: '#ef4444' }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const DynamicReports = () => {
  const { toast } = useToast();
  const [salesData, setSalesData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchReportsData();
  }, [selectedPeriod, selectedYear]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      
      const [salesResponse, inventoryResponse, financialResponse] = await Promise.all([
        reportsApi.getSalesReport({ period: selectedPeriod as any }),
        reportsApi.getInventoryReport(),
        reportsApi.getFinancialReport({ period: selectedPeriod as any, year: selectedYear })
      ]);

      if (salesResponse.success) setSalesData(salesResponse.data);
      if (inventoryResponse.success) setInventoryData(inventoryResponse.data);
      if (financialResponse.success) setFinancialData(financialResponse.data);

    } catch (error) {
      console.error('Failed to fetch reports data:', error);
      toast({
        title: "Error",
        description: "Failed to load reports data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    trendValue,
    bgColor = "bg-gradient-to-br from-blue-50 to-blue-100",
    iconColor = "text-blue-600",
    borderColor = "border-blue-200"
  }) => (
    <Card className={`${bgColor} ${borderColor} border-2 shadow-sm hover:shadow-md transition-all duration-300`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-2 text-xs ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : 
                 trend === 'down' ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
                {trendValue}
              </div>
            )}
          </div>
          <div className={`${iconColor} opacity-80`}>
            <Icon size={32} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">Revenue: {formatCurrency(data.revenue)}</p>
          <p className="text-sm text-gray-600">Share: {data.value}%</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading reports...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Reports</h2>
          <p className="text-gray-600">Comprehensive analytics and insights</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={fetchReportsData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Compact Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(salesData?.summary?.totalRevenue || 125000)}
          subtitle="vs yesterday"
          icon={DollarSign}
          trend="up"
          trendValue="+12.5%"
          bgColor="bg-gradient-to-br from-green-50 to-green-100"
          iconColor="text-green-600"
          borderColor="border-green-200"
        />
        
        <StatCard
          title="Today's Orders"
          value={salesData?.summary?.totalOrders || 25}
          subtitle={`Avg: ${formatCurrency(salesData?.summary?.avgOrderValue || 5000)}`}
          icon={ShoppingCart}
          trend="up"
          trendValue="+8.3%"
          bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
          iconColor="text-blue-600"
          borderColor="border-blue-200"
        />
        
        <StatCard
          title="Low Stock Items"
          value={inventoryData?.inventoryReport?.lowStockItems?.length || 15}
          subtitle={`Value: ${formatCurrency(75000)}`}
          icon={Package2}
          trend="down"
          trendValue="Requires attention"
          bgColor="bg-gradient-to-br from-red-50 to-red-100"
          iconColor="text-red-600"
          borderColor="border-red-200"
        />
        
        <StatCard
          title="Total Customers"
          value={salesData?.summary?.totalCustomers || 295}
          subtitle={`Avg: ${formatCurrency(5200)}`}
          icon={Users}
          trend="up"
          trendValue="+5.2%"
          bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
          iconColor="text-purple-600"
          borderColor="border-purple-200"
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Cash Flow Analysis */}
            <Card className="col-span-1">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Cash Flow Analysis
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Monthly inflows vs outflows (PKR)</p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Net Positive
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    inflow: { label: "Cash Inflow", color: "#10b981" },
                    outflow: { label: "Cash Outflow", color: "#ef4444" },
                    net: { label: "Net Flow", color: "#3b82f6" }
                  }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sampleCashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                        tickFormatter={(value) => `${value/1000}k`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                      />
                      <Bar 
                        dataKey="inflow" 
                        name="Cash Inflow"
                        fill="#10b981" 
                        radius={[4, 4, 0, 0]}
                        opacity={0.8}
                      />
                      <Bar 
                        dataKey="outflow" 
                        name="Cash Outflow"
                        fill="#ef4444" 
                        radius={[4, 4, 0, 0]}
                        opacity={0.8}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Enhanced Sales by Category */}
            <Card className="col-span-1">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Package2 className="h-5 w-5 text-green-600" />
                      Sales by Category
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Revenue distribution across categories</p>
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    4 Categories
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    category: { label: "Category" }
                  }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sampleCategoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {sampleCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <p className="text-sm text-gray-600">Detailed performance metrics and trends</p>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">Advanced analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Reports</CardTitle>
              <p className="text-sm text-gray-600">Generate and export comprehensive reports</p>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">Report generation coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Business Notifications</CardTitle>
              <p className="text-sm text-gray-600">Important alerts and notifications</p>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">No notifications at this time</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DynamicReports;
