import type { Language } from './translations';

export interface LandingText {
  login: string;
  register: string;
  eyebrow: string;
  heroTitle: string;
  heroSub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  previewLabel: string;
  previewNext: string;
  howTitle: string;
  howSub: string;
  steps: { title: string; text: string }[];
  routeTitle: string;
  routeSub: string;
  benefitsTitle: string;
  benefits: { title: string; text: string }[];
  pricingTitle: string;
  pricingSub: string;
  perMonth: string;
  basicName: string;
  basicFor: string;
  fullName: string;
  fullFor: string;
  recommended: string;
  basicItems: string[];
  fullItems: string[];
  choose: string;
  pricingNote: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
  finalTitle: string;
  finalSub: string;
  footer: string;
}

const es: LandingText = {
  login: 'Ingresar',
  register: 'Crear cuenta',
  eyebrow: 'Asesor de marketing con IA para dueños de negocio',
  heroTitle: 'Consigue clientes con un plan claro, no a ciegas',
  heroSub:
    'Un asesor con inteligencia artificial te lleva paso a paso: desde definir a tu cliente ideal hasta tu guion de ventas y tu plan de 30 días. Todo adaptado a tu negocio.',
  ctaPrimary: 'Crear mi cuenta',
  ctaSecondary: 'Ver cómo funciona',
  previewLabel: 'Tu ruta',
  previewNext: 'Siguiente paso',
  howTitle: 'Cómo funciona',
  howSub: 'Tres pasos. Tú pones el conocimiento de tu negocio; el asesor pone el método.',
  steps: [
    { title: 'Cuéntale de tu negocio', text: 'Llenas tu ADN en unos 5 minutos: qué vendes, a quién, dónde y qué quieres lograr.' },
    { title: 'Avanza con tu asesor', text: 'En cada etapa el asesor te propone borradores, te hace preguntas y los ajusta contigo.' },
    { title: 'Ejecuta tu plan', text: 'Cada etapa deja un entregable listo para usar, guardado en tu plan de marketing.' },
  ],
  routeTitle: 'Tu ruta de 8 etapas',
  routeSub: 'El orden importa: primero claridad, después atención, después ventas.',
  benefitsTitle: 'Qué obtienes',
  benefits: [
    { title: 'Un asesor que conoce tu negocio', text: 'Responde con base en tu ADN y en lo que ya construiste, no con consejos genéricos.' },
    { title: 'Entregables listos para usar', text: 'Frases, ofertas, guiones de video, mensajes de WhatsApp, anuncios y guion de ventas.' },
    { title: 'Todo en un solo lugar', text: 'Tu plan de marketing reúne lo que creaste en cada etapa para copiarlo y ejecutarlo.' },
    { title: 'En tu idioma', text: 'Español, English, Русский, Türkçe y Azərbaycanca.' },
  ],
  pricingTitle: 'Planes',
  pricingSub: 'Los dos incluyen la ruta completa con tu asesor.',
  perMonth: '/mes',
  basicName: 'Básico',
  basicFor: 'Para empezar a hacer marketing con orden.',
  fullName: 'Full',
  fullFor: 'Para mantener el ritmo cada semana.',
  recommended: 'Recomendado',
  basicItems: [
    'ADN de marketing de tu negocio',
    'Ruta guiada de 8 etapas con tu asesor IA',
    'Todos tus entregables en «Mi plan»',
    '3 guiones de video listos para grabar',
    '200 mensajes al mes con tu asesor',
  ],
  fullItems: [
    'Todo lo del plan Básico',
    'Los 10 guiones de video completos, listos para grabar',
    '1,000 mensajes al mes con tu asesor',
    'Calendario de 30 publicaciones cada mes',
    'Revisión semanal de tus números con tu asesor',
  ],
  choose: 'Elegir este plan',
  pricingNote: 'Los mensajes se renuevan el día 1 de cada mes.',
  faqTitle: 'Preguntas frecuentes',
  faq: [
    { q: '¿Necesito saber de marketing?', a: 'No. El asesor te explica cada paso con lenguaje simple y te da borradores para que no empieces desde cero.' },
    { q: '¿La plataforma publica o hace el trabajo por mí?', a: 'No. Te da el plan y los materiales listos; tú publicas, respondes y vendes. Así mantienes el control de tu negocio.' },
    { q: '¿Garantizan ventas?', a: 'No. Nadie puede garantizarlas con honestidad. Te damos un método y herramientas; los resultados dependen de tu ejecución y de tu mercado.' },
  ],
  finalTitle: 'Empieza hoy con tu primer paso',
  finalSub: 'Crea tu cuenta, llena tu ADN y tu asesor te dice qué hacer después.',
  footer: 'Todos los derechos reservados.',
};

