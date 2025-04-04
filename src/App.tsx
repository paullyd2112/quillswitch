
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Import pages
import Index from "./pages/Index";
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
          <Route path="/migrations" element={<MigrationsList />} />
          <Route path="/migrations/:projectId" element={<MigrationDashboard />} />
          <Route path="/migrations/setup" element={<SetupWizard />} />
          <Route path="/migrations/enterprise-test" element={<EnterpriseMigrationTest />} />
          {/* Add redirect from /setup to /migrations/setup */}
          <Route path="/setup" element={<Navigate to="/migrations/setup" replace />} />
          <Route path="/auth/:mode" element={<Auth />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/knowledge-base/:articleId" element={<KnowledgeArticle />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<PricingEstimator />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
