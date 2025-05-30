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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { PendingOrdersModal } from "@/components/PendingOrdersModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getPendingOrders } from "@/data/storeData";

export function Header() {
  const { toast } = useToast();
  const [showPendingOrders, setShowPendingOrders] = useState(false);
  const pendingOrdersCount = getPendingOrders().length;

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 3 new notifications",
    });
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search products, customers..." 
                className="pl-10 bg-muted/50 border-border"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Pending Orders */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-accent"
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
              className="relative hover:bg-accent"
              onClick={handleNotificationClick}
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                3
              </Badge>
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
    </>
  );
}