const en: LandingText = {
  login: 'Sign in',
  register: 'Create account',
  eyebrow: 'AI marketing advisor for business owners',
  heroTitle: 'Get clients with a clear plan, not guesswork',
  heroSub:
    'An AI advisor walks you through it step by step: from defining your ideal client to your sales script and your 30-day plan. All tailored to your business.',
  ctaPrimary: 'Create my account',
  ctaSecondary: 'See how it works',
  previewLabel: 'Your route',
  previewNext: 'Next step',
  howTitle: 'How it works',
  howSub: 'Three steps. You bring the knowledge of your business; the advisor brings the method.',
  steps: [
    { title: 'Tell it about your business', text: 'Fill in your DNA in about 5 minutes: what you sell, to whom, where, and what you want to achieve.' },
    { title: 'Move forward with your advisor', text: 'At each stage the advisor proposes drafts, asks you questions and refines them with you.' },
    { title: 'Execute your plan', text: 'Each stage leaves a ready-to-use deliverable, saved in your marketing plan.' },
  ],
  routeTitle: 'Your 8-stage route',
  routeSub: 'Order matters: clarity first, then attention, then sales.',
  benefitsTitle: 'What you get',
  benefits: [
    { title: 'An advisor that knows your business', text: 'It answers based on your DNA and what you already built, not with generic advice.' },
    { title: 'Ready-to-use deliverables', text: 'Statements, offers, video scripts, WhatsApp messages, ads and a sales script.' },
    { title: 'Everything in one place', text: 'Your marketing plan collects what you created in each stage so you can copy it and execute.' },
    { title: 'In your language', text: 'Español, English, Русский, Türkçe and Azərbaycanca.' },
  ],
  pricingTitle: 'Plans',
  pricingSub: 'Both include the full route with your advisor.',
  perMonth: '/month',
  basicName: 'Basic',
  basicFor: 'To start doing marketing in an organized way.',
  fullName: 'Full',
  fullFor: 'To keep the pace every week.',
  recommended: 'Recommended',
  basicItems: [
    'Marketing DNA for your business',
    '8-stage guided route with your AI advisor',
    'All your deliverables in “My plan”',
    '3 ready-to-film video scripts',
    '200 messages a month with your advisor',
  ],
  fullItems: [
    'Everything in Basic',
    'All 10 full video scripts, ready to film',
    '1,000 messages a month with your advisor',
    '30-post content calendar every month',
    'Weekly review of your numbers with your advisor',
  ],
  choose: 'Choose this plan',
  pricingNote: 'Messages reset on the 1st of every month.',
  faqTitle: 'Frequently asked questions',
  faq: [
    { q: 'Do I need to know marketing?', a: 'No. The advisor explains each step in plain language and gives you drafts so you never start from scratch.' },
    { q: 'Does the platform post or do the work for me?', a: 'No. It gives you the plan and ready materials; you post, reply and sell. That way you stay in control of your business.' },
    { q: 'Do you guarantee sales?', a: 'No. Nobody can honestly guarantee them. We give you a method and tools; results depend on your execution and your market.' },
  ],
  finalTitle: 'Start today with your first step',
  finalSub: 'Create your account, fill in your DNA and your advisor tells you what to do next.',
  footer: 'All rights reserved.',
};

