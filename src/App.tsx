
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserOnboardingProvider } from '@/components/onboarding/UserOnboardingProvider';

// Import pages
import Index from '@/pages/Index';
import Features from '@/pages/Features';
import Resources from '@/pages/Resources';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import Migrations from '@/pages/MigrationsList';
import MigrationDashboard from '@/pages/MigrationDashboard';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Auth from '@/pages/Auth';
import ApiDocs from '@/pages/ApiDocs';
import Analytics from '@/pages/Analytics';
import Profile from '@/pages/Profile';
import ResetPassword from '@/pages/ResetPassword';
import SetupWizard from '@/pages/SetupWizard';
import KnowledgeBase from '@/pages/KnowledgeBase';
import KnowledgeArticle from '@/pages/KnowledgeArticle';
import PricingEstimator from '@/pages/PricingEstimator';
import EnterpriseMigrationTest from '@/pages/EnterpriseMigrationTest';
import Welcome from '@/pages/Welcome';

// Import utilities for cross-browser compatibility
import { applyCompatibilityClass } from '@/utils/browserCompatibility';

// Create QueryClient for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  // Apply compatibility classes on mount
  useEffect(() => {
    applyCompatibilityClass();
    
    // Add global error handling for uncaught exceptions
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
      event.preventDefault();
      // You could send to an error tracking service here
    };
    
    window.addEventListener('error', handleGlobalError);
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <BrowserRouter>
          <AuthProvider>
            <UserOnboardingProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/features" element={<Features />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/knowledge-base" element={<KnowledgeBase />} />
                <Route path="/knowledge-base/:articleId" element={<KnowledgeArticle />} />
                <Route path="/about" element={<About />} />
                <Route path="/migrations" element={<Migrations />} />
                <Route path="/migrations/:id" element={<MigrationDashboard />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/api-docs" element={<ApiDocs />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/setup" element={<SetupWizard />} />
                <Route path="/pricing" element={<PricingEstimator />} />
                <Route path="/enterprise-test" element={<EnterpriseMigrationTest />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Both toast systems for compatibility */}
              <Toaster />
              <SonnerToaster richColors position="top-right" />
            </UserOnboardingProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
