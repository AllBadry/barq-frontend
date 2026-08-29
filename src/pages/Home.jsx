import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import Seo from '../components/Seo';
import HeroSection from '../components/sections/HeroSection';
import Categories from '../components/sections/categories';
import AboutUs from '../components/sections/aboutus';
import Contact from '../components/sections/contact';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray('.cinematic-section');

    sections.forEach((section, index) => {
      if (index === 0) return;

      // أنيميشن ظهور سلس ونظيف (Fade Up) بدون أي لاغ أو ثقل في السكرول
      gsap.fromTo(section,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none', // يشتغل بسلاسة مرة واحدة عند الوصول إليه بدون ثقل الـ scrub
          }
        }
      );
    });
  }, { scope: mainRef });

  useGSAP(() => {
    // ===== Parallax عام: عنصر ب data-parallax يتحرك عند السكرول =====
    // يعمل على أجهزة الكمبيوتر فقط (شاشة واسعة + مؤشر دقيق) —
    // على الهاتف/الايباد نعطّل حركة الخلفيات لتفادي تعلّق السكرول.
    const desktop = window.matchMedia('(min-width: 1024px)').matches && window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!desktop || reduce) return;

    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
      const dist = speed * 250;
      gsap.fromTo(
        el,
        { y: -dist },
        {
          y: dist,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: el.closest('section') || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        }
      );
    });
  }, { scope: mainRef });

  return (
    // تم إضافة overflow-x-hidden لضمان عدم ظهور السكرول الأفقي نهائياً
    <main 
      ref={mainRef} 
      className="relative w-full bg-white min-h-screen overflow-x-hidden text-black selection:bg-[#e4f542]"
    >
      <Navbar />
      <Seo
        title="متجر برق | Barq Store — نمو حساباتك بسرعة البرق"
        description="اشتراكات ومتابعون ومشاهدات ولايكات لإنستغرام وفيسبوك وتيك توك، بتفعيل فوري وضمان كامل بدينار أردني."
        path="/"
      />

      <div className="cinematic-section">
        <HeroSection />
      </div>

      <AboutUs />

      <div className="cinematic-section">
        <Categories />
      </div>

      <div className="cinematic-section">
        <Contact />
      </div>

      <div className="cinematic-section">
        <Footer />
      </div>
      
    </main>
  );
}