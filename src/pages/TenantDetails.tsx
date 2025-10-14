import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Calendar, DollarSign, FileText, Home } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getById, getByIndex, Tenant, Unit, Property, Payment } from "@/lib/db";

export default function TenantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (id) loadTenantDetails(id);
  }, [id]);

  async function loadTenantDetails(tenantId: string) {
    const tenantData = await getById<Tenant>("tenants", tenantId);
    if (!tenantData) return;
    setTenant(tenantData);

    const unitData = await getById<Unit>("units", tenantData.unitId);
    setUnit(unitData || null);

    const propertyData = await getById<Property>("properties", tenantData.propertyId);
    setProperty(propertyData || null);

    const paymentsData = await getByIndex<Payment>("payments", "tenantId", tenantId);
    setPayments(paymentsData);
  }

  if (!tenant) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Tenant not found</p>
        </div>
      </Layout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const totalPaid = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const leaseStartDate = new Date(tenant.leaseStart);
  const leaseEndDate = new Date(tenant.leaseEnd);
  const today = new Date();
  const daysRemaining = Math.ceil((leaseEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/tenants")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {tenant.firstName} {tenant.lastName}
            </h1>
            <p className="text-muted-foreground">Tenant Profile</p>
          </div>
          <Button className="bg-gradient-secondary">
            <DollarSign className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                    {getInitials(tenant.firstName, tenant.lastName)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4 text-center">
                  {tenant.firstName} {tenant.lastName}
                </CardTitle>
                <Badge
                  variant={
                    tenant.paymentStatus === "paid" ? "default" :
                    tenant.paymentStatus === "owing" ? "secondary" : "destructive"
                  }
                  className={`mt-2 ${
                    tenant.paymentStatus === "paid" ? "bg-success text-success-foreground" :
                    tenant.paymentStatus === "owing" ? "bg-warning text-warning-foreground" : ""
                  }`}
                >
                  {tenant.paymentStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{tenant.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{tenant.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {property?.name} - Unit {unit?.unitNumber}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Rent</span>
                  <span className="font-medium">{formatCurrency(tenant.rentAmount)}</span>
                </div>
                {tenant.balance > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Balance Due</span>
                    <span className="font-medium text-destructive">
                      {formatCurrency(tenant.balance)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="font-medium text-success">
                    {formatCurrency(totalPaid)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Lease Information */}
            <Card>
              <CardHeader>
                <CardTitle>Lease Information</CardTitle>
                <CardDescription>Current lease details and timeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Lease Start</span>
                    </div>
                    <p className="text-lg font-medium">
                      {leaseStartDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Lease End</span>
                    </div>
                    <p className="text-lg font-medium">
                      {leaseEndDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Days Remaining</span>
                  <Badge variant={daysRemaining < 30 ? "destructive" : "default"}>
                    {daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Frequency</span>
                  <span className="text-sm font-medium capitalize">{tenant.rentFrequency}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Recent payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No payments recorded</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium capitalize">{payment.method.replace("_", " ")}</p>
                              <Badge
                                variant={
                                  payment.status === "completed" ? "default" :
                                  payment.status === "pending" ? "secondary" : "destructive"
                                }
                                className={
                                  payment.status === "completed" ? "bg-success text-success-foreground" : ""
                                }
                              >
                                {payment.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(payment.date).toLocaleDateString()} • Receipt #{payment.receiptNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
