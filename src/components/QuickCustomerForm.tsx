
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { customerTypes, Customer, CustomerType } from "@/data/storeData";

interface QuickCustomerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerCreated: (customer: Customer) => void;
}

export function QuickCustomerForm({ open, onOpenChange, onCustomerCreated }: QuickCustomerFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [customerType, setCustomerType] = useState<CustomerType>("regular");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide customer name and phone number",
        variant: "destructive"
      });
      return;
    }

    const newCustomer: Customer = {
      id: Date.now(), // Simple ID generation
      name: name.trim(),
      phone: phone.trim(),
      address: customerType === "walk-in" ? "Walk-in" : "Address not provided",
      dueAmount: 0,
      type: customerType
    };

    onCustomerCreated(newCustomer);
    
    // Reset form
    setName("");
    setPhone("");
    setCustomerType("regular");
    onOpenChange(false);

    toast({
      title: "Customer Added",
      description: `${newCustomer.name} has been added successfully`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Quick Add Customer
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Customer Name *</Label>
            <Input
              id="name"
              placeholder="Enter customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-gray-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Customer Type</Label>
            <Select value={customerType} onValueChange={(value: CustomerType) => setCustomerType(value)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {customerTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Add Customer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
