// Legal documents shown at /legal/<doc>. Spanish and English are full texts;
// the other interface languages show the English text with a short notice.
// When any document changes in substance, bump LEGAL_VERSION: new sign-ups and
// checkouts record the version they accepted.
import type { Language } from './translations';

export const LEGAL_VERSION = '2026-10-26';
export const LEGAL_UPDATED = { es: '26 de octubre de 2026', en: 'October 26, 2026' };
export const LEGAL_OPERATOR = 'LEVELGROW LLC';
export const LEGAL_LOCATION = 'Miami, Florida, USA';
export const LEGAL_EMAIL = 'soporte@levelgrowai.com';

export type LegalDocId = 'terminos' | 'privacidad' | 'reembolsos' | 'ia';
export const LEGAL_DOCS: LegalDocId[] = ['terminos', 'privacidad', 'reembolsos', 'ia'];

interface Section {
  h: string;
  p: string[];
}
interface LegalDoc {
  title: string;
  intro: string;
  sections: Section[];
}

const O = LEGAL_OPERATOR;
const E = LEGAL_EMAIL;
const LOC = LEGAL_LOCATION;

const ES: Record<LegalDocId, LegalDoc> = {
  terminos: {
    title: 'Términos de servicio',
    intro: `Estos Términos regulan el uso de LEVELGROW AI (la "Plataforma"), operada por ${O}, con sede en ${LOC} ("LEVELGROW", "nosotros"). Al crear una cuenta, pagar una suscripción o usar la Plataforma aceptas estos Términos, la Política de privacidad, la Política de reembolsos y el Aviso sobre inteligencia artificial. Si no estás de acuerdo, no uses la Plataforma.`,
    sections: [
      {
        h: '1. Qué es LEVELGROW AI',
        p: [
          'LEVELGROW AI es un asesor de marketing basado en inteligencia artificial que guía a dueños de negocio por una ruta de etapas (ADN, cliente ideal, oferta, contenido, captación, anuncios, ventas y plan de 30 días) y genera textos, guiones, planes y recomendaciones.',
          'La Plataforma es una herramienta de apoyo. No es una agencia, no ejecuta campañas por ti y no sustituye el asesoramiento profesional legal, fiscal, financiero, médico ni de ningún otro tipo.',
        ],
      },
      {
        h: '2. Requisitos y cuenta',
        p: [
          'Debes tener al menos 18 años y capacidad legal para contratar. La Plataforma está pensada para uso profesional o de negocio.',
          'Eres responsable de la información que das, de mantener tu contraseña en secreto y de toda la actividad de tu cuenta. La cuenta es personal: no puedes compartirla, venderla ni darla a terceros. Avísanos de inmediato si sospechas un acceso no autorizado.',
        ],
      },
      {
        h: '3. Planes, pagos y renovación',
        p: [
          'El acceso se ofrece por suscripción mensual (por ejemplo, Plan Básico o Plan Full). Los precios, límites de mensajes y funciones de cada plan se muestran antes de pagar.',
          'Los pagos se procesan por PayPal. La suscripción se renueva automáticamente cada mes y se cobra el mismo importe hasta que la canceles. No guardamos datos de tu tarjeta.',
          'Mes gratis de lanzamiento: durante la promoción de apertura, quien se suscribe por primera vez al Plan Básico recibe su primer mes gratis. Al suscribirte autorizas a PayPal a guardar tu método de pago y a cobrar automáticamente el precio del Plan Básico al terminar el mes gratis y luego cada mes, hasta que canceles. Si cancelas antes de que termine el mes gratis no se te cobra nada. La promoción es una por persona, no aplica al Plan Full y podemos terminarla o cambiarla para nuevas suscripciones en cualquier momento.',
          'Puedes cancelar en cualquier momento desde tu cuenta de PayPal. La cancelación detiene los cobros futuros y mantienes el acceso hasta el final del periodo ya pagado.',
          'Podemos cambiar precios o planes. Si cambia el precio de tu suscripción activa te avisaremos con antelación razonable, y el cambio se aplicará en una renovación posterior. Los impuestos que correspondan según tu país corren por tu cuenta.',
          'Si un cobro falla, PayPal puede reintentarlo. Si sigue sin poder cobrarse, la suscripción puede suspenderse y se pierde el acceso hasta regularizar el pago.',
        ],
      },
      {
        h: '4. Reembolsos',
        p: [
          'Los pagos no son reembolsables, salvo cuando la ley aplicable lo exija. Los detalles están en la Política de reembolsos, que forma parte de estos Términos.',
        ],
      },
      {
        h: '5. Uso de la inteligencia artificial',
        p: [
          'Las respuestas y entregables los genera inteligencia artificial y pueden contener errores, omisiones o información desactualizada. Debes revisarlos antes de usarlos, publicarlos o tomar decisiones con ellos. Más detalles en el Aviso sobre inteligencia artificial.',
          'No garantizamos ventas, clientes, ingresos ni ningún resultado concreto. Los resultados dependen de tu negocio, tu mercado, tu ejecución y factores que no controlamos.',
        ],
      },
      {
        h: '6. Propiedad intelectual de LEVELGROW',
        p: [
          'La Plataforma, el Método LEVELGROW, su estructura de etapas, las instrucciones y configuraciones internas de la inteligencia artificial, el software, el diseño, las marcas, los logotipos y los textos de la Plataforma son propiedad de LEVELGROW o de sus licenciantes y están protegidos por las leyes de propiedad intelectual.',
          'Te damos una licencia personal, limitada, no exclusiva, intransferible y revocable para usar la Plataforma mientras tu suscripción esté vigente, solo para tu propio negocio.',
        ],
      },
      {
        h: '7. Tu contenido y los entregables',
        p: [
          'Conservas los derechos sobre la información que introduces sobre tu negocio. Nos das permiso para procesarla con el único fin de prestarte el servicio, según la Política de privacidad.',
          'Puedes usar comercialmente los textos, guiones y planes que la Plataforma genera para tu negocio. Por su naturaleza, contenidos parecidos pueden generarse para otros usuarios, y no garantizamos que los entregables sean únicos ni que puedan registrarse como propiedad intelectual.',
          'Eres responsable de que lo que publiques (anuncios, ofertas, testimonios, afirmaciones) sea veraz, legal y cumpla las políticas de cada plataforma (Meta, Google, TikTok, etc.) y las leyes de publicidad y consumo de tu país.',
        ],
      },
      {
        h: '8. Usos prohibidos',
        p: [
          'No puedes: (a) copiar, revender, sublicenciar o dar acceso a la Plataforma a terceros; (b) intentar extraer, revelar o copiar las instrucciones internas, el método o la configuración de la IA, incluso mediante "prompt injection" o preguntas diseñadas para ello; (c) usar la Plataforma o sus resultados para crear un producto o servicio que compita con LEVELGROW AI; (d) hacer ingeniería inversa, scraping, usar bots o automatizar el acceso; (e) intentar vulnerar la seguridad, saturar el servicio o acceder a cuentas ajenas; (f) usarla para actividades ilegales, engañosas, fraudulentas, de odio, o para generar spam o contenido que infrinja derechos de terceros.',
          'Si incumples estas reglas podemos suspender o cerrar tu cuenta sin reembolso y emprender las acciones legales que correspondan.',
        ],
      },
      {
        h: '9. Disponibilidad y cambios del servicio',
        p: [
          'Trabajamos para que la Plataforma funcione de forma continua, pero puede haber interrupciones, mantenimientos o fallos de proveedores externos (hosting, base de datos, IA o pagos). Podemos mejorar, cambiar o retirar funciones.',
        ],
      },
      {
        h: '10. Exclusión de garantías',
        p: [
          'En la máxima medida permitida por la ley, la Plataforma se ofrece "tal cual" y "según disponibilidad", sin garantías de ningún tipo, expresas o implícitas, incluidas las de comerciabilidad, idoneidad para un fin concreto, exactitud o ausencia de errores.',
        ],
      },
      {
        h: '11. Limitación de responsabilidad',
        p: [
          'En la máxima medida permitida por la ley, LEVELGROW no responde de daños indirectos, incidentales, especiales o consecuentes, ni de pérdida de beneficios, ventas, datos o reputación, derivados del uso o la imposibilidad de usar la Plataforma o de decisiones tomadas con base en sus resultados.',
          'Nuestra responsabilidad total por cualquier reclamación relacionada con la Plataforma se limita al importe que nos hayas pagado en los 3 meses anteriores al hecho que la origina.',
          'Nada en estos Términos excluye responsabilidades que la ley no permite excluir.',
        ],
      },
      {
        h: '12. Indemnización',
        p: [
          'Aceptas mantener indemne a LEVELGROW frente a reclamaciones de terceros derivadas del contenido que publiques, del incumplimiento de estos Términos o de la ley por tu parte.',
        ],
      },
      {
        h: '13. Suspensión y cierre',
        p: [
          'Puedes dejar de usar la Plataforma y cancelar tu suscripción cuando quieras. Podemos suspender o cerrar cuentas que incumplan estos Términos, que causen riesgo de seguridad o legal, o por impago.',
        ],
      },
      {
        h: '14. Ley aplicable y disputas',
        p: [
          `Estos Términos se rigen por las leyes del Estado de Florida (EE. UU.), sin perjuicio de sus normas de conflicto. Cualquier disputa se someterá a los tribunales competentes del condado de Miami-Dade, Florida, salvo que la ley de tu país de residencia te otorgue, como consumidor, el derecho irrenunciable a acudir a los tribunales de tu domicilio.`,
          'Antes de iniciar cualquier reclamación, escríbenos para intentar resolverla de buena fe en un plazo de 30 días.',
          'Si eres consumidor, conservas todos los derechos obligatorios que te reconozca la ley de tu país de residencia.',
        ],
      },
      {
        h: '15. Cambios en estos Términos',
        p: [
          'Podemos actualizar estos Términos. Publicaremos la versión nueva con su fecha y, si el cambio es importante, te avisaremos dentro de la Plataforma o por correo. Si sigues usando la Plataforma después del cambio, aceptas la nueva versión.',
        ],
      },
      {
        h: '16. Idioma y contacto',
        p: [
          'La Plataforma muestra estos documentos en varios idiomas. En caso de discrepancia entre versiones, prevalece la versión en inglés.',
          `Contacto: ${E}`,
        ],
      },
    ],
  },

  privacidad: {
    title: 'Política de privacidad',
    intro: `Esta Política explica qué datos personales trata ${O} ("LEVELGROW", "nosotros") a través de LEVELGROW AI, para qué, con quién se comparten y qué derechos tienes. Somos el responsable del tratamiento.`,
    sections: [
      {
        h: '1. Datos que recogemos',
        p: [
          'Datos de cuenta: correo electrónico y contraseña. La contraseña se guarda cifrada con un algoritmo de hash (bcrypt); nadie, ni siquiera nosotros, puede leerla.',
          'Datos de tu negocio y conversaciones: lo que escribes al asesor, las respuestas de tu ruta (ADN, cliente ideal, oferta, etc.), los entregables generados y las métricas que introduces en las revisiones semanales.',
          'Datos de suscripción: plan, estado, fechas y el identificador de suscripción de PayPal. No recibimos ni guardamos el número de tu tarjeta ni tu contraseña de PayPal.',
          'Datos técnicos: dirección IP, tipo de navegador y registros de errores, usados para seguridad (por ejemplo, frenar intentos repetidos de acceso) y para mantener el servicio.',
          'Preferencias locales: guardamos en tu navegador (almacenamiento local) tu sesión y el idioma elegido. No usamos cookies de publicidad ni de seguimiento de terceros.',
        ],
      },
      {
        h: '2. Para qué los usamos y base legal',
        p: [
          'Prestar el servicio que contratas: crear tu cuenta, generar las respuestas del asesor, guardar tu progreso y tus entregables (ejecución del contrato).',
          'Gestionar pagos y suscripciones (ejecución del contrato y obligaciones legales, como las fiscales).',
          'Proteger la Plataforma y prevenir fraudes o abusos (interés legítimo).',
          'Comunicarte cambios importantes del servicio o de estas políticas (interés legítimo y obligación legal).',
          'No vendemos tus datos personales ni los usamos para publicidad de terceros. No usamos tus conversaciones para entrenar modelos de inteligencia artificial propios.',
        ],
      },
      {
        h: '3. Con quién los compartimos',
        p: [
          'Solo con proveedores que necesitamos para prestar el servicio, que actúan bajo contrato como encargados del tratamiento:',
          'Vercel Inc. (alojamiento de la aplicación, EE. UU.); Supabase Inc. (base de datos); Anthropic PBC (modelo de inteligencia artificial que procesa tus mensajes para generar las respuestas; según sus condiciones comerciales, no usa los datos de la API para entrenar sus modelos); PayPal (procesamiento de pagos, bajo su propia política de privacidad).',
          'También podemos compartir datos si lo exige la ley o una autoridad competente, o para defender nuestros derechos.',
        ],
      },
      {
        h: '4. Transferencias internacionales',
        p: [
          'Nuestros proveedores pueden tratar datos en Estados Unidos y otros países. Cuando la ley lo exige (por ejemplo, para usuarios del Espacio Económico Europeo o el Reino Unido), estas transferencias se apoyan en garantías adecuadas, como las Cláusulas Contractuales Tipo de la Comisión Europea que ofrecen esos proveedores.',
        ],
      },
      {
        h: '5. Cuánto tiempo los guardamos',
        p: [
          'Mientras tu cuenta esté activa. Si la eliminas, borramos o anonimizamos tus datos en un plazo de 30 días, salvo los que debamos conservar por obligaciones legales (por ejemplo, registros de pagos), que se guardan el tiempo que exija la ley.',
        ],
      },
      {
        h: '6. Seguridad',
        p: [
          'Usamos conexión cifrada (HTTPS), contraseñas con hash, control de acceso por usuario, límites contra intentos repetidos y proveedores con estándares de seguridad reconocidos. Ningún sistema es 100 % seguro; si detectamos una brecha que afecte a tus datos, te avisaremos según exija la ley.',
        ],
      },
      {
        h: '7. Tus derechos',
        p: [
          'Según tu país (por ejemplo, el RGPD en Europa, la CCPA/CPRA en California, la LFPDPPP en México o la LGPD en Brasil), puedes tener derecho a acceder a tus datos, rectificarlos, eliminarlos, oponerte o limitar su tratamiento, recibirlos en un formato portable y retirar tu consentimiento.',
          `Para ejercerlos, escríbenos a ${E} desde el correo de tu cuenta. Responderemos en un plazo máximo de 30 días. También puedes reclamar ante la autoridad de protección de datos de tu país.`,
          'Residentes de California: no vendemos ni compartimos datos personales para publicidad conductual y no te discriminaremos por ejercer tus derechos.',
        ],
      },
      {
        h: '8. Menores',
        p: [
          'La Plataforma no está dirigida a menores de 18 años y no recogemos conscientemente sus datos. Si crees que un menor nos ha dado datos, escríbenos y los eliminaremos.',
        ],
      },
      {
        h: '9. Cambios y contacto',
        p: [
          'Podemos actualizar esta Política. Publicaremos la versión nueva con su fecha y te avisaremos si el cambio es importante.',
          `Responsable: ${O}, ${LOC}. Contacto: ${E}`,
        ],
      },
    ],
  },

  reembolsos: {
    title: 'Política de reembolsos y cancelación',
    intro: 'Queremos que tengas claro, antes de pagar, cómo funcionan los cobros, la cancelación y los reembolsos.',
    sections: [
      {
        h: '1. Sin reembolsos',
        p: [
          'LEVELGROW AI es un servicio digital que te da acceso inmediato a la Plataforma y al asesor de inteligencia artificial desde el momento del pago, y que consume recursos de procesamiento con cada uso. Por eso, todos los pagos son definitivos y no reembolsables, total ni parcialmente, incluidos los meses no usados, los periodos parciales, los cambios de plan y los mensajes no consumidos.',
        ],
      },
      {
        h: '2. Cancelación',
        p: [
          'Puedes cancelar tu suscripción en cualquier momento desde tu cuenta de PayPal (Configuración → Pagos → Pagos automáticos) o desde la sección "Mi plan" de la Plataforma.',
          'Al cancelar no se te volverá a cobrar, y mantienes el acceso hasta que termine el periodo que ya pagaste.',
        ],
      },
      {
        h: '3. Cambio de plan',
        p: [
          'Si cambias de plan, la suscripción anterior se cancela automáticamente para que nunca pagues dos planes a la vez. El importe ya pagado del plan anterior no se reembolsa ni se prorratea.',
        ],
      },
      {
        h: '4. Derecho de desistimiento (consumidores de la UE, el Reino Unido y otros países)',
        p: [
          'Si la ley de tu país te concede un derecho de desistimiento para contratos a distancia (por ejemplo, 14 días en la Unión Europea y el Reino Unido), al pagar nos pides expresamente que el servicio empiece de inmediato y reconoces que, por tratarse de contenido y servicios digitales que se prestan de forma inmediata, pierdes ese derecho una vez comienza el acceso. Este consentimiento se recoge en la página de pago.',
        ],
      },
      {
        h: '5. Excepciones',
        p: [
          'Solo revisaremos un caso de reembolso si: (a) se te cobró dos veces por error el mismo periodo; o (b) la ley aplicable nos obliga de forma imperativa. Escríbenos con el comprobante de PayPal en un plazo de 14 días desde el cobro.',
          'Te pedimos que nos escribas antes de abrir una disputa en PayPal: la mayoría de los problemas se resuelven rápido. Las disputas o contracargos abiertos sin motivo válido pueden dar lugar al cierre de la cuenta.',
        ],
      },
      {
        h: '6. Contacto',
        p: [`Para cualquier duda sobre cobros: ${E}`],
      },
    ],
  },

  ia: {
    title: 'Aviso sobre inteligencia artificial',
    intro: 'LEVELGROW AI usa inteligencia artificial. Te lo decimos claramente para que sepas con qué estás trabajando y cómo usar sus resultados de forma responsable.',
    sections: [
      {
        h: '1. Estás hablando con una IA',
        p: [
          'El asesor de LEVELGROW AI no es una persona. Sus respuestas, guiones, planes, calendarios y revisiones los genera automáticamente un modelo de inteligencia artificial a partir de lo que tú le cuentas y del Método LEVELGROW.',
        ],
      },
      {
        h: '2. La IA puede equivocarse',
        p: [
          'Puede dar información incorrecta, incompleta, desactualizada o que no encaje con tu caso; puede inventar datos, cifras o ejemplos que suenan convincentes. Revisa siempre los resultados, sobre todo precios, cifras, afirmaciones sobre productos, promesas a clientes y textos de anuncios.',
        ],
      },
      {
        h: '3. No es asesoramiento profesional',
        p: [
          'Las recomendaciones son de marketing y ventas con fines orientativos. No son asesoramiento legal, fiscal, contable, financiero, médico ni de inversión. Para esas decisiones consulta a un profesional cualificado.',
        ],
      },
      {
        h: '4. Sin garantía de resultados',
        p: [
          'Ningún plan, anuncio o guion garantiza ventas, clientes o ingresos. Los resultados dependen de tu producto, tu mercado, tu presupuesto, tu ejecución y factores externos.',
        ],
      },
      {
        h: '5. Tú decides y tú publicas',
        p: [
          'Tú eres responsable de lo que decidas hacer con los resultados y de lo que publiques. Antes de usar un anuncio o una oferta, comprueba que cumple las leyes de publicidad y consumo de tu país y las políticas de cada plataforma (Meta, Google, TikTok, etc.), y no hagas afirmaciones que no puedas demostrar.',
        ],
      },
      {
        h: '6. Cuida lo que compartes',
        p: [
          'No escribas en el chat contraseñas, datos bancarios, datos de salud ni datos personales sensibles de tus clientes. Solo necesitamos información de tu negocio para ayudarte.',
        ],
      },
    ],
  },
};

