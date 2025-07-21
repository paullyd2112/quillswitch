
import React, { useState, Suspense, lazy } from 'react';
import { MessageCircle } from 'lucide-react';

// Lazy load the actual chatbot component
const LandingChatbot = lazy(() => import('./LandingChatbot'));

const LazyLandingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Lazy-loaded chatbot */}
      {isOpen && (
        <Suspense fallback={<div className="fixed bottom-20 right-6 w-80 h-96 bg-slate-900 rounded-lg shadow-xl animate-pulse" />}>
          <LandingChatbot />
        </Suspense>
      )}
    </>
  );
};

export default LazyLandingChatbot;
