import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Phone, Mail, Sparkles } from 'lucide-react';

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
    <section ref={sectionRef} className="relative py-32 px-6" id="contact">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className={`relative group reveal-scale ${isVisible ? 'visible' : ''}`}>
          <div className="relative overflow-hidden rounded-3xl glass border border-white/10 px-8 py-20 text-center md:px-16 lg:px-24 hover:border-violet-500/20 transition-all duration-500">
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

              <h2 className="mb-6 text-4xl md:text-6xl font-display font-bold tracking-tight">
                <span className="text-white">Låt oss sköta det tråkiga.</span>
                <br />
                <span className="gradient-text">Så kan du fokusera på affärerna.</span>
              </h2>

              <p className="mx-auto mb-12 max-w-2xl text-lg md:text-xl text-gray-400">
                Vårt team hjälper dagligen svenska företag att få betalt. Inga bindningstider, inga dolda avgifter.
              </p>

              <div className="flex flex-col items-center justify-center gap-4">
                <a
                  href="https://calendly.com/carl-zylora/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group h-14 px-10 rounded-full btn-premium inline-flex items-center"
                >
                  <span className="relative z-10 inline-flex items-center text-base font-semibold text-white">
                    Kom igång
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>

                <span className="text-gray-500 text-sm">
                  eller ring <a href="tel:0729626822" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">072-962 68 22</a>
                </span>
              </div>

              {/* Contact info */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
                <a href="tel:0729626822" className="flex items-center gap-2 hover:text-violet-400 transition-colors group">
                  <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>072-962 68 22</span>
                </a>
                <span className="hidden sm:block text-gray-700">|</span>
                <a href="mailto:kundservice@zylora.se" className="flex items-center gap-2 hover:text-violet-400 transition-colors group">
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>kundservice@zylora.se</span>
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
