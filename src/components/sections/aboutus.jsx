import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Repeat,
  Users,
  Eye,
  Heart,
  Package,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WORDS = ['نبيعُ', 'حضورك', 'الرقمي', 'بضغطة'];

const STATS = [
  { n: 50, suffix: 'M+', label: 'مشاهدة منفذة', color: '#407BFF' },
  { n: 2, suffix: 'M+', label: 'متابع مُسلَّم', color: '#FF3BFF' },
  { n: 1500, suffix: '+', label: 'اشتراك مفعّل', color: '#e4f542' },
  { n: 98, suffix: '%', label: 'نسبة رضا', color: '#000000' },
];

const MARQUEE = ['متابعون مضمونون', 'مشاهدات ريلز', 'لايكات وتفاعل', 'اشتراكات نمو شهرية', 'ضمان 30 يوم', 'تفعيل فوري', 'دعم بالعربي 24/7'];

const CARDS = [
  {
    icon: Users,
    title: 'متابعون مضمونون',
    desc: 'متابعون حقيقيون بتسليم تدريجي آمن، وضمان تعويض كامل لمدة 30 يومًا.',
    color: '#FF3BFF',
    status: 'ضمان 30 يوم',
    chips: [
      { q: '1,000', p: '2.99' },
      { q: '10,000', p: '24.99' },
    ],
  },
  {
    icon: Eye,
    title: 'مشاهدات ريلز',
    desc: 'دفعة قوية لريلزك على إنستغرام وفيسبوك وتيك توك لتشتعل الفيديوهات.',
    color: '#8b5cf6',
    status: 'تفعيل فوري',
    chips: [
      { q: '10K', p: '9.99' },
      { q: '50K', p: '34.99' },
    ],
  },
  {
    icon: Heart,
    title: 'لايكات وتفاعل',
    desc: 'رفع تفاعل البوستات والريلز، وبناء رصيد مجتمع يثق بعلامتك ويشتري منها.',
    color: '#f97316',
    status: 'فوري',
    chips: [
      { q: '1,000', p: '1.49' },
      { q: '20,000', p: '17.99' },
    ],
  },
  {
    icon: Package,
    title: 'باقات مخصصة',
    desc: 'صفقات تُبنى حسب منشتك وسوقك وميزانيتك — نتكلم مباشرة ونصمم لك الخطة.',
    color: '#0ea5e9',
    status: 'اطلب عرضك',
    chips: [
      { q: 'حسب الطلب', p: 'اسألنا' },
    ],
  },
  {
    icon: Zap,
    title: 'تفعيل البرق',
    desc: 'تسليم آلي يبدأ خلال دقائق بعد إتمام الطلب، وتتبع طلبك لحظة بلحظة.',
    color: '#000000',
    status: 'فوري',
    chips: [
      { q: '24/7', p: 'متاح الآن' },
    ],
  },
];

const FLOATERS = [
  { kind: 'cube', color: '#407BFF', size: 46, speed: '16s', pos: 'top-[16%] right-[10%]', drift: 'drift-a', hide: true },
  { kind: 'orb', color: '#FF3BFF', size: 30, speed: '5s', pos: 'top-[20%] left-[9%]', drift: 'drift-b' },
  { kind: 'cube', color: '#e4f542', size: 32, speed: '12s', pos: 'bottom-[20%] right-[16%]', drift: 'drift-b' },
  { kind: 'orb', color: '#0ea5e9', size: 22, speed: '7s', pos: 'bottom-[14%] left-[14%]', drift: 'drift-c' },
  { kind: 'cube', color: '#8b5cf6', size: 40, speed: '20s', pos: 'top-[60%] left-[3%]', drift: 'drift-a', hide: true },
  { kind: 'orb', color: '#f97316', size: 18, speed: '4.5s', pos: 'bottom-[30%] right-[4%]', drift: 'drift-c', hide: true },
];

