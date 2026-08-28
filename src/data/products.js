import { FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';

export const WA = 'https://wa.me/962785151865';

export const PLATFORMS = [
  {
    id: 'instagram',
    name: 'إنستغرام',
    en: 'INSTAGRAM',
    Icon: FaInstagram,
    color: '#FF3BFF',
    dark: '#C2189B',
    bg: '#FFEBFA',
    tagline: 'ريلز · بوستات · ستوري',
    groups: [
      {
        cat: 'متابعون',
        sub: 'مع ضمان',
        badge: 'ضمان 30 يوم',
        items: [
          { qty: '1,000', price: '2.99' },
          { qty: '5,000', price: '14.99' },
          { qty: '10,000', price: '29.99' },
          { qty: '20,000', price: '54.99' },
        ],
      },
      {
        cat: 'متابعون',
        sub: 'بدون ضمان',
        badge: null,
        items: [
          { qty: '1,000', price: '2.49' },
          { qty: '5,000', price: '11.99' },
          { qty: '10,000', price: '24.99' },
          { qty: '20,000', price: '49.99' },
        ],
      },
      {
        cat: 'مشاهدات ريلز',
        sub: null,
        badge: null,
        items: [
          { qty: '10,000', price: '9.99' },
          { qty: '20,000', price: '17.99' },
          { qty: '30,000', price: '24.99' },
          { qty: '40,000', price: '29.99' },
          { qty: '50,000', price: '34.99' },
        ],
      },
      {
        cat: 'لايكات ريلز / بوستات',
        sub: null,
        badge: null,
        items: [
          { qty: '1,000', price: '1.49' },
          { qty: '5,000', price: '5.99' },
          { qty: '10,000', price: '9.99' },
          { qty: '20,000', price: '17.99' },
        ],
      },
    ],
  },
  {
    id: 'facebook',
    name: 'فيسبوك',
    en: 'FACEBOOK',
    Icon: FaFacebookF,
    color: '#407BFF',
    dark: '#1D4ED8',
    bg: '#EAF1FF',
    tagline: 'ريلز · بوستات · صفحات',
    groups: [
      {
        cat: 'متابعون',
        sub: 'مع ضمان',
        badge: 'ضمان 30 يوم',
        items: [
          { qty: '1,000', price: '4.99' },
          { qty: '5,000', price: '24.99' },
          { qty: '10,000', price: '44.99' },
          { qty: '20,000', price: '69.99' },
        ],
      },
      {
        cat: 'متابعون',
        sub: 'بدون ضمان',
        badge: null,
        items: [
          { qty: '1,000', price: '3.99' },
          { qty: '5,000', price: '19.99' },
          { qty: '10,000', price: '34.99' },
          { qty: '20,000', price: '59.99' },
        ],
      },
      {
        cat: 'مشاهدات ريلز',
        sub: null,
        badge: null,
        items: [
          { qty: '10,000', price: '9.99' },
          { qty: '20,000', price: '17.99' },
          { qty: '30,000', price: '24.99' },
          { qty: '40,000', price: '29.99' },
          { qty: '50,000', price: '34.99' },
        ],
      },
      {
        cat: 'لايكات ريلز / بوستات',
        sub: null,
        badge: null,
        items: [
          { qty: '1,000', price: '1.49' },
          { qty: '5,000', price: '5.99' },
          { qty: '10,000', price: '9.99' },
          { qty: '20,000', price: '17.99' },
        ],
      },
    ],
  },
  {
    id: 'tiktok',
    name: 'تيك توك',
    en: 'TIKTOK',
    Icon: FaTiktok,
    color: '#25F4EE',
    dark: '#010101',
    bg: '#EDFDFB',
    tagline: 'ريلز · ترند · فوريو',
    groups: [
      {
        cat: 'متابعون',
        sub: 'مع ضمان',
        badge: 'ضمان 30 يوم',
        items: [
          { qty: '1,000', price: '6.99' },
          { qty: '5,000', price: '34.99' },
          { qty: '10,000', price: '69.99' },
          { qty: '20,000', price: '129.99' },
        ],
      },
      {
        cat: 'متابعون',
        sub: 'بدون ضمان',
        badge: null,
        items: [
          { qty: '1,000', price: '5.99' },
          { qty: '5,000', price: '29.99' },
          { qty: '10,000', price: '49.99' },
          { qty: '20,000', price: '59.99' },
        ],
      },
      {
        cat: 'مشاهدات ريلز',
        sub: null,
        badge: null,
        items: [
          { qty: '10,000', price: '9.99' },
          { qty: '20,000', price: '17.99' },
          { qty: '30,000', price: '24.99' },
          { qty: '40,000', price: '29.99' },
          { qty: '50,000', price: '34.99' },
        ],
      },
      {
        cat: 'لايكات ريلز',
        sub: null,
        badge: null,
        items: [
          { qty: '1,000', price: '1.99' },
          { qty: '5,000', price: '8.99' },
          { qty: '10,000', price: '14.99' },
          { qty: '20,000', price: '24.99' },
        ],
      },
    ],
  },
];

export const PRODUCT_INDEX = PLATFORMS.flatMap((p) =>
  p.groups.flatMap((g) => g.items.map((item) => ({ p, g, item })))
);

export function searchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCT_INDEX;
  const terms = q.split(/\s+/).filter(Boolean);
  return PRODUCT_INDEX.filter(({ p, g, item }) => {
    const hay = [p.name, p.en, p.tagline, g.cat, g.sub, item.qty, item.price, p.id]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}

export const SUGGESTIONS = [
  { label: 'متابعون', q: 'متابعون' },
  { label: 'مشاهدات ريلز', q: 'مشاهدات' },
  { label: 'لايكات', q: 'لايكات' },
  { label: 'إنستغرام', q: 'إنستغرام' },
  { label: 'فيسبوك', q: 'فيسبوك' },
  { label: 'تيك توك', q: 'تيك توك' },
  { label: 'مع ضمان', q: 'ضمان' },
];

export const POPULAR = PRODUCT_INDEX.filter(({ g, item }) => g.items[0] === item).slice(0, 6);

export const orderLink = (p, g, item) =>
  `${WA}?text=${encodeURIComponent(
    `مرحباً برق، أريد طلب:\n${item.qty} ${g.cat} — ${p.name}${g.sub ? ` (${g.sub})` : ''}\nالسعر: ${item.price} JOD`
  )}`;