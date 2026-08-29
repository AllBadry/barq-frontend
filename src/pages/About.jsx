import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ShieldCheck,ArrowLeft, Flame, Crosshair, TrendingUp, Zap, Target, Users } from 'lucide-react';

import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import Seo from '../components/Seo';

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // 1. تأثير الدخول السينمائي للـ Hero
    const tl = gsap.timeline();
    tl.fromTo('.hero-badge', 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    )
    .fromTo('.hero-title-line',
      { y: 120, opacity: 0, rotateX: -40 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.15, ease: 'expo.out' },
      '-=0.4'
    )
    .fromTo('.hero-desc',
      { opacity: 0, filter: 'blur(10px)' },
      { opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out' },
      '-=0.8'
    );

    // 2. Parallax النص الخلفي
    gsap.to('.bg-stroke-text', {
      xPercent: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });

    // 3. تأثيرات البوسترات السينمائية للمنصات (الكاميرا والظهور)
    const sections = gsap.utils.toArray('.cinematic-section');
    sections.forEach((sec) => {
      const img = sec.querySelector('.cine-img');
      const content = sec.querySelector('.cine-content');

      // حركة الصورة (Zoom out & Parallax)
      gsap.fromTo(img, 
        { scale: 1.3, filter: 'brightness(0.2) contrast(1.2)' },
        { 
          scale: 1, 
          filter: 'brightness(0.9) contrast(1)', 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          }
        }
      );

      // حركة النص الجانبي
      gsap.fromTo(content,
        { x: sec.classList.contains('reverse') ? -100 : 100, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power4.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 60%',
          }
        }
      );
    });

    // 4. ظهور الكروت السفلية
    ScrollTrigger.batch('.power-card', {
      start: 'top 85%',
      onEnter: (els) => gsap.fromTo(els, 
        { y: 60, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.2)', overwrite: true }
      )
    });

  }, { scope: containerRef });

  return (
    <main ref={containerRef} dir="rtl" className="relative w-full min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-[#FF3BFF] selection:text-white">
      <Navbar />
      <Seo 
        title="عن برق | السيطرة الرقمية" 
        description="متجر برق: امبراطوريتك الرقمية تبدأ هنا. تفاعل حقيقي، مشاهدات كاسحة، وسيطرة تامة على خوارزميات السوشيال ميديا." 
        path="/about" 
      />

      {/* خلفية النص المفرغ (Cinematic Stroke Text) */}
      <div 
        className="bg-stroke-text absolute top-32 left-0 right-0 z-0 pointer-events-none whitespace-nowrap opacity-[0.05] text-[20vw] font-black uppercase tracking-tighter mix-blend-overlay"
        style={{ WebkitTextStroke: '3px #fff', color: 'transparent' }}
        dir="ltr"
      >
        VIRAL DOMINANCE • UNSTOPPABLE INFLUENCE • 
      </div>

      {/* ================= HERO SECTION ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-48 md:pt-60 pb-32 text-center">
        <div className="hero-badge inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 text-xs font-black uppercase tracking-[0.3em] border-2 border-white shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-8">
          <Flame className="w-4 h-4" />
          DIGITAL EMPIRE
        </div>
        
        <h1 className="text-[13vw] sm:text-7xl md:text-8xl lg:text-[140px] font-black tracking-tighter leading-[0.9] uppercase [perspective:1000px]">
          <div className="overflow-hidden p-2"><div className="hero-title-line">السيطرة</div></div>
          <div className="overflow-hidden p-2">
            <div className="hero-title-line text-transparent bg-clip-text bg-gradient-to-r from-[#FF3BFF] via-[#407BFF] to-[#25F4EE]">
              المطلقة
            </div>
          </div>
        </h1>
        
        <p className="hero-desc mt-10 text-lg md:text-2xl text-neutral-400 font-bold max-w-3xl mx-auto leading-relaxed">
          نحن لا نبيع أرقاماً. نحن نمنحك القوة لاختراق الخوارزميات وتصدر المشهد. في <span className="text-white font-black">"متجر برق"</span>، نبني لك جيشاً من المتابعين والتفاعلات التي تضعك على قمة السوشيال ميديا بقوة لا تُقهر.
        </p>
      </div>

      {/* ================= CINEMATIC SHOWCASE ================= */}
      <div className="relative z-10 w-full bg-black py-20 flex flex-col gap-0 border-y-4 border-white/10">
        
        {/* Instagram Cinematic Poster */}
        <section className="cinematic-section relative flex flex-col md:flex-row min-h-[80vh] border-b-4 border-white/10">
          <div className="w-full md:w-1/2 relative overflow-hidden border-r-4 border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
            <img src="/instamanpng.png" alt="Instagram Dominance" className="cine-img w-full h-full object-cover object-center" />
          </div>
          <div className="cine-content w-full md:w-1/2 flex flex-col justify-center p-10 md:p-20 bg-black z-20">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-[#FF3BFF] uppercase mb-6" dir="ltr">Instagram</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-6">واجهة الفخامة</h3>
            <p className="text-lg md:text-xl text-neutral-400 font-bold leading-relaxed mb-8">
              اصنع هالة من الهيبة حول حسابك. لايكات حقيقية، مشاهدات ريلز كاسحة، ومتابعون يعززون مكانتك ويجعلون العلامات التجارية تتسابق للوصول إليك.
            </p>
            <Link to="/products" className="self-start inline-flex items-center gap-2 bg-[#FF3BFF] text-black px-8 py-4 text-sm font-black uppercase tracking-widest border-2 border-[#FF3BFF] hover:bg-transparent hover:text-[#FF3BFF] transition-colors">
              اكتسح الإنستغرام <Crosshair className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* TikTok Cinematic Poster (Reverse Layout) */}
        <section className="cinematic-section reverse relative flex flex-col md:flex-row-reverse min-h-[80vh] border-b-4 border-white/10 bg-[#0a0a0a]">
          <div className="w-full md:w-1/2 relative overflow-hidden border-l-4 border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent z-10" />
            <img src="/tiktokman.png" alt="TikTok Viral" className="cine-img w-full h-full object-cover object-top" />
          </div>
          <div className="cine-content w-full md:w-1/2 flex flex-col justify-center p-10 md:p-20 z-20">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-[#25F4EE] uppercase mb-6" dir="ltr">TikTok</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-6">مصنع التريندات</h3>
            <p className="text-lg md:text-xl text-neutral-400 font-bold leading-relaxed mb-8">
              التريند لا ينتظر أحداً. تفاعل ناري ومشاهدات مليونية تجبر خوارزمية التيك توك على وضع محتواك مباشرة في شاشة الـ For You ليفجر انتشارك محلياً وعالمياً.
            </p>
            <Link to="/products" className="self-start inline-flex items-center gap-2 bg-[#25F4EE] text-black px-8 py-4 text-sm font-black uppercase tracking-widest border-2 border-[#25F4EE] hover:bg-transparent hover:text-[#25F4EE] transition-colors">
              تصدر التيك توك <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Facebook Cinematic Poster */}
        <section className="cinematic-section relative flex flex-col md:flex-row min-h-[80vh]">
          <div className="w-full md:w-1/2 relative overflow-hidden border-r-4 border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
            <img src="/facebookcity.png" alt="Facebook Community" className="cine-img w-full h-full object-cover object-center" />
          </div>
          <div className="cine-content w-full md:w-1/2 flex flex-col justify-center p-10 md:p-20 bg-black z-20">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-[#407BFF] uppercase mb-6" dir="ltr">Facebook</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-6">النفوذ الجماهيري</h3>
            <p className="text-lg md:text-xl text-neutral-400 font-bold leading-relaxed mb-8">
              سيطر على أكبر شبكة تواصل في العالم. تفاعل حقيقي، مشاركات، وتوسيع لنطاق وصولك لتبني مجتمعاً ضخماً لا يُقهر حول محتواك أو علامتك التجارية.
            </p>
            <Link to="/products" className="self-start inline-flex items-center gap-2 bg-[#407BFF] text-white px-8 py-4 text-sm font-black uppercase tracking-widest border-2 border-[#407BFF] hover:bg-transparent hover:text-[#407BFF] transition-colors">
              سيطر على فيسبوك <Users className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>

      {/* ================= NEO-BRUTALIST FEATURES ================= */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          <div className="power-card group bg-white text-black border-4 border-black p-10 shadow-[12px_12px_0px_#e4f542] hover:-translate-y-2 hover:shadow-[16px_16px_0px_#e4f542] transition-all duration-300">
            <Zap className="w-14 h-14 text-black mb-6 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-4xl font-black mb-4">تنفيذ كاسح</h3>
            <p className="text-neutral-600 font-bold text-base leading-relaxed">
              لا مجال للانتظار. بمجرد تأكيد الدفع، تنطلق الطلبات تلقائياً لتبدأ النتائج بالظهور كالسيل على حساباتك.
            </p>
          </div>

          <div className="power-card group bg-[#e4f542] text-black border-4 border-black p-10 shadow-[12px_12px_0px_#407BFF] hover:-translate-y-2 hover:shadow-[16px_16px_0px_#407BFF] transition-all duration-300">
            <Target className="w-14 h-14 text-black mb-6 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-4xl font-black mb-4">استهداف الخوارزمية</h3>
            <p className="text-neutral-800 font-bold text-base leading-relaxed">
              كل لايك وكل مشاهدة مصممة لدفع محتواك نحو المنصات المقترحة (Explore/FYP) لجذب تفاعل عضوي جنوني.
            </p>
          </div>

          <div className="power-card group bg-black text-white border-4 border-white/20 p-10 shadow-[12px_12px_0px_#FF3BFF] hover:-translate-y-2 hover:shadow-[16px_16px_0px_#FF3BFF] transition-all duration-300 hover:border-[#FF3BFF]">
            <ShieldCheck className="w-14 h-14 text-[#FF3BFF] mb-6 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-4xl font-black mb-4">حصانة شاملة</h3>
            <p className="text-neutral-400 font-bold text-base leading-relaxed">
              السرية التامة، أمان حسابك، وضمان التعويض. لا نطلب أرقاماً سرية، فقط رابط المجد الذي تريد صنعه.
            </p>
          </div>

        </div>
      </div>

      {/* ================= INFINITE AGGRESSIVE MARQUEE ================= */}
      <div className="relative border-y-4 border-white/20 bg-[#101314] py-8 overflow-hidden">
        <div dir="ltr" className="t-marquee flex w-max select-none">
          {[...Array(4)].map((_, k) => (
            <div key={k} className="flex items-center">
              {[
                'VIRAL DOMINANCE',
                'ALGORITHM HACKING',
                'MASSIVE ENGAGEMENT',
                'DIGITAL SUPREMACY',
                'UNSTOPPABLE REACH'
              ].map((text, i) => (
                <span key={i} className="flex items-center text-4xl md:text-5xl font-black uppercase text-white/80 tracking-tighter px-8">
                  {text} <span className="text-[#e4f542] px-8">✖</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================= FINAL CTA ================= */}
      <div className="max-w-5xl mx-auto px-6 py-40 text-center">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-10 text-white">
          جاهز لتصنع <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e4f542] to-[#25D366]">الزلزال؟</span>
        </h2>
        <Link
          to="/products"
          className="inline-flex items-center gap-3 bg-white text-black text-xl md:text-2xl font-black uppercase tracking-widest px-12 py-6 border-4 border-black shadow-[12px_12px_0px_#e4f542] hover:bg-[#e4f542] hover:shadow-[16px_16px_0px_#FF3BFF] hover:-translate-y-2 hover:-translate-x-2 transition-all duration-300"
        >
          ابدأ الهيمنة الآن
          <ArrowLeft className="w-8 h-8" />
        </Link>
      </div>

      <Footer />
    </main>
  );
}