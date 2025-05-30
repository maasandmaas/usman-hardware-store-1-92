
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Package, User, MapPin } from "lucide-react";

interface PendingOrder {
  id: string;
  customerName: string;
  customerType: "special" | "regular" | "walk-in";
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  createdAt: string;
  estimatedReady: string;
  status: "pending" | "preparing" | "ready";
}

interface PendingOrdersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockPendingOrders: PendingOrder[] = [
  {
    id: "PO-001",
    customerName: "Ahmad Furniture",
    customerType: "special",
    items: [
      { name: "Heavy Duty Hinges", quantity: 20, price: 125 },
      { name: "Steel Screws", quantity: 100, price: 5 }
    ],
    total: 3000,
    createdAt: "2024-11-28T10:30:00Z",
    estimatedReady: "2024-11-29T14:00:00Z",
    status: "preparing"
  },
  {
    id: "PO-002",
    customerName: "Hassan Carpentry",
    customerType: "regular",
    items: [
      { name: "Wood Screws", quantity: 50, price: 8 }
    ],
    total: 400,
    createdAt: "2024-11-28T11:15:00Z",
    estimatedReady: "2024-11-28T16:00:00Z",
    status: "ready"
  }
];

export function PendingOrdersModal({ open, onOpenChange }: PendingOrdersModalProps) {
  const [pendingOrders] = useState<PendingOrder[]>(mockPendingOrders);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "preparing": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case "special": return "bg-purple-100 text-purple-800";
      case "regular": return "bg-blue-100 text-blue-800";
      case "walk-in": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Pending Orders ({pendingOrders.length})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {pendingOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No pending orders</p>
          ) : (
            pendingOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {order.customerName}
                      </div>
                      <Badge variant="outline" className={getCustomerTypeColor(order.customerType)}>
                        {order.customerType}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">PKR {order.total.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      Ready: {new Date(order.estimatedReady).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    <MapPin className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  {order.status === "ready" && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Complete Order
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
