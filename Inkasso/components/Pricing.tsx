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
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/[0.04] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.04] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className={`text-center mb-20 reveal ${isVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-violet-500/30 transition-colors mb-8 hover-glow cursor-default">
            <CreditCard className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-gray-400">Priser & betalning</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            <span className="text-white">Enkel prissättning.</span>
            <br />
            <span className="gradient-text">Du betalar när du får betalt.</span>
          </h2>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Ingen månadsavgift. Vi tjänar bara pengar när ni gör det.
          </p>
        </div>

        {/* Main pricing card */}
        <div className={`max-w-3xl mx-auto reveal-scale ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
          <div className="relative group">
            {/* Card border glow */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/40 via-blue-500/40 to-violet-500/40 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
            <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/50 via-blue-500/50 to-violet-500/50 rounded-3xl" style={{
              maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
              maskComposite: 'exclude',
              padding: '1px'
            }} />

            <div className="relative glass-strong rounded-3xl overflow-hidden">
              {/* Main pricing */}
              <div className="p-8 md:p-12 text-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-violet-400" />
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-5xl md:text-7xl font-display font-bold text-white">0 kr</span>
                    <span className="text-xl text-gray-400">att börja</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-5xl md:text-7xl font-display font-bold text-white">0 kr</span>
                    <span className="text-xl text-gray-400">i månadsavgift</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-4">
                    <span className="text-4xl md:text-5xl font-display font-bold gradient-text">5%</span>
                    <span className="text-xl text-gray-400">på indrivet belopp</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {mainFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="https://calendly.com/carl-zylora/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center justify-center h-14 px-8 rounded-xl btn-premium"
                >
                  <span className="relative z-10 inline-flex items-center justify-center text-base font-semibold text-white">
                    Kom igång gratis
                    <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </a>
              </div>

              {/* Volume tiers */}
              <div className="border-t border-white/10 p-6 md:p-8 bg-white/[0.02]">
                <h4 className="text-center text-sm font-medium text-gray-400 mb-6">Volymrabatt — du uppgraderas automatiskt</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {volumeTiers.map((tier, index) => (
                    <div
                      key={tier.name}
                      className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                        index === 0
                          ? 'bg-violet-500/10 border-violet-500/30'
                          : 'glass border-white/10 hover:border-white/20'
                      }`}
                    >
                      {index === 0 && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                          <span className="px-3 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-xs text-violet-400 font-medium">
                            Din start
                          </span>
                        </div>
                      )}
                      <div className="text-center">
                        <h5 className="text-lg font-display font-semibold text-white mb-1">{tier.name}</h5>
                        {tier.threshold && (
                          <p className="text-xs text-gray-500 mb-2">{tier.threshold}</p>
                        )}
                        <p className="text-3xl font-display font-bold text-white mb-1">{tier.fee}</p>
                        <p className="text-sm text-gray-400">{tier.cap}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Du startar på Starter. Vi uppgraderar dig automatiskt när du växer.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Alla priser anges exkl. moms
        </p>

        {/* How payment works */}
        <div className="mt-24 max-w-5xl mx-auto">
          <h3 className={`text-2xl md:text-3xl font-display font-bold text-white text-center mb-12 reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '400ms' }}>
            Hur betalningen fungerar
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Receipt, title: 'Management fee', desc: 'Ingen månadsavgift. Ingen startavgift, ingen bindningstid.', color: 'violet' },
              { icon: CreditCard, title: 'Performance fee', desc: '5% på betalningar som kommer in efter att vi påbörjat dialogen. Max 5 000 kr per faktura.', color: 'blue' },
              { icon: Shield, title: 'Ingen risk', desc: 'Vi tjänar bara pengar när ni gör det. Ingen betalning — ingen kostnad.', color: 'emerald' },
            ].map((item, index) => {
              const colorMap: Record<string, { bg: string; border: string; text: string; hover: string }> = {
                violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', hover: 'hover:border-violet-500/30' },
                blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', hover: 'hover:border-blue-500/30' },
                emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', hover: 'hover:border-emerald-500/30' },
              };
              const colors = colorMap[item.color];

              return (
                <div
                  key={index}
                  className={`group relative reveal ${isVisible ? 'visible' : ''}`}
                  style={{ transitionDelay: `${500 + index * 100}ms` }}
                >
                  <div className={`relative glass border border-white/10 rounded-2xl p-8 h-full ${colors.hover} transition-all duration-500 hover-lift`}>
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-6 h-6 ${colors.text} icon-hover-rotate`} />
                    </div>
                    <h4 className="text-lg font-display font-semibold text-white mb-3">{item.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* What counts as collected */}
        <div className={`mt-20 max-w-3xl mx-auto reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '800ms' }}>
          <div className="glass border border-white/10 rounded-2xl p-8 hover:border-violet-500/20 transition-colors hover-glow">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-lg font-display font-semibold text-white mb-2">
                  Vilka betalningar gäller success fee för?
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Success fee gäller betalningar som inkommit efter att Zylora tagit över dialogen kring fakturan. Betalningar som skett innan uppdragets start omfattas inte.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom summary */}
        <div className={`mt-20 text-center reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '900ms' }}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 sm:gap-8 px-8 py-6 rounded-2xl glass border border-white/10 hover:border-violet-500/20 transition-colors">
            <div className="flex items-center gap-3 group cursor-default">
              <Check className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-gray-300 group-hover:text-white transition-colors">Du slipper jaga sena betalningar</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/10" />
            <div className="flex items-center gap-3 group cursor-default">
              <Check className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-gray-300 group-hover:text-white transition-colors">Ingen fast avgift</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/10" />
            <div className="flex items-center gap-3 group cursor-default">
              <Check className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-gray-300 group-hover:text-white transition-colors">Vi tjänar när du tjänar</span>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Zylora är inte ett inkassobolag och bedriver ingen lagreglerad inkassoverksamhet. Tjänsten används före eventuell inkasso.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
