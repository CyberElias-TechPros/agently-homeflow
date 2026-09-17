import { useEffect, useState } from "react";
import { Users, Mail, Phone, Calendar, Search, ArrowUpRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api";
import { getAll, Lead } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export default function Leads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState("new");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLeads(); }, []);
  useEffect(() => { const t = setTimeout(loadLeads, 300); return () => clearTimeout(t); }, [search, activeTab]);

  async function loadLeads() {
    setLoading(true);
    try {
      try {
        const res = await apiClient.getLeads({ status: activeTab !== "all" ? activeTab : undefined });
        if (res.success) {
          const mapped = res.data.map((l: any) => ({
            id: l.id,
            listingId: l.listingId,
            agentId: l.agentId,
            name: l.name,
            email: l.email,
            phone: l.phone,
            message: l.message,
            status: l.status,
            scheduledViewing: l.scheduledViewing,
            notes: l.notes,
            createdAt: l.createdAt,
            // @ts-ignore
            _raw: l,
          }));
          setLeads(mapped);
          setLoading(false);
          return;
        }
      } catch {}
      const allLeads = await getAll<Lead>("leads");
      const myLeads = allLeads.filter(l => l.agentId === user?.id);
      setLeads(myLeads);
    } finally { setLoading(false); }
  }

  async function updateStatus(id: string, status: string) {
    try { const res = await apiClient.updateLead(id, { status }); if (res.success) loadLeads(); } catch {}
  }

  const filtered = leads.filter(l => {
    if (activeTab !== "all" && l.status !== activeTab) return false;
    if (search && !`${l.name} ${l.email} ${l.phone}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = { new: "bg-blue-500", contacted: "bg-yellow-500", viewing_scheduled: "bg-purple-500", negotiation: "bg-orange-500", converted: "bg-success", lost: "bg-destructive" };
    return colors[status] || "bg-muted-foreground";
  };

  if (loading) return <div className="h-[400px] rounded-[20px] bg-muted animate-pulse" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background"><Users className="h-4 w-4" /></div><span className="mono text-[11px] uppercase tracking-[0.14em] opacity-60">{leads.length} leads • {leads.filter(l => l.status === "new").length} new</span></div>
          <div><h1 className="font-[Fraunces] text-[40px] lg:text-[48px] font-bold leading-[0.9] tracking-[-0.03em]">Leads</h1><p className="text-[15px] opacity-60 mt-3 max-w-[48ch]">Prospects, nurtured. Every inquiry tracked from first click to closed deal.</p></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" /><Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="h-11 rounded-full pl-11 bg-card border-border/50" /></div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto"><TabsList className="rounded-full bg-muted/70 p-1 h-11 w-full lg:w-auto grid grid-cols-4"><TabsTrigger value="new" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">New ({leads.filter(l => l.status === "new").length})</TabsTrigger><TabsTrigger value="contacted" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Contacted</TabsTrigger><TabsTrigger value="viewing_scheduled" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Viewing</TabsTrigger><TabsTrigger value="converted" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Won</TabsTrigger></TabsList></Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((lead, idx) => {
          const raw = (lead as any)._raw;
          return (
            <motion.div key={lead.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} whileHover={{ y: -2 }}>
              <Card className="rounded-[20px] border-border/50 hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3"><div className={`h-2 w-2 rounded-full ${getStatusColor(lead.status)} animate-pulse mt-1`} /><div><CardTitle className="text-[16px] leading-tight">{lead.name}</CardTitle><CardDescription className="mono text-[11px] mt-1">{raw?.listingTitle || raw?.propertyName || "Listing"} • {new Date(lead.createdAt).toLocaleDateString()}</CardDescription></div></div>
                    <Badge variant="outline" className="rounded-full mono text-[10px] uppercase tracking-widest capitalize">{lead.status.replace("_", " ")}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-[13px]">
                    <div className="flex items-center gap-2 opacity-70"><Mail className="h-3.5 w-3.5" />{lead.email}</div>
                    <div className="flex items-center gap-2 opacity-70"><Phone className="h-3.5 w-3.5" />{lead.phone}</div>
                    {lead.message && <p className="text-[12px] leading-[1.5] opacity-70 bg-muted/50 p-3 rounded-[12px] mt-2">"{lead.message}"</p>}
                  </div>
                  <div className="flex gap-2 pt-2">
                    {lead.status === "new" && <><Button size="sm" className="flex-1 rounded-full bg-foreground text-background h-9" onClick={() => updateStatus(lead.id, "contacted")}>Contact</Button><Button size="sm" variant="outline" className="flex-1 rounded-full h-9" onClick={() => updateStatus(lead.id, "viewing_scheduled")}><Calendar className="mr-1 h-3 w-3" /> Viewing</Button></>}
                    {lead.status !== "new" && <Button size="sm" variant="outline" className="w-full rounded-full h-9">View details <ArrowUpRight className="ml-1 h-3 w-3" /></Button>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && <Card className="rounded-[24px] border-dashed bg-muted/20"><CardContent className="py-16 text-center"><Users className="h-12 w-12 mx-auto opacity-20 mb-4" /><h3 className="font-[Fraunces] text-[20px] font-bold">No leads</h3><p className="mono text-[12px] opacity-60 mt-1">Leads from listings will appear here</p></CardContent></Card>}
    </div>
  );
}
