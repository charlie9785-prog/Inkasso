import React, { useEffect, useRef, useState } from 'react';
import { Check, CreditCard, Receipt, Shield, ArrowRight, HelpCircle, Zap } from 'lucide-react';

const mainFeatures = [
  'Vårt team tar hand om era förfallna fakturor',
  'Dashboard med realtidsöversikt',
  'Ingen startavgift',
  'Ingen bindningstid',
  'Bevarade kundrelationer'
];

interface VolumeTier {
  name: string;
  fee: string;
  cap: string;
  threshold?: string;
}

const volumeTiers: VolumeTier[] = [
  { name: 'Starter', fee: '5%', cap: 'max 5 000 kr' },
  { name: 'Growth', fee: '4%', cap: 'max 15 000 kr', threshold: '50+ ärenden' },
  { name: 'Enterprise', fee: '3%', cap: 'förhandlas', threshold: 'Kontakta oss' },
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
    <section ref={sectionRef} id="pricing" className="py-32 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className={`text-center mb-16 reveal ${isVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <CreditCard className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-gray-300">Priser & betalning</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            <span className="text-white">Enkel prissättning.</span>
            <br />
            <span className="gradient-text">Betala bara när du får betalt.</span>
          </h2>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Ingen månadsavgift. Ingen startavgift. Du betalar endast när vi lyckas.
          </p>
        </div>

        {/* Main pricing card */}
        <div className={`max-w-2xl mx-auto mb-12 reveal-scale ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
          <div className="relative">
            {/* Card */}
            <div className="relative bg-[#0d0d1a] border border-white/10 rounded-3xl overflow-hidden">
              {/* Main pricing */}
              <div className="p-10 md:p-14 text-center">
                {/* Big zero */}
                <div className="mb-8">
                  <div className="text-7xl md:text-8xl font-display font-bold text-white mb-2">
                    0 kr
                  </div>
                  <div className="text-xl text-gray-300 font-medium">
                    i månadsavgift
                  </div>
                </div>

                {/* Success fee highlight */}
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-violet-500/10 border border-violet-500/30 mb-8">
                  <Zap className="w-6 h-6 text-violet-400" />
                  <div className="text-left">
                    <div className="text-2xl font-display font-bold text-white">5% success fee</div>
                    <div className="text-gray-300">på det vi driver in åt dig</div>
                  </div>
                </div>

                {/* Simple explanation */}
                <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                  Vi tar 5% av beloppet vi lyckas driva in. Max 5 000 kr per faktura. Lyckas vi inte — kostar det dig inget.
                </p>

                {/* CTA */}
                <a
                  href="https://calendly.com/carl-zylora/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center justify-center h-14 px-8 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all duration-300"
                >
                  <span className="inline-flex items-center justify-center text-base font-semibold text-white">
                    Kom igång gratis
                    <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </a>
              </div>

              {/* Features */}
              <div className="border-t border-white/10 p-8 bg-white/[0.02]">
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

        {/* Volume discount section */}
        <div className={`max-w-3xl mx-auto mb-16 reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '300ms' }}>
          <h3 className="text-center text-xl font-display font-semibold text-white mb-6">
            Volymrabatt — du uppgraderas automatiskt
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {volumeTiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`relative p-6 rounded-2xl text-center ${
                  index === 0
                    ? 'bg-violet-500/15 border-2 border-violet-500/40'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {index === 0 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-violet-500 text-white text-xs font-semibold">
                      Din start
                    </span>
                  </div>
                )}
                <h4 className="text-lg font-display font-semibold text-white mb-1">{tier.name}</h4>
                {tier.threshold && (
                  <p className="text-sm text-gray-400 mb-3">{tier.threshold}</p>
                )}
                {!tier.threshold && <div className="mb-3" />}
                <p className="text-4xl font-display font-bold text-white mb-1">{tier.fee}</p>
                <p className="text-gray-300">{tier.cap}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 mt-6">
            Du startar på Starter. Vi uppgraderar dig automatiskt när du växer.
          </p>
        </div>

        <p className="text-center text-gray-400 text-sm mb-20">
          Alla priser anges exkl. moms
        </p>

        {/* How payment works */}
        <div className="max-w-5xl mx-auto">
          <h3 className={`text-2xl md:text-3xl font-display font-bold text-white text-center mb-12 reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '400ms' }}>
            Hur betalningen fungerar
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Receipt, title: 'Ingen månadsavgift', desc: 'Ingen fast kostnad. Ingen startavgift. Ingen bindningstid.', color: 'violet' },
              { icon: CreditCard, title: '5% success fee', desc: 'Vi tar 5% på belopp vi driver in åt dig. Max 5 000 kr per faktura.', color: 'blue' },
              { icon: Shield, title: 'Ingen risk', desc: 'Lyckas vi inte driva in pengarna? Då kostar det dig ingenting.', color: 'emerald' },
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
                  <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-8 h-full hover:border-white/20 transition-colors">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6`}>
                      <item.icon className={`w-6 h-6 ${colors.text}`} />
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
          <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-lg font-display font-semibold text-white mb-2">
                  Vad räknas som återvunnet belopp?
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  Som återvunnet belopp räknas betalningar som inkommit efter att Zylora tagit över uppföljningen av fakturan. Betalningar som skett innan uppdragets start omfattas inte.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom summary */}
        <div className={`mt-16 text-center reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '900ms' }}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 sm:gap-8 px-8 py-6 rounded-2xl bg-[#0d0d1a] border border-white/10">
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
