
import React from "react";

const EnhancedAnimatedHeadline = () => {
  return (
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
      {/* First line with sophisticated gradient */}
      <span className="block bg-gradient-to-r from-white via-blue-100 to-slate-200 bg-clip-text text-transparent mb-2 animate-fade-in">
        Enterprise CRM Migration
      </span>
      
      {/* Second line with animated gradient and shimmer effect */}
      <span className="block relative overflow-hidden">
        <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          Reimagined by AI
        </span>
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer" />
      </span>
      
      {/* Subtle accent line */}
      <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mt-6 rounded-full animate-fade-in opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }} />
    </h1>
  );
};

export default EnhancedAnimatedHeadline;
