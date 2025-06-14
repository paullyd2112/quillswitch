
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/auth";
import { ProcessingProvider } from "@/contexts/ProcessingContext";
import NavigationOverlay from "@/components/layout/NavigationOverlay";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Welcome from "@/pages/Welcome"; // Added import for Welcome page
import PricingEstimator from "@/pages/PricingEstimator";
import Demo from "@/pages/Demo";
import Resources from "@/pages/Resources";
import ApiDocs from "@/pages/ApiDocs";
import AppRoutes from "@/pages/app/AppRoutes";
import OAuthCallback from "@/pages/OAuthCallback";

import "./App.css";

const queryClient = new QueryClient();

// Create a simple Support page component
const Support = () => (
  <div className="min-h-screen bg-background p-6">
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Support</h1>
      <p className="text-muted-foreground">Support page content coming soon.</p>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <AuthProvider>
            <ProcessingProvider>
              <Router>
                <div className="min-h-screen bg-background font-sans antialiased">
                  {/* Navigation overlay for processing states */}
                  <NavigationOverlay />
                  
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/welcome" element={<Welcome />} /> {/* Added route for Welcome page */}
                    <Route path="/pricing" element={<PricingEstimator />} />
                    <Route path="/demo" element={<Demo />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/api-docs" element={<ApiDocs />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/app/*" element={<AppRoutes />} />
                    <Route path="/oauth/callback" element={<OAuthCallback />} />
                  </Routes>
                </div>
                <Toaster />
              </Router>
            </ProcessingProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
