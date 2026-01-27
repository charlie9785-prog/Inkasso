import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-[95vh] flex flex-col justify-center">
      <div className="relative z-10 max-w-7xl mx-auto text-center flex flex-col items-center">

        {/* Premium Badge */}
        <div
          className={`group relative inline-flex items-center gap-3 px-5 py-2 rounded-full glass border border-white/10 hover:border-violet-500/50 cursor-default mb-12 overflow-hidden shine-hover badge-hover ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
          </span>
          <span className="text-sm font-medium text-gray-300 tracking-wide">
            Personlig dialog — inte automatiserade kravbrev
          </span>
          <ChevronRight className="w-4 h-4 text-violet-400 group-hover:translate-x-2 group-hover:text-violet-300 transition-all duration-300" />
        </div>

        {/* Main Headline */}
        <h1
          className={`text-5xl md:text-7xl lg:text-[5.5rem] font-display font-bold tracking-tight mb-8 max-w-5xl mx-auto leading-[1.05] ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <span className="text-white">Vi sköter dialogen med era kunder</span>
          <br />
          <span className="gradient-text">
            – tills ni fått betalt
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className={`text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <span className="text-white font-medium">Anslut Fortnox, Visma eller Björn Lundén på 60 sekunder.</span> Vi tar kontakt, följer upp och ser till att pengarna kommer in.
        </p>

        {/* CTA */}
        <div
          className={`flex flex-col items-center gap-4 mb-12 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          <a
            href="/kom-igang"
            className="group h-14 px-10 rounded-full btn-premium magnetic-hover shine-hover inline-flex items-center"
          >
            <span className="relative z-10 inline-flex items-center text-base font-semibold text-white">
              Kom igång gratis
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </a>

          <span className="text-gray-500 text-sm">
            eller ring <a href="tel:0729626822" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">072-962 68 22</a>
          </span>
        </div>

        {/* Trust indicators */}
        <div
          className={`flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
          style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
        >
          {['Inga dolda avgifter', 'Ingen bindningstid', '60 sek integration'].map((text, i) => (
            <div key={i} className="flex items-center gap-2 group cursor-default hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-violet-400 group-hover:text-violet-300 group-hover:scale-125 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="group-hover:text-white transition-colors">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
