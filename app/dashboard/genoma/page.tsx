'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function GenomaBuilderContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [genoma, setGenoma] = useState({
    businessName: '',
    businessType: '',
    targetAudience: '',
    mainProblem: '',
    mainObjective: '',
    services: '',
    differentiation: '',
    salesProcess: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGenoma(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/genoma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: genoma,
          status: 'draft',
        }),
      });

      if (!response.ok) throw new Error('Error al guardar');

      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el GENOMA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      {/* Header */}
      <div className="bg-gray-900/40 backdrop-blur-xl border-b border-blue-500/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2">
            ← Volver al dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">GENOMA Builder</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl border border-blue-500/20 p-8">
          <h2 className="text-3xl font-bold text-white mb-8">Define tu GENOMA de Marketing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre del Negocio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de tu Negocio</label>
              <input
                type="text"
                name="businessName"
                value={genoma.businessName}
                onChange={handleChange}
                placeholder="Ej: Mi Agencia Digital"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Tipo de Negocio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Negocio</label>
              <select
                name="businessType"
                value={genoma.businessType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Selecciona un tipo</option>
                <option value="service">Servicios</option>
                <option value="product">Productos</option>
                <option value="saas">SaaS</option>
                <option value="ecommerce">E-commerce</option>
                <option value="consulting">Consultoría</option>
                <option value="agency">Agencia</option>
              </select>
            </div>

            {/* Audiencia */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Audiencia Target</label>
              <textarea
                name="targetAudience"
                value={genoma.targetAudience}
                onChange={handleChange}
                placeholder="Describe quién es tu cliente ideal (edad, profesión, problemas, etc.)"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>

            {/* Problema Principal */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Problema Principal que Resuelves</label>
              <textarea
                name="mainProblem"
                value={genoma.mainProblem}
                onChange={handleChange}
                placeholder="¿Cuál es el principal problema que resuelves para tus clientes?"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>

            {/* Objetivo Principal */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Objetivo Principal de Marketing</label>
              <textarea
                name="mainObjective"
                value={genoma.mainObjective}
                onChange={handleChange}
                placeholder="¿Cuál es tu objetivo de marketing más importante en los próximos 3-6 meses?"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>

            {/* Servicios/Productos */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Servicios/Productos Principales</label>
              <textarea
                name="services"
                value={genoma.services}
                onChange={handleChange}
                placeholder="Lista tus servicios o productos principales"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>

            {/* Diferenciación */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">¿Qué te Diferencia?</label>
              <textarea
                name="differentiation"
                value={genoma.differentiation}
                onChange={handleChange}
                placeholder="¿Qué te hace diferente a la competencia?"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>

            {/* Proceso de Ventas */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Tu Proceso de Ventas</label>
              <textarea
                name="salesProcess"
                value={genoma.salesProcess}
                onChange={handleChange}
                placeholder="Describe tu proceso de ventas actual"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8 pt-8 border-t border-gray-700">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Guardando...' : 'Guardar GENOMA'}
            </button>
            <Link href="/dashboard" className="flex-1">
              <button className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition">
                Cancelar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GenomaBuilder() {
  return (
    <ProtectedRoute>
      <GenomaBuilderContent />
    </ProtectedRoute>
  );
}
