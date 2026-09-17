import { useState } from "react";
import { DollarSign, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { add, update, Payment, Tenant } from "@/lib/db";
import { apiClient } from "@/lib/api";

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
      
      try {
        const res = await apiClient.recordPayment({ tenantId: tenant.id, amount, method: formData.method, date: formData.date });
        if (res.success) {
          toast({ title: "Payment recorded", description: `${new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount)} received • ${res.data.receiptNumber}` });
          setOpen(false);
          onSuccess?.();
          return;
        }
      } catch (apiError: any) {
        if (apiError.message !== 'API_UNAVAILABLE') throw apiError;
      }

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
      const updatedTenant: Tenant = { ...tenant, balance: Math.max(0, tenant.balance - amount), paymentStatus: tenant.balance - amount <= 0 ? "paid" : "owing" };
      await update<Tenant>("tenants", updatedTenant);
      toast({ title: "Payment recorded", description: `${new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount)} recorded` });
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to record payment", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button size="sm" className="rounded-full bg-foreground text-background"><DollarSign className="mr-2 h-4 w-4" /> Record Payment</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] rounded-[24px] p-0 overflow-hidden border-border/50">
        <div className="bg-foreground text-background p-7 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl bg-secondary/30" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10"><DollarSign className="h-4 w-4" /></div><span className="mono text-[11px] uppercase tracking-widest opacity-60 flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> Secure • Receipt auto-generated</span></div>
            <DialogTitle className="font-[Fraunces] text-[24px] font-bold tracking-tight">Record payment</DialogTitle>
            <DialogDescription className="text-background/60 mt-1">For {tenant.firstName} {tenant.lastName} • {tenant.email}</DialogDescription>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div className="grid gap-4">
            <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Amount (NGN) *</Label><Input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required className="h-12 rounded-[12px] text-[16px] font-medium" /><p className="mono text-[11px] opacity-60">Monthly rent: ₦{tenant.rentAmount.toLocaleString()}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Method *</Label><Select value={formData.method} onValueChange={v => setFormData({ ...formData, method: v as any })}><SelectTrigger className="h-12 rounded-[12px]"><SelectValue /></SelectTrigger><SelectContent className="rounded-[12px]"><SelectItem value="bank_transfer">Bank Transfer</SelectItem><SelectItem value="card">Card</SelectItem><SelectItem value="cash">Cash</SelectItem><SelectItem value="mobile_money">Mobile Money</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Date *</Label><Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required className="h-12 rounded-[12px]" /></div>
            </div>
            {tenant.balance > 0 && <div className="rounded-[12px] bg-warning/10 border border-warning/20 p-3 text-[13px]"><p className="font-medium">Balance: ₦{tenant.balance.toLocaleString()}</p><p className="mono text-[11px] opacity-70 mt-1">After: ₦{Math.max(0, tenant.balance - parseFloat(formData.amount || "0")).toLocaleString()}</p></div>}
          </div>
          <DialogFooter className="gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full h-11">Cancel</Button><Button type="submit" disabled={loading} className="rounded-full h-11 px-8 bg-foreground text-background hover:bg-foreground/90">{loading ? "Recording..." : "Record payment"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
