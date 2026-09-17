import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Tenants from "./pages/Tenants";
import TenantDetails from "./pages/TenantDetails";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";
import Maintenance from "./pages/Maintenance";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Applications from "./pages/Applications";
import Listings from "./pages/Listings";
import Leads from "./pages/Leads";
import Jobs from "./pages/Jobs";
import Academy from "./pages/Academy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Wrapper that adds Layout for pages that don't already include it
const WithLayout = ({ children }: { children: React.ReactNode }) => (
  <Layout>{children}</Layout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Index already includes Layout */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            
            {/* All other routes wrapped with Layout */}
            <Route path="/properties" element={<ProtectedRoute><WithLayout><Properties /></WithLayout></ProtectedRoute>} />
            <Route path="/properties/:id" element={<ProtectedRoute><WithLayout><PropertyDetails /></WithLayout></ProtectedRoute>} />
            
            <Route path="/tenants" element={<ProtectedRoute><WithLayout><Tenants /></WithLayout></ProtectedRoute>} />
            <Route path="/tenants/:id" element={<ProtectedRoute><WithLayout><TenantDetails /></WithLayout></ProtectedRoute>} />
            
            <Route path="/applications" element={<ProtectedRoute><WithLayout><Applications /></WithLayout></ProtectedRoute>} />
            <Route path="/listings" element={<ProtectedRoute><WithLayout><Listings /></WithLayout></ProtectedRoute>} />
            <Route path="/leads" element={<ProtectedRoute><WithLayout><Leads /></WithLayout></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><WithLayout><Jobs /></WithLayout></ProtectedRoute>} />
            <Route path="/academy" element={<ProtectedRoute><WithLayout><Academy /></WithLayout></ProtectedRoute>} />
            
            <Route path="/payments" element={<ProtectedRoute><WithLayout><Payments /></WithLayout></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><WithLayout><Expenses /></WithLayout></ProtectedRoute>} />
            <Route path="/maintenance" element={<ProtectedRoute><WithLayout><Maintenance /></WithLayout></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><WithLayout><Analytics /></WithLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><WithLayout><Settings /></WithLayout></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
