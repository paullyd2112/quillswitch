
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { initializeSentry } from '@/services/sentry/sentryConfig';
import './index.css';

// Initialize Sentry before rendering the app
initializeSentry();

// Make sure we have a root element to mount to
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(<App />);
