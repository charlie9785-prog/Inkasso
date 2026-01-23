import React, { useState, useEffect } from 'react';
import {
  Link2,
  Unlink,
  RefreshCw,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Building2,
  Loader2,
} from 'lucide-react';
import { Integration, IntegrationProvider, IntegrationStatus } from '../../types/dashboard';
import { useAuth } from '../../hooks/useAuth';
import { useFortnoxIntegration } from '../../hooks/useFortnoxIntegration';

interface IntegrationConfig {
  id: IntegrationProvider;
  name: string;
  description: string;
  color: string;
  bgColor: string;
}

const integrationConfigs: IntegrationConfig[] = [
  {
    id: 'fortnox',
    name: 'Fortnox',
    description: 'Sveriges ledande molnbaserade affärssystem för ekonomi, fakturering och bokföring.',
    color: 'text-green-400',
    bgColor: 'from-green-500/20 to-green-600/10',
  },
  {
    id: 'visma',
    name: 'Visma',
    description: 'Komplett affärssystem med fakturering, bokföring och lönehantering.',
    color: 'text-blue-400',
    bgColor: 'from-blue-500/20 to-blue-600/10',
  },
  {
    id: 'bjorn_lunden',
    name: 'Björn Lundén',
    description: 'Ekonomiprogram för småföretag med fokus på användarvänlighet.',
    color: 'text-orange-400',
    bgColor: 'from-orange-500/20 to-orange-600/10',
  },
];

// Mock integration data - for Visma and Björn Lundén (not yet implemented)
const mockIntegrations: Integration[] = [];

