
import React, { createContext, useContext, useState, useEffect } from "react";
import WelcomeModal from "./WelcomeModal";
import OnboardingTour from "./OnboardingTour";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getOnboardingState, 
  markWelcomeSeen, 
  markTourCompleted, 
  shouldShowOnboarding 
} from "@/utils/onboardingUtils";

interface UserOnboardingContextType {
  showWelcome: () => void;
  showOnboardingTour: () => void;
  isNewUser: boolean;
}

const UserOnboardingContext = createContext<UserOnboardingContextType | undefined>(undefined);

export const UserOnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  
  // Check if user is new and should see onboarding
  useEffect(() => {
    if (user) {
      const shouldOnboard = shouldShowOnboarding();
      setIsNewUser(shouldOnboard);
      
      // If user should see onboarding and hasn't seen welcome, show welcome
      if (shouldOnboard && !getOnboardingState().hasSeenWelcome) {
        setShowWelcomeModal(true);
      }
    }
  }, [user]);
  
  const handleCloseWelcome = () => {
    setShowWelcomeModal(false);
    markWelcomeSeen();
  };
  
  const handleStartOnboarding = () => {
    setShowWelcomeModal(false);
    setShowTourModal(true);
    markWelcomeSeen();
  };
  
  const handleCloseTour = () => {
    setShowTourModal(false);
  };
  
  const handleCompleteTour = () => {
    setShowTourModal(false);
    markTourCompleted();
    setIsNewUser(false);
  };
  
  // Functions to manually trigger the modals
  const showWelcome = () => setShowWelcomeModal(true);
  const showOnboardingTour = () => setShowTourModal(true);
  
  return (
    <UserOnboardingContext.Provider 
      value={{ 
        showWelcome, 
        showOnboardingTour,
        isNewUser
      }}
    >
      {children}
      
      {user && (
        <>
          <WelcomeModal 
            isOpen={showWelcomeModal} 
            onClose={handleCloseWelcome} 
            onStartOnboarding={handleStartOnboarding} 
          />
          
          <OnboardingTour 
            isOpen={showTourModal}
            onClose={handleCloseTour}
            onComplete={handleCompleteTour}
          />
        </>
      )}
    </UserOnboardingContext.Provider>
  );
};

export const useUserOnboarding = () => {
  const context = useContext(UserOnboardingContext);
  if (context === undefined) {
    throw new Error("useUserOnboarding must be used within a UserOnboardingProvider");
  }
  return context;
};
