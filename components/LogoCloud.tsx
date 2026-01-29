import React from 'react';
import { Sparkles } from 'lucide-react';

const integrations = [
  {
    name: 'Fortnox',
    color: '#1E6B45',
    letter: 'FN',
  },
  {
    name: 'Visma',
    color: '#E31837',
    letter: 'V',
  },
  {
    name: 'Björn Lundén',
    color: '#003366',
    letter: 'BL',
  },
];

const LogoCloud: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
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
    <section ref={sectionRef} className="py-14 md:py-20 px-6 relative overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[560px] h-[220px] bg-violet-500/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[260px] h-[260px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-gray-400">Integrerar med ledande system</span>
          </div>

          <p className="text-base sm:text-lg text-gray-400 mb-10 max-w-xl leading-relaxed">
            En trygg anslutning som tar minimal tid — resten sköter vi.
          </p>

          <div className={`w-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 reveal-stagger ${isVisible ? 'visible' : ''}`}>
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-6 sm:px-6 sm:py-7 transition-all duration-500 hover:-translate-y-2 hover:border-violet-500/30"
              >
                <div className="absolute -right-6 -top-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: integration.color, opacity: 0.25 }}
                />
                <div className="relative z-10 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-semibold text-sm shadow-lg"
                    style={{ backgroundColor: integration.color }}
                  >
                    {integration.letter}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-display font-semibold">{integration.name}</p>
                    <p className="text-xs text-gray-500">Direktanslutning</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400/80" />
                  <span>Redo att kopplas</span>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges removed to avoid duplication with ProofBar */}
        </div>
      </div>
    </section>
  );
};

export default LogoCloud;
