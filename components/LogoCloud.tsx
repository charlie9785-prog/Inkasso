import React from 'react';
import { Shield, Flag, CreditCard } from 'lucide-react';

const integrations = [
  {
    name: 'Fortnox',
    color: '#1E6B45',
    letter: 'FN',
  },
  {
    name: 'Visma',
    color: '#E31837',
    letter: 'V',
  },
  {
    name: 'Björn Lundén',
    color: '#003366',
    letter: 'BL',
  },
];

const LogoCloud: React.FC = () => {
  return (
    <section className="py-12 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-8 font-medium">
            Integrerar med
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="group flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 rounded-xl glass border border-white/10 hover:border-white/20 transition-all duration-300 cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: integration.color }}
                >
                  {integration.letter}
                </div>
                <span className="text-gray-300 font-medium group-hover:text-white transition-colors">
                  {integration.name}
                </span>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>GDPR-compliant</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Flag className="w-4 h-4 text-blue-400" />
              <span>Svenskt företag</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CreditCard className="w-4 h-4 text-violet-400" />
              <span>Ingen bindningstid</span>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            Anslut på 60 sekunder — sen sköter vi resten
          </p>
        </div>
      </div>
    </section>
  );
};

export default LogoCloud;
