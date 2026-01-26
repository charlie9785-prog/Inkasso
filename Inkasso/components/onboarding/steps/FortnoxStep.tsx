import React, { useEffect, useState } from 'react';
import { ArrowLeft, Building2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useFortnoxIntegration } from '../../../hooks/useFortnoxIntegration';
import FortnoxOnboarding from '../FortnoxOnboarding';
import VismaOnboarding from '../VismaOnboarding';
import { PlanType } from '../../../hooks/useOnboarding';

type AccountingSystem = 'none' | 'fortnox' | 'visma';

interface FortnoxStepProps {
  onboarding: {
    progress: {
      tenantId: string | null;
      selectedPlan: PlanType;
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
  const [selectedSystem, setSelectedSystem] = useState<AccountingSystem>('none');

  // Check Fortnox status when coming back from OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('fortnox') === 'success') {
      setFortnoxConnected(true);
      setSelectedSystem('fortnox');
      // Clean up URL
      window.history.replaceState({}, '', '/onboarding');
    }
    if (params.get('visma') === 'success') {
      setSelectedSystem('visma');
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

  const handleBack = () => {
    if (selectedSystem !== 'none') {
      setSelectedSystem('none');
    } else {
      goBack();
    }
  };

  // Show accounting system selection
  if (selectedSystem === 'none') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-600/10 flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-violet-400" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-white">
            Välj bokföringssystem
          </h2>
          <p className="text-gray-400 mt-2">
            Koppla ditt bokföringssystem för att automatiskt importera fakturor och kunder
          </p>
        </div>

        {/* Accounting system options */}
        <div className="space-y-4">
          {/* Fortnox */}
          <button
            onClick={() => setSelectedSystem('fortnox')}
            className="w-full glass border border-white/10 hover:border-green-500/50 rounded-xl p-6 transition-all group text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-white group-hover:text-green-400 transition-colors">
                    Fortnox
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Sveriges mest populära bokföringsprogram
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-colors" />
            </div>
          </button>

          {/* Visma eAccounting */}
          <button
            onClick={() => setSelectedSystem('visma')}
            className="w-full glass border border-white/10 hover:border-blue-500/50 rounded-xl p-6 transition-all group text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-white group-hover:text-blue-400 transition-colors">
                    Visma eAccounting
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Kraftfullt och användarvänligt bokföringssystem
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
            </div>
          </button>
        </div>

        {/* Benefits */}
        <div className="glass border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-medium mb-3">Varför koppla bokföringssystem?</h3>
          <div className="space-y-2">
            {[
              'Automatisk import av obetalda fakturor',
              'Synkronisera kundinformation',
              'Spara tid och undvik manuella fel',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <span>Hoppa över detta steg</span>
        </button>

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
  }

  // Show Fortnox onboarding
  if (selectedSystem === 'fortnox') {
    return (
      <div>
        <FortnoxOnboarding onComplete={handleComplete} onSkip={handleSkip} tenantId={progress.tenantId} />

        {/* Back button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tillbaka</span>
          </button>
        </div>
      </div>
    );
  }

  // Show Visma onboarding
  if (selectedSystem === 'visma') {
    return (
      <div>
        <VismaOnboarding onComplete={handleComplete} onSkip={handleSkip} tenantId={progress.tenantId} />

        {/* Back button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tillbaka</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default FortnoxStep;
