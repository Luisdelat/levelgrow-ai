'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { useState, useEffect } from 'react';

interface Content {
  [key: string]: {
    nav: { login: string; register: string };
    hero: { title: string; subtitle: string; cta: string; demo: string };
    aboutTitle: string;
    aboutContent: string;
    objectiveTitle: string;
    objectiveContent: string;
    helpTitle: string;
    helpContent: string;
    featuresTitle: string;
    features: Array<{ icon: string; title: string; desc: string }>;
    pricingTitle: string;
    basicPlan: string;
    fullPlan: string;
    popularBadge: string;
    startNow: string;
    basicDescription: string;
    fullDescription: string;
    basicItems: string[];
    fullItems: string[];
    footer: string;
  };
}

const translations: Content = {
  es: {
    nav: { login: 'Ingresar', register: 'Registrarse' },
    hero: {
      title: 'Tu Asistente de Marketing IA',
      subtitle: 'Automatiza, crece y domina el marketing con inteligencia artificial avanzada',
      cta: 'Comenzar Gratis',
      demo: 'Ver Demo',
    },
    aboutTitle: 'Quiénes Somos',
    aboutContent:
      'LEVELGROW AI es la plataforma de automatización de marketing que revoluciona cómo las agencias y emprendedores generan resultados. Construida con tecnología de inteligencia artificial de punta, te ayudamos a escalar desde cero hasta seis y siete cifras.',
    objectiveTitle: 'Nuestro Objetivo',
    objectiveContent:
      'Eliminar la brecha entre lo que quieres lograr y lo que puedes lograr. No queremos que gastes 10 horas en estrategia para ejecutar 2. Con LEVELGROW AI, recibes planes de acción generados automáticamente, basados en inteligencia artificial comprobada en miles de negocios.',
    helpTitle: 'Cómo Te Ayudamos',
    helpContent:
      'Tu GENOMA Marketing analiza tu negocio en profundidad. Tu Asistente IA te da estrategia 24/7. Tus Acciones Automáticas se ejecutan sin que levantes un dedo. El resultado: Más clientes, menos estrés, más dinero. Eso no es promesa, es garantía.',
    featuresTitle: 'Potencia Tu Marketing',
    features: [
      {
        icon: '🧬',
        title: 'GENOMA Marketing',
        desc: 'Análisis completo de tu negocio, competencia y mercado. El sistema aprende de ti y mejora cada día.',
      },
      {
        icon: '💬',
        title: 'Asistente IA 24/7',
        desc: 'Te dice QUÉ POSTEAR, CUÁNDO postear, y CÓMO convertir. Estrategia personalizada siempre disponible.',
      },
      {
        icon: '⚡',
        title: 'Automatización Total',
        desc: 'Embudos de ventas, contenido generado, acciones automáticas. Todo sin que levantes un dedo.',
      },
    ],
    pricingTitle: 'Elige el Plan que Necesitas',
    basicPlan: 'Plan Básico',
    fullPlan: 'Plan Full',
    popularBadge: 'Mejor para Agencias',
    startNow: 'Comenzar Ahora',
    basicDescription: 'Para Emprendedores que Recién Empiezan',
    fullDescription: 'Para Agencias y Negocios en Crecimiento',
    basicItems: [
      'GENOMA Marketing Completo',
      '30 posts listos para publicar cada mes',
      '1 Embudo de Ventas generado',
      'Asistente IA 24/7',
      'Análisis semanal de resultados',
    ],
    fullItems: [
      'Todo del Plan Básico',
      '100+ posts generados al mes (multi-plataforma)',
      '4 Embudos de Ventas Completos',
      'Automatización Total (sin hacer nada)',
      'Chatbot de ventas inteligente',
      'Reportes de ROI y proyecciones',
      'Soporte prioritario + Consultoría mensual',
    ],
    footer: '© 2024 LEVELGROW AI. Todos los derechos reservados.',
  },
  en: {
    nav: { login: 'Login', register: 'Sign Up' },
    hero: {
      title: 'Your AI Marketing Assistant',
      subtitle: 'Automate, grow, and dominate marketing with advanced artificial intelligence',
      cta: 'Start Free',
      demo: 'See Demo',
    },
    aboutTitle: 'Who We Are',
    aboutContent:
      'LEVELGROW AI is the marketing automation platform that revolutionizes how agencies and entrepreneurs generate results. Built with cutting-edge artificial intelligence technology, we help you scale from zero to six and seven figures.',
    objectiveTitle: 'Our Mission',
    objectiveContent:
      "We eliminate the gap between what you want to achieve and what you can achieve. We don't want you spending 10 hours on strategy to execute 2. With LEVELGROW AI, you get action plans generated automatically, based on AI proven in thousands of businesses.",
    helpTitle: 'How We Help You',
    helpContent:
      'Your Marketing GENOMA analyzes your business in depth. Your AI Assistant tells you WHAT TO POST, WHEN to post, and HOW to convert. Your Automatic Actions execute without lifting a finger. The result: More clients, less stress, more money. That is not a promise, it is a guarantee.',
    featuresTitle: 'Power Your Marketing',
    features: [
      {
        icon: '🧬',
        title: 'Marketing GENOMA',
        desc: 'Complete analysis of your business, competition and market. The system learns from you and improves every day.',
      },
      {
        icon: '💬',
        title: 'AI Assistant 24/7',
        desc: 'Tells you WHAT TO POST, WHEN to post, and HOW to convert. Personalized strategy always available.',
      },
      {
        icon: '⚡',
        title: 'Total Automation',
        desc: 'Sales funnels, generated content, automatic actions. Everything without lifting a finger.',
      },
    ],
    pricingTitle: 'Choose the Plan You Need',
    basicPlan: 'Basic Plan',
    fullPlan: 'Full Plan',
    popularBadge: 'Best for Agencies',
    startNow: 'Start Now',
    basicDescription: 'For Entrepreneurs Just Starting',
    fullDescription: 'For Growing Agencies and Businesses',
    basicItems: [
      'Complete Marketing GENOMA',
      '30 ready-to-post content pieces monthly',
      '1 Sales Funnel generated',
      'AI Assistant 24/7',
      'Weekly results analysis',
    ],
    fullItems: [
      'Everything in Basic Plan',
      '100+ posts generated monthly (multi-platform)',
      '4 Complete Sales Funnels',
      'Total Automation (you do nothing)',
      'Intelligent sales chatbot',
      'ROI reports and projections',
      'Priority support + Monthly strategy consultation',
    ],
    footer: '© 2024 LEVELGROW AI. All rights reserved.',
  },
  pt: {
    nav: { login: 'Entrar', register: 'Inscrever-se' },
    hero: {
      title: 'Seu Assistente de Marketing com IA',
      subtitle: 'Automatize, cresça e domine o marketing com inteligência artificial avançada',
      cta: 'Começar Grátis',
      demo: 'Ver Demo',
    },
    aboutTitle: 'Quem Somos',
    aboutContent:
      'LEVELGROW AI é a plataforma de automação de marketing que revoluciona como agências e empreendedores geram resultados. Construída com tecnologia de inteligência artificial de ponta, ajudamos você a escalar de zero para seis e sete cifras.',
    objectiveTitle: 'Nosso Objetivo',
    objectiveContent:
      'Eliminar a lacuna entre o que você quer alcançar e o que pode alcançar. Não queremos que você gaste 10 horas em estratégia para executar 2. Com LEVELGROW AI, você recebe planos de ação gerados automaticamente, com base em IA comprovada em milhares de negócios.',
    helpTitle: 'Como Ajudamos Você',
    helpContent:
      'Seu GENOMA de Marketing analisa seu negócio em profundidade. Seu Assistente de IA lhe diz O QUE POSTAR, QUANDO postar e COMO converter. Suas Ações Automáticas executam sem você levantar um dedo. O resultado: Mais clientes, menos estresse, mais dinheiro. Isso não é promessa, é garantia.',
    featuresTitle: 'Potencialize Seu Marketing',
    features: [
      {
        icon: '🧬',
        title: 'GENOMA Marketing',
        desc: 'Análise completa de seu negócio, concorrência e mercado. O sistema aprende de você e melhora a cada dia.',
      },
      {
        icon: '💬',
        title: 'Assistente IA 24/7',
        desc: 'Diz O QUE POSTAR, QUANDO postar e COMO converter. Estratégia personalizada sempre disponível.',
      },
      {
        icon: '⚡',
        title: 'Automação Total',
        desc: 'Funis de vendas, conteúdo gerado, ações automáticas. Tudo sem você levantar um dedo.',
      },
    ],
    pricingTitle: 'Escolha o Plano que Precisa',
    basicPlan: 'Plano Básico',
    fullPlan: 'Plano Full',
    popularBadge: 'Melhor para Agências',
    startNow: 'Começar Agora',
    basicDescription: 'Para Empreendedores que Recém Começam',
    fullDescription: 'Para Agências e Negócios em Crescimento',
    basicItems: [
      'GENOMA Marketing Completo',
      '30 posts prontos para publicar por mês',
      '1 Funil de Vendas gerado',
      'Assistente IA 24/7',
      'Análise semanal de resultados',
    ],
    fullItems: [
      'Tudo do Plano Básico',
      '100+ posts gerados por mês (multi-plataforma)',
      '4 Funis de Vendas Completos',
      'Automação Total (você não faz nada)',
      'Chatbot de vendas inteligente',
      'Relatórios de ROI e projeções',
      'Suporte prioritário + Consulta estratégica mensal',
    ],
    footer: '© 2024 LEVELGROW AI. Todos os direitos reservados.',
  },
};

