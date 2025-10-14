import { useEffect, useState } from "react";
import { Wrench, AlertCircle, Clock, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAll, MaintenanceRequest, Tenant, Unit, Property, getById } from "@/lib/db";

export default function Maintenance() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [tenants, setTenants] = useState<Map<string, Tenant>>(new Map());
  const [units, setUnits] = useState<Map<string, Unit>>(new Map());
  const [properties, setProperties] = useState<Map<string, Property>>(new Map());
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadMaintenanceRequests();
  }, []);

  async function loadMaintenanceRequests() {
    const requestsData = await getAll<MaintenanceRequest>("maintenance");
    setRequests(requestsData);

    // Load related data
    const tenantsMap = new Map<string, Tenant>();
    const unitsMap = new Map<string, Unit>();
    const propsMap = new Map<string, Property>();

    for (const request of requestsData) {
      const tenant = await getById<Tenant>("tenants", request.tenantId);
      if (tenant) tenantsMap.set(tenant.id, tenant);

      const unit = await getById<Unit>("units", request.unitId);
      if (unit) unitsMap.set(unit.id, unit);

      const property = await getById<Property>("properties", request.propertyId);
      if (property) propsMap.set(property.id, property);
    }

    setTenants(tenantsMap);
    setUnits(unitsMap);
    setProperties(propsMap);
  }

  const filteredRequests =
    activeTab === "all"
      ? requests
      : requests.filter((r) => r.status === activeTab);

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;

  const getStatusIcon = (status: MaintenanceRequest["status"]) => {
    switch (status) {
      case "pending":
        return AlertCircle;
      case "in_progress":
        return Clock;
      case "completed":
        return CheckCircle;
    }
  };

  const getPriorityColor = (priority: MaintenanceRequest["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
            <p className="text-muted-foreground">
              Track and manage maintenance requests
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="all">
              All ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              In Progress ({inProgressCount})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredRequests.map((request) => {
                const tenant = tenants.get(request.tenantId);
                const unit = units.get(request.unitId);
                const property = properties.get(request.propertyId);
                const StatusIcon = getStatusIcon(request.status);

                return (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              request.status === "completed"
                                ? "bg-success/10 text-success"
                                : request.status === "in_progress"
                                ? "bg-info/10 text-info"
                                : "bg-warning/10 text-warning"
                            }`}
                          >
                            <StatusIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{request.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {property?.name} - Unit {unit?.unitNumber}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            request.priority === "high" ? "destructive" : 
                            request.priority === "medium" ? "secondary" : "outline"
                          }
                          className={
                            request.priority === "high" ? "" :
                            request.priority === "medium" ? "bg-warning text-warning-foreground" : ""
                          }
                        >
                          {request.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {request.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Reported by:</span>
                        <span className="font-medium">
                          {tenant?.firstName} {tenant?.lastName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            request.status === "completed"
                              ? "border-success text-success"
                              : request.status === "in_progress"
                              ? "border-info text-info"
                              : "border-warning text-warning"
                          }
                        >
                          {request.status.replace("_", " ")}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-muted hover:bg-muted/80 transition-colors">
                          View Details
                        </button>
                        {request.status !== "completed" && (
                          <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gradient-secondary text-secondary-foreground hover:opacity-90 transition-opacity">
                            Update Status
                          </button>
                        )}
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
