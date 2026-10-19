'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Fetch user data
    fetchUserData(token);
  }, [router]);

  // Auto-redirect to GENOMA if user doesn't have one
  useEffect(() => {
    if (user && !user.profile?.genoma) {
      // Check if user just registered (no GENOMA yet)
      const hasGenomaSetupDone = localStorage.getItem('genoma-setup-done');
      if (!hasGenomaSetupDone) {
        router.push('/dashboard/onboarding');
      }
    }
  }, [user, router]);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        localStorage.removeItem('token');
        router.push('/auth/login');
        return;
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-xl text-gray-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-950/50 backdrop-blur sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-500">LEVELGROW AI</h1>
          <div className="flex gap-6 items-center">
            <Link href="/dashboard/genoma" className="text-gray-300 hover:text-white">
              GENOMA
            </Link>
            <Link href="/dashboard/chat" className="text-gray-300 hover:text-white">
              Chat
            </Link>
            <Link href="/dashboard/acciones" className="text-gray-300 hover:text-white">
              Acciones
            </Link>
            <button
              onClick={handleLogout}
              className="btn-secondary px-4 py-2"
            >
              Salir
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Bienvenido, {user?.email}</h2>
          <p className="text-gray-400">Plan: <span className="text-blue-500 font-bold">{user?.plan === 'full' ? 'Full' : 'Básico'}</span></p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* GENOMA Card */}
          <Link href="/dashboard/onboarding">
            <div className="card hover:border-blue-500 cursor-pointer transition-all">
              <div className="text-4xl mb-4">🧬</div>
              <h3 className="text-xl font-bold mb-2">GENOMA Marketing</h3>
              <p className="text-gray-400 mb-4">
                Crea tu perfil de marketing. El sistema aprenderá de tu negocio.
              </p>
              <div className="text-blue-500 font-semibold">Comenzar →</div>
            </div>
          </Link>

          {/* Chat Card */}
          <Link href="/dashboard/chat">
            <div className="card hover:border-blue-500 cursor-pointer transition-all">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Asistente IA</h3>
              <p className="text-gray-400 mb-4">
                Chat inteligente personalizado para tu negocio. Consejo 24/7.
              </p>
              <div className="text-blue-500 font-semibold">Abrir Chat →</div>
            </div>
          </Link>

          {/* Acciones Card */}
          <Link href="/dashboard/acciones">
            <div className="card hover:border-blue-500 cursor-pointer transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Acciones</h3>
              <p className="text-gray-400 mb-4">
                Plans de acción automáticos para crecer. Estrategia comprobada.
              </p>
              <div className="text-blue-500 font-semibold">Ver Acciones →</div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Tu Plan</h3>
            <p className="text-3xl font-bold text-blue-500 mb-2">
              {user?.plan === 'full' ? '$99' : '$49'}/mes
            </p>
            <p className="text-gray-400 mb-4">
              {user?.plan === 'full'
                ? 'Acceso completo a todas las funciones'
                : 'Acceso básico con límites'
              }
            </p>
            <Link href="/dashboard/billing" className="text-blue-500 hover:text-blue-400">
              Gestionar suscripción →
            </Link>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-4">Próximos Pasos</h3>
            <ol className="space-y-2 text-gray-300">
              <li>1. Completa tu GENOMA Marketing</li>
              <li>2. Habla con el asistente IA</li>
              <li>3. Ejecuta tus acciones de crecimiento</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
