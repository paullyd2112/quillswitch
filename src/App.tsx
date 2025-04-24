import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import Index from "@/pages/Index";
import PricingPage from "@/pages/PricingPage";
import FeaturesPage from "@/pages/FeaturesPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ApiReference from "@/pages/ApiReference";
import Auth from "@/pages/Auth";
import Welcome from "@/pages/Welcome";
import SetupWizard from "@/pages/SetupWizard";
import MigrationPage from "@/pages/MigrationPage";
import MigrationDashboard from "@/pages/MigrationDashboard";
import { useAuth } from "@/contexts/auth";
import { UserOnboarding } from "@/components/onboarding/UserOnboarding";
import DataLoading from "@/pages/DataLoading";

const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <Index />
      },
      {
        path: "/pricing",
        element: <PricingPage />,
      },
      {
        path: "/features",
        element: <FeaturesPage />,
      },
      {
        path: "/resources",
        element: <ResourcesPage />,
      },
      {
        path: "/api",
        element: <ApiReference />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/welcome",
        element: <Welcome />,
      },
      {
        path: "/migrations/setup",
        element: <SetupWizard />,
      },
      {
        path: "/migrations/:id",
        element: <MigrationDashboard />,
      },
      {
        path: "/migration",
        element: <MigrationPage />,
      },
      {
        path: "/data-loading",
        element: <DataLoading />
      },
    ]
  }
]);

function App() {
  const { isLoading } = useAuth();

  // Show a loading indicator while the auth state is being determined
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <RouterProvider router={router} />
      <UserOnboarding />
    </>
  );
}

export default App;
