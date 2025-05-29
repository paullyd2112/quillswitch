
import React from "react";

const DemoHeader = () => {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 border border-primary/20 text-primary">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        Live Migration Demo
      </div>
      
      <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight leading-none">
        Watch Your CRM Data
        <span className="block bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          Migrate in Real-Time
        </span>
      </h2>
      
      <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
        See exactly how QuillSwitch transfers your contacts, deals, and company data between CRM systems 
        with zero data loss and maximum accuracy.
      </p>
    </div>
  );
};

export default DemoHeader;
