import React, { useMemo } from 'react';
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';
import { navigate } from '../../lib/navigation';

const VismaError: React.FC = () => {
  // Check if user came from onboarding
  const isFromOnboarding = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('from') === 'onboarding' ||
           localStorage.getItem('zylora_onboarding_progress') !== null;
  }, []);

  const targetUrl = isFromOnboarding ? '/onboarding' : '/dashboard';
  const targetLabel = isFromOnboarding ? 'Tillbaka till onboarding' : 'Tillbaka till dashboarden';

  // Parse error from query params
  const errorInfo = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error') || 'unknown_error';
    const errorDescription = params.get('error_description') || params.get('message');

    // Map common OAuth errors to Swedish
    const errorMessages: Record<string, { title: string; description: string }> = {
      access_denied: {
        title: 'Åtkomst nekad',
        description: 'Du nekade Zylora åtkomst till ditt Visma-konto. För att använda integrationen behöver du godkänna åtkomsten.',
      },
      invalid_request: {
        title: 'Ogiltig förfrågan',
        description: 'Något gick fel med anslutningsförfrågan. Försök igen.',
      },
      unauthorized_client: {
        title: 'Obehörig klient',
        description: 'Zylora är inte behörig att ansluta till Visma. Kontakta support.',
      },
      server_error: {
        title: 'Serverfel',
        description: 'Ett fel uppstod hos Visma. Försök igen om en stund.',
      },
      temporarily_unavailable: {
        title: 'Tillfälligt otillgänglig',
        description: 'Visma är tillfälligt otillgänglig. Försök igen om en stund.',
      },
      invalid_scope: {
        title: 'Ogiltiga behörigheter',
        description: 'De begärda behörigheterna kunde inte beviljas. Kontakta support.',
      },
      unknown_error: {
        title: 'Något gick fel',
        description: 'Ett oväntat fel uppstod vid anslutning till Visma.',
      },
    };

    const mappedError = errorMessages[error] || errorMessages.unknown_error;

    return {
      code: error,
      title: mappedError.title,
      description: errorDescription || mappedError.description,
    };
  }, []);

  const handleRetry = () => {
    navigate(targetUrl);
  };

  const handleGoBack = () => {
    navigate(targetUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>

        {/* Error message */}
        <div>
          <h1 className="text-2xl font-display font-semibold text-white">
            {errorInfo.title}
          </h1>
          <p className="text-gray-400 mt-2">
            {errorInfo.description}
          </p>
        </div>

        {/* Error details card */}
        <div className="glass border border-red-500/30 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-center gap-2 text-red-400">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Anslutning misslyckades</span>
          </div>
          {errorInfo.code !== 'unknown_error' && (
            <p className="text-xs text-gray-500 font-mono bg-white/5 rounded px-2 py-1">
              Felkod: {errorInfo.code}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Försök igen</span>
          </button>

          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{targetLabel}</span>
          </button>
        </div>

        {/* Help section */}
        <div className="glass border border-white/10 rounded-xl p-4">
          <div className="flex items-start gap-3 text-left">
            <HelpCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-300 font-medium">Behöver du hjälp?</p>
              <p className="text-xs text-gray-500 mt-1">
                Om problemet kvarstår, kontakta vår support på{' '}
                <a href="mailto:support@zylora.se" className="text-violet-400 hover:text-violet-300">
                  support@zylora.se
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VismaError;