const EN: Record<LegalDocId, LegalDoc> = {
  terminos: {
    title: 'Terms of Service',
    intro: `These Terms govern your use of LEVELGROW AI (the "Platform"), operated by ${O}, based in ${LOC} ("LEVELGROW", "we", "us"). By creating an account, paying for a subscription or using the Platform you accept these Terms, the Privacy Policy, the Refund Policy and the Artificial Intelligence Notice. If you do not agree, do not use the Platform.`,
    sections: [
      {
        h: '1. What LEVELGROW AI is',
        p: [
          'LEVELGROW AI is an AI-powered marketing advisor that guides business owners through a route of stages (DNA, ideal customer, offer, content, lead generation, ads, sales and a 30-day plan) and generates copy, scripts, plans and recommendations.',
          'The Platform is a support tool. It is not an agency, it does not run campaigns for you and it does not replace professional legal, tax, financial, medical or any other advice.',
        ],
      },
      {
        h: '2. Eligibility and account',
        p: [
          'You must be at least 18 years old and legally able to enter into contracts. The Platform is intended for professional or business use.',
          'You are responsible for the information you provide, for keeping your password secret and for all activity on your account. Accounts are personal: you may not share, sell or transfer them. Tell us immediately if you suspect unauthorized access.',
        ],
      },
      {
        h: '3. Plans, payments and renewal',
        p: [
          'Access is offered as a monthly subscription (for example, the Basic or Full plan). Prices, message limits and features of each plan are shown before you pay.',
          'Payments are processed by PayPal. Your subscription renews automatically every month and is charged the same amount until you cancel. We do not store your card details.',
          'Launch free month: during the launch promotion, first-time subscribers to the Basic plan get their first month free. By subscribing you authorize PayPal to store your payment method and to automatically charge the Basic plan price when the free month ends and every month after that, until you cancel. If you cancel before the free month ends, you are not charged. The promotion is limited to one per person, does not apply to the Full plan, and we may end or change it for new subscriptions at any time.',
          'You can cancel at any time from your PayPal account. Cancelling stops future charges and you keep access until the end of the period already paid.',
          'We may change prices or plans. If the price of your active subscription changes we will give you reasonable advance notice, and the change will apply from a later renewal. Any taxes due in your country are your responsibility.',
          'If a charge fails, PayPal may retry it. If it still cannot be collected, the subscription may be suspended and access lost until payment is settled.',
        ],
      },
      {
        h: '4. Refunds',
        p: [
          'Payments are non-refundable except where applicable law requires otherwise. Details are in the Refund Policy, which forms part of these Terms.',
        ],
      },
      {
        h: '5. Use of artificial intelligence',
        p: [
          'Replies and deliverables are generated by artificial intelligence and may contain errors, omissions or outdated information. You must review them before using or publishing them or making decisions based on them. See the Artificial Intelligence Notice.',
          'We do not guarantee sales, customers, revenue or any specific result. Results depend on your business, market, execution and factors outside our control.',
        ],
      },
      {
        h: '6. LEVELGROW intellectual property',
        p: [
          'The Platform, the LEVELGROW Method, its stage structure, the internal instructions and configuration of the AI, the software, design, trademarks, logos and Platform texts belong to LEVELGROW or its licensors and are protected by intellectual property laws.',
          'We grant you a personal, limited, non-exclusive, non-transferable and revocable license to use the Platform while your subscription is active, for your own business only.',
        ],
      },
      {
        h: '7. Your content and deliverables',
        p: [
          'You keep your rights to the information you enter about your business. You allow us to process it solely to provide the service, as described in the Privacy Policy.',
          'You may use the copy, scripts and plans the Platform generates for your business commercially. By their nature, similar content may be generated for other users, and we do not guarantee that deliverables are unique or eligible for intellectual property protection.',
          'You are responsible for making sure that what you publish (ads, offers, testimonials, claims) is truthful, lawful and complies with each platform’s policies (Meta, Google, TikTok, etc.) and the advertising and consumer laws of your country.',
        ],
      },
      {
        h: '8. Prohibited uses',
        p: [
          'You may not: (a) copy, resell, sublicense or give third parties access to the Platform; (b) attempt to extract, reveal or copy the internal instructions, method or AI configuration, including through prompt injection or questions designed for that purpose; (c) use the Platform or its output to build a product or service that competes with LEVELGROW AI; (d) reverse engineer, scrape, use bots or automate access; (e) attempt to breach security, overload the service or access other accounts; (f) use it for illegal, deceptive, fraudulent or hateful activities, or to generate spam or content that infringes third-party rights.',
          'If you break these rules we may suspend or close your account without refund and take appropriate legal action.',
        ],
      },
      {
        h: '9. Availability and changes',
        p: [
          'We work to keep the Platform running continuously, but there may be interruptions, maintenance or failures of third-party providers (hosting, database, AI or payments). We may improve, change or remove features.',
        ],
      },
      {
        h: '10. Disclaimer of warranties',
        p: [
          'To the fullest extent permitted by law, the Platform is provided "as is" and "as available", without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, accuracy or freedom from errors.',
        ],
      },
      {
        h: '11. Limitation of liability',
        p: [
          'To the fullest extent permitted by law, LEVELGROW is not liable for indirect, incidental, special or consequential damages, or for loss of profits, sales, data or reputation, arising from the use of or inability to use the Platform or from decisions based on its output.',
          'Our total liability for any claim related to the Platform is limited to the amount you paid us in the 3 months before the event giving rise to the claim.',
          'Nothing in these Terms excludes liability that cannot be excluded by law.',
        ],
      },
      {
        h: '12. Indemnification',
        p: [
          'You agree to indemnify LEVELGROW against third-party claims arising from content you publish or from your breach of these Terms or the law.',
        ],
      },
      {
        h: '13. Suspension and termination',
        p: [
          'You may stop using the Platform and cancel your subscription at any time. We may suspend or close accounts that breach these Terms, create a security or legal risk, or fail to pay.',
        ],
      },
      {
        h: '14. Governing law and disputes',
        p: [
          'These Terms are governed by the laws of the State of Florida, USA, without regard to its conflict-of-law rules. Any dispute will be submitted to the competent courts of Miami-Dade County, Florida, unless the law of your country of residence gives you, as a consumer, a non-waivable right to go to the courts where you live.',
          'Before bringing any claim, please write to us so we can try to resolve it in good faith within 30 days.',
          'If you are a consumer, you keep all mandatory rights granted by the law of your country of residence.',
        ],
      },
      {
        h: '15. Changes to these Terms',
        p: [
          'We may update these Terms. We will publish the new version with its date and, for material changes, notify you in the Platform or by email. Continuing to use the Platform after a change means you accept the new version.',
        ],
      },
      {
        h: '16. Language and contact',
        p: [
          'The Platform shows these documents in several languages. If versions differ, the English version prevails.',
          `Contact: ${E}`,
        ],
      },
    ],
  },

  privacidad: {
    title: 'Privacy Policy',
    intro: `This Policy explains what personal data ${O} ("LEVELGROW", "we") processes through LEVELGROW AI, why, who it is shared with and what rights you have. We are the data controller.`,
    sections: [
      {
        h: '1. Data we collect',
        p: [
          'Account data: email address and password. Passwords are stored hashed with bcrypt; nobody, including us, can read them.',
          'Business data and conversations: what you write to the advisor, your route answers (DNA, ideal customer, offer, etc.), generated deliverables and the metrics you enter in weekly reviews.',
          'Subscription data: plan, status, dates and the PayPal subscription ID. We never receive or store your card number or PayPal password.',
          'Technical data: IP address, browser type and error logs, used for security (for example, slowing down repeated sign-in attempts) and to keep the service running.',
          'Local preferences: your browser’s local storage keeps your session and chosen language. We do not use third-party advertising or tracking cookies.',
        ],
      },
      {
        h: '2. Why we use it and legal basis',
        p: [
          'To provide the service you subscribe to: create your account, generate the advisor’s replies, save your progress and deliverables (performance of contract).',
          'To manage payments and subscriptions (performance of contract and legal obligations such as tax).',
          'To protect the Platform and prevent fraud or abuse (legitimate interest).',
          'To tell you about important changes to the service or these policies (legitimate interest and legal obligation).',
          'We do not sell your personal data or use it for third-party advertising. We do not use your conversations to train our own AI models.',
        ],
      },
      {
        h: '3. Who we share it with',
        p: [
          'Only with providers we need to deliver the service, acting under contract as processors:',
          'Vercel Inc. (application hosting, USA); Supabase Inc. (database); Anthropic PBC (the AI model that processes your messages to generate replies; under its commercial terms it does not use API data to train its models); PayPal (payment processing, under its own privacy policy).',
          'We may also disclose data when required by law or a competent authority, or to defend our rights.',
        ],
      },
      {
        h: '4. International transfers',
        p: [
          'Our providers may process data in the United States and other countries. Where the law requires it (for example, for users in the European Economic Area or the United Kingdom), these transfers rely on appropriate safeguards such as the European Commission’s Standard Contractual Clauses offered by those providers.',
        ],
      },
      {
        h: '5. How long we keep it',
        p: [
          'For as long as your account is active. If you delete it, we delete or anonymize your data within 30 days, except data we must keep for legal obligations (for example, payment records), which is kept for as long as the law requires.',
        ],
      },
      {
        h: '6. Security',
        p: [
          'We use encrypted connections (HTTPS), hashed passwords, per-user access control, limits on repeated attempts and providers with recognized security standards. No system is 100% secure; if we detect a breach affecting your data we will notify you as required by law.',
        ],
      },
      {
        h: '7. Your rights',
        p: [
          'Depending on your country (for example, the GDPR in Europe, the CCPA/CPRA in California, Mexico’s LFPDPPP or Brazil’s LGPD), you may have the right to access, correct or delete your data, object to or restrict processing, receive it in a portable format and withdraw consent.',
          `To exercise them, write to ${E} from your account email. We will reply within 30 days. You may also complain to the data protection authority in your country.`,
          'California residents: we do not sell or share personal information for cross-context behavioral advertising and will not discriminate against you for exercising your rights.',
        ],
      },
      {
        h: '8. Children',
        p: [
          'The Platform is not directed at anyone under 18 and we do not knowingly collect their data. If you believe a minor has given us data, contact us and we will delete it.',
        ],
      },
      {
        h: '9. Changes and contact',
        p: [
          'We may update this Policy. We will publish the new version with its date and notify you of material changes.',
          `Controller: ${O}, ${LOC}. Contact: ${E}`,
        ],
      },
    ],
  },

  reembolsos: {
    title: 'Refund and Cancellation Policy',
    intro: 'We want you to know, before you pay, exactly how charges, cancellation and refunds work.',
    sections: [
      {
        h: '1. No refunds',
        p: [
          'LEVELGROW AI is a digital service that gives you immediate access to the Platform and the AI advisor from the moment of payment, and that consumes processing resources with every use. Therefore all payments are final and non-refundable, in whole or in part, including unused months, partial periods, plan changes and unused messages.',
        ],
      },
      {
        h: '2. Cancellation',
        p: [
          'You can cancel your subscription at any time from your PayPal account (Settings → Payments → Automatic payments) or from the "My plan" section of the Platform.',
          'Once cancelled you will not be charged again, and you keep access until the end of the period you already paid for.',
        ],
      },
      {
        h: '3. Changing plans',
        p: [
          'If you change plans, the previous subscription is cancelled automatically so you never pay for two plans at once. Amounts already paid for the previous plan are not refunded or prorated.',
        ],
      },
      {
        h: '4. Right of withdrawal (consumers in the EU, UK and other countries)',
        p: [
          'If the law of your country grants you a right of withdrawal for distance contracts (for example, 14 days in the European Union and the United Kingdom), by paying you expressly request that the service start immediately and acknowledge that, because it consists of digital content and services supplied immediately, you lose that right once access begins. This consent is collected on the checkout page.',
        ],
      },
      {
        h: '5. Exceptions',
        p: [
          'We will only review a refund if: (a) you were charged twice by mistake for the same period; or (b) applicable law mandatorily requires it. Write to us with the PayPal receipt within 14 days of the charge.',
          'Please contact us before opening a PayPal dispute: most issues are solved quickly. Disputes or chargebacks opened without a valid reason may lead to account closure.',
        ],
      },
      {
        h: '6. Contact',
        p: [`For any billing question: ${E}`],
      },
    ],
  },

  ia: {
    title: 'Artificial Intelligence Notice',
    intro: 'LEVELGROW AI uses artificial intelligence. We say so clearly so you know what you are working with and how to use its output responsibly.',
    sections: [
      {
        h: '1. You are talking to an AI',
        p: [
          'The LEVELGROW AI advisor is not a person. Its replies, scripts, plans, calendars and reviews are generated automatically by an artificial intelligence model from what you tell it and from the LEVELGROW Method.',
        ],
      },
      {
        h: '2. The AI can be wrong',
        p: [
          'It may give incorrect, incomplete, outdated or ill-fitting information, and may invent data, figures or examples that sound convincing. Always review the output, especially prices, figures, product claims, promises to customers and ad copy.',
        ],
      },
      {
        h: '3. Not professional advice',
        p: [
          'Recommendations are marketing and sales guidance only. They are not legal, tax, accounting, financial, medical or investment advice. For those decisions consult a qualified professional.',
        ],
      },
      {
        h: '4. No guaranteed results',
        p: [
          'No plan, ad or script guarantees sales, customers or revenue. Results depend on your product, market, budget, execution and external factors.',
        ],
      },
      {
        h: '5. You decide and you publish',
        p: [
          'You are responsible for what you decide to do with the output and for what you publish. Before using an ad or offer, check that it complies with your country’s advertising and consumer laws and each platform’s policies (Meta, Google, TikTok, etc.), and do not make claims you cannot prove.',
        ],
      },
      {
        h: '6. Be careful what you share',
        p: [
          'Do not type passwords, bank details, health data or sensitive personal data about your customers into the chat. We only need information about your business to help you.',
        ],
      },
    ],
  },
};

