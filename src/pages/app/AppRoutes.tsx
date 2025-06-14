
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import MigrationDashboard from '@/pages/MigrationDashboard';
import ConnectionHub from '@/pages/ConnectionHub';
import Settings from '@/pages/Settings';
import CredentialsVault from '@/pages/CredentialsVault';
import SetupWizard from '@/pages/SetupWizard';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/dashboard" element={<MigrationDashboard />} />
      <Route path="/connections" element={<ConnectionHub />} />
      <Route path="/vault" element={<CredentialsVault />} />
      <Route path="/setup" element={<SetupWizard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
