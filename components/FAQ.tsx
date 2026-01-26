import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, HelpCircle, Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "Vad är skillnaden mellan er och ett inkassobolag?",
    answer: "Vi arbetar innan inkasso blir aktuellt. Istället för kravbrev och hot om betalningsanmärkning använder vårt team personlig uppföljning som bevarar kundrelationen. Målet är att du får betalt utan att förlora kunden."
  },
  {
    question: "När börjar ni agera på en förfallen faktura?",
    answer: "Vi kommer överens om en gräns som passar dig — vanligast är 7-14 dagar efter förfallodatum. Sen tar vårt team över uppföljningen utan att du behöver göra något. Ju tidigare vi kommer in, desto större chans att lösa det smidigt."
  },
  {
    question: "Vad kostar tjänsten?",
    answer: "Ingen månadsavgift. Du betalar 5% av det vi får in åt dig, max 5 000 kr per faktura. Inga dolda avgifter, ingen bindningstid."
  },
  {
    question: "Hur lång tid tar det?",
    answer: "De flesta ärenden löser vi inom 1-2 veckor. När en faktura passerar gränsen kontaktar vårt team kunden inom 24 timmar. Du får en veckorapport varje fredag så du alltid vet läget."
  },
  {
    question: "Vad händer om kunden ändå inte betalar?",
    answer: "I de få fall (cirka 4%) där vi inte lyckas kan vi hjälpa dig vidare till nästa steg. Men då har vi åtminstone försökt med personlig uppföljning först, och du vet att du gjort allt för att bevara relationen."
  },
  {
    question: "Hur fungerar Fortnox-integrationen?",
    answer: "Superenkelt! Du ansluter ditt Fortnox-konto till Zylora på 60 sekunder. Sedan tar vårt team över — du behöver aldrig logga in igen. Vi ser alla förfallna fakturor och börjar uppföljningen."
  },
  {
    question: "Vad händer om jag inte använder Fortnox?",
    answer: "Just nu stödjer vi endast Fortnox, men fler integrationer är på väg. Kontakta oss så berättar vi mer om när ditt ekonomisystem får stöd."
  },
  {
    question: "Hur vet jag vad som händer i ärendet?",
    answer: "Varje fredag får du en veckorapport via mejl med allt som hänt — vilka fakturor vårt team arbetar med, vilka betalningar som är på väg, och vilka ärenden som är lösta. Inga inloggningar, inga extra system."
  },
  {
    question: "Vilka typer av företag hjälper ni?",
    answer: "Vi hjälper alla typer av B2B-företag — från enmansföretag till större bolag. Konsulter, hantverkare, byråer, grossister — alla som fakturerar andra företag och ibland har svårt att få betalt i tid."
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
    <section ref={sectionRef} className="py-32 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-1/2 h-[500px] bg-blue-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-1/3 h-[400px] bg-violet-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Section header */}
        <div className={`text-center mb-16 reveal ${isVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-violet-500/30 transition-colors mb-8 hover-glow cursor-default">
            <HelpCircle className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-gray-400">FAQ</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white tracking-tight">
            Vanliga frågor
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed">
            Har du andra frågor? <a href="#contact" className="text-violet-400 hover:text-violet-300 transition-colors accent-underline">Kontakta oss</a> så svarar vi inom några timmar.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-4">
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
                    className="w-full px-6 py-6 flex items-center justify-between text-left"
                  >
                    <span className={`font-medium pr-4 transition-colors ${
                      isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {faq.question}
                    </span>

                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
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
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed">
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
          <div className="glass border border-white/10 rounded-2xl p-8 hover:border-violet-500/20 transition-colors hover-glow">
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
