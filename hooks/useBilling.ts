import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const API_BASE = '/api/billing';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
}

export const useBilling = (tenantId: string | undefined | null) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get auth headers for API calls
  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    };
  };

  // Fetch available plans
  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE}/plans`, { headers });

      if (!response.ok) {
        throw new Error('Kunde inte hämta planer');
      }

      const data = await response.json();
      setPlans(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ett fel uppstod';
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create Stripe checkout session
  const createCheckout = useCallback(async (
    planId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<string | null> => {
    if (!tenantId) {
      setError('Ingen tenant-ID tillgänglig');
      return null;
    }

    setIsCreatingCheckout(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE}/create-checkout`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tenant_id: tenantId,
          plan_id: planId,
          success_url: successUrl,
          cancel_url: cancelUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Kunde inte skapa checkout');
      }

      const data = await response.json();
      return data.checkout_url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ett fel uppstod';
      setError(message);
      return null;
    } finally {
      setIsCreatingCheckout(false);
    }
  }, [tenantId]);

  // Create Stripe customer portal session
  const createPortal = useCallback(async (returnUrl: string): Promise<string | null> => {
    if (!tenantId) {
      setError('Ingen tenant-ID tillgänglig');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE}/create-portal`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tenant_id: tenantId,
          return_url: returnUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Kunde inte öppna kundportalen');
      }

      const data = await response.json();
      return data.portal_url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ett fel uppstod';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    plans,
    isLoading,
    isCreatingCheckout,
    error,
    fetchPlans,
    createCheckout,
    createPortal,
    clearError,
  };
};

export default useBilling;
