import { useEffect, useState } from "react";
import { TrendingDown, Plus, Search, Calendar, DollarSign, ArrowUpRight, Sparkles, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAll, Expense, Property } from "@/lib/db";
import { apiClient } from "@/lib/api";
import { motion } from "framer-motion";
import AddExpenseDialog from "@/components/AddExpenseDialog";

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [properties, setProperties] = useState<Map<string, Property>>(new Map());
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadExpenses(); }, []);
  useEffect(() => { const t = setTimeout(loadExpenses, 300); return () => clearTimeout(t); }, [search, categoryFilter]);

  async function loadExpenses() {
    setLoading(true);
    try {
      try {
        const res = await apiClient.getExpenses({ category: categoryFilter !== "all" ? categoryFilter : undefined, search: search || undefined });
        if (res.success) {
          const mapped: Expense[] = res.data.map((e: any) => ({
            id: e.id,
            propertyId: e.propertyId,
            category: e.category,
            amount: e.amount,
            description: e.description,
            date: e.date,
            createdAt: e.createdAt,
            // @ts-ignore
            _raw: e,
          }));
          setExpenses(mapped);
          if ((res as any).summary) setSummary((res as any).summary);
          setLoading(false);
          return;
        }
      } catch (e: any) { if (e.message !== 'API_UNAVAILABLE') console.warn(e); }

      const expensesData = await getAll<Expense>("expenses");
      setExpenses(expensesData);
    } finally { setLoading(false); }
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

  const filtered = expenses.filter(e => {
    if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
    if (search && !`${e.description} ${e.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const total = summary?.total ?? filtered.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = summary?.byCategory || filtered.reduce((acc: any, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {});

  if (loading) return <div className="space-y-6"><div className="h-[100px] rounded-[24px] bg-muted animate-pulse" /><div className="h-[400px] rounded-[20px] bg-muted animate-pulse" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background"><TrendingDown className="h-4 w-4" /></div><span className="mono text-[11px] uppercase tracking-[0.14em] opacity-60">{filtered.length} expenses • {formatCurrency(total)} total outflow</span></div>
          <div><h1 className="font-[Fraunces] text-[40px] lg:text-[48px] font-bold leading-[0.9] tracking-[-0.03em]">Expenses</h1><p className="text-[15px] opacity-60 mt-3 max-w-[48ch]">Every cost, categorized. From repairs to taxes — your outflows, crystal clear.</p></div>
        </div>
        <AddExpenseDialog onSuccess={loadExpenses} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[20px] border-border/50 bg-foreground text-background"><CardHeader className="pb-2"><CardTitle className="mono text-[11px] uppercase tracking-widest opacity-60">Total spent</CardTitle></CardHeader><CardContent><div className="font-[Fraunces] text-[28px] font-bold leading-none">{formatCurrency(total)}</div><p className="mono text-[11px] opacity-60 mt-2">{filtered.length} transactions</p></CardContent></Card>
        <Card className="rounded-[20px] border-border/50"><CardHeader className="pb-2"><CardTitle className="mono text-[11px] uppercase tracking-widest opacity-60">Top category</CardTitle></CardHeader><CardContent><div className="font-[Fraunces] text-[20px] font-bold leading-none capitalize">{Object.entries(byCategory).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "—"}</div><p className="mono text-[11px] opacity-60 mt-2">{formatCurrency((Object.entries(byCategory).sort((a: any, b: any) => b[1] - a[1])[0]?.[1] as number) || 0)}</p></CardContent></Card>
        <Card className="rounded-[20px] border-border/50 bg-secondary text-secondary-foreground border-secondary"><CardHeader className="pb-2"><CardTitle className="mono text-[11px] uppercase tracking-widest opacity-70 flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> Insights</CardTitle></CardHeader><CardContent><p className="text-[13px] leading-[1.4] font-medium">Track, categorize, and optimize. Your biggest cost is {Object.entries(byCategory).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "repairs"} — consider preventive maintenance.</p></CardContent></Card>
      </div>

      <Card className="rounded-[20px] border-border/50">
        <CardHeader><CardTitle className="font-[Fraunces] text-[20px]">Expense ledger</CardTitle><CardDescription className="mono text-[11px]">All outflows • Search and filter</CardDescription></CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" /><Input placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} className="h-11 rounded-full pl-11 bg-muted/50 border-border/50" /></div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}><SelectTrigger className="h-11 rounded-full w-full md:w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger><SelectContent className="rounded-[12px]"><SelectItem value="all">All Categories</SelectItem><SelectItem value="repairs">Repairs</SelectItem><SelectItem value="taxes">Taxes</SelectItem><SelectItem value="utilities">Utilities</SelectItem><SelectItem value="insurance">Insurance</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-muted mb-4"><TrendingDown className="h-8 w-8 opacity-40" /></div><p className="font-medium">No expenses found</p><p className="mono text-[12px] opacity-60 mt-1">Add your first expense to start tracking</p></div>
            ) : (
              filtered.map((expense, idx) => {
                const raw = (expense as any)._raw;
                return (
                  <motion.div key={expense.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }} className="group flex items-center justify-between p-4 rounded-[16px] border border-border/50 hover:border-foreground/10 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive shrink-0"><DollarSign className="h-5 w-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2"><p className="font-medium truncate">{expense.description}</p><Badge variant="outline" className="rounded-full mono text-[10px] uppercase tracking-widest capitalize">{expense.category}</Badge></div>
                        <p className="mono text-[11px] opacity-60 mt-1 flex items-center gap-2"><Calendar className="h-3 w-3" />{new Date(expense.date).toLocaleDateString()} • {raw?.propertyName || raw?.property_name || "—"} {raw?.vendor ? `• ${raw.vendor}` : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4"><p className="font-[Fraunces] text-[18px] font-bold">{formatCurrency(expense.amount)}</p><ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-60 transition-opacity" /></div>
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
