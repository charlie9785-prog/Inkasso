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
    <section ref={sectionRef} className="py-14 md:py-24 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className={`text-center mb-10 md:mb-16 reveal ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold mb-4 md:mb-6 tracking-tight">
            <span className="text-white">Känner du igen dig?</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-6 md:mb-8">
            Sena betalningar kostar mer än pengar. De kostar tid, energi och tillväxt.
          </p>

          {/* External statistic */}
          <div className="inline-flex flex-col items-center gap-2 px-4 py-3 sm:px-6 sm:py-4 rounded-xl glass border border-white/10">
            <p className="text-white font-medium">
              "Svenska företag lägger i snitt <span className="text-violet-400">10 timmar i veckan</span> på att jaga betalningar."
            </p>
            <p className="text-sm text-gray-500">
              — European Payment Report 2023
            </p>
          </div>
        </div>

        {/* Pain points grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {painPoints.map((point, index) => {
            const colors = colorConfig[point.color];
            return (
              <div
                key={point.id}
                className={`reveal ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${150 + index * 100}ms` }}
              >
                <div className={`group relative p-5 sm:p-6 md:p-8 rounded-2xl ${colors.bg} border ${colors.border} hover:border-white/20 transition-all duration-300 h-full`}>
                  {/* Number badge */}
                  <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full ${colors.iconBg} border ${colors.border} flex items-center justify-center`}>
                    <span className={`text-sm font-bold ${colors.text}`}>{point.id}</span>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${colors.iconBg} border ${colors.border} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <point.icon className={`w-6 h-6 ${colors.text}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-display font-semibold text-white mb-2">
                        {point.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA hint */}
        <div className={`mt-12 text-center reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '600ms' }}>
          <p className="text-gray-500">
            <span className="text-white font-medium">Det behöver inte vara så.</span> Vi tar hand om det åt dig.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
