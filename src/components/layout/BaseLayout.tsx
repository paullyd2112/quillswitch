
import React from "react";

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const BaseLayout = ({ children, className = "" }: BaseLayoutProps) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <div className="pt-8">
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;
