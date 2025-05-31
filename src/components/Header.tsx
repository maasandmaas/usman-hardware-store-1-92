
import { Bell, Package, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { PendingOrdersModal } from "@/components/PendingOrdersModal";
import { NotificationsModal } from "@/components/NotificationsModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getPendingOrders } from "@/data/storeData";
import { notificationsApi } from "@/services/api";

export function Header() {
  const [showPendingOrders, setShowPendingOrders] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pendingOrdersCount = getPendingOrders().length;

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsApi.getAll({ read: false, limit: 100 });
      if (response.success) {
        const notifications = response.data.notifications || response.data || [];
        setUnreadCount(notifications.length);
      }
    } catch (error) {
      // Fallback to demo count
      setUnreadCount(3);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(true);
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-background sticky top-0 z-50">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search products, customers..." 
                className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Pending Orders */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-accent hover:text-accent-foreground"
              onClick={() => setShowPendingOrders(true)}
            >
              <Package className="h-5 w-5" />
              {pendingOrdersCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                  {pendingOrdersCount}
                </Badge>
              )}
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-accent hover:text-accent-foreground"
              onClick={handleNotificationClick}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="Admin" />
                    <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <PendingOrdersModal 
        open={showPendingOrders} 
        onOpenChange={setShowPendingOrders} 
      />

      <NotificationsModal 
        open={showNotifications} 
        onOpenChange={setShowNotifications} 
      />
    </>
  );
}
