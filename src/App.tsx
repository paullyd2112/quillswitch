
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ApiDocs from "./pages/ApiDocs";
import SetupWizard from "./pages/SetupWizard";
import MigrationsList from "./pages/MigrationsList";
import MigrationDashboard from "./pages/MigrationDashboard";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Reports from "./pages/Reports";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeArticle from "./pages/KnowledgeArticle";
import PricingEstimator from "./pages/PricingEstimator";
import { useState } from "react";

const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/setup" element={<SetupWizard />} />
            <Route path="/migrations" element={<MigrationsList />} />
            <Route path="/migrations/:projectId" element={<MigrationDashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/knowledge-base/:categoryId/:subcategoryId/:articleId" element={<KnowledgeArticle />} />
            <Route path="/pricing" element={<PricingEstimator />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
