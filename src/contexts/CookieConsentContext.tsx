
import React, { createContext, useContext, useState, useEffect } from "react";

type ConsentStatus = {
  necessary: boolean; // Always true, can't be changed
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  hasResponded: boolean; // Whether user has made a choice
};

interface CookieConsentContextType {
  consentStatus: ConsentStatus;
  updateConsent: (newStatus: Partial<ConsentStatus>) => void;
  resetConsent: () => void;
}

const defaultConsent: ConsentStatus = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
  hasResponded: false,
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(() => {
    // Try to load saved consent from localStorage
    const savedConsent = localStorage.getItem("cookie-consent");
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        return { ...defaultConsent, ...parsed, necessary: true };
      } catch (e) {
        console.error("Error parsing saved cookie consent", e);
      }
    }
    return defaultConsent;
  });

  // Save to localStorage whenever consent changes
  useEffect(() => {
    if (consentStatus.hasResponded) {
      localStorage.setItem("cookie-consent", JSON.stringify(consentStatus));
    }
  }, [consentStatus]);

  const updateConsent = (newStatus: Partial<ConsentStatus>) => {
    setConsentStatus(prev => ({
      ...prev,
      ...newStatus,
      necessary: true, // Always keep necessary cookies enabled
      hasResponded: true,
    }));
  };

  const resetConsent = () => {
    localStorage.removeItem("cookie-consent");
    setConsentStatus(defaultConsent);
  };

  return (
    <CookieConsentContext.Provider value={{ consentStatus, updateConsent, resetConsent }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
};
