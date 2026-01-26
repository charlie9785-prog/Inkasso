import React, { useEffect, useRef, useState } from 'react';
import { Star, Quote, Users } from 'lucide-react';

const testimonials = [
  {
    role: "VD",
    industry: "Konsultföretag",
    content: "Vi hade en kund som var skyldiga oss 85 000 kr i över tre månader. Zylora löste det på en vecka — och kunden är fortfarande kvar hos oss idag. Otroligt professionellt bemötande.",
    rating: 5,
    color: "violet",
  },
  {
    role: "Ekonomiansvarig",
    industry: "Byggbranschen",
    content: "Tidigare skickade vi direkt till inkasso och förlorade kunder. Nu går allt via Zylora först. Vi har fått in över 400 000 kr det senaste året utan en enda förlorad kundrelation.",
    rating: 5,
    color: "blue",
  },
  {
    role: "Ägare",
    industry: "Redovisningsbyrå",
    content: "Det bästa är att jag slipper hela processen. Zylora tar hand om det så jag kan fokusera på min verksamhet. Och mina kunder har alltid stannat kvar.",
    rating: 5,
    color: "emerald",
  }
];

const stats = [
  { value: "200+", label: "Nöjda företag", color: "violet" },
  { value: "15M+", label: "Kronor indragna", color: "emerald" },
  { value: "96%", label: "Lösningsgrad", color: "blue" },
  { value: "0", label: "Förlorade kunder", color: "amber" }
];

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  violet: { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
};

const Testimonials = () => {
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
    <section ref={sectionRef} className="py-32 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-violet-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className={`text-center mb-20 reveal ${isVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-violet-500/30 transition-colors mb-8 hover-glow cursor-default">
            <Users className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-gray-400">Kundberättelser</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            <span className="text-white">Företag som fått </span>
            <span className="gradient-text">betalt</span>
          </h2>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Över 200 svenska företag använder Zylora för att få in sina fakturor — utan att förlora kunder.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => {
            const colors = colorMap[testimonial.color];
            return (
              <div
                key={index}
                className={`group relative reveal ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${200 + index * 150}ms` }}
              >
                <div className={`relative h-full glass border border-white/10 rounded-2xl p-8 hover:border-${testimonial.color}-500/30 transition-all duration-500 hover-lift`}>
                  {/* Quote icon */}
                  <div className={`absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity`}>
                    <Quote className={`w-16 h-16 ${colors.text}`} />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform`} style={{ transitionDelay: `${i * 50}ms` }} />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-300 leading-relaxed mb-8 relative z-10">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center ${colors.text} font-semibold group-hover:scale-110 transition-transform`}>
                      {testimonial.role[0]}
                    </div>
                    <div>
                      <div className="text-white font-medium">{testimonial.role}</div>
                      <div className="text-sm text-gray-500">{testimonial.industry}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats bar */}
        <div className={`mt-20 reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '600ms' }}>
          <div className="relative glass border border-white/10 rounded-2xl hover:border-violet-500/20 transition-colors">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/5">
              {stats.map((stat, index) => {
                const colors = colorMap[stat.color];
                return (
                  <div key={index} className="text-center py-8 px-4 group cursor-default hover:bg-white/[0.02] transition-colors">
                    <div className={`text-4xl md:text-5xl font-display font-bold text-white mb-2 group-hover:${colors.text} transition-colors`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm text-gray-500 group-hover:${colors.text} transition-colors`}>{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
