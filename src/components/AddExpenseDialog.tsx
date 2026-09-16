import { useState, useEffect } from "react";
import { Plus, TrendingDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { add, getAll, Expense, Property } from "@/lib/db";
import { apiClient } from "@/lib/api";

interface AddExpenseDialogProps { onSuccess?: () => void; }

export default function AddExpenseDialog({ onSuccess }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const { toast } = useToast();
  const [formData, setFormData] = useState({ propertyId: "", category: "repairs" as Expense["category"], amount: "", description: "", date: new Date().toISOString().split("T")[0] });

  useEffect(() => { if (open) loadProperties(); }, [open]);

  async function loadProperties() {
    try {
      const res = await apiClient.getProperties();
      if (res.success) {
        const mapped = res.data.map((p: any) => ({ id: p.id, name: p.name } as Property));
        setProperties(mapped);
        if (mapped.length > 0 && !formData.propertyId) setFormData(prev => ({ ...prev, propertyId: mapped[0].id }));
        return;
      }
    } catch {}
    const propsData = await getAll<Property>("properties");
    setProperties(propsData);
    if (propsData.length > 0 && !formData.propertyId) setFormData(prev => ({ ...prev, propertyId: propsData[0].id }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      try {
        const res = await apiClient.createExpense({ propertyId: formData.propertyId, category: formData.category, amount: parseFloat(formData.amount), description: formData.description, date: formData.date });
        if (res.success) {
          toast({ title: "Expense added", description: `${formData.category} • ₦${parseFloat(formData.amount).toLocaleString()}` });
          setOpen(false);
          setFormData({ propertyId: properties[0]?.id || "", category: "repairs", amount: "", description: "", date: new Date().toISOString().split("T")[0] });
          onSuccess?.();
          return;
        }
      } catch (apiError: any) { if (apiError.message !== 'API_UNAVAILABLE') throw apiError; }

      const newExpense: Expense = { id: `expense-${Date.now()}`, propertyId: formData.propertyId, category: formData.category, amount: parseFloat(formData.amount), description: formData.description, date: formData.date, createdAt: new Date().toISOString() };
      await add<Expense>("expenses", newExpense);
      toast({ title: "Expense added", description: "Recorded successfully" });
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to add expense", variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="rounded-full h-11 px-6 bg-foreground text-background hover:bg-foreground/90 shadow-lg"><Plus className="mr-2 h-4 w-4" /> Add Expense</Button></DialogTrigger>
      <DialogContent className="sm:max-w-[480px] rounded-[24px] p-0 overflow-hidden border-border/50">
        <div className="bg-foreground text-background p-7 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl bg-secondary/30" />
          <div className="relative z-10"><div className="flex items-center gap-2 mb-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10"><TrendingDown className="h-4 w-4" /></div><span className="mono text-[11px] uppercase tracking-widest opacity-60 flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> Outflow • Tracked</span></div><DialogTitle className="font-[Fraunces] text-[24px] font-bold tracking-tight">Add expense</DialogTitle><DialogDescription className="text-background/60 mt-1">Record a cost for your portfolio</DialogDescription></div>
        </div>
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div className="grid gap-4">
            <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Property *</Label><Select value={formData.propertyId} onValueChange={v => setFormData({ ...formData, propertyId: v })} required><SelectTrigger className="h-12 rounded-[12px]"><SelectValue placeholder="Select property" /></SelectTrigger><SelectContent className="rounded-[12px]">{properties.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Category *</Label><Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v as any })}><SelectTrigger className="h-12 rounded-[12px]"><SelectValue /></SelectTrigger><SelectContent className="rounded-[12px]"><SelectItem value="repairs">Repairs</SelectItem><SelectItem value="taxes">Taxes</SelectItem><SelectItem value="utilities">Utilities</SelectItem><SelectItem value="insurance">Insurance</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Amount (₦) *</Label><Input type="number" step="0.01" placeholder="0.00" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required className="h-12 rounded-[12px]" /></div>
            </div>
            <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Description *</Label><Textarea placeholder="Brief description..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required className="rounded-[12px] min-h-[80px]" /></div>
            <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Date *</Label><Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required className="h-12 rounded-[12px]" /></div>
          </div>
          <DialogFooter className="gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full h-11">Cancel</Button><Button type="submit" disabled={loading} className="rounded-full h-11 px-8 bg-foreground text-background">{loading ? "Adding..." : "Add expense"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