function Cube3D({ size = 44, color = '#407BFF', speed = '14s' }) {
  const s = size / 2;
  const skin = (t) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    width: size,
    height: size,
    background: `${color}1c`,
    border: `1.5px solid ${color}`,
    boxShadow: `inset 0 0 14px ${color}44`,
    transform: t,
  });
  return (
    <span className="cube3d block" style={{ width: size, height: size, ['--cs']: speed }} aria-hidden="true">
      <span style={skin(`rotateY(0deg) translateZ(${s}px)`)} />
      <span style={skin(`rotateY(90deg) translateZ(${s}px)`)} />
      <span style={skin(`rotateY(180deg) translateZ(${s}px)`)} />
      <span style={skin(`rotateY(-90deg) translateZ(${s}px)`)} />
      <span style={skin(`rotateX(90deg) translateZ(${s}px)`)} />
      <span style={skin(`rotateX(-90deg) translateZ(${s}px)`)} />
    </span>
  );
}

function Orb({ size = 26, color = '#FF3BFF', speed = '6s' }) {
  return (
    <span
      className="orb3d block"
      style={{
        width: size,
        height: size,
        ['--os']: speed,
        background: `radial-gradient(circle at 32% 28%, #ffffff, ${color} 58%, ${color}2e)`,
        boxShadow: `0 0 20px ${color}59`,
      }}
      aria-hidden="true"
    />
  );
}

