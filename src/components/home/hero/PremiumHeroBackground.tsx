
import React from "react";

const PremiumHeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Premium gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Animated neural network nodes */}
      <div className="absolute inset-0">
        {/* Primary network nodes */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60" />
        <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-40 left-1/4 w-2.5 h-2.5 bg-blue-300 rounded-full animate-pulse opacity-50" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-blue-600 rounded-full animate-pulse opacity-70" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-45" style={{ animationDelay: '2s' }} />
        
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <line x1="10%" y1="15%" x2="85%" y2="25%" stroke="url(#connectionGradient)" strokeWidth="1">
            <animate attributeName="stroke-opacity" values="0.1;0.6;0.1" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="25%" y1="80%" x2="70%" y2="50%" stroke="url(#connectionGradient)" strokeWidth="1">
            <animate attributeName="stroke-opacity" values="0.1;0.5;0.1" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="90%" y1="15%" x2="25%" y2="80%" stroke="url(#connectionGradient)" strokeWidth="0.5">
            <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="5s" repeatCount="indefinite" />
          </line>
        </svg>
      </div>
      
      {/* Premium floating orbs with sophisticated animations */}
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-gradient-to-l from-blue-600/15 to-indigo-500/8 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      
      {/* Sophisticated grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.5)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      {/* Ambient light effects */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-600/5 to-transparent" />
    </div>
  );
};

export default PremiumHeroBackground;
