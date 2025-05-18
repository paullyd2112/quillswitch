
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Features from './pages/Features'
import Resources from './pages/Resources'
import Auth from './pages/Auth'
import KnowledgeArticle from './pages/KnowledgeArticle'
import NotFound from './pages/NotFound'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/auth'
import { ThemeProvider } from './components/ui/theme-provider'
import { UserOnboardingProvider } from './components/onboarding/UserOnboardingProvider'
import { CookieConsentProvider } from './contexts/CookieConsentContext'
import CookieConsentBanner from './components/gdpr/CookieConsentBanner'
import Settings from './pages/Settings'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import MigrationDashboard from './pages/MigrationDashboard'
import { TooltipProvider } from './components/ui/tooltip'
import CredentialsVault from './pages/CredentialsVault'
import Support from './pages/Support'
import Demo from './pages/Demo'
import BaseLayout from './components/layout/BaseLayout'
import MigrationSetup from './pages/MigrationSetup'
import CrmConnections from './pages/CrmConnections'
import OAuthCallback from './components/oauth/OAuthCallback'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="quill-theme-mode">
      <TooltipProvider>
        <CookieConsentProvider>
          <BrowserRouter>
            <AuthProvider>
              <UserOnboardingProvider>
                <Routes>
                  {/* Public pages */}
                  <Route path="/" element={<Home />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/knowledge/:id" element={<KnowledgeArticle />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/demo" element={<Demo />} />

                  {/* Protected routes with sidebar layout */}
                  <Route path="/app" element={<BaseLayout />}>
                    <Route index element={<Navigate to="/app/setup" replace />} />
                    
                    {/* Redirect /app/migrations to /app/setup */}
                    <Route path="migrations" element={<Navigate to="/app/setup" replace />} />
                    
                    {/* Keep the migration dashboard (for viewing existing migrations) */}
                    <Route path="migrations/:id" element={<MigrationDashboard />} />
                    
                    {/* Redirect /app/connect to /app/setup */}
                    <Route path="connect" element={<Navigate to="/app/setup" replace />} />
                    
                    <Route path="setup" element={<MigrationSetup />} />
                    <Route path="credentials-vault" element={<CredentialsVault />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="support" element={<Support />} />
                    
                    {/* New CRM connections route */}
                    <Route path="crm-connections" element={<CrmConnections />} />
                    
                    {/* OAuth callback route */}
                    <Route path="oauth/callback" element={<OAuthCallback />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </UserOnboardingProvider>
            </AuthProvider>
          </BrowserRouter>
          <CookieConsentBanner />
          <Toaster position="top-right" />
        </CookieConsentProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
