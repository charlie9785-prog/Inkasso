import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProofBar from './components/ProofBar';
import LogoCloud from './components/LogoCloud';
import PainPoints from './components/PainPoints';
import Comparison from './components/Comparison';
import ValueProps from './components/ValueProps';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import About from './components/About';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import AboutPage from './components/AboutPage';
import ThankYou from './components/ThankYou';
import { AuthProvider } from './components/auth/AuthContext';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import FortnoxSuccess from './components/onboarding/FortnoxSuccess';
import FortnoxError from './components/onboarding/FortnoxError';
import VismaSuccess from './components/onboarding/VismaSuccess';
import VismaError from './components/onboarding/VismaError';
import GetStarted from './components/signup/GetStarted';
import { useAuth } from './hooks/useAuth';
import { navigate } from './lib/navigation';

// Re-export navigate for backwards compatibility
export { navigate };

type Page = 'home' | 'terms' | 'privacy' | 'about' | 'thankyou' | 'login' | 'dashboard' | 'onboarding' | 'fortnox-success' | 'fortnox-error' | 'visma-success' | 'visma-error' | 'kom-igang';

// Background Effects Component
const BackgroundEffects: React.FC = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-1/4 parallax-slow">
      <div className="w-[800px] h-[800px] bg-violet-600/[0.07] rounded-full blur-[150px] animate-blob-1" />
    </div>
    <div className="absolute top-1/3 right-1/4 parallax-mid">
      <div className="w-[600px] h-[600px] bg-blue-600/[0.05] rounded-full blur-[150px] animate-blob-2" />
    </div>
    <div className="absolute bottom-1/4 left-1/3 parallax-fast">
      <div className="w-[700px] h-[700px] bg-purple-600/[0.04] rounded-full blur-[150px] animate-blob-3" />
    </div>
    <div
      className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '100px 100px'
      }}
    />
    <div className="absolute inset-0 bg-gradient-radial from-transparent via-dark-950/50 to-dark-950" />
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [minDelayDone, setMinDelayDone] = useState(false);

  // Avoid flash by keeping the spinner visible for a short minimum time.
  useEffect(() => {
    const timeout = setTimeout(() => setMinDelayDone(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading]);

  const shouldShowSpinner = isLoading || !minDelayDone;

  if (shouldShowSpinner) {
    return (
      <main className="min-h-screen bg-dark-950 text-white antialiased relative">
        <BackgroundEffects />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

// Login Route Component - redirects to dashboard if already authenticated
const LoginRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [minDelayDone, setMinDelayDone] = useState(false);

  // Avoid flash by keeping the spinner visible for a short minimum time.
  useEffect(() => {
    const timeout = setTimeout(() => setMinDelayDone(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading]);

  const shouldShowSpinner = isLoading || !minDelayDone;

  if (shouldShowSpinner) {
    return (
      <main className="min-h-screen bg-dark-950 text-white antialiased relative">
        <BackgroundEffects />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
      <main className="min-h-screen bg-dark-950 text-white antialiased relative">
        <div className="scroll-progress" />
        <BackgroundEffects />
        <div className="relative z-10">
          <LoginPage />
        </div>
      </main>
  );
};

// Main App Router Component
const AppRouter: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const scrollY = window.scrollY || 0;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
      doc.style.setProperty('--scroll-y', `${scrollY}`);
      doc.style.setProperty('--scroll-progress', `${progress}`);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const getPageFromPath = useCallback((pathname: string): Page => {
    switch (pathname) {
      case '/villkor':
        return 'terms';
      case '/integritetspolicy':
        return 'privacy';
      case '/om-oss':
        return 'about';
      case '/tack':
        return 'thankyou';
      case '/login':
        return 'login';
      case '/dashboard':
        return 'dashboard';
      case '/onboarding':
        return 'onboarding';
      case '/onboarding/fortnox/success':
        return 'fortnox-success';
      case '/onboarding/fortnox/error':
        return 'fortnox-error';
      case '/onboarding/visma/success':
        return 'visma-success';
      case '/onboarding/visma/error':
        return 'visma-error';
      case '/kom-igang':
      case '/kom-igang/bekrafta':
      case '/kom-igang/klart':
        return 'kom-igang';
      default:
        return 'home';
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      const page = getPageFromPath(window.location.pathname);
      setCurrentPage(page);
      window.scrollTo(0, 0);
    };

    // Check path on mount
    handleRouteChange();

    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [getPageFromPath]);

  // Login page
  if (currentPage === 'login') {
    return <LoginRoute />;
  }

  // Onboarding (public - user creates account here)
  if (currentPage === 'onboarding') {
    return (
      <main className="min-h-screen bg-dark-950 text-white antialiased relative">
        <div className="scroll-progress" />
        <BackgroundEffects />
        <div className="relative z-10">
          <OnboardingFlow />
        </div>
      </main>
    );
  }

  // New self-service signup flow
  if (currentPage === 'kom-igang') {
    return (
      <main className="min-h-screen bg-dark-950 text-white antialiased relative">
        <div className="scroll-progress" />
        <BackgroundEffects />
        <div className="relative z-10">
          <GetStarted />
        </div>
      </main>
    );
  }

  // Dashboard (protected)
  if (currentPage === 'dashboard') {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-dark-950 text-white antialiased relative">
          <div className="scroll-progress" />
          <BackgroundEffects />
          <div className="relative z-10">
            <Dashboard />
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  // Fortnox OAuth success page (protected)
  if (currentPage === 'fortnox-success') {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-dark-950 text-white antialiased relative">
          <div className="scroll-progress" />
          <BackgroundEffects />
          <div className="relative z-10">
            <FortnoxSuccess />
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  // Fortnox OAuth error page (protected)
  if (currentPage === 'fortnox-error') {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-dark-950 text-white antialiased relative">
          <div className="scroll-progress" />
          <BackgroundEffects />
          <div className="relative z-10">
            <FortnoxError />
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  // Visma OAuth success page (protected)
  if (currentPage === 'visma-success') {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-dark-950 text-white antialiased relative">
          <div className="scroll-progress" />
          <BackgroundEffects />
          <div className="relative z-10">
            <VismaSuccess />
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  // Visma OAuth error page (protected)
  if (currentPage === 'visma-error') {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-dark-950 text-white antialiased relative">
          <div className="scroll-progress" />
          <BackgroundEffects />
          <div className="relative z-10">
            <VismaError />
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  // Thank you page has its own layout (no navbar/footer)
  if (currentPage === 'thankyou') {
    return (
      <main className="min-h-screen bg-dark-950 text-white antialiased relative">
        <div className="scroll-progress" />
        <BackgroundEffects />
        <div className="relative z-10">
          <ThankYou />
        </div>
      </main>
    );
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'terms':
        return <Terms />;
      case 'privacy':
        return <Privacy />;
      case 'about':
        return <AboutPage />;
      default:
        return (
          <>
            <Hero />
            <ProofBar />
            <LogoCloud />
            <PainPoints />
            <HowItWorks />
            <ValueProps />
            <Comparison />
            <Pricing />
            <FAQ />
            <CTA />
          </>
        );
    }
  };

  return (
    <main className="min-h-screen bg-dark-950 text-white antialiased relative">
      <div className="scroll-progress" />
      <BackgroundEffects />
      <Navbar />
      <div className="relative z-10">
        {renderContent()}
      </div>
      <Footer />
    </main>
  );
};

// Root App Component with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
