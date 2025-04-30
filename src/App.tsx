
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Features from './pages/Features'
import Resources from './pages/Resources'
import Auth from './pages/Auth'
import KnowledgeArticle from './pages/KnowledgeArticle'
import NotFound from './pages/NotFound'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './components/ui/theme-provider'
import { UserOnboardingProvider } from './components/onboarding/UserOnboardingProvider'
import GeminiChat from './pages/GeminiChat'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="quill-theme-mode">
      <BrowserRouter>
        <AuthProvider>
          <UserOnboardingProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<Features />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/knowledge/:id" element={<KnowledgeArticle />} />
              <Route path="/ai-chat" element={<GeminiChat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UserOnboardingProvider>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-right" />
    </ThemeProvider>
  )
}

export default App
