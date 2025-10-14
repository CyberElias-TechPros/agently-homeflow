import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Building2, Home, Briefcase, Store } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddPropertyDialog from "@/components/AddPropertyDialog";
import { getAll, Property, Unit, getByIndex } from "@/lib/db";

export default function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [unitsMap, setUnitsMap] = useState<Map<string, Unit[]>>(new Map());

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    const propsData = await getAll<Property>("properties");
    setProperties(propsData);

    // Load units for each property
    const unitsData = new Map<string, Unit[]>();
    for (const prop of propsData) {
      const propUnits = await getByIndex<Unit>("units", "propertyId", prop.id);
      unitsData.set(prop.id, propUnits);
    }
    setUnitsMap(unitsData);
  }

  const getPropertyIcon = (type: Property["type"]) => {
    switch (type) {
      case "apartment":
        return Building2;
      case "house":
        return Home;
      case "office":
        return Briefcase;
      case "commercial":
        return Store;
    }
  };

  const getStatusColor = (status: Unit["status"]) => {
    switch (status) {
      case "occupied":
        return "success";
      case "vacant":
        return "warning";
      case "maintenance":
        return "destructive";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
            <p className="text-muted-foreground">
              Manage your property portfolio
            </p>
          </div>
          <AddPropertyDialog onSuccess={loadProperties} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => {
            const Icon = getPropertyIcon(property.type);
            const units = unitsMap.get(property.id) || [];
            const occupiedCount = units.filter(u => u.status === "occupied").length;
            const vacantCount = units.filter(u => u.status === "vacant").length;
            const maintenanceCount = units.filter(u => u.status === "maintenance").length;

            return (
              <Card key={property.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{property.name}</CardTitle>
                        <p className="text-xs text-muted-foreground capitalize mt-1">
                          {property.type}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{property.address}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Units</span>
                      <span className="font-medium">{units.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {occupiedCount > 0 && (
                        <Badge variant="default" className="bg-success text-success-foreground">
                          {occupiedCount} Occupied
                        </Badge>
                      )}
                      {vacantCount > 0 && (
                        <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">
                          {vacantCount} Vacant
                        </Badge>
                      )}
                      {maintenanceCount > 0 && (
                        <Badge variant="destructive">
                          {maintenanceCount} Maintenance
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Units</h4>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {units.map((unit) => (
                        <div
                          key={unit.id}
                          className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{unit.unitNumber}</span>
                            {unit.bedrooms && (
                              <span className="text-xs text-muted-foreground">
                                {unit.bedrooms}BR
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              ₦{unit.rent.toLocaleString()}
                            </span>
                            <div
                              className={`h-2 w-2 rounded-full ${
                                unit.status === "occupied"
                                  ? "bg-success"
                                  : unit.status === "vacant"
                                  ? "bg-warning"
                                  : "bg-destructive"
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/properties/${property.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
