
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import AppLayout from '@/components/layout/AppLayout'; // Import AppLayout
import MigrationDashboard from '@/pages/MigrationDashboard';
import ConnectionHub from '@/pages/ConnectionHub';
import Settings from '@/pages/Settings';
import CredentialsVault from '@/pages/CredentialsVault';
import SetupWizard from '@/pages/SetupWizard'; // SetupWizard has its own layout

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Routes>
      {/* Routes that use AppLayout */}
      <Route 
        path="dashboard" 
        element={<AppLayout><MigrationDashboard /></AppLayout>} 
      />
      <Route 
        path="connections" 
        element={<AppLayout><ConnectionHub /></AppLayout>} 
      />
      <Route 
        path="vault" 
        element={<AppLayout><CredentialsVault /></AppLayout>} 
      />
      <Route 
        path="settings" 
        element={<AppLayout><Settings /></AppLayout>} 
      />
      
      {/* SetupWizard uses its own full-page layout, so no AppLayout here */}
      <Route path="setup" element={<SetupWizard />} />

      {/* Default redirect for /app and any unmatched /app/* routes */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
