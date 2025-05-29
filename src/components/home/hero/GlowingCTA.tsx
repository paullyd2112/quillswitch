
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface GlowingCTAProps {
  onClick: () => void;
  children: React.ReactNode;
}

const GlowingCTA: React.FC<GlowingCTAProps> = ({ onClick, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <Button
        size="lg"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative px-12 py-6 text-lg font-semibold bg-primary text-white
          transform transition-all duration-300 ease-out
          hover:scale-105 hover:shadow-2xl
          ${isHovered ? 'shadow-glow-primary' : ''}
        `}
        style={{
          background: isHovered 
            ? 'linear-gradient(45deg, #0070f3, #00a1ff, #0070f3)'
            : 'linear-gradient(45deg, #0070f3, #0088ff)',
          backgroundSize: '200% 200%',
          animation: isHovered ? 'gradient-shift 2s ease infinite' : 'breathing 3s ease-in-out infinite'
        }}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
          <ArrowRight 
            size={20} 
            className={`transform transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
          />
        </span>
        
        {/* Breathing glow effect */}
        <div 
          className="absolute inset-0 rounded-lg opacity-50 blur-xl"
          style={{
            background: 'linear-gradient(45deg, #0070f3, #00a1ff)',
            animation: 'breathing 3s ease-in-out infinite'
          }}
        />
      </Button>
      
      <style jsx>{`
        @keyframes breathing {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default GlowingCTA;
