import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Check,
  Loader2,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  ArrowRight,
  Crown,
  Users,
  Building2,
} from 'lucide-react';
import { navigate } from '../../../lib/navigation';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
}

interface PlanStepProps {
  onboarding: {
    progress: {
      tenantId: string | null;
      signupData: {
        companyName: string;
        orgNumber: string;
        email: string;
        password: string;
      } | null;
    };
    isLoading: boolean;
    error: string | null;
    completeStep: (step: 'plan') => void;
    goBack: () => void;
    setPlanSelected: (selected: boolean) => void;
    createCheckoutWithSignup: (planId: string, successUrl: string, cancelUrl: string) => Promise<string | null>;
    loginAfterPayment: () => Promise<boolean>;
    clearError: () => void;
  };
}

// Three plans: B2C, B2B, Enterprise
const PLANS: Plan[] = [
  {
    id: import.meta.env.VITE_STRIPE_PRICE_ID_B2C || 'price_b2c',
    name: 'B2C',
    description: 'För dig som fakturerar privatpersoner',
    price: 1900,
    currency: 'SEK',
    interval: 'month',
    features: [
      'Obegränsade ärenden',
      'Automatiska påminnelser (E-post, SMS, Telefon)',
      'Fortnox-integration',
      '10% success fee (max 10 000 kr/faktura)',
      'Avancerade rapporter',
      'Prioriterad support',
    ],
  },
  {
    id: import.meta.env.VITE_STRIPE_PRICE_ID || 'price_1StEi8Rou0T9LBA6HiX2RbJ9',
    name: 'B2B',
    description: 'För dig som fakturerar andra företag',
    price: 3900,
    currency: 'SEK',
    interval: 'month',
    popular: true,
    features: [
      'Obegränsade ärenden',
      'Automatiska påminnelser (E-post, SMS, Telefon)',
      'Fortnox-integration',
      '10% success fee (max 30 000 kr/faktura)',
      'Avancerade rapporter',
      'Prioriterad support',
    ],
  },
];

const PlanStep: React.FC<PlanStepProps> = ({ onboarding }) => {
  const { progress, goBack, completeStep, setPlanSelected, createCheckoutWithSignup, loginAfterPayment, isLoading, error } = onboarding;
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setIsCreatingCheckout(true);

    const successUrl = `${window.location.origin}/onboarding?payment=success`;
    const cancelUrl = `${window.location.origin}/onboarding?payment=cancelled`;

    // Use createCheckoutWithSignup which sends all signup data to backend
    const checkoutUrl = await createCheckoutWithSignup(planId, successUrl, cancelUrl);

    setIsCreatingCheckout(false);

    if (checkoutUrl) {
      // Redirect to Stripe - user + tenant will be created after payment
      window.location.href = checkoutUrl;
    }
  };

  // Check if returning from successful payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' && !isLoggingIn) {
      setIsLoggingIn(true);

      // Login and fetch tenant ID, then proceed
      loginAfterPayment().then((success) => {
        if (success) {
          completeStep('plan');
        }
        setIsLoggingIn(false);
        // Clear URL params
        window.history.replaceState({}, '', window.location.pathname);
      });
    }
  }, [completeStep, loginAfterPayment, isLoggingIn]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-violet-400" />
        </div>
        <h2 className="text-2xl font-display font-semibold text-white">
          Välj din plan
        </h2>
        <p className="text-gray-400 mt-2">
          Kom igång med automatisk betalningsuppföljning idag.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading || isLoggingIn ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* Terms acceptance checkbox - moved outside plans */}
          <label className="flex items-center justify-center gap-3 mb-6 cursor-pointer group">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all ${
                termsAccepted
                  ? 'bg-violet-500 border-violet-500'
                  : 'border-white/30 group-hover:border-white/50'
              }`}>
                {termsAccepted && (
                  <Check className="w-4 h-4 text-white absolute top-0.5 left-0.5" />
                )}
              </div>
            </div>
            <span className="text-sm text-gray-400 leading-tight">
              Jag godkänner Zyloras{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open('/villkor', '_blank');
                }}
                className="text-violet-400 hover:text-violet-300 inline-flex items-center gap-1"
              >
                användarvillkor
                <ExternalLink className="w-3 h-3" />
              </button>
            </span>
          </label>

          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {PLANS.map((plan) => {
              const PlanIcon = plan.name === 'B2C' ? Users : Building2;
              return (
                <div
                  key={plan.id}
                  className={`relative glass border rounded-2xl p-5 transition-all flex flex-col ${
                    plan.popular
                      ? 'border-violet-500/50 ring-1 ring-violet-500/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-medium">
                        <Sparkles className="w-3 h-3" />
                        <span>Rekommenderad</span>
                      </div>
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      plan.popular
                        ? 'bg-violet-500/20 border border-violet-500/30'
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <PlanIcon className={`w-4 h-4 ${plan.popular ? 'text-violet-400' : 'text-gray-400'}`} />
                    </div>
                    <h3 className="text-lg font-display font-semibold text-white">
                      {plan.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">{plan.price.toLocaleString('sv-SE')}</span>
                      <span className="text-sm text-gray-400">{plan.currency}/mån</span>
                    </div>
                    <p className={`text-xs mt-1 ${plan.popular ? 'text-violet-400/80' : 'text-gray-500'}`}>
                      + 10% success fee
                    </p>
                    <p className={`text-xs ${plan.popular ? 'text-violet-400/60' : 'text-gray-600'}`}>
                      {plan.name === 'B2C' ? 'Max 10 000 kr/faktura' : 'Max 30 000 kr/faktura'}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-4 flex-1">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-green-400' : 'text-gray-500'}`} />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Select button */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCreatingCheckout || !termsAccepted}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.popular
                        ? 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    {isCreatingCheckout && selectedPlan === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Förbereder...</span>
                      </>
                    ) : (
                      <span>Välj {plan.name}</span>
                    )}
                  </button>
                </div>
              );
            })}

            {/* Enterprise card */}
            <div className="relative glass border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all flex flex-col">
              {/* Plan header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/10 border border-amber-500/20">
                  <Crown className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-lg font-display font-semibold text-white">
                  Enterprise
                </h3>
              </div>
              <p className="text-xs text-gray-400 mb-4">För större bolag med specifika behov</p>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">Custom</span>
                </div>
                <p className="text-xs mt-1 text-gray-500">
                  Anpassad success fee
                </p>
                <p className="text-xs text-gray-600">
                  Baserat på volym
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-4 flex-1">
                <li className="flex items-start gap-2 text-xs">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                  <span className="text-gray-300">Anpassade integrationer</span>
                </li>
                <li className="flex items-start gap-2 text-xs">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                  <span className="text-gray-300">White-label (påminnelser i ert namn)</span>
                </li>
                <li className="flex items-start gap-2 text-xs">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                  <span className="text-gray-300">Volymrabatt på success fee</span>
                </li>
                <li className="flex items-start gap-2 text-xs">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                  <span className="text-gray-300">Dedicated account manager</span>
                </li>
              </ul>

              {/* CTA button */}
              <a
                href="https://calendly.com/carl-zylora/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20"
              >
                <span>Boka möte</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Back button */}
          <div className="flex justify-center">
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tillbaka</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlanStep;
