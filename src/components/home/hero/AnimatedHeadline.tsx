
import React, { useEffect, useState } from 'react';

const AnimatedHeadline: React.FC = () => {
  const [shimmerPosition, setShimmerPosition] = useState(-100);

  useEffect(() => {
    const interval = setInterval(() => {
      setShimmerPosition(prev => {
        if (prev >= 200) {
          return -100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-tight">
        <span className="block text-white mb-2 relative overflow-hidden">
          QuillSwitch
          <div 
            className="absolute top-0 left-0 w-full h-full opacity-30"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)`,
              transform: `translateX(${shimmerPosition}%)`,
              transition: 'transform 0.1s linear'
            }}
          />
        </span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-pulse">
          Powered by AI
        </span>
      </h1>
    </div>
  );
};

export default AnimatedHeadline;
