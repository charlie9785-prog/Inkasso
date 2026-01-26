import React, { useState, FormEvent } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { navigate } from '../../lib/navigation';

const LoginPage: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(email, password);
    } catch {
      // Error is handled by context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center justify-center gap-3 mb-12 group w-full">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-600 rounded-lg rotate-45 group-hover:rotate-[405deg] transition-transform duration-700" />
            <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-600 rounded-lg rotate-45 blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white">Zylora</span>
        </button>

        {/* Login Card */}
        <div className="glass-strong border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/20">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              Välkommen tillbaka
            </h1>
            <p className="text-gray-400">
              Logga in för att se dina ärenden
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                E-postadress
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="namn@foretag.se"
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Lösenord
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-violet-400 transition-colors"
              >
                Glömt lösenord?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-premium group relative w-full h-12 rounded-xl overflow-hidden text-white font-semibold inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="relative z-10 inline-flex items-center">
                  Logga in
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </span>
              )}
            </button>
          </form>

        </div>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Tillbaka till startsidan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
