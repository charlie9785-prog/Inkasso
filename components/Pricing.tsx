import React, { useEffect, useRef, useState } from 'react';
import { Check, CreditCard, Receipt, Shield, ArrowRight, Sparkles, HelpCircle, Building2, Users, Crown } from 'lucide-react';

const b2cFeatures = [
  'Vårt team tar hand om era förfallna fakturor',
  'Veckorapport via mejl',
  'Ingen startavgift',
  'Ingen bindningstid',
  'Bevarade kundrelationer'
];

const b2bFeatures = [
  'Vårt team tar hand om era förfallna fakturor',
  'Dashboard med realtidsöversikt',
  'Ingen startavgift',
  'Ingen bindningstid',
  'Bevarade kundrelationer'
];

const enterpriseFeatures = [
  'Anpassade integrationer',
  'White-label (påminnelser i ert namn)',
  'Volymrabatt på success fee',
  'Dedicated account manager'
];

interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  priceLabel: string;
  successFee: string;
  maxFee: string;
  features: string[];
  popular?: boolean;
  isEnterprise?: boolean;
  icon: React.ElementType;
}

const plans: PricingPlan[] = [
  {
    id: 'b2c',
    name: 'B2C',
    subtitle: 'För dig som fakturerar privatpersoner',
    price: '1 900',
    priceLabel: 'kr/mån',
    successFee: '10% success fee',
    maxFee: 'Max 10 000 kr/faktura',
    features: b2cFeatures,
    icon: Users,
  },
  {
    id: 'b2b',
    name: 'B2B',
    subtitle: 'För dig som fakturerar andra företag',
    price: '3 900',
    priceLabel: 'kr/mån',
    successFee: '10% success fee',
    maxFee: 'Max 30 000 kr/faktura',
    features: b2bFeatures,
    popular: true,
    icon: Building2,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'För större bolag med specifika behov',
    price: 'Custom',
    priceLabel: '',
    successFee: 'Anpassad success fee',
    maxFee: 'Baserat på volym',
    features: enterpriseFeatures,
    isEnterprise: true,
    icon: Crown,
  },
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
            Välj den plan som passar ditt företag. Vi tjänar bara pengar när ni gör det.
          </p>
        </div>

        {/* Pricing cards */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto reveal-scale ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative group ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium shadow-lg shadow-violet-500/25">
                    <Sparkles className="w-4 h-4" />
                    <span>Rekommenderad</span>
                  </div>
                </div>
              )}

              {/* Card border glow for popular */}
              {plan.popular && (
                <>
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/40 via-blue-500/40 to-violet-500/40 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/50 via-blue-500/50 to-violet-500/50 rounded-3xl" style={{
                    maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                    maskComposite: 'exclude',
                    padding: '1px'
                  }} />
                </>
              )}

              <div className={`relative h-full flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ${
                plan.popular
                  ? 'glass-strong'
                  : 'glass border border-white/10 hover:border-white/20'
              }`}>
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.popular
                        ? 'bg-violet-500/20 border border-violet-500/30'
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-violet-400' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-white">
                        {plan.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {plan.subtitle}
                  </p>
                </div>

                {/* Price */}
                <div className="p-6 md:p-8 border-b border-white/5">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-display font-bold text-white ${plan.isEnterprise ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'}`}>
                      {plan.price}
                    </span>
                    {plan.priceLabel && (
                      <span className="text-lg text-gray-400">{plan.priceLabel}</span>
                    )}
                  </div>
                  <p className={`text-sm mt-2 ${plan.popular ? 'text-violet-400/80' : 'text-gray-500'}`}>
                    + {plan.successFee}
                  </p>
                  <p className={`text-xs mt-0.5 ${plan.popular ? 'text-violet-400/60' : 'text-gray-600'}`}>
                    {plan.maxFee}
                  </p>
                </div>

                {/* Features */}
                <div className="p-6 md:p-8 flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3 group/item">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.popular
                            ? 'bg-emerald-500/10 border border-emerald-500/20'
                            : 'bg-white/5 border border-white/10'
                        }`}>
                          <Check className={`w-3 h-3 ${plan.popular ? 'text-emerald-400' : 'text-gray-400'}`} />
                        </div>
                        <span className="text-gray-300 text-sm group-hover/item:text-white transition-colors">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="p-6 md:p-8 pt-0">
                  <a
                    href="https://calendly.com/carl-zylora/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group/btn w-full h-12 rounded-xl inline-flex items-center justify-center transition-all ${
                      plan.popular
                        ? 'btn-premium'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="relative z-10 inline-flex items-center justify-center text-sm font-semibold text-white">
                      {plan.isEnterprise ? 'Boka möte' : 'Kom igång'}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
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
              { icon: Receipt, title: 'Management fee', desc: 'Fast månadsavgift beroende på plan. Ingen startavgift, ingen bindningstid.', color: 'violet' },
              { icon: CreditCard, title: 'Performance fee', desc: '10% på belopp som återvinns efter att vi påbörjat uppföljningen. Max-tak varierar per plan.', color: 'blue' },
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
