import React, { useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Link2,
  Unlink,
  RefreshCw,
  ArrowRight,
  Building2,
  FileText,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useFortnoxIntegration } from '../../hooks/useFortnoxIntegration';

interface FortnoxOnboardingProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const FortnoxOnboarding: React.FC<FortnoxOnboardingProps> = ({ onComplete, onSkip }) => {
  const { tenant } = useAuth();
  const {
    status,
    syncResult,
    error,
    isLoading,
    isConnecting,
    isSyncing,
    isDisconnecting,
    isConnected,
    checkStatus,
    startOAuth,
    syncData,
    disconnect,
    clearError,
  } = useFortnoxIntegration(tenant?.id);

  // Check status on mount and when returning from OAuth
  useEffect(() => {
    if (tenant?.id) {
      checkStatus();
    }
  }, [tenant?.id, checkStatus]);

  const handleConnect = async () => {
    const authUrl = await startOAuth();
    if (authUrl) {
      // Redirect to Fortnox OAuth
      window.location.href = authUrl;
    }
  };

  const handleSync = async () => {
    await syncData();
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-display font-semibold text-white">
          Koppla Fortnox
        </h2>
        <p className="text-gray-400 mt-2">
          Anslut ditt Fortnox-konto för att automatiskt importera fakturor och kunder
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="glass border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-400 font-medium">Något gick fel</p>
            <p className="text-sm text-gray-400 mt-1">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-gray-500 hover:text-gray-400 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main card */}
      <div className="glass border border-white/10 rounded-xl overflow-hidden">
        {/* Status header */}
        <div className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/10 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-display font-semibold text-white">Fortnox</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                      <span className="text-sm text-gray-400">Kontrollerar...</span>
                    </>
                  ) : isConnected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Ansluten</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">Ej ansluten</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isConnected ? (
            <div className="space-y-6">
              {/* Connection info */}
              {status?.last_sync_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Senaste synkronisering</span>
                  <span className="text-white">{formatDate(status.last_sync_at)}</span>
                </div>
              )}

              {/* Sync result */}
              {syncResult && (
                <div className="glass border border-white/10 rounded-xl p-4 space-y-3">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Synkronisering klar
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400">Kunder:</span>
                      <span className="text-white">{syncResult.stats.customers.imported} importerade</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-violet-400" />
                      <span className="text-gray-400">Fakturor:</span>
                      <span className="text-white">{syncResult.stats.invoices.imported} importerade</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Synkroniserar...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      <span>Synka fakturor och kunder</span>
                    </>
                  )}
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={handleDisconnect}
                    disabled={isDisconnecting || isSyncing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Unlink className="w-4 h-4" />
                    <span>Koppla från</span>
                  </button>

                  <button
                    onClick={onComplete}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition-all"
                  >
                    <span>Fortsätt</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Not connected info */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                <FileText className="w-12 h-12 text-gray-500" />
                <div>
                  <p className="text-white font-medium">Importera från Fortnox</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Anslut för att automatiskt hämta obetalda fakturor och kundinformation
                  </p>
                </div>
              </div>

              {/* Benefits list */}
              <div className="space-y-2">
                {[
                  'Automatisk import av obetalda fakturor',
                  'Synkronisera kundinformation',
                  'Håll allt uppdaterat automatiskt',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleConnect}
                  disabled={isConnecting || isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Ansluter...</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-5 h-5" />
                      <span>Koppla till Fortnox</span>
                    </>
                  )}
                </button>

                {onSkip && (
                  <button
                    onClick={onSkip}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                  >
                    <span>Hoppa över detta steg</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info section */}
      <div className="glass border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-medium mb-3">Så här fungerar det</h3>
        <ol className="space-y-3 text-sm text-gray-400">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
            <span>Klicka på "Koppla till Fortnox" och logga in på ditt Fortnox-konto</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
            <span>Godkänn att Zylora får läsa dina fakturor och kunder</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
            <span>Klicka på "Synka" för att importera obetalda fakturor</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default FortnoxOnboarding;