const ru: LandingText = {
  login: 'Войти',
  register: 'Создать аккаунт',
  eyebrow: 'ИИ-консультант по маркетингу для владельцев бизнеса',
  heroTitle: 'Привлекайте клиентов по понятному плану, а не наугад',
  heroSub:
    'ИИ-консультант ведёт вас шаг за шагом: от описания идеального клиента до сценария продаж и плана на 30 дней. Всё — под ваш бизнес.',
  ctaPrimary: 'Создать аккаунт',
  ctaSecondary: 'Как это работает',
  previewLabel: 'Ваш маршрут',
  previewNext: 'Следующий шаг',
  howTitle: 'Как это работает',
  howSub: 'Три шага. Вы знаете свой бизнес, консультант даёт метод.',
  steps: [
    { title: 'Расскажите о бизнесе', text: 'Заполните ДНК примерно за 5 минут: что вы продаёте, кому, где и чего хотите добиться.' },
    { title: 'Двигайтесь с консультантом', text: 'На каждом этапе консультант предлагает черновики, задаёт вопросы и дорабатывает их вместе с вами.' },
    { title: 'Выполняйте план', text: 'Каждый этап даёт готовый результат, который сохраняется в вашем маркетинговом плане.' },
  ],
  routeTitle: 'Маршрут из 8 этапов',
  routeSub: 'Порядок важен: сначала ясность, затем внимание, затем продажи.',
  benefitsTitle: 'Что вы получаете',
  benefits: [
    { title: 'Консультант, который знает ваш бизнес', text: 'Отвечает на основе вашей ДНК и уже созданного, а не общими советами.' },
    { title: 'Готовые материалы', text: 'Формулировки, офферы, сценарии видео, сообщения в WhatsApp, объявления и сценарий продаж.' },
    { title: 'Всё в одном месте', text: 'Маркетинговый план собирает результаты каждого этапа, чтобы вы могли их скопировать и выполнить.' },
    { title: 'На вашем языке', text: 'Español, English, Русский, Türkçe и Azərbaycanca.' },
  ],
  pricingTitle: 'Тарифы',
  pricingSub: 'Оба включают полный маршрут с консультантом.',
  perMonth: '/мес',
  basicName: 'Базовый',
  basicFor: 'Чтобы начать заниматься маркетингом системно.',
  fullName: 'Полный',
  fullFor: 'Чтобы держать темп каждую неделю.',
  recommended: 'Рекомендуем',
  basicItems: [
    'Маркетинговая ДНК вашего бизнеса',
    'Маршрут из 8 этапов с ИИ-консультантом',
    'Все результаты в разделе «Мой план»',
    '3 готовых к съёмке сценария видео',
    '200 сообщений консультанту в месяц',
  ],
  fullItems: [
    'Всё из Базового тарифа',
    'Все 10 полных сценариев видео, готовых к съёмке',
    '1000 сообщений консультанту в месяц',
    'Контент-календарь на 30 публикаций каждый месяц',
    'Еженедельный разбор ваших цифр с консультантом',
  ],
  choose: 'Выбрать тариф',
  pricingNote: 'Лимит сообщений обновляется 1-го числа каждого месяца.',
  faqTitle: 'Частые вопросы',
  faq: [
    { q: 'Нужно ли разбираться в маркетинге?', a: 'Нет. Консультант объясняет каждый шаг простым языком и даёт черновики, чтобы вы не начинали с нуля.' },
    { q: 'Платформа публикует или делает работу за меня?', a: 'Нет. Она даёт план и готовые материалы; публикуете, отвечаете и продаёте вы. Так бизнес остаётся под вашим контролем.' },
    { q: 'Вы гарантируете продажи?', a: 'Нет. Честно гарантировать их не может никто. Мы даём метод и инструменты; результат зависит от вашей работы и рынка.' },
  ],
  finalTitle: 'Сделайте первый шаг сегодня',
  finalSub: 'Создайте аккаунт, заполните ДНК, и консультант подскажет, что делать дальше.',
  footer: 'Все права защищены.',
};

