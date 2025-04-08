import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import Index from "@/pages/Index"
import Auth from "@/pages/Auth"
import ResetPassword from "@/pages/ResetPassword"
import Features from "@/pages/Features"
import PricingEstimator from "@/pages/PricingEstimator"
import About from "@/pages/About"
import ApiDocs from "@/pages/ApiDocs"
import Resources from "@/pages/Resources"
import KnowledgeBase from "@/pages/KnowledgeBase"
import KnowledgeArticle from "@/pages/KnowledgeArticle"
import SetupWizard from "@/pages/SetupWizard"
import MigrationsList from "@/pages/MigrationsList"
import MigrationDashboard from "@/pages/MigrationDashboard"
import Welcome from "@/pages/Welcome"
import Analytics from "@/pages/Analytics"
import Reports from "@/pages/Reports"
import Profile from "@/pages/Profile"
import Settings from "@/pages/Settings"
import NotFound from "@/pages/NotFound"
import EnterpriseMigrationTest from "@/pages/EnterpriseMigrationTest"
import AssessmentTool from "@/pages/AssessmentTool";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<PricingEstimator />} />
          <Route path="/about" element={<About />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/knowledge-base/:categoryId/:subcategoryId/:articleId" element={<KnowledgeArticle />} />
          <Route path="/assessment-tool" element={<AssessmentTool />} />
          <Route path="/migrations/setup" element={<SetupWizard />} />
          <Route path="/migrations" element={<MigrationsList />} />
          <Route path="/migrations/:projectId" element={<MigrationDashboard />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/enterprise-test" element={<EnterpriseMigrationTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}