export default function AboutUs() {
  const containerRef = useRef(null);
  const introRef = useRef(null);

  const handleTiltMove = (e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${py * -7}deg) rotateY(${px * 7}deg) translateY(-5px)`;
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const handleTiltLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: introRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      '.about-word',
      { clipPath: 'inset(0 0 100% 0)', y: 40 },
      { clipPath: 'inset(0 0 0% 0)', y: 0, stagger: 0.14, duration: 0.7, ease: 'power4.out' }
    )
      .fromTo(
        '.about-statement',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        '.about-stats',
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.45'
      )
      .fromTo(
        '.about-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );

    gsap.utils.toArray('.stat-count').forEach((el) => {
      const target = Number(el.dataset.count || 0);
      const trigger = el.closest('.about-stats');
      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 1.6,
          ease: 'power1.out',
          snap: { innerText: 1 },
          scrollTrigger: { trigger, start: 'top 78%', toggleActions: 'play none none none' },
        }
      );
    });

    gsap.utils.toArray('.bento-outer').forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 90, rotate: (i % 2 ? 0.6 : -0.6) },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 0.9,
          delay: (i % 2) * 0.1,
          ease: 'back.out(1.3)',
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
        }
      );
    });

    gsap.utils.toArray('.bento-card-inner').forEach((el, i) => {
      gsap.fromTo(
        el,
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.15 + (i % 2) * 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: el.closest('.bento-outer'), start: 'top 80%', toggleActions: 'play none none none' },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section id="about" ref={containerRef} className="relative bg-white text-black overflow-hidden" dir="rtl">
      <div className="absolute inset-0 pointer-events-none" data-parallax="0.3">
        <div className="absolute inset-0 blueprint-grid"></div>
      </div>
      <div className="absolute inset-0 pointer-events-none" data-parallax="-0.2">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46rem] h-[46rem] rounded-full border-2 border-dashed border-black/[0.07] orbit-spin" style={{ ['--r']: '60s' }}></span>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full border border-black/[0.06] orbit-spin-rev" style={{ ['--r']: '80s' }}></span>
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 orbit-spin overflow-visible"
          viewBox="0 0 384 384"
          style={{ ['--r']: '18s' }}
          aria-hidden="true"
        >
          <circle
            cx="192"
            cy="192"
            r="176"
            fill="none"
            stroke="#407BFF"
            strokeOpacity="0.14"
            strokeWidth="16"
            strokeDasharray="90 30"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ perspective: '1000px' }} data-parallax="0.55">
        {FLOATERS.map((f, i) => (
          <span key={i} className={`absolute ${f.pos} ${f.drift} ${f.hide ? 'hidden md:block' : ''}`}>
            {f.kind === 'cube' ? <Cube3D size={f.size} color={f.color} speed={f.speed} /> : <Orb size={f.size} color={f.color} speed={f.speed} />}
          </span>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" data-parallax="0.4">
        <div
          className="blob-breath absolute -top-24 right-[-10%] w-[20rem] md:w-[36rem] h-[20rem] md:h-[36rem] bg-[#407BFF]/8 rounded-full reduce-blur"
          style={{ ['--bx']: '6vw', ['--by']: '-30px', ['--bs']: '1.12', ['--bb']: '11s' }}
        ></div>
        <div
          className="blob-breath absolute bottom-[-20%] left-[-12%] w-[22rem] md:w-[38rem] h-[22rem] md:h-[38rem] bg-[#FF3BFF]/6 rounded-full reduce-blur"
          style={{ ['--bx']: '-6vw', ['--by']: '30px', ['--bs']: '0.9', ['--bb']: '13s' }}
        ></div>
        <div
          className="blob-breath absolute top-[45%] left-[35%] w-56 md:w-80 h-56 md:h-80 bg-[#e4f542]/10 rounded-full reduce-blur"
          style={{ ['--bx']: '3vw', ['--by']: '-22px', ['--bs']: '1.08', ['--bb']: '9s' }}
        ></div>
      </div>

      <div ref={introRef} className="relative min-h-screen w-full flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-6 w-full relative z-10 py-24 md:py-28">
          <div className="flex items-center gap-3 mb-7 md:mb-8">
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#e4f542] text-black text-xs font-black uppercase tracking-[0.35em] border-2 border-black shadow-[3px_3px_0px_#000]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>متجرنا الرقمي</span>
            </span>
            <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-neutral-400 border border-black/20 px-3 py-2" dir="ltr">
              BARQ_DIGITAL_STORE / ABOUT
            </span>
          </div>

          <h2 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.18] flex flex-wrap items-end gap-x-4 gap-y-3 pb-4">
            {WORDS.map((w, i) => (
              <span
                key={i}
                className={`about-word inline-block pb-[0.12em] leading-[1.2] ${
                  i === 1
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] via-[#FF3BFF] to-[#e4f542]'
                    : ''
                }`}
              >
                {w}
              </span>
            ))}
          </h2>

          <p className="about-statement text-neutral-600 text-base sm:text-lg font-medium leading-relaxed max-w-3xl mt-6 md:mt-8">
            متجر <span className="font-black">بَرْق</span> متخصص في بيع <span className="font-black">المنتجات الرقمية</span> و
            <span className="font-black">اشتراكات النمو</span> لأشهر المنصات: متابعون مضمونون، مشاهدات ريلز، لايكات وتفاعل —
            تُسلَّم خلال دقائق وتعمل فوراً على إنستغرام وفيسبوك وتيك توك.
          </p>

          <div className="about-stats grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10 md:mt-12 pt-8 border-t-2 border-black">
            {STATS.map((s, i) => (
              <div key={i} className="group relative">
                <span className="absolute -top-2 -right-2 w-3 h-3 border-t-2 border-r-2 border-black opacity-30 group-hover:opacity-100 transition-opacity"></span>
                <h4 className="text-4xl sm:text-5xl font-black tabular-nums" style={{ color: s.color }}>
                  <span className="stat-count" data-count={s.n}>0</span>
                  <span className="text-2xl">{s.suffix}</span>
                </h4>
                <p className="font-mono text-[11px] font-bold text-neutral-500 mt-2 tracking-widest" dir="ltr">
                  {s.label}
                </p>
                <span className="block h-[3px] w-0 group-hover:w-full transition-all duration-500 mt-3" style={{ background: s.color }}></span>
              </div>
            ))}
          </div>

          <div className="about-cta mt-8 md:mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-black text-white text-sm font-black uppercase tracking-wider px-7 py-4 border-2 border-black shadow-[5px_5px_0px_#000] hover:bg-[#e4f542] hover:text-black hover:shadow-[5px_5px_0px_#407BFF] transition-all duration-200"
            >
              <Zap className="w-4 h-4 fill-current" />
              تصفح كل المنتجات
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-[#e4f542]" />
              أسعار بالدينار الأردني · دفع آمن 
            </span>
          </div>
        </div>
      </div>

      <div className="relative border-y-4 border-black bg-[#111] py-5 overflow-hidden">
        <div dir="ltr" className="t-marquee flex w-max select-none">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex items-center pl-8">
              {MARQUEE.map((m, i) => {
                const bg = i % 3 === 0 ? '#FF3BFF' : i % 3 === 1 ? '#407BFF' : '#25F4EE';
                const fg = '#fff';
                return (
                  <Link
                    to="/products"
                    key={i}
                    className="flex items-center gap-2 mx-3 rounded-md text-sm sm:text-base font-black uppercase border-2 border-black shadow-[3px_3px_0px_#000] px-6 py-2 whitespace-nowrap hover:scale-105 transition-transform"
                    style={{ background: bg, color: fg }}
                  >
                    <Zap className={`w-3.5 h-3.5 ${i % 2 ? 'fill-current' : ''}`} />
                    {m}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pb-32 pt-24">
        <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] border-2 border-black shadow-[3px_3px_0px_#000]">
              <Package className="w-3 h-3" />
              كتالوج سريع
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mt-5">شو الي نبيعه ؟</h2>
            <p className="mt-3 text-neutral-500 font-medium max-w-xl">كلها منتجات رقمية جاهزة تُفعّل فوراً — اختر ما يناسبك من هنا أو تكلّم معنا مباشرة.</p>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest border-2 border-black px-5 py-3 hover:bg-black hover:text-white transition-all duration-200"
          >
            كل المنتجات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 relative">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className={`bento-outer lg:col-span-3 relative z-10`}>
                <div
                  onMouseMove={handleTiltMove}
                  onMouseLeave={handleTiltLeave}
                  {/* 🔥 تم إزالة will-change-transform من السطر التالي لمنع تعليق الجوال */}
                  className="bento-card h-full group relative bg-white border-2 border-black p-7 transition-all duration-300 ease-out shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#000] overflow-hidden"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), ${c.color}22, transparent 70%)` }}
                  ></div>

                  <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-black"></span>
                  <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-black"></span>
                  <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-black"></span>
                  <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-black"></span>

                  <div className="bento-card-inner relative z-10">
                    <div className="flex items-start justify-between">
                      <div
                        className="w-14 h-14 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] transition-all duration-300 group-hover:rotate-[360deg] group-hover:bg-black group-hover:text-white"
                        style={{ background: `${c.color}14`, color: c.color }}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="text-left" dir="ltr">
                        <p className="font-mono text-[10px] font-bold tracking-[0.3em] text-neutral-400">SKU</p>
                        <p className="font-mono text-xs font-black text-neutral-600">BRQ-0{0 + i + 1}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-6">
                      <h4 className="text-xl font-black">{c.title}</h4>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border-2 border-black text-[9px] font-black uppercase tracking-widest" style={{ background: c.color, color: '#fff' }}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 font-medium leading-relaxed mt-2">{c.desc}</p>

                    <div className="mt-5 grid gap-2.5" style={{ gridTemplateColumns: `repeat(${Math.min(c.chips.length, 2)}, 1fr)` }}>
                      {c.chips.slice(0, 2).map((ch, j) => (
                        <div key={j} className="flex items-center justify-between border-2 border-black/10 bg-neutral-50 px-3 py-2.5 group-hover:border-black transition-colors">
                          <span className="text-xs font-black" dir="ltr">{ch.q}</span>
                          <span className="text-[10px] font-black text-neutral-500" dir="ltr">{ch.p} JOD</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t-2 border-black/10 flex items-center justify-between">
                      <Link
                        to="/products"
                        className="group/link inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest hover:gap-2.5 transition-all"
                        style={{ color: c.color }}
                      >
                        تصفح الباقة
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </Link>
                      <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-neutral-500" dir="ltr">
                        <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: c.color }}></span>
                        {c.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}