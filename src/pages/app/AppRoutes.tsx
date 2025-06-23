
import React from "react";
import { Routes, Route } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import Dashboard from "./Dashboard";
import ConnectionHub from "./ConnectionHub";
import Migrations from "./Migrations";
import CredentialsVault from "../CredentialsVault";

const AppRoutes = () => {
  return (
    <BaseLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="connections" element={<ConnectionHub />} />
        <Route path="migrations" element={<Migrations />} />
        <Route path="vault" element={<CredentialsVault />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BaseLayout>
  );
};

export default AppRoutes;
