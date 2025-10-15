import { useEffect, useState } from "react";
import { Wrench, Clock, CheckCircle2, DollarSign } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAll, MaintenanceRequest, Property, Unit, getById, update } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Jobs() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [properties, setProperties] = useState<Map<string, Property>>(new Map());
  const [units, setUnits] = useState<Map<string, Unit>>(new Map());
  const [activeTab, setActiveTab] = useState("pending");
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    const allRequests = await getAll<MaintenanceRequest>("maintenance");
    const myJobs = allRequests.filter(r => r.assignedTo === user?.id);
    setRequests(myJobs);

    const propsMap = new Map<string, Property>();
    const unitsMap = new Map<string, Unit>();

    for (const req of myJobs) {
      const property = await getById<Property>("properties", req.propertyId);
      const unit = await getById<Unit>("units", req.unitId);
      if (property) propsMap.set(property.id, property);
      if (unit) unitsMap.set(unit.id, unit);
    }

    setProperties(propsMap);
    setUnits(unitsMap);
  }

  async function handleStatusUpdate(request: MaintenanceRequest, newStatus: MaintenanceRequest["status"]) {
    try {
      const updated: MaintenanceRequest = {
        ...request,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      await update<MaintenanceRequest>("maintenance", updated);
      
      toast({
        title: "Job updated",
        description: `Job status changed to ${newStatus}`,
      });
      
      loadJobs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job",
        variant: "destructive",
      });
    }
  }

  const filteredRequests = activeTab === "all" 
    ? requests 
    : requests.filter(r => r.status === activeTab);

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-blue-500",
      medium: "bg-yellow-500",
      high: "bg-destructive",
    };
    return colors[priority as keyof typeof colors];
  };

  const pendingJobs = requests.filter(r => r.status === "pending").length;
  const inProgressJobs = requests.filter(r => r.status === "in_progress").length;
  const completedJobs = requests.filter(r => r.status === "completed").length;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Jobs</h1>
          <p className="text-muted-foreground">Manage your maintenance jobs</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedJobs}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingJobs})</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress ({inProgressJobs})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedJobs})</TabsTrigger>
            <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-4">
              {filteredRequests.map((request) => {
                const property = properties.get(request.propertyId);
                const unit = units.get(request.unitId);

                return (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{request.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {property?.name} - Unit {unit?.unitNumber}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                          <Badge variant="outline">{request.status.replace("_", " ")}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Description:</p>
                        <p className="text-sm text-muted-foreground">{request.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Created: {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          Updated: {new Date(request.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        {request.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(request, "in_progress")}
                            className="bg-gradient-secondary"
                          >
                            Accept Job
                          </Button>
                        )}
                        {request.status === "in_progress" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(request, "completed")}
                              className="bg-success hover:bg-success/90"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Mark Complete
                            </Button>
                            <Button size="sm" variant="outline">
                              <DollarSign className="mr-2 h-4 w-4" />
                              Submit Invoice
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredRequests.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No jobs found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
