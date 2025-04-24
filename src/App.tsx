
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MigrationPage from './pages/MigrationPage';
import SetupWizard from './pages/SetupWizard';
import DataExtraction from './pages/DataExtraction';
import ServiceCredentialVault from './components/vault/ServiceCredentialVault';
import Welcome from './pages/Welcome';
import Analytics from './pages/Analytics';
import ApiDocs from './pages/ApiDocs';
import Auth from './pages/Auth';
import About from './pages/About';
import Features from './pages/Features';
import KnowledgeBase from './pages/KnowledgeBase';
import KnowledgeArticle from './pages/KnowledgeArticle';
import MigrationDashboard from './pages/MigrationDashboard';
import MigrationsList from './pages/MigrationsList';
import NotFound from './pages/NotFound';
import PricingEstimator from './pages/PricingEstimator';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Resources from './pages/Resources';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import EnterpriseMigrationTest from './pages/EnterpriseMigrationTest';
import LandingPage from './pages/Index';
import Integrations from './pages/Integrations';
import { UserOnboardingProvider } from './components/onboarding/UserOnboardingProvider';
import { AuthProvider } from './contexts/auth';

function App() {
  return (
    <AuthProvider>
      <UserOnboardingProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/setup" element={<SetupWizard />} />
            <Route path="/migration" element={<MigrationPage />} />
            <Route path="/migrations" element={<MigrationsList />} />
            <Route path="/migrations/:id" element={<MigrationDashboard />} />
            <Route path="/data-extraction" element={<DataExtraction />} />
            <Route path="/vault" element={<ServiceCredentialVault />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/auth/*" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/knowledge-base/:categoryId/:subcategoryId/:articleId" element={<KnowledgeArticle />} />
            <Route path="/pricing" element={<PricingEstimator />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/enterprise-test" element={<EnterpriseMigrationTest />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </UserOnboardingProvider>
    </AuthProvider>
  );
}

export default App;
