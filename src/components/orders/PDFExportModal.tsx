
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, Filter } from "lucide-react";

interface PDFExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (options: ExportOptions) => void;
  customers: Array<{ id: number; name: string }>;
  isLoading: boolean;
}

export interface ExportOptions {
  customerScope: 'all' | 'single' | 'multiple';
  selectedCustomers: number[];
  timeScope: 'all' | 'today' | 'weekly' | 'monthly' | 'custom';
  startDate?: string;
  endDate?: string;
}

export const PDFExportModal = ({ 
  open, 
  onOpenChange, 
  onExport, 
  customers, 
  isLoading 
}: PDFExportModalProps) => {
  const [customerScope, setCustomerScope] = useState<'all' | 'single' | 'multiple'>('all');
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [timeScope, setTimeScope] = useState<'all' | 'today' | 'weekly' | 'monthly' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = () => {
    const options: ExportOptions = {
      customerScope,
      selectedCustomers,
      timeScope,
      startDate: timeScope === 'custom' ? startDate : undefined,
      endDate: timeScope === 'custom' ? endDate : undefined,
    };
    onExport(options);
  };

  const handleCustomerSelect = (customerId: string) => {
    const id = parseInt(customerId);
    if (customerScope === 'single') {
      setSelectedCustomers([id]);
    } else if (customerScope === 'multiple') {
      setSelectedCustomers(prev => 
        prev.includes(id) 
          ? prev.filter(cId => cId !== id)
          : [...prev, id]
      );
    }
  };

  const isExportDisabled = () => {
    if (customerScope !== 'all' && selectedCustomers.length === 0) return true;
    if (timeScope === 'custom' && (!startDate || !endDate)) return true;
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            PDF Export Options
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-4 w-4" />
                Customer Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={customerScope} onValueChange={(value: any) => {
                setCustomerScope(value);
                setSelectedCustomers([]);
              }}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-customers" />
                  <Label htmlFor="all-customers">All Customers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single-customer" />
                  <Label htmlFor="single-customer">Single Customer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multiple" id="multiple-customers" />
                  <Label htmlFor="multiple-customers">Multiple Customers</Label>
                </div>
              </RadioGroup>

              {customerScope !== 'all' && (
                <div className="mt-4">
                  <Label>Select Customer{customerScope === 'multiple' ? 's' : ''}</Label>
                  <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
                    {customers.map((customer) => (
                      <div
                        key={customer.id}
                        className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                          selectedCustomers.includes(customer.id) ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => handleCustomerSelect(customer.id.toString())}
                      >
                        <input
                          type={customerScope === 'single' ? 'radio' : 'checkbox'}
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => {}}
                          className="pointer-events-none"
                        />
                        <span>{customer.name || `Customer #${customer.id}`}</span>
                      </div>
                    ))}
                  </div>
                  {selectedCustomers.length > 0 && (
                    <p className="text-sm text-blue-600 mt-2">
                      {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Time Period Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-4 w-4" />
                Time Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={timeScope} onValueChange={(value: any) => setTimeScope(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-time" />
                  <Label htmlFor="all-time">All Time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="today" id="today" />
                  <Label htmlFor="today">Today</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">This Week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">This Month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom Date Range</Label>
                </div>
              </RadioGroup>

              {timeScope === 'custom' && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExportDisabled() || isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Exporting...' : 'Export PDF'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
