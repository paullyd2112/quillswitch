
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <TooltipProvider>
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
            {/* Redirect broken routes to working destinations */}
            <Route path="/connections" element={<Navigate to="/crm-connections" replace />} />
            <Route path="/migrations/setup" element={<Navigate to="/app/setup" replace />} />
            <Route path="/demo" element={<Navigate to="/" replace />} />
            <Route path="/pricing" element={<Navigate to="/" replace />} />
            <Route path="/resources" element={<Navigate to="/" replace />} />
            <Route path="/api-docs" element={<Navigate to="/" replace />} />
            <Route path="/support" element={<Navigate to="/" replace />} />
            <Route path="/about" element={<Navigate to="/" replace />} />
            <Route path="/privacy" element={<Navigate to="/" replace />} />
            <Route path="/terms" element={<Navigate to="/" replace />} />
            <Route path="/cookies" element={<Navigate to="/" replace />} />
            <Route path="/features" element={<Navigate to="/comparison" replace />} />
            <Route path="/knowledge-base" element={<Navigate to="/" replace />} />
            <Route path="/knowledge-base/*" element={<Navigate to="/" replace />} />
            <Route path="/pricing-estimator" element={<Navigate to="/comparison" replace />} />
            
            {/* App routes wrapped with ConnectionProvider */}
            <Route path="/app/*" element={
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
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;
