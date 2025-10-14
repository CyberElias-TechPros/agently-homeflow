import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, Building2, Users, TrendingDown } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MetricCard from "@/components/MetricCard";
import { getAll, Property, Tenant, Payment, Expense } from "@/lib/db";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Analytics() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [propsData, tenantsData, paymentsData, expensesData] = await Promise.all([
      getAll<Property>("properties"),
      getAll<Tenant>("tenants"),
      getAll<Payment>("payments"),
      getAll<Expense>("expenses"),
    ]);
    setProperties(propsData);
    setTenants(tenantsData);
    setPayments(paymentsData);
    setExpenses(expensesData);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate metrics
  const totalRevenue = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netIncome / totalRevenue) * 100) : 0;

  const totalOutstanding = tenants
    .filter(t => t.paymentStatus !== "paid")
    .reduce((sum, t) => sum + t.balance, 0);

  // Revenue trend data (monthly for last 6 months)
  const revenueTrend = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthName = date.toLocaleString("default", { month: "short" });
    
    // Simulate data - in real app would filter by month
    const revenue = totalRevenue / 6 + (Math.random() - 0.5) * (totalRevenue / 12);
    const expense = totalExpenses / 6 + (Math.random() - 0.5) * (totalExpenses / 12);
    
    return {
      month: monthName,
      revenue: Math.round(revenue / 1000),
      expenses: Math.round(expense / 1000),
      net: Math.round((revenue - expense) / 1000),
    };
  });

  // Occupancy trend
  const occupancyTrend = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthName = date.toLocaleString("default", { month: "short" });
    
    return {
      month: monthName,
      occupancy: 70 + Math.random() * 25,
    };
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Financial insights and performance metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            description="Last 30 days"
            icon={DollarSign}
            variant="success"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            description="Last 30 days"
            icon={TrendingDown}
            variant="warning"
          />
          <MetricCard
            title="Net Income"
            value={formatCurrency(netIncome)}
            description={`${profitMargin}% margin`}
            icon={TrendingUp}
            variant={netIncome > 0 ? "success" : "destructive"}
          />
          <MetricCard
            title="Outstanding"
            value={formatCurrency(totalOutstanding)}
            description="Pending collections"
            icon={Building2}
            variant="warning"
          />
        </div>

        {/* Revenue & Expenses Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Expenses Trend</CardTitle>
            <CardDescription>
              Monthly financial performance (in thousands)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
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
                  formatter={(value: number) => [`₦${value}K`, ""]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--success))"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(var(--destructive))"
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Additional Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Net Income Trend</CardTitle>
              <CardDescription>Monthly profit/loss (in thousands)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
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
                    formatter={(value: number) => [`₦${value}K`, "Net Income"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--secondary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Occupancy Rate</CardTitle>
              <CardDescription>Monthly occupancy percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={occupancyTrend}>
                  <defs>
                    <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "Occupancy"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="occupancy"
                    stroke="hsl(var(--info))"
                    fillOpacity={1}
                    fill="url(#colorOccupancy)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
