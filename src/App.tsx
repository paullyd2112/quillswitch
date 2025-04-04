
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

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

// Theme
import { ThemeProvider } from "@/components/ui/theme-provider";

// Protected Route Component
const ProtectedRoute = ({ isAuthenticated, children }: { isAuthenticated: boolean | null, children: JSX.Element }) => {
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for auth status
    const checkAuth = async () => {
      // In a real app, we'd check if the user is authenticated here
      const auth = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(auth);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Still checking auth status
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/migrations" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MigrationsList />
            </ProtectedRoute>
          } />
          <Route path="/migrations/:projectId" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MigrationDashboard />
            </ProtectedRoute>
          } />
          <Route path="/migrations/setup" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SetupWizard />
            </ProtectedRoute>
          } />
          <Route path="/migrations/enterprise-test" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EnterpriseMigrationTest />
            </ProtectedRoute>
          } />
          {/* Add redirect from /setup to /migrations/setup */}
          <Route path="/setup" element={<Navigate to="/migrations/setup" replace />} />
          <Route path="/auth/:mode" element={<Auth />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/knowledge-base/:categoryId/:subcategoryId/:articleId" element={<KnowledgeArticle />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<PricingEstimator />} />
          <Route path="/api-docs" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ApiDocs />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
