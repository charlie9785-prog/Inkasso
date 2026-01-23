import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useFortnoxIntegration } from '../../../hooks/useFortnoxIntegration';
import FortnoxOnboarding from '../FortnoxOnboarding';

interface FortnoxStepProps {
  onboarding: {
    progress: {
      tenantId: string | null;
    };
    completeStep: (step: 'fortnox') => void;
    skipStep: (step: 'fortnox') => void;
    goBack: () => void;
    setFortnoxConnected: (connected: boolean) => void;
  };
}

const FortnoxStep: React.FC<FortnoxStepProps> = ({ onboarding }) => {
  const { completeStep, skipStep, goBack, setFortnoxConnected, progress } = onboarding;
  const { tenant } = useAuth();
  const fortnox = useFortnoxIntegration(tenant?.id || progress.tenantId || undefined);

  // Check Fortnox status when coming back from OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('fortnox') === 'success') {
      setFortnoxConnected(true);
      // Clean up URL
      window.history.replaceState({}, '', '/onboarding');
    }
  }, [setFortnoxConnected]);

  // Update fortnox connected status
  useEffect(() => {
    if (fortnox.isConnected) {
      setFortnoxConnected(true);
    }
  }, [fortnox.isConnected, setFortnoxConnected]);

  const handleComplete = () => {
    completeStep('fortnox');
  };

  const handleSkip = () => {
    skipStep('fortnox');
  };

  return (
    <div>
      <FortnoxOnboarding onComplete={handleComplete} onSkip={handleSkip} />

      {/* Back button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tillbaka</span>
        </button>
      </div>
    </div>
  );
};

export default FortnoxStep;
