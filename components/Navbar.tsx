import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { navigate } from '../lib/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-strong border-b border-white/10 shadow-2xl shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Zylora"
            className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {['Tjänster', 'Arbetssätt', 'Priser', 'Kontakt'].map((item, i) => (
            <a
              key={item}
              href={`#${['services', 'process', 'pricing', 'contact'][i]}`}
              className="relative px-5 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors group"
            >
              {item}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          <button
            onClick={() => navigate('/om-oss')}
            className="relative px-5 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors group"
          >
            Om oss
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500 group-hover:w-full transition-all duration-300" />
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:0729626822"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>072-962 68 22</span>
          </a>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Logga in
          </button>
          <a
            href="https://calendly.com/carl-zylora/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium group relative h-10 px-6 rounded-full overflow-hidden text-sm font-semibold text-white inline-flex items-center"
          >
            <span className="relative z-10 inline-flex items-center">
              Kom igång
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden relative w-10 h-10 rounded-lg glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/30 transition-all"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-20 left-0 right-0 glass-strong border-b border-white/10 overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 flex flex-col gap-2">
          {['Tjänster', 'Arbetssätt', 'Priser', 'Kontakt'].map((item, i) => (
            <a
              key={item}
              href={`#${['services', 'process', 'pricing', 'contact'][i]}`}
              className="px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <button
            onClick={() => {
              navigate('/om-oss');
              setMobileMenuOpen(false);
            }}
            className="px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            Om oss
          </button>
          <div className="h-px bg-white/10 my-3" />
          <a
            href="tel:0729626822"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>072-962 68 22</span>
          </a>
          <button
            onClick={() => {
              navigate('/login');
              setMobileMenuOpen(false);
            }}
            className="px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            Logga in
          </button>
          <a
            href="https://calendly.com/carl-zylora/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium mt-2 w-full h-12 rounded-xl text-white font-semibold inline-flex items-center justify-center"
          >
            <span className="relative z-10">Kom igång</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;