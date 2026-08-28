import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import Seo from '../components/Seo';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: '10M+', label: 'مشاهدة منفذة', desc: 'VIEWS — خلف كل رقم قصة', color: '#407BFF' },
  { value: '99.9%', label: 'أوبتايم الخدمة', desc: 'UPTIME — منصة لا تتوقف', color: '#e4f542' },
  { value: '0.3s', label: 'زمن الاستجابة', desc: 'RESPONSE — تفعيل فوري', color: '#FF3BFF' },
  { value: '8000+', label: 'طلب في الثانية', desc: 'THROUGHPUT — جاهز للنمو', color: '#0ea5e9' },
];

const SERVICES = ['مشاهدات', 'لايكات', 'متابعون', 'منتجات رقمية', 'تفعيل فوري', 'ضمان وأمان'];
const CHIP_BG = ['#407BFF', '#e4f542', '#FF3BFF', '#111111', '#0ea5e9', '#8b5cf6'];

export default function About() {
  const mainRef = useRef(null);
  const [active, setActive] = useState(-1);

  useGSAP(() => {
    gsap.fromTo(
      '.about-hero-line',
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 1.2, stagger: 0.15, ease: 'power4.out' }
    );
    gsap.from('.about-hero-meta', {
      y: 24,
      opacity: 0,
      stagger: 0.12,
      delay: 0.45,
      duration: 0.9,
      ease: 'power3.out',
    });

    gsap.utils.toArray('.about-row').forEach((el, i) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        },
      });
    });
  }, { scope: mainRef });

  useEffect(() => {
    if (active < 0) return;
    gsap.fromTo('.about-portrait-img', { scale: 0.96 }, { scale: 1, duration: 0.45, ease: 'power3.out' });
    gsap.fromTo('.about-portrait-num', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
  }, [active]);

  return (
    <main
      ref={mainRef}
      dir="rtl"
      className="relative w-full min-h-screen overflow-x-hidden bg-white text-black font-sans selection:bg-[#e4f542]"
    >
      <Navbar />
      <Seo
        title="من نحن | متجر برق — نبيعُ حضورك الرقمي"
        description="برق متجر نموّ قنواتك على إنستغرام وفيسبوك وتيك توك — مشاهدات ولايكات ومتابعون بتفعيل فوري وأداء يليق باسمنا."
        path="/about"
      />

      {/* ============ HERO + لائحة تفاعلية ============ */}
      <section className="relative bg-white overflow-hidden pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="absolute inset-0 dot-grid opacity-40" aria-hidden="true"></div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <span className="about-hero-meta block font-mono text-[10px] font-black tracking-[0.4em] uppercase text-neutral-500" dir="ltr">
            // ABOUT_PAGE — متجر البرق
          </span>

          <div className="mt-10 lg:mt-14 grid lg:grid-cols-[1.15fr_1fr] gap-16 lg:gap-20 items-start">
            {/* العمود الثابت: العنوان + الصورة */}
            <div className="lg:sticky lg:top-28 self-start">
<h1 className="leading-[1.05] tracking-tighter">
                <span className="about-hero-line block text-[19vw] sm:text-[6.5rem] lg:text-[9rem] font-black text-black">
                  نَبيعُ
                </span>
                <span className="about-hero-line block text-[19vw] sm:text-[6.5rem] lg:text-[9rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] via-[#FF3BFF] to-[#e4f542] pr-3">
                  حضورك
                </span>
              </h1>

              <h2 className="about-hero-meta mt-10 text-xl md:text-2xl font-black leading-snug">
                الأسعار تتغيّر. أمّا النتيجة والحِرفة فلا.{' '}
                <span className="text-neutral-500 text-base md:text-lg font-bold">
                  Prices change. Delivery and craft don’t.
                </span>
              </h2>

              <p className="about-hero-meta mt-8 text-base md:text-lg leading-loose text-neutral-600 max-w-2xl font-medium">
                أهلاً، نحن «برق» — متجر نموّ قنواتك على منصات التواصل الاجتماعي. نبيع المشاهدات
                واللايكات والمتابعين، ونوزّع منتجاتنا الرقمية بتفعيلٍ فوري وأداءٍ يليق باسمنا:
                ضربةَ برق.
              </p>
              <p className="about-hero-meta mt-5 text-base md:text-lg leading-loose text-neutral-600 max-w-2xl font-medium">
                أسلوبنا بسيط: نجرّد التعقيد، ننفّذ بدقة، ونتابع كل طلب حتى يصل. المشاهدة ليست مجرد
                رقم — بل انطباعٌ يليق بعلامتك. ولأنّ الوصول يهمّ، نقدّم له حِرفة.
              </p>

              <div className="about-hero-meta h-[3px] bg-black my-10"></div>

              {/* صورة الشخصية مع الرقم التفاعلي */}
              <div className="about-hero-meta relative overflow-hidden border-[3px] border-black shadow-[10px_10px_0px_#000] bg-[#101314]">
                <img
                  src="/mann.png"
                  alt="شخصية برق"
                  loading="lazy"
                  decoding="async"
                  className="about-portrait-img w-full h-auto object-cover will-change-transform scale-105"
                  dir="ltr"
                />
                <span className="absolute top-4 left-4 font-mono text-[9px] font-black tracking-[0.35em] uppercase text-white bg-[#101314]/70 px-3 py-1 border border-white/20">
                  BRQ/01
                </span>
                <div className="absolute bottom-0 right-0 left-0 flex items-end justify-between gap-4 p-5 bg-gradient-to-t from-[#101314]/90 to-transparent" dir="ltr">
                  <span className="font-mono text-[9px] font-black tracking-[0.3em] uppercase text-white/60">
                    THE_FACE
                  </span>
                  <span
                    className="about-portrait-num text-5xl md:text-7xl font-black tabular-nums text-transparent bg-clip-text leading-none"
                    style={{ backgroundImage: 'linear-gradient(90deg,#407BFF,#FF3BFF,#e4f542)' }}
                    key={active}
                  >
                    {active >= 0 ? STATS[active].value : '00'}
                  </span>
                </div>
              </div>
            </div>

            {/* اللائحة التفاعلية */}
            <div className="relative">
              <span className="about-hero-meta block font-mono text-[10px] font-black tracking-[0.4em] uppercase text-neutral-500 mb-4" dir="ltr">
                ( الأرقام التي نحيا بها )
              </span>

              {STATS.map((s, i) => {
                const on = active === i;
                return (
                  <div
                    key={i}
                    className={`about-row relative py-8 md:py-10 border-b-2 border-black transition-colors duration-500 ${on ? 'text-black' : 'text-black/35'}`}
                  >
                    <span
                      className={`absolute inset-0 -z-10 origin-right scale-x-0 transition-transform duration-500 ${on ? 'scale-x-100' : ''}`}
                      style={{ background: `${s.color}22` }}
                    ></span>
                    <div className="flex items-end justify-between gap-6">
                      <div dir="ltr" className="text-left">
                        <span className={`text-5xl md:text-6xl font-black tabular-nums tracking-tight transition-colors duration-500 ${on ? '' : 'text-current'}`} style={on ? { color: s.color } : undefined}>
                          {s.value}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`block text-2xl md:text-3xl font-black transition-colors duration-500 ${on ? 'text-black' : 'text-current'}`}>
                          {s.label}
                        </span>
                        <span className="block mt-2 font-mono text-[10px] font-black tracking-[0.25em] uppercase text-current opacity-70">
                          {s.desc}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`mt-5 h-1 origin-right scale-x-0 transition-transform duration-500 ${on ? 'scale-x-100' : ''}`}
                      style={{ background: s.color }}
                    ></div>
                  </div>
                );
              })}

              <p className="pt-8 text-sm leading-relaxed text-neutral-600 font-medium">
                هذه الأرقام التي نحيا بها — مرّر لتشاهد شخصية برق تنبض وكل رقم يدخل قلب القصة.
              </p>
            </div>
          </div>
        </div>

        {/* شريط الخدمات المتحرك */}
        <div className="relative mt-16 border-y-4 border-black bg-[#111] py-5 overflow-hidden">
          <div dir="ltr" className="t-marquee flex w-max select-none">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex items-center pl-10">
                {SERVICES.map((sv, i) => {
                  const bg = CHIP_BG[i % CHIP_BG.length];
                  const fg = bg === '#e4f542' ? '#000' : '#fff';
                  return (
                    <span
                      key={i}
                      className="flex items-center gap-6 pl-10 text-lg sm:text-xl font-black border-2 border-black shadow-[3px_3px_0px_#000] rounded-lg px-8 py-2.5 whitespace-nowrap"
                      style={{ background: bg, color: fg }}
                    >
                      {sv}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ عبارة المنتجات الرقمية ============ */}
      <section className="relative bg-white overflow-hidden py-24 md:py-32">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#407BFF]/10" aria-hidden="true"></div>
        <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-[#FF3BFF]/10" aria-hidden="true"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 bg-[#e4f542] text-black text-xs font-black uppercase tracking-[0.35em] border-2 border-black shadow-[3px_3px_0px_#000] mb-8" dir="ltr">
            — ما نقدّمه —
          </span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.05]">
            مشاهداتٌ ولايكاتٌ
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] via-[#FF3BFF] to-[#e4f542] mt-3">
              ومنتجاتٌ رقمية جاهزة.
            </span>
          </h2>
          <p className="mt-10 mx-auto max-w-3xl text-base md:text-lg leading-loose text-neutral-600 font-medium">
            منصة سريعة تعمل على مدار الساعة، وكل طلب يمرّ بفحصٍ آلي وضمان تفعيل كامل. لأن النتيجة
            حين تصل بسرعة، وحين تليق بعلامتك — حينها فقط تستحق اسمَ برق.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}