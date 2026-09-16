import { useEffect, useState } from "react";
import { Building2, Users, DollarSign, AlertCircle, TrendingUp, CheckCircle, ArrowUpRight, Sparkles, Home, Wallet, Wrench, Calendar, MoreHorizontal } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { getAll, Property, Tenant, Payment, MaintenanceRequest, Unit } from "@/lib/db";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // Try API first
      try {
        const [summaryRes, revenueRes, propsRes, tenantsRes, paymentsRes, maintenanceRes] = await Promise.all([
          apiClient.getAnalyticsSummary().catch(() => null),
          apiClient.getRevenueAnalytics().catch(() => null),
          apiClient.getProperties().catch(() => null),
          apiClient.getTenants().catch(() => null),
          apiClient.getPayments().catch(() => null),
          apiClient.getMaintenance().catch(() => null),
        ]);

        if (summaryRes?.success) setAnalytics(summaryRes.data);
        if (revenueRes?.success) setRevenueData(revenueRes.data);

        if (propsRes?.success) {
          // Map API properties to local format for compatibility
          setProperties(propsRes.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            address: p.address,
            type: p.type,
            units: p.totalUnits || p.totalUnitsActual || 1,
            createdAt: p.createdAt,
          })) as any);
        }
        if (tenantsRes?.success) {
          setTenants(tenantsRes.data.map((t: any) => ({
            id: t.id,
            firstName: t.firstName,
            lastName: t.lastName,
            email: t.email,
            phone: t.phone,
            paymentStatus: t.paymentStatus,
            balance: t.balance,
            rentAmount: t.rentAmount,
            unitId: t.unitId,
            propertyId: t.propertyId,
          })) as any);
        }
        if (paymentsRes?.success) {
          setPayments(paymentsRes.data.map((p: any) => ({
            id: p.id,
            tenantId: p.tenantId,
            amount: p.amount,
            date: p.paymentDate || p.date,
            status: p.status,
            method: p.paymentMethod || p.method,
            receiptNumber: p.receiptNumber,
            propertyId: p.propertyId,
            unitId: p.unitId,
          })) as any);
        }
        if (maintenanceRes?.success) {
          setMaintenance(maintenanceRes.data.map((m: any) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            status: m.status,
            priority: m.priority,
            tenantId: m.tenantId,
            unitId: m.unitId,
            propertyId: m.propertyId,
            createdAt: m.createdAt,
          })) as any);
        }

        // If API gave us data, try to enrich units from properties endpoint details
        if (propsRes?.success && propsRes.data.length > 0) {
          // Units will be aggregated from property stats if available
          const allUnits: Unit[] = [];
          for (const prop of propsRes.data) {
            if ((prop as any).unitsData) {
              for (const u of (prop as any).unitsData) {
                allUnits.push({
                  id: u.id,
                  propertyId: prop.id,
                  unitNumber: u.unit_number || u.unitNumber || 'Unit',
                  rent: u.rent,
                  status: u.status,
                  createdAt: new Date().toISOString(),
                } as any);
              }
            }
          }
          if (allUnits.length > 0) setUnits(allUnits);
        }

        if (summaryRes?.success) {
          setLoading(false);
          return;
        }
      } catch (apiError) {
        console.warn("API not available, falling back to IndexedDB", apiError);
      }

      // Fallback to IndexedDB
      const [propsData, tenantsData, paymentsData, maintenanceData, unitsData] = await Promise.all([
        getAll<Property>("properties"),
        getAll<Tenant>("tenants"),
        getAll<Payment>("payments"),
        getAll<MaintenanceRequest>("maintenance"),
        getAll<Unit>("units"),
      ]);
      setProperties(propsData);
      setTenants(tenantsData);
      setPayments(paymentsData);
      setMaintenance(maintenanceData);
      setUnits(unitsData);
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  }

  // Calculate metrics - prefer analytics from API, fallback to local calc
  const totalProperties = analytics?.totalProperties ?? properties.length;
  const totalTenants = analytics?.totalTenants ?? tenants.length;
  const totalUnits = analytics?.totalUnits ?? units.length;
  const occupiedUnits = analytics?.occupiedUnits ?? units.filter(u => u.status === "occupied").length;
  const occupancyRate = analytics?.occupancyRate ?? (totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0);
  
  const paidTenants = analytics?.paidTenants ?? tenants.filter(t => t.paymentStatus === "paid").length;
  const owingTenants = analytics?.owingTenants ?? tenants.filter(t => t.paymentStatus === "owing").length;
  const unpaidTenants = analytics?.unpaidTenants ?? tenants.filter(t => t.paymentStatus === "unpaid").length;

  const totalRentExpected = tenants.reduce((sum, t) => sum + (t.rentAmount || 0), 0);
  const totalRentCollected = analytics?.totalRevenue ?? payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);
  const collectionRate = analytics?.collectionRate ?? (totalRentExpected > 0 ? Math.round((totalRentCollected / totalRentExpected) * 100) : 0);

  const pendingMaintenance = analytics?.pendingMaintenance ?? maintenance.filter(m => m.status === "pending").length;
  const inProgressMaintenance = analytics?.inProgressMaintenance ?? maintenance.filter(m => m.status === "in_progress").length;

  const paymentStatusData = [
    { name: "Paid", value: paidTenants, color: "hsl(142 76% 36%)" },
    { name: "Owing", value: owingTenants, color: "hsl(38 92% 50%)" },
    { name: "Unpaid", value: unpaidTenants, color: "hsl(0 84% 60%)" },
  ];

  const revenueByProperty = revenueData?.revenueByProperty || properties.map(prop => {
    const propPayments = payments.filter(p => (p as any).propertyId === prop.id && p.status === "completed");
    const revenue = propPayments.reduce((sum, p) => sum + p.amount, 0);
    return { name: prop.name, revenue: revenue / 1000 };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-[280px] rounded-[24px] bg-muted animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-[160px] rounded-[20px] bg-muted animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero — editorial, cinematic, immersive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="relative overflow-hidden rounded-[28px] bg-foreground text-background"
      >
        {/* Mesh gradient */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full blur-[100px] bg-secondary/30" />
          <div className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[80px] bg-accent/20" />
        </div>

        <div className="relative z-10 p-8 lg:p-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-6 max-w-[640px]">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="mono text-[11px] uppercase tracking-[0.14em] opacity-60">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {user?.role} view
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="font-[Fraunces] text-[40px] lg:text-[56px] font-bold leading-[0.9] tracking-[-0.03em] text-balance">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},
                <br />
                <span className="opacity-60">{user?.firstName || 'there'}</span>
              </h1>
              <p className="text-[16px] leading-[1.5] opacity-70 max-w-[50ch] text-balance">
                {totalProperties} properties • {occupancyRate}% occupied • {formatCurrency(totalRentCollected)} collected this cycle.
                The flow is {occupancyRate > 80 ? 'strong' : occupancyRate > 60 ? 'steady' : 'building'}.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/properties">
                <Button className="rounded-full h-11 px-6 bg-background text-foreground hover:bg-background/90 font-medium">
                  <Building2 className="mr-2 h-4 w-4" /> View portfolio <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/payments">
                <Button variant="outline" className="rounded-full h-11 px-6 border-background/20 text-background hover:bg-background/10 hover:text-background">
                  <Wallet className="mr-2 h-4 w-4" /> Cash flow
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:text-right space-y-4">
            <div className="inline-flex flex-col gap-1 rounded-[16px] bg-background/10 backdrop-blur-xl border border-background/10 p-4">
              <span className="mono text-[10px] uppercase tracking-widest opacity-60">Collection rate</span>
              <span className="font-[Fraunces] text-[36px] font-bold leading-none">{collectionRate}%</span>
              <div className="flex items-center gap-2 mono text-[11px]">
                <span className={`h-2 w-2 rounded-full ${collectionRate > 80 ? 'bg-success' : collectionRate > 50 ? 'bg-warning' : 'bg-destructive'} animate-pulse`} />
                {collectionRate > 80 ? 'Excellent' : collectionRate > 50 ? 'On track' : 'Needs attention'}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats strip */}
        <div className="relative z-10 grid grid-cols-3 divide-x divide-background/10 border-t border-background/10 bg-background/[0.03] backdrop-blur">
          <div className="p-6">
            <p className="mono text-[10px] uppercase tracking-widest opacity-50 mb-1">Properties</p>
            <p className="font-[Fraunces] text-[24px] font-bold leading-none">{totalProperties}</p>
            <p className="mono text-[11px] opacity-60 mt-1">{totalUnits} units total</p>
          </div>
          <div className="p-6">
            <p className="mono text-[10px] uppercase tracking-widest opacity-50 mb-1">Occupancy</p>
            <p className="font-[Fraunces] text-[24px] font-bold leading-none">{occupancyRate}%</p>
            <p className="mono text-[11px] opacity-60 mt-1">{occupiedUnits}/{totalUnits} occupied</p>
          </div>
          <div className="p-6">
            <p className="mono text-[10px] uppercase tracking-widest opacity-50 mb-1">Maintenance</p>
            <p className="font-[Fraunces] text-[24px] font-bold leading-none">{pendingMaintenance + inProgressMaintenance}</p>
            <p className="mono text-[11px] opacity-60 mt-1">{pendingMaintenance} pending</p>
          </div>
        </div>
      </motion.div>

      {/* Metrics — bento, tactile */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Properties" value={totalProperties} description={`${totalUnits} units • ${occupiedUnits} occupied`} icon={Building2} variant="ink" index={0} trend={{ value: 12, isPositive: true, label: "vs last month" }} />
        <MetricCard title="Occupancy Rate" value={`${occupancyRate}%`} description={`${occupiedUnits}/${totalUnits} occupied`} icon={TrendingUp} variant="lime" index={1} trend={{ value: 5, isPositive: true }} />
        <MetricCard title="Rent Collected" value={formatCurrency(totalRentCollected)} description={`${collectionRate}% collection • ${paidTenants} paid`} icon={DollarSign} variant="default" index={2} trend={{ value: 8, isPositive: true }} />
        <MetricCard title="Active Tenants" value={totalTenants} description={`${paidTenants} paid, ${owingTenants} owing, ${unpaidTenants} unpaid`} icon={Users} variant="default" index={3} />
      </div>

      {/* Charts — editorial */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 rounded-[20px] border-border/50 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="font-[Fraunces] text-[22px] font-bold tracking-tight">Revenue by property</CardTitle>
                <CardDescription className="mono text-[12px] mt-1">Monthly collection • In thousands (NGN)</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreHorizontal className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={revenueByProperty}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontFamily: "Fragment Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontFamily: "Fragment Mono" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontFamily: "Instrument Sans", fontSize: "13px" }} formatter={(value: number) => [`₦${value}K`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(var(--foreground))" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-[20px] border-border/50 overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="font-[Fraunces] text-[22px] font-bold tracking-tight">Payment status</CardTitle>
            <CardDescription className="mono text-[12px] mt-1">Tenant distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={paymentStatusData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value" stroke="none">
                  {paymentStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {paymentStatusData.map((d) => (
                <div key={d.name} className="rounded-xl bg-muted/60 p-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="mono text-[11px] uppercase tracking-widest opacity-60">{d.name}</span>
                  </div>
                  <p className="font-[Fraunces] text-[20px] font-bold leading-none">{d.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Activity — tactile lists */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[20px] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-[Fraunces] text-[20px] font-bold flex items-center gap-2"><Wrench className="h-5 w-5" /> Maintenance</CardTitle>
              <CardDescription className="mono text-[11px] mt-1">{maintenance.length} total • {pendingMaintenance} pending</CardDescription>
            </div>
            <Link to="/maintenance"><Button variant="ghost" size="sm" className="rounded-full">View all <ArrowUpRight className="ml-1 h-3 w-3" /></Button></Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {maintenance.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 mb-3"><CheckCircle className="h-6 w-6 text-success" /></div>
                <p className="font-medium">All clear</p><p className="mono text-xs opacity-60 mt-1">No maintenance requests</p>
              </div>
            ) : (
              maintenance.slice(0, 4).map((req) => {
                const tenant = tenants.find(t => t.id === (req as any).tenantId);
                return (
                  <div key={req.id} className="group flex items-start gap-3 rounded-[14px] border border-border/50 p-4 hover:border-foreground/10 hover:shadow-sm transition-all">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${req.priority === "high" ? "bg-destructive/10 text-destructive" : req.priority === "medium" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium leading-tight truncate">{req.title}</p>
                      <p className="mono text-[11px] opacity-60 mt-1 truncate">{tenant?.firstName} {tenant?.lastName} • {req.description?.slice(0, 60)}</p>
                    </div>
                    <Badge variant="outline" className="rounded-full mono text-[10px] uppercase tracking-widest shrink-0">{req.status?.replace("_", " ")}</Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[20px] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-[Fraunces] text-[20px] font-bold flex items-center gap-2"><DollarSign className="h-5 w-5" /> Recent payments</CardTitle>
              <CardDescription className="mono text-[11px] mt-1">{payments.length} transactions • {formatCurrency(totalRentCollected)} collected</CardDescription>
            </div>
            <Link to="/payments"><Button variant="ghost" size="sm" className="rounded-full">View all <ArrowUpRight className="ml-1 h-3 w-3" /></Button></Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {payments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3"><Wallet className="h-6 w-6 opacity-60" /></div>
                <p className="font-medium">No payments yet</p><p className="mono text-xs opacity-60 mt-1">Transactions will appear here</p>
              </div>
            ) : (
              payments.slice(0, 4).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((payment) => {
                const tenant = tenants.find(t => t.id === payment.tenantId);
                return (
                  <div key={payment.id} className="group flex items-center gap-3 rounded-[14px] border border-border/50 p-4 hover:border-foreground/10 hover:shadow-sm transition-all">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${payment.status === "completed" ? "bg-success/10 text-success" : payment.status === "pending" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium leading-tight truncate">{tenant?.firstName} {tenant?.lastName} • {formatCurrency(payment.amount)}</p>
                      <p className="mono text-[11px] opacity-60 mt-1 flex items-center gap-2"><Calendar className="h-3 w-3" />{new Date(payment.date).toLocaleDateString()} • {payment.receiptNumber || payment.id.slice(0, 8)}</p>
                    </div>
                    <Badge className={`rounded-full mono text-[10px] uppercase tracking-widest shrink-0 ${payment.status === "completed" ? "bg-success text-success-foreground" : payment.status === "pending" ? "bg-warning text-warning-foreground" : "bg-destructive text-destructive-foreground"}`}>{payment.status}</Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions — editorial */}
      <div className="rounded-[20px] border border-border/50 bg-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground"><Home className="h-5 w-5" /></div>
          <div>
            <p className="font-medium">Quick actions</p>
            <p className="mono text-[11px] opacity-60">Everything you need, one tap away</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/properties"><Button variant="outline" className="rounded-full"><Building2 className="mr-2 h-4 w-4" /> Add property</Button></Link>
          <Link to="/tenants"><Button variant="outline" className="rounded-full"><Users className="mr-2 h-4 w-4" /> Add tenant</Button></Link>
          <Link to="/payments"><Button className="rounded-full bg-foreground text-background hover:bg-foreground/90"><DollarSign className="mr-2 h-4 w-4" /> Record payment</Button></Link>
        </div>
      </div>
    </div>
  );
}
