import { useState } from "react";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { add, update, getById, Payment, Tenant } from "@/lib/db";

interface RecordPaymentDialogProps {
  tenant: Tenant;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function RecordPaymentDialog({ tenant, onSuccess, trigger }: RecordPaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    amount: tenant.rentAmount.toString(),
    method: "bank_transfer" as Payment["method"],
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      
      // Create payment record
      const newPayment: Payment = {
        id: `payment-${Date.now()}`,
        tenantId: tenant.id,
        unitId: tenant.unitId,
        propertyId: tenant.propertyId,
        amount,
        date: formData.date,
        method: formData.method,
        status: "completed",
        receiptNumber: `RCP-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      await add<Payment>("payments", newPayment);

      // Update tenant payment status
      const updatedTenant: Tenant = {
        ...tenant,
        balance: Math.max(0, tenant.balance - amount),
        paymentStatus: tenant.balance - amount <= 0 ? "paid" : "owing",
      };

      await update<Tenant>("tenants", updatedTenant);

      toast({
        title: "Payment recorded",
        description: `Payment of ${new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(amount)} has been recorded successfully.`,
      });

      setOpen(false);
      setFormData({
        amount: tenant.rentAmount.toString(),
        method: "bank_transfer",
        date: new Date().toISOString().split("T")[0],
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="bg-gradient-secondary">
            <DollarSign className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a rent payment for {tenant.firstName} {tenant.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Monthly rent: ₦{tenant.rentAmount.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method *</Label>
              <Select
                value={formData.method}
                onValueChange={(value) => setFormData({ ...formData, method: value as Payment["method"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Payment Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            {tenant.balance > 0 && (
              <div className="rounded-lg bg-warning/10 p-3 text-sm">
                <p className="font-medium">Current Balance: ₦{tenant.balance.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  New balance after payment: ₦{Math.max(0, tenant.balance - parseFloat(formData.amount || "0")).toLocaleString()}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-gradient-secondary">
              {loading ? "Recording..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
