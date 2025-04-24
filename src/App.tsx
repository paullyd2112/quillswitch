import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MigrationPage from './pages/MigrationPage';
import SetupWizard from './pages/SetupWizard';
import DataExtraction from './pages/DataExtraction';
import ServiceCredentialVault from './components/vault/ServiceCredentialVault';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SetupWizard />} />
        <Route path="/migration" element={<MigrationPage />} />
        <Route path="/data-extraction" element={<DataExtraction />} />
        <Route path="/vault" element={<ServiceCredentialVault />} />
      </Routes>
    </Router>
  );
}

export default App;