const tr: LandingText = {
  login: 'Giriş yap',
  register: 'Hesap oluştur',
  eyebrow: 'İşletme sahipleri için yapay zekâ pazarlama danışmanı',
  heroTitle: 'Müşterileri tahminle değil, net bir planla kazanın',
  heroSub:
    'Yapay zekâ danışmanı sizi adım adım yönlendirir: ideal müşterinizi tanımlamaktan satış senaryonuza ve 30 günlük planınıza kadar. Hepsi işletmenize göre.',
  ctaPrimary: 'Hesabımı oluştur',
  ctaSecondary: 'Nasıl çalıştığını gör',
  previewLabel: 'Rotanız',
  previewNext: 'Sıradaki adım',
  howTitle: 'Nasıl çalışır',
  howSub: 'Üç adım. İşletmenizin bilgisini siz, yöntemi danışman getirir.',
  steps: [
    { title: 'İşletmenizi anlatın', text: 'DNA\'nızı yaklaşık 5 dakikada doldurun: ne satıyorsunuz, kime, nerede ve neyi başarmak istiyorsunuz.' },
    { title: 'Danışmanınızla ilerleyin', text: 'Her aşamada danışman taslaklar önerir, sorular sorar ve bunları sizinle birlikte geliştirir.' },
    { title: 'Planınızı uygulayın', text: 'Her aşama, pazarlama planınıza kaydedilen kullanıma hazır bir çıktı bırakır.' },
  ],
  routeTitle: '8 aşamalı rotanız',
  routeSub: 'Sıra önemlidir: önce netlik, sonra dikkat, sonra satış.',
  benefitsTitle: 'Neler elde edersiniz',
  benefits: [
    { title: 'İşletmenizi tanıyan bir danışman', text: 'Genel tavsiyelerle değil, DNA\'nıza ve oluşturduklarınıza göre cevap verir.' },
    { title: 'Kullanıma hazır çıktılar', text: 'Cümleler, teklifler, video senaryoları, WhatsApp mesajları, reklamlar ve satış senaryosu.' },
    { title: 'Her şey tek yerde', text: 'Pazarlama planınız her aşamada oluşturduklarınızı toplar; kopyalayıp uygulayın.' },
    { title: 'Kendi dilinizde', text: 'Español, English, Русский, Türkçe ve Azərbaycanca.' },
  ],
  pricingTitle: 'Planlar',
  pricingSub: 'İkisi de danışmanınızla tam rotayı içerir.',
  perMonth: '/ay',
  basicName: 'Temel',
  basicFor: 'Pazarlamaya düzenli bir şekilde başlamak için.',
  fullName: 'Tam',
  fullFor: 'Her hafta ritmi korumak için.',
  recommended: 'Önerilen',
  basicItems: [
    'İşletmenizin pazarlama DNA\'sı',
    'Yapay zekâ danışmanıyla 8 aşamalı rehberli rota',
    'Tüm çıktılarınız «Planım» bölümünde',
    'Çekime hazır 3 video senaryosu',
    'Danışmanınızla ayda 200 mesaj',
  ],
  fullItems: [
    'Temel plandaki her şey',
    'Çekime hazır 10 tam video senaryosu',
    'Danışmanınızla ayda 1.000 mesaj',
    'Her ay 30 paylaşımlık içerik takvimi',
    'Rakamlarınızın danışmanınızla haftalık değerlendirmesi',
  ],
  choose: 'Bu planı seç',
  pricingNote: 'Mesaj hakları her ayın 1\'inde yenilenir.',
  faqTitle: 'Sık sorulan sorular',
  faq: [
    { q: 'Pazarlama bilmem gerekiyor mu?', a: 'Hayır. Danışman her adımı sade bir dille açıklar ve sıfırdan başlamamanız için taslaklar verir.' },
    { q: 'Platform benim yerime paylaşım yapıyor veya işi yapıyor mu?', a: 'Hayır. Size planı ve hazır materyalleri verir; paylaşan, cevaplayan ve satan sizsiniz. Böylece işletmenizin kontrolü sizde kalır.' },
    { q: 'Satış garantisi veriyor musunuz?', a: 'Hayır. Kimse dürüstçe garanti veremez. Size bir yöntem ve araçlar veriyoruz; sonuçlar uygulamanıza ve pazarınıza bağlıdır.' },
  ],
  finalTitle: 'İlk adımınızı bugün atın',
  finalSub: 'Hesabınızı oluşturun, DNA\'nızı doldurun; danışmanınız sonra ne yapacağınızı söylesin.',
  footer: 'Tüm hakları saklıdır.',
};

