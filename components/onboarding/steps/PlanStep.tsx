import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Check,
  Loader2,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

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
    clearError: () => void;
  };
}

// Single plan
const PLANS: Plan[] = [
  {
    id: import.meta.env.VITE_STRIPE_PRICE_ID || 'price_1Ssmj9Rou0T9LBA6uwL6eYoT',
    name: 'Standard',
    description: 'Komplett betalningsuppföljning för ditt företag',
    price: 1900,
    currency: 'SEK',
    interval: 'month',
    popular: true,
    features: [
      'Obegränsade ärenden',
      'Automatiska påminnelser (E-post, SMS, Telefon)',
      'Fortnox-integration',
      '10% success fee (max 10 000 kr/faktura)',
      'Avancerade rapporter',
      'Prioriterad support',
    ],
  },
];

const PlanStep: React.FC<PlanStepProps> = ({ onboarding }) => {
  const { progress, goBack, completeStep, setPlanSelected, createCheckoutWithSignup, isLoading, error } = onboarding;
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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
    if (params.get('payment') === 'success') {
      setPlanSelected(true);
      completeStep('plan');
    }
  }, [completeStep, setPlanSelected]);

  return (
    <div className="max-w-4xl mx-auto">
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
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-1 max-w-md mx-auto gap-6 mb-8">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative glass border rounded-2xl p-6 transition-all ${
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
                      <span>Populärast</span>
                    </div>
                  </div>
                )}

                {/* Plan header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-display font-semibold text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.currency}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    /{plan.interval === 'month' ? 'månad' : 'år'}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Select button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCreatingCheckout}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.popular
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  {isCreatingCheckout && selectedPlan === plan.id ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Förbereder...</span>
                    </>
                  ) : (
                    <span>Välj {plan.name}</span>
                  )}
                </button>
              </div>
            ))}
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
