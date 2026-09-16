import { useState } from "react";
import { Plus, Building2, MapPin, Home, Briefcase, Store, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { add, Property } from "@/lib/db";

interface AddPropertyDialogProps {
  onSuccess?: () => void;
}

export default function AddPropertyDialog({ onSuccess }: AddPropertyDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "Lagos",
    type: "apartment" as Property["type"],
    totalUnits: 4,
    rent: 1500000,
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try API first
      try {
        const response = await apiClient.createProperty({
          name: formData.name,
          address: formData.address,
          city: formData.city,
          type: formData.type,
          totalUnits: formData.totalUnits,
          rent: formData.rent,
          description: formData.description,
        });
        if (response.success) {
          toast({ title: "Property added", description: `${formData.name} is now in your portfolio.` });
          setOpen(false);
          setFormData({ name: "", address: "", city: "Lagos", type: "apartment", totalUnits: 4, rent: 1500000, description: "" });
          onSuccess?.();
          return;
        }
      } catch (apiError: any) {
        if (apiError.message !== 'API_UNAVAILABLE') throw apiError;
        // Fallback to IndexedDB
      }

      const newProperty: Property = {
        id: `property-${Date.now()}`,
        name: formData.name,
        address: formData.address,
        type: formData.type,
        units: formData.totalUnits,
        createdAt: new Date().toISOString(),
      } as any;

      await add<Property>("properties", newProperty);
      toast({ title: "Property added", description: "The property has been added successfully." });
      setOpen(false);
      setFormData({ name: "", address: "", city: "Lagos", type: "apartment", totalUnits: 4, rent: 1500000, description: "" });
      onSuccess?.();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to add property", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: "apartment", label: "Apartment", icon: Building2, desc: "Multi-unit residential" },
    { value: "house", label: "House", icon: Home, desc: "Single family" },
    { value: "office", label: "Office", icon: Briefcase, desc: "Commercial office" },
    { value: "commercial", label: "Commercial", icon: Store, desc: "Retail / mixed" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full h-11 px-6 bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl hover:-translate-y-[1px] transition-all">
          <Plus className="mr-2 h-4 w-4" /> Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] rounded-[24px] border-border/50 p-0 overflow-hidden">
        <div className="bg-foreground text-background p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl bg-secondary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10 backdrop-blur"><Building2 className="h-5 w-5" /></div>
              <div className="flex h-6 items-center gap-1.5 rounded-full bg-secondary px-3 text-secondary-foreground mono text-[10px] uppercase tracking-widest"><Sparkles className="h-3 w-3" /> New estate</div>
            </div>
            <DialogTitle className="font-[Fraunces] text-[28px] font-bold leading-[0.9] tracking-tight text-background">Add new property</DialogTitle>
            <DialogDescription className="text-background/60 mt-2 text-[14px] leading-[1.5]">Create an estate and start collecting. Units are auto-generated.</DialogDescription>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid gap-5">
            <div className="space-y-2">
              <Label className="mono text-[11px] uppercase tracking-widest opacity-70">Property name *</Label>
              <Input placeholder="Lekki Gardens • Phase 1" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="h-12 rounded-[12px] border-border/60 focus:border-foreground/20 focus:ring-4 focus:ring-foreground/[0.06]" />
            </div>

            <div className="space-y-2">
              <Label className="mono text-[11px] uppercase tracking-widest opacity-70">Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
                <Input placeholder="15 Admiralty Way, Lekki" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required className="h-12 rounded-[12px] border-border/60 pl-10 focus:border-foreground/20 focus:ring-4 focus:ring-foreground/[0.06]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="mono text-[11px] uppercase tracking-widest opacity-70">City</Label>
                <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="h-12 rounded-[12px]" />
              </div>
              <div className="space-y-2">
                <Label className="mono text-[11px] uppercase tracking-widest opacity-70">Units</Label>
                <Input type="number" min={1} value={formData.totalUnits} onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 1 })} className="h-12 rounded-[12px]" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="mono text-[11px] uppercase tracking-widest opacity-70">Type *</Label>
              <div className="grid grid-cols-2 gap-2">
                {typeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const active = formData.type === opt.value;
                  return (
                    <button key={opt.value} type="button" onClick={() => setFormData({ ...formData, type: opt.value as any })} className={`rounded-[12px] border p-3 text-left transition-all ${active ? 'bg-foreground text-background border-foreground shadow-md' : 'bg-card border-border/60 hover:border-foreground/15 hover:shadow-sm'}`}>
                      <Icon className="h-4 w-4 mb-2" /><p className="text-[13px] font-semibold leading-none">{opt.label}</p><p className={`mono text-[10px] uppercase tracking-widest mt-1 ${active ? 'opacity-60' : 'opacity-50'}`}>{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="mono text-[11px] uppercase tracking-widest opacity-70">Monthly rent (NGN)</Label>
                <Input type="number" value={formData.rent} onChange={(e) => setFormData({ ...formData, rent: parseInt(e.target.value) || 0 })} className="h-12 rounded-[12px]" />
              </div>
              <div className="space-y-2">
                <Label className="mono text-[11px] uppercase tracking-widest opacity-70">Description</Label>
                <Input placeholder="Premium estate..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="h-12 rounded-[12px]" />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full h-11 px-6">Cancel</Button>
            <Button type="submit" disabled={loading} className="rounded-full h-11 px-8 bg-foreground text-background hover:bg-foreground/90">
              {loading ? "Creating..." : "Create property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
