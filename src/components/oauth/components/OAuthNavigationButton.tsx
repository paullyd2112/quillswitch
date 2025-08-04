
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { OAuthStatus } from "../types";

interface OAuthNavigationButtonProps {
  status: OAuthStatus;
}

const OAuthNavigationButton: React.FC<OAuthNavigationButtonProps> = ({ status }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/app/connections");
  };

  if (status === "loading") {
    return null;
  }

  return (
    <Button
      onClick={handleNavigation}
      variant={status === "success" ? "default" : "outline"}
      className="mt-4"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {status === "success" ? "View Connections" : "Back to Connections"}
    </Button>
  );
};

export default OAuthNavigationButton;
