import { useEffect, useState } from "react";
import { DollarSign, Download, Calendar, CreditCard, Search, ArrowUpRight, Sparkles, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAll, Payment, Tenant, Property, Unit, getById } from "@/lib/db";
import { apiClient } from "@/lib/api";
import { motion } from "framer-motion";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tenants, setTenants] = useState<Map<string, Tenant>>(new Map());
  const [properties, setProperties] = useState<Map<string, Property>>(new Map());
  const [units, setUnits] = useState<Map<string, Unit>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPayments(); }, []);
  useEffect(() => { const t = setTimeout(loadPayments, 300); return () => clearTimeout(t); }, [searchQuery, statusFilter, methodFilter]);

  async function loadPayments() {
    setLoading(true);
    try {
      try {
        const res = await apiClient.getPayments({ search: searchQuery || undefined, status: statusFilter !== "all" ? statusFilter : undefined, method: methodFilter !== "all" ? methodFilter : undefined });
        if (res.success) {
          const mapped: Payment[] = res.data.map((p: any) => ({
            id: p.id,
            tenantId: p.tenantId,
            unitId: p.unitId,
            propertyId: p.propertyId,
            amount: p.amount,
            date: p.paymentDate || p.date,
            method: p.paymentMethod || p.method,
            status: p.status,
            receiptNumber: p.receiptNumber,
            createdAt: p.createdAt,
            // @ts-ignore
            _raw: p,
          }));
          setPayments(mapped);
          if ((res as any).summary) setSummary((res as any).summary);
          else if (res.data.length) {
            const completed = res.data.filter((p: any) => p.status === "completed").reduce((s: number, p: any) => s + p.amount, 0);
            const pending = res.data.filter((p: any) => p.status === "pending").reduce((s: number, p: any) => s + p.amount, 0);
            setSummary({ totalCompleted: completed, totalPending: pending, completedCount: res.data.filter((p: any) => p.status === "completed").length, pendingCount: res.data.filter((p: any) => p.status === "pending").length, failedCount: res.data.filter((p: any) => p.status === "failed").length });
          }
          setLoading(false);
          return;
        }
      } catch (e: any) {
        if (e.message !== 'API_UNAVAILABLE') console.warn(e);
      }

      const paymentsData = await getAll<Payment>("payments");
      setPayments(paymentsData);
      const tenantsMap = new Map<string, Tenant>();
      const propsMap = new Map<string, Property>();
      const unitsMap = new Map<string, Unit>();
      for (const payment of paymentsData) {
        if (!tenantsMap.has(payment.tenantId)) {
          const tenant = await getById<Tenant>("tenants", payment.tenantId);
          if (tenant) tenantsMap.set(tenant.id, tenant);
        }
        if (!propsMap.has(payment.propertyId)) {
          const property = await getById<Property>("properties", payment.propertyId);
          if (property) propsMap.set(property.id, property);
        }
        if (!unitsMap.has(payment.unitId)) {
          const unit = await getById<Unit>("units", payment.unitId);
          if (unit) unitsMap.set(unit.id, unit);
        }
      }
      setTenants(tenantsMap);
      setProperties(propsMap);
      setUnits(unitsMap);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

  const filteredPayments = payments.filter((payment) => {
    const raw = (payment as any)._raw;
    const tenant = tenants.get(payment.tenantId) || { firstName: raw?.tenantFirstName || "", lastName: raw?.tenantLastName || "" } as any;
    const property = properties.get(payment.propertyId) || { name: raw?.propertyName || "" } as any;
    const matchesSearch = searchQuery === "" || `${tenant.firstName} ${tenant.lastName} ${property.name} ${payment.receiptNumber}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalCompleted = summary?.totalCompleted ?? payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = summary?.totalPending ?? payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const completedCount = summary?.completedCount ?? payments.filter(p => p.status === "completed").length;
  const pendingCount = summary?.pendingCount ?? payments.filter(p => p.status === "pending").length;
  const failedCount = summary?.failedCount ?? payments.filter(p => p.status === "failed").length;

  if (loading) return <div className="space-y-6"><div className="h-[120px] rounded-[24px] bg-muted animate-pulse" /><div className="h-[400px] rounded-[20px] bg-muted animate-pulse" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background"><DollarSign className="h-4 w-4" /></div><span className="mono text-[11px] uppercase tracking-[0.14em] opacity-60">{payments.length} transactions • {formatCurrency(totalCompleted)} collected</span></div>
          <div><h1 className="font-[Fraunces] text-[40px] lg:text-[48px] font-bold leading-[0.9] tracking-[-0.03em]">Payments</h1><p className="text-[15px] opacity-60 mt-3 max-w-[48ch]">Every naira, tracked. Real-time ledger with Cloudflare D1 persistence and instant receipts.</p></div>
        </div>
        <Button className="rounded-full h-11 bg-foreground text-background"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-[20px] border-border/50 bg-foreground text-background"><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="mono text-[11px] uppercase tracking-widest opacity-60">Completed</CardTitle><DollarSign className="h-4 w-4 opacity-60" /></CardHeader><CardContent><div className="font-[Fraunces] text-[28px] font-bold leading-none">{formatCurrency(totalCompleted)}</div><p className="mono text-[11px] opacity-60 mt-2">{completedCount} transactions</p></CardContent></Card>
        <Card className="rounded-[20px] border-border/50"><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="mono text-[11px] uppercase tracking-widest opacity-60">Pending</CardTitle><Calendar className="h-4 w-4 opacity-60" /></CardHeader><CardContent><div className="font-[Fraunces] text-[28px] font-bold leading-none">{formatCurrency(totalPending)}</div><p className="mono text-[11px] opacity-60 mt-2">{pendingCount} transactions</p></CardContent></Card>
        <Card className="rounded-[20px] border-border/50"><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="mono text-[11px] uppercase tracking-widest opacity-60">Failed</CardTitle><CreditCard className="h-4 w-4 opacity-60" /></CardHeader><CardContent><div className="font-[Fraunces] text-[28px] font-bold leading-none">{failedCount}</div><p className="mono text-[11px] opacity-60 mt-2">Needs attention</p></CardContent></Card>
        <Card className="rounded-[20px] border-border/50 bg-secondary text-secondary-foreground border-secondary"><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="mono text-[11px] uppercase tracking-widest opacity-70">This month</CardTitle><Sparkles className="h-4 w-4" /></CardHeader><CardContent><div className="font-[Fraunces] text-[28px] font-bold leading-none">{payments.length}</div><p className="mono text-[11px] opacity-70 mt-2">Total payments</p></CardContent></Card>
      </div>

      <Card className="rounded-[20px] border-border/50">
        <CardHeader><CardTitle className="font-[Fraunces] text-[20px]">Payment history</CardTitle><CardDescription className="mono text-[11px]">Search, filter, and audit every transaction</CardDescription></CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" /><Input placeholder="Search tenant, property, receipt..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-11 rounded-full pl-11 bg-muted/50 border-border/50" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-11 rounded-full w-full md:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent className="rounded-[12px]"><SelectItem value="all">All Status</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="failed">Failed</SelectItem></SelectContent></Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}><SelectTrigger className="h-11 rounded-full w-full md:w-[160px]"><SelectValue placeholder="Method" /></SelectTrigger><SelectContent className="rounded-[12px]"><SelectItem value="all">All Methods</SelectItem><SelectItem value="bank_transfer">Bank Transfer</SelectItem><SelectItem value="card">Card</SelectItem><SelectItem value="cash">Cash</SelectItem><SelectItem value="mobile_money">Mobile Money</SelectItem></SelectContent></Select>
          </div>

          <div className="space-y-3">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-16"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-muted mb-4"><DollarSign className="h-8 w-8 opacity-40" /></div><p className="font-medium">No payments found</p><p className="mono text-[12px] opacity-60 mt-1">Try adjusting filters</p></div>
            ) : (
              filteredPayments.map((payment, idx) => {
                const raw = (payment as any)._raw;
                const tenant = tenants.get(payment.tenantId);
                const property = properties.get(payment.propertyId);
                const unit = units.get(payment.unitId);
                return (
                  <motion.div key={payment.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }} className="group flex items-center justify-between p-4 rounded-[16px] border border-border/50 hover:border-foreground/10 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl shrink-0 ${payment.status === "completed" ? "bg-success/10 text-success" : payment.status === "pending" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}><CreditCard className="h-5 w-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2"><p className="font-medium truncate">{raw?.tenantFirstName || tenant?.firstName} {raw?.tenantLastName || tenant?.lastName} • {formatCurrency(payment.amount)}</p><Badge className={`rounded-full mono text-[10px] uppercase tracking-widest border-0 ${payment.status === "completed" ? "bg-success text-success-foreground" : payment.status === "pending" ? "bg-warning text-warning-foreground" : "bg-destructive text-destructive-foreground"}`}>{payment.status}</Badge></div>
                        <p className="mono text-[11px] opacity-60 truncate mt-1">{raw?.propertyName || property?.name} • Unit {raw?.unitNumber || unit?.unitNumber} • {payment.method?.replace("_", " ")} • {new Date(payment.date).toLocaleDateString()} • #{payment.receiptNumber?.slice(0, 12)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4"><Button variant="ghost" size="sm" className="rounded-full h-8"><Download className="h-3.5 w-3.5 mr-1" /> Receipt</Button><ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-60 transition-opacity" /></div>
                  </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
