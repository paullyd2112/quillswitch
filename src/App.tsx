
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { ThemeProvider } from "@/components/ui/theme-provider";
import CommandPalette from "@/components/global/CommandPalette";
import { AuthProvider } from "@/contexts/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Home from "./pages/Home";
import QuillRevert from "./pages/QuillRevert";
import Auth from "./pages/Auth";
import Setup from "./pages/Setup";
import AppMigrations from "./pages/AppMigrations";
import MigrationDashboard from "./pages/MigrationDashboard";
import AppRoutes from "./pages/app/AppRoutes";
import CrmConnections from "./pages/CrmConnections";
import OAuthCallback from "./pages/OAuthCallback";
import Comparison from "./pages/Comparison";
import Demo from "./pages/Demo";
import Resources from "./pages/Resources";
import ApiDocs from "./pages/ApiDocs";
import Support from "./pages/Support";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeArticle from "./pages/KnowledgeArticle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>
        <TooltipProvider>
          <ThemeProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/crm-connections" element={
                  <ConnectionProvider>
                    <CrmConnections />
                  </ConnectionProvider>
                } />
                <Route path="/quill-revert" element={<QuillRevert />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />
                <Route path="/comparison" element={<Comparison />} />
                {/* Public site routes */}
                <Route path="/connections" element={<Navigate to="/crm-connections" replace />} />
                <Route path="/migrations/setup" element={<Navigate to="/app/setup" replace />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/pricing" element={<Navigate to="/comparison" replace />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/api-docs" element={<ApiDocs />} />
                <Route path="/support" element={<Support />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookies" element={<Navigate to="/privacy" replace />} />
                <Route path="/features" element={<Navigate to="/comparison" replace />} />
                <Route path="/knowledge-base" element={<KnowledgeBase />} />
                <Route path="/knowledge-base/:categoryId/:subcategoryId/:articleId" element={<KnowledgeArticle />} />
                <Route path="/pricing-estimator" element={<Navigate to="/comparison" replace />} />
                
                {/* App routes with auth guard */}
                <Route path="/app/*" element={
                  <ProtectedRoute>
                    <ConnectionProvider>
                      <Routes>
                        {/* Core app routes - candidates for future overhaul */}
                        <Route path="setup" element={<Setup />} />
                        <Route path="migrations" element={<AppMigrations />} />
                        <Route path="migrations/:id" element={<MigrationDashboard />} />
                        
                        {/* New app routes structure */}
                        <Route path="*" element={<AppRoutes />} />
                      </Routes>
                    </ConnectionProvider>
                  </ProtectedRoute>
                } />

                {/* 404 fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CommandPalette />
            </BrowserRouter>
          </ThemeProvider>
        </TooltipProvider>
      </AuthProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;
