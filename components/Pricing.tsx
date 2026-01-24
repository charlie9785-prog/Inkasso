import React, { useEffect, useRef, useState } from 'react';
import { Check, CreditCard, Receipt, Shield, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

const includedFeatures = [
  'Personlig uppföljning av förfallna fakturor',
  'Vårt team ringer och mejlar era kunder',
  'Veckorapporter via mejl varje fredag',
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
            Zylora är en fullservice-tjänst för B2B-företag. Vi tjänar bara pengar när ni gör det.
          </p>
        </div>

        {/* Pricing card */}
        <div className={`max-w-4xl mx-auto reveal-scale ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
          <div className="relative group">
            {/* Animated gradient border */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/40 via-blue-500/40 to-violet-500/40 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
            <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/50 via-blue-500/50 to-violet-500/50 rounded-3xl" style={{
              maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
              maskComposite: 'exclude',
              padding: '1px'
            }} />

            <div className="relative glass-strong rounded-3xl overflow-hidden">
              {/* Header */}
              <div className="p-8 md:p-12 border-b border-white/5">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-4">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      Mest populära
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                      Zylora Fullservice
                    </h3>
                    <p className="text-gray-400">
                      Allt du behöver för att få betalt i tid
                    </p>
                  </div>

                  <div className="text-left lg:text-right">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl md:text-6xl font-display font-bold text-white">1 900</span>
                      <span className="text-xl text-gray-400">kr/mån</span>
                    </div>
                    <p className="text-violet-400/80 text-sm mt-1">+ 10% performance fee på återvunna belopp</p>
                    <p className="text-violet-400/60 text-xs mt-0.5">Max 10 000 kr/faktura</p>
                  </div>
                </div>
              </div>

              {/* Features grid */}
              <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-4 mb-10">
                  {includedFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 group/item">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-gray-300 group-hover/item:text-white transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://calendly.com/carl-zylora/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full h-14 rounded-xl btn-premium inline-flex items-center justify-center"
                >
                  <span className="relative z-10 inline-flex items-center justify-center text-base font-semibold text-white">
                    Kom igång nu
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Alla priser anges exkl. moms
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How payment works */}
        <div className="mt-24 max-w-5xl mx-auto">
          <h3 className={`text-2xl md:text-3xl font-display font-bold text-white text-center mb-12 reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '400ms' }}>
            Hur betalningen fungerar
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Receipt, title: 'Management fee', desc: '1 900 kr/månad för att ha tjänsten aktiv. Ingen startavgift, ingen bindningstid.', color: 'violet' },
              { icon: CreditCard, title: 'Performance fee', desc: '10% på belopp som återvinns efter att vi påbörjat uppföljningen. Max 10 000 kr/faktura.', color: 'blue' },
              { icon: Shield, title: 'Ingen risk', desc: 'Vi tjänar bara pengar när ni gör det. Ingen ersättning om inget återvinns (utöver månadsavgiften).', color: 'emerald' },
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
                  Vad räknas som återvunnet belopp?
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Som återvunnet belopp räknas betalningar som inkommit efter att Zylora tagit över uppföljningen av fakturan. Betalningar som skett innan uppdragets start omfattas inte.
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
              <span className="text-gray-300 group-hover:text-white transition-colors">Låg fast avgift</span>
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
