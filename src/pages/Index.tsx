import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Dashboard from "./Dashboard";
import { initDB, getAll } from "@/lib/db";
import { seedDemoData } from "@/lib/seed";
import { apiClient } from "@/lib/api";
import "@/lib/debug-utils";
import { Loader2, Building2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  async function initializeApp() {
    try {
      // Try to seed via API first (production path)
      try {
        const health = await apiClient.healthCheck();
        if (health.success) {
          console.log("✅ API available, checking seed...");
          // Try to seed if needed - only in dev or with no data
          // We don't auto-seed in production unless needed
          try {
            const props = await apiClient.getProperties();
            if (!props.success || props.data.length === 0) {
              console.log("No properties, attempting seed...");
              await apiClient.seedDatabase().catch(() => console.log("Seed not needed or failed"));
            }
          } catch {}
          setIsLoading(false);
          return;
        }
      } catch {
        console.log("API not available, using IndexedDB fallback");
      }

      // Fallback to IndexedDB
      await initDB();
      const users = await getAll("users");
      const properties = await getAll("properties");

      if (users.length === 0) {
        try {
          await seedDemoData();
        } catch (seedError) {
          console.error("Seed error:", seedError);
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Init error:", error);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full blur-[100px] bg-secondary/20 animate-pulse" />
          <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full blur-[100px] bg-accent/15 animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center space-y-6"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[16px] bg-foreground text-background shadow-xl">
            <Building2 className="h-8 w-8 animate-pulse" />
          </div>
          <div className="space-y-3">
            <h1 className="font-[Fraunces] text-[28px] font-bold tracking-tight flex items-center justify-center gap-2">
              Agently Homeflow
              <Sparkles className="h-5 w-5 text-secondary-foreground" />
            </h1>
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="mono text-[12px] uppercase tracking-widest opacity-60">Initializing estate flow...</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mono text-[10px] uppercase tracking-widest opacity-40">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Cloudflare Workers • D1 • R2 • KV
          </div>
        </motion.div>
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
