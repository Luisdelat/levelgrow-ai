import type { Language } from './translations';

/**
 * The guided growth route, based on the HAZTUAGENCIA (HTA) method:
 * GENOMA (ideal client -> promise -> offer -> sales script), then traffic
 * (organic + paid), a capture funnel, sales, and a 30-day execution plan.
 */
export const STAGE_IDS = [
  'genoma',
  'cliente',
  'oferta',
  'contenido',
  'captacion',
  'anuncios',
  'ventas',
  'plan',
] as const;

export type StageId = (typeof STAGE_IDS)[number];

/** Free-form advisor chat, outside the route. */
export const FREE_CHAT_ID = 'libre';

export function isStageId(value: string): value is StageId {
  return (STAGE_IDS as readonly string[]).includes(value);
}

export function stageIndex(id: StageId): number {
  return STAGE_IDS.indexOf(id);
}

export function nextStage(id: StageId): StageId | null {
  const i = stageIndex(id);
  return i >= 0 && i < STAGE_IDS.length - 1 ? STAGE_IDS[i + 1] : null;
}

export function stageHref(id: StageId): string {
  return id === 'genoma' ? '/dashboard/genoma' : `/dashboard/ruta/${id}`;
}

export interface StageText {
  title: string;
  goal: string;
  deliverables: [string, string, string];
  /** What the Basic plan gets when it differs from the Full plan. */
  basicDeliverables?: [string, string, string];
}

