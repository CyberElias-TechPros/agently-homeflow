import { useState } from "react";
import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, Building2, Sun, LogOut, Sparkles, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false, maintenance: true, payments: true });

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="space-y-8 max-w-[1000px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background"><SettingsIcon className="h-4 w-4" /></div><span className="mono text-[11px] uppercase tracking-[0.14em] opacity-60">Account • Preferences • Security</span></div>
          <div><h1 className="font-[Fraunces] text-[40px] lg:text-[48px] font-bold leading-[0.9] tracking-[-0.03em]">Settings</h1><p className="text-[15px] opacity-60 mt-3 max-w-[48ch]">Manage your identity, notifications, and how Homeflow works for you.</p></div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-[20px] border-border/50 lg:col-span-1 h-fit">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 ring-4 ring-border/50 ring-offset-4 ring-offset-background"><AvatarFallback className="bg-foreground text-background text-[20px] font-bold">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback></Avatar>
              <h3 className="font-[Fraunces] text-[20px] font-bold mt-4">{user?.firstName} {user?.lastName}</h3>
              <p className="mono text-[11px] uppercase tracking-widest opacity-60 mt-1">{user?.role} • {user?.email}</p>
              <Badge className="mt-3 rounded-full bg-success text-success-foreground border-0 mono text-[10px] uppercase tracking-widest">{user?.kycStatus || "verified"}</Badge>
            </div>

            <div className="space-y-2 pt-4 border-t border-border/50">
              <div className="rounded-[12px] bg-muted/50 p-3 flex items-center justify-between"><div><p className="text-[13px] font-medium">Properties</p><p className="mono text-[11px] opacity-60">Managed estates</p></div><span className="font-[Fraunces] text-[18px] font-bold">4</span></div>
              <div className="rounded-[12px] bg-muted/50 p-3 flex items-center justify-between"><div><p className="text-[13px] font-medium">Tenants</p><p className="mono text-[11px] opacity-60">Active residents</p></div><span className="font-[Fraunces] text-[18px] font-bold">12</span></div>
              <div className="rounded-[12px] bg-secondary/20 border border-secondary/30 p-3 flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground shrink-0"><Sparkles className="h-4 w-4" /></div><div><p className="text-[12px] font-medium leading-tight">Pro plan</p><p className="mono text-[10px] opacity-70">Unlimited • Cloudflare Edge</p></div></div>
            </div>

            <Button variant="destructive" className="w-full rounded-full h-11" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Sign out</Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="rounded-full bg-muted/70 p-1 h-11 w-full grid grid-cols-4"><TabsTrigger value="profile" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Profile</TabsTrigger><TabsTrigger value="notifications" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Notifications</TabsTrigger><TabsTrigger value="security" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Security</TabsTrigger><TabsTrigger value="billing" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Billing</TabsTrigger></TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card className="rounded-[20px] border-border/50">
                <CardHeader><CardTitle className="font-[Fraunces] text-[20px]">Personal information</CardTitle><CardDescription className="mono text-[11px]">Update your identity</CardDescription></CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">First name</Label><Input defaultValue={user?.firstName} className="h-11 rounded-[12px]" /></div>
                    <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Last name</Label><Input defaultValue={user?.lastName} className="h-11 rounded-[12px]" /></div>
                  </div>
                  <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Email</Label><Input defaultValue={user?.email} className="h-11 rounded-[12px]" /></div>
                  <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Phone</Label><Input defaultValue={user?.phone} className="h-11 rounded-[12px]" /></div>
                  <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Bio</Label><Input placeholder="Landlord, designer, optimist..." className="h-11 rounded-[12px]" /></div>
                  <Button className="rounded-full bg-foreground text-background h-11 px-8">Save changes</Button>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-border/50">
                <CardHeader><CardTitle className="font-[Fraunces] text-[18px]">Preferences</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-[12px] border border-border/50"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"><Sun className="h-4 w-4" /></div><div><p className="text-[13px] font-medium">Appearance</p><p className="mono text-[11px] opacity-60">Light / Dark / System</p></div></div><Button variant="outline" size="sm" className="rounded-full">System</Button></div>
                  <div className="flex items-center justify-between p-3 rounded-[12px] border border-border/50"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"><Building2 className="h-4 w-4" /></div><div><p className="text-[13px] font-medium">Currency</p><p className="mono text-[11px] opacity-60">NGN • Nigerian Naira</p></div></div><Button variant="outline" size="sm" className="rounded-full">NGN</Button></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card className="rounded-[20px] border-border/50">
                <CardHeader><CardTitle className="font-[Fraunces] text-[20px]">Notifications</CardTitle><CardDescription className="mono text-[11px]">Choose what you hear about</CardDescription></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { key: "email", label: "Email notifications", desc: "Rent, maintenance, updates", icon: User },
                    { key: "push", label: "Push notifications", desc: "Real-time alerts", icon: Bell },
                    { key: "maintenance", label: "Maintenance alerts", desc: "New requests and status", icon: Building2 },
                    { key: "payments", label: "Payment alerts", desc: "Collections and failures", icon: CreditCard },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-[14px] border border-border/50">
                      <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"><item.icon className="h-4 w-4 opacity-60" /></div><div><p className="text-[13px] font-medium">{item.label}</p><p className="mono text-[11px] opacity-60">{item.desc}</p></div></div>
                      <Switch checked={(notifications as any)[item.key]} onCheckedChange={v => setNotifications({ ...notifications, [item.key]: v })} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card className="rounded-[20px] border-border/50">
                <CardHeader><CardTitle className="font-[Fraunces] text-[20px]">Security</CardTitle><CardDescription className="mono text-[11px]">Protect your estate</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[14px] bg-success/10 border border-success/20 p-4 flex items-start gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground shrink-0"><Shield className="h-4 w-4" /></div><div><p className="text-[13px] font-medium">Two-factor authentication</p><p className="text-[12px] opacity-70 mt-1">Add extra security to your account. Recommended for owners.</p><Button size="sm" className="mt-3 rounded-full bg-foreground text-background h-8">Enable 2FA</Button></div></div>
                  <div className="space-y-3">
                    <div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Current password</Label><Input type="password" placeholder="••••••••" className="h-11 rounded-[12px]" /></div>
                    <div className="grid gap-3 md:grid-cols-2"><div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">New password</Label><Input type="password" placeholder="••••••••" className="h-11 rounded-[12px]" /></div><div className="space-y-2"><Label className="mono text-[11px] uppercase tracking-widest opacity-70">Confirm</Label><Input type="password" placeholder="••••••••" className="h-11 rounded-[12px]" /></div></div>
                    <Button variant="outline" className="rounded-full h-11">Update password</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <Card className="rounded-[20px] border-border/50 bg-foreground text-background">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div><p className="mono text-[11px] uppercase tracking-widest opacity-60">Current plan</p><h3 className="font-[Fraunces] text-[28px] font-bold leading-none mt-2">Pro • Unlimited</h3><p className="text-[13px] opacity-70 mt-3 max-w-[36ch]">Everything you need for serious portfolio management. Cloudflare D1, R2, KV, and Workers included.</p><div className="flex gap-2 mt-6"><Button className="rounded-full bg-background text-foreground hover:bg-background/90 h-10">Manage billing <ArrowUpRight className="ml-1 h-4 w-4" /></Button><Button variant="outline" className="rounded-full border-background/20 text-background hover:bg-background/10 hover:text-background h-10">Invoices</Button></div></div>
                    <div className="hidden lg:flex h-16 w-16 items-center justify-center rounded-[16px] bg-secondary text-secondary-foreground"><CreditCard className="h-8 w-8" /></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
