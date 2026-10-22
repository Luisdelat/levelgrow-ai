'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';

function AnalyticsContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      <div className="bg-gray-900/40 backdrop-blur-xl border-b border-blue-500/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2">
            ← Volver
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h1 className="text-4xl font-bold text-white mb-4">Analytics</h1>
        <p className="text-gray-400 text-lg mb-8">Métricas y rendimiento de tus campañas</p>
        <p className="text-gray-500">Próximamente con dashboards interactivos</p>
      </div>
    </div>
  );
}

export default function Analytics() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  );
}
