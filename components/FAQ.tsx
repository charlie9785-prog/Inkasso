import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, HelpCircle, Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "Vad är skillnaden mellan er och ett inkassobolag?",
    answer: "Vi arbetar innan inkasso. Personlig uppföljning i rätt ton ger betalning utan onödig friktion."
  },
  {
    question: "När börjar ni agera på en förfallen faktura?",
    answer: "Vi sätter en gräns tillsammans. När den passerats tar vi över och kontaktar kunden snabbt."
  },
  {
    question: "Vad kostar tjänsten?",
    answer: "Ingen månadsavgift eller bindningstid. Du betalar bara när betalning kommer in."
  },
  {
    question: "Hur lång tid tar det?",
    answer: "De flesta ärenden löses snabbt. Du får tydlig veckorapport."
  },
  {
    question: "Vad händer om kunden ändå inte betalar?",
    answer: "Då hjälper vi dig vidare – efter en respektfull uppföljning."
  },
  {
    question: "Hur fungerar integrationen med mitt ekonomisystem?",
    answer: "Anslut Fortnox, Visma eller Björn Lundén på en minut, sen sköter vi resten."
  },
  {
    question: "Vad händer om jag inte använder Fortnox, Visma eller Björn Lundén?",
    answer: "Kontakta oss så hittar vi en lösning."
  },
  {
    question: "Hur vet jag vad som händer i ärendet?",
    answer: "Följ allt i dashboarden, plus en tydlig veckorapport."
  },
  {
    question: "Vilka typer av företag hjälper ni?",
    answer: "Alla B2B‑företag som fakturerar andra företag."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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
    <section ref={sectionRef} className="py-12 md:py-20 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-1/2 h-[500px] bg-blue-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-1/3 h-[400px] bg-violet-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Section header */}
        <div className={`text-center mb-8 md:mb-12 reveal ${isVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-violet-500/30 transition-colors mb-6 md:mb-8 hover-glow cursor-default">
            <HelpCircle className="w-4 h-4 text-violet-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-gray-400">FAQ</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-3 md:mb-4 text-white tracking-tight leading-[1.1]">
            Vanliga frågor
          </h2>

          <p className="text-gray-400 text-base leading-relaxed">
            Har du andra frågor? <a href="#contact" className="text-violet-400 hover:text-violet-300 transition-colors accent-underline">Kontakta oss</a> så svarar vi snabbt och personligt.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`group relative reveal ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${100 + index * 50}ms` }}
              >
                <div className={`relative border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen ? 'glass border-violet-500/30' : 'glass border-white/10 hover:border-white/15'
                }`}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-4 py-4 sm:px-6 sm:py-5 md:py-6 flex items-center justify-between text-left"
                  >
                    <span className={`font-medium text-sm sm:text-base pr-4 transition-colors ${
                      isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {faq.question}
                    </span>

                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-violet-500/20 border border-violet-500/30'
                        : 'bg-white/5 border border-white/10 group-hover:border-violet-500/30'
                    }`}>
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-violet-400" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-400 group-hover:text-violet-400 transition-colors" />
                      )}
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-4 pb-4 sm:px-6 sm:pb-6 text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className={`mt-12 text-center reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '600ms' }}>
          <div className="glass border border-white/10 rounded-xl p-4 sm:p-5 md:p-6 hover:border-violet-500/20 transition-colors hover-glow">
            <p className="text-gray-400 mb-4">Hittar du inte svaret du söker?</p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium transition-colors group"
            >
              <span>Kontakta oss direkt</span>
              <ChevronDown className="w-4 h-4 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
