import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');

const SITE = 'https://barqstore.org';

const PAGES = [
  {
    path: 'about',
    title: 'من نحن | متجر برق — نبيعُ حضورك الرقمي',
    description:
      'برق متجر نموّ قنواتك على إنستغرام وفيسبوك وتيك توك — مشاهدات ولايكات ومتابعون بتفعيل فوري وأداء يليق باسمنا.',
  },
  {
    path: 'products',
    title: 'المنتجات | متجر برق — متابعون ومشاهدات ولايكات لكل المنصات',
    description:
      'تصفح باقات متجر برق: متابعون مضمونون، مشاهدات ريلز، لايكات وتفاعل لإنستغرام وفيسبوك وتيك توك — أسعار بالدينار الأردني.',
  },
  {
    path: 'contact',
    title: 'تواصل معنا | متجر برق — اطلب باقتك الآن',
    description:
      'تواصل مع فريق متجر برق عبر واتساب أو النموذج المباشر — متابعون ومشاهدات ولايكات لإنستغرام وفيسبوك وتيك توك.',
  },
  {
    path: 'auth',
    title: 'دخول النظام | متجر برق — حساباتك كلها بضغطة',
    description:
      'سجّل دخولك أو أنشئ حساباً جديداً في متجر برق لمتابعة طلباتك وأكوادك على إنستغرام وفيسبوك وتيك توك.',
    noindex: true,
  },
];

const base = readFileSync(join(dist, 'index.html'), 'utf8');

function inject(html, page) {
  const url = `${SITE}/${page.path}`;
  let out = html;
  out = out.replace(/<title>.*<\/title>/, `<title>${page.title}</title>`);
  out = out.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${page.description}" />`
  );
  out = out.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${url}" />`
  );
  out = out.replace(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${page.title}" />`
  );
  out = out.replace(
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${page.description}" />`
  );
  out = out.replace(
    /<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${url}" />`
  );
  out = out.replace(
    /<meta name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${page.title}" />`
  );
  out = out.replace(
    /<meta name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${page.description}" />`
  );
  if (page.noindex) {
    out = out.replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow" />');
  }
  return out;
}

// 1) صفحة الخطأ → نسخة للرئيسية تُخدم كـ SPA fallback لأي مسار غير معروف
writeFileSync(join(dist, '404.html'), base, 'utf8');

// 1.5) ملف الدومين المخصص — يُخدم من جذر موقع النشر
writeFileSync(join(dist, 'CNAME'), 'barqstore.org\n', 'utf8');

// 2) نسخة مستقلة لكل صفحة بمعرفاتها ووصفها الصحيح (تُحقن حسب الصفحة)
for (const page of PAGES) {
  const file = join(dist, page.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, inject(base, page), 'utf8');
  console.log(`✅ ${SITE}/${page.path} → ${file}`);
}

console.log('✅ 404.html و نسخ الصفحات جاهزة');