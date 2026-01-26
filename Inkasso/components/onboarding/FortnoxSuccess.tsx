import React, { useEffect, useState, useMemo } from 'react';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { navigate } from '../../lib/navigation';

const FortnoxSuccess: React.FC = () => {
  const [countdown, setCountdown] = useState(5);

  // Check if user came from onboarding
  const isFromOnboarding = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('from') === 'onboarding' ||
           localStorage.getItem('zylora_onboarding_progress') !== null;
  }, []);

  const targetUrl = isFromOnboarding ? '/onboarding?fortnox=success' : '/dashboard';
  const targetLabel = isFromOnboarding ? 'Fortsätt onboarding' : 'Gå till dashboarden';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(targetUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetUrl]);

  const handleContinue = () => {
    navigate(targetUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Success icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>

        {/* Success message */}
        <div>
          <h1 className="text-2xl font-display font-semibold text-white">
            Fortnox är anslutet!
          </h1>
          <p className="text-gray-400 mt-2">
            Ditt Fortnox-konto har kopplats till Zylora. Du kan nu synkronisera fakturor och kunder.
          </p>
        </div>

        {/* Success card */}
        <div className="glass border border-green-500/30 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-center gap-2 text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Anslutning lyckades</span>
          </div>
          <p className="text-sm text-gray-400">
            Du kommer att omdirigeras om {countdown} sekunder...
          </p>
          <div className="flex justify-center">
            <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition-all"
        >
          <span>{targetLabel}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Additional info */}
        <p className="text-xs text-gray-500">
          Du kan när som helst synkronisera eller koppla bort Fortnox under Integrationer.
        </p>
      </div>
    </div>
  );
};

export default FortnoxSuccess;
