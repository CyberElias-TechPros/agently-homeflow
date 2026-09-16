import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: false,
    cors: true,
    hmr: {
      clientPort: 443,
    },
    // @ts-ignore - allow all hosts for e2b preview
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    cors: true,
    // @ts-ignore
    allowedHosts: true,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
}));
