import { useEffect, useState } from "react";
import { ClipboardList, Search, Check, X, Clock, User, Mail, DollarSign, Calendar, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api";
import { getAll, Application } from "@/lib/db";
import { motion } from "framer-motion";

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadApplications(); }, []);
  useEffect(() => { const t = setTimeout(loadApplications, 300); return () => clearTimeout(t); }, [search, activeTab]);

  async function loadApplications() {
    setLoading(true);
    try {
      try {
        const res = await apiClient.getApplications({ status: activeTab !== "all" ? activeTab : undefined });
        if (res.success) {
          const mapped = res.data.map((a: any) => ({
            id: a.id,
            firstName: a.firstName,
            lastName: a.lastName,
            email: a.email,
            phone: a.phone,
            propertyId: a.propertyId,
            unitId: a.unitId,
            status: a.status,
            monthlyIncome: a.monthlyIncome,
            moveInDate: a.moveInDate,
            employmentStatus: a.employmentStatus,
            createdAt: a.createdAt,
            // @ts-ignore
            _raw: a,
          }));
          setApplications(mapped);
          setLoading(false);
          return;
        }
      } catch {}
      const data = await getAll<Application>("applications");
      setApplications(data);
    } finally { setLoading(false); }
  }

  async function handleStatus(id: string, status: string) {
    try {
      const res = await apiClient.updateApplication(id, { status });
      if (res.success) loadApplications();
    } catch (e) { console.error(e); }
  }

  const filtered = applications.filter(a => {
    if (activeTab !== "all" && a.status !== activeTab) return false;
    if (search && !`${a.firstName} ${a.lastName} ${a.email}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    screening: applications.filter(a => a.status === "screening").length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  };

  if (loading) return <div className="h-[400px] rounded-[20px] bg-muted animate-pulse" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background"><ClipboardList className="h-4 w-4" /></div><span className="mono text-[11px] uppercase tracking-[0.14em] opacity-60">{applications.length} applications • {counts.pending} pending</span></div>
          <div><h1 className="font-[Fraunces] text-[40px] lg:text-[48px] font-bold leading-[0.9] tracking-[-0.03em]">Applications</h1><p className="text-[15px] opacity-60 mt-3 max-w-[48ch]">New leases, screened. Approve, reject, or request more info — all in one flow.</p></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" /><Input placeholder="Search applicants..." value={search} onChange={e => setSearch(e.target.value)} className="h-11 rounded-full pl-11 bg-card border-border/50" /></div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto"><TabsList className="rounded-full bg-muted/70 p-1 h-11 w-full lg:w-auto grid grid-cols-5"><TabsTrigger value="all" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">All ({counts.all})</TabsTrigger><TabsTrigger value="pending" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Pending ({counts.pending})</TabsTrigger><TabsTrigger value="screening" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Screening</TabsTrigger><TabsTrigger value="approved" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Approved</TabsTrigger><TabsTrigger value="rejected" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Rejected</TabsTrigger></TabsList></Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((app, idx) => {
          const raw = (app as any)._raw;
          return (
            <motion.div key={app.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} whileHover={{ y: -2 }}>
              <Card className="rounded-[20px] border-border/50 hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted"><User className="h-5 w-5 opacity-60" /></div><div><CardTitle className="text-[16px] leading-tight">{app.firstName} {app.lastName}</CardTitle><CardDescription className="mono text-[11px] mt-1">{raw?.propertyName} • Unit {raw?.unitNumber}</CardDescription></div></div>
                    <Badge className={`rounded-full mono text-[10px] uppercase tracking-widest border-0 ${app.status === "approved" ? "bg-success text-success-foreground" : app.status === "rejected" ? "bg-destructive text-destructive-foreground" : app.status === "screening" ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground"}`}>{app.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-[13px]">
                    <div className="flex items-center gap-2 opacity-70"><Mail className="h-3.5 w-3.5" />{app.email}</div>
                    <div className="flex items-center gap-2 opacity-70"><DollarSign className="h-3.5 w-3.5" />₦{app.monthlyIncome?.toLocaleString()} / month • {app.employmentStatus}</div>
                    <div className="flex items-center gap-2 opacity-70"><Calendar className="h-3.5 w-3.5" />Move-in: {app.moveInDate ? new Date(app.moveInDate).toLocaleDateString() : "ASAP"}</div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {app.status === "pending" || app.status === "screening" ? (
                      <>
                        <Button size="sm" className="flex-1 rounded-full bg-success text-success-foreground hover:bg-success/90 h-9" onClick={() => handleStatus(app.id, "approved")}><Check className="mr-1 h-3.5 w-3.5" /> Approve</Button>
                        <Button size="sm" variant="outline" className="flex-1 rounded-full h-9" onClick={() => handleStatus(app.id, "rejected")}><X className="mr-1 h-3.5 w-3.5" /> Reject</Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full rounded-full h-9">View details <ArrowUpRight className="ml-1 h-3 w-3" /></Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && <Card className="rounded-[24px] border-dashed bg-muted/20"><CardContent className="py-16 text-center"><ClipboardList className="h-12 w-12 mx-auto opacity-20 mb-4" /><h3 className="font-[Fraunces] text-[20px] font-bold">No applications</h3><p className="mono text-[12px] opacity-60 mt-1">New tenant applications will appear here</p></CardContent></Card>}
    </div>
  );
}
