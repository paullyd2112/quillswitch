
/**
 * Utility functions for managing user onboarding state
 */

const ONBOARDING_STORAGE_KEY = 'quillswitch-onboarding-state';

interface OnboardingState {
  hasSeenWelcome: boolean;
  hasCompletedTour: boolean;
  lastStep: number;
  completedSteps: string[];
  hasSetUpProfile: boolean;
  dismissedUntil?: string; // ISO date string
}

const defaultState: OnboardingState = {
  hasSeenWelcome: false,
  hasCompletedTour: false,
  lastStep: 0,
  completedSteps: [],
  hasSetUpProfile: false,
};

/**
 * Get the current onboarding state from localStorage
 */
export const getOnboardingState = (): OnboardingState => {
  try {
    const storedState = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (storedState) {
      return JSON.parse(storedState);
    }
  } catch (error) {
    console.error("Error reading onboarding state:", error);
  }
  
  return defaultState;
};

/**
 * Save onboarding state to localStorage
 */
export const saveOnboardingState = (state: Partial<OnboardingState>): void => {
  try {
    const currentState = getOnboardingState();
    const updatedState = { ...currentState, ...state };
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(updatedState));
  } catch (error) {
    console.error("Error saving onboarding state:", error);
  }
};

/**
 * Mark the welcome modal as seen
 */
export const markWelcomeSeen = (): void => {
  saveOnboardingState({ hasSeenWelcome: true });
};

/**
 * Mark the onboarding tour as completed
 */
export const markTourCompleted = (): void => {
  saveOnboardingState({ 
    hasCompletedTour: true, 
    lastStep: 100 // Using 100 to indicate fully completed
  });
};

/**
 * Complete a specific onboarding step
 */
export const completeStep = (stepId: string): void => {
  const state = getOnboardingState();
  if (!state.completedSteps.includes(stepId)) {
    saveOnboardingState({
      completedSteps: [...state.completedSteps, stepId]
    });
  }
};

/**
 * Set the last viewed step
 */
export const setLastStep = (stepIndex: number): void => {
  saveOnboardingState({ lastStep: stepIndex });
};

/**
 * Reset the onboarding state (for testing or re-onboarding)
 */
export const resetOnboardingState = (): void => {
  localStorage.removeItem(ONBOARDING_STORAGE_KEY);
};

/**
 * Check if a user is new and should see onboarding
 */
export const shouldShowOnboarding = (): boolean => {
  const state = getOnboardingState();
  
  // If we previously dismissed until a future date
  if (state.dismissedUntil) {
    const dismissedUntil = new Date(state.dismissedUntil);
    if (dismissedUntil > new Date()) {
      return false;
    }
  }
  
  return !state.hasSeenWelcome || !state.hasCompletedTour;
};

/**
 * Dismiss onboarding for a period of time
 */
export const dismissOnboardingFor = (days: number): void => {
  const dismissUntil = new Date();
  dismissUntil.setDate(dismissUntil.getDate() + days);
  
  saveOnboardingState({
    dismissedUntil: dismissUntil.toISOString()
  });
};
