
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Play, Database } from "lucide-react";

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
            Watch Your CRM Data
            <span className="block bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Migrate in Real-Time
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            See exactly how QuillSwitch transfers your contacts, deals, and company data between CRM systems 
            with zero data loss and maximum accuracy.
          </p>
        </div>

        {/* Main Demo Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">
                Enterprise-Grade Migration in Action
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                Our platform provides complete transparency throughout the migration process. 
                Watch as your data moves securely between systems with real-time validation 
                and progress tracking.
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
                    Start Live Demo
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

          {/* Right Content - Enhanced Dashboard Mockup */}
          <div className="relative">
            <div className={`dashboard-mockup ${isAnimating ? 'animate-float' : ''}`}>
              {/* Browser Window */}
              <div className="bg-white rounded-xl shadow-2xl transform perspective-1000 hover:scale-105 transition-transform duration-300 overflow-hidden">
                {/* Browser Header */}
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded mx-4 px-3 py-1 text-sm text-gray-600">
                    app.quillswitch.com/migration/live
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6">
                  {/* Migration Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Live Migration Dashboard</h3>
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Active
                    </div>
                  </div>
                  
                  {/* CRM Systems Flow */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Database className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">Salesforce</div>
                          <div className="text-sm text-gray-600">Source CRM</div>
                        </div>
                      </div>
                      
                      <div className="flex-1 mx-6 relative">
                        <div className="h-0.5 bg-gray-300 relative">
                          <div 
                            className="h-0.5 bg-blue-500 transition-all duration-1000 ease-out relative"
                            style={{ width: `${progress}%` }}
                          >
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
                          {isAnimating ? 'Transferring...' : 'Ready to transfer'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Database className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">HubSpot</div>
                          <div className="text-sm text-gray-600">Destination CRM</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-4">
                    {/* Overall Progress */}
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Migration Progress</span>
                      <span className="font-bold text-green-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300 ease-out relative"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>

                    {/* Data Types Progress */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {[
                        { name: "Contacts", count: "12,847", color: "bg-green-500", progress: progress > 80 ? 100 : progress + 15 },
                        { name: "Opportunities", count: "3,142", color: "bg-blue-500", progress: progress > 60 ? 100 : progress + 25 },
                        { name: "Accounts", count: "8,521", color: "bg-orange-500", progress: progress > 70 ? 100 : progress + 10 },
                        { name: "Activities", count: "45,689", color: "bg-purple-500", progress: Math.max(0, progress - 20) }
                      ].map((item, index) => (
                        <div key={index} className="bg-white border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                              <span className="text-sm font-medium text-gray-700">{item.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">{item.count}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div 
                              className={`${item.color} h-1.5 rounded-full transition-all duration-500`}
                              style={{ width: `${Math.min(100, item.progress)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Status Messages */}
                    <div className="space-y-2 mt-6">
                      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800">Data validation complete - No errors detected</span>
                      </div>
                      
                      {isAnimating && (
                        <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-blue-800">Real-time sync in progress...</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Stats */}
                    <div className="flex justify-between items-center pt-4 border-t text-sm text-gray-600">
                      <span>Estimated completion: {isAnimating ? '2 min remaining' : '3 min'}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Speed: {isAnimating ? '1,247 records/sec' : 'Ready to sync'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center">
          <p className="text-slate-400 text-lg mb-6">
            This interactive demo shows our actual migration interface
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
