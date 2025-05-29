import { Bell, CheckCircle, AlertTriangle, Info, Clock, Trash2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const notifications = [
  {
    id: 1,
    type: "urgent",
    title: "Payment Due Today",
    message: "Ahmad Furniture needs to pay Rs. 15,000 for invoice #INV-2024-045. Contact immediately to avoid overdue status.",
    time: "Due today",
    read: false,
    actionRequired: true
  },
  {
    id: 2,
    type: "warning", 
    title: "Low Stock Alert",
    message: "Heavy Duty Hinges (Gold Finish) - Only 3 units remaining in inventory. Consider reordering from supplier.",
    time: "30 minutes ago",
    read: false,
    actionRequired: true
  },
  {
    id: 3,
    type: "info",
    title: "Customer Follow-up Required",
    message: "Hassan Carpentry requested a follow-up call regarding their quotation for drawer slides. Best time to call: 2-4 PM.",
    time: "2 hours ago", 
    read: false,
    actionRequired: true
  },
  {
    id: 4,
    type: "success",
    title: "Daily Target Achievement",
    message: "Congratulations! You've achieved 85% of today's sales target. Rs. 7,500 more needed to reach daily goal.",
    time: "4 hours ago",
    read: true,
    actionRequired: false
  },
  {
    id: 5,
    type: "urgent",
    title: "Overdue Payment Alert",
    message: "Classic Furniture has an overdue payment of Rs. 25,000 (7 days overdue). Immediate action required.",
    time: "Yesterday",
    read: false,
    actionRequired: true
  },
  {
    id: 6,
    type: "info",
    title: "New Order Received",
    message: "Modern Wood Works placed a new order #ORD-2024-125 worth Rs. 18,500. Order processing required.",
    time: "Yesterday",
    read: true,
    actionRequired: false
  }
];

const urgentNotifications = notifications.filter(n => n.type === "urgent");
const actionRequired = notifications.filter(n => n.actionRequired);
const unreadNotifications = notifications.filter(n => !n.read);

export default function Notifications() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning': return <Clock className="h-5 w-5 text-amber-600" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBgColor = (type: string, read: boolean) => {
    if (!read) {
      switch (type) {
        case 'urgent': return 'bg-red-50 border-red-200';
        case 'warning': return 'bg-amber-50 border-amber-200'; 
        case 'success': return 'bg-green-50 border-green-200';
        default: return 'bg-blue-50 border-blue-200';
      }
    }
    return 'bg-white border-gray-200';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with important business alerts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Mark All Read</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Bell className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-gray-900">{urgentNotifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Action Required</p>
                <p className="text-2xl font-bold text-gray-900">{actionRequired.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{unreadNotifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="urgent">Urgent ({urgentNotifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadNotifications.length})</TabsTrigger>
              <TabsTrigger value="action">Action Required ({actionRequired.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-4 border rounded-lg ${getBgColor(notification.type, notification.read)}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                          {!notification.read && <Badge className="bg-red-500">New</Badge>}
                          {notification.actionRequired && <Badge variant="outline" className="text-orange-600 border-orange-600">Action Required</Badge>}
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                        <p className="text-gray-500 text-xs">{notification.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="urgent" className="space-y-4">
              {urgentNotifications.map((notification) => (
                <div key={notification.id} className={`p-4 border rounded-lg ${getBgColor(notification.type, notification.read)}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                          {!notification.read && <Badge className="bg-red-500">New</Badge>}
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                        <p className="text-gray-500 text-xs">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="unread" className="space-y-4">
              {unreadNotifications.map((notification) => (
                <div key={notification.id} className={`p-4 border rounded-lg ${getBgColor(notification.type, notification.read)}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                          <Badge className="bg-red-500">New</Badge>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                        <p className="text-gray-500 text-xs">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="action" className="space-y-4">
              {actionRequired.map((notification) => (
                <div key={notification.id} className={`p-4 border rounded-lg ${getBgColor(notification.type, notification.read)}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                          <Badge variant="outline" className="text-orange-600 border-orange-600">Action Required</Badge>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                        <p className="text-gray-500 text-xs">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
