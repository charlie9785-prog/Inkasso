import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type OnboardingStep = 'welcome' | 'plan' | 'fortnox' | 'integrations' | 'complete';

const ONBOARDING_STEPS: OnboardingStep[] = ['welcome', 'plan', 'fortnox', 'integrations', 'complete'];

interface SignupData {
  companyName: string;
  orgNumber: string;
  email: string;
  password: string;
}

interface OnboardingProgress {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  tenantId: string | null;
  signupData: SignupData | null;
  planSelected: boolean;
  fortnoxConnected: boolean;
  integrationsConfigured: string[];
}

const STORAGE_KEY = 'zylora_onboarding_progress';

const getInitialProgress = (): OnboardingProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load onboarding progress:', e);
  }
  return {
    currentStep: 'welcome',
    completedSteps: [],
    tenantId: null,
    signupData: null,
    planSelected: false,
    fortnoxConnected: false,
    integrationsConfigured: [],
  };
};

export const useOnboarding = () => {
  const [progress, setProgress] = useState<OnboardingProgress>(getInitialProgress);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const currentStepIndex = ONBOARDING_STEPS.indexOf(progress.currentStep);
  const totalSteps = ONBOARDING_STEPS.length;

  const goToStep = useCallback((step: OnboardingStep) => {
    setProgress((prev) => ({
      ...prev,
      currentStep: step,
    }));
  }, []);

  const completeStep = useCallback((step: OnboardingStep) => {
    setProgress((prev) => {
      const newCompletedSteps = prev.completedSteps.includes(step)
        ? prev.completedSteps
        : [...prev.completedSteps, step];

      const currentIndex = ONBOARDING_STEPS.indexOf(step);
      const nextStep = ONBOARDING_STEPS[currentIndex + 1] || 'complete';

      return {
        ...prev,
        completedSteps: newCompletedSteps,
        currentStep: nextStep,
      };
    });
  }, []);

  const skipStep = useCallback((step: OnboardingStep) => {
    const currentIndex = ONBOARDING_STEPS.indexOf(step);
    const nextStep = ONBOARDING_STEPS[currentIndex + 1] || 'complete';
    setProgress((prev) => ({
      ...prev,
      currentStep: nextStep,
    }));
  }, []);

  const goBack = useCallback(() => {
    const currentIndex = ONBOARDING_STEPS.indexOf(progress.currentStep);
    if (currentIndex > 0) {
      setProgress((prev) => ({
        ...prev,
        currentStep: ONBOARDING_STEPS[currentIndex - 1],
      }));
    }
  }, [progress.currentStep]);

  // Save signup data (Step 1) - NO database writes yet
  const saveSignupData = useCallback((data: {
    companyName: string;
    orgNumber: string;
    email: string;
    password: string;
  }) => {
    setProgress((prev) => ({
      ...prev,
      signupData: data,
    }));
  }, []);

  // Validate signup data against existing records
  const validateSignupData = useCallback(async (data: {
    companyName: string;
    orgNumber: string;
    email: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://bosofhcunxbvfusvllsm.supabase.co/functions/v1/validate-signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc29maGN1bnhidmZ1c3ZsbHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzAwODksImV4cCI6MjA4NDYwNjA4OX0.JktnLgmno5up9aTKBhexRf0DPPZsFq1LnKrL5PHAINc',
          },
          body: JSON.stringify({
            org_number: data.orgNumber,
            email: data.email,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Validering misslyckades');
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ett fel uppstod';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create checkout session with signup data (Step 2)
  const createCheckoutWithSignup = useCallback(async (
    planId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<string | null> => {
    if (!progress.signupData) {
      setError('Ingen registreringsdata tillgänglig');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://bosofhcunxbvfusvllsm.supabase.co/functions/v1/create-checkout-with-signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc29maGN1bnhidmZ1c3ZsbHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzAwODksImV4cCI6MjA4NDYwNjA4OX0.JktnLgmno5up9aTKBhexRf0DPPZsFq1LnKrL5PHAINc',
          },
          body: JSON.stringify({
            company_name: progress.signupData.companyName,
            org_number: progress.signupData.orgNumber,
            email: progress.signupData.email,
            password: progress.signupData.password,
            plan_id: planId,
            success_url: successUrl,
            cancel_url: cancelUrl,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Kunde inte skapa checkout');
      }

      return result.checkout_url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ett fel uppstod';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [progress.signupData]);

  // Update tenant settings (for integrations)
  const updateTenantSettings = useCallback(async (settings: Record<string, unknown>) => {
    if (!progress.tenantId) {
      setError('Ingen tenant-ID tillgänglig');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('tenants')
        .update({
          settings: settings,
        })
        .eq('id', progress.tenantId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ett fel uppstod';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [progress.tenantId]);

  const setFortnoxConnected = useCallback((connected: boolean) => {
    setProgress((prev) => ({
      ...prev,
      fortnoxConnected: connected,
    }));
  }, []);

  const setPlanSelected = useCallback((selected: boolean) => {
    setProgress((prev) => ({
      ...prev,
      planSelected: selected,
    }));
  }, []);

  const addConfiguredIntegration = useCallback((integrationId: string) => {
    setProgress((prev) => ({
      ...prev,
      integrationsConfigured: prev.integrationsConfigured.includes(integrationId)
        ? prev.integrationsConfigured
        : [...prev.integrationsConfigured, integrationId],
    }));
  }, []);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress({
      currentStep: 'welcome',
      completedSteps: [],
      tenantId: null,
      signupData: null,
      planSelected: false,
      fortnoxConnected: false,
      integrationsConfigured: [],
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    progress,
    currentStep: progress.currentStep,
    currentStepIndex,
    totalSteps,
    isLoading,
    error,
    steps: ONBOARDING_STEPS,

    // Navigation
    goToStep,
    completeStep,
    skipStep,
    goBack,

    // Actions
    saveSignupData,
    validateSignupData,
    createCheckoutWithSignup,
    updateTenantSettings,
    setFortnoxConnected,
    setPlanSelected,
    addConfiguredIntegration,
    resetOnboarding,
    clearError,
  };
};

export default useOnboarding;
