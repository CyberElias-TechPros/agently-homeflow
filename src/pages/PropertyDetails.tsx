import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Building2, ArrowLeft, Plus, MapPin, Calendar, DollarSign } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getById, getByIndex, Property, Unit, Tenant, Expense } from "@/lib/db";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [tenants, setTenants] = useState<Map<string, Tenant>>(new Map());
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (id) loadPropertyDetails(id);
  }, [id]);

  async function loadPropertyDetails(propertyId: string) {
    const propData = await getById<Property>("properties", propertyId);
    setProperty(propData || null);

    const unitsData = await getByIndex<Unit>("units", "propertyId", propertyId);
    setUnits(unitsData);

    const tenantsMap = new Map<string, Tenant>();
    for (const unit of unitsData) {
      if (unit.tenantId) {
        const tenant = await getById<Tenant>("tenants", unit.tenantId);
        if (tenant) tenantsMap.set(tenant.id, tenant);
      }
    }
    setTenants(tenantsMap);

    const expensesData = await getByIndex<Expense>("expenses", "propertyId", propertyId);
    setExpenses(expensesData);
  }

  if (!property) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Property not found</p>
        </div>
      </Layout>
    );
  }

  const occupiedUnits = units.filter(u => u.status === "occupied").length;
  const vacantUnits = units.filter(u => u.status === "vacant").length;
  const maintenanceUnits = units.filter(u => u.status === "maintenance").length;
  const totalRent = units.reduce((sum, u) => sum + u.rent, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/properties")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{property.address}</span>
            </div>
          </div>
          <Button className="bg-gradient-secondary">
            <Plus className="mr-2 h-4 w-4" />
            Add Unit
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{units.length}</div>
              <p className="text-xs text-muted-foreground capitalize">{property.type}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupied</CardTitle>
              <div className="h-2 w-2 rounded-full bg-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupiedUnits}</div>
              <p className="text-xs text-muted-foreground">
                {units.length > 0 ? Math.round((occupiedUnits / units.length) * 100) : 0}% occupancy
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Rent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRent)}</div>
              <p className="text-xs text-muted-foreground">Total potential</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">Year to date</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Units and Expenses */}
        <Tabs defaultValue="units">
          <TabsList>
            <TabsTrigger value="units">Units ({units.length})</TabsTrigger>
            <TabsTrigger value="expenses">Expenses ({expenses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="units" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {units.map((unit) => {
                const tenant = unit.tenantId ? tenants.get(unit.tenantId) : null;
                return (
                  <Card key={unit.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">Unit {unit.unitNumber}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {unit.bedrooms && `${unit.bedrooms} BR`}
                            {unit.bathrooms && ` • ${unit.bathrooms} BA`}
                          </p>
                        </div>
                        <Badge
                          variant={
                            unit.status === "occupied" ? "default" :
                            unit.status === "vacant" ? "secondary" : "destructive"
                          }
                          className={
                            unit.status === "occupied" ? "bg-success text-success-foreground" :
                            unit.status === "vacant" ? "bg-warning text-warning-foreground" : ""
                          }
                        >
                          {unit.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Rent</span>
                        <span className="text-sm font-medium">{formatCurrency(unit.rent)}</span>
                      </div>
                      {tenant && (
                        <div className="pt-3 border-t">
                          <p className="text-sm font-medium">{tenant.firstName} {tenant.lastName}</p>
                          <p className="text-xs text-muted-foreground">{tenant.email}</p>
                        </div>
                      )}
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {expenses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No expenses recorded</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">{expense.category}</p>
                          <p className="text-xs text-muted-foreground">{expense.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(expense.amount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
