import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowRight, Sparkles, Shield, Zap, Users, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Parallax mouse effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      toast({ title: "Welcome back", description: "Homeflow is ready." });
      navigate("/");
    } else {
      toast({ title: "Sign in failed", description: "Check your credentials and try again.", variant: "destructive" });
    }
    setLoading(false);
  };

  const quickLogin = (role: string) => {
    const creds: Record<string, { email: string; password: string }> = {
      owner: { email: "owner@agently.com", password: "owner123" },
      manager: { email: "manager@agently.com", password: "manager123" },
      accountant: { email: "accountant@agently.com", password: "accountant123" },
      tenant: { email: "tenant@agently.com", password: "tenant123" },
      realtor: { email: "realtor@agently.com", password: "realtor123" },
      contractor: { email: "contractor@agently.com", password: "contractor123" },
      admin: { email: "admin@agently.com", password: "admin123" },
    };
    const c = creds[role];
    if (c) {
      setEmail(c.email);
      setPassword(c.password);
    }
  };

  const roles = [
    { id: 'owner', label: 'Owner', desc: 'Portfolio owner', color: 'bg-foreground' },
    { id: 'manager', label: 'Manager', desc: 'Operations', color: 'bg-secondary' },
    { id: 'tenant', label: 'Tenant', desc: 'Resident', color: 'bg-accent' },
    { id: 'realtor', label: 'Realtor', desc: 'Sales', color: 'bg-foreground' },
    { id: 'contractor', label: 'Contractor', desc: 'Fix & care', color: 'bg-muted-foreground' },
    { id: 'accountant', label: 'Finance', desc: 'Ledger', color: 'bg-foreground' },
  ];

  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden relative">
      {/* Ambient */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />

      {/* Left — editorial hero, cinematic */}
      <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden">
        {/* Organic blobs with parallax */}
        <motion.div 
          className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full blur-[120px] opacity-30"
          style={{ background: 'hsl(78 100% 60%)', x: mousePos.x, y: mousePos.y }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[100px] opacity-20"
          style={{ background: 'hsl(18 85% 62%)', x: mousePos.x * -0.5, y: mousePos.y * -0.5 }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-foreground text-background shadow-xl">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="font-[Fraunces] text-[18px] font-bold leading-none tracking-tight">Agently</p>
                <p className="mono text-[10px] uppercase tracking-[0.14em] opacity-60">Homeflow</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background mono text-[10px] uppercase tracking-widest">
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Live • Cloudflare Edge
            </div>
          </div>

          {/* Hero copy — editorial, massive */}
          <div className="space-y-12 max-w-[640px]">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground mono text-[11px] uppercase tracking-widest font-medium"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Property management, reimagined
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="font-[Fraunces] text-[56px] xl:text-[72px] font-[700] leading-[0.9] tracking-[-0.03em] text-balance"
              >
                Where estates
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10">find their flow</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute bottom-[8px] left-0 right-0 h-[12px] bg-secondary/60 -z-0 origin-left"
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-[18px] leading-[1.5] opacity-70 max-w-[48ch] text-balance"
              >
                The premium platform for landlords who think like designers. 
                Cinematic operations, fluid cash flow, and tenant experiences people remember.
              </motion.p>
            </div>

            {/* Social proof — tactile cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { k: "99.9%", v: "Uptime", icon: Zap },
                { k: "10k+", v: "Properties", icon: Building2 },
                { k: "4.9/5", v: "Rated", icon: Users },
              ].map((stat, i) => (
                <div key={i} className="rounded-[16px] bg-card border border-border/50 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                  <stat.icon className="h-4 w-4 mb-3 opacity-60" />
                  <p className="font-[Fraunces] text-[22px] font-bold leading-none tracking-tight">{stat.k}</p>
                  <p className="mono text-[10px] uppercase tracking-widest opacity-60 mt-1">{stat.v}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between mono text-[11px] uppercase tracking-widest opacity-50">
            <span>© 2026 Agently Homeflow • Lagos → World</span>
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" />
              <span>SOC 2 • Encrypted • Loved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right — login, tactile, premium */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-[440px] space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-[Fraunces] font-bold leading-none">Agently</p>
              <p className="mono text-[10px] uppercase tracking-widest opacity-60">Homeflow</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-2"
          >
            <h2 className="font-[Fraunces] text-[36px] font-bold leading-[0.9] tracking-[-0.02em]">Welcome back</h2>
            <p className="text-[15px] leading-[1.5] opacity-60">Sign in to your estate. The flow is waiting.</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="mono text-[11px] uppercase tracking-widest opacity-70">Email address</Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@estate.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="h-[52px] rounded-[14px] bg-card border-border/60 px-4 text-[15px] transition-all duration-300 focus:border-foreground/20 focus:ring-4 focus:ring-foreground/[0.06] group-hover:border-foreground/10"
                  />
                  <AnimatePresence>
                    {focusedField === 'email' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-secondary"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="mono text-[11px] uppercase tracking-widest opacity-70">Password</Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="h-[52px] rounded-[14px] bg-card border-border/60 px-4 pr-12 text-[15px] transition-all duration-300 focus:border-foreground/20 focus:ring-4 focus:ring-foreground/[0.06] group-hover:border-foreground/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 opacity-60" /> : <Eye className="h-4 w-4 opacity-60" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] rounded-[14px] bg-foreground text-background hover:bg-foreground/90 text-[15px] font-medium tracking-tight transition-all duration-300 hover:shadow-lg hover:shadow-foreground/10 hover:-translate-y-[1px] active:translate-y-0 group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-background/30 border-t-background animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Enter Homeflow
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              )}
            </Button>
          </motion.form>

          {/* Demo accounts — bento, tactile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border/60" />
              <span className="mono text-[10px] uppercase tracking-[0.14em] opacity-50 px-2">Demo identities • Click to fill</span>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => quickLogin(role.id)}
                  className="group relative rounded-[14px] border border-border/60 bg-card p-3 text-left hover:border-foreground/15 hover:shadow-md hover:-translate-y-[1px] transition-all duration-300"
                >
                  <div className={`absolute top-3 right-3 h-2 w-2 rounded-full ${role.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                  <p className="text-[13px] font-semibold leading-none tracking-tight">{role.label}</p>
                  <p className="mono text-[10px] uppercase tracking-widest opacity-50 mt-1">{role.desc}</p>
                </button>
              ))}
            </div>

            <div className="rounded-[14px] bg-secondary/15 border border-secondary/20 p-3 flex items-start gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground shrink-0 mt-0.5">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <p className="text-[12px] font-medium leading-tight">Production-ready backend</p>
                <p className="text-[11px] leading-[1.4] opacity-70">Cloudflare Workers + D1 + R2 • Real auth, real data, happy paths everywhere. Try Owner for full portfolio.</p>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mono text-[11px] leading-[1.5] opacity-40"
          >
            By signing in, you agree to our Terms and acknowledge our Privacy Policy.
            <br />
            <span className="opacity-60">Agently Homeflow is SOC 2 compliant and encrypted end-to-end.</span>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
