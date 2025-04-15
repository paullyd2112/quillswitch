
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Index from "@/pages/Index";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import ApiDocs from "@/pages/ApiDocs";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Auth from "@/pages/Auth";

// Import the new encryption test page
import EncryptionTest from "@/pages/EncryptionTest";

// Import the new migration page
import MigrationPage from "@/pages/MigrationsList";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" enableSystem>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/migration" element={<MigrationPage />} />
            <Route path="/encryption-test" element={<EncryptionTest />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/:mode" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
