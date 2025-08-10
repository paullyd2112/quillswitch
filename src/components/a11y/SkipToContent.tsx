import React from "react";

const SkipToContent: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[1000] focus:px-3 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground"
  >
    Skip to content
  </a>
);

export default SkipToContent;
