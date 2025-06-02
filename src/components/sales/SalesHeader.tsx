
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Package, TrendingUp, Clock, Users } from "lucide-react";

interface SalesHeaderProps {
  totalCartItems: number;
  todaysOrdersCount: number;
  onOpenTodaysOrders: () => void;
}

export const SalesHeader: React.FC<SalesHeaderProps> = ({
  totalCartItems,
  todaysOrdersCount,
  onOpenTodaysOrders
}) => {
  return (
    <div className="bg-background shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Sales System (POS)
              </h1>
              <p className="text-sm text-muted-foreground">
                Usman Hardware - Hafizabad
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">{totalCartItems} items in cart</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">{todaysOrdersCount} orders today</span>
            </div>
          </div>

          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-4"
            onClick={onOpenTodaysOrders}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Today's Orders
            {todaysOrdersCount > 0 && (
              <Badge className="ml-2 bg-blue-800 text-white">{todaysOrdersCount}</Badge>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
