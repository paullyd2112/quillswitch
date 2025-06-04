
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/contexts/auth";
import Index from "./pages/Index";
import ConnectionHub from "./pages/ConnectionHub";
import PlatformOverview from "./pages/PlatformOverview";
import ProductionMigrationPage from "./pages/ProductionMigrationPage";
import AutoConnectorPage from "./pages/AutoConnectorPage";
import IntegrationsPage from "./pages/Integrations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <ConnectionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/connections" element={<ConnectionHub />} />
                <Route path="/platform" element={<PlatformOverview />} />
                <Route path="/production-migration" element={<ProductionMigrationPage />} />
                <Route path="/auto-connector" element={<AutoConnectorPage />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ConnectionProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
