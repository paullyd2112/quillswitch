
import React from "react";
import { cn } from "@/lib/utils";
import GlassPanel from "../ui-elements/GlassPanel";
import { ArrowUpRight, ArrowDownRight, Users, Activity, Award, Clock } from "lucide-react";
import FadeIn from "../animations/FadeIn";

interface StatCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    positive: boolean;
  };
  icon: React.ReactNode;
  delay?: "none" | "100" | "200" | "300" | "400" | "500";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, delay = "none" }) => (
  <FadeIn delay={delay}>
    <GlassPanel className="p-6 h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          {change && (
            <div className="flex items-center mt-1">
              <span
                className={cn(
                  "text-xs font-medium flex items-center",
                  change.positive ? "text-green-500" : "text-red-500"
                )}
              >
                {change.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {change.value}
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs. last month</span>
            </div>
          )}
        </div>
        <div className="rounded-full p-2 bg-brand-50 text-brand-500 dark:bg-brand-900/20 dark:text-brand-400">
          {icon}
        </div>
      </div>
    </GlassPanel>
  </FadeIn>
);

export const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Active Users"
        value="2,834"
        change={{ value: "12.3%", positive: true }}
        icon={<Users size={20} />}
        delay="100"
      />
      <StatCard
        title="Completion Rate"
        value="68.7%"
        change={{ value: "3.2%", positive: true }}
        icon={<Award size={20} />}
        delay="200"
      />
      <StatCard
        title="Engagement Score"
        value="7.9"
        change={{ value: "0.8%", positive: false }}
        icon={<Activity size={20} />}
        delay="300"
      />
      <StatCard
        title="Avg. Completion Time"
        value="5m 32s"
        change={{ value: "10.1%", positive: true }}
        icon={<Clock size={20} />}
        delay="400"
      />
    </div>
  );
};

export default DashboardStats;
