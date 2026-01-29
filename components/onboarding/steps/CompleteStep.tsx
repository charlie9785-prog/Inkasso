import React, { useEffect, useState } from 'react';
import { CheckCircle2, Mail, LayoutDashboard, ArrowRight } from 'lucide-react';
import { navigate } from '../../../lib/navigation';
import { PlanType } from '../../../hooks/useOnboarding';

interface CompleteStepProps {
  onboarding: {
    progress: {
      selectedPlan: PlanType;
      signupData: {
        email: string;
      } | null;
      planSelected: boolean;
      fortnoxConnected: boolean;
    };
    resetOnboarding: () => void;
  };
}

const CompleteStep: React.FC<CompleteStepProps> = ({ onboarding }) => {
  const { progress, resetOnboarding } = onboarding;
  const [countdown, setCountdown] = useState(5);

  const isB2C = progress.selectedPlan === 'b2c';
  const email = progress.signupData?.email || '';

  // Auto-redirect for B2B users
  useEffect(() => {
    if (!isB2C) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            resetOnboarding();
            navigate('/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isB2C, resetOnboarding]);

  const handleGoToDashboard = () => {
    resetOnboarding();
    navigate('/dashboard');
  };

  const handleGoToHome = () => {
    resetOnboarding();
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto text-center py-8">
      {/* Success icon */}
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-400" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-display font-semibold text-white mb-4">
        Klart!
      </h2>

      {isB2C ? (
        // B2C completion message
        <>
          <div className="glass border border-white/10 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-violet-400" />
              <span className="text-white font-medium">Rapporter skickas till:</span>
            </div>
            <p className="text-violet-400 font-medium text-lg">{email}</p>
          </div>

          <p className="text-gray-400 mb-8">
            Du får din första rapport inom en vecka. Vi hör av oss så fort vi börjar arbeta med era förfallna fakturor.
          </p>

          <button
            onClick={handleGoToHome}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all border border-white/10"
          >
            <span>Tillbaka till startsidan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      ) : (
        // B2B completion message
        <>
          <p className="text-gray-400 mb-6">
            Ditt konto är nu aktivt. Du kan logga in på din dashboard för att följa alla ärenden i realtid.
          </p>

          <div className="glass border border-white/10 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <LayoutDashboard className="w-6 h-6 text-violet-400" />
              <span className="text-white font-medium">Din dashboard väntar</span>
            </div>
            <p className="text-gray-500 text-sm">
              Omdirigerar automatiskt om {countdown} sekunder...
            </p>
          </div>

          <button
            onClick={handleGoToDashboard}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition-all"
          >
            <span>Gå till dashboard nu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Summary */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-sm text-gray-500">
          {isB2C
            ? 'Tack för att du valde Zylora! Vi tar hand om dina förfallna fakturor.'
            : 'Tack för att du valde Zylora! Vid frågor, kontakta oss på supprt@zylora.se'}
        </p>
      </div>
    </div>
  );
};

export default CompleteStep;
