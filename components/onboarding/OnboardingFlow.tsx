import React from 'react';
import { Check } from 'lucide-react';
import { useOnboarding, OnboardingStep } from '../../hooks/useOnboarding';
import WelcomeStep from './steps/WelcomeStep';
import PlanStep from './steps/PlanStep';
import FortnoxStep from './steps/FortnoxStep';
import CompleteStep from './steps/CompleteStep';

const STEP_LABELS: Record<OnboardingStep, string> = {
  welcome: 'Skapa konto',
  plan: 'Betalning',
  fortnox: 'Integrationer',
  complete: 'Klart',
};

const OnboardingFlow: React.FC = () => {
  const onboarding = useOnboarding();
  const { currentStep, currentStepIndex, totalSteps, steps, progress } = onboarding;

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onboarding={onboarding} />;
      case 'plan':
        return <PlanStep onboarding={onboarding} />;
      case 'fortnox':
        return <FortnoxStep onboarding={onboarding} />;
      case 'complete':
        return <CompleteStep onboarding={onboarding} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Zylora
          </h1>
        </div>

        {/* Progress indicator */}
        <div className="mb-12">
          {/* Desktop progress */}
          <div className="hidden md:flex items-center justify-center">
            {steps.map((step, index) => {
              const isCompleted = progress.completedSteps.includes(step);
              const isCurrent = step === currentStep;
              const isPast = index < currentStepIndex;

              return (
                <React.Fragment key={step}>
                  {/* Step circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                        isCompleted || isPast
                          ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white'
                          : isCurrent
                          ? 'bg-violet-500/20 border-2 border-violet-500 text-violet-400'
                          : 'bg-white/5 border border-white/20 text-gray-500'
                      }`}
                    >
                      {isCompleted || isPast ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm ${
                        isCurrent ? 'text-white font-medium' : 'text-gray-500'
                      }`}
                    >
                      {STEP_LABELS[step]}
                    </span>
                  </div>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-2 ${
                        isCompleted || isPast
                          ? 'bg-gradient-to-r from-violet-600 to-blue-600'
                          : 'bg-white/10'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile progress */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Steg {currentStepIndex + 1} av {totalSteps}
              </span>
              <span className="text-sm text-white font-medium">
                {STEP_LABELS[currentStep]}
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="glass border border-white/10 rounded-2xl p-6 md:p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