export const STAGE_TEXT: Record<Language, Record<StageId, StageText>> = {
  es: {
    genoma: {
      title: 'Tu GENOMA',
      goal: 'Los datos base de tu negocio: qué vendes, a quién y qué quieres lograr.',
      deliverables: ['Perfil de tu negocio', 'Meta de 90 días', 'Punto de partida'],
    },
    cliente: {
      title: 'Cliente ideal',
      goal: 'Define con precisión a quién le vendes y qué le duele.',
      deliverables: ['Frase de cliente ideal', 'Sus dolores y deseos', 'Dónde encontrarlo'],
    },
    oferta: {
      title: 'Promesa y oferta',
      goal: 'Convierte lo que vendes en una oferta clara que da ganas de comprar.',
      deliverables: ['Promesa en una frase', 'Oferta con entregables y precio', 'Garantía y bonos'],
    },
    contenido: {
      title: 'Contenido que atrae',
      goal: 'Prepara tu perfil y tus primeros videos para atraer clientes.',
      deliverables: ['Perfil optimizado', '10 ideas de contenido', '10 guiones listos para grabar'],
      basicDeliverables: ['Perfil optimizado', '10 ideas de contenido', '3 guiones listos para grabar'],
    },
    captacion: {
      title: 'Captación de clientes',
      goal: 'Arma el camino para que un desconocido te escriba y deje sus datos.',
      deliverables: ['Embudo por WhatsApp o DM', 'Mensajes y palabra clave', 'Rutina diaria de prospección'],
    },
    anuncios: {
      title: 'Anuncios',
      goal: 'Lanza tu primera campaña con poco presupuesto y sin quemar dinero.',
      deliverables: ['Tipo de campaña y presupuesto', '3 anuncios redactados', 'Reglas para optimizar'],
    },
    ventas: {
      title: 'Ventas y cierre',
      goal: 'Convierte conversaciones en ventas con un guion probado.',
      deliverables: ['Guion de llamada o chat', 'Respuestas a objeciones', 'Plan de seguimiento'],
    },
    plan: {
      title: 'Plan de 30 días',
      goal: 'Une todo en un plan semanal con metas y números que medir.',
      deliverables: ['Calendario de 4 semanas', 'Metas y métricas', 'No negociables diarios'],
    },
  },
  en: {
    genoma: {
      title: 'Your GENOME',
      goal: 'The core facts of your business: what you sell, to whom, and what you want to achieve.',
      deliverables: ['Business profile', '90-day goal', 'Starting point'],
    },
    cliente: {
      title: 'Ideal client',
      goal: 'Define exactly who you sell to and what keeps them up at night.',
      deliverables: ['Ideal client statement', 'Their pains and desires', 'Where to find them'],
    },
    oferta: {
      title: 'Promise and offer',
      goal: 'Turn what you sell into a clear offer people want to buy.',
      deliverables: ['One-line promise', 'Offer with deliverables and price', 'Guarantee and bonuses'],
    },
    contenido: {
      title: 'Content that attracts',
      goal: 'Get your profile and first videos ready to attract clients.',
      deliverables: ['Optimized profile', '10 content ideas', '10 ready-to-film scripts'],
      basicDeliverables: ['Optimized profile', '10 content ideas', '3 ready-to-film scripts'],
    },
    captacion: {
      title: 'Client acquisition',
      goal: 'Build the path that turns a stranger into a lead who messages you.',
      deliverables: ['WhatsApp or DM funnel', 'Messages and keyword', 'Daily outreach routine'],
    },
    anuncios: {
      title: 'Ads',
      goal: 'Launch your first campaign on a small budget without burning money.',
      deliverables: ['Campaign type and budget', '3 written ads', 'Optimization rules'],
    },
    ventas: {
      title: 'Sales and closing',
      goal: 'Turn conversations into sales with a proven script.',
      deliverables: ['Call or chat script', 'Objection answers', 'Follow-up plan'],
    },
    plan: {
      title: '30-day plan',
      goal: 'Bring it all together in a weekly plan with goals and numbers to track.',
      deliverables: ['4-week calendar', 'Goals and metrics', 'Daily non-negotiables'],
    },
  },
  ru: {
    genoma: {
      title: 'Ваш ГЕНОМ',
      goal: 'Основа вашего бизнеса: что вы продаёте, кому и чего хотите добиться.',
      deliverables: ['Профиль бизнеса', 'Цель на 90 дней', 'Точка старта'],
    },
    cliente: {
      title: 'Идеальный клиент',
      goal: 'Точно определите, кому вы продаёте и что его беспокоит.',
      deliverables: ['Описание идеального клиента', 'Его боли и желания', 'Где его найти'],
    },
    oferta: {
      title: 'Обещание и оффер',
      goal: 'Превратите ваш продукт в понятное предложение, которое хочется купить.',
      deliverables: ['Обещание в одной фразе', 'Оффер с составом и ценой', 'Гарантия и бонусы'],
    },
    contenido: {
      title: 'Привлекающий контент',
      goal: 'Подготовьте профиль и первые видео, чтобы привлекать клиентов.',
      deliverables: ['Оптимизированный профиль', '10 идей контента', '10 готовых сценариев'],
      basicDeliverables: ['Оптимизированный профиль', '10 идей контента', '3 готовых сценария'],
    },
    captacion: {
      title: 'Привлечение клиентов',
      goal: 'Постройте путь, по которому незнакомец напишет вам и оставит контакты.',
      deliverables: ['Воронка в WhatsApp или Direct', 'Сообщения и ключевое слово', 'Ежедневная рутина поиска'],
    },
    anuncios: {
      title: 'Реклама',
      goal: 'Запустите первую кампанию с небольшим бюджетом, не сжигая деньги.',
      deliverables: ['Тип кампании и бюджет', '3 готовых объявления', 'Правила оптимизации'],
    },
    ventas: {
      title: 'Продажи и закрытие',
      goal: 'Превращайте переписки в продажи по проверенному сценарию.',
      deliverables: ['Сценарий звонка или чата', 'Ответы на возражения', 'План повторных касаний'],
    },
    plan: {
      title: 'План на 30 дней',
      goal: 'Соберите всё в недельный план с целями и цифрами для контроля.',
      deliverables: ['Календарь на 4 недели', 'Цели и метрики', 'Ежедневные обязательные действия'],
    },
  },
  tr: {
    genoma: {
      title: 'GENOM\'unuz',
      goal: 'İşletmenizin temeli: ne sattığınız, kime sattığınız ve neyi başarmak istediğiniz.',
      deliverables: ['İşletme profili', '90 günlük hedef', 'Başlangıç noktası'],
    },
    cliente: {
      title: 'İdeal müşteri',
      goal: 'Kime sattığınızı ve onu neyin rahatsız ettiğini net olarak tanımlayın.',
      deliverables: ['İdeal müşteri tanımı', 'Acıları ve istekleri', 'Onu nerede bulacağınız'],
    },
    oferta: {
      title: 'Vaat ve teklif',
      goal: 'Sattığınız şeyi, insanların satın almak isteyeceği net bir teklife dönüştürün.',
      deliverables: ['Tek cümlelik vaat', 'İçerik ve fiyatıyla teklif', 'Garanti ve bonuslar'],
    },
    contenido: {
      title: 'Çeken içerik',
      goal: 'Profilinizi ve ilk videolarınızı müşteri çekecek şekilde hazırlayın.',
      deliverables: ['Optimize edilmiş profil', '10 içerik fikri', 'Çekime hazır 10 senaryo'],
      basicDeliverables: ['Optimize edilmiş profil', '10 içerik fikri', 'Çekime hazır 3 senaryo'],
    },
    captacion: {
      title: 'Müşteri kazanımı',
      goal: 'Bir yabancının size yazıp bilgilerini bırakacağı yolu kurun.',
      deliverables: ['WhatsApp veya DM hunisi', 'Mesajlar ve anahtar kelime', 'Günlük müşteri arama rutini'],
    },
    anuncios: {
      title: 'Reklamlar',
      goal: 'İlk kampanyanızı düşük bütçeyle, para yakmadan başlatın.',
      deliverables: ['Kampanya türü ve bütçe', '3 hazır reklam metni', 'Optimizasyon kuralları'],
    },
    ventas: {
      title: 'Satış ve kapanış',
      goal: 'Konuşmaları kanıtlanmış bir senaryoyla satışa dönüştürün.',
      deliverables: ['Arama veya sohbet senaryosu', 'İtirazlara cevaplar', 'Takip planı'],
    },
    plan: {
      title: '30 günlük plan',
      goal: 'Hepsini hedefler ve takip edilecek rakamlarla haftalık bir plana dökün.',
      deliverables: ['4 haftalık takvim', 'Hedefler ve metrikler', 'Günlük vazgeçilmezler'],
    },
  },
  az: {
    genoma: {
      title: 'GENOM-unuz',
      goal: 'Biznesinizin əsası: nə satırsınız, kimə satırsınız və nəyə nail olmaq istəyirsiniz.',
      deliverables: ['Biznes profili', '90 günlük hədəf', 'Başlanğıc nöqtəsi'],
    },
    cliente: {
      title: 'İdeal müştəri',
      goal: 'Kimə satdığınızı və onu nəyin narahat etdiyini dəqiq müəyyən edin.',
      deliverables: ['İdeal müştəri təsviri', 'Onun problemləri və istəkləri', 'Onu harada tapmaq olar'],
    },
    oferta: {
      title: 'Vəd və təklif',
      goal: 'Satdığınızı insanların almaq istədiyi aydın bir təklifə çevirin.',
      deliverables: ['Bir cümləlik vəd', 'Tərkibi və qiyməti ilə təklif', 'Zəmanət və bonuslar'],
    },
    contenido: {
      title: 'Cəlb edən kontent',
      goal: 'Profilinizi və ilk videolarınızı müştəri cəlb etmək üçün hazırlayın.',
      deliverables: ['Optimallaşdırılmış profil', '10 kontent ideyası', 'Çəkilişə hazır 10 ssenari'],
      basicDeliverables: ['Optimallaşdırılmış profil', '10 kontent ideyası', 'Çəkilişə hazır 3 ssenari'],
    },
    captacion: {
      title: 'Müştəri cəlbi',
      goal: 'Tanımadığı birinin sizə yazıb məlumatlarını qoyacağı yolu qurun.',
      deliverables: ['WhatsApp və ya DM hunisi', 'Mesajlar və açar söz', 'Gündəlik müştəri axtarışı rutini'],
    },
    anuncios: {
      title: 'Reklamlar',
      goal: 'İlk kampaniyanızı kiçik büdcə ilə, pul yandırmadan başladın.',
      deliverables: ['Kampaniya növü və büdcə', '3 hazır reklam mətni', 'Optimallaşdırma qaydaları'],
    },
    ventas: {
      title: 'Satış və bağlanış',
      goal: 'Söhbətləri sübut olunmuş ssenari ilə satışa çevirin.',
      deliverables: ['Zəng və ya çat ssenarisi', 'Etirazlara cavablar', 'İzləmə planı'],
    },
    plan: {
      title: '30 günlük plan',
      goal: 'Hamısını hədəflər və izləniləcək rəqəmlərlə həftəlik plana birləşdirin.',
      deliverables: ['4 həftəlik təqvim', 'Hədəflər və metriklər', 'Gündəlik vacib addımlar'],
    },
  },
};

export const LANGUAGE_NAMES: Record<Language, string> = {
  es: 'español',
  en: 'English',
  ru: 'русский',
  tr: 'Türkçe',
  az: 'Azərbaycan dili',
};
