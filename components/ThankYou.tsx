import React from 'react';
import { CheckCircle, Mail, Calendar, ArrowRight } from 'lucide-react';

const ThankYou = () => {
  return (
    <section className="min-h-screen flex flex-col">
      {/* Main content - centered */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-xl w-full text-center">
          {/* Success icon */}
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle className="w-12 h-12 text-emerald-400" />
              </div>
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-emerald-500/20 animate-ping opacity-20" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Tack för din bokning!
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-400 mb-8">
            Vi ser fram emot att prata med dig.
          </p>

          {/* Info card */}
          <div className="glass border border-white/10 rounded-2xl p-8 mb-8 text-left">
            <h2 className="text-lg font-display font-semibold text-white mb-6 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-violet-400" />
              Vad händer nu?
            </h2>

            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-400 font-semibold text-sm">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">Bekräftelse via mejl</p>
                  <p className="text-gray-500 text-sm">Du får en kalenderinbjudan inom några minuter.</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-400 font-semibold text-sm">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">Vi ringer dig</p>
                  <p className="text-gray-500 text-sm">På bokad tid ringer vi upp dig för ett kort samtal.</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-400 font-semibold text-sm">3</span>
                </div>
                <div>
                  <p className="text-white font-medium">Vi diskuterar era behov</p>
                  <p className="text-gray-500 text-sm">Tillsammans går vi igenom hur Zylora kan hjälpa ert företag.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Questions box */}
          <div className="glass border border-white/10 rounded-2xl p-6 mb-10">
            <p className="text-gray-400 mb-4">
              Har du frågor innan samtalet? Kontakta oss gärna:
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <a
                href="mailto:supprt@zylora.se"
                className="flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>supprt@zylora.se</span>
              </a>
            </div>
          </div>

          {/* Back to home */}
          <a
            href="#"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
          >
            <span>Tillbaka till startsidan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Simple footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-blue-600 rounded-md rotate-45" />
            <span className="font-display font-semibold text-white">Zylora</span>
          </div>
          <span>© 2025 Zylora AB</span>
        </div>
      </footer>
    </section>
  );
};

export default ThankYou;
