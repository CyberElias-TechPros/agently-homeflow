import { useEffect, useState } from "react";
import { DollarSign, Download, Calendar, CreditCard, Search } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAll, Payment, Tenant, Property, Unit, getById } from "@/lib/db";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tenants, setTenants] = useState<Map<string, Tenant>>(new Map());
  const [properties, setProperties] = useState<Map<string, Property>>(new Map());
  const [units, setUnits] = useState<Map<string, Unit>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
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
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredPayments = payments
    .filter((payment) => {
      const tenant = tenants.get(payment.tenantId);
      const property = properties.get(payment.propertyId);
      const unit = units.get(payment.unitId);
      
      const matchesSearch = searchQuery === "" || 
        tenant?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
      const matchesMethod = methodFilter === "all" || payment.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalCompleted = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const completedCount = payments.filter(p => p.status === "completed").length;
  const pendingCount = payments.filter(p => p.status === "pending").length;
  const failedCount = payments.filter(p => p.status === "failed").length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
            <p className="text-muted-foreground">
              View and manage all rent payments
            </p>
          </div>
          <Button className="bg-gradient-secondary">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalCompleted)}</div>
              <p className="text-xs text-muted-foreground">{completedCount} transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <DollarSign className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPending)}</div>
              <p className="text-xs text-muted-foreground">{pendingCount} transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <DollarSign className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{failedCount}</div>
              <p className="text-xs text-muted-foreground">Transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payments.length}</div>
              <p className="text-xs text-muted-foreground">Total payments</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Search and filter payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tenant, property, or receipt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment List */}
            <div className="space-y-3">
              {filteredPayments.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No payments found</p>
                </div>
              ) : (
                filteredPayments.map((payment) => {
                  const tenant = tenants.get(payment.tenantId);
                  const property = properties.get(payment.propertyId);
                  const unit = units.get(payment.unitId);

                  return (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                          payment.status === "completed" ? "bg-success/10" :
                          payment.status === "pending" ? "bg-warning/10" : "bg-destructive/10"
                        }`}>
                          <CreditCard className={`h-5 w-5 ${
                            payment.status === "completed" ? "text-success" :
                            payment.status === "pending" ? "text-warning" : "text-destructive"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {tenant?.firstName} {tenant?.lastName}
                            </p>
                            <Badge
                              variant={
                                payment.status === "completed" ? "default" :
                                payment.status === "pending" ? "secondary" : "destructive"
                              }
                              className={
                                payment.status === "completed" ? "bg-success text-success-foreground" :
                                payment.status === "pending" ? "bg-warning text-warning-foreground" : ""
                              }
                            >
                              {payment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {property?.name} - Unit {unit?.unitNumber}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-muted-foreground capitalize">
                              {payment.method.replace("_", " ")}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(payment.date).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              Receipt #{payment.receiptNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(payment.amount)}</p>
                        <Button variant="ghost" size="sm" className="mt-1">
                          <Download className="h-4 w-4 mr-1" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
