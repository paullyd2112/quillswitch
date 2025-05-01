
import React from "react";

// Create a simple function to render system icons
export const SystemIcon = ({ initial, color }: { initial: string; color: string }) => (
  <span className={`text-${color} font-medium`}>{initial}</span>
);
