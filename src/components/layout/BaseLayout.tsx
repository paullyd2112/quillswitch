
import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface BaseLayoutProps {
  children?: ReactNode;
  className?: string;
}

const BaseLayout = ({ children, className = "" }: BaseLayoutProps) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <Navbar />
      <div className="pt-16 md:pt-24">
        {children || <Outlet />}
      </div>
      <Footer />
    </div>
  );
};

export default BaseLayout;
