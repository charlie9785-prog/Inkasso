import React from 'react';
import { ArrowLeft, FileText, Shield, Scale, CreditCard, Database, Clock, AlertTriangle } from 'lucide-react';
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
            Senast uppdaterad: Januari 2026
          </p>
        </div>

        {/* Important notice */}
        <div className="mb-8 p-6 rounded-2xl bg-violet-500/10 border border-violet-500/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Viktigt att veta</h3>
              <p className="text-gray-300">
                Zylora är <strong className="text-white">inte ett inkassobolag</strong>. Vi bedriver ingen lagreglerad inkassoverksamhet
                enligt inkassolagen (1974:182). Vi hjälper företag att följa upp förfallna fakturor genom vänliga påminnelser
                via e-post och SMS – innan det blir ett inkassoärende.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8 text-gray-300 leading-relaxed">

            {/* 1. Tjänstebeskrivning */}
            <section className="glass border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <h2 className="text-xl font-display font-semibold text-white">1. Tjänstebeskrivning</h2>
              </div>

              <p className="mb-4">
                Zylora tillhandahåller en automatiserad tjänst för betalningsuppföljning före inkasso.
              </p>

              <p className="mb-4">
                Tjänsten synkroniserar förfallna fakturor från kundens ekonomisystem och skickar automatiserade,
                vänliga påminnelser via e-post och SMS enligt fördefinierade sekvenser.
              </p>

              <p className="mb-4">
                Zylora agerar uteslutande på kundens uppdrag och i kundens namn. Zylora fattar inga beslut
                om fordringars giltighet och hanterar inte tvister.
              </p>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Vad vi INTE gör:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Vi bedriver <strong className="text-white">ingen inkassoverksamhet</strong> enligt inkassolagen</li>
                <li>Vi utfärdar inga inkassokrav eller betalningsförelägganden</li>
                <li>Vi registrerar inga betalningsanmärkningar</li>
                <li>Vi kräver inga inkassoavgifter från gäldenärer</li>
              </ul>
            </section>

            {/* 2. Ansvarsbegränsning */}
            <section className="glass border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <h2 className="text-xl font-display font-semibold text-white">2. Ansvarsbegränsning</h2>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                <p className="text-amber-200 font-medium">
                  Zylora garanterar INTE att betalning kommer att ske. Vi tillhandahåller en
                  kommunikationstjänst – resultatet beror på gäldenärens betalningsförmåga och vilja.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Begränsningar:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Zyloras totala skadeståndsansvar är begränsat till de avgifter ni betalat de senaste <strong className="text-white">12 månaderna</strong></li>
                <li>Vi ansvarar <strong className="text-white">inte</strong> för indirekta skador, utebliven vinst, förlorade affärsmöjligheter eller följdskador</li>
                <li>Vi ansvarar inte för skador som uppstår på grund av felaktig information från kunden</li>
                <li>Vi ansvarar inte för tredjepartstjänster (Fortnox, Stripe, e-postleverantörer etc.)</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Kundens ansvar:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Kunden ansvarar för att fakturorna är korrekta och att det finns en giltig fordran</li>
                <li>Kunden ansvarar för att gäldenärens kontaktuppgifter är aktuella</li>
                <li>Kunden ska omedelbart informera Zylora om betalningar som inkommer direkt</li>
                <li>Kunden ska inte kontakta samma gäldenär i samma ärende utan samråd</li>
              </ul>
            </section>

            {/* 3. Avgifter */}
            <section className="glass border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-xl font-display font-semibold text-white">3. Avgifter</h2>
              </div>

              <p className="mb-4">
                Zylora tillämpar en provisionsbaserad prissättning ("success fee") baserad på faktisk betalning
                som sker efter att uppföljning påbörjats.
              </p>

              <p className="mb-4">
                Avgiftens storlek, procentsats och eventuellt tak per faktura beror på vald tjänstenivå och
                framgår i samband med registrering eller i kundens konto.
              </p>

              <p className="mb-6">
                <strong className="text-white">Ingen avgift tas ut för betalningar som sker innan Zylora påbörjat uppföljning.</strong>
              </p>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Attribution av betalningar:</h3>
              <p className="text-gray-400 mb-4">
                Success fee tas endast ut för betalningar som sker medan en uppföljning är aktiv eller inom
                fjorton (14) dagar efter att uppföljningen avslutats.
              </p>
              <p className="text-gray-400 mb-6">
                Vid bestridande pausas uppföljningen automatiskt och ingen ytterligare kommunikation sker från Zylora.
                Eventuella betalningar efter bestridande omfattas inte av success fee.
              </p>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Fakturering:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Success fee:</strong> Faktureras månadsvis i efterskott baserat på inkomna betalningar under föregående månad</li>
                <li><strong className="text-white">Betalningsvillkor:</strong> 10 dagars betalningsvillkor</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Prisändringar:</h3>
              <p className="text-gray-400">
                Zylora förbehåller sig rätten att justera priserna. Prisändringar meddelas minst 30 dagar i förväg
                och gäller från nästa faktureringsperiod. Vid prisökning har kunden rätt att säga upp avtalet utan kostnad.
              </p>
            </section>

            {/* 4. Data och GDPR */}
            <section className="glass border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Database className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="text-xl font-display font-semibold text-white">4. Data och GDPR</h2>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">Personuppgiftsbiträde</h3>
              <p className="mb-4">
                Zylora agerar som <strong className="text-white">personuppgiftsbiträde</strong> åt kunden (personuppgiftsansvarig)
                vid behandling av gäldenärers personuppgifter. Detta innebär att:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 mb-6">
                <li>Vi behandlar endast personuppgifter enligt kundens instruktioner</li>
                <li>Vi har tekniska och organisatoriska säkerhetsåtgärder på plats</li>
                <li>Vi anlitar endast godkända underbiträden (Supabase, Fortnox, Twilio etc.)</li>
                <li>Vi bistår vid registerutdrag, rättelser och radering på begäran</li>
                <li>Vi raderar all data vid avtalets upphörande om inget annat avtalats</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mb-3">Datalagring</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400 mb-6">
                <li>All data lagras inom EU/EES (primärt Sverige)</li>
                <li>Data krypteras både vid överföring (TLS) och i vila</li>
                <li>Kunddata sparas så länge avtalet är aktivt plus eventuell arkiveringstid enligt lag</li>
                <li>Ärendehistorik kan på begäran exporteras i maskinläsbart format</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mb-3">Era rättigheter</h3>
              <p className="text-gray-400">
                Kunden kan när som helst begära export eller radering av all lagrad data.
                För fullständig information om hur vi hanterar personuppgifter, se vår{' '}
                <button onClick={() => navigate('/integritetspolicy')} className="text-violet-400 hover:text-violet-300">
                  Integritetspolicy
                </button>.
              </p>
            </section>

            {/* 5. Uppsägning */}
            <section className="glass border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-rose-400" />
                </div>
                <h2 className="text-xl font-display font-semibold text-white">5. Avtalstid och uppsägning</h2>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <p className="text-emerald-200 font-medium">
                  Ingen bindningstid! Säg upp när som helst med 30 dagars varsel.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Avtalstid:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Avtalet gäller tillsvidare från det datum registrering genomförts</li>
                <li>Avgifter faktureras månadsvis i efterskott</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Uppsägning:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Båda parter kan säga upp avtalet med <strong className="text-white">30 dagars</strong> skriftlig uppsägningstid</li>
                <li>Uppsägning sker via e-post till <a href="mailto:supprt@zylora.se" className="text-violet-400 hover:text-violet-300">supprt@zylora.se</a></li>
                <li>Vid uppsägning slutförs pågående ärenden under uppsägningstiden</li>
                <li>Success fee för betalningar som inkommer under uppsägningstiden faktureras enligt vanliga villkor</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Vid avtalsbrott:</h3>
              <p className="text-gray-400 mb-4">
                Zylora förbehåller sig rätten att omedelbart säga upp avtalet vid väsentligt avtalsbrott,
                exempelvis utebliven betalning eller missbruk av tjänsten.
              </p>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Missbruk:</h3>
              <p className="text-gray-400">
                Zylora har rätt att begränsa, pausa eller avsluta tillgång till tjänsten vid missbruk,
                onormalt användningsmönster, försök till kringgående av avgiftsmodell eller handlingar
                som kan skada Zyloras eller tredje parts varumärke eller leveransförmåga.
              </p>
            </section>

            {/* 6. Övrigt */}
            <section className="glass border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-gray-400" />
                </div>
                <h2 className="text-xl font-display font-semibold text-white">6. Övrigt</h2>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">Tillämplig lag</h3>
              <p className="text-gray-400 mb-6">
                Dessa villkor regleras av svensk lag. Tvister avgörs av svensk allmän domstol med
                Stockholms tingsrätt som första instans.
              </p>

              <h3 className="text-lg font-semibold text-white mb-3">Force majeure</h3>
              <p className="text-gray-400 mb-6">
                Part är befriad från påföljd för underlåtenhet att fullgöra förpliktelse enligt avtalet
                om underlåtenheten har sin grund i omständighet utanför partens kontroll som förhindrar
                fullgörandet (force majeure). Detta inkluderar men är inte begränsat till krig, naturkatastrofer,
                pandemi, myndighetsåtgärder, omfattande strömavbrott, eller fel i tredjepartstjänster som
                ligger utanför Zyloras kontroll.
              </p>

              <h3 className="text-lg font-semibold text-white mb-3">Ändringar av villkoren</h3>
              <p className="text-gray-400 mb-6">
                Zylora kan ändra dessa villkor. Väsentliga ändringar meddelas minst 30 dagar i förväg via e-post.
                Fortsatt användning av tjänsten efter ändring innebär godkännande av de nya villkoren.
              </p>

              <h3 className="text-lg font-semibold text-white mb-3">Överlåtelse</h3>
              <p className="text-gray-400">
                Kunden får inte överlåta sina rättigheter eller skyldigheter enligt detta avtal utan Zyloras
                skriftliga medgivande. Zylora har rätt att överlåta avtalet vid fusion, överlåtelse av verksamhet
                eller liknande omstrukturering.
              </p>
            </section>

            {/* 7. Kontakt */}
            <section className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4">7. Kontakt</h2>
              <p className="mb-4">
                Frågor om dessa villkor besvaras av:
              </p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-semibold text-white text-lg mb-2">Zylora AB</p>
                <p className="text-gray-400">Org.nr: 559XXX-XXXX</p>
                <p className="text-gray-400 mt-3">
                  <strong className="text-white">E-post:</strong>{' '}
                  <a href="mailto:supprt@zylora.se" className="text-violet-400 hover:text-violet-300">
                    supprt@zylora.se
                  </a>
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Terms;
