import { BookOpen, Play, Award, Clock, ArrowUpRight, Sparkles, TrendingUp, Users, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Academy() {
  const courses = [
    { id: 1, title: "Mastering Lagos Luxury", desc: "How to price and position high-end estates for HNIs", duration: "45 min", level: "Advanced", lessons: 8, category: "Sales", color: "bg-foreground text-background" },
    { id: 2, title: "Tenant Psychology", desc: "Understanding what makes tenants stay and pay on time", duration: "32 min", level: "Intermediate", lessons: 6, category: "Retention", color: "bg-secondary text-secondary-foreground" },
    { id: 3, title: "Fluid Negotiation", desc: "Close deals without pressure — the Homeflow way", duration: "58 min", level: "Beginner", lessons: 10, category: "Negotiation", color: "bg-accent text-accent-foreground" },
    { id: 4, title: "Virtual Tours That Sell", desc: "Create cinematic property walkthroughs that convert", duration: "41 min", level: "Intermediate", lessons: 7, category: "Marketing", color: "bg-muted text-muted-foreground" },
    { id: 5, title: "Legal Essentials NG", desc: "Tenancy law, KYC, and compliance in Nigeria", duration: "1h 12m", level: "Advanced", lessons: 12, category: "Legal", color: "bg-foreground text-background" },
    { id: 6, title: "AI for Realtors", desc: "Use Homeflow AI to auto-write listings and score leads", duration: "28 min", level: "Beginner", lessons: 5, category: "AI", color: "bg-secondary text-secondary-foreground" },
  ];

  const stats = [
    { k: "24", v: "Courses", icon: BookOpen },
    { k: "12h", v: "Content", icon: Clock },
    { k: "4.9", v: "Rating", icon: Award },
  ];

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-[28px] bg-foreground text-background p-8 lg:p-12">
        <div className="absolute inset-0 opacity-40"><div className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[80px] bg-secondary/30" /><div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[60px] bg-accent/20" /></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
          <div className="space-y-6 max-w-[560px]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/10 backdrop-blur mono text-[11px] uppercase tracking-widest"><Sparkles className="h-3 w-3" /> Academy • Learn. Earn. Flow.</div>
            <div><h1 className="font-[Fraunces] text-[40px] lg:text-[56px] font-bold leading-[0.9] tracking-[-0.03em]">Become a<br />Homeflow pro</h1><p className="text-[15px] opacity-70 mt-4 leading-[1.5] max-w-[44ch]">Cinematic courses for realtors who want to close faster, price smarter, and build a brand people remember.</p></div>
            <div className="flex gap-3"><Button className="rounded-full bg-background text-foreground hover:bg-background/90"><Play className="mr-2 h-4 w-4" /> Start learning</Button><Button variant="outline" className="rounded-full border-background/20 text-background hover:bg-background/10 hover:text-background">View certificate</Button></div>
          </div>
          <div className="grid grid-cols-3 gap-3 lg:w-[320px]">
            {stats.map(s => (
              <div key={s.v} className="rounded-[16px] bg-background/10 backdrop-blur border border-background/10 p-4 text-center"><s.icon className="h-4 w-4 mx-auto mb-3 opacity-60" /><p className="font-[Fraunces] text-[24px] font-bold leading-none">{s.k}</p><p className="mono text-[10px] uppercase tracking-widest opacity-60 mt-1">{s.v}</p></div>
            ))}
            <div className="col-span-3 rounded-[16px] bg-secondary text-secondary-foreground p-4 flex items-center justify-between"><div><p className="font-medium text-[14px]">Your progress</p><p className="mono text-[11px] opacity-70">3 courses • 40% complete</p></div><div className="h-10 w-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center font-bold">40%</div></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, idx) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} whileHover={{ y: -3 }}>
            <Card className="rounded-[20px] border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
              <div className="h-2 w-full" style={{ background: course.color.includes("secondary") ? "hsl(78 100% 60%)" : course.color.includes("accent") ? "hsl(18 85% 62%)" : "hsl(30 10% 8%)" }} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${course.color}`}><BookOpen className="h-5 w-5" /></div>
                  <Badge variant="outline" className="rounded-full mono text-[10px] uppercase tracking-widest">{course.category}</Badge>
                </div>
                <CardTitle className="font-[Fraunces] text-[20px] leading-tight mt-4 group-hover:tracking-tight transition-all">{course.title}</CardTitle>
                <CardDescription className="text-[13px] leading-[1.5] mt-2">{course.desc}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="flex items-center gap-4 mono text-[11px] opacity-60"><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.duration}</span><span>{course.lessons} lessons</span><span className="capitalize">{course.level}</span></div>
                <Button className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 h-10">Continue <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[20px] border-border/50 bg-secondary/20 border-secondary/30"><CardContent className="p-6 flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground shrink-0"><TrendingUp className="h-5 w-5" /></div><div><p className="font-medium">Earn as you learn</p><p className="text-[13px] opacity-70 mt-1 leading-[1.5]">Complete courses to unlock featured listings and higher commission splits.</p></div></CardContent></Card>
        <Card className="rounded-[20px] border-border/50"><CardContent className="p-6 flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shrink-0"><Users className="h-5 w-5" /></div><div><p className="font-medium">Community</p><p className="text-[13px] opacity-70 mt-1 leading-[1.5]">Join 2,400+ realtors in Lagos sharing deals and insights.</p></div></CardContent></Card>
        <Card className="rounded-[20px] border-border/50"><CardContent className="p-6 flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shrink-0"><Building2 className="h-5 w-5" /></div><div><p className="font-medium">Certification</p><p className="text-[13px] opacity-70 mt-1 leading-[1.5]">Get Homeflow Certified and get verified badge on listings.</p></div></CardContent></Card>
      </div>
    </div>
  );
}
