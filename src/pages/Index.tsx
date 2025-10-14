import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "./Dashboard";
import { initDB, getAll } from "@/lib/db";
import { seedDemoData } from "@/lib/seed";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    initializeApp();
  }, []);

  async function initializeApp() {
    try {
      await initDB();
      
      // Check if data exists, if not seed it
      const properties = await getAll("properties");
      if (properties.length === 0) {
        await seedDemoData();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing app:", error);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-sm text-muted-foreground">Loading Agently Landlord...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
