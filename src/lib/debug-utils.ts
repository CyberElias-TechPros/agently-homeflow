// Utility function to seed demo data - can be called from browser console
import { seedDemoData } from "@/lib/seed";

// Make seedDemoData available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).seedDemoData = seedDemoData;
  console.log('🌱 seedDemoData function is now available in window.seedDemoData');
}

export { seedDemoData };
