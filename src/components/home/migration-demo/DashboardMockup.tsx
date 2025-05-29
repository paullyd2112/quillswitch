
import React from "react";
import { Database, CheckCircle } from "lucide-react";

interface DashboardMockupProps {
  isAnimating: boolean;
  progress: number;
}

const DashboardMockup = ({ isAnimating, progress }: DashboardMockupProps) => {
  return (
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
  );
};

export default DashboardMockup;
