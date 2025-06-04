
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import AppErrorBoundary from "@/components/error-handling/AppErrorBoundary";
import CookieConsentBanner from "@/components/gdpr/CookieConsentBanner";

// Page imports
import Home from "@/pages/Home";
import Demo from "@/pages/Demo";
import About from "@/pages/About";
import Auth from "@/pages/Auth";
import ApiDocs from "@/pages/ApiDocs";
import SetupWizard from "@/pages/SetupWizard";
import MigrationSetup from "@/pages/MigrationSetup";
import MigrationChat from "@/pages/MigrationChat";
import MigrationDashboard from "@/pages/MigrationDashboard";
import Security from "@/pages/Security";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { UserOnboardingProvider } from "@/components/onboarding/UserOnboardingProvider";
import { LoadingFallback } from "@/components/pages/migration";
import ProgressIndicator from "@/components/connection-hub/ProgressIndicator";

const queryClient = new QueryClient();

function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="quillswitch-theme">
          <CookieConsentProvider>
            <AuthProvider>
              <Router>
                <div className="min-h-screen bg-background text-foreground">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/demo" element={<Demo />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/api-docs" element={<ApiDocs />} />
                    <Route path="/app/setup" element={<SetupWizard />} />
                    <Route path="/app/migration-setup" element={<MigrationSetup />} />
                    <Route path="/app/migration-chat" element={<MigrationChat />} />
                    <Route path="/app/migrations/:id" element={<MigrationDashboard />} />
                    <Route path="/app/security" element={<Security />} />
                    <Route path="/app/migrations" element={
                      <ConnectionProvider>
                        <UserOnboardingProvider>
                          <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
                            <div className="container px-4 pt-8 pb-20">
                              <h1 className="text-3xl font-bold mb-6">Migrations</h1>
                              <ProgressIndicator />
                              <LoadingFallback />
                            </div>
                          </div>
                        </UserOnboardingProvider>
                      </ConnectionProvider>
                    } />
                  </Routes>
                  <CookieConsentBanner />
                </div>
              </Router>
            </AuthProvider>
          </CookieConsentProvider>
        </ThemeProvider>
        <Toaster />
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