const Integrations: React.FC = () => {
  const { tenant } = useAuth();
  const fortnox = useFortnoxIntegration(tenant?.id);

  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [connectingProvider, setConnectingProvider] = useState<IntegrationProvider | null>(null);
  const [syncingProvider, setSyncingProvider] = useState<IntegrationProvider | null>(null);
  const [fetchingProvider, setFetchingProvider] = useState<IntegrationProvider | null>(null);

  // Check Fortnox status on mount
  useEffect(() => {
    if (tenant?.id) {
      fortnox.checkStatus();
    }
  }, [tenant?.id]);

  const getIntegration = (provider: IntegrationProvider): Integration | undefined => {
    // For Fortnox, use real status from hook
    if (provider === 'fortnox' && fortnox.status) {
      return {
        id: 'fortnox-integration',
        provider: 'fortnox',
        status: fortnox.isConnected ? 'connected' : 'disconnected',
        lastSyncAt: fortnox.status.last_sync_at || undefined,
        invoicesImported: fortnox.syncResult?.stats.invoices.imported,
      };
    }
    return integrations.find((i) => i.provider === provider);
  };

  const getStatusIcon = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusText = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected':
        return 'Ansluten';
      case 'disconnected':
        return 'Ej ansluten';
      case 'pending':
        return 'Väntar...';
      case 'error':
        return 'Fel';
    }
  };

  const handleConnect = async (provider: IntegrationProvider) => {
    // Fortnox uses real OAuth
    if (provider === 'fortnox') {
      const authUrl = await fortnox.startOAuth();
      if (authUrl) {
        window.location.href = authUrl;
      }
      return;
    }

    // Other providers still use mock
    setConnectingProvider(provider);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newIntegration: Integration = {
      id: `int_${provider}_${Date.now()}`,
      provider,
      status: 'connected',
      connectedAt: new Date().toISOString(),
      invoicesImported: 0,
    };

    setIntegrations((prev) => [...prev.filter((i) => i.provider !== provider), newIntegration]);
    setConnectingProvider(null);
  };

  const handleDisconnect = async (provider: IntegrationProvider) => {
    // Fortnox uses real API
    if (provider === 'fortnox') {
      await fortnox.disconnect();
      return;
    }

    // Other providers still use mock
    setConnectingProvider(provider);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIntegrations((prev) => prev.filter((i) => i.provider !== provider));
    setConnectingProvider(null);
  };

  const handleSync = async (provider: IntegrationProvider) => {
    // Fortnox uses real sync
    if (provider === 'fortnox') {
      await fortnox.syncData();
      return;
    }

    // Other providers still use mock
    setSyncingProvider(provider);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIntegrations((prev) =>
      prev.map((i) =>
        i.provider === provider
          ? { ...i, lastSyncAt: new Date().toISOString() }
          : i
      )
    );
    setSyncingProvider(null);
  };

  const handleFetchInvoices = async (provider: IntegrationProvider) => {
    // Fortnox uses real sync (same as handleSync for Fortnox)
    if (provider === 'fortnox') {
      await fortnox.syncData();
      return;
    }

    // Other providers still use mock
    setFetchingProvider(provider);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const randomInvoices = Math.floor(Math.random() * 20) + 5;

    setIntegrations((prev) =>
      prev.map((i) =>
        i.provider === provider
          ? {
              ...i,
              lastSyncAt: new Date().toISOString(),
              invoicesImported: (i.invoicesImported || 0) + randomInvoices,
            }
          : i
      )
    );
    setFetchingProvider(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
            <Link2 className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-display font-semibold text-white">Integrationer</h2>
            <p className="text-gray-400 text-sm mt-1">
              Anslut ditt ekonomisystem för att automatiskt hämta fakturor till Zylora
            </p>
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {integrationConfigs.map((config) => {
          const integration = getIntegration(config.id);
          const isConnected = integration?.status === 'connected';

          // Use Fortnox hook states for Fortnox provider
          const isConnecting = config.id === 'fortnox'
            ? fortnox.isConnecting
            : connectingProvider === config.id;
          const isSyncing = config.id === 'fortnox'
            ? fortnox.isSyncing
            : syncingProvider === config.id;
          const isFetching = config.id === 'fortnox'
            ? fortnox.isSyncing
            : fetchingProvider === config.id;
          const isDisconnecting = config.id === 'fortnox'
            ? fortnox.isDisconnecting
            : false;

          return (
            <div
              key={config.id}
              className={`glass border rounded-xl overflow-hidden transition-all ${
                isConnected ? 'border-white/20' : 'border-white/10'
              }`}
            >
              {/* Card Header */}
              <div className={`p-6 bg-gradient-to-br ${config.bgColor}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                      <Building2 className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-semibold text-white">
                        {config.name}
                      </h3>
                      {integration && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {getStatusIcon(integration.status)}
                          <span className="text-sm text-gray-300">
                            {getStatusText(integration.status)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mt-4">{config.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {isConnected ? (
                  <>
                    {/* Connection Info */}
                    <div className="space-y-2 text-sm">
                      {integration?.connectedAt && (
                        <div className="flex justify-between text-gray-400">
                          <span>Ansluten sedan</span>
                          <span className="text-white">{formatDate(integration.connectedAt)}</span>
                        </div>
                      )}
                      {integration?.lastSyncAt && (
                        <div className="flex justify-between text-gray-400">
                          <span>Senaste synk</span>
                          <span className="text-white">{formatDate(integration.lastSyncAt)}</span>
                        </div>
                      )}
                      {integration?.invoicesImported !== undefined && (
                        <div className="flex justify-between text-gray-400">
                          <span>Fakturor importerade</span>
                          <span className="text-white">{integration.invoicesImported} st</span>
                        </div>
                      )}
                      {/* Show customers for Fortnox */}
                      {config.id === 'fortnox' && fortnox.syncResult?.stats.customers && (
                        <div className="flex justify-between text-gray-400">
                          <span>Kunder importerade</span>
                          <span className="text-white">{fortnox.syncResult.stats.customers.imported} st</span>
                        </div>
                      )}
                    </div>

                    {/* Fortnox error */}
                    {config.id === 'fortnox' && fortnox.error && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-red-400">{fortnox.error}</p>
                            <button
                              onClick={() => fortnox.clearError()}
                              className="text-xs text-gray-500 hover:text-gray-400 mt-1"
                            >
                              Stäng
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => handleFetchInvoices(config.id)}
                        disabled={isFetching || isSyncing}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isFetching ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Hämtar fakturor...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            <span>Hämta fakturor</span>
                          </>
                        )}
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSync(config.id)}
                          disabled={isSyncing || isFetching}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>Synka</span>
                        </button>

                        <button
                          onClick={() => handleDisconnect(config.id)}
                          disabled={isConnecting || isSyncing || isFetching || isDisconnecting}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDisconnecting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Unlink className="w-4 h-4" />
                          )}
                          <span>{isDisconnecting ? 'Kopplar från...' : 'Koppla från'}</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Not Connected State */}
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                      <FileText className="w-10 h-10 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-300">Ej ansluten</p>
                        <p className="text-xs text-gray-500">
                          Anslut för att importera fakturor
                        </p>
                      </div>
                    </div>

                    {/* Fortnox error (not connected state) */}
                    {config.id === 'fortnox' && fortnox.error && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-red-400">{fortnox.error}</p>
                            <button
                              onClick={() => fortnox.clearError()}
                              className="text-xs text-gray-500 hover:text-gray-400 mt-1"
                            >
                              Stäng
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleConnect(config.id)}
                      disabled={isConnecting}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Ansluter...</span>
                        </>
                      ) : (
                        <>
                          <Link2 className="w-5 h-5" />
                          <span>Anslut {config.name}</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="glass border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-display font-semibold text-white mb-4">
          Hur fungerar det?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-violet-400 font-bold">1</span>
            </div>
            <div>
              <h4 className="text-white font-medium">Anslut</h4>
              <p className="text-sm text-gray-400 mt-1">
                Klicka på "Anslut" och logga in på ditt ekonomisystem för att ge Zylora åtkomst.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-violet-400 font-bold">2</span>
            </div>
            <div>
              <h4 className="text-white font-medium">Hämta fakturor</h4>
              <p className="text-sm text-gray-400 mt-1">
                Klicka på "Hämta fakturor" för att importera obetalda fakturor till Zylora.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-violet-400 font-bold">3</span>
            </div>
            <div>
              <h4 className="text-white font-medium">Automatisk synk</h4>
              <p className="text-sm text-gray-400 mt-1">
                Zylora synkar automatiskt status och betalningar tillbaka till ditt system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
