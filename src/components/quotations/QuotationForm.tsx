
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Calculator } from "lucide-react";
import { customersApi, productsApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const quotationSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  validUntil: z.string().min(1, "Valid until date is required"),
  items: z.array(z.object({
    productId: z.string().min(1, "Product is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(0, "Unit price must be positive"),
  })).min(1, "At least one item is required"),
  discount: z.number().min(0, "Discount must be positive").optional(),
  notes: z.string().optional(),
});

type QuotationFormData = z.infer<typeof quotationSchema>;

interface QuotationFormProps {
  quotation?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function QuotationForm({ quotation, onSubmit, onCancel, isLoading }: QuotationFormProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const { toast } = useToast();

  // Set default valid until date (30 days from now)
  const getDefaultValidUntil = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      customerId: quotation?.customerId?.toString() || "",
      validUntil: quotation?.validUntil || getDefaultValidUntil(),
      items: quotation?.items?.map((item: any) => ({
        productId: item.productId?.toString() || "",
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
      })) || [{ productId: "", quantity: 1, unitPrice: 0 }],
      discount: quotation?.discount || 0,
      notes: quotation?.notes || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersResponse, productsResponse] = await Promise.all([
          customersApi.getAll({ limit: 100 }),
          productsApi.getAll({ limit: 200 }),
        ]);

        if (customersResponse.success) {
          setCustomers(customersResponse.data.customers || customersResponse.customers || []);
        }
        if (productsResponse.success) {
          setProducts(productsResponse.data.products || productsResponse.products || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load customers and products",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p.id.toString() === productId);
    if (product) {
      form.setValue(`items.${index}.unitPrice`, product.salePrice || product.price || 0);
    }
  };

  const calculateSubtotal = () => {
    const items = form.watch("items");
    return items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = form.watch("discount") || 0;
    return subtotal - discount;
  };

  const handleSubmit = (data: QuotationFormData) => {
    const formattedData = {
      customerId: parseInt(data.customerId),
      validUntil: data.validUntil,
      items: data.items.map(item => ({
        productId: parseInt(item.productId),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      discount: data.discount || 0,
      notes: data.notes || "",
    };

    onSubmit(formattedData);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Customer and Date Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerId">Customer *</Label>
          <Select 
            value={form.watch("customerId")} 
            onValueChange={(value) => form.setValue("customerId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.customerId && (
            <p className="text-sm text-red-600">{form.formState.errors.customerId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="validUntil">Valid Until *</Label>
          <Input
            id="validUntil"
            type="date"
            {...form.register("validUntil")}
          />
          {form.formState.errors.validUntil && (
            <p className="text-sm text-red-600">{form.formState.errors.validUntil.message}</p>
          )}
        </div>
      </div>

      {/* Items Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Quotation Items</CardTitle>
            <Button
              type="button"
              onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Item {index + 1}</span>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Product *</Label>
                  <Select
                    value={form.watch(`items.${index}.productId`)}
                    onValueChange={(value) => {
                      form.setValue(`items.${index}.productId`, value);
                      handleProductChange(index, value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} - Rs. {product.salePrice || product.price || 0}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    min="1"
                    {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unit Price *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Total</Label>
                  <Input
                    type="number"
                    value={(form.watch(`items.${index}.quantity`) * form.watch(`items.${index}.unitPrice`)).toFixed(2)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </div>
          ))}

          {form.formState.errors.items && (
            <p className="text-sm text-red-600">{form.formState.errors.items.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Discount and Total */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Discount Amount</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...form.register("discount", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>Rs. {(form.watch("discount") || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>Rs. {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes or comments..."
          rows={4}
          {...form.register("notes")}
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : (quotation ? "Update Quotation" : "Create Quotation")}
        </Button>
      </div>
    </form>
  );
}
