import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
            <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetails /></ProtectedRoute>} />
            <Route path="/tenants" element={<ProtectedRoute allowedRoles={["owner", "manager"]}><Tenants /></ProtectedRoute>} />
            <Route path="/tenants/:id" element={<ProtectedRoute><TenantDetails /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute allowedRoles={["manager", "owner"]}><Applications /></ProtectedRoute>} />
            <Route path="/listings" element={<ProtectedRoute allowedRoles={["realtor"]}><Listings /></ProtectedRoute>} />
            <Route path="/leads" element={<ProtectedRoute allowedRoles={["realtor"]}><Leads /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute allowedRoles={["contractor"]}><Jobs /></ProtectedRoute>} />
            <Route path="/academy" element={<ProtectedRoute allowedRoles={["realtor"]}><Academy /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute allowedRoles={["owner", "accountant", "manager"]}><Expenses /></ProtectedRoute>} />
            <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute allowedRoles={["owner", "accountant", "admin"]}><Analytics /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
