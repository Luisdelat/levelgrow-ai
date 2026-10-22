'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';

function DashboardContent() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      {/* Header */}
      <div className="bg-gray-900/40 backdrop-blur-xl border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">LEVELGROW AI</h1>
            <p className="text-gray-400 text-sm">Asistente de Marketing Inteligente</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">{user?.email}</p>
              <p className="text-blue-400 text-sm capitalize">{user?.plan}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* GENOMA Builder Card */}
          <Link href="/dashboard/genoma">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl p-6 cursor-pointer transition transform hover:scale-105">
              <div className="text-4xl mb-4">🧬</div>
              <h2 className="text-white text-xl font-bold mb-2">GENOMA Builder</h2>
              <p className="text-blue-100 text-sm">Crea y personaliza tu genoma de marketing</p>
            </div>
          </Link>

          {/* Chat Card */}
          <Link href="/dashboard/chat">
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl p-6 cursor-pointer transition transform hover:scale-105">
              <div className="text-4xl mb-4">💬</div>
              <h2 className="text-white text-xl font-bold mb-2">Asistente IA</h2>
              <p className="text-purple-100 text-sm">Conversa con tu asistente de marketing</p>
            </div>
          </Link>

          {/* Analytics Card */}
          <Link href="/dashboard/analytics">
            <div className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl p-6 cursor-pointer transition transform hover:scale-105">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-white text-xl font-bold mb-2">Analytics</h2>
              <p className="text-green-100 text-sm">Métricas y rendimiento de tus campañas</p>
            </div>
          </Link>
        </div>

        {/* Quick Start */}
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl border border-blue-500/20 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Comienza ahora</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="text-white font-semibold">Construye tu GENOMA</h3>
                <p className="text-gray-400 text-sm">Define los datos fundamentales de tu negocio y estrategia</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="text-white font-semibold">Chatea con el asistente</h3>
                <p className="text-gray-400 text-sm">Recibe recomendaciones personalizadas basadas en tu genoma</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="text-white font-semibold">Ejecuta y mide</h3>
                <p className="text-gray-400 text-sm">Implementa las estrategias y monitorea tu progreso</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
