import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Index from "@/pages/Index";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import ApiDocs from "@/pages/ApiDocs";
import { Toaster } from "@/components/ui/toaster";

// Import the new encryption test page
import EncryptionTest from "@/pages/EncryptionTest";

// Import the new migration page
import MigrationPage from "@/pages/MigrationPage";

function App() {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/migration" element={<MigrationPage />} />
          <Route path="/encryption-test" element={<EncryptionTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
