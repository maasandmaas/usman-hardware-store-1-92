
import { useState } from "react";
import { Bell, Search, User, ChevronDown, Settings, LogOut, HelpCircle, Moon, Sun, Maximize2, Minimize2, Calendar, MessageSquare, Globe } from "lucide-react";
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

const notifications = [
  {
    id: 1,
    title: "Low Stock Alert",
    message: "Cabinet Hinges - Heavy Duty running low (5 units left)",
    time: "2 minutes ago",
    type: "warning",
    unread: true
  },
  {
    id: 2,
    title: "New Order Received",
    message: "Order #ORD-2024-001 from Ahmad Furniture",
    time: "15 minutes ago",
    type: "success",
    unread: true
  },
  {
    id: 3,
    title: "Payment Received",
    message: "Rs. 25,000 received from Hassan Carpentry",
    time: "1 hour ago",
    type: "info",
    unread: false
  },
  {
    id: 4,
    title: "Supplier Update",
    message: "New polish varieties available from Wood Finishes Co.",
    time: "3 hours ago",
    type: "info",
    unread: false
  }
];

export function Header() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(notifications.filter(n => n.unread).length);
  const { toast } = useToast();

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
      description: `Switched to ${!isDarkMode ? 'dark' : 'light'} mode`,
    });
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
    });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search products, customers, orders..."
            className="w-80 pl-10 bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-2">
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
          Store Open
        </Badge>
        <div className="text-sm text-slate-600">
          Today: <span className="font-semibold text-slate-900">Rs. 45,200</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="text-slate-600 hover:text-slate-900"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="text-slate-600 hover:text-slate-900"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-slate-900"
        >
          <Calendar className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-slate-900"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative text-slate-600 hover:text-slate-900">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
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
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                    notification.unread ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
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

        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>اردو</DropdownMenuItem>
            <DropdownMenuItem>پنجابی</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-8 px-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-blue-600 text-white text-xs">UH</AvatarFallback>
              </Avatar>
              <span className="text-sm text-slate-700 hidden md:block">Usman Hardware</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">Usman Hardware</p>
                <p className="text-xs text-slate-500">Owner & Manager</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Store Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
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
