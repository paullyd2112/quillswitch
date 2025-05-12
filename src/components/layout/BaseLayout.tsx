
import React from "react";
import Navbar from "./Navbar";

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const BaseLayout = ({ children, className = "" }: BaseLayoutProps) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <Navbar />
      <div className="pt-24">
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;
