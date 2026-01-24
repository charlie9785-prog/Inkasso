import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { navigate } from '../../../lib/navigation';

interface CompleteStepProps {
  onboarding: {
    progress: {
      planSelected: boolean;
      fortnoxConnected: boolean;
    };
    resetOnboarding: () => void;
  };
}

const CompleteStep: React.FC<CompleteStepProps> = ({ onboarding }) => {
  const { resetOnboarding } = onboarding;

  // Auto-redirect to dashboard
  useEffect(() => {
    const timer = setTimeout(() => {
      resetOnboarding();
      navigate('/dashboard');
    }, 500);

    return () => clearTimeout(timer);
  }, [resetOnboarding]);

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-4" />
      <p className="text-gray-400">Förbereder din dashboard...</p>
    </div>
  );
};

export default CompleteStep;
