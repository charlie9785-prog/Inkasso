import { useState, useCallback, useEffect } from 'react';
import { supabase, supabaseUrl, supabaseAnonKey } from '../lib/supabase';

export type OnboardingStep = 'plan' | 'fortnox' | 'details' | 'payment' | 'complete';
export type PlanType = 'b2c' | 'b2b' | null;

const ONBOARDING_STEPS: OnboardingStep[] = ['plan', 'fortnox', 'details', 'payment', 'complete'];

interface SignupData {
  companyName: string;
  orgNumber: string;
  email: string;
  password?: string; // Only required for B2B
}

interface NotificationPreferences {
  weeklyReport: boolean;
  monthlyReport: boolean;
  newCaseTakeover: boolean;
  invoicePaid: boolean;
}

interface OnboardingProgress {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  tenantId: string | null;
  selectedPlan: PlanType;
  signupData: SignupData | null;
  notificationPreferences: NotificationPreferences;
  emailVerified: boolean;
  planSelected: boolean;
  fortnoxConnected: boolean;
  integrationsConfigured: string[];
}

const STORAGE_KEY = 'zylora_onboarding_progress';

const defaultNotificationPreferences: NotificationPreferences = {
  weeklyReport: true,
  monthlyReport: false,
  newCaseTakeover: false,
  invoicePaid: false,
};

const getInitialProgress = (): OnboardingProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        notificationPreferences: parsed.notificationPreferences || defaultNotificationPreferences,
      };
    }
  } catch (e) {
    console.error('Failed to load onboarding progress:', e);
  }
  return {
    currentStep: 'plan',
    completedSteps: [],
    tenantId: null,
    selectedPlan: null,
    signupData: null,
    notificationPreferences: defaultNotificationPreferences,
    emailVerified: false,
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

  // Select plan (Step 1)
  const selectPlan = useCallback((plan: PlanType) => {
    setProgress((prev) => ({
      ...prev,
      selectedPlan: plan,
    }));
  }, []);

  // Save signup data
  const saveSignupData = useCallback((data: SignupData) => {
    setProgress((prev) => ({
      ...prev,
      signupData: data,
      emailVerified: false,
    }));
  }, []);

  // Save notification preferences
  const saveNotificationPreferences = useCallback((preferences: NotificationPreferences) => {
    setProgress((prev) => ({
      ...prev,
      notificationPreferences: preferences,
    }));
  }, []);

  // Send verification code to email
  const sendVerificationCode = useCallback(async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/send-verification-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Kunde inte skicka verifieringskod');
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

  // Verify email code
  const verifyEmailCode = useCallback(async (email: string, code: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/verify-email-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
          },
          body: JSON.stringify({ email, code }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ogiltig verifieringskod');
      }

      setProgress((prev) => ({
        ...prev,
        emailVerified: true,
      }));

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ett fel uppstod';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
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
        `${supabaseUrl}/functions/v1/validate-signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
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

  // Create checkout session with signup data
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
        `${supabaseUrl}/functions/v1/create-checkout-with-signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
          },
          body: JSON.stringify({
            company_name: progress.signupData.companyName,
            org_number: progress.signupData.orgNumber,
            email: progress.signupData.email,
            password: progress.signupData.password || '',
            plan_id: planId,
            plan_type: progress.selectedPlan,
            notification_preferences: progress.notificationPreferences,
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
  }, [progress.signupData, progress.selectedPlan, progress.notificationPreferences]);

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

  // Login after payment and fetch tenant ID
  const loginAfterPayment = useCallback(async (): Promise<boolean> => {
    if (!progress.signupData) {
      setError('Ingen registreringsdata tillgänglig');
      return false;
    }

    // B2C users don't have passwords, so we skip login
    if (progress.selectedPlan === 'b2c') {
      setProgress((prev) => ({
        ...prev,
        planSelected: true,
      }));
      return true;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Login with the credentials from signup (only B2B)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: progress.signupData.email,
        password: progress.signupData.password || '',
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Kunde inte logga in');
      }

      // Fetch tenant ID
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('id')
        .eq('email', progress.signupData.email)
        .single();

      if (tenantError || !tenant) {
        throw new Error('Kunde inte hitta företagskonto');
      }

      // Save tenant ID to progress
      setProgress((prev) => ({
        ...prev,
        tenantId: tenant.id,
        planSelected: true,
      }));

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ett fel uppstod';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [progress.signupData, progress.selectedPlan]);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress({
      currentStep: 'plan',
      completedSteps: [],
      tenantId: null,
      selectedPlan: null,
      signupData: null,
      notificationPreferences: defaultNotificationPreferences,
      emailVerified: false,
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
    selectPlan,
    saveSignupData,
    saveNotificationPreferences,
    sendVerificationCode,
    verifyEmailCode,
    validateSignupData,
    createCheckoutWithSignup,
    updateTenantSettings,
    setFortnoxConnected,
    setPlanSelected,
    addConfiguredIntegration,
    loginAfterPayment,
    resetOnboarding,
    clearError,
  };
};

export default useOnboarding;
