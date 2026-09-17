import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Building2, LayoutDashboard, Users, Wrench, TrendingUp, 
  DollarSign, TrendingDown, Settings, LogOut, FileText, 
  Briefcase, ClipboardList, Sparkles, Bell, Search,
  Menu, X, Home as HomeIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = { path: string; icon: any; label: string; badge?: number; description?: string };

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const roleNavigation: Record<string, NavItem[]> = {
    owner: [
      { path: "/", icon: LayoutDashboard, label: "Overview", description: "Portfolio pulse" },
      { path: "/properties", icon: Building2, label: "Properties", description: "Your estates" },
      { path: "/tenants", icon: Users, label: "Tenants", description: "Residents" },
      { path: "/payments", icon: DollarSign, label: "Payments", description: "Cash flow" },
      { path: "/expenses", icon: TrendingDown, label: "Expenses", description: "Outflows" },
      { path: "/maintenance", icon: Wrench, label: "Maintenance", description: "Fix & care" },
      { path: "/analytics", icon: TrendingUp, label: "Analytics", description: "Insights" },
    ],
    manager: [
      { path: "/", icon: LayoutDashboard, label: "Tasks", description: "Daily ops" },
      { path: "/properties", icon: Building2, label: "Properties", description: "Managed" },
      { path: "/tenants", icon: Users, label: "Tenants", description: "Occupants" },
      { path: "/applications", icon: ClipboardList, label: "Applications", description: "New leases" },
      { path: "/maintenance", icon: Wrench, label: "Maintenance", description: "Work orders" },
      { path: "/payments", icon: DollarSign, label: "Payments", description: "Collections" },
    ],
    accountant: [
      { path: "/", icon: LayoutDashboard, label: "Dashboard", description: "Financials" },
      { path: "/payments", icon: DollarSign, label: "Ledger", description: "Transactions" },
      { path: "/expenses", icon: TrendingDown, label: "Expenses", description: "Costs" },
      { path: "/analytics", icon: TrendingUp, label: "Reports", description: "Statements" },
    ],
    tenant: [
      { path: "/", icon: HomeIcon, label: "Home", description: "Your space" },
      { path: "/payments", icon: DollarSign, label: "Payments", description: "Rent & bills" },
      { path: "/maintenance", icon: Wrench, label: "Maintenance", description: "Request help" },
    ],
    realtor: [
      { path: "/", icon: LayoutDashboard, label: "Dashboard", description: "Sales hub" },
      { path: "/listings", icon: Building2, label: "Listings", description: "On market" },
      { path: "/leads", icon: Users, label: "Leads", description: "Prospects" },
      { path: "/academy", icon: Briefcase, label: "Academy", description: "Learn" },
    ],
    contractor: [
      { path: "/", icon: LayoutDashboard, label: "Dashboard", description: "Jobs" },
      { path: "/jobs", icon: Wrench, label: "Jobs", description: "Work orders" },
    ],
    admin: [
      { path: "/", icon: LayoutDashboard, label: "Dashboard", description: "System" },
      { path: "/properties", icon: Building2, label: "Properties", description: "All estates" },
      { path: "/tenants", icon: Users, label: "Users", description: "Everyone" },
      { path: "/analytics", icon: TrendingUp, label: "Analytics", description: "Platform" },
    ],
  };

  const navItems = roleNavigation[user?.role || "owner"] || roleNavigation.owner;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary selection:text-secondary-foreground">
      {/* Ambient background — mesh + grain */}
      <div className="fixed inset-0 -z-10 hero-gradient" />
      <div className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />

      {/* Header — glass, immersive */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-500",
          scrolled 
            ? "glass-strong border-border/50 shadow-[0_8px_32px_-16px_hsl(var(--foreground)/0.15)]" 
            : "bg-transparent border-transparent"
        )}
      >
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 h-[72px] flex items-center justify-between">
          {/* Logo — editorial, distinctive */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-foreground text-background shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:-rotate-[2deg]">
                <Building2 className="h-[22px] w-[22px]" strokeWidth={1.75} />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-secondary border-2 border-background animate-pulse" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-[Fraunces] text-[20px] font-bold tracking-[-0.02em]">Agently</span>
              <span className="mono text-[10px] uppercase tracking-[0.14em] opacity-60 font-medium">Homeflow</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 ml-6 pl-6 border-l border-border/60">
              <Sparkles className="h-3.5 w-3.5 text-secondary-foreground" />
              <span className="mono text-[11px] uppercase tracking-widest opacity-50">v2.0 • Production</span>
            </div>
          </Link>

          {/* Desktop Nav — pill, magnetic */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-muted/70 backdrop-blur-xl border border-border/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-medium transition-all duration-300",
                    isActive
                      ? "bg-foreground text-background shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={isActive ? 2.2 : 1.8} />
                  {item.label}
                  {item.badge ? (
                    <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-[11px] font-bold text-secondary-foreground">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* Actions — tactile */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden lg:flex h-10 w-10 rounded-full bg-muted/60 hover:bg-muted">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden lg:flex h-10 w-10 rounded-full bg-muted/60 hover:bg-muted relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent animate-pulse" />
            </Button>

            <Link to="/settings" className="hidden lg:flex">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-muted/60 hover:bg-muted">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>

            {/* User — premium card */}
            <div className="hidden lg:flex items-center gap-3 pl-3 ml-1 border-l border-border/60">
              <div className="text-right leading-tight">
                <p className="text-[13px] font-semibold tracking-tight">{user?.firstName} {user?.lastName}</p>
                <p className="mono text-[10px] uppercase tracking-widest opacity-60 capitalize">{user?.role}</p>
              </div>
              <Avatar className="h-10 w-10 ring-2 ring-border/50 ring-offset-2 ring-offset-background">
                <AvatarFallback className="bg-foreground text-background font-medium text-[13px]">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-11 w-11 rounded-full bg-foreground text-background"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu — immersive sheet */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="lg:hidden border-t border-border/50 glass-strong"
            >
              <div className="px-6 py-6 space-y-6">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/60">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-foreground text-background">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                    <p className="mono text-xs opacity-60 uppercase tracking-widest">{user?.role} • {user?.email}</p>
                  </div>
                </div>

                <div className="grid gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all",
                          isActive ? "bg-foreground text-background" : "hover:bg-muted"
                        )}
                      >
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", isActive ? "bg-background/10" : "bg-muted")}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.label}</p>
                          <p className={cn("mono text-[11px] uppercase tracking-widest", isActive ? "opacity-60" : "opacity-50")}>{item.description}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-4 border-t border-border/50">
                  <Button variant="outline" className="flex-1 rounded-full h-12" onClick={() => { setMobileMenuOpen(false); navigate('/settings'); }}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Button>
                  <Button variant="destructive" className="flex-1 rounded-full h-12" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main — editorial, spacious */}
      <main className="mx-auto max-w-[1600px] px-6 lg:px-10 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer — minimal, editorial */}
      <footer className="mt-auto border-t border-border/40">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 mono text-[11px] uppercase tracking-widest opacity-50">
            <span>© {new Date().getFullYear()} Agently Homeflow</span>
            <span className="hidden lg:inline">•</span>
            <span>Built for Africa • Loved globally</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="mono text-[11px] uppercase tracking-widest opacity-60">All systems operational • Cloudflare Edge</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
