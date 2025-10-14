import { useEffect, useState } from "react";
import { Building2, Users, DollarSign, AlertCircle, TrendingUp, CheckCircle } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAll, Property, Tenant, Payment, MaintenanceRequest, Unit } from "@/lib/db";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
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
  }

  // Calculate metrics
  const totalProperties = properties.length;
  const totalTenants = tenants.length;
  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === "occupied").length;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  
  const paidTenants = tenants.filter(t => t.paymentStatus === "paid").length;
  const owingTenants = tenants.filter(t => t.paymentStatus === "owing").length;
  const unpaidTenants = tenants.filter(t => t.paymentStatus === "unpaid").length;

  const totalRentExpected = tenants.reduce((sum, t) => sum + t.rentAmount, 0);
  const totalRentCollected = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const collectionRate = totalRentExpected > 0 ? Math.round((totalRentCollected / totalRentExpected) * 100) : 0;

  const pendingMaintenance = maintenance.filter(m => m.status === "pending").length;
  const inProgressMaintenance = maintenance.filter(m => m.status === "in_progress").length;

  // Chart data
  const paymentStatusData = [
    { name: "Paid", value: paidTenants, color: "hsl(var(--success))" },
    { name: "Owing", value: owingTenants, color: "hsl(var(--warning))" },
    { name: "Unpaid", value: unpaidTenants, color: "hsl(var(--destructive))" },
  ];

  const revenueByProperty = properties.map(prop => {
    const propPayments = payments.filter(p => p.propertyId === prop.id && p.status === "completed");
    const revenue = propPayments.reduce((sum, p) => sum + p.amount, 0);
    return {
      name: prop.name,
      revenue: revenue / 1000, // Convert to thousands
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-hero p-6 text-primary-foreground shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="mt-2 text-sm opacity-90">
            Here's an overview of your property portfolio
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
          <Building2 className="h-full w-full" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Properties"
          value={totalProperties}
          description={`${totalUnits} units total`}
          icon={Building2}
          variant="default"
        />
        <MetricCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          description={`${occupiedUnits}/${totalUnits} occupied`}
          icon={TrendingUp}
          variant="success"
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Rent Collected"
          value={formatCurrency(totalRentCollected)}
          description={`${collectionRate}% collection rate`}
          icon={DollarSign}
          variant="success"
        />
        <MetricCard
          title="Active Tenants"
          value={totalTenants}
          description={`${paidTenants} paid, ${owingTenants} owing`}
          icon={Users}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Property</CardTitle>
            <CardDescription>Monthly rent collection (in thousands)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByProperty}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: number) => [`₦${value}K`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Tenant payment distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Alerts</CardTitle>
            <CardDescription>Active maintenance requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {maintenance.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No maintenance requests</p>
              </div>
            ) : (
              maintenance.slice(0, 5).map((req) => {
                const tenant = tenants.find(t => t.id === req.tenantId);
                return (
                  <div key={req.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <AlertCircle className={`h-5 w-5 mt-0.5 ${
                      req.priority === "high" ? "text-destructive" : 
                      req.priority === "medium" ? "text-warning" : "text-info"
                    }`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{req.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {tenant?.firstName} {tenant?.lastName} - Unit {units.find(u => u.id === req.unitId)?.unitNumber}
                      </p>
                    </div>
                    <Badge variant={
                      req.status === "completed" ? "default" :
                      req.status === "in_progress" ? "secondary" : "outline"
                    }>
                      {req.status}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest rent payments received</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {payments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No payments yet</p>
              </div>
            ) : (
              payments
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((payment) => {
                  const tenant = tenants.find(t => t.id === payment.tenantId);
                  return (
                    <div key={payment.id} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                        <DollarSign className="h-5 w-5 text-success" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {tenant?.firstName} {tenant?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                        <Badge variant="default" className="mt-1">
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
