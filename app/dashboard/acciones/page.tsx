'use client';

import Link from 'next/link';
import { useState } from 'react';

const ACCIONES_EJEMPLO = [
  {
    id: 1,
    title: 'Crear estrategia de content marketing',
    description: 'Planifica 30 días de contenido para tus redes sociales',
    priority: 'high',
    duration: '2 semanas',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Lanzar primera campaña de anuncios',
    description: 'Configura tu primera campaña en Meta Ads con presupuesto inicial',
    priority: 'high',
    duration: '1 semana',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Crear funnel de ventas',
    description: 'Desarrolla un funnel de captura y conversión de leads',
    priority: 'medium',
    duration: '3 semanas',
    status: 'pending',
  },
  {
    id: 4,
    title: 'Email marketing setup',
    description: 'Configura tu plataforma de email y automatizaciones',
    priority: 'medium',
    duration: '1 semana',
    status: 'pending',
  },
];

export default function AccionesPage() {
  const [acciones, setAcciones] = useState(ACCIONES_EJEMPLO);
  const [filter, setFilter] = useState('all');

  const filteredAcciones = acciones.filter(accion => {
    if (filter === 'completed') return accion.status === 'completed';
    if (filter === 'in-progress') return accion.status === 'in-progress';
    if (filter === 'pending') return accion.status === 'pending';
    return true;
  });

  const toggleAccion = (id: number) => {
    setAcciones(prev =>
      prev.map(accion =>
        accion.id === id
          ? {
              ...accion,
              status: accion.status === 'completed' ? 'pending' : 'completed',
            }
          : accion
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'low':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '→';
      default:
        return '○';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/50 backdrop-blur sticky top-0">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">Plan de Acciones</h1>
          <p className="text-gray-400">
            Acciones personalizadas basadas en tu GENOMA y objetivos de crecimiento
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-4xl mx-auto px-4 py-6 border-b border-gray-800">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Todas ({acciones.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Pendientes ({acciones.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'in-progress'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            En progreso ({acciones.filter(a => a.status === 'in-progress').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Completadas ({acciones.filter(a => a.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Acciones List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {filteredAcciones.map(accion => (
            <div key={accion.id} className="card flex items-start gap-4 cursor-pointer hover:border-blue-500 transition-all">
              <button
                onClick={() => toggleAccion(accion.id)}
                className={`text-2xl mt-1 flex-shrink-0 ${
                  accion.status === 'completed'
                    ? 'text-green-500'
                    : 'text-gray-500 hover:text-blue-500'
                }`}
              >
                {accion.status === 'completed' ? '✓' : '○'}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3
                    className={`text-lg font-bold ${
                      accion.status === 'completed'
                        ? 'text-gray-500 line-through'
                        : 'text-white'
                    }`}
                  >
                    {accion.title}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold flex-shrink-0 ${getPriorityColor(accion.priority)}`}>
                    {accion.priority === 'high' ? 'Alta' : accion.priority === 'medium' ? 'Media' : 'Baja'}
                  </div>
                </div>

                <p className="text-gray-400 mb-3">{accion.description}</p>

                <div className="flex gap-4 text-sm text-gray-500">
                  <span>⏱️ {accion.duration}</span>
                  <span>
                    {accion.status === 'completed'
                      ? '✓ Completada'
                      : accion.status === 'in-progress'
                      ? '→ En progreso'
                      : '○ Pendiente'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAcciones.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No hay acciones en esta categoría</p>
            <Link href="/dashboard/chat" className="text-blue-500 hover:text-blue-400">
              Habla con el asistente para generar más acciones →
            </Link>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="max-w-4xl mx-auto px-4 py-8 border-t border-gray-800">
        <h2 className="text-xl font-bold mb-4">Tu Progreso</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-500">
              {acciones.filter(a => a.status === 'completed').length}/{acciones.length}
            </div>
            <p className="text-gray-400">Completadas</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-500">
              {acciones.filter(a => a.status === 'in-progress').length}
            </div>
            <p className="text-gray-400">En progreso</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-gray-500">
              {acciones.filter(a => a.status === 'pending').length}
            </div>
            <p className="text-gray-400">Pendientes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
