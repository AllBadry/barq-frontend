import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaFacebookF } from 'react-icons/fa';
import { Sparkles, ShoppingCart, ArrowUpRight, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// 🔥 تم حذف ScrollTrigger.config لأنه مضاف في الملف الرئيسي Home.jsx

const C = {
  blue: '#407BFF',
  pink: '#FF3BFF',
  lime: '#e4f542',
};

const offerRows = [
  { t: 'متابعين مع ضمان كامل', note: 'ضمان 30 يوم', c: 1000, label: 'متابع', p: '2.99' },
  { t: 'متابعين مع ضمان كامل', note: 'الأكثر توفيراً', c: 5000, label: 'متابع', p: '14.99' },
  { t: 'مشاهدات ريلز فورية', note: 'انتشار سريع', c: 10000, label: 'مشاهدة', p: '9.99' },
];

const tiers = [
  { rank: 'L1', title: 'باقة الانطلاق', note: 'لبداية قوية وصحيحة', c: 1000, p: '4.99', star: false },
  { rank: 'L2', title: 'باقة النمو', note: 'الأكثر شعبية وتوازناً', c: 5000, p: '24.99', star: true },
  { rank: 'L3', title: 'باقة الهيمنة', note: 'للسيطرة الكاملة على الانتشار', c: 10000, p: '44.99', star: false },
];

const cluster = [
  { tag: 'الانطلاق', title: 'ألف متابع ذكي', c: 1000, p: '6.99', tilt: '-rotate-2', off: '' },
  { tag: 'الترند', title: 'خمسة آلاف اقتحام', c: 5000, p: '34.99', tilt: '', off: 'md:translate-y-8' },
  { tag: 'الانفجار', title: 'عشرة آلاف قوة', c: 10000, p: '59.99', tilt: 'md:rotate-1', off: 'md:translate-y-4' },
];

const floaters = [
  { cls: 'w-5 h-5 rounded-md bg-[#FF3BFF]/25 border-2 border-black rotate-12', pos: 'top-[12%] right-[6%]', dd: '6s', dr: '12deg', dr2: '-6deg' },
  { cls: 'w-4 h-4 rounded-full bg-[#407BFF]/30 border-2 border-black', pos: 'top-[36%] left-[4%]', dd: '7s', dr: '0deg', dr2: '0deg' },
  { cls: 'w-6 h-6 rounded-md bg-[#e4f542]/40 border-2 border-black -rotate-12', pos: 'bottom-[14%] right-[8%]', dd: '5.4s', dr: '-12deg', dr2: '10deg' },
  { cls: 'w-3.5 h-3.5 rounded-sm bg-black', pos: 'bottom-[24%] left-[8%]', dd: '4.8s', dr: '0deg', dr2: '20deg' },
];

export default function Categories() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const section = containerRef.current;
    if (!section) return;

    try {
      gsap.fromTo(
        section.querySelectorAll('.giant-word'),
        { opacity: 0, x: -60, rotate: -2 },
        {
          opacity: 1,
          x: 0,
          rotate: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section.querySelector('.section-head'),
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.utils.toArray('.insta-block').forEach((el) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        });
        tl.fromTo(
          el,
          { opacity: 0, y: 80 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
        )
        .fromTo(
          el.querySelector('.insta-billboard'),
          { opacity: 0, x: 90, rotate: 3, scale: 0.96 },
          { opacity: 1, x: 0, rotate: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
          '-=0.55'
        )
        .fromTo(
          el.querySelector('.insta-icon'),
          { scale: 0, rotate: -45 },
          { scale: 1, rotate: -6, duration: 0.8, ease: 'back.out(2)', delay: 0.05 },
          '-=0.65'
        )
        .fromTo(
          el.querySelectorAll('.insta-row'),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.55, ease: 'power3.out' },
          '-=0.55'
        );
      });

      gsap.utils.toArray('.tier-block').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 80 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } }
        );
        gsap.fromTo(
          el.querySelectorAll('.tier-row'),
          { opacity: 0, y: 60, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.16,
            duration: 0.7,
            ease: 'back.out(1.4)',
            scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
          }
        );
      });

      gsap.utils.toArray('.cluster-block').forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll('.cluster-card'),
          { opacity: 0, scale: 0.7, rotate: Math.random() > 0.5 ? 6 : -6 },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            stagger: 0.16,
            duration: 0.7,
            ease: 'back.out(1.7)',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      });

      gsap.utils.toArray('.offer-count').forEach((counter) => {
        const target = parseFloat(counter.dataset.count) || 0;
        const state = { v: 0 };
        gsap.to(state, {
          v: target,
          duration: 1.3,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = Math.round(state.v).toLocaleString('en-US');
          },
          scrollTrigger: {
            trigger: counter.closest('.mount-anim-block'),
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      });

      // 🔥 تم حذف window.addEventListener('load', ScrollTrigger.refresh) الذي يسبب تعليق وإعادة حساب للمقاسات

    } catch (err) {
      console.warn('Categories animation error:', err);
    }
  }, { scope: containerRef });

  return (
    <section
      id="offers"
      ref={containerRef}
      dir="rtl"
      className="relative w-full bg-white text-black overflow-x-hidden overflow-hidden"
    >
      <div data-parallax="0.4" className="section-head relative z-10 max-w-7xl mx-auto px-6 pt-28 md:pt-36 pb-6">
        <div className="inline-flex items-center gap-2 bg-[#e4f542] text-black px-6 py-3 rounded-full font-bold text-sm border-2 border-black shadow-[4px_4px_0px_#000]">
          <Sparkles className="w-4 h-4" />
          <span>الفئات المميزة</span>
        </div>
        <h2 className="sr-only">فئات باقات النمو لمنصات إنستغرام وفيسبوك وتيك توك</h2>

        <div className="mt-10 space-y-1 select-none">
          <div className="giant-word text-[14vw] sm:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase" style={{ color: C.pink }}>
            Instagram
          </div>
          <div className="giant-word text-[14vw] sm:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase text-right" style={{ color: C.blue }}>
            Facebook
          </div>
          <div className="giant-word text-[14vw] sm:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase" style={{ color: '#0f0f0f', WebkitTextStroke: `2px ${C.lime}`, textShadow: 'none' }}>
            Tiktok
          </div>
        </div>

        <p className="text-neutral-600 text-sm sm:text-base font-medium mt-8 max-w-xl leading-relaxed">
          ثلاث نوافذ مختلفة لعرض باقاتك.. كل منصة لها شخصية وأسلوب عرض خاص بها.
        </p>
      </div>

      <div className="absolute inset-0 pointer-events-none" data-parallax="0.5">
        {floaters.map((f, i) => (
          <span
            key={i}
            className={`drifty absolute ${f.pos} ${f.cls} pointer-events-none select-none`}
            style={{ ['--dd']: f.dd, ['--dr']: f.dr, ['--dr2']: f.dr2 }}
          ></span>
        ))}
      </div>

      {/* 🔥 تم مسح كلاس will-change-transform من الحاويات لمنع انهيار ذاكرة الموبايل VRAM */}
      <div className="insta-block mount-anim-block relative z-10 max-w-6xl mx-auto px-6 pt-20">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm font-black" style={{ color: C.pink }}>01</span>
          <span className="h-2 flex-1" style={{ background: `linear-gradient(90deg, ${C.pink}, transparent)` }}></span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Instagram</span>
          <span className="w-14 h-14 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-white -rotate-6 drifty" style={{ background: `linear-gradient(135deg, ${C.pink}, ${C.lime})` }}>
            <FaInstagram className="w-7 h-7" />
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-stretch">
          <div className="insta-billboard relative rounded-3xl border-2 border-black bg-white overflow-hidden shadow-[10px_10px_0px_#000] p-8 flex flex-col justify-between min-h-[420px]">
            <span className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20" style={{ background: C.pink }}></span>
            <span className="absolute top-8 right-8 text-[10rem] font-black leading-none text-black/[0.06] select-none">1</span>

            <div className="flex items-start justify-between relative z-10">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_#000]" style={{ background: C.pink, color: '#fff' }}>
                الأكثر طلباً
              </span>
              <Star className="w-5 h-5" style={{ color: C.pink }} fill={C.lime} />
            </div>

            <div className="relative z-10 flex items-center gap-6">
              <div className="insta-icon relative w-32 h-32 shrink-0 rounded-2xl border-2 border-black shadow-[7px_7px_0px_#000] flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.pink}, ${C.lime})`, transform: 'rotate(-8deg)' }}>
                <span className="absolute inset-1 rounded-[10px] border-[1.5px] border-white/60 pointer-events-none"></span>
                <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-[#e4f542] border-2 border-black flex items-center justify-center">
                  <Star className="w-3 h-3" fill="#000" />
                </span>
                <FaInstagram className="w-16 h-16 text-white drop-shadow-[2px_3px_0px_rgba(0,0,0,0.3)]" />
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Instagram</h3>
                <p className="text-sm text-neutral-600 font-medium mt-2 max-w-[240px]">
                  حضور علامتك يبدأ من هنا بمتابعين حقيقيين ومشاهدات مصممة للنمو.
                </p>
              </div>
            </div>

            <Link to="/products#platform-instagram" className="relative z-10 inline-flex items-center gap-2 w-full justify-center px-6 py-3.5 rounded-2xl text-white font-black text-sm uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] transition-all duration-200" style={{ background: C.pink }}>
              <ArrowUpRight className="w-4 h-4" />
              استعرض التشكيلة
            </Link>
          </div>

          <div className="insta-rows flex flex-col justify-center gap-4">
            {offerRows.map((of, idx) => (
              <div key={idx} className="insta-row group flex items-center gap-4 rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_#000] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] cursor-pointer">
                <span className="text-[10px] font-black tracking-widest w-7" style={{ color: C.pink }}>0{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-black">{of.t}</h4>
                    <span className="text-[11px] text-neutral-500 font-medium">{of.note}</span>
                  </div>
                  <p className="mt-1">
                    <span className="offer-count text-2xl font-black tabular-nums" data-count={of.c}>0</span>
                    <span className="text-xs font-bold text-neutral-500 mr-1.5">{of.label}</span>
                  </p>
                </div>
                <span className="text-lg font-black whitespace-nowrap">
                  {of.p}<span className="text-[10px] text-neutral-500 mr-1">JOD</span>
                </span>
                <span className="offer-cta w-9 h-9 rounded-xl flex items-center justify-center text-black border-2 border-black bg-white group-hover:rotate-45 shrink-0" style={{ ['--hover-bg']: C.pink }}>
                  <ShoppingCart className="w-4 h-4" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tier-block mount-anim-block relative z-10 max-w-5xl mx-auto px-6 pt-28">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-sm font-black" style={{ color: C.blue }}>02</span>
          <span className="h-2 flex-1" style={{ background: `linear-gradient(90deg, ${C.blue}, transparent)` }}></span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Facebook · ارتقِ بالمستوى</span>
          <span className="w-14 h-14 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-white rotate-6 drifty" style={{ background: C.blue }}>
            <FaFacebookF className="w-7 h-7" />
          </span>
        </div>

        <div className="flex justify-center -mt-4 mb-10">
          <div className="relative w-28 h-28 rounded-2xl bg-white border-[3px] border-black shadow-[8px_8px_0px_#000] flex items-center justify-center -rotate-3 drifty" style={{ ['--dd']: '7s' }}>
            <span className="absolute inset-2 rounded-xl" style={{ background: `linear-gradient(135deg, ${C.blue}, #0f2c66)` }}></span>
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#e4f542] border-2 border-black"></span>
            <span className="absolute -bottom-2 -left-2 w-5 h-5 bg-white border-2 border-black"></span>
            <FaFacebookF className="relative z-10 w-14 h-14 text-white drop-shadow-[2px_3px_0px_rgba(0,0,0,0.35)]" />
          </div>
        </div>

        <div className="relative">
          <FaFacebookF className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 text-[#407BFF] opacity-[0.05] -z-[1] pointer-events-none select-none" data-parallax="-0.35" />
          <div className="space-y-5">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className={`tier-row group relative rounded-3xl border-2 border-black p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                t.star ? 'bg-[#407BFF]/5 shadow-[8px_8px_0px_#000]' : 'bg-white shadow-[4px_4px_0px_#000]'
              }`}
            >
              {t.star && (
                <span className="absolute -top-4 right-6 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_#000]" style={{ background: C.lime }}>
                  الأكثر شعبية
                </span>
              )}

              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex items-center gap-4 md:w-40 shrink-0">
                  <span className="w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center font-black text-sm" style={{ background: C.blue, color: '#fff' }}>
                    {t.rank}
                  </span>
                  <span className="font-black text-3xl tracking-tighter hidden md:block" style={{ color: idx === 2 ? C.blue : '#cbd5e1' }}>{idx + 1}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-black">{t.title}</h4>
                  <p className="text-xs text-neutral-500 font-medium">{t.note}</p>
                  <p className="mt-2">
                    <span className="offer-count text-3xl font-black tabular-nums" data-count={t.c}>0</span>
                    <span className="text-sm font-bold text-neutral-500 mr-1.5">متابع</span>
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                  <span className="text-2xl font-black">
                    {t.p}<span className="text-[10px] text-neutral-500 mr-1">JOD</span>
                  </span>
                  <span className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#e4f542] group-hover:text-black">
                    <ShoppingCart className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </div>
          ))}

          <Link to="/products#platform-facebook" className="mt-8 w-full md:w-auto mx-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white border-2 border-black shadow-[5px_5px_0px_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[3px_3px_0px_#000] transition-all duration-200" style={{ background: C.blue }}>
            <ArrowUpRight className="w-5 h-5" />
            تصفح فئة فيسبوك
          </Link>
          </div>
        </div>
      </div>
      <div className="cluster-block mount-anim-block relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-4">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-sm font-black" style={{ color: '#8a7a00' }}>03</span>
          <span className="h-2 flex-1" style={{ background: `linear-gradient(90deg, #d4c300, transparent)` }}></span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Tiktok · دفعة للترند</span>
          <span className="w-14 h-14 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-white -rotate-6 drifty" style={{ background: 'linear-gradient(135deg, #010101 40%, #25F4EE 100%)' }}>
            <FaTiktok className="w-7 h-7" />
          </span>
        </div>

        <FaTiktok className="absolute top-8 left-1/2 -translate-x-1/2 w-96 h-96 text-black opacity-[0.04] -z-[1] pointer-events-none select-none" data-parallax="-0.3" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-[1]">
          {cluster.map((cd, idx) => {
            const isMiddle = idx === 1;
            return (
              <div
                key={idx}
                className={`cluster-card group relative rounded-[2rem] border-2 border-black p-7 transition-all duration-300 hover:-translate-y-2 cursor-pointer ${cd.tilt} ${cd.off} ${
                  isMiddle ? 'bg-[#e4f542] shadow-[8px_8px_0px_#000] md:-translate-y-6' : 'bg-white shadow-[5px_5px_0px_#000]'
                }`}
              >
                <span className="absolute top-5 left-5 text-[5rem] font-black leading-none text-black/[0.06] select-none">{idx + 1}</span>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_#000]">
                  {cd.tag}
                </span>
                <div className="mt-6 flex items-center gap-3">
                  <span className="w-14 h-14 rounded-xl border-2 border-black flex items-center justify-center text-white shadow-[3px_3px_0px_#000] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" style={{ background: 'linear-gradient(135deg, #010101 40%, #25F4EE 100%)' }}>
                    <FaTiktok className="w-8 h-8" />
                  </span>
                  <h4 className="text-lg font-black leading-tight">{cd.title}</h4>
                </div>
                <p className="mt-5">
                  <span className={`offer-count text-4xl font-black tabular-nums ${isMiddle ? 'text-black' : ''}`} data-count={cd.c}>0</span>
                  <span className="text-sm font-bold text-neutral-500 mr-1.5">متابع</span>
                </p>
                <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center justify-between">
                  <span className="text-xl font-black">
                    {cd.p}<span className="text-[10px] text-neutral-500 mr-1">JOD</span>
                  </span>
                  <span className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#407BFF]">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-sm text-neutral-600 font-medium mt-12 max-w-lg mx-auto leading-relaxed">
          الكروت المائلة تمنحك إحساس الحركة.. والوسطى هي الأقوى اقتحاماً.
        </p>
        <Link to="/products#platform-tiktok" className="mt-8 w-full md:w-auto mx-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-black bg-[#e4f542] border-2 border-black shadow-[5px_5px_0px_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[3px_3px_0px_#000] transition-all duration-200">
          <ArrowUpRight className="w-5 h-5" />
          تصفح فئة تيك توك
        </Link>
      </div>

      {/* ===== ختام القسم ===== */}
      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
          جاهز <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] via-[#FF3BFF] to-[#e4f542]">للارتقاء؟</span>
        </h2>
        <Link to="/products" className="mt-8 inline-flex items-center gap-2.5 px-9 py-4 rounded-full font-black text-sm uppercase tracking-widest bg-[#e4f542] text-black border-2 border-black shadow-[5px_5px_0px_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[3px_3px_0px_#000] transition-all duration-200">
          <ArrowUpRight className="w-5 h-5" />
          ابدأ طلبك الآن
        </Link>
      </div>

    </section>
  );
}