
import { useState } from "react";
import { ServiceCredential } from "@/components/vault/types";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";

export const useCredentialForm = (onAdd: (credential: ServiceCredential) => Promise<void>, onCancel: () => void) => {
  const { user } = useAuth();
  const [expiry, setExpiry] = useState<string>('never');
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [formData, setFormData] = useState<ServiceCredential>({
    service_name: '',
    credential_name: '',
    credential_type: 'api_key',
    credential_value: '',
    environment: 'development',
    expires_at: null,
    user_id: user?.id || '',
    tags: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleExpiryChange = (value: string) => {
    setExpiry(value);
    
    if (value === 'never') {
      setFormData(prev => ({ ...prev, expires_at: null }));
      setShowExpiryWarning(false);
    } else if (value === 'custom') {
      setShowExpiryWarning(false);
    } else {
      const now = new Date();
      let expiryDate = new Date(now);
      
      switch (value) {
        case '30days':
          expiryDate.setDate(now.getDate() + 30);
          break;
        case '60days':
          expiryDate.setDate(now.getDate() + 60);
          break;
        case '90days':
          expiryDate.setDate(now.getDate() + 90);
          break;
        case '1year':
          expiryDate.setFullYear(now.getFullYear() + 1);
          break;
      }
      
      setFormData(prev => ({
        ...prev,
        expires_at: expiryDate.toISOString()
      }));
      
      if (value === '30days') {
        setShowExpiryWarning(true);
      } else {
        setShowExpiryWarning(false);
      }
    }
  };

  const handleCustomExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const selectedDate = new Date(e.target.value);
      setFormData(prev => ({
        ...prev,
        expires_at: selectedDate.toISOString()
      }));
      
      const now = new Date();
      const diffDays = Math.floor((selectedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setShowExpiryWarning(diffDays <= 30);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(formData);
  };

  return {
    formData,
    expiry,
    showExpiryWarning,
    handleChange,
    handleSelectChange,
    handleTagsChange,
    handleExpiryChange,
    handleCustomExpiryChange,
    handleSubmit
  };
};
