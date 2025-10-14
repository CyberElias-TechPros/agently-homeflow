import { Link, useLocation } from "react-router-dom";
import { Building2, LayoutDashboard, Users, Wrench, TrendingUp, DollarSign, TrendingDown, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/properties", icon: Building2, label: "Properties" },
    { path: "/tenants", icon: Users, label: "Tenants" },
    { path: "/payments", icon: DollarSign, label: "Payments" },
    { path: "/expenses", icon: TrendingDown, label: "Expenses" },
    { path: "/maintenance", icon: Wrench, label: "Maintenance" },
    { path: "/analytics", icon: TrendingUp, label: "Analytics" },
  ];

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

          <Link
            to="/settings"
            className="ml-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}
