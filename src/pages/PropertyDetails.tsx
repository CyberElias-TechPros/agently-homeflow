import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Building2, ArrowLeft, Plus, MapPin, DollarSign, Users, Wrench, ArrowUpRight, Sparkles, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getById, getByIndex, Property, Unit, Tenant, Expense } from "@/lib/db";
import { apiClient } from "@/lib/api";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [property, setProperty] = useState<any>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [tenants, setTenants] = useState<Map<string, Tenant>>(new Map());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [newUnit, setNewUnit] = useState({ unitNumber: "", rent: "", bedrooms: "2", bathrooms: "2" });

  useEffect(() => { if (id) loadPropertyDetails(id); }, [id]);

  async function loadPropertyDetails(propertyId: string) {
    setLoading(true);
    try {
      try {
        const res = await apiClient.getProperty(propertyId);
        if (res.success) {
          setProperty(res.data);
          setUnits((res.data.units || []).map((u: any) => ({ id: u.id, propertyId, unitNumber: u.unitNumber, rent: u.rent, status: u.status, bedrooms: u.bedrooms, bathrooms: u.bathrooms, createdAt: u.createdAt })));
          setExpenses(res.data.recentExpenses || []);
          setLoading(false);
          return;
        }
      } catch (e: any) { if (e.message !== 'API_UNAVAILABLE') console.warn(e); }

      const propData = await getById<Property>("properties", propertyId);
      setProperty(propData || null);
      const unitsData = await getByIndex<Unit>("units", "propertyId", propertyId);
      setUnits(unitsData);
      const tenantsMap = new Map<string, Tenant>();
      for (const unit of unitsData) {
        if (unit.tenantId) {
          const tenant = await getById<Tenant>("tenants", unit.tenantId);
          if (tenant) tenantsMap.set(tenant.id, tenant);
        }
      }
      setTenants(tenantsMap);
      const expensesData = await getByIndex<Expense>("expenses", "propertyId", propertyId);
      setExpenses(expensesData);
    } finally { setLoading(false); }
  }

  async function handleAddUnit() {
    try {
      if (!id || !newUnit.unitNumber || !newUnit.rent) return;
      try {
        const res = await apiClient.createUnit(id, { unitNumber: newUnit.unitNumber, rent: parseInt(newUnit.rent), bedrooms: parseInt(newUnit.bedrooms), bathrooms: parseInt(newUnit.bathrooms) });
        if (res.success) {
          toast({ title: "Unit added", description: `${newUnit.unitNumber} created` });
          setShowAddUnit(false);
          setNewUnit({ unitNumber: "", rent: "", bedrooms: "2", bathrooms: "2" });
          loadPropertyDetails(id);
          return;
        }
      } catch (e: any) { if (e.message !== 'API_UNAVAILABLE') throw e; }
      toast({ title: "Add unit", description: "API unavailable — unit creation requires backend", variant: "destructive" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" /></div>;
  if (!property) return <div className="flex items-center justify-center min-h-[400px]"><p className="mono text-sm opacity-60">Property not found</p></div>;

  const occupiedUnits = units.filter(u => u.status === "occupied").length;
  const vacantUnits = units.filter(u => u.status === "vacant").length;
  const totalRent = units.reduce((sum, u) => sum + (u.rent || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/properties")} className="rounded-full bg-muted h-10 w-10"><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3"><h1 className="font-[Fraunces] text-[32px] font-bold tracking-tight truncate">{property.name || property._raw?.name}</h1><Badge className="rounded-full mono text-[10px] uppercase tracking-widest capitalize">{property.type || property._raw?.type}</Badge></div>
          <div className="flex items-center gap-2 mt-1 mono text-[12px] opacity-60"><MapPin className="h-3.5 w-3.5" /><span className="truncate">{property.address || property._raw?.address} {property.city ? `• ${property.city}` : ""}</span></div>
        </div>
        <Dialog open={showAddUnit} onOpenChange={setShowAddUnit}>
          <DialogTrigger asChild><Button className="rounded-full h-11 bg-foreground text-background"><Plus className="mr-2 h-4 w-4" /> Add Unit</Button></DialogTrigger>
          <DialogContent className="rounded-[20px]"><DialogHeader><DialogTitle className="font-[Fraunces] text-[20px]">Add unit</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Unit number</Label><Input value={newUnit.unitNumber} onChange={e => setNewUnit({ ...newUnit, unitNumber: e.target.value })} placeholder="Unit 5" className="h-11 rounded-[12px]" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Rent</Label><Input type="number" value={newUnit.rent} onChange={e => setNewUnit({ ...newUnit, rent: e.target.value })} className="h-11 rounded-[12px]" /></div>
                <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">BR</Label><Input type="number" value={newUnit.bedrooms} onChange={e => setNewUnit({ ...newUnit, bedrooms: e.target.value })} className="h-11 rounded-[12px]" /></div>
                <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">BA</Label><Input type="number" value={newUnit.bathrooms} onChange={e => setNewUnit({ ...newUnit, bathrooms: e.target.value })} className="h-11 rounded-[12px]" /></div>
              </div>
              <Button onClick={handleAddUnit} className="w-full rounded-full h-11 bg-foreground text-background">Create unit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-[20px] border-border/50"><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="mono text-[11px] uppercase tracking-widest opacity-60">Total units</CardTitle><Building2 className="h-4 w-4 opacity-60" /></CardHeader><CardContent><div className="font-[Fraunces] text-[28px] font-bold leading-none">{units.length}</div><p className="mono text-[11px] opacity-60 mt-2 capitalize">{property.type || property._raw?.type}</p></CardContent></Card>
        <Card className="rounded-[20px] border-border/50"><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="mono text-[11px] uppercase tracking-widest opacity-60">Occupied</CardTitle><div className="h-2 w-2 rounded-full bg-success animate-pulse" /></CardHeader><CardContent><div className="font-[Fraunces] text-[28px] font-bold leading-none">{occupiedUnits}</div><p className="mono text-[11px] opacity-60 mt-2">{units.length ? Math.round((occupiedUnits / units.length) * 100) : 0}% occupancy</p></CardContent></Card>
        <Card className="rounded-[20px] border-border/50 bg-foreground text-background"><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="mono text-[11px] uppercase tracking-widest opacity-60">Monthly rent</CardTitle><DollarSign className="h-4 w-4 opacity-60" /></CardHeader><CardContent><div className="font-[Fraunces] text-[28px] font-bold leading-none">{formatCurrency(totalRent)}</div><p className="mono text-[11px] opacity-60 mt-2">Potential</p></CardContent></Card>
        <Card className="rounded-[20px] border-border/50"><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="mono text-[11px] uppercase tracking-widest opacity-60">Expenses</CardTitle><Calendar className="h-4 w-4 opacity-60" /></CardHeader><CardContent><div className="font-[Fraunces] text-[28px] font-bold leading-none">{formatCurrency(totalExpenses)}</div><p className="mono text-[11px] opacity-60 mt-2">YTD</p></CardContent></Card>
      </div>

      <Tabs defaultValue="units" className="space-y-6">
        <TabsList className="rounded-full bg-muted/70 p-1 h-11"><TabsTrigger value="units" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Units ({units.length})</TabsTrigger><TabsTrigger value="tenants" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Tenants ({property.tenants?.length || tenants.size})</TabsTrigger><TabsTrigger value="expenses" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Expenses ({expenses.length})</TabsTrigger><TabsTrigger value="maintenance" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Maintenance ({property.recentMaintenance?.length || 0})</TabsTrigger></TabsList>

        <TabsContent value="units" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {units.map((unit, idx) => {
              const tenant = unit.tenantId ? tenants.get(unit.tenantId) : null;
              return (
                <motion.div key={unit.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} whileHover={{ y: -2 }}>
                  <Card className="rounded-[20px] border-border/50 hover:shadow-lg transition-all">
                    <CardHeader><div className="flex items-start justify-between"><div><CardTitle className="font-[Fraunces] text-[18px]">Unit {unit.unitNumber}</CardTitle><p className="mono text-[11px] opacity-60 mt-1">{unit.bedrooms}BR • {unit.bathrooms}BA • {unit.rent ? formatCurrency(unit.rent) : "—"}</p></div><Badge className={`rounded-full mono text-[10px] uppercase tracking-widest border-0 ${unit.status === "occupied" ? "bg-success text-success-foreground" : unit.status === "vacant" ? "bg-warning text-warning-foreground" : "bg-destructive text-destructive-foreground"}`}>{unit.status}</Badge></div></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between mono text-[11px]"><span className="opacity-60 uppercase tracking-widest">Rent</span><span className="font-medium text-[13px]">{formatCurrency(unit.rent || 0)}</span></div>
                      {tenant && <div className="pt-3 border-t border-border/50"><p className="text-[13px] font-medium">{tenant.firstName} {tenant.lastName}</p><p className="mono text-[11px] opacity-60">{tenant.email}</p></div>}
                      <Button variant="outline" size="sm" className="w-full rounded-full h-9">View details <ArrowUpRight className="ml-1 h-3 w-3" /></Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          {units.length === 0 && <Card className="rounded-[20px] border-dashed"><CardContent className="py-12 text-center"><p className="mono text-sm opacity-60">No units yet</p></CardContent></Card>}
        </TabsContent>

        <TabsContent value="tenants">
          <Card className="rounded-[20px] border-border/50"><CardContent className="pt-6">
            {(property.tenants || Array.from(tenants.values())).length === 0 ? <p className="mono text-sm opacity-60 text-center py-8">No tenants</p> : <div className="space-y-3">{(property.tenants || Array.from(tenants.values())).map((t: any) => <div key={t.id} className="flex items-center justify-between p-3 rounded-[12px] border border-border/50"><div><p className="font-medium text-[14px]">{t.firstName} {t.lastName}</p><p className="mono text-[11px] opacity-60">{t.email} • {t.paymentStatus || t.payment_status}</p></div><Badge className="rounded-full">{t.rentAmount ? formatCurrency(t.rentAmount) : ""}</Badge></div>)}</div>}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card className="rounded-[20px] border-border/50"><CardContent className="pt-6">
            {expenses.length === 0 ? <p className="mono text-sm opacity-60 text-center py-8">No expenses</p> : <div className="space-y-3">{expenses.map((e: any) => <div key={e.id} className="flex items-center justify-between p-3 rounded-[12px] border border-border/50"><div><p className="font-medium text-[14px] capitalize">{e.category || e.category} • {e.description}</p><p className="mono text-[11px] opacity-60">{new Date(e.date).toLocaleDateString()}</p></div><p className="font-bold">{formatCurrency(e.amount)}</p></div>)}</div>}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card className="rounded-[20px] border-border/50"><CardContent className="pt-6">
            {(property.recentMaintenance || []).length === 0 ? <p className="mono text-sm opacity-60 text-center py-8">No maintenance</p> : <div className="space-y-3">{(property.recentMaintenance || []).map((m: any) => <div key={m.id} className="p-3 rounded-[12px] border border-border/50"><p className="font-medium text-[14px]">{m.title}</p><p className="mono text-[11px] opacity-60">{m.status} • {m.priority} • {new Date(m.created_at || m.createdAt).toLocaleDateString()}</p></div>)}</div>}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
