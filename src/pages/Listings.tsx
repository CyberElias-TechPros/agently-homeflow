import { useEffect, useState } from "react";
import { Building2, Eye, Users, Plus, Search, ArrowUpRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api";
import { getAll, Listing } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export default function Listings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadListings(); }, []);
  useEffect(() => { const t = setTimeout(loadListings, 300); return () => clearTimeout(t); }, [search, activeTab]);

  async function loadListings() {
    setLoading(true);
    try {
      try {
        const res = await apiClient.getListings({ status: activeTab !== "all" ? activeTab : undefined });
        if (res.success) {
          const mapped = res.data.map((l: any) => ({
            id: l.id,
            propertyId: l.propertyId,
            unitId: l.unitId,
            agentId: l.agentId,
            title: l.title,
            description: l.description,
            rent: l.rent,
            images: l.images,
            featured: l.featured,
            status: l.status,
            views: l.views,
            leads: l.leads,
            createdAt: l.createdAt,
            // @ts-ignore
            _raw: l,
          }));
          setListings(mapped);
          setLoading(false);
          return;
        }
      } catch {}
      const allListings = await getAll<Listing>("listings");
      const myListings = allListings.filter(l => l.agentId === user?.id);
      setListings(myListings);
    } finally { setLoading(false); }
  }

  const filtered = listings.filter(l => {
    if (activeTab !== "all" && l.status !== activeTab) return false;
    if (search && !`${l.title} ${l.description}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);
  const totalLeads = listings.reduce((sum, l) => sum + (l.leads || 0), 0);
  const activeListings = listings.filter(l => l.status === "published").length;

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

  if (loading) return <div className="h-[400px] rounded-[20px] bg-muted animate-pulse" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background"><Building2 className="h-4 w-4" /></div><span className="mono text-[11px] uppercase tracking-[0.14em] opacity-60">{activeListings} active • {totalViews} views • {totalLeads} leads</span></div>
          <div><h1 className="font-[Fraunces] text-[40px] lg:text-[48px] font-bold leading-[0.9] tracking-[-0.03em]">Listings</h1><p className="text-[15px] opacity-60 mt-3 max-w-[48ch]">Your properties on market. Cinematic tours, tracked leads, closed deals.</p></div>
        </div>
        <Button className="rounded-full h-11 bg-foreground text-background"><Plus className="mr-2 h-4 w-4" /> Create listing</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[20px] border-border/50 bg-foreground text-background"><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="mono text-[11px] uppercase tracking-widest opacity-60">Active</CardTitle><Building2 className="h-4 w-4 opacity-60" /></CardHeader><CardContent><div className="font-[Fraunces] text-[28px] font-bold leading-none">{activeListings}</div></CardContent></Card>
        <Card className="rounded-[20px] border-border/50"><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="mono text-[11px] uppercase tracking-widest opacity-60">Views</CardTitle><Eye className="h-4 w-4 opacity-60" /></CardHeader><CardContent><div className="font-[Fraunces] text-[28px] font-bold leading-none">{totalViews}</div></CardContent></Card>
        <Card className="rounded-[20px] border-border/50 bg-secondary text-secondary-foreground border-secondary"><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="mono text-[11px] uppercase tracking-widest opacity-70">Leads</CardTitle><Users className="h-4 w-4" /></CardHeader><CardContent><div className="font-[Fraunces] text-[28px] font-bold leading-none">{totalLeads}</div></CardContent></Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" /><Input placeholder="Search listings..." value={search} onChange={e => setSearch(e.target.value)} className="h-11 rounded-full pl-11 bg-card border-border/50" /></div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto"><TabsList className="rounded-full bg-muted/70 p-1 h-11 w-full lg:w-auto grid grid-cols-5"><TabsTrigger value="all" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">All ({listings.length})</TabsTrigger><TabsTrigger value="draft" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Draft</TabsTrigger><TabsTrigger value="pending_verification" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Pending</TabsTrigger><TabsTrigger value="published" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Live</TabsTrigger><TabsTrigger value="taken" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Taken</TabsTrigger></TabsList></Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((listing, idx) => {
          const raw = (listing as any)._raw;
          return (
            <motion.div key={listing.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} whileHover={{ y: -3 }}>
              <Card className="rounded-[20px] border-border/50 overflow-hidden hover:shadow-xl transition-all group">
                <div className="h-48 bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 via-foreground/[0.02] to-secondary/20" />
                  {listing.featured && <Badge className="absolute top-3 right-3 rounded-full bg-secondary text-secondary-foreground border-0 mono text-[10px] uppercase tracking-widest">Featured</Badge>}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent"><h3 className="font-[Fraunces] text-[18px] font-bold text-background leading-tight">{listing.title}</h3><p className="mono text-[11px] text-background/70 mt-1">{raw?.propertyName} • Unit {raw?.unitNumber}</p></div>
                </div>
                <CardContent className="p-5 space-y-4">
                  <p className="text-[13px] opacity-70 line-clamp-2 leading-[1.5]">{listing.description}</p>
                  <div className="flex items-center justify-between"><div><p className="mono text-[10px] uppercase tracking-widest opacity-60">Rent</p><p className="font-[Fraunces] text-[20px] font-bold leading-none">{formatCurrency(listing.rent)}</p></div><div className="text-right"><p className="mono text-[10px] uppercase tracking-widest opacity-60">Views / Leads</p><p className="font-medium text-[13px]">{listing.views} / {listing.leads}</p></div></div>
                  <div className="flex gap-2"><Button variant="outline" size="sm" className="flex-1 rounded-full h-9">Edit</Button><Button size="sm" className="flex-1 rounded-full bg-foreground text-background h-9">View <ArrowUpRight className="ml-1 h-3 w-3" /></Button></div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && <Card className="rounded-[24px] border-dashed bg-muted/20"><CardContent className="py-16 text-center"><Building2 className="h-12 w-12 mx-auto opacity-20 mb-4" /><h3 className="font-[Fraunces] text-[20px] font-bold">No listings</h3><p className="mono text-[12px] opacity-60 mt-1">Create your first listing to go live</p></CardContent></Card>}
    </div>
  );
}
