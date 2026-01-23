import React from 'react';
import { ArrowLeft, MapPin, Users, Heart } from 'lucide-react';
import { navigate } from '../lib/navigation';
import { useSEO } from '../hooks/useSEO';

const AboutPage = () => {
  useSEO({
    title: 'Om oss | Zylora - Teamet bakom tjänsten',
    description: 'Lär känna teamet bakom Zylora. Vi hjälper svenska företag få betalt för sina fakturor — innan det går till inkasso. Baserat i Göteborg.',
    canonical: 'https://zylora.se/om-oss',
  });

  return (
    <section className="min-h-screen py-32 px-6 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back link */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Tillbaka till startsidan</span>
        </button>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-6">
            <Users className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-gray-400">Om oss</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Teamet bakom Zylora
          </h1>
          <p className="text-gray-400 text-lg">
            Vi hjälper svenska företag få betalt — utan att förstöra kundrelationer.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">

          {/* Intro */}
          <div className="glass border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-display font-semibold text-white mb-4">Vilka är vi?</h2>
            <p className="text-gray-300 leading-relaxed">
              Zylora är ett team baserat i Göteborg som specialiserat sig på att hjälpa företag
              få betalt för sina fakturor — innan det går till inkasso. Vi kombinerar personlig
              service med smart teknik för att lösa betalningsproblem på ett sätt som bevarar
              era kundrelationer.
            </p>
          </div>

          {/* Team Photo Placeholder */}
          <div className="glass border border-white/10 rounded-2xl overflow-hidden">
            <div className="aspect-[16/9] bg-gradient-to-br from-violet-500/10 to-blue-500/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-violet-400" />
                </div>
                <p className="text-gray-500 text-sm">Teamfoto kommer snart</p>
              </div>
            </div>
          </div>

          {/* Why we started */}
          <div className="glass border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-violet-400" />
              <h2 className="text-xl font-display font-semibold text-white">Varför vi startade Zylora</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Vi såg ett problem: svenska företagare lägger timmar varje vecka på att jaga
                obetalda fakturor. Tid som borde gå till kunder, försäljning och tillväxt.
              </p>
              <p>
                Samtidigt såg vi hur traditionella inkassobolag ofta förstörde kundrelationer
                med aggressiva metoder. Kunder som bara hade en tuff månad blev plötsligt
                behandlade som opålitliga.
              </p>
              <p>
                Vi visste att det måste finnas ett bättre sätt. Ett steg mellan "vänta och hoppas"
                och "skicka till inkasso". Där föddes Zylora — <span className="text-white font-medium">personlig
                uppföljning som får er betalt utan att bränna broar</span>.
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="glass border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Baserat i Göteborg</h3>
                <p className="text-gray-400 text-sm">Sverige</p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="glass border border-violet-500/20 rounded-2xl p-8 bg-violet-500/5 text-center">
            <h3 className="text-xl font-display font-semibold text-white mb-3">
              Vill du veta mer?
            </h3>
            <p className="text-gray-400 mb-6">
              Vi berättar gärna mer om hur vi kan hjälpa just ditt företag.
            </p>
            <a
              href="https://calendly.com/carl-zylora/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition-all"
            >
              Boka ett samtal
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutPage;
