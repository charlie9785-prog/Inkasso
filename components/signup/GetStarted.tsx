import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, ExternalLink, Phone, Building2, Mail, Lock, Loader2, Eye, EyeOff, FileText, Clock, CheckCircle, PartyPopper } from 'lucide-react';
import { navigate } from '../../lib/navigation';
import { supabase } from '../../lib/supabase';

interface CompanyData {
  company_name: string;
  org_number: string;
  email: string;
  phone: string;
  password: string;
  fortnox_state: string;
  visma_state: string;
  connectedSystem: 'fortnox' | 'visma' | null;
}

interface OverdueInvoice {
  invoice_number: string;
  customer_name: string;
  amount: number;
  days_overdue: number;
  has_email: boolean;
  has_phone: boolean;
}

interface ActivationData {
  overdue_invoices: OverdueInvoice[];
  total_count: number;
  example_invoice: OverdueInvoice | null;
}

type Step = 'connect' | 'confirm' | 'activation' | 'complete';

const SUPABASE_URL = 'https://bosofhcunxbvfusvllsm.supabase.co';

const GetStarted: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('connect');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData>(() => {
    // Try to restore connectedSystem from sessionStorage
    const savedSystem = sessionStorage.getItem('zylora_connected_system') as 'fortnox' | 'visma' | null;
    return {
      company_name: '',
      org_number: '',
      email: '',
      phone: '',
      password: '',
      fortnox_state: '',
      visma_state: '',
      connectedSystem: savedSystem,
    };
  });
  const [showPassword, setShowPassword] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [activationData, setActivationData] = useState<ActivationData | null>(null);
  const [activationLoading, setActivationLoading] = useState(false);

  // Check for OAuth callback on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname;
    const state = params.get('state');
    const companyName = params.get('company_name');
    const orgNumber = params.get('org_number');
    const email = params.get('email');
    const phone = params.get('phone');
    const provider = params.get('provider'); // 'fortnox' or 'visma'

    // Coming back from OAuth with state token (either Fortnox or Visma)
    // Works for both /kom-igang and /kom-igang/bekrafta
    if (state && provider) {
      const isVisma = provider === 'visma';
      const connectedSystem = isVisma ? 'visma' : 'fortnox';
      // Save to sessionStorage for persistence
      sessionStorage.setItem('zylora_connected_system', connectedSystem);
      setCompanyData(prev => ({
        ...prev,
        company_name: companyName ? decodeURIComponent(companyName) : prev.company_name,
        org_number: orgNumber ? decodeURIComponent(orgNumber) : prev.org_number,
        email: email ? decodeURIComponent(email) : prev.email,
        phone: phone ? decodeURIComponent(phone) : prev.phone,
        fortnox_state: isVisma ? '' : state,
        visma_state: isVisma ? state : '',
        connectedSystem,
      }));
      setCurrentStep('confirm');
      // Clean URL but stay on current path
      window.history.replaceState({}, '', pathname.includes('/bekrafta') ? '/kom-igang/bekrafta' : '/kom-igang');
    }

    // Handle /kom-igang/bekrafta path without OAuth params (direct navigation)
    if (pathname === '/kom-igang/bekrafta' || pathname.includes('/bekrafta')) {
      setCurrentStep('confirm');
    }

    // Handle /kom-igang/klart path
    if (pathname === '/kom-igang/klart') {
      setCurrentStep('complete');
    }

    const oauthError = params.get('error');
    if (oauthError) {
      const errorProvider = provider === 'visma' ? 'Visma' : 'Fortnox';
      setError(`Kunde inte ansluta till ${errorProvider}. Försök igen.`);
      window.history.replaceState({}, '', '/kom-igang');
    }
  }, []);

  const startFortnoxOAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/fortnox-oauth?action=authorize&mode=signup`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          redirect: 'follow',
        }
      );

      console.log('OAuth response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OAuth error:', errorText);
        throw new Error('Kunde inte starta anslutning');
      }

      const data = await response.json();
      console.log('OAuth data:', data);

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error('Ingen authorization_url i svaret');
      }
    } catch (err) {
      console.error('OAuth fetch error:', err);
      setError('Något gick fel. Försök igen.');
      setIsLoading(false);
    }
  };

  const startVismaOAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/visma-oauth?action=authorize&mode=signup`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          redirect: 'follow',
        }
      );

      console.log('Visma OAuth response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Visma OAuth error:', errorText);
        throw new Error('Kunde inte starta anslutning');
      }

      const data = await response.json();
      console.log('Visma OAuth data:', data);

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error('Ingen authorization_url i svaret');
      }
    } catch (err) {
      console.error('Visma OAuth fetch error:', err);
      setError('Något gick fel. Försök igen.');
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyData.company_name,
          org_number: companyData.org_number,
          email: companyData.email,
          password: companyData.password,
          phone: companyData.phone || undefined,
          fortnox_state: companyData.fortnox_state || undefined,
          visma_state: companyData.visma_state || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Kunde inte skapa konto');
      }

      const data = await response.json();

      // Save tenant ID for activation
      if (data.tenant?.id) {
        setTenantId(data.tenant.id);
      }

      // If signup returns session tokens, set the session
      if (data.session?.access_token && data.session?.refresh_token) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        // Go to activation step
        setCurrentStep('activation');
        // Fetch overdue invoices
        fetchOverdueInvoices(data.tenant?.id);
      } else {
        // Fallback: try to log in with the credentials
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: companyData.email,
          password: companyData.password,
        });

        if (loginError) {
          console.error('Auto-login failed:', loginError);
          // Show complete step if auto-login fails
          setCurrentStep('complete');
        } else {
          // Go to activation step
          setCurrentStep('activation');
          // Fetch overdue invoices
          fetchOverdueInvoices(data.tenant?.id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOverdueInvoices = async (tId?: string) => {
    const targetTenantId = tId || tenantId;
    if (!targetTenantId) return;

    setActivationLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-overdue-invoices', {
        body: { tenant_id: targetTenantId }
      });

      if (error) {
        console.error('Error fetching overdue invoices:', error);
        // Still allow proceeding even if fetch fails
        setActivationData({ overdue_invoices: [], total_count: 0, example_invoice: null });
        return;
      }

      setActivationData(data);
    } catch (err) {
      console.error('Error fetching overdue invoices:', err);
      setActivationData({ overdue_invoices: [], total_count: 0, example_invoice: null });
    } finally {
      setActivationLoading(false);
    }
  };

  const handleActivate = async () => {
    setIsLoading(true);
    try {
      // Activate the tenant
      const { error } = await supabase.functions.invoke('activate-tenant', {
        body: { tenant_id: tenantId }
      });

      if (error) {
        console.error('Error activating tenant:', error);
      }

      // Clear signup sessionStorage
      sessionStorage.removeItem('zylora_connected_system');
      // Go to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error activating tenant:', err);
      // Still go to dashboard
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipActivation = () => {
    // Clear signup sessionStorage
    sessionStorage.removeItem('zylora_connected_system');
    // Go to dashboard without activating
    navigate('/dashboard');
  };

  const stepNumber = currentStep === 'connect' ? 1 : currentStep === 'confirm' ? 2 : currentStep === 'activation' ? 3 : 4;
  const totalSteps = 4;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Zylora
            </h1>
          </a>
        </div>

        {/* Progress indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Steg {stepNumber} av {totalSteps}</span>
            <span className="text-sm text-white font-medium">
              {currentStep === 'connect' && 'Koppla bokföring'}
              {currentStep === 'confirm' && 'Skapa konto'}
              {currentStep === 'activation' && 'Starta uppföljning'}
              {currentStep === 'complete' && 'Klart!'}
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-500"
              style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-6 md:p-8">
          {/* Step 1: Connect */}
          {currentStep === 'connect' && (
            <div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Koppla ditt bokföringssystem
              </h2>
              <p className="text-gray-400 mb-8">
                60 sekunder — sen sköter vi resten
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                {/* Fortnox - Active */}
                <button
                  onClick={startFortnoxOAuth}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#2B9B5B]/20 flex items-center justify-center">
                      <span className="text-[#2B9B5B] font-bold text-lg">FN</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">Fortnox</div>
                      <div className="text-sm text-gray-400">Anslut med ett klick</div>
                    </div>
                  </div>
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                  )}
                </button>

                {/* Visma - Active */}
                <button
                  onClick={startVismaOAuth}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1A1F71]/20 flex items-center justify-center">
                      <span className="text-[#E91E63] font-bold text-lg">V</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">Visma</div>
                      <div className="text-sm text-gray-400">Anslut med ett klick</div>
                    </div>
                  </div>
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                  )}
                </button>

                {/* Björn Lundén - Coming soon */}
                <div className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#003366]/20 flex items-center justify-center">
                      <span className="text-[#003366] font-bold text-lg opacity-50">BL</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-500">Björn Lundén</div>
                      <div className="text-sm text-gray-600">Kommer snart</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 px-2 py-1 rounded-full bg-white/5">Kommer snart</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-gray-500 text-sm mb-2">Använder du ett annat system?</p>
                <a
                  href="https://calendly.com/carl-zylora/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
                >
                  Kontakta oss
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Step 2: Confirm */}
          {currentStep === 'confirm' && (
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-4">
                <Check className="w-5 h-5" />
                <span className="font-medium">
                  {companyData.connectedSystem === 'visma' ? 'Visma kopplat!' : 'Fortnox kopplat!'}
                </span>
              </div>

              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Bekräfta dina uppgifter
              </h2>
              <p className="text-gray-400 mb-8">
                Vi har hämtat informationen från {companyData.connectedSystem === 'visma' ? 'Visma' : 'Fortnox'}
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Företagsnamn
                  </label>
                  <input
                    type="text"
                    value={companyData.company_name}
                    onChange={(e) => setCompanyData({ ...companyData, company_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-violet-500/50 focus:outline-none transition-colors"
                    placeholder="AB Företaget"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Organisationsnummer
                  </label>
                  <input
                    type="text"
                    value={companyData.org_number}
                    onChange={(e) => setCompanyData({ ...companyData, org_number: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-violet-500/50 focus:outline-none transition-colors"
                    placeholder="556123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    E-post för rapporter & fakturor
                  </label>
                  <input
                    type="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-violet-500/50 focus:outline-none transition-colors"
                    placeholder="anna@foretaget.se"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Lösenord
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={companyData.password}
                      onChange={(e) => setCompanyData({ ...companyData, password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-violet-500/50 focus:outline-none transition-colors"
                      placeholder="Minst 8 tecken"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Telefon <span className="text-gray-500">(valfritt)</span>
                  </label>
                  <input
                    type="tel"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-violet-500/50 focus:outline-none transition-colors"
                    placeholder="070-123 45 67"
                  />
                </div>
              </div>

              <button
                onClick={handleSignup}
                disabled={isLoading || !companyData.company_name || !companyData.org_number || !companyData.email || !companyData.password || companyData.password.length < 8}
                className="w-full mt-8 h-14 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="font-semibold text-white">Skapa konto</span>
                    <ArrowRight className="w-5 h-5 text-white" />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-sm text-gray-500">
                Genom att fortsätta godkänner du våra{' '}
                <a href="/villkor" className="text-violet-400 hover:text-violet-300">villkor</a>
                {' '}och{' '}
                <a href="/integritetspolicy" className="text-violet-400 hover:text-violet-300">integritetspolicy</a>.
              </p>
            </div>
          )}

          {/* Step 3: Activation */}
          {currentStep === 'activation' && (
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-6">
                <Check className="w-5 h-5" />
                <span className="font-medium">
                  {companyData.connectedSystem === 'visma' ? 'Visma' : 'Fortnox'} kopplat!
                </span>
              </div>

              {activationLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Hämtar förfallna fakturor...</p>
                </div>
              ) : activationData && activationData.total_count > 0 ? (
                <>
                  <h2 className="text-2xl font-display font-bold text-white mb-2">
                    Vi hittade {activationData.total_count} förfallna fakturor
                  </h2>
                  <p className="text-gray-400 mb-6">
                    med kontaktuppgifter som vi kan följa upp
                  </p>

                  {/* Example Invoice */}
                  {activationData.example_invoice && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Exempel</div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-violet-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-white">
                              Faktura #{activationData.example_invoice.invoice_number}
                            </span>
                            <span className="text-lg font-bold text-white">
                              {formatCurrency(activationData.example_invoice.amount)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 mb-2">
                            {activationData.example_invoice.customer_name}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-amber-400">
                              <Clock className="w-4 h-4" />
                              <span>Förfallen: {activationData.example_invoice.days_overdue} dagar</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            {activationData.example_invoice.has_email && (
                              <div className="flex items-center gap-1 text-xs text-emerald-400">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Email finns</span>
                              </div>
                            )}
                            {activationData.example_invoice.has_phone && (
                              <div className="flex items-center gap-1 text-xs text-emerald-400">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Telefon finns</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-gray-300 mb-6">
                    Vill du att vi börjar följa upp era förfallna fakturor?
                  </p>

                  <button
                    onClick={handleActivate}
                    disabled={isLoading}
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mb-4"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span className="font-semibold text-white">Starta uppföljning</span>
                        <ArrowRight className="w-5 h-5 text-white" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSkipActivation}
                    className="w-full text-center text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Vänta, jag vill kolla först
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center py-6">
                    <div className="text-5xl mb-4">🎉</div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2">
                      Inga förfallna fakturor just nu
                    </h2>
                    <p className="text-gray-400 mb-6">
                      Vi håller koll. Så fort en faktura blir 7 dagar förfallen börjar vi följa upp automatiskt.
                    </p>
                  </div>

                  <button
                    onClick={handleActivate}
                    disabled={isLoading}
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span className="font-semibold text-white">Gå till dashboard</span>
                        <ArrowRight className="w-5 h-5 text-white" />
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 'complete' && (
            <div className="text-center">
              <div className="text-6xl mb-6">🎉</div>

              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Välkommen till Zylora!
              </h2>
              <p className="text-gray-400 mb-8">
                Vi börjar följa upp dina förfallna fakturor automatiskt.
                <br />Du får en veckorapport varje måndag.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-white mb-4">Vad händer nu?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white">Vi hämtar förfallna fakturor</div>
                      <div className="text-sm text-gray-400">från {companyData.connectedSystem === 'visma' ? 'Visma' : companyData.connectedSystem === 'fortnox' ? 'Fortnox' : 'ditt bokföringssystem'} varje dag</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white">Fakturor 7+ dagar förfallna</div>
                      <div className="text-sm text-gray-400">får professionell uppföljning</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white">Du betalar 5% på betalningar som kommer in</div>
                      <div className="text-sm text-gray-400">max 5 000 kr per faktura</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2"
              >
                <span className="font-semibold text-white">Gå till dashboard</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </button>

              <p className="mt-6 text-sm text-gray-500">
                Har du frågor? Ring{' '}
                <a href="mailto:supprt@zylora.se" className="text-violet-400 hover:text-violet-300">supprt@zylora.se</a>
              </p>
            </div>
          )}
        </div>

        {/* Back to home link */}
        {currentStep === 'connect' && (
          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tillbaka till startsidan
            </a>
          </div>
        )}

        {/* Calendly alternative */}
        {currentStep === 'connect' && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Vill du prata med oss först?{' '}
              <a
                href="https://calendly.com/carl-zylora/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                Boka ett samtal
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStarted;
