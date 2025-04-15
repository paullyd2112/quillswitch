
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Index from "@/pages/Index";
import Features from "@/pages/Features";
import Welcome from "@/pages/Welcome";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import ApiDocs from "@/pages/ApiDocs";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Auth from "@/pages/Auth";
import { UserOnboardingProvider } from "@/components/onboarding/UserOnboardingProvider";

// Import the new pages
import EncryptionTestPage from "@/pages/EncryptionTest";
import MigrationPage from "@/pages/MigrationPage";

function App() {
  return (
    <AuthProvider>
      <UserOnboardingProvider>
        <ThemeProvider defaultTheme="dark" enableSystem>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<Features />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/api-docs" element={<ApiDocs />} />
              <Route path="/migration" element={<MigrationPage />} />
              <Route path="/encryption-test" element={<EncryptionTestPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/:mode" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </UserOnboardingProvider>
    </AuthProvider>
  );
}

export default App;
