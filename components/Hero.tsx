import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight, CheckCircle2, Clock3, MessageCircle, Zap } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative pt-20 pb-12 md:pt-24 md:pb-16 px-6 overflow-hidden min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-transparent to-blue-950/30 animate-gradient-x" style={{ backgroundSize: '400% 400%' }} />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/[0.08] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/[0.06] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">

        {/* Premium Badge */}
        <div className="text-left lg:text-left">
          <div
            className={`group relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full glass border border-white/10 hover:border-violet-500/50 cursor-default mb-8 md:mb-10 overflow-hidden shine-hover badge-hover ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-300 tracking-wide">
              Personlig dialog före inkasso
            </span>
            <ChevronRight className="w-4 h-4 text-violet-400 group-hover:translate-x-2 group-hover:text-violet-300 transition-all duration-300" />
          </div>

        {/* Main Headline */}
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold tracking-tight mb-4 md:mb-6 max-w-2xl leading-[1.1] ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            <span className="text-white">Vi tar hand om dialogen</span>
            <br />
            <span className="text-white">– tills ni fått betalt</span>
            <br />
            <span className="gradient-text">Tryggt och respektfullt</span>
          </h1>

        {/* Subheadline */}
          <p
            className={`text-sm sm:text-base md:text-lg text-gray-400 max-w-xl mb-8 leading-relaxed ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            <span className="text-white font-medium">Anslut Fortnox, Visma eller Björn Lundén på 60 sekunder.</span> Vårt team följer upp i rätt ton och säkrar betalningen utan att skada relationen.
          </p>

        {/* CTA */}
          <div
            className={`flex flex-col sm:flex-row sm:items-center gap-4 mb-10 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            <a
              href="/kom-igang"
              className="group h-11 px-6 sm:h-12 sm:px-8 rounded-full btn-premium magnetic-hover shine-hover inline-flex items-center justify-center w-full sm:w-auto"
            >
              <span className="relative z-10 inline-flex items-center text-base font-semibold text-white">
                Kom igång gratis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </a>
            <button
              type="button"
              onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
              className="h-11 sm:h-12 px-5 rounded-full border border-white/10 text-sm text-gray-300 hover:text-white hover:border-violet-500/40 hover:bg-white/5 transition-all w-full sm:w-auto"
            >
              Se hur det fungerar
            </button>
          </div>

          <span className={`text-gray-500 text-sm ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            eller mejla <a href="mailto:supprt@zylora.se" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">supprt@zylora.se</a>
          </span>

        {/* Trust indicators */}
          <div
            className={`mt-8 flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-gray-500 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            {['Inga dolda avgifter', 'Ingen bindningstid', '60 sek integration'].map((text, i) => (
              <div key={i} className="flex items-center gap-2 group cursor-default hover:scale-105 transition-transform">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400 group-hover:text-violet-300 group-hover:scale-110 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="group-hover:text-white transition-colors">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column visual */}
        <div className={`relative ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}>
          <div className="absolute -top-10 -right-10 h-40 w-40 bg-violet-500/10 blur-[80px] rounded-full" />
          <div className="absolute -bottom-14 left-6 h-48 w-48 bg-blue-500/10 blur-[90px] rounded-full" />

          <div className="animated-border p-[2px] rounded-3xl">
            <div className="relative rounded-2xl glass-strong border border-white/10 p-5 sm:p-6 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.12),transparent_50%)]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="text-[11px] text-gray-500 uppercase tracking-[0.2em]">Zylora Dashboard</div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Pågående dialog</p>
                    <h3 className="text-lg font-display font-semibold text-white">Aktiv ärendevy</h3>
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
                    <Zap className="w-3.5 h-3.5" />
                    Uppdateras live
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-500 uppercase tracking-[0.18em]">
                    <span>Händelse</span>
                    <span className="text-center">Status</span>
                    <span className="text-right">Tid</span>
                  </div>
                  {[
                    { icon: MessageCircle, label: 'Dialog startad', detail: 'E‑post + SMS skickat', color: 'text-violet-300' },
                    { icon: Clock3, label: 'Svar inom 24h', detail: 'Uppföljning schemalagd', color: 'text-blue-300' },
                    { icon: CheckCircle2, label: 'Betalning bekräftad', detail: 'Kvitto skickat', color: 'text-emerald-300' },
                  ].map((item, index) => (
                    <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${item.color}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.detail}</p>
                      </div>
                      <div className="text-[11px] text-gray-500">{index === 0 ? 'Nu' : index === 1 ? 'Idag' : 'Klart'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            <div className="glass border border-white/10 rounded-xl px-2 py-2 sm:px-3 sm:py-3 text-left hover:border-violet-500/30 transition-all">
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">Kontakt inom 24h</p>
              <p className="text-xs sm:text-sm text-white font-medium truncate">Snabb uppstart</p>
            </div>
            <div className="glass border border-white/10 rounded-xl px-2 py-2 sm:px-3 sm:py-3 text-left hover:border-violet-500/30 transition-all">
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">1–2 veckor</p>
              <p className="text-xs sm:text-sm text-white font-medium truncate">Vanlig lösningstid</p>
            </div>
            <div className="glass border border-white/10 rounded-xl px-2 py-2 sm:px-3 sm:py-3 text-left hover:border-violet-500/30 transition-all">
              <p className="text-[10px] sm:text-xs text-gray-500 truncate"><AnimatedCounter end={60} suffix=" sek" duration={1500} /></p>
              <p className="text-xs sm:text-sm text-white font-medium truncate">Integrationstid</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
