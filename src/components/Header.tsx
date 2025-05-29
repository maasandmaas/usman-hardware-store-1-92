
import { useState } from "react";
import { Bell, Search, User, ChevronDown, Settings, LogOut, Calendar, TrendingUp, DollarSign, Users, Package, Maximize, Minimize, Moon, Sun } from "lucide-react";
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const markAllAsRead = () => {
    setUnreadCount(0);
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    toast({
      title: "Theme Changed",
      description: `Switched to ${isDarkMode ? 'light' : 'dark'} mode`,
    });
  };

  const quickStats = [
    { label: "Today's Sales", value: "Rs. 38,500", icon: DollarSign, color: "text-green-600" },
    { label: "Pending Orders", value: "12", icon: Package, color: "text-blue-600" },
    { label: "Due Payments", value: "Rs. 45,000", icon: TrendingUp, color: "text-red-600" }
  ];

  return (
    <header className="h-14 md:h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-3 md:px-6 sticky top-0 z-50">
      {/* Left Section - Search */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-xs md:max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-3 w-3 md:h-4 md:w-4" />
          <Input
            placeholder="Search..."
            className="w-full pl-7 md:pl-10 bg-slate-50 border-slate-200 focus:bg-white text-sm h-8 md:h-10"
          />
        </div>
      </div>

      {/* Center Section - Quick Stats (Hidden on small and medium screens) */}
      <div className="hidden xl:flex items-center gap-4">
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
      <div className="flex items-center gap-1 md:gap-3">
        {/* Quick Actions - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-slate-600 hover:text-slate-900 h-8 w-8 p-0"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-slate-600 hover:text-slate-900 h-8 w-8 p-0"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/calendar")}
            className="text-slate-600 hover:text-slate-900 h-8 w-8 p-0"
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative text-slate-600 hover:text-slate-900 h-8 w-8 p-0">
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 p-0 text-xs bg-red-500 hover:bg-red-500 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 md:w-80 p-0" align="end">
            <div className="p-3 md:p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm md:text-base">Admin Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 h-6"
                >
                  Mark all read
                </Button>
              </div>
            </div>
            <div className="max-h-60 md:max-h-80 overflow-y-auto custom-scrollbar">
              {adminNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 md:p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
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
                      <p className="text-slate-600 text-xs mt-1 line-clamp-2">{notification.message}</p>
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
            <Button variant="ghost" className="flex items-center gap-1 md:gap-2 h-8 px-2 md:px-3">
              <Avatar className="h-5 w-5 md:h-6 md:w-6">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-blue-600 text-white text-xs">UH</AvatarFallback>
              </Avatar>
              <span className="text-sm text-slate-700 hidden lg:block">Admin</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 md:w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium text-sm">Usman Hardware</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")} className="text-sm">
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")} className="text-sm">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 text-sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
