import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Calendar, DollarSign, Home, Wrench, FileText, Sparkles, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getById, Tenant, Unit, Property, Payment, MaintenanceRequest } from "@/lib/db";
import { apiClient } from "@/lib/api";

export default function TenantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<any>(null);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) loadDetails(id); }, [id]);

  async function loadDetails(tenantId: string) {
    setLoading(true);
    try {
      try {
        const res = await apiClient.getTenant(tenantId);
        if (res.success) {
          setTenant(res.data);
          setPayments(res.data.payments || []);
          setMaintenance(res.data.maintenanceRequests || []);
          setLoading(false);
          return;
        }
      } catch {}
      const tenantData = await getById<Tenant>("tenants", tenantId);
      if (!tenantData) { setLoading(false); return; }
      setTenant(tenantData);
      const unitData = await getById<Unit>("units", tenantData.unitId);
      setUnit(unitData || null);
      const propData = await getById<Property>("properties", tenantData.propertyId);
      setProperty(propData || null);
    } finally { setLoading(false); }
  }

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" /></div>;
  if (!tenant) return <div className="py-20 text-center mono opacity-60">Tenant not found</div>;

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/tenants")} className="rounded-full bg-muted h-10 w-10"><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-border/50"><AvatarFallback className="bg-foreground text-background text-[16px] font-bold">{tenant.firstName?.charAt(0)}{tenant.lastName?.charAt(0)}</AvatarFallback></Avatar>
          <div><h1 className="font-[Fraunces] text-[28px] font-bold leading-none tracking-tight">{tenant.firstName} {tenant.lastName}</h1><p className="mono text-[12px] opacity-60 mt-1 flex items-center gap-2">{tenant.email} • {tenant.phone} • {tenant.paymentStatus || tenant.payment_status}</p></div>
        </div>
        <div className="ml-auto flex gap-2"><Badge className={`rounded-full mono text-[11px] uppercase tracking-widest ${tenant.paymentStatus === "paid" || tenant.payment_status === "paid" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}`}>{tenant.paymentStatus || tenant.payment_status}</Badge></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[20px] border-border/50">
            <CardHeader><CardTitle className="font-[Fraunces] text-[20px]">Lease details</CardTitle><CardDescription className="mono text-[11px]">Residency & terms</CardDescription></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="rounded-[12px] bg-muted/50 p-4"><p className="mono text-[10px] uppercase tracking-widest opacity-60">Property</p><p className="font-medium mt-1 flex items-center gap-2"><Home className="h-4 w-4" />{tenant.propertyName || property?.name || "—"} • Unit {tenant.unitNumber || unit?.unitNumber}</p></div>
                <div className="rounded-[12px] bg-muted/50 p-4"><p className="mono text-[10px] uppercase tracking-widest opacity-60">Lease period</p><p className="font-medium mt-1 flex items-center gap-2"><Calendar className="h-4 w-4" />{new Date(tenant.leaseStart || tenant.lease_start).toLocaleDateString()} → {new Date(tenant.leaseEnd || tenant.lease_end).toLocaleDateString()}</p></div>
              </div>
              <div className="space-y-3">
                <div className="rounded-[12px] bg-muted/50 p-4"><p className="mono text-[10px] uppercase tracking-widest opacity-60">Rent</p><p className="font-[Fraunces] text-[20px] font-bold mt-1">{formatCurrency(tenant.rentAmount || tenant.rent_amount)}</p><p className="mono text-[11px] opacity-60">{tenant.rentFrequency || tenant.rent_frequency} • Due day {tenant.paymentDay || tenant.payment_day || 1}</p></div>
                <div className="rounded-[12px] bg-foreground text-background p-4"><p className="mono text-[10px] uppercase tracking-widest opacity-60">Balance</p><p className="font-[Fraunces] text-[20px] font-bold mt-1">{formatCurrency(tenant.balance || 0)}</p><p className="mono text-[11px] opacity-60">{tenant.balance > 0 ? "Outstanding" : "All clear"}</p></div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="payments" className="space-y-4">
            <TabsList className="rounded-full bg-muted/70 p-1 h-11"><TabsTrigger value="payments" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Payments ({payments.length})</TabsTrigger><TabsTrigger value="maintenance" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Maintenance ({maintenance.length})</TabsTrigger><TabsTrigger value="documents" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Documents</TabsTrigger></TabsList>
            <TabsContent value="payments"><Card className="rounded-[20px] border-border/50"><CardContent className="pt-6 space-y-3">{payments.length === 0 ? <p className="mono text-sm opacity-60 text-center py-8">No payments</p> : payments.map((p: any) => <div key={p.id} className="flex items-center justify-between p-3 rounded-[12px] border border-border/50"><div><p className="font-medium text-[14px]">{formatCurrency(p.amount)} • {p.status}</p><p className="mono text-[11px] opacity-60">{new Date(p.payment_date || p.date).toLocaleDateString()} • #{p.receipt_number || p.receiptNumber}</p></div><Badge variant="outline" className="rounded-full mono text-[10px]">{p.payment_method || p.method}</Badge></div>)}</CardContent></Card></TabsContent>
            <TabsContent value="maintenance"><Card className="rounded-[20px] border-border/50"><CardContent className="pt-6 space-y-3">{maintenance.length === 0 ? <p className="mono text-sm opacity-60 text-center py-8">No maintenance</p> : maintenance.map((m: any) => <div key={m.id} className="p-3 rounded-[12px] border border-border/50"><p className="font-medium text-[14px]">{m.title}</p><p className="mono text-[11px] opacity-60">{m.status} • {m.priority}</p></div>)}</CardContent></Card></TabsContent>
            <TabsContent value="documents"><Card className="rounded-[20px] border-border/50"><CardContent className="pt-6 text-center py-12"><FileText className="h-8 w-8 mx-auto opacity-40 mb-3" /><p className="mono text-sm opacity-60">Lease, ID, receipts — stored in R2</p></CardContent></Card></TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[20px] border-border/50 bg-secondary/20 border-secondary/30">
            <CardContent className="p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground"><Sparkles className="h-5 w-5" /></div>
              <div><p className="font-medium">Tenant health</p><p className="text-[13px] opacity-70 mt-2 leading-[1.5]">{tenant.firstName} has been a resident since {new Date(tenant.leaseStart || tenant.lease_start).toLocaleDateString()}. Payment status is {tenant.paymentStatus || tenant.payment_status}. {tenant.balance > 0 ? `Outstanding ${formatCurrency(tenant.balance)} — consider payment plan.` : "All clear — great tenant."}</p></div>
              <Button className="w-full rounded-full bg-foreground text-background">Message tenant <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
            </CardContent>
          </Card>

          <Card className="rounded-[20px] border-border/50">
            <CardHeader><CardTitle className="font-[Fraunces] text-[18px]">Contact</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-[13px]">
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 opacity-60" />{tenant.email}</div>
              <div className="flex items-center gap-3"><Phone className="h-4 w-4 opacity-60" />{tenant.phone}</div>
              <div className="flex items-center gap-3"><Home className="h-4 w-4 opacity-60" />{tenant.propertyName || property?.name} • Unit {tenant.unitNumber || unit?.unitNumber}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
