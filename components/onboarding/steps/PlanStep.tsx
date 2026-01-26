import React from 'react';
import {
  CreditCard,
  Check,
  Sparkles,
  ArrowRight,
  Users,
  Building2,
} from 'lucide-react';
import { PlanType } from '../../../hooks/useOnboarding';

interface PlanStepProps {
  onboarding: {
    progress: {
      selectedPlan: PlanType;
    };
    selectPlan: (plan: PlanType) => void;
    completeStep: (step: 'plan') => void;
  };
}

interface Plan {
  id: PlanType;
  name: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
  icon: React.ElementType;
}

const PLANS: Plan[] = [
  {
    id: 'b2c',
    name: 'B2C',
    description: 'För dig som fakturerar privatpersoner',
    price: 1900,
    icon: Users,
    features: [
      'Vårt team driver in era förfallna fakturor',
      'Veckorapport via mejl',
      'Ingen startavgift',
      'Ingen bindningstid',
      'Bevarade kundrelationer',
    ],
  },
  {
    id: 'b2b',
    name: 'B2B',
    description: 'För dig som fakturerar andra företag',
    price: 3900,
    popular: true,
    icon: Building2,
    features: [
      'Vårt team driver in era förfallna fakturor',
      'Dashboard med realtidsöversikt',
      'Ingen startavgift',
      'Ingen bindningstid',
      'Bevarade kundrelationer',
    ],
  },
];

const PlanStep: React.FC<PlanStepProps> = ({ onboarding }) => {
  const { selectPlan, completeStep } = onboarding;

  const handleSelectPlan = (planId: PlanType) => {
    selectPlan(planId);
    completeStep('plan');
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-violet-400" />
        </div>
        <h2 className="text-2xl font-display font-semibold text-white">
          Välj din plan
        </h2>
        <p className="text-gray-400 mt-2">
          Välj den plan som passar ditt företag bäst
        </p>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {PLANS.map((plan) => {
          const PlanIcon = plan.icon;
          return (
            <div
              key={plan.id}
              className={`relative glass border rounded-2xl p-6 transition-all flex flex-col cursor-pointer group hover:scale-[1.02] ${
                plan.popular
                  ? 'border-violet-500/50 ring-1 ring-violet-500/20'
                  : 'border-white/10 hover:border-white/30'
              }`}
              onClick={() => handleSelectPlan(plan.id)}
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
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.popular
                    ? 'bg-violet-500/20 border border-violet-500/30'
                    : 'bg-white/5 border border-white/10'
                }`}>
                  <PlanIcon className={`w-5 h-5 ${plan.popular ? 'text-violet-400' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold text-white">
                    {plan.name}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">{plan.description}</p>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{plan.price.toLocaleString('sv-SE')}</span>
                  <span className="text-sm text-gray-400">kr/mån</span>
                </div>
                <p className={`text-xs mt-1 ${plan.popular ? 'text-violet-400/80' : 'text-gray-500'}`}>
                  + 10% success fee
                </p>
                <p className={`text-xs ${plan.popular ? 'text-violet-400/60' : 'text-gray-600'}`}>
                  {plan.id === 'b2c' ? 'Max 10 000 kr/faktura' : 'Max 30 000 kr/faktura'}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-green-400' : 'text-gray-500'}`} />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Select button */}
              <button
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 group-hover:border-white/20'
                }`}
              >
                <span>Välj {plan.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Info text */}
      <p className="text-center text-sm text-gray-500">
        Alla priser exkl. moms. Ingen bindningstid.
      </p>
    </div>
  );
};

export default PlanStep;
