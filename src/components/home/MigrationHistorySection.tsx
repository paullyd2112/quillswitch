
import React from "react";
import ContentSection from "@/components/layout/ContentSection";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, AlertTriangle, BarChart } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { useNavigate } from "react-router-dom";

const MigrationHistorySection = () => {
  const navigate = useNavigate();
  
  const migrations = [
    {
      id: "mig_482395",
      name: "Salesforce to HubSpot - Q1 Data",
      date: "Mar 15, 2025",
      status: "completed",
      records: "24,387",
      duration: "3h 42m"
    },
    {
      id: "mig_573928",
      name: "Zoho CRM to Pipedrive - Sales Team",
      date: "Feb 28, 2025",
      status: "completed",
      records: "12,846",
      duration: "1h 58m"
    },
    {
      id: "mig_691047",
      name: "Dynamics to Salesforce - Enterprise",
      date: "Feb 10, 2025",
      status: "completed",
      records: "46,129",
      duration: "6h 15m"
    },
    {
      id: "mig_735921",
      name: "HubSpot to Zoho - Marketing Data",
      date: "Jan 22, 2025",
      status: "failed",
      records: "8,567",
      duration: "45m"
    }
  ];
  
  return (
    <ContentSection className="py-24 bg-slate-50/50 dark:bg-slate-900/20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Migration History Timeline
            </h2>
            <p className="text-muted-foreground mb-6">
              View and analyze your past migrations with our interactive timeline. Track performance, identify trends, and optimize future migrations.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <BarChart className="h-5 w-5 text-brand-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Migration Analytics</h4>
                  <p className="text-sm text-muted-foreground">Track performance metrics and optimize future migrations</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Verification Reports</h4>
                  <p className="text-sm text-muted-foreground">Ensure data integrity with detailed verification reports</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Historical Comparisons</h4>
                  <p className="text-sm text-muted-foreground">Compare migration performance over time to track improvements</p>
                </div>
              </div>
            </div>
            
            <Button onClick={() => navigate("/migrations")} className="gap-2">
              <Calendar className="h-4 w-4" />
              View Migration History
            </Button>
          </FadeIn>
        </div>
        
        <div>
          <FadeIn delay="200">
            <div className="rounded-lg border shadow-md overflow-hidden">
              <div className="bg-brand-50 dark:bg-brand-900/20 p-4 border-b border-brand-100 dark:border-brand-800/30">
                <h3 className="font-semibold">Recent Migrations</h3>
              </div>
              
              <div className="divide-y">
                {migrations.map((migration) => (
                  <div key={migration.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{migration.name}</h4>
                      {migration.status === "completed" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" /> Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Failed
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{migration.date}</span>
                        </div>
                        <div className="flex">
                          <div className="mr-4">{migration.records} records</div>
                          <div>{migration.duration}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <Button variant="link" size="sm" className="h-auto p-0">
                        View details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-3 border-t bg-slate-50 dark:bg-slate-900/20">
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  View All Migrations
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </ContentSection>
  );
};

export default MigrationHistorySection;
