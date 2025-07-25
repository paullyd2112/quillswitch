
import React from "react";
import { Routes, Route } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import Dashboard from "./Dashboard";
import ConnectionHub from "./ConnectionHub";
import CrmConnections from "./CrmConnections";
import Migrations from "./Migrations";
import CredentialsVault from "../CredentialsVault";
import SetupWizard from "../SetupWizard";
import Reports from "./Reports";
import Activity from "./Activity";
import Settings from "../Settings";
import MigrationDashboard from "../MigrationDashboard";
import CloudMigration from "../CloudMigration";

const AppRoutes = () => {
  return (
    <BaseLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="connections" element={<ConnectionHub />} />
        <Route path="migrations" element={<Migrations />} />
        <Route path="migrations/:id" element={<MigrationDashboard />} />
        <Route path="cloud-migration" element={<CloudMigration />} />
        <Route path="vault" element={<CredentialsVault />} />
        <Route path="setup" element={<SetupWizard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="activity" element={<Activity />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BaseLayout>
  );
};

export default AppRoutes;
