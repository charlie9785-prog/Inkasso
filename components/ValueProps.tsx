import React, { useEffect, useRef, useState } from 'react';
import { Eye, Link, HeartHandshake, Zap } from 'lucide-react';

const features = [
  {
    title: "Proaktiv Uppföljning",
    description: "Vårt team tar kontakt direkt när fakturor förfaller — via email, SMS och telefon.",
    icon: Eye,
    colSpan: "lg:col-span-2",
    color: "violet",
  },
  {
    title: "Bevarade Relationer",
    description: "Personlig handpåläggning gör att du får betalt utan att förlora kunden inför framtida affärer.",
    icon: HeartHandshake,
    colSpan: "lg:col-span-1",
    color: "emerald",
  },
  {
    title: "60 Sekunder — Klart",
    description: "Anslut Fortnox, Visma eller Björn Lundén. Sen behöver du aldrig göra något mer.",
    icon: Link,
    colSpan: "lg:col-span-1",
    color: "blue",
  },
  {
    title: "Full Insyn — Noll Jobb",
    description: "Följ varje ärende i realtid om du vill. Eller luta dig tillbaka — vi hör av oss när det händer något.",
    icon: Eye,
    colSpan: "lg:col-span-2",
    color: "cyan",
  },
];

const colorConfig: Record<string, { bg: string; border: string; text: string; hoverBg: string; hoverBorder: string; glow: string }> = {
  violet: {
    bg: 'bg-violet-500/20',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    hoverBg: 'group-hover:bg-violet-500/30',
    hoverBorder: 'hover:border-violet-500/50',
    glow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]'
  },
  emerald: {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    hoverBg: 'group-hover:bg-emerald-500/30',
    hoverBorder: 'hover:border-emerald-500/50',
    glow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]'
  },
  blue: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    hoverBg: 'group-hover:bg-blue-500/30',
    hoverBorder: 'hover:border-blue-500/50',
    glow: 'group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]'
  },
  cyan: {
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    hoverBg: 'group-hover:bg-cyan-500/30',
    hoverBorder: 'hover:border-cyan-500/50',
    glow: 'group-hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]'
  },
};

const ValueProps = () => {
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
    <section ref={sectionRef} className="py-32 px-6 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-1/2 h-[600px] bg-violet-500/[0.04] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/2 h-[600px] bg-blue-500/[0.04] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className={`mb-20 reveal ${isVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300 mb-8 cursor-default badge-hover">
            <Zap className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-gray-400">Varför Zylora</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            <span className="text-white">Designat för </span>
            <span className="gradient-text">människor</span>
            <span className="text-white">,</span>
            <br />
            <span className="text-white">inte system.</span>
          </h2>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            Inga kravbrev eller hotfulla meddelanden. Vårt team hanterar era förfallna fakturor med personlig dialog och respekt.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = colorConfig[feature.color];
            return (
              <div
                key={index}
                className={`${feature.colSpan} group relative reveal ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${200 + index * 150}ms` }}
              >
                <div className={`relative h-full p-8 glass border border-white/10 rounded-2xl ${colors.hoverBorder} transition-all duration-500 overflow-hidden cursor-default hover:-translate-y-3 ${colors.glow}`}>
                  {/* Icon */}
                  <div className={`mb-8 w-16 h-16 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center group-hover:scale-125 ${colors.hoverBg} transition-all duration-300`}>
                    <feature.icon className={`w-8 h-8 ${colors.text} group-hover:scale-110 transition-transform duration-300`} strokeWidth={1.5} />
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-display font-semibold text-white mb-3 group-hover:text-violet-100 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative background icon */}
                  <feature.icon
                    className={`absolute right-[-30px] bottom-[-30px] w-56 h-56 ${colors.text} opacity-[0.03] -rotate-12 pointer-events-none group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500`}
                    strokeWidth={0.5}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
