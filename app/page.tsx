'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-950/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-500">LEVELGROW AI</div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="btn-secondary">
              Ingresar
            </Link>
            <Link href="/auth/register" className="btn-primary">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">
            Tu Asistente de Marketing IA
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Basado en la metodología HAZTUAGENCIA. Automatiza tu marketing y crece sin límites.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary px-8 py-3 text-lg">
              Comenzar Gratis
            </Link>
            <button className="btn-secondary px-8 py-3 text-lg">
              Ver Demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 my-16">
          <div className="card">
            <div className="text-4xl mb-4">🧬</div>
            <h3 className="text-xl font-bold mb-2">GENOMA Marketing</h3>
            <p className="text-gray-400">
              Analiza tu negocio y crea un perfil completo. El sistema aprende de ti.
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">Asistente IA</h3>
            <p className="text-gray-400">
              Chat inteligente que responde según tu GENOMA. Consejo personalizado 24/7.
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Acciones Automáticas</h3>
            <p className="text-gray-400">
              Planes de acción generados por IA. Crece con estrategia comprobada.
            </p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="my-20">
          <h2 className="text-4xl font-bold text-center mb-12">Planes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Plan */}
            <div className="card border-2 border-gray-700">
              <h3 className="text-2xl font-bold mb-2">Plan Básico</h3>
              <div className="text-4xl font-bold text-blue-500 mb-4">$49<span className="text-lg text-gray-400">/mes</span></div>
              <ul className="space-y-3 mb-8 text-gray-300">
                <li>✓ GENOMA Marketing Completo</li>
                <li>✓ Chat IA Personalizado</li>
                <li>✓ 100 Mensajes/mes</li>
                <li>✓ Acciones Básicas</li>
              </ul>
              <Link href="/auth/register?plan=basic" className="btn-primary w-full text-center">
                Comenzar Ahora
              </Link>
            </div>

            {/* Full Plan */}
            <div className="card border-2 border-blue-500 relative">
              <div className="absolute -top-4 right-6 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Plan Full</h3>
              <div className="text-4xl font-bold text-blue-500 mb-4">$99<span className="text-lg text-gray-400">/mes</span></div>
              <ul className="space-y-3 mb-8 text-gray-300">
                <li>✓ Todo del Plan Básico</li>
                <li>✓ Mensajes Ilimitados</li>
                <li>✓ Análisis Avanzado</li>
                <li>✓ Exportar Reportes</li>
                <li>✓ Soporte Prioritario</li>
              </ul>
              <Link href="/auth/register?plan=full" className="btn-primary w-full text-center">
                Comenzar Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400">
          <p>© 2024 LEVELGROW AI. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
