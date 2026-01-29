import React from 'react';
import { ShieldCheck, Sparkles, Globe, Lock } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const ProofBar: React.FC = () => {
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
    <section ref={sectionRef} className={`py-8 md:py-10 px-6 relative overflow-hidden reveal-fade ${isVisible ? 'visible' : ''}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-gray-300">GDPR‑fokuserad hantering</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10">
              <Lock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Säker dataöverföring</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10">
              <Globe className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-gray-300">Svenskt bolag</span>
            </div>
          </div>

          <div className={`grid grid-cols-3 gap-3 reveal-stagger ${isVisible ? 'visible' : ''}`}>
            <div className="glass border border-white/10 rounded-2xl px-3 py-3 text-center min-w-0">
              <div className="text-lg font-display font-bold text-white">24h</div>
              <div className="text-[10px] sm:text-xs text-gray-500 leading-tight">Snabb uppstart</div>
            </div>
            <div className="glass border border-white/10 rounded-2xl px-3 py-3 text-center min-w-0">
              <div className="text-lg font-display font-bold text-white"><AnimatedCounter end={5} suffix="%" duration={1500} /></div>
              <div className="text-[10px] sm:text-xs text-gray-500 leading-tight">Endast vid resultat</div>
            </div>
            <div className="glass border border-white/10 rounded-2xl px-3 py-3 text-center min-w-0">
              <div className="text-lg font-display font-bold text-white"><AnimatedCounter end={0} suffix=" kr" duration={1500} /></div>
              <div className="text-[10px] sm:text-xs text-gray-500 leading-tight">Månadsavgift</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-gray-500">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Trygg uppföljning innan inkasso blir aktuellt</span>
        </div>
      </div>
    </section>
  );
};

export default ProofBar;
