import React, { useState } from 'react';
import { Building2, Mail, Lock, Hash, ArrowRight, Loader2, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

interface WelcomeStepProps {
  onboarding: {
    isLoading: boolean;
    error: string | null;
    progress: {
      emailVerified: boolean;
      signupData: {
        companyName: string;
        orgNumber: string;
        email: string;
        password: string;
      } | null;
    };
    saveSignupData: (data: {
      companyName: string;
      orgNumber: string;
      email: string;
      password: string;
    }) => void;
    validateSignupData: (data: {
      companyName: string;
      orgNumber: string;
      email: string;
    }) => Promise<boolean>;
    sendVerificationCode: (email: string) => Promise<boolean>;
    verifyEmailCode: (email: string, code: string) => Promise<boolean>;
    completeStep: (step: 'welcome') => void;
    clearError: () => void;
  };
}

type StepPhase = 'form' | 'verification';

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onboarding }) => {
  const {
    isLoading,
    error,
    progress,
    saveSignupData,
    validateSignupData,
    sendVerificationCode,
    verifyEmailCode,
    completeStep,
    clearError
  } = onboarding;

  const [phase, setPhase] = useState<StepPhase>(
    progress.signupData && !progress.emailVerified ? 'verification' : 'form'
  );
  const [formData, setFormData] = useState({
    companyName: progress.signupData?.companyName || '',
    orgNumber: progress.signupData?.orgNumber || '',
    email: progress.signupData?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
    clearError();
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    setFormError(null);
    clearError();
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
    return true;
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const cleanedData = {
      companyName: formData.companyName,
      orgNumber: formData.orgNumber.replace(/\s/g, ''),
      email: formData.email,
      password: formData.password,
    };

    // Validate against existing records
    const isValid = await validateSignupData({
      companyName: cleanedData.companyName,
      orgNumber: cleanedData.orgNumber,
      email: cleanedData.email,
    });

    if (!isValid) {
      return;
    }

    // Save data to state
    saveSignupData(cleanedData);

    // Send verification code
    const sent = await sendVerificationCode(cleanedData.email);
    if (sent) {
      setCodeSent(true);
      setPhase('verification');
      startResendCooldown();
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (verificationCode.length !== 6) {
      setFormError('Ange den 6-siffriga koden');
      return;
    }

    const email = progress.signupData?.email || formData.email;
    const verified = await verifyEmailCode(email, verificationCode);

    if (verified) {
      completeStep('welcome');
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    const email = progress.signupData?.email || formData.email;
    const sent = await sendVerificationCode(email);
    if (sent) {
      setCodeSent(true);
      startResendCooldown();
    }
  };

  const handleBackToForm = () => {
    setPhase('form');
    setVerificationCode('');
    clearError();
  };

  const displayError = formError || error;

  // Verification code input phase
  if (phase === 'verification') {
    const email = progress.signupData?.email || formData.email;

    return (
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-violet-400" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-white">
            Verifiera din e-post
          </h2>
          <p className="text-gray-400 mt-2">
            Vi har skickat en 6-siffrig kod till
          </p>
          <p className="text-violet-400 font-medium mt-1">{email}</p>
        </div>

        {/* Success message */}
        {codeSent && !displayError && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-400">Verifieringskod skickad!</p>
          </div>
        )}

        {/* Error message */}
        {displayError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{displayError}</p>
          </div>
        )}

        {/* Verification form */}
        <form onSubmit={handleVerifyCode} className="space-y-5">
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-300 mb-2">
              Verifieringskod
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={handleCodeChange}
              placeholder="000000"
              maxLength={6}
              className="w-full text-center text-3xl tracking-[0.5em] py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-mono"
              autoFocus
            />
          </div>

          {/* Verify button */}
          <button
            type="submit"
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifierar...</span>
              </>
            ) : (
              <>
                <span>Verifiera</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Resend code */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Fick du ingen kod?</p>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isLoading || resendCooldown > 0}
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            {resendCooldown > 0 ? (
              <span>Skicka igen om {resendCooldown}s</span>
            ) : (
              <span>Skicka ny kod</span>
            )}
          </button>
        </div>

        {/* Back to form */}
        <button
          type="button"
          onClick={handleBackToForm}
          className="w-full mt-4 text-sm text-gray-500 hover:text-gray-400 transition-colors"
        >
          ← Tillbaka till formuläret
        </button>
      </div>
    );
  }

  // Registration form phase
  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-violet-400" />
        </div>
        <h2 className="text-2xl font-display font-semibold text-white">
          Välkommen till Zylora
        </h2>
        <p className="text-gray-400 mt-2">
          Skapa ditt konto för att komma igång med automatisk inkassohantering
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

        {/* Password */}
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

        {/* Confirm password */}
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
              <span>Fortsätt</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Har du redan ett konto?{' '}
        <a href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
          Logga in
        </a>
      </p>
    </div>
  );
};

export default WelcomeStep;
