import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Mail, Phone, Calendar, DollarSign, Search, Filter, ArrowUpRight, Sparkles, Plus, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import RecordPaymentDialog from "@/components/RecordPaymentDialog";
import { getAll, Tenant, Unit, Property, getById } from "@/lib/db";
import { apiClient } from "@/lib/api";
import { motion } from "framer-motion";

export default function Tenants() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [units, setUnits] = useState<Map<string, Unit>>(new Map());
  const [properties, setProperties] = useState<Map<string, Property>>(new Map());
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTenants();
  }, []);

  async function loadTenants() {
    setLoading(true);
    try {
      try {
        const res = await apiClient.getTenants({ search: search || undefined, paymentStatus: activeTab !== "all" ? activeTab : undefined });
        if (res.success) {
          const mapped: Tenant[] = res.data.map((t: any) => ({
            id: t.id,
            unitId: t.unitId,
            propertyId: t.propertyId,
            firstName: t.firstName,
            lastName: t.lastName,
            email: t.email,
            phone: t.phone,
            leaseStart: t.leaseStart,
            leaseEnd: t.leaseEnd,
            rentAmount: t.rentAmount,
            rentFrequency: t.rentFrequency || "monthly",
            paymentStatus: t.paymentStatus,
            balance: t.balance,
            createdAt: t.createdAt,
            // @ts-ignore
            _raw: t,
          }));
          setTenants(mapped);
          setLoading(false);
          return;
        }
      } catch (e: any) {
        if (e.message !== 'API_UNAVAILABLE') console.warn(e);
      }

      const tenantsData = await getAll<Tenant>("tenants");
      setTenants(tenantsData);
      const unitsMap = new Map<string, Unit>();
      const propsMap = new Map<string, Property>();
      for (const tenant of tenantsData) {
        const unit = await getById<Unit>("units", tenant.unitId);
        if (unit) unitsMap.set(unit.id, unit);
        const property = await getById<Property>("properties", tenant.propertyId);
        if (property) propsMap.set(property.id, property);
      }
      setUnits(unitsMap);
      setProperties(propsMap);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(loadTenants, 300);
    return () => clearTimeout(t);
  }, [search, activeTab]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
  const getInitials = (firstName: string, lastName: string) => `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const filteredTenants = tenants.filter(t => {
    if (activeTab !== "all" && t.paymentStatus !== activeTab) return false;
    if (search && !`${t.firstName} ${t.lastName} ${t.email}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const paidCount = tenants.filter(t => t.paymentStatus === "paid").length;
  const owingCount = tenants.filter(t => t.paymentStatus === "owing").length;
  const unpaidCount = tenants.filter(t => t.paymentStatus === "unpaid").length;

  if (loading) {
    return <div className="space-y-6"><div className="h-[100px] rounded-[24px] bg-muted animate-pulse" /><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map(i => <div key={i} className="h-[240px] rounded-[20px] bg-muted animate-pulse" />)}</div></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background"><Users className="h-4 w-4" /></div><span className="mono text-[11px] uppercase tracking-[0.14em] opacity-60">{tenants.length} residents • {paidCount} paid • {owingCount} owing</span></div>
          <div><h1 className="font-[Fraunces] text-[40px] lg:text-[48px] font-bold leading-[0.9] tracking-[-0.03em]">Tenants</h1><p className="text-[15px] opacity-60 mt-3 max-w-[48ch]">People who call your estates home. Track rent, leases, and relationships.</p></div>
        </div>
        <div className="flex gap-2"><Button variant="outline" className="rounded-full h-11"><Plus className="mr-2 h-4 w-4" /> Add tenant</Button></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" /><Input placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)} className="h-[48px] rounded-full pl-11 bg-card border-border/60" /></div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto"><TabsList className="rounded-full bg-muted/70 p-1 h-[48px] w-full lg:w-auto grid grid-cols-4"><TabsTrigger value="all" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">All ({tenants.length})</TabsTrigger><TabsTrigger value="paid" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Paid ({paidCount})</TabsTrigger><TabsTrigger value="owing" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Owing ({owingCount})</TabsTrigger><TabsTrigger value="unpaid" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Unpaid ({unpaidCount})</TabsTrigger></TabsList></Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTenants.map((tenant, idx) => {
          const unit = units.get(tenant.unitId);
          const property = properties.get(tenant.propertyId);
          const raw = (tenant as any)._raw;
          return (
            <motion.div key={tenant.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} whileHover={{ y: -2 }} className="group">
              <Card className="rounded-[20px] border-border/50 hover:shadow-lg hover:border-foreground/10 transition-all duration-300 overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-border/50"><AvatarFallback className="bg-foreground text-background font-medium">{getInitials(tenant.firstName, tenant.lastName)}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-[Fraunces] text-[18px] font-bold leading-tight tracking-tight truncate">{tenant.firstName} {tenant.lastName}</p>
                      <div className="flex items-center gap-1.5 mt-1 mono text-[11px] opacity-60"><MapPin className="h-3 w-3" /><span className="truncate">{raw?.propertyName || property?.name || "—"} • Unit {raw?.unitNumber || unit?.unitNumber || "—"}</span></div>
                    </div>
                    <Badge className={`rounded-full mono text-[10px] uppercase tracking-widest border-0 ${tenant.paymentStatus === "paid" ? "bg-success text-success-foreground" : tenant.paymentStatus === "owing" ? "bg-warning text-warning-foreground" : "bg-destructive text-destructive-foreground"}`}>{tenant.paymentStatus}</Badge>
                  </div>

                  <div className="space-y-2.5 text-[13px]">
                    <div className="flex items-center gap-2.5 text-muted-foreground"><Mail className="h-4 w-4 shrink-0" /><span className="truncate">{tenant.email}</span></div>
                    <div className="flex items-center gap-2.5 text-muted-foreground"><Phone className="h-4 w-4" /><span>{tenant.phone}</span></div>
                    <div className="flex items-center gap-2.5 text-muted-foreground"><Calendar className="h-4 w-4" /><span>Lease: {new Date(tenant.leaseStart).toLocaleDateString()} → {new Date(tenant.leaseEnd).toLocaleDateString()}</span></div>
                  </div>

                  <div className="pt-4 border-t border-border/50 space-y-2">
                    <div className="flex items-center justify-between"><span className="mono text-[11px] uppercase tracking-widest opacity-60">Monthly rent</span><span className="font-medium">{formatCurrency(tenant.rentAmount)}</span></div>
                    {tenant.balance > 0 && <div className="flex items-center justify-between"><span className="mono text-[11px] uppercase tracking-widest opacity-60">Balance</span><span className="font-medium text-destructive">{formatCurrency(tenant.balance)}</span></div>}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 rounded-full h-10 text-[13px]" onClick={() => navigate(`/tenants/${tenant.id}`)}>View <ArrowUpRight className="ml-1 h-3 w-3" /></Button>
                    <RecordPaymentDialog tenant={tenant} onSuccess={loadTenants} trigger={<Button className="flex-1 rounded-full h-10 text-[13px] bg-foreground text-background hover:bg-foreground/90">Pay</Button>} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredTenants.length === 0 && (
        <Card className="rounded-[24px] border-dashed bg-muted/20"><CardContent className="py-16 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-foreground text-background mb-4"><Users className="h-8 w-8" /></div><h3 className="font-[Fraunces] text-[22px] font-bold">No tenants</h3><p className="mono text-[13px] opacity-60 mt-2">Add your first resident to start the flow.</p></CardContent></Card>
      )}
    </div>
  );
}
