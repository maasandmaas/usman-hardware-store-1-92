
import { useState } from "react";
import { Bell, Search, User, ChevronDown, Settings, LogOut, Calendar, TrendingUp, DollarSign, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const adminNotifications = [
  {
    id: 1,
    title: "Payment Due Today",
    message: "Ahmad Furniture needs to pay Rs. 15,000 for invoice #INV-2024-045. Contact immediately.",
    time: "Due today",
    type: "urgent",
    unread: true
  },
  {
    id: 2,
    title: "Low Stock Alert",
    message: "Heavy Duty Hinges (Gold Finish) - Only 3 units remaining. Reorder required.",
    time: "30 mins ago",
    type: "warning",
    unread: true
  },
  {
    id: 3,
    title: "Customer Follow-up",
    message: "Hassan Carpentry requested quotation follow-up for drawer slides order.",
    time: "2 hours ago",
    type: "info",
    unread: true
  },
  {
    id: 4,
    title: "Daily Target",
    message: "You've achieved 85% of today's sales target. Rs. 7,500 more to reach goal.",
    time: "4 hours ago",
    type: "success",
    unread: false
  }
];

export function Header() {
  const [unreadCount, setUnreadCount] = useState(adminNotifications.filter(n => n.unread).length);
  const { toast } = useToast();
  const navigate = useNavigate();

  const markAllAsRead = () => {
    setUnreadCount(0);
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
    });
  };

  const quickStats = [
    { label: "Today's Sales", value: "Rs. 38,500", icon: DollarSign, color: "text-green-600" },
    { label: "Pending Orders", value: "12", icon: Package, color: "text-blue-600" },
    { label: "Due Payments", value: "Rs. 45,000", icon: TrendingUp, color: "text-red-600" }
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
      {/* Left Section - Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search products, customers, orders..."
            className="w-full pl-10 bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Center Section - Quick Stats (Hidden on small screens) */}
      <div className="hidden lg:flex items-center gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
            <div className="text-center">
              <p className="text-xs text-slate-600">{stat.label}</p>
              <p className="text-sm font-semibold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/calendar")}
          className="text-slate-600 hover:text-slate-900 hidden md:flex"
        >
          <Calendar className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative text-slate-600 hover:text-slate-900">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Admin Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Mark all read
                </Button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {adminNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                    notification.unread ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'urgent' ? 'bg-red-500' :
                      notification.type === 'warning' ? 'bg-amber-500' :
                      notification.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">{notification.title}</p>
                      <p className="text-slate-600 text-xs mt-1">{notification.message}</p>
                      <p className="text-slate-400 text-xs mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Admin Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-8 px-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-blue-600 text-white text-xs">UH</AvatarFallback>
              </Avatar>
              <span className="text-sm text-slate-700 hidden md:block">Admin</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">Usman Hardware</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
