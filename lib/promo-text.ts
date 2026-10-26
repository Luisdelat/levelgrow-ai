// Texts for the launch promotion (Basic plan, first month free).
// Placeholders: {price} regular monthly price, {date} last day of the promotion.
import type { Language } from './translations';
import { LAUNCH_PROMO } from './plans';

export interface PromoText {
  badge: string;
  banner: string;
  cardNote: string;
  today: string;
  consent: string;
  registerOption: string;
  welcome: string;
}

export const PROMO_TEXT: Record<Language, PromoText> = {
  es: {
    badge: '1er mes GRATIS',
    banner: 'Promoción de apertura: el Plan Básico tiene tu primer mes GRATIS. Solo hasta el {date}.',
    cardNote: 'Primer mes gratis, después ${price}/mes. Cancela cuando quieras.',
    today: 'Hoy pagas $0. Desde el segundo mes: ${price}/mes.',
    consent:
      'Entiendo que mi primer mes es gratis y que, al terminar, PayPal cobrará ${price} USD automáticamente cada mes hasta que cancele. Si cancelo antes de que termine el mes gratis, no se me cobra nada.',
    registerOption: '1er mes gratis, luego ${price}/mes',
    welcome: 'Tu primer mes es gratis. El primer cobro de ${price} USD será el {date}, salvo que canceles antes.',
  },
  en: {
    badge: '1st month FREE',
    banner: 'Launch offer: the Basic plan comes with your first month FREE. Only until {date}.',
    cardNote: 'First month free, then ${price}/month. Cancel anytime.',
    today: 'You pay $0 today. From the second month: ${price}/month.',
    consent:
      'I understand my first month is free and that, when it ends, PayPal will automatically charge ${price} USD every month until I cancel. If I cancel before the free month ends, I am not charged.',
    registerOption: '1st month free, then ${price}/month',
    welcome: 'Your first month is free. The first charge of ${price} USD will be on {date}, unless you cancel before.',
  },
  ru: {
    badge: '1-й месяц БЕСПЛАТНО',
    banner: 'Акция к запуску: в тарифе Basic первый месяц БЕСПЛАТНО. Только до {date}.',
    cardNote: 'Первый месяц бесплатно, затем ${price}/мес. Отменить можно в любой момент.',
    today: 'Сегодня вы платите $0. Со второго месяца: ${price}/мес.',
    consent:
      'Я понимаю, что первый месяц бесплатный, а после его окончания PayPal будет автоматически списывать ${price} USD каждый месяц, пока я не отменю подписку. Если я отменю до конца бесплатного месяца, списаний не будет.',
    registerOption: '1-й месяц бесплатно, затем ${price}/мес',
    welcome: 'Первый месяц бесплатный. Первое списание ${price} USD будет {date}, если вы не отмените подписку раньше.',
  },
  tr: {
    badge: '1. ay ÜCRETSİZ',
    banner: 'Açılış kampanyası: Basic planda ilk ay ÜCRETSİZ. Sadece {date} tarihine kadar.',
    cardNote: 'İlk ay ücretsiz, sonra ${price}/ay. İstediğin zaman iptal et.',
    today: 'Bugün $0 ödersin. İkinci aydan itibaren: ${price}/ay.',
    consent:
      'İlk ayımın ücretsiz olduğunu ve sona erdiğinde PayPal\'ın iptal edene kadar her ay otomatik olarak ${price} USD tahsil edeceğini anlıyorum. Ücretsiz ay bitmeden iptal edersem hiçbir ücret alınmaz.',
    registerOption: '1. ay ücretsiz, sonra ${price}/ay',
    welcome: 'İlk ayın ücretsiz. İlk ${price} USD ödemesi, daha önce iptal etmezsen {date} tarihinde alınacak.',
  },
  az: {
    badge: '1-ci ay PULSUZ',
    banner: 'Açılış kampaniyası: Basic paketdə ilk ay PULSUZDUR. Yalnız {date} tarixinədək.',
    cardNote: 'İlk ay pulsuz, sonra ${price}/ay. İstənilən vaxt ləğv edin.',
    today: 'Bu gün $0 ödəyirsiniz. İkinci aydan: ${price}/ay.',
    consent:
      'Başa düşürəm ki, ilk ayım pulsuzdur və bitdikdən sonra PayPal ləğv edənə qədər hər ay avtomatik olaraq ${price} USD çıxacaq. Pulsuz ay bitməmiş ləğv etsəm, heç bir ödəniş tutulmur.',
    registerOption: '1-ci ay pulsuz, sonra ${price}/ay',
    welcome: 'İlk ayınız pulsuzdur. İlk ${price} USD ödəniş, əvvəlcədən ləğv etməsəniz, {date} tarixində olacaq.',
  },
};

const LOCALES: Record<Language, string> = { es: 'es', en: 'en', ru: 'ru', tr: 'tr', az: 'az' };

/** Last day of the promotion, written for this language (e.g. "26 de diciembre"). */
export function promoEndLabel(language: Language): string {
  const lastDay = new Date(new Date(LAUNCH_PROMO.endsAt).getTime() - 6 * 60 * 60 * 1000);
  return lastDay.toLocaleDateString(LOCALES[language], { day: 'numeric', month: 'long', timeZone: 'America/New_York' });
}

export function promoFill(text: string, values: { price?: number; date?: string }): string {
  return text.replace('{price}', String(values.price ?? '')).replace('{date}', values.date ?? '');
}
