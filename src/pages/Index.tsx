import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "./Dashboard";
import { initDB, getAll } from "@/lib/db";
import { seedDemoData } from "@/lib/seed";
import "@/lib/debug-utils";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showSeedButton, setShowSeedButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    initializeApp();
  }, []);

  async function initializeApp() {
    try {
      console.log("🔄 Initializing Agently Landlord app...");
      await initDB();
      console.log("✅ Database initialized successfully");

      // Check if users exist first (critical for authentication)
      const users = await getAll("users");
      console.log(`👥 Found ${users.length} existing users in database`);

      // Check if properties exist for reference
      const properties = await getAll("properties");
      console.log(`🏢 Found ${properties.length} existing properties in database`);

      // Seed data if no users exist (users are required for login)
      if (users.length === 0) {
        console.log("🚀 No users found, seeding demo data...");
        try {
          await seedDemoData();
          console.log("✅ Demo data seeded successfully");
        } catch (seedError) {
          console.error("❌ Error seeding demo data:", seedError);
          // Try seeding again in case of transient error
          console.log("🔄 Retrying seeding...");
          await seedDemoData();
        }

        // Verify users were created successfully
        const newUsers = await getAll("users");
        console.log(`✅ Verification: Now ${newUsers.length} users in database`);

        if (newUsers.length === 0) {
          console.log("⚠️ Still no users after seeding, showing manual seed button");
          setShowSeedButton(true);
        }
      } else {
        console.log("ℹ️ Users already exist, skipping seeding");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error initializing app:", error);
      setIsLoading(false);
      setShowSeedButton(true);
    }
  }

  async function manualSeed() {
    try {
      console.log("🔄 Manual seeding triggered...");
      await seedDemoData();
      const users = await getAll("users");
      console.log(`✅ Manual seeding completed. Now ${users.length} users in database`);
      setShowSeedButton(false);
      window.location.reload();
    } catch (error) {
      console.error("❌ Manual seeding failed:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-sm text-muted-foreground">Loading Agently Landlord...</p>
          {showSeedButton && (
            <div className="mt-4">
              <button
                onClick={manualSeed}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Seed Demo Data
              </button>
            </div>
          )}
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
