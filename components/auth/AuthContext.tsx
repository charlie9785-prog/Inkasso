import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { Tenant } from '../../types/supabase';
import { navigate } from '../../lib/navigation';

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tenant data for the logged-in user
  const fetchTenant = useCallback(async (userId: string) => {
    try {
      // First try to get tenant by matching auth user id
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If not found by id, try by email
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.email) {
          const { data: tenantByEmail } = await supabase
            .from('tenants')
            .select('*')
            .eq('email', userData.user.email)
            .single();

          if (tenantByEmail) {
            setTenant(tenantByEmail);
            return;
          }
        }
        console.warn('Could not fetch tenant:', error.message);
        return;
      }

      setTenant(data);
    } catch (err) {
      console.error('Error fetching tenant:', err);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    // Listen for auth changes - this fires immediately with current session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!isMounted) return;

        console.log('Auth state change:', event, newSession?.user?.email);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsInitialized(true);

        if (newSession?.user) {
          fetchTenant(newSession.user.id).catch(console.error);
        } else {
          setTenant(null);
        }

        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    // Also do a manual check in case onAuthStateChange doesn't fire
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isMounted) return;
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        fetchTenant(currentSession.user.id).catch(console.error);
      }
      setIsInitialized(true);
    }).catch((err) => {
      console.error('Error getting session:', err);
      if (isMounted) setIsInitialized(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchTenant]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Translate common errors to Swedish
        let errorMessage = authError.message;
        if (authError.message.includes('Invalid login credentials')) {
          errorMessage = 'Felaktiga inloggningsuppgifter';
        } else if (authError.message.includes('Email not confirmed')) {
          errorMessage = 'E-postadressen är inte verifierad';
        }
        throw new Error(errorMessage);
      }

      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        await fetchTenant(data.user.id);
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ett fel uppstod vid inloggning';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTenant]);

  const logout = useCallback(async () => {
    try {
      // Clear state first
      setUser(null);
      setTenant(null);
      setSession(null);
      // Then sign out from Supabase (onAuthStateChange will handle navigation)
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
      // Navigate anyway on error
      navigate('/login');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    tenant,
    session,
    isAuthenticated: !!user && !!session,
    isLoading: isLoading || !isInitialized,
    error,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
