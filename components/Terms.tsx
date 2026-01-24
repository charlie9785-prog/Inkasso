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
            Senast uppdaterad: Januari 2025
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
                via e-post, SMS och telefon – innan det blir ett inkassoärende.
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
                Zylora erbjuder en tjänst för proaktiv betalningsuppföljning av förfallna fakturor.
                Vårt uppdrag är att hjälpa företag att få betalt snabbare genom professionell och respektfull kommunikation.
              </p>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Vad vi gör:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Synkroniserar förfallna fakturor från ert ekonomisystem (Fortnox m.fl.)</li>
                <li>Skickar automatiska påminnelser via e-post och SMS i ert namn</li>
                <li>Genomför personliga telefonsamtal till era kunder vid behov</li>
                <li>Upprättar betalningsplaner och hanterar kommunikation</li>
                <li>Ger er full insyn via dashboard med realtidsuppdateringar</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Vad vi INTE gör:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Vi bedriver <strong className="text-white">ingen inkassoverksamhet</strong> enligt inkassolagen</li>
                <li>Vi utfärdar inga inkassokrav eller betalningsförelägganden</li>
                <li>Vi registrerar inga betalningsanmärkningar</li>
                <li>Vi kräver inga inkassoavgifter från gäldenärer</li>
              </ul>

              <p className="mt-4 text-gray-400 italic">
                Zylora agerar som en förlängning av ert eget företag och skickar påminnelser på uppdrag av er som kund.
                Era kunder ser era företagsuppgifter i all kommunikation.
              </p>
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

            {/* 3. Priser och betalning */}
            <section className="glass border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-xl font-display font-semibold text-white">3. Priser och betalning</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-500 mb-1">Månadsavgift</p>
                  <p className="text-2xl font-bold text-white">1 900 kr</p>
                  <p className="text-sm text-gray-400">exkl. moms / månad</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-500 mb-1">Success fee</p>
                  <p className="text-2xl font-bold text-white">10%</p>
                  <p className="text-sm text-gray-400">på återvunna belopp (max 10 000 kr/mån)</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Fakturering:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Månadsavgift:</strong> Debiteras månadsvis i förskott via kort (Stripe)</li>
                <li><strong className="text-white">Success fee:</strong> Faktureras månadsvis i efterskott baserat på inkomna betalningar under föregående månad</li>
                <li><strong className="text-white">Betalningsvillkor:</strong> Success fee faktureras med 10 dagars betalningsvillkor</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Success fee beräkning:</h3>
              <p className="text-gray-400">
                Success fee beräknas på belopp som betalas in efter att Zylora påbörjat uppföljningen av ärendet.
                Belopp som betalas in före första påminnelse är kostnadsfria. Success fee är maximerad till
                <strong className="text-white"> 10 000 kr per månad</strong> oavsett totalt återvunnet belopp.
              </p>

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
                <li>Avtalet gäller tillsvidare från det datum betalning genomförts</li>
                <li>Månadsavgiften debiteras automatiskt varje månad</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Uppsägning:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Båda parter kan säga upp avtalet med <strong className="text-white">30 dagars</strong> skriftlig uppsägningstid</li>
                <li>Uppsägning sker via e-post till <a href="mailto:kundservice@zylora.se" className="text-violet-400 hover:text-violet-300">kundservice@zylora.se</a></li>
                <li>Vid uppsägning slutförs pågående ärenden under uppsägningstiden</li>
                <li>Redan betald månadsavgift återbetalas ej</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Vid avtalsbrott:</h3>
              <p className="text-gray-400">
                Zylora förbehåller sig rätten att omedelbart säga upp avtalet vid väsentligt avtalsbrott,
                exempelvis utebliven betalning eller missbruk av tjänsten.
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
                  <a href="mailto:kundservice@zylora.se" className="text-violet-400 hover:text-violet-300">
                    kundservice@zylora.se
                  </a>
                </p>
                <p className="text-gray-400">
                  <strong className="text-white">Telefon:</strong>{' '}
                  <a href="tel:0729626822" className="text-violet-400 hover:text-violet-300">
                    072-962 68 22
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
