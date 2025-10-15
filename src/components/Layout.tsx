import { Link, useLocation } from "react-router-dom";
import { Building2, LayoutDashboard, Users, Wrench, TrendingUp, DollarSign, TrendingDown, Settings, LogOut, FileText, Briefcase, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  type NavItem = { path: string; icon: any; label: string };

  const roleNavigation: Record<string, NavItem[]> = {
    owner: [
      { path: "/", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/properties", icon: Building2, label: "Properties" },
      { path: "/tenants", icon: Users, label: "Tenants" },
      { path: "/payments", icon: DollarSign, label: "Payments" },
      { path: "/expenses", icon: TrendingDown, label: "Expenses" },
      { path: "/maintenance", icon: Wrench, label: "Maintenance" },
      { path: "/analytics", icon: TrendingUp, label: "Analytics" },
    ],
    manager: [
      { path: "/", icon: LayoutDashboard, label: "Tasks" },
      { path: "/properties", icon: Building2, label: "Properties" },
      { path: "/applications", icon: ClipboardList, label: "Applications" },
      { path: "/maintenance", icon: Wrench, label: "Maintenance" },
      { path: "/payments", icon: DollarSign, label: "Payments" },
    ],
    accountant: [
      { path: "/", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/payments", icon: DollarSign, label: "Ledger" },
      { path: "/expenses", icon: TrendingDown, label: "Expenses" },
      { path: "/analytics", icon: TrendingUp, label: "Reports" },
    ],
    tenant: [
      { path: "/", icon: LayoutDashboard, label: "Home" },
      { path: "/lease", icon: FileText, label: "Lease" },
      { path: "/payments", icon: DollarSign, label: "Payments" },
      { path: "/maintenance", icon: Wrench, label: "Maintenance" },
    ],
    realtor: [
      { path: "/", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/listings", icon: Building2, label: "Listings" },
      { path: "/leads", icon: Users, label: "Leads" },
      { path: "/academy", icon: Briefcase, label: "Academy" },
    ],
    contractor: [
      { path: "/", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/jobs", icon: Wrench, label: "Jobs" },
    ],
    admin: [
      { path: "/", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/users", icon: Users, label: "Users" },
      { path: "/properties", icon: Building2, label: "Properties" },
      { path: "/moderation", icon: ClipboardList, label: "Moderation" },
      { path: "/analytics", icon: TrendingUp, label: "Analytics" },
    ],
  };

  const navItems = roleNavigation[user?.role || "owner"] || roleNavigation.owner;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-8 flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none">Agently</span>
              <span className="text-xs text-muted-foreground">Landlord</span>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                    "h-10 px-4 py-2",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/settings"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10"
            >
              <Settings className="h-5 w-5" />
            </Link>
            
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                  {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="h-10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}
