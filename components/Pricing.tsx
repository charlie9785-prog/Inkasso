import React, { useEffect, useRef, useState } from 'react';
import { Check, CreditCard, Receipt, Shield, ArrowRight, HelpCircle, Zap } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const mainFeatures = [
  'Vårt team tar hand om era förfallna fakturor',
  'Dashboard med realtidsöversikt',
  'Ingen startavgift',
  'Ingen bindningstid',
  'Bevarade kundrelationer'
];


const Pricing = () => {
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

  return (
    <section ref={sectionRef} id="pricing" className="py-14 md:py-20 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-[-80px] left-1/4 w-[500px] h-[500px] bg-violet-500/[0.05] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-80px] right-1/4 w-[400px] h-[400px] bg-blue-500/[0.04] blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className={`mb-16 reveal ${isVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <CreditCard className="w-4 h-4 text-violet-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-gray-300">Priser & betalning</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-10">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-4 tracking-tight leading-[1.1]">
                <span className="text-white">Superenkel prissättning.</span>
                <br />
                <span className="gradient-text">Du betalar bara vid resultat.</span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
                Ingen månadsavgift. Ingen startavgift. Tydligt och tryggt.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {['Ingen startavgift', 'Ingen bindningstid', 'Du betalar vid resultat'].map((label) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-400"
                >
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400/70" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main pricing card */}
        <div className={`max-w-5xl mx-auto mb-14 reveal-scale ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
          <div className="relative">
            {/* Card */}
            <div className="relative bg-[#0d0d1a] border border-white/10 rounded-[36px] overflow-hidden shadow-[0_30px_80px_rgba(10,10,30,0.6)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.1),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.1),transparent_45%)]" />
              {/* Main pricing */}
              <div className="relative z-10 p-5 sm:p-6 md:p-8 text-center">
                {/* Big zero */}
                <div className="mb-8">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-2">
                    <AnimatedCounter end={0} suffix=" kr" duration={1500} />
                  </div>
                  <div className="text-base sm:text-lg text-gray-400 font-medium">
                    i månadsavgift
                  </div>
                </div>

                {/* Success fee highlight */}
                <div className="inline-flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl bg-violet-500/10 border border-violet-500/30 mb-6">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
                  <div className="text-left">
                    <div className="text-lg sm:text-xl font-display font-bold text-white"><AnimatedCounter end={5} suffix="%" duration={1500} /> success fee</div>
                    <div className="text-gray-300">på betalningar som kommer in</div>
                  </div>
                </div>

                {/* Simple explanation */}
                <p className="text-gray-300 text-sm sm:text-base mb-6 max-w-md mx-auto">
                  Vi tar 5% på betalningar som kommer in. Max 5 000 kr per faktura. Ingen betalning — ingen kostnad.
                </p>

                <div className="mb-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <div className="glass border border-white/10 rounded-2xl px-4 py-3 text-left min-w-[180px]">
                    <p className="text-xs text-gray-500">Exempel faktura</p>
                    <p className="text-lg font-semibold text-white">10 000 kr</p>
                  </div>
                  <div className="glass border border-white/10 rounded-2xl px-4 py-3 text-left min-w-[180px]">
                    <p className="text-xs text-gray-500">Avgift (5%)</p>
                    <p className="text-lg font-semibold text-emerald-400">500 kr</p>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="/kom-igang"
                  className="group/btn inline-flex items-center justify-center h-11 sm:h-12 px-6 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all duration-300 w-full sm:w-auto"
                >
                  <span className="inline-flex items-center justify-center text-base font-semibold text-white">
                    Kom igång gratis
                    <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </a>
              </div>

              {/* Features */}
              <div className="relative z-10 border-t border-white/10 p-5 sm:p-6 md:p-8 bg-white/[0.02]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mainFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple 3-step row */}
        <div className={`max-w-5xl mx-auto mb-16 reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '260ms' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: '1. Anslut', desc: 'Koppla Fortnox, Visma eller Björn Lundén.' },
              { title: '2. Vi följer upp', desc: 'Vi tar dialogen i rätt ton.' },
              { title: '3. Du betalar vid resultat', desc: 'Ingen betalning, ingen kostnad.' },
            ].map((step) => (
              <div key={step.title} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full blur-[70px] opacity-60 bg-violet-500/10" />
                <p className="relative text-sm font-semibold text-white mb-1">{step.title}</p>
                <p className="relative text-sm text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Volume discount section */}
        <div className={`max-w-6xl mx-auto mb-16 reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '320ms' }}>
          <h3 className="text-center text-xl font-display font-semibold text-white mb-8">
            Volymrabatt — uppgraderas automatiskt
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Starter */}
            <div className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-violet-500/15 border-2 border-violet-500/40 shadow-[0_20px_50px_rgba(139,92,246,0.2)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-violet-500 text-white text-xs font-semibold">
                  Din start
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-display font-bold text-white text-center mb-4">Starter</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-300">Success fee</span>
                  <span className="text-2xl font-display font-bold text-white"><AnimatedCounter end={5} suffix="%" duration={1500} /></span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-300">Max per faktura</span>
                  <span className="text-lg font-semibold text-white">5 000 kr</span>
                </div>
              </div>
            </div>

            {/* Growth */}
            <div className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-colors">
              <h4 className="text-lg sm:text-xl font-display font-bold text-white text-center mb-1">Growth</h4>
              <p className="text-sm text-gray-400 text-center mb-4">50+ ärenden</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-300">Success fee</span>
                  <span className="text-2xl font-display font-bold text-white"><AnimatedCounter end={4} suffix="%" duration={1500} /></span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-300">Max per faktura</span>
                  <span className="text-lg font-semibold text-white">15 000 kr</span>
                </div>
              </div>
            </div>

            {/* Enterprise */}
            <div className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-colors">
              <h4 className="text-lg sm:text-xl font-display font-bold text-white text-center mb-1">Enterprise</h4>
              <p className="text-sm text-gray-400 text-center mb-4">Kontakta oss</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-300">Success fee</span>
                  <span className="text-2xl font-display font-bold text-white"><AnimatedCounter end={3} suffix="%" duration={1500} /></span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-300">Cap</span>
                  <span className="text-lg font-semibold text-white">Förhandlas</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-400 mt-8">
            Du startar på Starter. Vi uppgraderar dig automatiskt när du växer.
          </p>
        </div>

        <p className="text-center text-gray-400 text-sm mb-16">
          Alla priser anges exkl. moms
        </p>

        {/* How payment works */}
        <div className="max-w-5xl mx-auto">
          <h3 className={`text-xl md:text-2xl font-display font-bold text-white text-center mb-8 reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '400ms' }}>
            Hur betalningen fungerar
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Receipt, title: 'Ingen månadsavgift', desc: 'Ingen fast kostnad. Ingen startavgift. Ingen bindningstid.', color: 'violet' },
              { icon: CreditCard, title: '5% success fee', desc: 'Vi tar 5% på betalningar som kommer in. Max 5 000 kr per faktura.', color: 'blue' },
              { icon: Shield, title: 'Ingen risk', desc: 'Ingen betalning? Då kostar det dig ingenting.', color: 'emerald' },
            ].map((item, index) => {
              const colorMap: Record<string, { bg: string; border: string; text: string }> = {
                violet: { bg: 'bg-violet-500/15', border: 'border-violet-500/30', text: 'text-violet-400' },
                blue: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400' },
                emerald: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400' },
              };
              const colors = colorMap[item.color];

              return (
                <div
                  key={index}
                  className={`reveal ${isVisible ? 'visible' : ''}`}
                  style={{ transitionDelay: `${500 + index * 100}ms` }}
                >
                  <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-4 sm:p-5 md:p-6 h-full hover:border-white/20 transition-colors">
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-4`}>
                      <item.icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <h4 className="text-lg font-display font-semibold text-white mb-3">{item.title}</h4>
                    <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* What counts as collected */}
        <div className={`mt-16 max-w-3xl mx-auto reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '800ms' }}>
          <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-lg font-display font-semibold text-white mb-2">
                  Vilka betalningar gäller success fee för?
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  Success fee gäller betalningar som inkommit efter att Zylora tagit över dialogen kring fakturan. Betalningar som skett innan uppdragets start omfattas inte.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom summary */}
        <div className={`mt-16 text-center reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '900ms' }}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 rounded-2xl bg-[#0d0d1a] border border-white/10">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-gray-200">Du slipper jaga sena betalningar</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/20" />
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-gray-200">Ingen fast avgift</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/20" />
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-gray-200">Vi tjänar när du tjänar</span>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-400">
            Zylora är inte ett inkassobolag och bedriver ingen lagreglerad inkassoverksamhet. Tjänsten används före eventuell inkasso.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
