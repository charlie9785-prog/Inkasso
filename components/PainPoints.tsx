import React, { useEffect, useRef, useState } from 'react';
import { Clock, Wallet, PhoneOff, TrendingDown } from 'lucide-react';

const painPoints = [
  {
    id: 1,
    title: "Tid som försvinner",
    description: "Påminnelser, samtal, mejl. Om och om igen. Tid som borde gå till kunder och försäljning.",
    icon: Clock,
    color: "red",
  },
  {
    id: 2,
    title: "Kassaflödet stannar",
    description: "Sena betalningar skapar en dominoeffekt. Du kan inte betala leverantörer, löner, eller moms — fast du har pengarna utlovade.",
    icon: Wallet,
    color: "orange",
  },
  {
    id: 3,
    title: "Obekväma samtal",
    description: "Att ringa kunder om pengar är jobbigt. Relationen blir ansträngd och du undviker det tills det är för sent.",
    icon: PhoneOff,
    color: "amber",
  },
  {
    id: 4,
    title: "Tillväxten bromsas",
    description: "24% av svenska företag säger att sena betalningar hämmar deras tillväxt. Du kan inte investera i pengar som inte kommit in.",
    icon: TrendingDown,
    color: "rose",
  },
];

const colorConfig: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  red: {
    bg: 'bg-red-500/5',
    border: 'border-red-500/20',
    text: 'text-red-400',
    iconBg: 'bg-red-500/10',
  },
  orange: {
    bg: 'bg-orange-500/5',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
    iconBg: 'bg-orange-500/10',
  },
  amber: {
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
  },
  rose: {
    bg: 'bg-rose-500/5',
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    iconBg: 'bg-rose-500/10',
  },
};

const PainPoints: React.FC = () => {
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
    <section ref={sectionRef} className="py-16 md:py-28 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-10 left-10 w-[320px] h-[320px] bg-rose-500/[0.06] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-amber-500/[0.05] blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
        {/* Left column */}
        <div className={`reveal ${isVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-6">
            <span className="text-xs uppercase tracking-[0.25em] text-gray-400">Utmaningar</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold mb-4 md:mb-6 tracking-tight leading-[1.05]">
            <span className="text-white">När betalningar dröjer kostar det mer än pengar.</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
            Tid, energi och tillväxt försvinner. Vi tar över innan problemet eskalerar.
          </p>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,63,94,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(245,158,11,0.12),transparent_50%)]" />
            <div className="relative z-10">
              <p className="text-white font-medium text-lg mb-3">
                "Svenska företag lägger i snitt <span className="text-violet-400">10 timmar i veckan</span> på att jaga betalningar."
              </p>
              <p className="text-sm text-gray-500">
                — European Payment Report 2023
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-gray-500">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400/80" />
            <span><span className="text-white font-medium">Du ska inte behöva vara inkassoteam.</span> Det är vårt jobb.</span>
          </div>
        </div>

        {/* Right column */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 reveal-stagger ${isVisible ? 'visible' : ''}`}>
          {painPoints.map((point, index) => {
            const colors = colorConfig[point.color];
            return (
              <div
                key={point.id}
                className="relative"
              >
                <div className={`group relative h-full overflow-hidden rounded-2xl border ${colors.border} bg-white/5 p-5 sm:p-6 transition-all duration-500 hover:-translate-y-2 hover:border-white/20`}>
                  <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full blur-[70px] opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: point.color === 'rose' ? '#fb7185' : point.color === 'amber' ? '#f59e0b' : point.color === 'orange' ? '#fb923c' : '#f87171', opacity: 0.25 }}
                  />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${colors.iconBg} border ${colors.border} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <point.icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-display font-semibold text-white mb-2">
                        {point.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <span className={`inline-flex h-1.5 w-1.5 rounded-full ${colors.text}`} />
                    <span>Vanligt hinder</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
