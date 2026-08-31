import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Sparkles, Palette, Hexagon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// 🔥 الحل الأول والأهم: منع GSAP من إعادة حساب المقاسات عند ظهور/اختفاء شريط عنوان Safari
ScrollTrigger.config({ ignoreMobileResize: true });

export default function HeroSection() {
  const containerRef = useRef(null);
  const marquee1 = useRef(null);
  const marquee2 = useRef(null);
  const marquee3 = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.hero-text-part', {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.08,
      ease: 'power3.out',
    })
    .from('.hero-badge', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.5)',
    }, '-=0.6')
    .from('.main-character', {
      scale: 0.9,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
    }, '-=0.8');

    // 🔥 الحل الثاني: التعرف الدقيق على أجهزة اللمس (الآيفون والآيباد) 
    // لمنع تأثير Scrub الثقيل الذي يتعارض مع السحب الطبيعي بالإصبع
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (!isTouchDevice) {
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
        .to('.hero-text-layer', { y: 140, opacity: 0.3, ease: 'none', force3D: true }, 0)
        .to('.hero-marquee', { y: -120, ease: 'none', force3D: true }, 0)
        .to('.main-character', { y: 90, ease: 'none', force3D: true }, 0);
    }

    const setupMarquee = (ref, direction, duration) => {
      const track = ref.current;
      if (!track) return;

      const singleWidth = track.scrollWidth / 2;
      const tween = gsap.fromTo(
        track,
        { x: 0 },
        {
          x: direction === -1 ? `-=${singleWidth}` : `+=${singleWidth}`,
          duration,
          ease: 'none',
          force3D: true,
          repeat: -1,
          paused: true,
          modifiers: {
            x: gsap.utils.unitize((x) => parseFloat(x) % singleWidth),
          },
        }
      );

      if (typeof IntersectionObserver !== 'undefined') {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) tween.play();
              else tween.pause();
            });
          },
          { rootMargin: '100px 0px' }
        );
        io.observe(track);
      } else {
        tween.play();
      }
    };

    setupMarquee(marquee1, -1, 20);
    setupMarquee(marquee2, 1, 25);
    setupMarquee(marquee3, -1, 18);

  }, { scope: containerRef });

  return (
    <section id="home" ref={containerRef} className="relative w-full bg-white text-black overflow-hidden overflow-x-hidden font-sans pt-24 md:pt-32 pb-16">
      
      <div className="hero-text-layer max-w-7xl mx-auto px-6 relative z-30 flex flex-col items-center">
        <h1 
          dir="ltr" 
          className="flex items-center justify-center flex-wrap gap-1 sm:gap-2 md:gap-4 text-[12vw] sm:text-[10vw] md:text-[8.5rem] font-black tracking-tighter leading-none select-none uppercase"
        >
          BAR
          <span className="hero-text-part inline-block w-[10vw] h-[10vw] sm:w-[8vw] sm:h-[8vw] md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-black align-middle shadow-lg bg-slate-100">
            <img src="/mann.webp" alt="O" decoding="async" loading="lazy" className="w-full h-full object-cover object-top scale-125" />
          </span>
          <span className="hero-text-part">ST</span>
          <span className="hero-text-part inline-block w-[10vw] h-[10vw] sm:w-[8vw] sm:h-[8vw] md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-black align-middle shadow-lg bg-slate-100">
            <img src="/mann.webp" alt="O" decoding="async" loading="lazy" className="w-full h-full object-cover object-top scale-125" />
          </span>
          <span className="hero-text-part">RE</span>
        </h1>

        <div className="w-full flex flex-col md:flex-row items-center justify-between mt-4 md:mt-8 px-4 md:px-12 relative">
          <span className="hero-text-part text-2xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase" dir="ltr">
            BARQ STORE
          </span>
          <div className="hero-badge mt-6 md:mt-0 hidden sm:flex items-center gap-2 bg-[#e4f542] text-black px-6 py-3 rounded-full font-black text-sm sm:text-base border-2 border-black shadow-[4px_4px_0px_#000] cursor-pointer select-none">
            <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>ابدأ الآن</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[330px] sm:h-[380px] md:h-[460px] mt-14 md:mt-8 flex items-center justify-center">
        <div className="hero-marquee absolute top-[68%] sm:top-[60%] md:top-[58%] -translate-y-1/2 left-[-7%] right-[-7%] h-[200px] sm:h-[250px] md:h-[300px] bg-[#111] rotate-[-3deg] overflow-hidden flex flex-col justify-center gap-4 z-10 border-y-4 border-black shadow-2xl">
          
          <div dir="ltr" className="flex w-max will-change-transform">
            <div ref={marquee1} className="flex gap-10 md:gap-14 whitespace-nowrap will-change-transform">
              {[...Array(12)].map((_, i) => {
                const bg = ['#407BFF', '#e4f542', '#FF3BFF', '#111111', '#0ea5e9', '#8b5cf6'][i % 6];
                const fg = bg === '#e4f542' ? '#000' : '#fff';
                return (
                  <div key={i} className="flex items-center gap-4 px-10 md:px-16 py-2.5 rounded-lg text-lg sm:text-xl border-2 border-black shadow-[3px_3px_0px_#000] whitespace-nowrap" style={{ background: bg, color: fg }}>
                    <Hexagon className="w-5 h-5" fill={fg} style={{ color: fg }} />
                    <span className="font-black">{['منتجات رقمية', 'باقات سوشيال'][i % 2]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div dir="ltr" className="flex w-max will-change-transform -translate-x-20">
            <div ref={marquee2} className="flex gap-10 md:gap-14 whitespace-nowrap will-change-transform">
              {[...Array(12)].map((_, i) => {
                const bg = ['#e4f542', '#FF3BFF', '#111111', '#0ea5e9', '#8b5cf6', '#407BFF'][i % 6];
                const fg = bg === '#e4f542' ? '#000' : '#fff';
                return (
                  <div key={i} className="flex items-center gap-4 px-10 md:px-16 py-2.5 rounded-lg text-lg sm:text-xl border-2 border-black shadow-[3px_3px_0px_#000] whitespace-nowrap" style={{ background: bg, color: fg }}>
                    <Sparkles className="w-5 h-5" style={{ color: fg }} />
                    <span className="font-black">{['تفعيل فوري', 'ضمان كامل'][i % 2]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div dir="ltr" className="flex w-max will-change-transform translate-x-10">
            <div ref={marquee3} className="flex gap-10 md:gap-14 whitespace-nowrap will-change-transform">
              {[...Array(12)].map((_, i) => {
                const bg = ['#FF3BFF', '#111111', '#0ea5e9', '#8b5cf6', '#407BFF', '#e4f542'][i % 6];
                const fg = bg === '#e4f542' ? '#000' : '#fff';
                return (
                  <div key={i} className="flex items-center gap-4 px-10 md:px-16 py-2.5 rounded-lg text-lg sm:text-xl border-2 border-black shadow-[3px_3px_0px_#000] whitespace-nowrap" style={{ background: bg, color: fg }}>
                    <Palette className="w-5 h-5" style={{ color: fg }} />
                    <span className="font-black">{['أفضل الأسعار', 'جودة مضمونة'][i % 2]}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        <div className="main-character relative z-20 w-[80%] sm:w-[55%] md:w-[40%] max-w-[550px] flex justify-center mt-[-100px] sm:mt-[-210px] md:mt-[-260px]">
          <img 
            src="/mann.webp" 
            alt="Hero Character" 
            fetchpriority="high"
            decoding="async"
            width="550"
            height="770"
            className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          />
        </div>
      </div>
    </section>
  );
}