export default function Home() {
  const [language, setLanguage] = useState<'es' | 'en' | 'pt'>('es');
  const [email, setEmail] = useState('');
  const content = translations[language];

  useEffect(() => {
    const detectLanguage = () => {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'en') setLanguage('en');
      else if (browserLang === 'pt') setLanguage('pt');
      else setLanguage('es');
    };
    detectLanguage();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
      <style>{`
        @keyframes float-watermark {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.03; }
          50% { transform: translateY(-20px) rotate(2deg); opacity: 0.05; }
        }
        
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.5); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .watermark-logo {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          height: 400px;
          animation: float-watermark 6s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        
        .content-wrapper {
          position: relative;
          z-index: 10;
        }
        
        .glow-card {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        
        .fade-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
      `}</style>

      {/* Watermark Logo */}
      <div className="watermark-logo">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.5 }} />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="95" fill="none" stroke="url(#grad1)" strokeWidth="1" />
          <g transform="translate(100, 100)">
            <path d="M -45 30 Q -20 -20 20 -35 Q 45 -40 50 -20" fill="none" stroke="url(#grad1)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="-45" cy="30" r="6" fill="url(#grad1)" />
            <circle cx="-15" cy="-8" r="7" fill="url(#grad1)" />
            <circle cx="25" cy="-30" r="7.5" fill="url(#grad1)" />
            <circle cx="50" cy="-20" r="6" fill="url(#grad1)" />
          </g>
        </svg>
      </div>

      <div className="content-wrapper">
        {/* Navigation */}
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Logo size="md" showText={true} />
            <div className="flex gap-3 items-center">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'es' | 'en' | 'pt')}
                className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 text-sm"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
              <Link href="/auth/login" className="btn-secondary text-sm">
                {content.nav.login}
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm">
                {content.nav.register}
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 fade-up">
          <div className="text-center mb-16">
            <h1 className="text-6xl sm:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent fade-up stagger-1">
              {content.hero.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 fade-up stagger-2">
              {content.hero.subtitle}
            </p>
            <div className="flex gap-4 justify-center fade-up stagger-3">
              <Link href="/auth/register" className="btn-primary px-10 py-4 text-lg font-bold hover:scale-105 transition-transform">
                {content.hero.cta}
              </Link>
              <button className="btn-secondary px-10 py-4 text-lg font-bold hover:scale-105 transition-transform">
                {content.hero.demo}
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-12 fade-up">
            <h2 className="text-4xl font-bold mb-6 text-blue-400">{content.aboutTitle}</h2>
            <p className="text-lg text-gray-300 leading-relaxed">{content.aboutContent}</p>
          </div>
        </section>

        {/* Objective Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-12 fade-up">
            <h2 className="text-4xl font-bold mb-6 text-purple-400">{content.objectiveTitle}</h2>
            <p className="text-lg text-gray-300 leading-relaxed">{content.objectiveContent}</p>
          </div>
        </section>

        {/* Help Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-12 fade-up">
            <h2 className="text-4xl font-bold mb-6 text-cyan-400">{content.helpTitle}</h2>
            <p className="text-lg text-gray-300 leading-relaxed">{content.helpContent}</p>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">{content.featuresTitle}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {content.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 fade-up glow-card"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">{content.pricingTitle}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-10 hover:border-blue-500/50 transition-all fade-up stagger-1">
              <h3 className="text-3xl font-bold mb-2">{content.basicPlan}</h3>
              <p className="text-gray-400 mb-6 text-sm">{content.basicDescription}</p>
              <div className="text-5xl font-black text-blue-400 mb-6">
                $49<span className="text-xl text-gray-400">/mes</span>
              </div>
              <ul className="space-y-3 mb-10 text-gray-300">
                {content.basicItems.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/register?plan=basic" className="btn-primary w-full text-center py-3 font-bold">
                {content.startNow}
              </Link>
            </div>

            {/* Full - Featured */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500 rounded-2xl p-10 relative hover:border-purple-500 transition-all fade-up stagger-2 glow-card">
              <div className="absolute -top-5 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm">
                {content.popularBadge}
              </div>
              <h3 className="text-3xl font-bold mb-2">{content.fullPlan}</h3>
              <p className="text-gray-300 mb-6 text-sm">{content.fullDescription}</p>
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-6">
                $99<span className="text-xl text-gray-400">/mes</span>
              </div>
              <ul className="space-y-3 mb-10 text-gray-300">
                {content.fullItems.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/register?plan=full" className="btn-primary w-full text-center py-3 font-bold bg-gradient-to-r from-blue-600 to-purple-600">
                {content.startNow}
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl font-bold mb-6">¿Listo para dominar tu mercado? 🚀</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a miles de emprendedores y agencias que generan más clientes en menos tiempo con LEVELGROW AI
          </p>
          <Link href="/auth/register" className="btn-primary px-12 py-4 text-xl font-bold hover:scale-105 transition-transform">
            Comienza Ahora - Es Gratis
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950/50 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>{content.footer}</p>
        </div>
      </footer>
    </div>
  );
}
