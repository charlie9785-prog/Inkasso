import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Building2,
  Hash,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Bell,
  LayoutDashboard,
} from 'lucide-react';
import { PlanType } from '../../../hooks/useOnboarding';

interface NotificationPreferences {
  weeklyReport: boolean;
  monthlyReport: boolean;
  newCaseTakeover: boolean;
  invoicePaid: boolean;
}

interface DetailsStepProps {
  onboarding: {
    progress: {
      selectedPlan: PlanType;
      signupData: {
        companyName: string;
        orgNumber: string;
        email: string;
        password?: string;
      } | null;
      notificationPreferences: NotificationPreferences;
    };
    isLoading: boolean;
    error: string | null;
    saveSignupData: (data: {
      companyName: string;
      orgNumber: string;
      email: string;
      password?: string;
    }) => void;
    saveNotificationPreferences: (preferences: NotificationPreferences) => void;
    validateSignupData: (data: {
      companyName: string;
      orgNumber: string;
      email: string;
    }) => Promise<boolean>;
    completeStep: (step: 'details') => void;
    goBack: () => void;
    clearError: () => void;
  };
}

const NOTIFICATION_OPTIONS = [
  { key: 'weeklyReport', label: 'Veckorapport (varje fredag)' },
  { key: 'monthlyReport', label: 'Månadsrapport (första vardagen i månaden)' },
  { key: 'newCaseTakeover', label: 'När vi tar över en ny förfallen faktura' },
  { key: 'invoicePaid', label: 'När en faktura blir betald' },
] as const;

const DetailsStep: React.FC<DetailsStepProps> = ({ onboarding }) => {
  const {
    progress,
    isLoading,
    error,
    saveSignupData,
    saveNotificationPreferences,
    validateSignupData,
    completeStep,
    goBack,
    clearError,
  } = onboarding;

  const isB2C = progress.selectedPlan === 'b2c';

  const [formData, setFormData] = useState({
    companyName: progress.signupData?.companyName || '',
    orgNumber: progress.signupData?.orgNumber || '',
    email: progress.signupData?.email || '',
    password: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState<NotificationPreferences>(
    progress.notificationPreferences
  );

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
    clearError();
  };

  const handleNotificationChange = (key: keyof NotificationPreferences) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const validateForm = (): boolean => {
    if (!formData.companyName.trim()) {
      setFormError('Företagsnamn krävs');
      return false;
    }
    if (!formData.orgNumber.trim()) {
      setFormError('Organisationsnummer krävs');
      return false;
    }
    if (!/^\d{6}-?\d{4}$/.test(formData.orgNumber.replace(/\s/g, ''))) {
      setFormError('Ogiltigt organisationsnummer (format: 123456-7890)');
      return false;
    }
    if (!formData.email.trim()) {
      setFormError('E-postadress krävs');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Ogiltig e-postadress');
      return false;
    }

    // B2C: At least one notification must be selected
    if (isB2C) {
      const hasNotification = Object.values(notifications).some((v) => v);
      if (!hasNotification) {
        setFormError('Välj minst en avisering');
        return false;
      }
    }

    // B2B: Password required
    if (!isB2C) {
      if (!formData.password) {
        setFormError('Lösenord krävs');
        return false;
      }
      if (formData.password.length < 8) {
        setFormError('Lösenordet måste vara minst 8 tecken');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setFormError('Lösenorden matchar inte');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const cleanedData = {
      companyName: formData.companyName,
      orgNumber: formData.orgNumber.replace(/\s/g, ''),
      email: formData.email,
      password: isB2C ? undefined : formData.password,
    };

    // Validate against existing records
    const isValid = await validateSignupData({
      companyName: cleanedData.companyName,
      orgNumber: cleanedData.orgNumber,
      email: cleanedData.email,
    });

    if (!isValid) return;

    // Save data
    saveSignupData(cleanedData);
    saveNotificationPreferences(notifications);
    completeStep('details');
  };

  const displayError = formError || error;

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center mb-4">
          {isB2C ? (
            <Bell className="w-8 h-8 text-violet-400" />
          ) : (
            <LayoutDashboard className="w-8 h-8 text-violet-400" />
          )}
        </div>
        <h2 className="text-2xl font-display font-semibold text-white">
          {isB2C ? 'Vart ska vi skicka rapporter?' : 'Skapa ditt konto'}
        </h2>
        <p className="text-gray-400 mt-2">
          {isB2C
            ? 'Ange din mejladress och välj vilka aviseringar du vill ha'
            : 'Du får tillgång till en dashboard där du kan följa alla ärenden i realtid'}
        </p>
      </div>

      {/* Error message */}
      {displayError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{displayError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">
            Företagsnamn
          </label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Ditt Företag AB"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>
        </div>

        {/* Org number */}
        <div>
          <label htmlFor="orgNumber" className="block text-sm font-medium text-gray-300 mb-2">
            Organisationsnummer
          </label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              id="orgNumber"
              name="orgNumber"
              value={formData.orgNumber}
              onChange={handleChange}
              placeholder="123456-7890"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            E-postadress
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="namn@foretag.se"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>
        </div>

        {/* B2B: Password fields */}
        {!isB2C && (
          <>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Lösenord
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minst 8 tecken"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Bekräfta lösenord
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Skriv lösenordet igen"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>
          </>
        )}

        {/* Notification preferences */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            {isB2C ? 'Välj aviseringar (minst en)' : 'E-postaviseringar (valfritt)'}
          </label>
          <div className="space-y-3">
            {NOTIFICATION_OPTIONS.map((option) => (
              <label
                key={option.key}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={notifications[option.key]}
                    onChange={() => handleNotificationChange(option.key)}
                    className="sr-only peer"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                    notifications[option.key]
                      ? 'bg-violet-500 border-violet-500'
                      : 'border-white/30 group-hover:border-white/50'
                  }`}>
                    {notifications[option.key] && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Validerar...</span>
            </>
          ) : (
            <>
              <span>Fortsätt till betalning</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

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

export default DetailsStep;
