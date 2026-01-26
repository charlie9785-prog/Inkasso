import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Check,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { PlanType } from '../../../hooks/useOnboarding';

interface PaymentStepProps {
  onboarding: {
    progress: {
      selectedPlan: PlanType;
      signupData: {
        companyName: string;
        orgNumber: string;
        email: string;
        password?: string;
      } | null;
    };
    isLoading: boolean;
    error: string | null;
    createCheckoutWithSignup: (planId: string, successUrl: string, cancelUrl: string) => Promise<string | null>;
    loginAfterPayment: () => Promise<boolean>;
    completeStep: (step: 'payment') => void;
    goBack: () => void;
    clearError: () => void;
  };
}

const PLAN_PRICES = {
  b2c: {
    priceId: import.meta.env.VITE_STRIPE_PRICE_ID_B2C || 'price_b2c',
    amount: 1900,
    name: 'B2C',
  },
  b2b: {
    priceId: import.meta.env.VITE_STRIPE_PRICE_ID || 'price_1StEi8Rou0T9LBA6HiX2RbJ9',
    amount: 3900,
    name: 'B2B',
  },
};

const PaymentStep: React.FC<PaymentStepProps> = ({ onboarding }) => {
  const {
    progress,
    isLoading,
    error,
    createCheckoutWithSignup,
    loginAfterPayment,
    completeStep,
    goBack,
    clearError,
  } = onboarding;

  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const planConfig = progress.selectedPlan ? PLAN_PRICES[progress.selectedPlan] : null;

  const handlePayment = async () => {
    if (!planConfig) return;

    setIsCreatingCheckout(true);
    clearError();

    const successUrl = `${window.location.origin}/onboarding?payment=success`;
    const cancelUrl = `${window.location.origin}/onboarding?payment=cancelled`;

    const checkoutUrl = await createCheckoutWithSignup(planConfig.priceId, successUrl, cancelUrl);

    setIsCreatingCheckout(false);

    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  // Check if returning from successful payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' && !isLoggingIn) {
      setIsLoggingIn(true);

      loginAfterPayment().then((success) => {
        if (success) {
          completeStep('payment');
        }
        setIsLoggingIn(false);
        window.history.replaceState({}, '', window.location.pathname);
      });
    }
  }, [completeStep, loginAfterPayment, isLoggingIn]);

  if (!planConfig) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Ingen plan vald. Gå tillbaka och välj en plan.</p>
        <button
          onClick={goBack}
          className="mt-4 text-violet-400 hover:text-violet-300 transition-colors"
        >
          ← Tillbaka
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-violet-400" />
        </div>
        <h2 className="text-2xl font-display font-semibold text-white">
          Slutför betalning
        </h2>
        <p className="text-gray-400 mt-2">
          Säker betalning via Stripe
        </p>
      </div>

      {/* Loading state */}
      {(isLoading || isLoggingIn) && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          <span className="ml-3 text-gray-400">
            {isLoggingIn ? 'Förbereder ditt konto...' : 'Laddar...'}
          </span>
        </div>
      )}

      {/* Error message */}
      {error && !isLoading && !isLoggingIn && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {!isLoading && !isLoggingIn && (
        <>
          {/* Order summary */}
          <div className="glass border border-white/10 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-medium text-white mb-4">Orderöversikt</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Plan</span>
                <span className="text-white font-medium">{planConfig.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Månadsavgift</span>
                <span className="text-white font-medium">{planConfig.amount.toLocaleString('sv-SE')} kr</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Success fee</span>
                <span className="text-white font-medium">10%</span>
              </div>
              <div className="border-t border-white/10 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Idag betalar du</span>
                  <span className="text-xl text-white font-bold">{planConfig.amount.toLocaleString('sv-SE')} kr</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">exkl. moms</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2 mb-6">
            {[
              'Ingen bindningstid',
              'Avsluta när du vill',
              'Säker betalning via Stripe',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-400" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Terms acceptance */}
          <label className="flex items-start gap-3 mb-6 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                termsAccepted
                  ? 'bg-violet-500 border-violet-500'
                  : 'border-white/30 group-hover:border-white/50'
              }`}>
                {termsAccepted && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
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

          {/* Pay button */}
          <button
            onClick={handlePayment}
            disabled={isCreatingCheckout || !termsAccepted}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingCheckout ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Förbereder betalning...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Betala {planConfig.amount.toLocaleString('sv-SE')} kr</span>
              </>
            )}
          </button>

          {/* Stripe badge */}
          <p className="text-center text-xs text-gray-500 mt-4">
            Säker betalning hanteras av Stripe
          </p>

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
        </>
      )}
    </div>
  );
};

export default PaymentStep;
