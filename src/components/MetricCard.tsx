import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean; label?: string };
  variant?: "default" | "success" | "warning" | "destructive" | "ink" | "lime";
  index?: number;
}

export default function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  index = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className={cn(
        "relative overflow-hidden rounded-[20px] border-border/50 shadow-sm hover:shadow-lg transition-all duration-500",
        variant === "ink" && "bg-foreground text-background border-foreground",
        variant === "lime" && "bg-secondary text-secondary-foreground border-secondary",
        variant === "default" && "bg-card",
      )}>
        {/* Subtle gradient mesh */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(at 80% 0%, currentColor 0%, transparent 50%), radial-gradient(at 0% 80%, currentColor 0%, transparent 50%)`
          }} />
        </div>

        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-6">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-[12px] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-3deg]",
              variant === "ink" && "bg-background/10 text-background",
              variant === "lime" && "bg-secondary-foreground/10 text-secondary-foreground",
              variant === "success" && "bg-success/10 text-success",
              variant === "warning" && "bg-warning/10 text-warning",
              variant === "destructive" && "bg-destructive/10 text-destructive",
              variant === "default" && "bg-muted text-muted-foreground group-hover:bg-foreground group-hover:text-background"
            )}>
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </div>

            {trend && (
              <div className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium mono tracking-wide",
                trend.isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
                variant === "ink" && (trend.isPositive ? "bg-background/10 text-background" : "bg-destructive/20 text-destructive"),
                variant === "lime" && "bg-secondary-foreground/10 text-secondary-foreground"
              )}>
                <span className="text-[10px]">{trend.isPositive ? "↗" : "↘"}</span>
                {trend.value > 0 ? "+" : ""}{trend.value}%
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <p className={cn(
              "mono text-[11px] uppercase tracking-[0.14em] font-medium",
              variant === "ink" ? "opacity-60" : variant === "lime" ? "opacity-70" : "opacity-50"
            )}>
              {title}
            </p>
            <p className="font-[Fraunces] text-[32px] font-bold leading-none tracking-[-0.02em]">{value}</p>
            {description && (
              <p className={cn(
                "text-[13px] leading-[1.4]",
                variant === "ink" ? "opacity-60" : variant === "lime" ? "opacity-70" : "opacity-60"
              )}>
                {description}
              </p>
            )}
            {trend?.label && (
              <p className={cn(
                "mono text-[11px] mt-2",
                variant === "ink" ? "opacity-50" : "opacity-50"
              )}>
                {trend.label}
              </p>
            )}
          </div>

          {/* Hover shimmer */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
