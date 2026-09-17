import { Link } from "react-router-dom";
import { Building2, ArrowLeft, Sparkles, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6">
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full blur-[100px] bg-secondary/20" />
        <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full blur-[100px] bg-accent/15" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-[480px] text-center space-y-8"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-foreground text-background shadow-xl">
          <Building2 className="h-8 w-8" />
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border/50 mono text-[11px] uppercase tracking-widest">
            <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            404 • Estate not found
          </div>
          <h1 className="font-[Fraunces] text-[48px] font-bold leading-[0.9] tracking-[-0.03em]">This estate<br />doesn't exist</h1>
          <p className="text-[15px] opacity-60 leading-[1.5] max-w-[36ch] mx-auto">The property you're looking for has moved, been sold, or never existed. Let's get you back to the flow.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/"><Button className="rounded-full h-11 px-6 bg-foreground text-background"><Home className="mr-2 h-4 w-4" /> Back to overview</Button></Link>
          <Link to="/properties"><Button variant="outline" className="rounded-full h-11 px-6"><ArrowLeft className="mr-2 h-4 w-4" /> View properties</Button></Link>
        </div>

        <div className="pt-8 flex items-center justify-center gap-2 mono text-[11px] uppercase tracking-widest opacity-40">
          <Sparkles className="h-3 w-3" />
          Agently Homeflow • Every path is a happy path
        </div>
      </motion.div>
    </div>
  );
}
