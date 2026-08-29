import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowDown, Zap, ShieldCheck, ShoppingCart, Check } from 'lucide-react';

import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import Seo from '../components/Seo';
import { PLATFORMS, cartItem, linkGuide } from '../data/products';
import { useCart } from '../context/useCart';

gsap.registerPlugin(ScrollTrigger);

function AddToCartButton({ p, g, item }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(false);
  const [link, setLink] = useState('');
  const [err, setErr] = useState('');
  const guide = linkGuide(g);

  const confirm = () => {
    const v = link.trim();
    if (!v) {
      setErr(`الرجاء إدخال ${guide.label}`);
      return;
    }
    add(cartItem(p, g, item, v));
    setShow(false);
    setLink('');
    setErr('');
    setDone(true);
    setTimeout(() => setDone(false), 1400);
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setShow(true);
        }}
        aria-label={done ? 'أُضيف إلى السلة' : 'أضِف إلى السلة'}
        className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-3 rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-200 ${
          done
            ? 'bg-[#e4f542] hover:bg-[#d6e72c]'
            : 'bg-white hover:bg-[#407BFF] hover:text-white'
        }`}
      >
        {done ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
        {done ? 'أُضيف' : 'أضِف للسلة'}
      </button>

      {show && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShow(false)}
        >
          <div
            className="w-full max-w-md bg-white border-2 border-black shadow-[10px_10px_0px_#000] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-black tracking-tighter">إلى أين تريد التوجيه؟</h3>
            <p className="mt-1 text-sm font-bold text-neutral-500">
              {item.qty} {g.cat} — {p.name}
              {g.sub ? ` (${g.sub})` : ''}
            </p>
            <label className="mt-4 block text-[11px] font-black uppercase tracking-widest text-neutral-500">{guide.label}</label>
            <input
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                setErr('');
              }}
              dir="ltr"
              autoFocus
              placeholder={guide.placeholder}
              className="mt-1 w-full bg-white border-2 border-black px-4 py-3.5 text-sm font-bold outline-none focus:shadow-[4px_4px_0px_#000]"
            />
            <p className="mt-2 text-[11px] font-bold text-neutral-500 leading-relaxed">{guide.hint}</p>
            {err && <p className="mt-2 text-xs font-black text-red-600">{err}</p>}
            <div className="mt-5 flex gap-3">
              <button
                onClick={confirm}
                className="flex-1 bg-black text-white text-sm font-black uppercase tracking-widest py-3 border-2 border-black hover:bg-[#407BFF] transition-colors"
              >
                إضافة للسلة
              </button>
              <button
                onClick={() => setShow(false)}
                className="px-5 bg-white text-black text-sm font-black uppercase tracking-widest py-3 border-2 border-black hover:bg-neutral-100 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function useDragScroll() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    const onDown = (e) => {
      isDown = true;
      startX = e.pageX;
      startScroll = el.scrollLeft;
    };
    const onMove = (e) => {
      if (!isDown) return;
      el.scrollLeft = startScroll - (e.pageX - startX);
    };
    const onUp = () => {
      isDown = false;
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointerleave', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointerleave', onUp);
    };
  }, []);
  return ref;
}

function TierRow({ p, g, gi }) {
  const scrollRef = useDragScroll();
  const Icon = p.Icon;
  return (
    <div className="relative">
      <div className="pto-sec-bar flex items-center gap-4 mb-7">
        <span className="pto-sec-bar-dot w-3 h-3 rotate-45" style={{ background: p.color }}></span>
        <h3 className="text-2xl md:text-3xl font-black tracking-tight">
          {g.cat}
          {g.sub ? <span className="text-neutral-500 text-lg md:text-xl font-bold"> — {g.sub}</span> : null}
        </h3>
        {g.badge ? (
          <span className="pto-badge inline-flex items-center gap-1.5 px-3 py-1 bg-[#e4f542] text-black text-[10px] font-black uppercase tracking-widest border-2 border-black rounded-full shadow-[2px_2px_0px_#000]">
            <ShieldCheck className="w-3 h-3" />
            {g.badge}
          </span>
        ) : null}
        <span className="flex-1 h-2 bg-black/10 -skew-x-12 overflow-hidden">
          <span className="pto-sec-bar-fill block h-full origin-left" style={{ background: `linear-gradient(90deg, ${p.color}, ${p.dark})`, transform: 'scaleX(0)' }}></span>
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-5 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory select-none cursor-grab active:cursor-grabbing [scrollbar-width:thin]"
        style={{ scrollPaddingInline: '6px' }}
      >
        {g.items.map((it, ii) => (
          <div
            key={ii}
            className="pto-card relative group shrink-0 w-[260px] sm:w-[280px] snap-start bg-white border-2 border-black rounded-xl p-5 shadow-[5px_5px_0px_#000] overflow-hidden hover:-translate-y-1.5 hover:-translate-x-1.5 hover:shadow-[9px_9px_0px_#000] hover:rotate-1 transition-all duration-200"
          >
            <span className="absolute top-0 right-0 w-12 h-1.5" style={{ background: `linear-gradient(90deg, ${p.color}, ${p.dark})` }}></span>
            <span className="absolute -top-5 -left-5 w-14 h-14 rounded-full opacity-10" style={{ background: p.color }}></span>

            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-mono font-black tracking-[0.3em] uppercase text-neutral-400" dir="ltr">
                  {p.en}/0{gi + 1}.{ii + 1}
                </p>
                <p className="mt-3 text-4xl md:text-5xl font-black tabular-nums tracking-tight" dir="ltr" style={{ color: p.dark }}>
                  {it.qty}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_#000] transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${p.color}, ${p.dark})` }}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t-2 border-black/10 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-neutral-500 truncate">{g.cat} · {p.name}</p>
                <p className="mt-1 text-2xl md:text-3xl font-black tabular-nums" dir="ltr">
                  <span style={{ color: p.dark }}>{it.price}</span>
                  <span className="text-[10px] font-black text-neutral-500 ml-1">JOD</span>
                </p>
              </div>
              <AddToCartButton p={p} g={g} item={it} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Products() {
  const mainRef = useRef(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    gsap.fromTo(
      '.pto-hero-line',
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 1, stagger: 0.13, ease: 'power4.out' }
    );
    gsap.from('.pto-hero-meta', { y: 30, opacity: 0, stagger: 0.1, delay: 0.4, duration: 0.8, ease: 'power3.out' });

    // كلمة المنصة العملاقة: دخول جانبي + parallax (parallax للديسكتوب فقط)
    const desktop = window.matchMedia('(min-width: 1024px)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.utils.toArray('.pto-word').forEach((el) => {
      gsap.from(el, {
        xPercent: 14,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
      if (!desktop || reduce) return;
      gsap.fromTo(
        el,
        { y: -40 },
        {
          y: 40,
          ease: 'none',
          force3D: true,
          scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        }
      );
    });

    // ===== إخفاء أولي فوري قبل أول رسم (منع وميض: لا تظهر ثم تختفي ثم تعود) =====
    // على الجوال: دخول أخف (إزاحة صغيرة + شفافية) بلا clipPath لرفع الأداء
    const mobile = window.matchMedia('(max-width: 767px)').matches;

    if (mobile) {
      gsap.set('.pto-card', { y: 30, opacity: 0, force3D: true });
      gsap.set('.pto-sec-head', { x: 24, opacity: 0, force3D: true });
    } else {
      gsap.set(
        '.pto-card',
        { clipPath: 'inset(0 0 100% 0)', y: 70, opacity: 0.4, rotation: (i) => (i % 2 ? -4 : 4), force3D: true }
      );
      gsap.set('.pto-sec-head', { x: 70, opacity: 0, rotate: 1, force3D: true });
    }
    gsap.set('.pto-sec-bar h3', { y: 26, opacity: 0 });
    gsap.set('.pto-sec-bar-dot', { scale: 0, rotate: 90 });
    gsap.set('.pto-badge', { scale: 0 });

    // الكروت: تظهر عند الوصول لها بالسكرول فقط — مرة واحدة (لا تختفي ثانية أبداً)
    ScrollTrigger.batch('.pto-card', {
      start: 'top 94%',
      once: true,
      onEnter: (els) =>
        mobile
          ? gsap.to(els, {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.06,
              ease: 'power2.out',
              force3D: true,
              overwrite: true,
            })
          : gsap.to(els, {
              clipPath: 'inset(0 0 0% 0)',
              y: 0,
              opacity: 1,
              rotation: 0,
              duration: 0.8,
              stagger: 0.09,
              ease: 'power4.out',
              force3D: true,
              overwrite: true,
            }),
    });

    // رؤوس الأقسام (الشعار + الاسم + الدائرة): دخول جانبي متدرج — عند الوصول لها
    ScrollTrigger.batch('.pto-sec-head', {
      start: 'top 80%',
      once: true,
      onEnter: (els) =>
        gsap.to(els, {
          x: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          force3D: true,
          overwrite: true,
        }),
    });

    // أشرطة القسم: مقياس من نص الكلمة + نزول العنوان
    gsap.utils.toArray('.pto-sec-bar').forEach((bar) => {
      gsap
        .timeline({
          scrollTrigger: { trigger: bar, start: 'top 92%', toggleActions: 'play none none none' },
        })
        .fromTo(bar.querySelector('.pto-sec-bar-fill'), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.inOut' })
        .fromTo(
          bar.querySelector('h3'),
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
          '-=0.9'
        )
        .fromTo(
          bar.querySelector('.pto-sec-bar-dot'),
          { scale: 0, rotate: 90 },
          { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(2)' },
          '-=0.4'
        );
      const badge = bar.querySelector('.pto-badge');
      if (badge) gsap.fromTo(badge, { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(2)', delay: 0.45 });
    });

    // مؤشر المنصة النشطة
    PLATFORMS.forEach((p, i) => {
      ScrollTrigger.create({
        trigger: `#platform-${p.id}`,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => setActive(i),
        onEnterBack: () => setActive(i),
      });
    });

    // شريط تقدّم القراءة أعلى الصفحة
    gsap.fromTo(
      '.pto-progress',
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
      }
    );
  }, { scope: mainRef });

  const jump = (i) => {
    setActive(i);
    document.getElementById(`platform-${PLATFORMS[i].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main
      ref={mainRef}
      dir="rtl"
      className="relative w-full min-h-screen overflow-x-hidden bg-white text-black selection:bg-[#e4f542]"
    >
      <Navbar />
      <Seo
        title="المنتجات | متجر برق — متابعون ومشاهدات ولايكات لكل المنصات"
        description="تصفح باقات متجر برق: متابعون مضمونون، مشاهدات ريلز، لايكات وتفاعل لإنستغرام وفيسبوك وتيك توك — أسعار بالدينار الأردني."
        path="/products"
      />

      {/* شريط تقدم القراءة */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-[120] bg-black/10" dir="ltr">
        <div className="pto-progress h-full origin-left bg-gradient-to-r from-[#407BFF] via-[#FF3BFF] to-[#e4f542]" style={{ transform: 'scaleX(0)' }}></div>
      </div>

      {/* مؤشر المنصات الثابت */}
      <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-[110] hidden xl:flex flex-col items-center gap-3" dir="ltr">
        {PLATFORMS.map((p, i) => {
          const Icon = p.Icon;
          return (
            <button
              key={p.id}
              onClick={() => jump(i)}
              aria-label={p.name}
              className={`w-11 h-11 rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] transition-all duration-300 ${
                active === i ? 'scale-125 -translate-x-1' : 'bg-white text-black'
              }`}
              style={active === i ? { background: p.color, color: p.dark } : undefined}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
        <span className="w-px h-10 bg-black/20"></span>
        <Zap className="w-4 h-4 text-[#e4f542]" />
      </aside>

      {/* ============ HERO ============ */}
      <section className="relative bg-white overflow-hidden pt-28 md:pt-36 pb-10">
        <div className="absolute inset-0 dot-grid opacity-40" aria-hidden="true"></div>
        <div className="absolute inset-0 grid place-items-center pointer-events-none" aria-hidden="true">
          <div className="w-[min(70vw,480px)] aspect-square rounded-full border-[4px] border-black/5" style={{ background: 'radial-gradient(circle, #e4f54222, transparent 65%)' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="pto-hero-meta inline-flex items-center gap-2 bg-[#e4f542] text-black px-5 py-2 text-xs font-black uppercase tracking-[0.35em] border-2 border-black shadow-[3px_3px_0px_#000]">
            <Zap className="w-3.5 h-3.5 fill-current" />
            PRODUCTS — المنتجات
          </span>

          <h1 className="mt-10 leading-[1.05] tracking-tighter text-[20vw] sm:text-[9rem] md:text-[11rem] font-black">
            <span className="pto-hero-line block">بَحْر</span>
            <span className="pto-hero-line block text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] via-[#FF3BFF] to-[#e4f542]">
              المنتجات
            </span>
          </h1>

          <p className="pto-hero-meta mt-10 text-base md:text-lg text-neutral-600 font-medium max-w-xl mx-auto leading-relaxed">
            مشاهدات · لايكات · متابعون لكل منصات التواصل — مع ضمان 30 يوم أو تسليم مباشر،
            بتفعيل فوري وسعرٍ يناسبك.
          </p>

          <div className="pto-hero-meta mt-10 flex flex-col items-center gap-3 text-neutral-500">
            <ArrowDown className="w-6 h-6 animate-bounce text-[#FF3BFF]" />
            <span className="text-[10px] font-mono font-black tracking-[0.35em] uppercase">Scroll — اختر منصتك</span>
          </div>
        </div>
      </section>

      {/* شريط المنصات السريع */}
      <div className="relative border-y-4 border-black bg-[#111] py-5 overflow-hidden">
        <div dir="ltr" className="t-marquee flex w-max select-none">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex items-center pl-8">
              {PLATFORMS.map((p, i) => {
                const bg = i === 0 ? '#FF3BFF' : i === 1 ? '#407BFF' : '#25F4EE';
                return (
                  <span
                    key={i}
                    className="flex items-center gap-3 mx-3 rounded-lg text-lg sm:text-xl font-black uppercase border-2 border-black shadow-[3px_3px_0px_#000] px-8 py-2.5 whitespace-nowrap cursor-pointer hover:scale-105 transition-transform"
                    style={{ background: bg, color: i === 2 ? '#010101' : '#fff' }}
                    onClick={() => jump(i)}
                  >
                    {p.en}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ============ أقسام المنصات ============ */}
      {PLATFORMS.map((p) => {
        const Icon = p.Icon;
        return (
          <section key={p.id} id={`platform-${p.id}`} className="relative overflow-hidden border-t-4 border-black" style={{ background: p.bg }}>
            {/* الكلمة العملاقة في الخلف */}
            <span
              className="pto-word absolute -top-6 left-0 whitespace-nowrap leading-none font-black tracking-tighter select-none pointer-events-none"
              style={{ color: `${p.color}22`, fontSize: 'min(26vw, 340px)' }}
              dir="ltr"
              aria-hidden="true"
            >
              {p.en}
            </span>

            <div className="relative max-w-7xl mx-auto px-6 md:px-8 pt-24 pb-20">
              {/* رأس المنصة */}
              <div className="pto-sec-head flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <span className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] border-2 border-black shadow-[3px_3px_0px_#000]" style={{ background: p.color, color: p.dark }}>
                    <Icon className="w-4 h-4" />
                    {p.tagline}
                  </span>
                  <h2 className="mt-6 text-6xl md:text-8xl font-black tracking-tighter leading-none" style={{ color: p.dark }}>
                    {p.name}
                  </h2>
                </div>
                <div className="orbit-spin w-20 h-20 md:w-28 md:h-28 rounded-full border-[3px] border-black flex items-center justify-center shadow-[6px_6px_0px_#000]" style={{ ['--r']: '14s', background: p.color }}>
                  <Icon className="w-9 h-9 md:w-12 md:h-12" style={{ color: p.dark }} />
                </div>
              </div>

              {/* الأقسام الفرعية */}
              <div className="mt-14 space-y-14">
                {p.groups.map((g, gi) => (
                  <TierRow key={gi} p={p} g={g} gi={gi} />
                ))}
              </div>

              <p className="mt-14 text-center text-[10px] font-mono font-black tracking-[0.4em] uppercase text-neutral-400" dir="ltr">
                {p.en} — {p.groups.reduce((n, g) => n + g.items.length, 0)}_TIERS · FIRE_ON
              </p>
            </div>
          </section>
        );
      })}

      <Footer />
    </main>
  );
}