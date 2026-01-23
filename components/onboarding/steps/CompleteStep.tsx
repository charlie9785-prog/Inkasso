import React from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  CreditCard,
  Building2,
  Settings,
  XCircle,
} from 'lucide-react';
import { navigate } from '../../../lib/navigation';

interface CompleteStepProps {
  onboarding: {
    progress: {
      planSelected: boolean;
      fortnoxConnected: boolean;
      integrationsConfigured: string[];
    };
    resetOnboarding: () => void;
  };
}

const CompleteStep: React.FC<CompleteStepProps> = ({ onboarding }) => {
  const { progress, resetOnboarding } = onboarding;

  const handleGoToDashboard = () => {
    resetOnboarding(); // Clear onboarding progress
    navigate('/dashboard');
  };

  const configuredItems = [
    {
      id: 'account',
      label: 'Konto skapat',
      icon: <CheckCircle2 className="w-5 h-5" />,
      completed: true, // Always true if we got here
      color: 'text-green-400',
    },
    {
      id: 'plan',
      label: 'Prenumeration aktiverad',
      icon: <CreditCard className="w-5 h-5" />,
      completed: progress.planSelected,
      color: progress.planSelected ? 'text-green-400' : 'text-gray-500',
    },
    {
      id: 'fortnox',
      label: 'Fortnox anslutet',
      icon: <Building2 className="w-5 h-5" />,
      completed: progress.fortnoxConnected,
      color: progress.fortnoxConnected ? 'text-green-400' : 'text-gray-500',
    },
    {
      id: 'integrations',
      label: `${progress.integrationsConfigured.length} integrationer konfigurerade`,
      icon: <Settings className="w-5 h-5" />,
      completed: progress.integrationsConfigured.length > 0,
      color: progress.integrationsConfigured.length > 0 ? 'text-green-400' : 'text-gray-500',
    },
  ];

  return (
    <div className="max-w-md mx-auto text-center">
      {/* Success icon */}
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center mb-6">
        <Sparkles className="w-10 h-10 text-green-400" />
      </div>

      {/* Header */}
      <h2 className="text-2xl font-display font-semibold text-white mb-2">
        Allt är klart!
      </h2>
      <p className="text-gray-400 mb-8">
        Ditt konto är nu konfigurerat och redo att användas. Välkommen till Zylora!
      </p>

      {/* Configuration summary */}
      <div className="glass border border-white/10 rounded-xl p-6 mb-8 text-left">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Sammanfattning
        </h3>
        <ul className="space-y-3">
          {configuredItems.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <span className={item.color}>
                {item.completed ? item.icon : <XCircle className="w-5 h-5" />}
              </span>
              <span className={item.completed ? 'text-white' : 'text-gray-500'}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tips */}
      <div className="glass border border-white/10 rounded-xl p-6 mb-8 text-left">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Nästa steg
        </h3>
        <ul className="space-y-3 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0 text-xs font-medium mt-0.5">
              1
            </span>
            <span>Synka dina fakturor från Fortnox eller importera manuellt</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0 text-xs font-medium mt-0.5">
              2
            </span>
            <span>Granska och starta inkassoflödet för förfallna fakturor</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0 text-xs font-medium mt-0.5">
              3
            </span>
            <span>Följ dina ärenden och se pengarna komma in</span>
          </li>
        </ul>
      </div>

      {/* CTA button */}
      <button
        onClick={handleGoToDashboard}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition-all text-lg"
      >
        <span>Gå till Dashboard</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Support link */}
      <p className="mt-6 text-sm text-gray-500">
        Behöver du hjälp?{' '}
        <a
          href="mailto:support@zylora.se"
          className="text-violet-400 hover:text-violet-300 transition-colors"
        >
          Kontakta support
        </a>
      </p>
    </div>
  );
};

export default CompleteStep;
