import React, { useEffect, useRef, useState } from 'react';
import { Target, Eye, Users, Building2 } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: "Vårt uppdrag",
    description: "Att hjälpa svenska företag få betalt i tid — utan att offra kundrelationer. Vi vill vara steget före inkasso, inte en del av det.",
    color: "violet",
  },
  {
    icon: Eye,
    title: "Vår vision",
    description: "En värld där sena betalningar hanteras med respekt och förståelse — där inkasso är sista utvägen, inte första.",
    color: "blue",
  },
  {
    icon: Users,
    title: "För dig",
    description: "Vi finns här för att hjälpa dig som företagare. Har du frågor når du oss enkelt via mejl eller telefon.",
    color: "emerald",
  }
];

const colorMap: Record<string, { bg: string; border: string; text: string; hover: string }> = {
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', hover: 'hover:border-violet-500/30' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', hover: 'hover:border-blue-500/30' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', hover: 'hover:border-emerald-500/30' },
};

const About = () => {
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
    <section ref={sectionRef} id="about" className="py-32 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Story */}
          <div className={`reveal-left ${isVisible ? 'visible' : ''}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-violet-500/30 transition-colors mb-8 hover-glow cursor-default">
              <Building2 className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-gray-400">Om Zylora</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 tracking-tight leading-tight">
              <span className="text-white">Vi tror på att affärer ska bygga relationer,</span>
              <br />
              <span className="gradient-text">inte förstöra dem.</span>
            </h2>

            <div className="space-y-5 text-gray-400 leading-relaxed text-lg">
              <p>
                Zylora grundades med en enkel idé: det måste finnas ett bättre sätt att hantera obetalda fakturor än att direkt skicka dem till inkasso.
              </p>
              <p>
                Vi såg hur företagare förlorade långvariga kundrelationer på grund av aggressiva inkassometoder. Kunder som egentligen bara hade tillfälliga problem — en missad faktura, en tuff månad — blev plötsligt behandlade som opålitliga.
              </p>
              <p>
                Därför skapade vi en tjänst där vårt team tar hand om uppföljningen med <span className="text-violet-400 font-medium">personlig handpåläggning</span>. Ni får betalt, och kunden stannar kvar — utan att ni behöver lyfta ett finger.
              </p>
            </div>
          </div>

          {/* Right: Values */}
          <div className="space-y-6">
            {values.map((value, index) => {
              const colors = colorMap[value.color];
              return (
                <div
                  key={index}
                  className={`group relative reveal-right ${isVisible ? 'visible' : ''}`}
                  style={{ transitionDelay: `${200 + index * 150}ms` }}
                >
                  <div className={`relative p-8 rounded-2xl glass border border-white/10 ${colors.hover} transition-all duration-500 hover-lift`}>
                    <div className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className={`w-7 h-7 ${colors.text} icon-hover-rotate`} />
                    </div>

                    <h3 className="text-xl font-display font-semibold text-white mb-3">
                      {value.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
