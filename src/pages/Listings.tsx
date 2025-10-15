import { useEffect, useState } from "react";
import { Plus, Eye, Users, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAll, Listing, Property, Unit, getById } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";

export default function Listings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [properties, setProperties] = useState<Map<string, Property>>(new Map());
  const [units, setUnits] = useState<Map<string, Unit>>(new Map());
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    const allListings = await getAll<Listing>("listings");
    const myListings = allListings.filter(l => l.agentId === user?.id);
    setListings(myListings);

    const propsMap = new Map<string, Property>();
    const unitsMap = new Map<string, Unit>();

    for (const listing of myListings) {
      const property = await getById<Property>("properties", listing.propertyId);
      const unit = await getById<Unit>("units", listing.unitId);
      if (property) propsMap.set(property.id, property);
      if (unit) unitsMap.set(unit.id, unit);
    }

    setProperties(propsMap);
    setUnits(unitsMap);
  }

  const filteredListings = activeTab === "all" 
    ? listings 
    : listings.filter(l => l.status === activeTab);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
  const totalLeads = listings.reduce((sum, l) => sum + l.leads, 0);
  const activeListings = listings.filter(l => l.status === "published").length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
            <p className="text-muted-foreground">Manage your property listings</p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeListings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLeads}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({listings.length})</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="pending_verification">Pending</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="taken">Taken</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => {
                const property = properties.get(listing.propertyId);
                const unit = units.get(listing.unitId);

                return (
                  <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {listing.images[0] && (
                      <div className="h-48 bg-muted relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {listing.featured && (
                          <Badge className="absolute top-3 right-3 bg-accent">Featured</Badge>
                        )}
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {property?.name} - Unit {unit?.unitNumber}
                          </p>
                        </div>
                        <Badge
                          variant={listing.status === "published" ? "default" : "secondary"}
                          className={listing.status === "published" ? "bg-success" : ""}
                        >
                          {listing.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {listing.description}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-muted-foreground">Rent</p>
                          <p className="font-semibold text-lg">{formatCurrency(listing.rent)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">Views / Leads</p>
                          <p className="font-medium">{listing.views} / {listing.leads}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Edit
                        </Button>
                        <Button size="sm" className="flex-1 bg-gradient-secondary">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredListings.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No listings found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