export function legalDoc(doc: LegalDocId, language: Language): { text: LegalDoc; lang: 'es' | 'en' } {
  return language === 'es' ? { text: ES[doc], lang: 'es' } : { text: EN[doc], lang: 'en' };
}

/** Short interface strings for legal links and notices, in every app language. */
export const LEGAL_UI: Record<
  Language,
  {
    terms: string;
    privacy: string;
    refunds: string;
    ai: string;
    updated: string;
    englishNotice: string;
    back: string;
    aiShort: string;
    checkoutConsent: string;
    checkoutConsentRequired: string;
  }
> = {
  es: {
    terms: 'Términos',
    privacy: 'Privacidad',
    refunds: 'Reembolsos',
    ai: 'Aviso de IA',
    updated: 'Última actualización',
    englishNotice: '',
    back: 'Volver',
    aiShort: 'LEVELGROW AI es una inteligencia artificial y puede equivocarse. Revisa la información importante antes de usarla.',
    checkoutConsent:
      'Quiero acceso inmediato a LEVELGROW AI. Entiendo que la suscripción se renueva cada mes hasta que la cancele, que los pagos no son reembolsables y que, al empezar el servicio, pierdo cualquier derecho de desistimiento. Acepto los Términos y la Política de reembolsos.',
    checkoutConsentRequired: 'Marca la casilla de arriba para mostrar los botones de pago.',
  },
  en: {
    terms: 'Terms',
    privacy: 'Privacy',
    refunds: 'Refunds',
    ai: 'AI notice',
    updated: 'Last updated',
    englishNotice: '',
    back: 'Back',
    aiShort: 'LEVELGROW AI is an artificial intelligence and can make mistakes. Check important information before using it.',
    checkoutConsent:
      'I want immediate access to LEVELGROW AI. I understand the subscription renews every month until I cancel, payments are non-refundable and, once the service starts, I lose any right of withdrawal. I accept the Terms and the Refund Policy.',
    checkoutConsentRequired: 'Tick the box above to show the payment buttons.',
  },
  ru: {
    terms: 'Условия',
    privacy: 'Конфиденциальность',
    refunds: 'Возвраты',
    ai: 'Об ИИ',
    updated: 'Последнее обновление',
    englishNotice: 'Этот документ доступен на английском языке. Используя платформу, вы принимаете его.',
    back: 'Назад',
    aiShort: 'LEVELGROW AI — это искусственный интеллект, и он может ошибаться. Проверяйте важную информацию перед использованием.',
    checkoutConsent:
      'Я хочу получить немедленный доступ к LEVELGROW AI. Я понимаю, что подписка продлевается каждый месяц, пока я её не отменю, платежи не возвращаются, и с началом обслуживания я теряю право на отказ. Я принимаю Условия и Политику возвратов.',
    checkoutConsentRequired: 'Отметьте галочку выше, чтобы появились кнопки оплаты.',
  },
  az: {
    terms: 'Şərtlər',
    privacy: 'Məxfilik',
    refunds: 'Geri ödəmələr',
    ai: 'Sİ bildirişi',
    updated: 'Son yenilənmə',
    englishNotice: 'Bu sənəd ingilis dilində təqdim olunur. Platformadan istifadə etməklə onu qəbul edirsiniz.',
    back: 'Geri',
    aiShort: 'LEVELGROW AI süni intellektdir və səhv edə bilər. Vacib məlumatı istifadə etməzdən əvvəl yoxlayın.',
    checkoutConsent:
      'LEVELGROW AI-yə dərhal giriş istəyirəm. Abunəliyin ləğv edənə qədər hər ay yeniləndiyini, ödənişlərin geri qaytarılmadığını və xidmət başlayanda imtina hüququnu itirdiyimi başa düşürəm. Şərtləri və Geri ödəmə siyasətini qəbul edirəm.',
    checkoutConsentRequired: 'Ödəniş düymələrini görmək üçün yuxarıdakı qutunu işarələyin.',
  },
  tr: {
    terms: 'Şartlar',
    privacy: 'Gizlilik',
    refunds: 'İadeler',
    ai: 'YZ bildirimi',
    updated: 'Son güncelleme',
    englishNotice: 'Bu belge İngilizce olarak sunulmaktadır. Platformu kullanarak bu belgeyi kabul etmiş olursunuz.',
    back: 'Geri',
    aiShort: 'LEVELGROW AI bir yapay zekâdır ve hata yapabilir. Önemli bilgileri kullanmadan önce kontrol edin.',
    checkoutConsent:
      'LEVELGROW AI’a hemen erişmek istiyorum. Aboneliğin iptal edene kadar her ay yenilendiğini, ödemelerin iade edilmediğini ve hizmet başladığında cayma hakkımı kaybettiğimi anlıyorum. Şartları ve İade Politikasını kabul ediyorum.',
    checkoutConsentRequired: 'Ödeme düğmelerini görmek için yukarıdaki kutuyu işaretleyin.',
  },
};
