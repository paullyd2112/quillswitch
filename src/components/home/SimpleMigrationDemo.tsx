
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Play } from "lucide-react";

const SimpleMigrationDemo = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(85);

  // Auto-animate progress bar
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0; // Reset to start animation loop
          }
          return prev + 1;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const startDemo = () => {
    setIsAnimating(true);
    setProgress(0);
  };

  const stopDemo = () => {
    setIsAnimating(false);
    setProgress(85);
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background with grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 border border-primary/20 text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Migration Demo
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight leading-none">
            Seamless CRM Data Migration
            <span className="block bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              with AI
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Switch between CRMs effortlessly using secure OAuth authentication and intelligent API integrations. 
            Our AI-powered platform maps and migrates your valuable customer data with zero data loss and maximum accuracy.
          </p>
        </div>

        {/* Hero Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">
                Watch Your Data Move in Real-Time
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                Our platform provides complete transparency throughout the migration process. 
                See exactly how your contacts, deals, and company data transfers between CRM systems 
                with enterprise-grade security and validation.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={isAnimating ? stopDemo : startDemo}
                size="lg"
                className="group bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isAnimating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Stop Demo
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Start Demo Migration
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {[
                "Zero Data Loss Guarantee",
                "95% Faster Than Manual",
                "Enterprise Security",
                "No Technical Skills Needed"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Dashboard Mockup */}
          <div className="relative">
            <div className={`dashboard-mockup ${isAnimating ? 'animate-float' : ''}`}>
              <Card className="bg-white border-0 shadow-2xl transform perspective-1000 hover:scale-105 transition-transform duration-300">
                <CardContent className="p-8">
                  {/* Browser Header */}
                  <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>

                  {/* Migration Header */}
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Migration in Progress</h3>
                  
                  {/* CRM Flow */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg text-center font-semibold">
                      Salesforce
                    </div>
                    <div className="text-2xl text-blue-500 animate-pulse">
                      →
                    </div>
                    <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg text-center font-semibold">
                      HubSpot
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    {/* Overall Progress */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-700">Overall Progress</span>
                      <span className="font-bold text-green-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    {/* Data Types Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { name: "Contacts", count: "12,847", color: "bg-green-500" },
                        { name: "Opportunities", count: "3,142", color: "bg-blue-500" },
                        { name: "Accounts", count: "8,521", color: "bg-orange-500" },
                        { name: "Activities", count: "45,689", color: "bg-purple-500" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-2 h-2 ${item.color} rounded-full`}></div>
                          <span className="text-slate-700 text-sm font-medium">{item.name}</span>
                          <span className="text-slate-600 text-sm ml-auto">{item.count}</span>
                        </div>
                      ))}
                    </div>

                    {/* Success Message */}
                    <div className="flex items-center gap-2 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                      <span className="text-green-600">✅</span>
                      <span className="text-green-800 text-sm font-medium">
                        Data validation complete - No errors detected
                      </span>
                    </div>

                    {/* Status Footer */}
                    <div className="flex justify-between items-center mt-3 text-sm">
                      <span className="text-slate-600">Estimated completion: 3 min</span>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-600">
                          {isAnimating ? 'Syncing...' : 'Ready to sync'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-slate-400 text-lg mb-6">
            This demo shows a simplified version of our migration process
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Real-time validation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Automatic error handling</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Zero downtime guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Enterprise security</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleMigrationDemo;
