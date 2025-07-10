
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/auth";
import { ProcessingProvider } from "@/contexts/ProcessingContext";
import { RealtimeProvider } from "@/contexts/RealtimeContext";
import { UserOnboardingProvider } from "@/components/onboarding/UserOnboardingProvider";
import { LiveNotificationPanel } from "@/components/realtime/LiveNotificationPanel";
import NavigationOverlay from "@/components/layout/NavigationOverlay";
import SecurityHeaders from "@/components/security/SecurityHeaders";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Welcome from "@/pages/Welcome";
import PricingEstimator from "@/pages/PricingEstimator";
import Demo from "@/pages/Demo";
import Comparison from "@/pages/Comparison";
import Resources from "@/pages/Resources";
import ApiDocs from "@/pages/ApiDocs";
import AppRoutes from "@/pages/app/AppRoutes";
import ConnectionHub from "@/pages/ConnectionHub";
import MigrationPage from "@/pages/MigrationPage";
import OAuthCallback from "@/pages/OAuthCallback";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import NotFound from "@/pages/NotFound";

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

function AppContent() {
  // Initialize session timeout monitoring
  useSessionTimeout({
    warningMinutes: 5,
    timeoutMinutes: 30,
    enableWarnings: true
  });

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <SecurityHeaders />
      <NavigationOverlay />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/pricing" element={<PricingEstimator />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/api-docs" element={<ApiDocs />} />
        <Route path="/support" element={<Support />} />
        <Route path="/connections" element={<ConnectionHub />} />
        <Route path="/migration" element={<MigrationPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/app/*" element={<AppRoutes />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster />
      <LiveNotificationPanel />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <AuthProvider>
            <RealtimeProvider>
              <ProcessingProvider>
                <Router>
                  <UserOnboardingProvider>
                    <AppContent />
                  </UserOnboardingProvider>
                </Router>
              </ProcessingProvider>
            </RealtimeProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
