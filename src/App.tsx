
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
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
import PricingEstimator from './pages/PricingEstimator'
import AppErrorBoundary from './components/error-handling/AppErrorBoundary'

function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="quill-theme-mode">
        <TooltipProvider>
          <CookieConsentProvider>
            <BrowserRouter>
              <AuthProvider>
                <UserOnboardingProvider>
                  <Routes>
                    {/* Public pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/features" element={<Navigate to="/" replace />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/knowledge/:id" element={<KnowledgeArticle />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/demo" element={<Demo />} />
                    <Route path="/pricing" element={<PricingEstimator />} />

                    {/* Legacy routes - redirect to new structure */}
                    <Route path="/migrations/*" element={<Navigate to="/app/setup" replace />} />
                    <Route path="/connect/*" element={<Navigate to="/app/setup" replace />} />

                    {/* Protected routes with sidebar layout */}
                    <Route path="/app" element={
                      <AppErrorBoundary isolate>
                        <BaseLayout />
                      </AppErrorBoundary>
                    }>
                      <Route index element={<Navigate to="/app/setup" replace />} />
                      
                      {/* Main application routes */}
                      <Route path="setup" element={
                        <AppErrorBoundary isolate>
                          <MigrationSetup />
                        </AppErrorBoundary>
                      } />
                      <Route path="crm-connections" element={
                        <AppErrorBoundary isolate>
                          <CrmConnections />
                        </AppErrorBoundary>
                      } />
                      <Route path="credentials-vault" element={
                        <AppErrorBoundary isolate>
                          <CredentialsVault />
                        </AppErrorBoundary>
                      } />
                      <Route path="settings" element={
                        <AppErrorBoundary isolate>
                          <Settings />
                        </AppErrorBoundary>
                      } />
                      <Route path="support" element={
                        <AppErrorBoundary isolate>
                          <Support />
                        </AppErrorBoundary>
                      } />
                      
                      {/* Migration-specific routes */}
                      <Route path="migrations" element={<Navigate to="/app/setup" replace />} />
                      <Route path="migrations/:id" element={
                        <AppErrorBoundary isolate>
                          <MigrationDashboard />
                        </AppErrorBoundary>
                      } />
                      <Route path="connect" element={<Navigate to="/app/setup" replace />} />
                      
                      {/* OAuth callback route */}
                      <Route path="oauth/callback" element={
                        <AppErrorBoundary isolate>
                          <OAuthCallback />
                        </AppErrorBoundary>
                      } />
                    </Route>
                    
                    {/* Catch-all route for 404 errors */}
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
    </AppErrorBoundary>
  )
}

export default App
