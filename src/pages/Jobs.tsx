import { useEffect, useState } from "react";
import { Wrench, Search, CheckCircle2, Clock, DollarSign, MapPin, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api";
import { getAll, MaintenanceRequest } from "@/lib/db";
import { motion } from "framer-motion";

export default function Jobs() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadJobs(); }, []);
  useEffect(() => { const t = setTimeout(loadJobs, 300); return () => clearTimeout(t); }, [search, activeTab]);

  async function loadJobs() {
    setLoading(true);
    try {
      try {
        const res = await apiClient.getMaintenance({ status: activeTab !== "all" ? activeTab : undefined, search: search || undefined });
        if (res.success) {
          const mapped = res.data.map((m: any) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            status: m.status,
            priority: m.priority,
            propertyId: m.propertyId,
            unitId: m.unitId,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            // @ts-ignore
            _raw: m,
          }));
          setRequests(mapped);
          setLoading(false);
          return;
        }
      } catch {}
      const data = await getAll<MaintenanceRequest>("maintenance");
      setRequests(data);
    } finally { setLoading(false); }
  }

  async function handleStatusUpdate(request: any, status: string) {
    try { const res = await apiClient.updateMaintenance(request.id, { status }); if (res.success) loadJobs(); } catch {}
  }

  const filtered = requests.filter(r => {
    if (activeTab !== "all" && r.status !== activeTab) return false;
    if (search && !`${r.title} ${r.description}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const inProgressCount = requests.filter(r => r.status === "in_progress" || (r as any).status === "assigned").length;
  const completedCount = requests.filter(r => r.status === "completed").length;

  if (loading) return <div className="h-[400px] rounded-[20px] bg-muted animate-pulse" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background"><Wrench className="h-4 w-4" /></div><span className="mono text-[11px] uppercase tracking-[0.14em] opacity-60">{requests.length} jobs • {pendingCount} pending • {inProgressCount} active</span></div>
          <div><h1 className="font-[Fraunces] text-[40px] lg:text-[48px] font-bold leading-[0.9] tracking-[-0.03em]">Jobs</h1><p className="text-[15px] opacity-60 mt-3 max-w-[48ch]">Work orders, assigned. Fix, invoice, and get paid — all in flow.</p></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" /><Input placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} className="h-11 rounded-full pl-11 bg-card border-border/50" /></div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto"><TabsList className="rounded-full bg-muted/70 p-1 h-11 w-full lg:w-auto grid grid-cols-4"><TabsTrigger value="all" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">All ({requests.length})</TabsTrigger><TabsTrigger value="pending" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Pending ({pendingCount})</TabsTrigger><TabsTrigger value="in_progress" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Active ({inProgressCount})</TabsTrigger><TabsTrigger value="completed" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Done ({completedCount})</TabsTrigger></TabsList></Tabs>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((request, idx) => {
              const raw = (request as any)._raw;
              return (
                <motion.div key={request.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} whileHover={{ y: -2 }}>
                  <Card className="rounded-[20px] border-border/50 hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${request.status === "completed" ? "bg-success/10 text-success" : request.status === "in_progress" ? "bg-info/10 text-info" : "bg-warning/10 text-warning"}`}><Wrench className="h-5 w-5" /></div>
                          <div className="flex-1 min-w-0"><CardTitle className="font-[Fraunces] text-[18px] leading-tight truncate">{request.title}</CardTitle><CardDescription className="mono text-[11px] mt-1 flex items-center gap-1.5"><MapPin className="h-3 w-3" />{raw?.propertyName} • Unit {raw?.unitNumber}</CardDescription></div>
                        </div>
                        <Badge className={`rounded-full mono text-[10px] uppercase tracking-widest border-0 ${request.priority === "high" ? "bg-destructive text-destructive-foreground" : request.priority === "medium" ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground"}`}>{request.priority}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-[13px] opacity-70 leading-[1.5]">{request.description}</p>
                      <div className="flex items-center gap-4 mono text-[11px] opacity-60"><span>Created: {new Date(request.createdAt).toLocaleDateString()}</span><span>Updated: {new Date(request.updatedAt).toLocaleDateString()}</span></div>
                      <div className="flex gap-2 pt-2">
                        {request.status === "pending" && <Button size="sm" onClick={() => handleStatusUpdate(request, "in_progress")} className="rounded-full bg-foreground text-background h-9">Accept job</Button>}
                        {request.status === "in_progress" && <><Button size="sm" onClick={() => handleStatusUpdate(request, "completed")} className="rounded-full bg-success text-success-foreground h-9"><CheckCircle2 className="mr-2 h-4 w-4" /> Complete</Button><Button size="sm" variant="outline" className="rounded-full h-9"><DollarSign className="mr-2 h-4 w-4" /> Invoice</Button></>}
                        {request.status === "completed" && <Button size="sm" variant="outline" className="w-full rounded-full h-9">View details <ArrowUpRight className="ml-1 h-3 w-3" /></Button>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            {filtered.length === 0 && <Card className="rounded-[24px] border-dashed bg-muted/20"><CardContent className="py-16 text-center"><Wrench className="h-12 w-12 mx-auto opacity-20 mb-4" /><h3 className="font-[Fraunces] text-[20px] font-bold">No jobs</h3><p className="mono text-[12px] opacity-60 mt-1">Work orders will appear here</p></CardContent></Card>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