const az: LandingText = {
  login: 'Daxil ol',
  register: 'Hesab yarat',
  eyebrow: 'Biznes sahibləri üçün süni intellekt marketinq məsləhətçisi',
  heroTitle: 'Müştəriləri təxminlə deyil, aydın planla qazanın',
  heroSub:
    'Süni intellekt məsləhətçisi sizi addım-addım aparır: ideal müştərinizi müəyyən etməkdən satış ssenarinizə və 30 günlük planınıza qədər. Hamısı biznesinizə uyğun.',
  ctaPrimary: 'Hesabımı yarat',
  ctaSecondary: 'Necə işlədiyini gör',
  previewLabel: 'Marşrutunuz',
  previewNext: 'Növbəti addım',
  howTitle: 'Necə işləyir',
  howSub: 'Üç addım. Biznesinizi siz tanıyırsınız, metodu məsləhətçi verir.',
  steps: [
    { title: 'Biznesinizdən danışın', text: 'DNA-nızı təxminən 5 dəqiqəyə doldurun: nə satırsınız, kimə, harada və nəyə nail olmaq istəyirsiniz.' },
    { title: 'Məsləhətçinizlə irəliləyin', text: 'Hər mərhələdə məsləhətçi qaralamalar təklif edir, suallar verir və onları sizinlə birlikdə təkmilləşdirir.' },
    { title: 'Planınızı icra edin', text: 'Hər mərhələ marketinq planınızda saxlanılan, istifadəyə hazır nəticə verir.' },
  ],
  routeTitle: '8 mərhələli marşrutunuz',
  routeSub: 'Ardıcıllıq vacibdir: əvvəlcə aydınlıq, sonra diqqət, sonra satış.',
  benefitsTitle: 'Nə əldə edirsiniz',
  benefits: [
    { title: 'Biznesinizi tanıyan məsləhətçi', text: 'Ümumi məsləhətlərlə deyil, DNA-nız və qurduqlarınız əsasında cavab verir.' },
    { title: 'İstifadəyə hazır nəticələr', text: 'İfadələr, təkliflər, video ssenariləri, WhatsApp mesajları, reklamlar və satış ssenarisi.' },
    { title: 'Hər şey bir yerdə', text: 'Marketinq planınız hər mərhələdə yaratdıqlarınızı toplayır; kopyalayıb icra edin.' },
    { title: 'Öz dilinizdə', text: 'Español, English, Русский, Türkçe və Azərbaycanca.' },
  ],
  pricingTitle: 'Paketlər',
  pricingSub: 'Hər ikisinə məsləhətçinizlə tam marşrut daxildir.',
  perMonth: '/ay',
  basicName: 'Əsas',
  basicFor: 'Marketinqə qaydasında başlamaq üçün.',
  fullName: 'Tam',
  fullFor: 'Hər həftə tempi saxlamaq üçün.',
  recommended: 'Tövsiyə olunur',
  basicItems: [
    'Biznesinizin marketinq DNA-sı',
    'Süni intellekt məsləhətçisi ilə 8 mərhələli marşrut',
    'Bütün nəticələriniz «Planım» bölməsində',
    'Çəkilişə hazır 3 video ssenarisi',
    'Məsləhətçinizlə ayda 200 mesaj',
  ],
  fullItems: [
    'Əsas paketdəki hər şey',
    'Çəkilişə hazır 10 tam video ssenarisi',
    'Məsləhətçinizlə ayda 1000 mesaj',
    'Hər ay 30 paylaşımlıq kontent təqvimi',
    'Rəqəmlərinizin məsləhətçinizlə həftəlik təhlili',
  ],
  choose: 'Bu paketi seç',
  pricingNote: 'Mesaj limiti hər ayın 1-də yenilənir.',
  faqTitle: 'Tez-tez verilən suallar',
  faq: [
    { q: 'Marketinq bilməliyəm?', a: 'Xeyr. Məsləhətçi hər addımı sadə dillə izah edir və sıfırdan başlamamağınız üçün qaralamalar verir.' },
    { q: 'Platforma mənim yerimə paylaşım edir və ya işi görür?', a: 'Xeyr. Sizə plan və hazır materiallar verir; paylaşan, cavab verən və satan sizsiniz. Beləliklə biznesinizə nəzarət sizdə qalır.' },
    { q: 'Satışa zəmanət verirsiniz?', a: 'Xeyr. Heç kim dürüst şəkildə zəmanət verə bilməz. Biz metod və alətlər veririk; nəticə icranızdan və bazarınızdan asılıdır.' },
  ],
  finalTitle: 'İlk addımınızı bu gün atın',
  finalSub: 'Hesabınızı yaradın, DNA-nızı doldurun və məsləhətçiniz növbəti addımı desin.',
  footer: 'Bütün hüquqlar qorunur.',
};

export const LANDING_TEXT: Record<Language, LandingText> = { es, en, ru, tr, az };
