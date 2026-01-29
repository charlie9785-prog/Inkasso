import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';

const CTA = () => {
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
    <section ref={sectionRef} className="relative py-16 md:py-32 px-6" id="contact">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className={`relative group reveal-scale ${isVisible ? 'visible' : ''}`}>
          <div className="relative overflow-hidden rounded-3xl glass border border-white/10 px-6 py-12 text-center sm:px-8 sm:py-16 md:px-16 md:py-20 lg:px-24 hover:border-violet-500/20 transition-all duration-500">
            {/* Background effects */}
            <div className="absolute -top-32 -left-32 h-96 w-96 bg-violet-500/[0.05] rounded-full blur-[120px] group-hover:bg-violet-500/[0.08] transition-colors duration-700" />
            <div className="absolute -bottom-32 -right-32 h-96 w-96 bg-blue-500/[0.05] rounded-full blur-[120px] group-hover:bg-blue-500/[0.08] transition-colors duration-700" />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8 hover-glow cursor-default">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-300">Kom igång idag</span>
              </div>

              <h2 className="mb-4 md:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-display font-bold tracking-tight leading-[1.05]">
                <span className="text-white">Låt oss ta ansvar för dialogen.</span>
                <br />
                <span className="gradient-text">Så kan du fokusera på affärerna.</span>
              </h2>

              <p className="mx-auto mb-8 md:mb-12 max-w-2xl text-base sm:text-lg md:text-xl text-gray-400">
                Vi arbetar diskret och professionellt, och rapporterar tydligt hela vägen.
              </p>

              <div className="flex flex-col items-center justify-center gap-4">
                <a
                  href="/kom-igang"
                  className="group h-12 px-8 sm:h-14 sm:px-10 rounded-full btn-premium inline-flex items-center w-full sm:w-auto justify-center"
                >
                  <span className="relative z-10 inline-flex items-center text-base font-semibold text-white">
                    Kom igång gratis
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>

                <span className="text-gray-500 text-sm">
                  eller{' '}
                  <a
                    href="https://calendly.com/carl-zylora/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
                  >
                    boka ett samtal
                  </a>
                </span>
              </div>

              {/* Contact info */}
              <div className="mt-8 sm:mt-10 md:mt-12 flex items-center justify-center gap-4 text-sm text-gray-500">
                <a href="mailto:supprt@zylora.se" className="flex items-center gap-2 hover:text-violet-400 transition-colors group">
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>supprt@zylora.se</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
