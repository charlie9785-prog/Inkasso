import React from 'react';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { navigate } from '../lib/navigation';

const footerLinks = {
  tjanster: [
    { name: 'Fakturabevakning', href: '#services', isExternal: false },
    { name: 'Så fungerar det', href: '#process', isExternal: false },
    { name: 'Priser', href: '#pricing', isExternal: false },
  ],
  foretaget: [
    { name: 'Om oss', href: '/om-oss', isExternal: true },
    { name: 'Villkor', href: '/villkor', isExternal: true },
    { name: 'Integritetspolicy', href: '/integritetspolicy', isExternal: true },
  ],
};

const Footer = () => {
  return (
    <footer className="relative border-t border-white/5 pt-20 pb-10 px-6 overflow-hidden">
      {/* Background effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-violet-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-600 rounded-lg rotate-45 group-hover:rotate-[405deg] transition-transform duration-700" />
                <div className="absolute inset-0 w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-600 rounded-lg rotate-45 blur-lg opacity-50" />
              </div>
              <span className="font-display font-bold text-xl text-white">Zylora</span>
            </a>

            <p className="text-gray-500 leading-relaxed mb-6">
              Vi sköter dialogen med era kunder – tills ni fått betalt.
            </p>

          </div>

          {/* Tjänster */}
          <div>
            <h4 className="text-white font-semibold mb-6">Tjänster</h4>
            <ul className="space-y-4">
              {footerLinks.tjanster.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Företaget */}
          <div>
            <h4 className="text-white font-semibold mb-6">Företaget</h4>
            <ul className="space-y-4">
              {footerLinks.foretaget.map((link) => (
                <li key={link.name}>
                  {link.isExternal ? (
                    <button
                      onClick={() => navigate(link.href)}
                      className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="text-white font-semibold mb-6">Kontakt</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:0729626822"
                  className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-violet-500/30 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>072-962 68 22</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:kundservice@zylora.se"
                  className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-violet-500/30 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>kundservice@zylora.se</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Stockholm, Sverige</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            © 2025 Zylora AB. Alla rättigheter förbehållna.
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <button onClick={() => navigate('/villkor')} className="hover:text-white transition-colors">Villkor</button>
            <button onClick={() => navigate('/integritetspolicy')} className="hover:text-white transition-colors">Integritet</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;