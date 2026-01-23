import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { navigate } from '../lib/navigation';
import { useSEO } from '../hooks/useSEO';

const Terms = () => {
  useSEO({
    title: 'Allmänna villkor | Zylora',
    description: 'Läs Zyloras allmänna villkor för fakturabevakning och uppföljning av förfallna fakturor.',
    canonical: 'https://zylora.se/villkor',
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
            <FileText className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-gray-400">Juridiskt</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Allmänna villkor
          </h1>
          <p className="text-gray-400">
            Senast uppdaterad: Januari 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8 text-gray-300 leading-relaxed">

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">1. Allmänt</h2>
              <p>
                Dessa allmänna villkor ("Villkoren") gäller mellan Zylora AB, org.nr 559XXX-XXXX ("Zylora", "vi", "oss")
                och den juridiska person som ingår avtal om Zyoras tjänster ("Kunden", "ni").
              </p>
              <p className="mt-4">
                Genom att använda Zyoras tjänster accepterar Kunden dessa Villkor i sin helhet.
              </p>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">2. Tjänstebeskrivning</h2>
              <p>
                Zylora erbjuder en tjänst för uppföljning av förfallna fakturor före inkasso. Tjänsten inkluderar:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-gray-400">
                <li>Integration med Kundens ekonomisystem (Fortnox, Visma eller Björn Lundén) för att identifiera förfallna fakturor</li>
                <li>Personlig uppföljning med Kundens gäldenärer via telefon och e-post</li>
                <li>Statusuppdateringar och insyn i realtid</li>
                <li>Rådgivning kring vidare åtgärder vid behov</li>
              </ul>
              <p className="mt-4">
                Zylora är inte ett inkassobolag och bedriver ingen lagreglerad inkassoverksamhet enligt inkassolagen (1974:182).
              </p>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">3. Priser och betalning</h2>
              <p><strong className="text-white">Management fee:</strong> 1 900 kr exkl. moms per månad.</p>
              <p className="mt-2"><strong className="text-white">Performance fee:</strong> 10% på belopp som drivs in efter att Zylora påbörjat uppföljningen.</p>
              <p className="mt-4">
                Management fee faktureras månadsvis i förskott. Performance fee faktureras månadsvis i efterskott
                baserat på inkomna betalningar. Betalningsvillkor är 10 dagar netto.
              </p>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">4. Avtalstid och uppsägning</h2>
              <p>
                Avtalet gäller tills vidare utan bindningstid. Båda parter kan säga upp avtalet med 30 dagars
                skriftlig uppsägningstid. Vid uppsägning slutförs pågående ärenden enligt överenskommelse.
              </p>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">5. Kundens ansvar</h2>
              <p>Kunden ansvarar för att:</p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-gray-400">
                <li>Tillhandahålla korrekt och uppdaterad information om fakturor och gäldenärer</li>
                <li>Säkerställa att fakturorna är riktiga och att det finns en fordran</li>
                <li>Informera Zylora om betalningar som inkommer direkt till Kunden</li>
                <li>Inte själv kontakta gäldenärer i samma ärende utan samråd med Zylora</li>
              </ul>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">6. Zyoras ansvar</h2>
              <p>
                Zylora åtar sig att utföra tjänsten professionellt och med omsorg. Zylora garanterar dock inte
                att betalning kommer att ske från gäldenären.
              </p>
              <p className="mt-4">
                Zyoras ansvar är begränsat till direkta skador och uppgår maximalt till de avgifter Kunden
                erlagt under de senaste 12 månaderna. Zylora ansvarar inte för indirekta skador,
                utebliven vinst eller förlust av affärsmöjligheter.
              </p>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">7. Sekretess</h2>
              <p>
                Zylora förbinder sig att behandla all information om Kunden och dess gäldenärer konfidentiellt.
                Information delas endast med tredje part om det är nödvändigt för att utföra tjänsten eller
                om det krävs enligt lag.
              </p>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">8. Personuppgifter</h2>
              <p>
                Zylora behandlar personuppgifter i enlighet med gällande dataskyddslagstiftning.
                För mer information, se vår <button onClick={() => navigate('/integritetspolicy')} className="text-violet-400 hover:text-violet-300">Integritetspolicy</button>.
              </p>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">9. Ändringar av villkoren</h2>
              <p>
                Zylora förbehåller sig rätten att ändra dessa Villkor. Väsentliga ändringar meddelas Kunden
                minst 30 dagar i förväg. Fortsatt användning av tjänsten efter ändring innebär accept av
                de nya villkoren.
              </p>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">10. Tvistelösning</h2>
              <p>
                Tvister som uppstår i anledning av dessa Villkor ska i första hand lösas genom förhandling.
                Om parterna inte kan enas ska tvisten avgöras av svensk allmän domstol med Stockholms
                tingsrätt som första instans. Svensk lag ska tillämpas.
              </p>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">11. Kontakt</h2>
              <p>
                Vid frågor om dessa villkor, kontakta oss på:
              </p>
              <div className="mt-4 text-gray-400">
                <p><strong className="text-white">Zylora AB</strong></p>
                <p>E-post: <a href="mailto:kundservice@zylora.se" className="text-violet-400 hover:text-violet-300">kundservice@zylora.se</a></p>
                <p>Telefon: 072-962 68 22</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Terms;
