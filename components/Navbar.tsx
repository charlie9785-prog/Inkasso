import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { navigate } from '../lib/navigation';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
          <img
            src={logoImg}
            alt="Zylora"
            className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-display font-bold text-lg tracking-tight text-white">Zylora</span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {['Tjänster', 'Arbetssätt', 'Priser', 'Kontakt'].map((item, i) => {
            const sectionId = ['services', 'process', 'pricing', 'contact'][i];
            return (
              <button
                key={item}
                onClick={() => {
                  if (window.location.pathname !== '/') {
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  } else {
                    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="relative px-5 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors group"
              >
                {item}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500 group-hover:w-full transition-all duration-300" />
              </button>
            );
          })}
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
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Logga in
          </button>
          <button
            onClick={() => navigate('/kom-igang')}
            className="btn-premium group relative h-10 px-6 rounded-full overflow-hidden text-sm font-semibold text-white inline-flex items-center"
            type="button"
          >
            <span className="relative z-10 inline-flex items-center">
              Kom igång gratis
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden relative w-10 h-10 rounded-lg glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/30 transition-all"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          aria-label={mobileMenuOpen ? 'Stäng meny' : 'Öppna meny'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-16 left-0 right-0 glass-strong border-b border-white/10 overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 flex flex-col gap-2">
          {['Tjänster', 'Arbetssätt', 'Priser', 'Kontakt'].map((item, i) => {
            const sectionId = ['services', 'process', 'pricing', 'contact'][i];
            return (
              <button
                key={item}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (window.location.pathname !== '/') {
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  } else {
                    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {item}
              </button>
            );
          })}
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
          <button
            onClick={() => {
              navigate('/login');
              setMobileMenuOpen(false);
            }}
            className="px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            Logga in
          </button>
          <button
            onClick={() => navigate('/kom-igang')}
            className="btn-premium mt-2 w-full h-11 rounded-xl text-white font-semibold inline-flex items-center justify-center"
            type="button"
          >
            <span className="relative z-10">Kom igång gratis</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
