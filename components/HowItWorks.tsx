import React, { useState, useEffect, useRef } from 'react';
import { Link, Eye, Zap, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Anslut ekonomisystem",
    description: "Fortnox, Visma eller Björn Lundén — 60 sekunder, sen är du klar.",
    icon: Link,
    color: "blue",
  },
  {
    id: 2,
    title: "Vi tar över dialogen",
    description: "Vårt team ser förfallna fakturor och tar första kontakten.",
    icon: Eye,
    color: "violet",
  },
  {
    id: 3,
    title: "Respektfull uppföljning",
    description: "Vi följer upp i rätt ton tills fakturan är betald.",
    icon: Zap,
    color: "amber",
  },
  {
    id: 4,
    title: "Betalning och rapport",
    description: "Du får tydlig status och resultat — utan att lyfta ett finger.",
    icon: CheckCircle,
    color: "emerald",
  }
];

const colorMap: Record<string, { bg: string; border: string; text: string; activeBg: string }> = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', activeBg: 'bg-blue-500/[0.03]' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', activeBg: 'bg-violet-500/[0.03]' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', activeBg: 'bg-amber-500/[0.03]' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', activeBg: 'bg-emerald-500/[0.03]' },
};

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const activeColors = colorMap[steps[activeStep - 1].color];

  return (
    <section ref={sectionRef} id="process" className="py-14 md:py-20 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute right-[-120px] top-10 w-[520px] h-[520px] bg-violet-500/[0.04] blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute left-[-140px] bottom-[-40px] w-[460px] h-[460px] bg-blue-500/[0.04] blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">

          {/* Left Side: Sticky Navigation */}
          <div className={`lg:sticky lg:top-28 reveal-left ${isVisible ? 'visible' : ''}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-violet-500/30 transition-colors mb-8 hover-glow cursor-default">
              <ArrowRight className="w-4 h-4 text-violet-400" />
              <span className="text-xs uppercase tracking-[0.25em] text-gray-400">Så fungerar det</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-3 md:mb-4 text-white tracking-tight leading-[1.1]">
              Koppla en gång.
              <br />
              <span className="gradient-text">Sen tar vi ansvar.</span>
            </h2>

            <p className="text-gray-400 text-sm sm:text-base mb-6 md:mb-8 leading-relaxed max-w-lg">
              Vårt team tar över dialogen, följer upp i rätt ton och rapporterar tydligt.
            </p>

            <div className={`space-y-3 sm:space-y-4 reveal-stagger ${isVisible ? 'visible' : ''}`}>
              {steps.map((step) => {
                const colors = colorMap[step.color];
                const isActive = activeStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-500 border flex items-center gap-4 group relative overflow-hidden ${
                      isActive
                        ? `glass border-white/20 ${colors.activeBg}`
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? `${colors.bg} ${colors.border} border ${colors.text}`
                        : 'bg-white/5 border border-white/10 text-gray-500 group-hover:border-white/20'
                    }`}>
                      {step.id}
                    </div>

                    <div className="flex-1">
                      <span className={`block font-semibold transition-colors ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                      }`}>
                        {step.title}
                      </span>
                      <span className={`text-xs sm:text-sm transition-colors line-clamp-2 ${
                        isActive ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {step.description}
                      </span>
                    </div>

                    <div className={`w-2 h-2 rounded-full ${colors.bg}`} style={{ background: step.color === 'violet' ? '#8b5cf6' : step.color === 'blue' ? '#3b82f6' : step.color === 'amber' ? '#f59e0b' : '#10b981' }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side: Visualization */}
          <div className={`flex-1 w-full lg:pt-6 reveal-right ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
            <div className="relative group">
              <div className="relative rounded-2xl glass border border-white/10 overflow-hidden min-h-[320px] sm:min-h-[360px] lg:min-h-[420px] flex items-center justify-center p-4 sm:p-5 md:p-6 hover:border-violet-500/20 transition-all duration-500">
                {/* Grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_45%)]" />

                <div className="relative z-10 w-full max-w-md">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-[0.2em]">Zylora Flow</div>
                  </div>
                  {activeStep === 1 && (
                    <div className="glass border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 animate-scale-in hover:border-blue-500/30 transition-colors">
                      <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <div className="text-sm font-semibold text-gray-300">Välj integration</div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                          <span className="text-xs text-blue-400 font-medium">60 sek</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-emerald-500/30 hover:bg-white/[0.05] transition-colors group/item">
                          <div className="w-10 h-10 rounded-xl bg-[#1E6B45] flex items-center justify-center text-white font-bold text-sm group-hover/item:scale-110 transition-transform">
                            FN
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">Fortnox</div>
                          </div>
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors group/item">
                          <div className="w-10 h-10 rounded-xl bg-[#E31837] flex items-center justify-center text-white font-bold text-sm group-hover/item:scale-110 transition-transform">
                            V
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">Visma</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors group/item">
                          <div className="w-10 h-10 rounded-xl bg-[#003366] flex items-center justify-center text-white font-bold text-sm group-hover/item:scale-110 transition-transform">
                            BL
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">Björn Lundén</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 text-center text-sm text-gray-500">
                        Anslut en gång — sen behöver du aldrig göra något mer
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="glass border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 animate-scale-in hover:border-violet-500/30 transition-colors">
                      <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <div className="text-sm font-semibold text-gray-300">Fakturaöversikt</div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-50"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
                          </span>
                          <span className="text-xs text-violet-400 font-mono">LIVE</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[
                          { id: '#1024', days: '5 dagar', status: 'Bevakas', color: 'violet' },
                          { id: '#1019', days: '12 dagar', status: 'Kontaktar', color: 'amber' },
                          { id: '#1015', days: 'Löst igår', status: 'Betald', color: 'emerald' },
                        ].map((invoice, i) => {
                          const invColors = colorMap[invoice.color];
                          return (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all duration-300 group/item cursor-default">
                              <div>
                                <div className="text-white font-medium group-hover/item:text-violet-300 transition-colors">Faktura {invoice.id}</div>
                                <div className="text-sm text-gray-500">{invoice.days}</div>
                              </div>
                              <div className={`text-xs font-medium px-3 py-1.5 rounded-full ${invColors.bg} ${invColors.text} ${invColors.border} border`}>
                                {invoice.status}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-6 text-center text-sm text-gray-500">
                        Veckorapport via mejl varje fredag
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="glass border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 text-center animate-scale-in hover:border-amber-500/30 transition-colors">
                      <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Zap className="w-10 h-10 text-amber-400" />
                      </div>

                      <h3 className="text-xl font-display font-semibold text-white mb-3">Personlig dialog</h3>
                      <p className="text-gray-400 mb-8">
                        Vårt team mejlar, SMSar och ringer era kunder tills fakturan är betald.
                      </p>

                      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-left hover:bg-white/[0.05] transition-colors">
                        <div className="text-xs text-amber-400/70 mb-2">Senaste uppdatering</div>
                        <div className="text-gray-300 italic">
                          "Kunden betalar hela beloppet på fredag."
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div className="text-center animate-scale-in">
                      <div className="relative inline-flex items-center justify-center w-28 h-28 mb-8">
                        <div className="absolute inset-2 rounded-full bg-emerald-500/10 animate-pulse" />
                        <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center pulse-ring">
                          <CheckCircle className="w-10 h-10 text-emerald-400" />
                        </div>
                      </div>

                      <h3 className="text-3xl font-display font-bold text-white mb-3">Betald!</h3>
                      <p className="text-gray-400 text-lg">
                        Fakturan markeras automatiskt i Fortnox
                      </p>

                      <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                        </span>
                        <span className="text-sm text-emerald-400">+15 840 kr inbetald</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
