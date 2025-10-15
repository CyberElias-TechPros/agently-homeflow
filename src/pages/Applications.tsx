import { useEffect, useState } from "react";
import { Check, X, UserCheck } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAll, Application, Property, Unit, getById, update } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [properties, setProperties] = useState<Map<string, Property>>(new Map());
  const [units, setUnits] = useState<Map<string, Unit>>(new Map());
  const [activeTab, setActiveTab] = useState("pending");
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    const apps = await getAll<Application>("applications");
    setApplications(apps);

    const propsMap = new Map<string, Property>();
    const unitsMap = new Map<string, Unit>();

    for (const app of apps) {
      const property = await getById<Property>("properties", app.propertyId);
      const unit = await getById<Unit>("units", app.unitId);
      if (property) propsMap.set(property.id, property);
      if (unit) unitsMap.set(unit.id, unit);
    }

    setProperties(propsMap);
    setUnits(unitsMap);
  }

  async function handleStatusUpdate(app: Application, newStatus: Application["status"]) {
    try {
      const updated: Application = {
        ...app,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      await update<Application>("applications", updated);
      
      toast({
        title: "Application updated",
        description: `Application has been ${newStatus}`,
      });
      
      loadApplications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    }
  }

  const filteredApps = activeTab === "all" 
    ? applications 
    : applications.filter(a => a.status === activeTab);

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Applications</h1>
          <p className="text-muted-foreground">Review and process tenant applications</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({applications.filter(a => a.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="screening">
              Screening ({applications.filter(a => a.status === "screening").length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({applications.filter(a => a.status === "approved").length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({applications.filter(a => a.status === "rejected").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-4">
              {filteredApps.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No applications found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredApps.map((app) => {
                  const property = properties.get(app.propertyId);
                  const unit = units.get(app.unitId);

                  return (
                    <Card key={app.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">
                              {app.firstName} {app.lastName}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {property?.name} - Unit {unit?.unitNumber}
                            </p>
                          </div>
                          <Badge
                            variant={
                              app.status === "approved"
                                ? "default"
                                : app.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                            className={
                              app.status === "approved"
                                ? "bg-success text-success-foreground"
                                : ""
                            }
                          >
                            {app.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">{app.email}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Phone</p>
                            <p className="font-medium">{app.phone}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Employment</p>
                            <p className="font-medium">{app.employmentStatus}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Monthly Income</p>
                            <p className="font-medium">{formatCurrency(app.monthlyIncome)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Move-in Date</p>
                            <p className="font-medium">
                              {new Date(app.moveInDate).toLocaleDateString()}
                            </p>
                          </div>
                          {app.score && (
                            <div>
                              <p className="text-muted-foreground">Score</p>
                              <p className="font-medium">{app.score}/100</p>
                            </div>
                          )}
                        </div>

                        {app.references && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">References</p>
                            <p className="text-sm">{app.references}</p>
                          </div>
                        )}

                        {app.status === "pending" && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(app, "screening")}
                              className="flex-1"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Start Screening
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(app, "approved")}
                              className="flex-1 bg-success hover:bg-success/90"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(app, "rejected")}
                              className="flex-1"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {app.status === "screening" && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(app, "approved")}
                              className="flex-1 bg-success hover:bg-success/90"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(app, "rejected")}
                              className="flex-1"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
