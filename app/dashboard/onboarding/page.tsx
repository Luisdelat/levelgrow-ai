'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const GENOMA_QUESTIONS = [
  {
    id: 'businessName',
    label: '¿Cuál es el nombre de tu negocio?',
    type: 'text',
  },
  {
    id: 'businessType',
    label: '¿Qué tipo de negocio tienes?',
    type: 'text',
    placeholder: 'Ej: Agencia de marketing, E-commerce, SaaS, etc.',
  },
  {
    id: 'businessStage',
    label: '¿En qué etapa está tu negocio?',
    type: 'select',
    options: ['Idea', 'Iniciando', '1-5 años', '5-10 años', 'Consolidado'],
  },
  {
    id: 'targetAudience',
    label: '¿Quién es tu cliente ideal?',
    type: 'text',
    placeholder: 'Describe características principales...',
  },
  {
    id: 'mainProblem',
    label: '¿Cuál es tu principal problema ahora?',
    type: 'text',
    placeholder: 'Ej: Conseguir clientes, retener clientes, aumentar ventas, etc.',
  },
  {
    id: 'mainObjective',
    label: '¿Cuál es tu objetivo principal para este año?',
    type: 'text',
    placeholder: 'Sé específico y medible...',
  },
  {
    id: 'currentRevenue',
    label: '¿Cuál es tu ingresos mensuales aproximados?',
    type: 'select',
    options: ['$0 - $1,000', '$1,001 - $5,000', '$5,001 - $10,000', '$10,001 - $50,000', '$50,000+'],
  },
  {
    id: 'marketingExperience',
    label: '¿Cuál es tu experiencia en marketing?',
    type: 'select',
    options: ['Nula', 'Básica', 'Intermedia', 'Avanzada'],
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const currentQuestion = GENOMA_QUESTIONS[step];

  const handleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = async () => {
    if (step < GENOMA_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Save GENOMA
      await saveGenoma();
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const saveGenoma = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/genoma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Mark GENOMA setup as done
        localStorage.setItem('genoma-setup-done', 'true');
        // Redirect to chat where AI will help with marketing
        router.push('/dashboard/chat');
      } else {
        alert('Error al guardar GENOMA');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step + 1) / GENOMA_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/50 backdrop-blur sticky top-0">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">Tu GENOMA Marketing</h1>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-400 mt-2">Paso {step + 1} de {GENOMA_QUESTIONS.length}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">{currentQuestion.label}</h2>

          {currentQuestion.type === 'text' && (
            <input
              type="text"
              value={formData[currentQuestion.id] || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="input mb-6"
              autoFocus
            />
          )}

          {currentQuestion.type === 'select' && (
            <select
              value={formData[currentQuestion.id] || ''}
              onChange={(e) => handleChange(e.target.value)}
              className="input mb-6"
            >
              <option value="">Selecciona una opción...</option>
              {currentQuestion.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={handlePrevious}
              disabled={step === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Atrás
            </button>

            <button
              onClick={handleNext}
              disabled={!formData[currentQuestion.id] || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : step === GENOMA_QUESTIONS.length - 1 ? 'Completar →' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
