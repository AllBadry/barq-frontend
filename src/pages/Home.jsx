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

// 🔥 الإعداد الموحد لجميع الملفات يوضع هنا لمنع ارتباك المتصفح عند إخفاء شريط العنوان في الجوال
ScrollTrigger.config({ ignoreMobileResize: true });

export default function Home() {
  const mainRef = useRef(null);

  useGSAP(() => {
    // ===== Parallax عام =====
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
            scrub: true, // 🔥 true تمنع اللاغ وثقل السكرول على أجهزة اللابتوب
          },
        }
      );
    });
  }, { scope: mainRef });

  return (
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

      {/* 🔥 تم إزالة كلاس cinematic-section لترك المكونات الداخلية تعمل بحرية وبدون تضارب */}
      <div>
        <HeroSection />
      </div>

      <AboutUs />

      <div>
        <Categories />
      </div>

      <div>
        <Contact />
      </div>

      <div>
        <Footer />
      </div>
      
    </main>
  );
}