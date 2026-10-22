import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  email: string;
  plan: string;
}

export interface AuthSubscription {
  status: string;
  currentPeriodEnd: string | null;
  hasPayPal: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [subscription, setSubscription] = useState<AuthSubscription | null>(null);
  // null = unknown (for example after a temporary server error).
  const [access, setAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const check = useCallback(async () => {
    let token = '';
    try {
      token = localStorage.getItem('token') ?? '';
    } catch {
      // ignore
    }
    if (!token) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (response.status === 401 || response.status === 404) {
        // Invalid or expired session.
        localStorage.removeItem('token');
        setAuthenticated(false);
        return;
      }
      if (!response.ok) throw new Error(`verify ${response.status}`);

      const data = await response.json();
      setUser(data.user);
      setSubscription(data.subscription ?? null);
      setAccess(Boolean(data.access));
      setAuthenticated(true);
    } catch (error) {
      // Temporary server problem: keep the session, show the app as signed in.
      console.error('Auth check failed:', error);
      setAuthenticated(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthenticated(false);
    router.push('/auth/login');
  };

  return { user, subscription, access, loading, authenticated, logout, refresh: check };
}
