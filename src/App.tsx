
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import ApiDocs from "./pages/ApiDocs";
import SetupWizard from "./pages/SetupWizard";
import MigrationsList from "./pages/MigrationsList";
import MigrationDashboard from "./pages/MigrationDashboard";
import Analytics from "./pages/Analytics";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route 
              path="/auth" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Auth />
                </ProtectedRoute>
              } 
            />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route 
              path="/setup" 
              element={
                <ProtectedRoute>
                  <SetupWizard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/migrations" 
              element={
                <ProtectedRoute>
                  <MigrationsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/migrations/:projectId" 
              element={
                <ProtectedRoute>
                  <MigrationDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
