import { useEffect, useState } from "react";
import { Wrench, AlertCircle, Clock, CheckCircle, Search, ArrowUpRight, Sparkles, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAll, MaintenanceRequest, Tenant, Unit, Property, getById } from "@/lib/db";
import { apiClient } from "@/lib/api";
import { motion } from "framer-motion";

export default function Maintenance() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [tenants, setTenants] = useState<Map<string, Tenant>>(new Map());
  const [units, setUnits] = useState<Map<string, Unit>>(new Map());
  const [properties, setProperties] = useState<Map<string, Property>>(new Map());
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMaintenanceRequests(); }, []);
  useEffect(() => { const t = setTimeout(loadMaintenanceRequests, 300); return () => clearTimeout(t); }, [search, activeTab]);

  async function loadMaintenanceRequests() {
    setLoading(true);
    try {
      try {
        const res = await apiClient.getMaintenance({ status: activeTab !== "all" ? activeTab : undefined, search: search || undefined });
        if (res.success) {
          const mapped: MaintenanceRequest[] = res.data.map((m: any) => ({
            id: m.id,
            tenantId: m.tenantId,
            unitId: m.unitId,
            propertyId: m.propertyId,
            title: m.title,
            description: m.description,
            priority: m.priority,
            status: m.status,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            // @ts-ignore
            _raw: m,
          }));
          setRequests(mapped);
          setLoading(false);
          return;
        }
      } catch (e: any) { if (e.message !== 'API_UNAVAILABLE') console.warn(e); }

      const requestsData = await getAll<MaintenanceRequest>("maintenance");
      setRequests(requestsData);
      const tenantsMap = new Map<string, Tenant>();
      const unitsMap = new Map<string, Unit>();
      const propsMap = new Map<string, Property>();
      for (const request of requestsData) {
        const tenant = await getById<Tenant>("tenants", request.tenantId);
        if (tenant) tenantsMap.set(tenant.id, tenant);
        const unit = await getById<Unit>("units", request.unitId);
        if (unit) unitsMap.set(unit.id, unit);
        const property = await getById<Property>("properties", request.propertyId);
        if (property) propsMap.set(property.id, property);
      }
      setTenants(tenantsMap);
      setUnits(unitsMap);
      setProperties(propsMap);
    } finally { setLoading(false); }
  }

  const filteredRequests = requests.filter(r => {
    if (activeTab !== "all" && r.status !== activeTab) return false;
    if (search && !`${r.title} ${r.description}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const inProgressCount = requests.filter(r => r.status === "in_progress" || (r as any).status === "assigned").length;
  const completedCount = requests.filter(r => r.status === "completed").length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return AlertCircle;
      case "in_progress": case "assigned": return Clock;
      case "completed": return CheckCircle;
      default: return Wrench;
    }
  };

  if (loading) return <div className="space-y-6"><div className="h-[100px] rounded-[24px] bg-muted animate-pulse" /><div className="grid gap-4 md:grid-cols-2">{[1,2,3,4].map(i => <div key={i} className="h-[240px] rounded-[20px] bg-muted animate-pulse" />)}</div></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background"><Wrench className="h-4 w-4" /></div><span className="mono text-[11px] uppercase tracking-[0.14em] opacity-60">{requests.length} requests • {pendingCount} pending • {inProgressCount} active</span></div>
          <div><h1 className="font-[Fraunces] text-[40px] lg:text-[48px] font-bold leading-[0.9] tracking-[-0.03em]">Maintenance</h1><p className="text-[15px] opacity-60 mt-3 max-w-[48ch]">Fix & care, orchestrated. From leak to luxury — every request tracked in real-time.</p></div>
        </div>
        <Button className="rounded-full h-11 bg-foreground text-background"><Wrench className="mr-2 h-4 w-4" /> New request</Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" /><Input placeholder="Search maintenance..." value={search} onChange={e => setSearch(e.target.value)} className="h-11 rounded-full pl-11 bg-card border-border/50" /></div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto"><TabsList className="rounded-full bg-muted/70 p-1 h-11 w-full lg:w-auto grid grid-cols-4"><TabsTrigger value="all" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">All ({requests.length})</TabsTrigger><TabsTrigger value="pending" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Pending ({pendingCount})</TabsTrigger><TabsTrigger value="in_progress" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Active ({inProgressCount})</TabsTrigger><TabsTrigger value="completed" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Done ({completedCount})</TabsTrigger></TabsList></Tabs>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredRequests.map((request, idx) => {
              const raw = (request as any)._raw;
              const tenant = tenants.get(request.tenantId);
              const unit = units.get(request.unitId);
              const property = properties.get(request.propertyId);
              const StatusIcon = getStatusIcon(request.status);
              return (
                <motion.div key={request.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} whileHover={{ y: -2 }}>
                  <Card className="rounded-[20px] border-border/50 hover:shadow-lg hover:border-foreground/10 transition-all duration-300 overflow-hidden group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${request.status === "completed" ? "bg-success/10 text-success" : request.status === "in_progress" || (request as any).status === "assigned" ? "bg-info/10 text-info" : "bg-warning/10 text-warning"}`}><StatusIcon className="h-5 w-5" /></div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="font-[Fraunces] text-[18px] leading-tight tracking-tight truncate">{request.title}</CardTitle>
                            <CardDescription className="mono text-[11px] mt-1 flex items-center gap-1.5"><MapPin className="h-3 w-3" />{raw?.propertyName || property?.name} • Unit {raw?.unitNumber || unit?.unitNumber}</CardDescription>
                          </div>
                        </div>
                        <Badge className={`rounded-full mono text-[10px] uppercase tracking-widest border-0 shrink-0 ${request.priority === "high" ? "bg-destructive text-destructive-foreground" : request.priority === "medium" ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground"}`}>{request.priority}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-[13px] leading-[1.5] opacity-70 line-clamp-2">{request.description}</p>
                      <div className="flex items-center gap-2 mono text-[11px] opacity-60"><span>By {raw?.tenantFirstName || tenant?.firstName} {raw?.tenantLastName || tenant?.lastName} • {new Date(request.createdAt).toLocaleDateString()}</span></div>
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <Badge variant="outline" className="rounded-full mono text-[10px] uppercase tracking-widest">{request.status.replace("_", " ")}</Badge>
                        <div className="flex gap-2"><Button variant="ghost" size="sm" className="rounded-full h-8 text-[12px]">Details</Button><Button size="sm" className="rounded-full h-8 text-[12px] bg-foreground text-background">{request.status !== "completed" ? "Update" : "View"} <ArrowUpRight className="ml-1 h-3 w-3" /></Button></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          {filteredRequests.length === 0 && <Card className="rounded-[24px] border-dashed bg-muted/20"><CardContent className="py-16 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-foreground text-background mb-4"><Wrench className="h-8 w-8" /></div><h3 className="font-[Fraunces] text-[22px] font-bold">No requests</h3><p className="mono text-[13px] opacity-60 mt-2">All clear — no maintenance needed.</p></CardContent></Card>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
