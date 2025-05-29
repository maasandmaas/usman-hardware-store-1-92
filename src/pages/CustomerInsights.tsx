
import { Users, Star, TrendingUp, Calendar, Eye, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const customerData = [
  { month: 'Jan', newCustomers: 12, returning: 35 },
  { month: 'Feb', newCustomers: 15, returning: 42 },
  { month: 'Mar', newCustomers: 18, returning: 38 },
  { month: 'Apr', newCustomers: 22, returning: 45 },
  { month: 'May', newCustomers: 19, returning: 48 },
  { month: 'Jun', newCustomers: 25, returning: 52 },
];

const topCustomers = [
  {
    name: 'Ahmad Furniture',
    totalSpent: 125000,
    orders: 15,
    lastOrder: '2024-12-28',
    status: 'Premium'
  },
  {
    name: 'Hassan Carpentry',
    totalSpent: 95000,
    orders: 12,
    lastOrder: '2024-12-27',
    status: 'Gold'
  },
  {
    name: 'Modern Wood Works',
    totalSpent: 82000,
    orders: 10,
    lastOrder: '2024-12-26',
    status: 'Gold'
  },
  {
    name: 'Classic Furniture',
    totalSpent: 68000,
    orders: 8,
    lastOrder: '2024-12-25',
    status: 'Silver'
  }
];

export default function CustomerInsights() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Insights</h1>
          <p className="text-gray-600">Analyze customer behavior and preferences</p>
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">248</p>
                <p className="text-sm text-blue-600">+18% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Repeat Rate</p>
                <p className="text-2xl font-bold text-gray-900">68%</p>
                <p className="text-sm text-green-600">+5% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Lifetime Value</p>
                <p className="text-2xl font-bold text-gray-900">Rs. 45K</p>
                <p className="text-sm text-purple-600">+12% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Days Between Orders</p>
                <p className="text-2xl font-bold text-gray-900">28</p>
                <p className="text-sm text-orange-600">-3 days improved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Acquisition Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Acquisition Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="newCustomers" fill="#3b82f6" name="New Customers" />
                <Bar dataKey="returning" fill="#10b981" name="Returning Customers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>Rs. {customer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>{customer.lastOrder}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        customer.status === 'Premium' ? 'bg-purple-100 text-purple-800' :
                        customer.status === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
