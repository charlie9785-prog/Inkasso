import React, { useEffect, useRef, useState } from 'react';
import { X, Check, AlertTriangle, Heart, Sparkles } from 'lucide-react';

const Comparison = () => {
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
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 relative overflow-hidden" id="services">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-1/3 h-[600px] bg-emerald-500/[0.04] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-1/3 h-[600px] bg-rose-500/[0.04] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className={`text-center mb-20 reveal ${isVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300 mb-8 cursor-default badge-hover">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-gray-400">Vad gör oss unika</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            <span className="text-white">Vi är </span>
            <span className="text-rose-400 line-through decoration-2 decoration-rose-500/70">inte</span>
            <span className="text-white"> ett inkassobolag</span>
          </h2>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Vi arbetar <span className="text-white font-medium">innan</span> inkasso blir aktuellt.
            Det är en helt annan approach — och det gör hela skillnaden för dina kundrelationer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Inkasso Column */}
          <div className={`relative group reveal-left ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
            <div className="relative rounded-2xl glass border border-white/10 p-8 h-full hover:border-rose-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(244,63,94,0.15)]">
              {/* Badge */}
              <div className="absolute -top-4 left-8">
                <div className="px-4 py-2 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm font-semibold backdrop-blur-sm">
                  Traditionellt inkasso
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {[
                  { title: 'Automatiska kravbrev', desc: 'Opersonligt och aggressivt' },
                  { title: 'Skadar kundrelationen', desc: 'Kunden känner sig hotad' },
                  { title: 'Betalningsanmärkning', desc: 'Långsiktiga konsekvenser för kunden' },
                  { title: 'Förlorad framtida affär', desc: 'Kunden kommer aldrig tillbaka' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group/item cursor-default">
                    <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0 group-hover/item:scale-125 group-hover/item:bg-rose-500/30 group-hover/item:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all duration-300">
                      <X className="w-4 h-4 text-rose-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover/item:text-rose-200 transition-colors">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2.5 text-rose-400/80">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-semibold">Sista utvägen — när allt annat misslyckats</span>
                </div>
              </div>
            </div>
          </div>

          {/* Zylora Column */}
          <div className={`relative group reveal-right ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '400ms' }}>
            <div className="relative rounded-2xl glass border border-white/10 hover:border-emerald-500/50 transition-all duration-500 p-8 h-full hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(16,185,129,0.2)]">
              {/* Badge */}
              <div className="absolute -top-4 left-8">
                <div className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-semibold backdrop-blur-sm flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  Zylora
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {[
                  { title: 'Personlig dialog', desc: 'Vårt team för en dialog med kunden via email, SMS och telefon' },
                  { title: 'Bevarad relation', desc: 'Kunden fortsätter handla hos dig' },
                  { title: 'Ingen anmärkning', desc: 'Vi löser det innan det går så långt' },
                  { title: 'Du får betalt', desc: 'Hög lösningsgrad' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group/item cursor-default">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover/item:scale-125 group-hover/item:bg-emerald-500/30 group-hover/item:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover/item:text-emerald-200 transition-colors">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-semibold">Första steget — innan inkasso</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className={`mt-16 text-center reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '600ms' }}>
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full glass border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300 cursor-default">
            <span className="text-gray-400 text-sm">
              Om kunden trots allt inte betalar kan vi hjälpa dig vidare — men <span className="text-emerald-400 font-medium">i de allra flesta fall löser vi det innan dess</span>.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
