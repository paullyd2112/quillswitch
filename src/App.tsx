
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthProvider } from "@/contexts/AuthContext";

// Import pages
import Index from "./pages/Index";
import Features from "./pages/Features";
import MigrationsList from "./pages/MigrationsList";
import MigrationDashboard from "./pages/MigrationDashboard";
import SetupWizard from "./pages/SetupWizard";
import EnterpriseMigrationTest from "./pages/EnterpriseMigrationTest";
import Auth from "./pages/Auth";
import Resources from "./pages/Resources";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeArticle from "./pages/KnowledgeArticle";
import About from "./pages/About";
import PricingEstimator from "./pages/PricingEstimator";
import ApiDocs from "./pages/ApiDocs";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";

// Theme
import { ThemeProvider } from "@/components/ui/theme-provider";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    // First check localStorage for a quick answer
    const storedAuth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(storedAuth === "true");
    
    // Then verify with actual session check
    checkAuth();
  }, []);
  
  if (isAuthenticated === null) {
    // Still checking auth status
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/migrations" element={
              <ProtectedRoute>
                <MigrationsList />
              </ProtectedRoute>
            } />
            <Route path="/migrations/:projectId" element={
              <ProtectedRoute>
                <MigrationDashboard />
              </ProtectedRoute>
            } />
            <Route path="/migrations/setup" element={
              <ProtectedRoute>
                <SetupWizard />
              </ProtectedRoute>
            } />
            <Route path="/migrations/enterprise-test" element={
              <ProtectedRoute>
                <EnterpriseMigrationTest />
              </ProtectedRoute>
            } />
            {/* Add redirect from /setup to /migrations/setup */}
            <Route path="/setup" element={<Navigate to="/migrations/setup" replace />} />
            <Route path="/auth/:mode" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/knowledge-base/:categoryId/:subcategoryId/:articleId" element={<KnowledgeArticle />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<PricingEstimator />} />
            <Route path="/api-docs" element={
              <ProtectedRoute>
                <ApiDocs />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
