import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Home, Briefcase, Store, Search, Filter, ArrowUpRight, MapPin, Users, Sparkles, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AddPropertyDialog from "@/components/AddPropertyDialog";
import { getAll, Property, Unit, getByIndex } from "@/lib/db";
import { apiClient } from "@/lib/api";
import { motion } from "framer-motion";

export default function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [unitsMap, setUnitsMap] = useState<Map<string, Unit[]>>(new Map());
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    setLoading(true);
    try {
      // Try API
      try {
        const res = await apiClient.getProperties({ search: search || undefined, type: typeFilter !== "all" ? typeFilter : undefined });
        if (res.success) {
          const mapped: Property[] = res.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            address: p.address,
            type: p.type,
            units: p.totalUnitsActual || p.totalUnits || p.unitsData?.length || 1,
            createdAt: p.createdAt,
            city: p.city,
            // @ts-ignore extra
            _raw: p,
          }));
          setProperties(mapped);
          const map = new Map<string, Unit[]>();
          for (const p of res.data) {
            const units: Unit[] = (p.unitsData || []).map((u: any) => ({
              id: u.id,
              propertyId: p.id,
              unitNumber: u.unit_number || u.unitNumber,
              rent: u.rent,
              status: u.status,
              bedrooms: u.bedrooms,
              createdAt: u.created_at || new Date().toISOString(),
            }));
            map.set(p.id, units);
          }
          setUnitsMap(map);
          setLoading(false);
          return;
        }
      } catch (e: any) {
        if (e.message !== 'API_UNAVAILABLE') console.warn(e);
      }

      // Fallback IndexedDB
      const propsData = await getAll<Property>("properties");
      setProperties(propsData);
      const unitsData = new Map<string, Unit[]>();
      for (const prop of propsData) {
        const propUnits = await getByIndex<Unit>("units", "propertyId", prop.id);
        unitsData.set(prop.id, propUnits);
      }
      setUnitsMap(unitsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => loadProperties(), 300);
    return () => clearTimeout(t);
  }, [search, typeFilter]);

  const getPropertyIcon = (type: Property["type"]) => {
    switch (type) {
      case "apartment": return Building2;
      case "house": return Home;
      case "office": return Briefcase;
      case "commercial": return Store;
      default: return Building2;
    }
  };

  const filtered = properties.filter(p => {
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    if (search && !`${p.name} ${p.address}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalUnits = Array.from(unitsMap.values()).flat().length;
  const occupied = Array.from(unitsMap.values()).flat().filter(u => u.status === "occupied").length;
  const occupancy = totalUnits ? Math.round((occupied / totalUnits) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-[120px] rounded-[24px] bg-muted animate-pulse" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-[280px] rounded-[20px] bg-muted animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header — editorial */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background"><Building2 className="h-4 w-4" /></div>
            <span className="mono text-[11px] uppercase tracking-[0.14em] opacity-60">Portfolio • {filtered.length} estates • {occupancy}% occupied</span>
          </div>
          <div>
            <h1 className="font-[Fraunces] text-[40px] lg:text-[48px] font-bold leading-[0.9] tracking-[-0.03em]">Properties</h1>
            <p className="text-[15px] leading-[1.5] opacity-60 mt-3 max-w-[48ch]">Your estates, composed. Every unit, every tenant, every flow — in one cinematic view.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-muted/70 border border-border/50 p-1">
            {["all", "apartment", "house", "commercial"].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)} className={`rounded-full px-4 py-2 text-[13px] font-medium capitalize transition-all ${typeFilter === t ? "bg-foreground text-background shadow" : "opacity-60 hover:opacity-100 hover:bg-background"}`}>{t}</button>
            ))}
          </div>
          <AddPropertyDialog onSuccess={loadProperties} />
        </div>
      </div>

      {/* Search + stats */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
          <Input placeholder="Search estates, addresses, cities..." value={search} onChange={e => setSearch(e.target.value)} className="h-[48px] rounded-full pl-11 bg-card border-border/60 focus:border-foreground/20 focus:ring-4 focus:ring-foreground/[0.06]" />
        </div>
        <div className="flex gap-2">
          <div className="rounded-full bg-card border border-border/50 px-5 h-[48px] flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="mono text-[11px] uppercase tracking-widest opacity-60">{totalUnits} units</span>
            <span className="text-[13px] font-medium">{occupied} occupied</span>
          </div>
          <Button variant="outline" className="rounded-full h-[48px] w-[48px] p-0"><Filter className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Grid — bento, immersive */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((property, idx) => {
          const Icon = getPropertyIcon(property.type);
          const units = unitsMap.get(property.id) || [];
          const occupiedCount = units.filter(u => u.status === "occupied").length;
          const vacantCount = units.filter(u => u.status === "vacant").length;
          const maintenanceCount = units.filter(u => u.status === "maintenance").length;
          const raw = (property as any)._raw;

          return (
            <motion.div key={property.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.23, 1, 0.32, 1] }} whileHover={{ y: -4 }} className="group">
              <Card className="rounded-[20px] border-border/50 overflow-hidden hover:shadow-xl hover:border-foreground/10 transition-all duration-500 h-full flex flex-col">
                {/* Image header — cinematic */}
                <div className="relative h-[180px] bg-muted overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-foreground/[0.02] to-secondary/10" />
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(at 20% 30%, hsl(var(--foreground)) 0%, transparent 50%)` }} />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-md group-hover:scale-105 group-hover:rotate-[-2deg] transition-all duration-300"><Icon className="h-5 w-5" /></div>
                    <Badge className="rounded-full bg-card/90 backdrop-blur text-foreground border-border/50 shadow-sm capitalize mono text-[10px] tracking-widest">{property.type}</Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-1.5">
                    {occupiedCount > 0 && <Badge className="rounded-full bg-success text-success-foreground border-0 text-[11px]">{occupiedCount} occ</Badge>}
                    {vacantCount > 0 && <Badge variant="secondary" className="rounded-full bg-warning/20 text-warning-foreground border-0 text-[11px]">{vacantCount} vac</Badge>}
                    {maintenanceCount > 0 && <Badge variant="destructive" className="rounded-full text-[11px]">{maintenanceCount} fix</Badge>}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent">
                    <h3 className="font-[Fraunces] text-[20px] font-bold leading-tight text-background tracking-tight">{property.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-background/70"><MapPin className="h-3 w-3" /><span className="mono text-[11px] truncate">{property.address} {raw?.city ? `• ${raw.city}` : ''}</span></div>
                  </div>
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/[0.03] transition-colors duration-300" />
                </div>

                <CardContent className="p-5 flex-1 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mono text-[11px] uppercase tracking-widest opacity-60"><Users className="h-3.5 w-3.5" /> {units.length} units</div>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden"><div className="h-full bg-foreground transition-all duration-700" style={{ width: `${units.length ? (occupiedCount / units.length) * 100 : 0}%` }} /></div>
                      <span className="mono text-[11px] font-medium">{units.length ? Math.round((occupiedCount / units.length) * 100) : 0}%</span>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 -mr-1">
                    {units.slice(0, 4).map(unit => (
                      <div key={unit.id} className="flex items-center justify-between rounded-[12px] bg-muted/50 px-3 py-2.5 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-2.5"><div className={`h-2 w-2 rounded-full ${unit.status === "occupied" ? "bg-success" : unit.status === "vacant" ? "bg-warning" : "bg-destructive"}`} /><span className="text-[13px] font-medium">{unit.unitNumber}</span>{(unit as any).bedrooms && <span className="mono text-[10px] opacity-50">{(unit as any).bedrooms}BR</span>}</div>
                        <div className="flex items-center gap-2"><span className="mono text-[11px] opacity-70">₦{(unit.rent || 0).toLocaleString()}</span><div className={`h-5 w-5 rounded-full flex items-center justify-center ${unit.status === "occupied" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}><ArrowUpRight className="h-3 w-3" /></div></div>
                      </div>
                    ))}
                    {units.length > 4 && <p className="mono text-[11px] text-center opacity-50 py-1">+{units.length - 4} more units</p>}
                    {units.length === 0 && <div className="text-center py-6"><p className="mono text-[11px] opacity-50">No units yet</p></div>}
                  </div>

                  <div className="mt-auto pt-2 flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-full h-10 text-[13px]" onClick={() => navigate(`/properties/${property.id}`)}>Details</Button>
                    <Button className="flex-1 rounded-full h-10 text-[13px] bg-foreground text-background hover:bg-foreground/90">Manage <ArrowUpRight className="ml-1 h-3 w-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="rounded-[24px] border-dashed border-border/60 bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-foreground text-background mb-6"><Building2 className="h-8 w-8" /></div>
            <h3 className="font-[Fraunces] text-[24px] font-bold tracking-tight">No estates found</h3>
            <p className="mono text-[13px] opacity-60 mt-2 max-w-[36ch]">Try adjusting search or create your first property. The flow starts with one.</p>
            <div className="mt-6"><AddPropertyDialog onSuccess={loadProperties} /></div>
          </CardContent>
        </Card>
      )}

      {/* Bottom CTA — editorial */}
      <div className="rounded-[20px] bg-secondary/20 border border-secondary/30 p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground shrink-0"><Sparkles className="h-5 w-5" /></div>
          <div><p className="font-medium">Portfolio insights</p><p className="text-[13px] opacity-70 mt-1 max-w-[56ch]">Your occupancy is {occupancy}%. {occupancy < 80 ? "Consider listing vacant units or running a campaign." : "Excellent — consider raising rents on renewal."} Analytics are live in Cloudflare D1.</p></div>
        </div>
        <Button variant="outline" className="rounded-full bg-card" onClick={() => navigate('/analytics')}>View analytics <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
      </div>
    </div>
  );
}
