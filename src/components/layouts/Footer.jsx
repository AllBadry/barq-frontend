import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { Zap, ArrowUp, ArrowUpRight, Mail, Clock } from 'lucide-react';
import { FaTelegramPlane, FaInstagram, FaFacebookF, FaTiktok, FaPhone } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: 'الرئيسية', to: '/' },
  { label: 'المنتجات', to: '/products' },
  { label: 'من نحن', to: '/about' },
  { label: 'تواصل معنا', to: '/contact' },
  { label: 'دخول النظام', to: '/auth' },
];

const PLATFORMS = [
  { icon: FaInstagram, name: 'إنستغرام', bg: '#FF3BFF', to: '/products#platform-instagram' },
  { icon: FaFacebookF, name: 'فيسبوك', bg: '#407BFF', to: '/products#platform-facebook' },
  { icon: FaTiktok, name: 'تيك توك', bg: '#111111', to: '/products#platform-tiktok' },
];

const CONTACTS = [
  { icon: FaPhone, label: 'رقم الهاتف', value: '0785151865', href: 'tel:962785151865' },
  { icon: FaTelegramPlane, label: 'تيلغرام', value: '@BaarqStore', href: 'https://t.me/BaarqStore' },
  { icon: Mail, label: 'البريد الإلكتروني', value: 'support@barqstore.org', href: 'mailto:support@barqstore.org' },
  { icon: Clock, label: 'الدعم الفني', value: 'متاح 24/7 على مدار الأسبوع', href: '/contact' },
];

const SOCIALS = [
  { icon: FaTelegramPlane, href: 'https://t.me/BaarqStore', label: 'تيلغرام' },
];

export default function Footer() {
  const footerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      '.footer-cta',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.footer-cta', start: 'top 90%', toggleActions: 'play none none none' } }
    );

    gsap.utils.toArray('.footer-col').forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' } }
      );
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="relative bg-white text-black overflow-hidden border-t-2 border-black" dir="rtl">
      {/* علامة مائية ضخمة خلفية */}
      <span data-parallax="0.6" className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[22vw] font-black uppercase leading-none select-none pointer-events-none text-black/[0.035] whitespace-nowrap" aria-hidden="true">
        BARQ
      </span>

      <div className="relative max-w-7xl mx-auto px-6 pt-20 md:pt-28 pb-10">
        {/* ===== دعوة ختامية كبيرة ===== */}
        <div className="footer-cta relative bg-white border-2 border-black shadow-[10px_10px_0px_#000] p-8 md:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 overflow-hidden">
          <span className="absolute -top-8 -left-8 w-40 h-40 rounded-full opacity-15" style={{ background: '#407BFF' }}></span>
          <span className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full opacity-10" style={{ background: '#FF3BFF' }}></span>

          <div className="relative z-10">
            <p className="font-mono text-[10px] font-bold tracking-[0.3em] text-neutral-400 mb-3" dir="ltr">
              // READY_TO_GROW
            </p>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05]">
              جاهز تبدأ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] via-[#FF3BFF] to-[#e4f542]">رحلتك</span> معنا؟
            </h3>
            <p className="text-neutral-500 font-medium mt-4 text-sm md:text-base max-w-md leading-relaxed">
              اختر الباقة المناسبة لهدفك اليوم، وفريقنا يهيّئ كل شيء لانطلاقة فورية.
            </p>
          </div>

          <Link to="/products" className="relative z-10 shrink-0 inline-flex items-center gap-3 bg-black text-white font-black text-sm uppercase tracking-widest px-9 py-5 border-2 border-black shadow-[6px_6px_0px_#e4f542] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[4px_4px_0px_#e4f542] transition-all duration-200">
            <ArrowUpRight className="w-5 h-5" />
            ابدأ طلبك الآن
          </Link>
        </div>

        {/* ===== الأعمدة الرئيسية ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pt-16 md:pt-20">
          {/* العلامة */}
          <div className="footer-col">
            <Link to="/" className="flex items-center gap-3 select-none group" dir="ltr">
              <div className="w-11 h-11 bg-black text-white border-2 border-black flex items-center justify-center group-hover:bg-[#407BFF] transition-colors">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase">
                BARQ<span className="text-[#407BFF]"> STORE</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-500 font-medium leading-relaxed mt-6">
              منصة هندسية متكاملة لتعزيز حضورك على منصات التواصل الاجتماعي بسرعة البرق وتأثير
              يليق بعلامتك.
            </p>
            <div className="flex items-center gap-3 mt-7">
              {SOCIALS.map((s, i) => {
                const Icon = s.icon;
                const inner = (
                  <>
                    <span className="absolute inset-0 border-2 border-black"></span>
                    <Icon className="w-4 h-4 relative" />
                  </>
                );
                const cls = 'relative w-11 h-11 bg-white flex items-center justify-center hover:bg-black hover:text-white hover:-translate-y-1 transition-all duration-200';
                return s.href.startsWith('/') ? (
                  <Link key={i} to={s.href} aria-label={s.label} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className={cls}>
                    {inner}
                  </a>
                );
              })}
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="footer-col">
            <h4 className="text-xs font-black uppercase tracking-[0.35em] text-neutral-400 mb-6">روابط سريعة</h4>
            <ul className="space-y-3.5">
              {NAV_LINKS.map((l, i) => (
                <li key={i}>
                  <Link to={l.to} className="group flex items-center gap-2.5 text-base font-bold text-neutral-700 hover:text-black transition-colors">
                    <span className="w-2 h-2 bg-black group-hover:bg-[#e4f542] transition-colors"></span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* المنصات */}
          <div className="footer-col">
            <h4 className="text-xs font-black uppercase tracking-[0.35em] text-neutral-400 mb-6">منصاتنا</h4>
            <ul className="space-y-3.5">
              {PLATFORMS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <li key={i}>
                    <Link to={p.to} className="group flex items-center gap-3 text-base font-bold text-neutral-700 hover:text-black transition-colors">
                      <span className="w-9 h-9 rounded-lg border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_#000]" style={{ background: p.bg }}>
                        <Icon className="w-4 h-4" />
                      </span>
                      {p.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* بيانات التواصل */}
          <div className="footer-col">
            <h4 className="text-xs font-black uppercase tracking-[0.35em] text-neutral-400 mb-6">تواصل معنا</h4>
            <ul className="space-y-4">
              {CONTACTS.map((c, i) => {
                const Icon = c.icon;
                const inner = (
                  <>
                    <span className="w-10 h-10 border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span>
                      <span className="block text-[11px] font-bold text-neutral-400">{c.label}</span>
                      <span className="block text-sm font-black" dir="ltr">{c.value}</span>
                    </span>
                  </>
                );
                const cls = 'group flex items-center gap-3';
                return (
                  <li key={i}>
                    {c.href.startsWith('/') ? (
                      <Link to={c.href} className={cls}>{inner}</Link>
                    ) : (
                      <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={cls}>{inner}</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ===== الشريط السفلي ===== */}
        <div className="mt-16 pt-8 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-xs font-black text-neutral-500">
            © 2026 متجر برق — جميع الحقوق محفوظة
          </p>
          <p className="text-xs font-bold text-neutral-400" dir="ltr">
            barqstore.org
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-black font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            أعلى الصفحة
          </button>
        </div>
      </div>
    </footer>
  );
}