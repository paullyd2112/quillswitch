
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/auth/AuthProvider';
import BaseLayout from "@/components/layout/BaseLayout";
import Index from "@/pages/Index";
import PricingPage from "@/pages/PricingPage";
import FeaturesPage from "@/pages/FeaturesPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ApiReference from "@/pages/ApiReference";
import Auth from "@/pages/Auth";
import Welcome from "@/pages/Welcome";
import SetupWizard from "@/pages/SetupWizard";
import MigrationPage from "@/pages/MigrationPage";
import MigrationDashboard from "@/pages/MigrationDashboard";
import { UserOnboarding } from "@/components/onboarding/UserOnboarding";
import DataLoading from "@/pages/DataLoading";

function App() {
  return (
    <Router>
      <AuthProvider>
        <BaseLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/api" element={<ApiReference />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/migrations/setup" element={<SetupWizard />} />
            <Route path="/migrations/:id" element={<MigrationDashboard />} />
            <Route path="/migration" element={<MigrationPage />} />
            <Route path="/data-loading" element={<DataLoading />} />
          </Routes>
        </BaseLayout>
        <UserOnboarding />
      </AuthProvider>
    </Router>
  );
}

export default App;
