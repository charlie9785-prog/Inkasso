import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const SUPABASE_URL = 'https://bosofhcunxbvfusvllsm.supabase.co';

interface VismaStatus {
  connected: boolean;
  is_active: boolean;
  last_sync_at: string | null;
}

interface SyncStats {
  invoices: {
    imported: number;
    updated: number;
    errors: number;
  };
  customers: {
    imported: number;
    updated: number;
    errors: number;
  };
}

interface SyncResult {
  success: boolean;
  stats: SyncStats;
}

export const useVismaIntegration = (tenantId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [status, setStatus] = useState<VismaStatus | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get auth headers for Edge Function calls
  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Ingen aktiv session - vänligen logga in igen');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    };
  };

  // Check Visma connection status
  const checkStatus = useCallback(async () => {
    if (!tenantId) return;

    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/visma-oauth?action=status&tenant_id=${tenantId}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Kunde inte hämta status');
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ett fel uppstod';
      setError(message);
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  // Start OAuth flow - returns URL to redirect to
  const startOAuth = useCallback(async (): Promise<string | null> => {
    if (!tenantId) {
      setError('Ingen tenant-ID tillgänglig');
      return null;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/visma-oauth?action=authorize`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ tenant_id: tenantId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Kunde inte starta OAuth');
      }

      const data = await response.json();
      return data.authorization_url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ett fel uppstod';
      setError(message);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [tenantId]);

  // Sync data from Visma
  const syncData = useCallback(async (): Promise<SyncResult | null> => {
    if (!tenantId) {
      setError('Ingen tenant-ID tillgänglig');
      return null;
    }

    setIsSyncing(true);
    setError(null);
    setSyncResult(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/visma-sync?tenant_id=${tenantId}&action=full`,
        { headers }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Synkronisering misslyckades');
      }

      const data: SyncResult = await response.json();
      setSyncResult(data);

      // Refresh status after sync
      await checkStatus();

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ett fel uppstod';
      setError(message);
      return null;
    } finally {
      setIsSyncing(false);
    }
  }, [tenantId, checkStatus]);

  // Disconnect from Visma
  const disconnect = useCallback(async (): Promise<boolean> => {
    if (!tenantId) {
      setError('Ingen tenant-ID tillgänglig');
      return false;
    }

    setIsDisconnecting(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/visma-oauth?action=disconnect`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ tenant_id: tenantId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Kunde inte koppla bort');
      }

      setStatus({ connected: false, is_active: false, last_sync_at: null });
      setSyncResult(null);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ett fel uppstod';
      setError(message);
      return false;
    } finally {
      setIsDisconnecting(false);
    }
  }, [tenantId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    status,
    syncResult,
    error,
    isLoading,
    isConnecting,
    isSyncing,
    isDisconnecting,
    isConnected: status?.connected ?? false,

    // Actions
    checkStatus,
    startOAuth,
    syncData,
    disconnect,
    clearError,
  };
};

export default useVismaIntegration;
