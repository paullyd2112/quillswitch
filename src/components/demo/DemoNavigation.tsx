import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUp, Users, BarChart3, Play } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'realtime-collaboration',
    label: 'Real-Time Collaboration',
    icon: <Users className="h-4 w-4" />,
    description: 'Live user presence and collaboration'
  },
  {
    id: 'migration-visualizer',
    label: 'Migration Visualizer',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'AI-powered migration engine'
  },
  {
    id: 'try-it-experience',
    label: 'Try It Yourself',
    icon: <Play className="h-4 w-4" />,
    description: 'Interactive migration simulation'
  }
];

export const DemoNavigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 400);

      // Update active section based on scroll position
      const sections = navigationItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      const currentSection = sections.find(({ element }) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const top = element.offsetTop - 80; // Account for fixed header
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Fixed Navigation Menu */}
      <Card className="fixed right-6 top-1/2 -translate-y-1/2 z-50 glass-panel border-primary/20 hidden lg:block">
        <div className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              size="sm"
              onClick={() => scrollToSection(item.id)}
              className={`w-full justify-start gap-2 text-left transition-all duration-200 ${
                activeSection === item.id 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-primary/10 hover:text-primary'
              }`}
              title={item.description}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 right-6 z-50 glass-panel border-primary/20 hover:border-primary/40 animate-fade-in"
          title="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}

      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-secondary/20 z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(100, (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%`
          }}
        />
      </div>
    </>
  );
};

export default DemoNavigation;