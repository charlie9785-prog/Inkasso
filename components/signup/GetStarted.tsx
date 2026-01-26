import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, ExternalLink, Phone, Building2, Mail, User, Loader2 } from 'lucide-react';
import { navigate } from '../../lib/navigation';

// Fortnox logo as SVG
const FortnoxLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <text x="0" y="18" fontSize="16" fontWeight="bold" fill="#2B9B5B">FN</text>
  </svg>
);

interface CompanyData {
  company_name: string;
  org_number: string;
  email: string;
  phone: string;
  fortnox_tenant_id: string;
}

type Step = 'connect' | 'confirm' | 'complete';

const SUPABASE_URL = 'https://bosofhcunxbvfusvllsm.supabase.co';

const GetStarted: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('connect');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData>({
    company_name: '',
    org_number: '',
    email: '',
    phone: '',
    fortnox_tenant_id: '',
  });

  // Check for OAuth callback on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fortnoxSuccess = params.get('fortnox_success');
    const tenantId = params.get('tenant_id');
    const companyName = params.get('company_name');
    const orgNumber = params.get('org_number');
    const email = params.get('email');

    if (fortnoxSuccess === 'true' && tenantId) {
      setCompanyData({
        company_name: companyName || '',
        org_number: orgNumber || '',
        email: email || '',
        phone: '',
        fortnox_tenant_id: tenantId,
      });
      setCurrentStep('confirm');
      // Clean URL
      window.history.replaceState({}, '', '/kom-igang');
    }

    const fortnoxError = params.get('fortnox_error');
    if (fortnoxError) {
      setError('Kunde inte ansluta till Fortnox. Försök igen.');
      window.history.replaceState({}, '', '/kom-igang');
    }
  }, []);

  const startFortnoxOAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/fortnox-oauth?action=authorize&signup=true`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error('Kunde inte starta anslutning');
      }

      const data = await response.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (err) {
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
          phone: companyData.phone || undefined,
          fortnox_tenant_id: companyData.fortnox_tenant_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Kunde inte skapa konto');
      }

      setCurrentStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel');
    } finally {
      setIsLoading(false);
    }
  };

  const stepNumber = currentStep === 'connect' ? 1 : currentStep === 'confirm' ? 2 : 3;

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
            <span className="text-sm text-gray-400">Steg {stepNumber} av 3</span>
            <span className="text-sm text-white font-medium">
              {currentStep === 'connect' && 'Koppla bokföring'}
              {currentStep === 'confirm' && 'Bekräfta uppgifter'}
              {currentStep === 'complete' && 'Klart!'}
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-500"
              style={{ width: `${(stepNumber / 3) * 100}%` }}
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

                {/* Visma - Coming soon */}
                <div className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1A1F71]/20 flex items-center justify-center">
                      <span className="text-[#1A1F71] font-bold text-lg opacity-50">V</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-500">Visma</div>
                      <div className="text-sm text-gray-600">Kommer snart</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 px-2 py-1 rounded-full bg-white/5">Kommer snart</span>
                </div>

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
                <span className="font-medium">Fortnox kopplat!</span>
              </div>

              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Bekräfta dina uppgifter
              </h2>
              <p className="text-gray-400 mb-8">
                Vi har hämtat informationen från Fortnox
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
                disabled={isLoading || !companyData.company_name || !companyData.org_number || !companyData.email}
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

          {/* Step 3: Complete */}
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
                      <div className="text-sm text-gray-400">från Fortnox varje dag</div>
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
                      <div className="text-white">Du betalar 5% på återvunnet belopp</div>
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
                <a href="tel:0729626822" className="text-violet-400 hover:text-violet-300">072-962 68 22</a>
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
