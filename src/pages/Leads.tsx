import { useEffect, useState } from "react";
import { Mail, Phone, Calendar } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAll, Lead, Listing, getById } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";

export default function Leads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [listings, setListings] = useState<Map<string, Listing>>(new Map());
  const [activeTab, setActiveTab] = useState("new");

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    const allLeads = await getAll<Lead>("leads");
    const myLeads = allLeads.filter(l => l.agentId === user?.id);
    setLeads(myLeads);

    const listingsMap = new Map<string, Listing>();
    for (const lead of myLeads) {
      const listing = await getById<Listing>("listings", lead.listingId);
      if (listing) listingsMap.set(listing.id, listing);
    }
    setListings(listingsMap);
  }

  const filteredLeads = activeTab === "all" 
    ? leads 
    : leads.filter(l => l.status === activeTab);

  const getStatusColor = (status: Lead["status"]) => {
    const colors = {
      new: "bg-blue-500",
      contacted: "bg-yellow-500",
      viewing_scheduled: "bg-purple-500",
      negotiation: "bg-orange-500",
      converted: "bg-success",
      lost: "bg-destructive",
    };
    return colors[status];
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">Manage your sales leads</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="new">New ({leads.filter(l => l.status === "new").length})</TabsTrigger>
            <TabsTrigger value="contacted">Contacted</TabsTrigger>
            <TabsTrigger value="viewing_scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="negotiation">Negotiation</TabsTrigger>
            <TabsTrigger value="converted">Converted</TabsTrigger>
            <TabsTrigger value="all">All ({leads.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-4">
              {filteredLeads.map((lead) => {
                const listing = listings.get(lead.listingId);

                return (
                  <Card key={lead.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{lead.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Interested in: {listing?.title}
                          </p>
                        </div>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{lead.phone}</span>
                        </div>
                      </div>

                      {lead.message && (
                        <div className="p-3 bg-muted rounded-md">
                          <p className="text-sm">{lead.message}</p>
                        </div>
                      )}

                      {lead.scheduledViewing && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Viewing: {new Date(lead.scheduledViewing).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {lead.notes && (
                        <div>
                          <p className="text-sm font-medium mb-1">Notes:</p>
                          <p className="text-sm text-muted-foreground">{lead.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Update Status
                        </Button>
                        <Button size="sm" className="flex-1 bg-gradient-secondary">
                          Add Note
                        </Button>
                        <Button size="sm" variant="outline">
                          Schedule Viewing
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredLeads.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">No leads found</p>
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
