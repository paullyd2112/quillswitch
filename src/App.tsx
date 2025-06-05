
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
import Security from "@/pages/Security";
import SetupWizard from "@/pages/SetupWizard";
import MigrationSetup from "@/pages/MigrationSetup";
import MigrationChat from "@/pages/MigrationChat";

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
                    <Route path="/app/security" element={<Security />} />
                    <Route path="/app/setup" element={<SetupWizard />} />
                    <Route path="/setup-wizard" element={<SetupWizard />} />
                    <Route path="/app/migration-setup" element={<MigrationSetup />} />
                    <Route path="/app/migration-chat" element={<MigrationChat />} />
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
