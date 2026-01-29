import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { navigate } from '../lib/navigation';
import { useSEO } from '../hooks/useSEO';

const Privacy = () => {
  useSEO({
    title: 'Integritetspolicy | Zylora',
    description: 'Läs om hur Zylora hanterar personuppgifter enligt GDPR. Vi värnar om din integritet.',
    canonical: 'https://zylora.se/integritetspolicy',
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
            <Shield className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-gray-400">Dataskydd</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Integritetspolicy
          </h1>
          <p className="text-gray-400">
            Senast uppdaterad: Januari 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8 text-gray-300 leading-relaxed">

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">1. Inledning</h2>
              <p>
                Zylora AB, org.nr 559XXX-XXXX ("Zylora", "vi", "oss") är personuppgiftsansvarig för behandlingen
                av personuppgifter som beskrivs i denna integritetspolicy.
              </p>
              <p className="mt-4">
                Vi värnar om din integritet och är måna om att skydda de personuppgifter vi behandlar.
                Denna policy förklarar hur vi samlar in, använder och skyddar dina personuppgifter i
                enlighet med EU:s dataskyddsförordning (GDPR).
              </p>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">2. Vilka personuppgifter samlar vi in?</h2>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Från våra kunder (företag)</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Kontaktuppgifter: namn, e-post, telefonnummer</li>
                <li>Företagsinformation: företagsnamn, organisationsnummer, adress</li>
                <li>Fakturainformation från ekonomisystem-integration (Fortnox, Visma, Björn Lundén)</li>
                <li>Kommunikation: e-post och anteckningar från samtal</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Från gäldenärer (kunders kunder)</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Kontaktuppgifter: namn, e-post, telefonnummer</li>
                <li>Företagsinformation: företagsnamn, organisationsnummer</li>
                <li>Fakturainformation: fakturanummer, belopp, förfallodatum</li>
                <li>Betalningshistorik och kommunikation</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Från webbplatsbesökare</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Teknisk data: IP-adress, webbläsartyp, enhetsinformation</li>
                <li>Användningsdata: sidvisningar, klick, tid på sidan</li>
                <li>Kontaktformulär: namn, e-post, meddelande</li>
              </ul>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">3. Varför behandlar vi personuppgifter?</h2>
              <div className="overflow-x-auto">
                <table className="w-full mt-4 text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 text-white font-semibold">Ändamål</th>
                      <th className="text-left py-3 text-white font-semibold">Laglig grund</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    <tr className="border-b border-white/5">
                      <td className="py-3">Leverera våra tjänster</td>
                      <td className="py-3">Avtal</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3">Kontakta gäldenärer</td>
                      <td className="py-3">Berättigat intresse</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3">Fakturering</td>
                      <td className="py-3">Avtal / Rättslig förpliktelse</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3">Marknadsföring</td>
                      <td className="py-3">Samtycke / Berättigat intresse</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3">Förbättra våra tjänster</td>
                      <td className="py-3">Berättigat intresse</td>
                    </tr>
                    <tr>
                      <td className="py-3">Uppfylla lagkrav</td>
                      <td className="py-3">Rättslig förpliktelse</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">4. Hur länge sparar vi uppgifterna?</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Kunduppgifter:</strong> Under avtalsperioden plus 24 månader</li>
                <li><strong className="text-white">Gäldenärsuppgifter:</strong> Tills ärendet är avslutat plus 12 månader</li>
                <li><strong className="text-white">Bokföringsmaterial:</strong> 7 år enligt bokföringslagen</li>
                <li><strong className="text-white">Webbplatsdata:</strong> Upp till 26 månader</li>
              </ul>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">5. Vem delar vi uppgifter med?</h2>
              <p>Vi kan dela personuppgifter med:</p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-gray-400">
                <li><strong className="text-white">IT-leverantörer:</strong> För hosting, e-post och andra tekniska tjänster</li>
                <li><strong className="text-white">Ekonomisystem:</strong> Fortnox, Visma eller Björn Lundén för integration med kundens bokföringssystem</li>
                <li><strong className="text-white">Myndigheter:</strong> Om det krävs enligt lag</li>
              </ul>
              <p className="mt-4">
                Vi säljer aldrig personuppgifter till tredje part. Alla våra underleverantörer är bundna
                av sekretess och personuppgiftsbiträdesavtal.
              </p>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">6. Dina rättigheter</h2>
              <p>Enligt GDPR har du följande rättigheter:</p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-gray-400">
                <li><strong className="text-white">Tillgång:</strong> Rätt att få veta vilka uppgifter vi har om dig</li>
                <li><strong className="text-white">Rättelse:</strong> Rätt att korrigera felaktiga uppgifter</li>
                <li><strong className="text-white">Radering:</strong> Rätt att få uppgifter raderade ("rätten att bli glömd")</li>
                <li><strong className="text-white">Begränsning:</strong> Rätt att begränsa behandlingen</li>
                <li><strong className="text-white">Dataportabilitet:</strong> Rätt att få ut dina uppgifter i maskinläsbart format</li>
                <li><strong className="text-white">Invändning:</strong> Rätt att invända mot behandling baserad på berättigat intresse</li>
              </ul>
              <p className="mt-4">
                För att utöva dina rättigheter, kontakta oss på <a href="mailto:supprt@zylora.se" className="text-violet-400 hover:text-violet-300">supprt@zylora.se</a>.
              </p>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">7. Cookies</h2>
              <p>
                Vår webbplats använder cookies för att förbättra din upplevelse. Vi använder:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-gray-400">
                <li><strong className="text-white">Nödvändiga cookies:</strong> Krävs för att webbplatsen ska fungera</li>
                <li><strong className="text-white">Analyscookies:</strong> Hjälper oss förstå hur besökare använder sidan</li>
              </ul>
              <p className="mt-4">
                Du kan hantera cookies i din webbläsares inställningar.
              </p>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">8. Säkerhet</h2>
              <p>
                Vi vidtar lämpliga tekniska och organisatoriska åtgärder för att skydda dina personuppgifter,
                inklusive:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-gray-400">
                <li>Kryptering av data vid överföring (TLS/SSL)</li>
                <li>Säker lagring hos etablerade molnleverantörer inom EU</li>
                <li>Begränsad åtkomst baserad på behov</li>
                <li>Regelbunden säkerhetsöversyn</li>
              </ul>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">9. Ändringar i policyn</h2>
              <p>
                Vi kan uppdatera denna policy vid behov. Väsentliga ändringar meddelas via e-post
                eller på vår webbplats. Datumet för senaste uppdatering anges alltid överst i dokumentet.
              </p>
            </section>

            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">10. Kontakt och klagomål</h2>
              <p>
                Vid frågor om vår behandling av personuppgifter, kontakta oss:
              </p>
              <div className="mt-4 text-gray-400">
                <p><strong className="text-white">Zylora AB</strong></p>
                <p>E-post: <a href="mailto:supprt@zylora.se" className="text-violet-400 hover:text-violet-300">supprt@zylora.se</a></p>
              </div>
              <p className="mt-4">
                Du har även rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY) om du
                anser att vi behandlar dina personuppgifter felaktigt.
              </p>
              <div className="mt-4 text-gray-400">
                <p><strong className="text-white">Integritetsskyddsmyndigheten</strong></p>
                <p>Box 8114, 104 20 Stockholm</p>
                <p>Webbplats: <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">www.imy.se</a></p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
