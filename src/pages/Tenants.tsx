import { useEffect, useState } from "react";
import { Users, Mail, Phone, Calendar, DollarSign } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAll, Tenant, Unit, Property, getById } from "@/lib/db";

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [units, setUnits] = useState<Map<string, Unit>>(new Map());
  const [properties, setProperties] = useState<Map<string, Property>>(new Map());
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadTenants();
  }, []);

  async function loadTenants() {
    const tenantsData = await getAll<Tenant>("tenants");
    setTenants(tenantsData);

    // Load related data
    const unitsMap = new Map<string, Unit>();
    const propsMap = new Map<string, Property>();

    for (const tenant of tenantsData) {
      const unit = await getById<Unit>("units", tenant.unitId);
      if (unit) unitsMap.set(unit.id, unit);

      const property = await getById<Property>("properties", tenant.propertyId);
      if (property) propsMap.set(property.id, property);
    }

    setUnits(unitsMap);
    setProperties(propsMap);
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

  const filteredTenants =
    activeTab === "all"
      ? tenants
      : tenants.filter((t) => t.paymentStatus === activeTab);

  const paidCount = tenants.filter((t) => t.paymentStatus === "paid").length;
  const owingCount = tenants.filter((t) => t.paymentStatus === "owing").length;
  const unpaidCount = tenants.filter((t) => t.paymentStatus === "unpaid").length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
            <p className="text-muted-foreground">
              Manage tenant information and payment status
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">
              All ({tenants.length})
            </TabsTrigger>
            <TabsTrigger value="paid">
              Paid ({paidCount})
            </TabsTrigger>
            <TabsTrigger value="owing">
              Owing ({owingCount})
            </TabsTrigger>
            <TabsTrigger value="unpaid">
              Unpaid ({unpaidCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTenants.map((tenant) => {
                const unit = units.get(tenant.unitId);
                const property = properties.get(tenant.propertyId);

                return (
                  <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            {getInitials(tenant.firstName, tenant.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {tenant.firstName} {tenant.lastName}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {property?.name} - Unit {unit?.unitNumber}
                          </p>
                        </div>
                        <Badge
                          variant={
                            tenant.paymentStatus === "paid"
                              ? "default"
                              : tenant.paymentStatus === "owing"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            tenant.paymentStatus === "paid"
                              ? "bg-success text-success-foreground"
                              : tenant.paymentStatus === "owing"
                              ? "bg-warning text-warning-foreground"
                              : ""
                          }
                        >
                          {tenant.paymentStatus}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{tenant.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{tenant.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Lease: {new Date(tenant.leaseStart).toLocaleDateString()} -{" "}
                            {new Date(tenant.leaseEnd).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Monthly Rent</span>
                          <span className="text-sm font-medium">
                            {formatCurrency(tenant.rentAmount)}
                          </span>
                        </div>
                        {tenant.balance > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Balance</span>
                            <span className="text-sm font-medium text-destructive">
                              {formatCurrency(tenant.balance)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-muted hover:bg-muted/80 transition-colors">
                          View Details
                        </button>
                        <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gradient-secondary text-secondary-foreground hover:opacity-90 transition-opacity">
                          Record Payment
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
