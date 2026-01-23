import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type OnboardingStep = 'welcome' | 'plan' | 'fortnox' | 'integrations' | 'complete';

const ONBOARDING_STEPS: OnboardingStep[] = ['welcome', 'plan', 'fortnox', 'integrations', 'complete'];

interface OnboardingProgress {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  tenantId: string | null;
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

  // Create tenant (Step 1)
  const createTenant = useCallback(async (data: {
    companyName: string;
    orgNumber: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        // Translate common errors to Swedish
        let errorMessage = authError.message;
        if (authError.message.includes('rate') || authError.message.includes('429') || authError.message.includes('security purposes')) {
          errorMessage = 'För många försök. Vänta en minut och försök igen.';
        } else if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
          errorMessage = 'E-postadressen är redan registrerad. Försök logga in istället.';
        } else if (authError.message.includes('valid email')) {
          errorMessage = 'Ogiltig e-postadress';
        } else if (authError.message.includes('Password')) {
          errorMessage = 'Lösenordet måste vara minst 6 tecken';
        }
        throw new Error(errorMessage);
      }

      if (!authData.user) {
        throw new Error('Kunde inte skapa användare');
      }

      // Create tenant via Edge Function (uses service_role to bypass RLS)
      // No auth token needed - Edge Function uses service_role key
      const response = await fetch(
        `https://bosofhcunxbvfusvllsm.supabase.co/functions/v1/create-tenant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc29maGN1bnhidmZ1c3ZsbHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzAwODksImV4cCI6MjA4NDYwNjA4OX0.JktnLgmno5up9aTKBhexRf0DPPZsFq1LnKrL5PHAINc',
          },
          body: JSON.stringify({
            user_id: authData.user.id,
            company_name: data.companyName,
            org_number: data.orgNumber,
            email: data.email,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Kunde inte skapa företagskonto');
      }

      setProgress((prev) => ({
        ...prev,
        tenantId: result.tenant.id,
      }));

      return result.tenant;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ett fel uppstod';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    createTenant,
    updateTenantSettings,
    setFortnoxConnected,
    setPlanSelected,
    addConfiguredIntegration,
    resetOnboarding,
    clearError,
  };
};

export default useOnboarding;
