import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { Send, MessageCircle, Mail, ArrowDown, Check, Plus, Zap, ArrowUpRight, Loader2 } from 'lucide-react';
import { FaTelegramPlane } from 'react-icons/fa'; // تم إزالة أيقونة إنستغرام

import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import Seo from '../components/Seo';
import { api } from '../lib/api';
import { usePopup } from '../context/usePopup';

gsap.registerPlugin(ScrollTrigger);

// 🔥 تحديث القنوات بناءً على طلبك
const CHANNELS = [
  {
    icon: MessageCircle,
    label: 'الدعم الفني',
    value: 'نظام التذاكر',
    dir: 'ltr',
    note: 'من داخل حسابك لتتبع أفضل',
    href: '/profile', // التوجيه للبروفايل
    bg: '#111111',
    tag: 'SUPPORT',
    internal: true, // علامة تدل على أنه رابط داخلي
  },
  {
    icon: FaTelegramPlane,
    label: 'تيلغرام',
    value: '@BaarqStore',
    dir: 'ltr',
    note: 'القناة الرسمية لمتجر برق',
    href: 'https://t.me/BaarqStore',
    bg: '#229ED9',
    tag: 'CHANNEL',
  },
  {
    icon: Mail,
    label: 'البريد الإلكتروني',
    value: 'support@barqstore.org',
    dir: 'ltr',
    note: 'للاستفسارات والعروض الخاصة',
    href: 'mailto:support@barqstore.org',
    bg: '#407BFF',
    tag: 'EMAIL',
  },
];

const FAQS = [
  {
    q: 'كم يستغرق تفعيل الطلب؟',
    a: 'معظم الطلبات تُفعَّل خلال دقائق من تأكيد الدفع، وبعض الباقات الضخمة قد تصل تدريجياً خلال ساعات لضمان أمان حسابك.',
  },
  {
    q: 'ماذا يعني الضمان لمدة 30 يوم؟',
    a: 'يعني أننا نعوّضك فوراً بأي نقصان يحدث في المشاهدات أو المتابعين خلال 30 يوماً من اكتمال الطلب، مجاناً وبشكل تلقائي.',
  },
  {
    q: 'هل تحتاجون إلى كلمة مرور حسابي؟',
    a: 'لا أبداً. نعمل عبر اسم المستخدم أو رابط المحتوى فقط، وبياناتك تبقى في مكانها آمنة.',
  },
  {
    q: 'ما طرق الدفع المتوفرة؟',
    a: 'الدفع كاش عند الاستلام في عمان، أو عبر تحويل كليك وكاش يو — المناسبة لك',
  },
];

const FLOATERS = [
  { cls: 'w-5 h-5 rounded-md bg-[#407BFF]/25 border-2 border-black rotate-12', pos: 'top-[16%] right-[6%]', dd: '6s' },
  { cls: 'w-4 h-4 rounded-full bg-[#FF3BFF]/30 border-2 border-black', pos: 'bottom-[24%] right-[10%]', dd: '7s' },
  { cls: 'w-6 h-6 rounded-md bg-[#e4f542]/50 border-2 border-black -rotate-12', pos: 'bottom-[14%] left-[7%]', dd: '5.4s' },
  { cls: 'w-3.5 h-3.5 rounded-sm bg-black', pos: 'top-[40%] left-[5%]', dd: '4.8s' },
];

const MARQUEE_TAGS = ['رد فوري', '0100×1000', 'ضمان 30 يوم', 'دعم 24/7', 'دفع آمن', 'ثقة عملاء'];

export default function ContactPage() {
  const mainRef = useRef(null);
  const [open, setOpen] = useState(0);
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { showPopup } = usePopup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.request('/api/support/message', {
        method: 'POST',
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.subject ? `📌 الموضوع: ${formData.subject}\n\n💬 التفاصيل: ${formData.message}` : formData.message
        }, 
      });

      setSent(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      showPopup({
        type: 'success',
        title: 'تم إرسال رسالتك! 🚀',
        text: 'تم تحويل استفسارك إلى فريقنا، وسنتواصل معك قريباً عبر البريد الإلكتروني أو الهاتف.',
      });

      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      showPopup({
        type: 'error',
        title: 'عذراً!',
        text: err.message || 'حدث خطأ أثناء الإرسال، الرجاء المحاولة مرة أخرى.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useGSAP(() => {
    gsap.fromTo(
      '.ct-hero-line',
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 1, stagger: 0.12, ease: 'power4.out' }
    );
    gsap.from('.ct-hero-meta', { y: 30, opacity: 0, stagger: 0.1, delay: 0.4, duration: 0.8, ease: 'power3.out' });

    gsap.utils.toArray('.ct-faq').forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
        }
      );
    });

    gsap.utils.toArray('.ct-card').forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 60, rotation: i % 2 ? 2 : -2 },
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 0.8,
          delay: i * 0.09,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
        }
      );
    });

    gsap.fromTo(
      '.ct-form',
      { opacity: 0, y: 60, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ct-form', start: 'top 88%', toggleActions: 'play none none none' },
      }
    );
  }, { scope: mainRef });

  return (
    <main
      ref={mainRef}
      dir="rtl"
      className="relative w-full min-h-screen overflow-x-hidden bg-white text-black selection:bg-[#e4f542]"
    >
      <Navbar />
      <Seo
        title="تواصل معنا | متجر برق"
        description="تواصل مع فريق متجر برق للاستفسارات العامة، الدعم الفني، أو الشراكات."
        path="/contact"
      />

      {/* ============ HERO ============ */}
      <section className="relative bg-white overflow-hidden pt-28 md:pt-36 pb-12">
        <div className="absolute inset-0 dot-grid opacity-40" aria-hidden="true"></div>
        <div className="absolute inset-0 grid place-items-center pointer-events-none" aria-hidden="true">
          <div className="orbit-spin w-[min(72vw,520px)] aspect-square rounded-full border-[4px] border-dashed border-black/10" style={{ ['--r']: '40s' }}></div>
        </div>

        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {FLOATERS.map((f, i) => (
            <span key={i} className={`absolute ${f.pos}`}>
              <span className={`block ${f.cls}`} style={{ ['--dd']: f.dd, ['--dr']: '0deg', ['--dr2']: '8deg', animation: 'drift 6s ease-in-out infinite' }}></span>
            </span>
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <span className="ct-hero-meta inline-flex items-center gap-2 bg-[#e4f542] text-black px-5 py-2 text-xs font-black uppercase tracking-[0.35em] border-2 border-black shadow-[3px_3px_0px_#000]">
            <Zap className="w-3.5 h-3.5 fill-current" />
            CONTACT — التواصل
          </span>

          <h1 className="mt-8 leading-loose tracking-tighter">
            <span className="ct-hero-line block text-6xl sm:text-8xl md:text-9xl font-black text-black pt-4 pb-2">راسلنا</span>
            <span className="ct-hero-line block text-6xl sm:text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] via-[#FF3BFF] to-[#e4f542] pt-8 pb-8 -mt-6">
              وفر وابدأ
            </span>
          </h1>

          <p className="ct-hero-meta mt-2 text-base sm:text-lg text-neutral-600 font-medium leading-relaxed max-w-xl mx-auto">
            فريقنا متاح على مدار الساعة للإجابة عن استفساراتك، وعروض خاصة، أو استشارة مجانية قبل
            الشراء — اختر القناة الأنسب لك.
          </p>

          <div className="ct-hero-meta mt-10 flex items-center justify-center gap-3 text-neutral-500">
            <span className="text-[10px] font-mono font-black tracking-[0.35em] uppercase">Scroll — اختر قناتك</span>
            <ArrowDown className="w-5 h-5 animate-bounce text-[#FF3BFF]" />
          </div>
        </div>
      </section>

      {/* شريط المميزات المتحرك */}
      <div className="relative border-y-4 border-black bg-[#111] py-5 overflow-hidden">
        <div dir="ltr" className="t-marquee flex w-max select-none">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex items-center pl-8">
              {MARQUEE_TAGS.map((tag, i) => {
                const bg = ['#407BFF', '#e4f542', '#FF3BFF', '#111111', '#0ea5e9', '#8b5cf6'][i % 6].replace('#111111', '#222');
                const fg = bg === '#e4f542' ? '#000' : '#fff';
                return (
                  <span
                    key={i}
                    className="flex items-center gap-3 mx-3 rounded-lg text-lg sm:text-xl font-black uppercase border-2 border-black shadow-[3px_3px_0px_#000] px-8 py-2.5 whitespace-nowrap"
                    style={{ background: bg, color: fg }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ============ القنوات + النموذج ============ */}
      <section className="relative bg-white overflow-hidden py-20 md:py-24">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" data-parallax="0.5">
          {FLOATERS.slice(0, 3).map((f, i) => (
            <span key={i} className={`absolute ${f.pos}`}>
              <span className={`block ${f.cls}`} style={{ ['--dd']: f.dd, ['--dr']: '0deg', ['--dr2']: '-8deg', animation: 'drift 7s ease-in-out infinite' }}></span>
            </span>
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <span className="text-sm font-black text-neutral-400">01</span>
            <span className="h-2 flex-1 bg-gradient-to-l from-black/20 to-transparent"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">تواصل · نرد خلال دقائق</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* قنوات التواصل */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-5">
              {CHANNELS.map((c, i) => {
                const Icon = c.icon;
                
                // تصميم محتوى الكرت ليكون موحداً
                const CardContent = (
                  <>
                    <span className="absolute top-0 right-0 w-14 h-1.5" style={{ background: c.bg }}></span>
                    <div className="flex items-center justify-between">
                      <div
                        className="w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_#000] transition-transform duration-300 group-hover:-rotate-12"
                        style={{ background: c.bg }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-[9px] font-black tracking-[0.3em] text-neutral-400" dir="ltr">{c.tag}</span>
                    </div>
                    <h4 className="text-lg font-black mt-5">{c.label}</h4>
                    <p className="text-sm font-bold text-neutral-700" dir={c.dir || 'rtl'}>{c.value}</p>
                    <p className="text-xs font-medium text-neutral-400 mt-2">{c.note}</p>
                    <ArrowUpRight className="absolute bottom-5 left-5 w-5 h-5 text-neutral-300 group-hover:text-black group-hover:rotate-45 transition-all" />
                  </>
                );

                // 🔥 إذا كان داخلياً نستخدم Link، وإذا خارجياً نستخدم a
                return c.internal ? (
                  <Link
                    key={i}
                    to={c.href}
                    className="ct-card group relative bg-white border-2 border-black rounded-2xl p-6 shadow-[5px_5px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 cursor-pointer overflow-hidden block"
                  >
                    {CardContent}
                  </Link>
                ) : (
                  <a
                    key={i}
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="ct-card group relative bg-white border-2 border-black rounded-2xl p-6 shadow-[5px_5px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 cursor-pointer overflow-hidden block"
                  >
                    {CardContent}
                  </a>
                );
              })}
            </div>

            {/* نموذج الاستعلام */}
            <div className="lg:col-span-7">
              <form
                id="contact-form"
                onSubmit={handleSubmit}
                className="ct-form relative bg-white border-2 border-black rounded-3xl p-8 sm:p-10 shadow-[10px_10px_0px_#000] overflow-hidden"
              >
                <span className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-10" style={{ background: '#407BFF' }}></span>
                <span className="absolute -bottom-14 -left-10 w-40 h-40 rounded-full opacity-10" style={{ background: '#FF3BFF' }}></span>

                <div className="relative flex items-center gap-3 mb-8">
                  <div className="w-11 h-11 bg-[#e4f542] border-2 border-black rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black">راسلنا مباشرة</h4>
                    <p className="text-xs font-bold text-neutral-500">للاستفسارات العامة، الدعم، أو الشراكات</p>
                  </div>
                </div>

                <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-2">اسمك الكريم</label>
                    <input
                      required
                      type="text"
                      placeholder="مثال: أحمد"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border-2 border-black px-4 py-3.5 font-bold placeholder:text-neutral-400 focus:outline-none focus:shadow-[4px_4px_0px_#407BFF] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-2">البريد الإلكتروني</label>
                    <input
                      required
                      type="email"
                      placeholder="example@mail.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full border-2 border-black px-4 py-3.5 font-bold placeholder:text-neutral-400 focus:outline-none focus:shadow-[4px_4px_0px_#FF3BFF] transition-all"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-2">رقم الهاتف (اختياري)</label>
                    <input
                      type="text"
                      pattern="[0-9+\(\)\- ]*"
                      placeholder="07XXXXXXXX"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full border-2 border-black px-4 py-3.5 font-bold placeholder:text-neutral-400 focus:outline-none focus:shadow-[4px_4px_0px_#25D366] transition-all"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-2">الموضوع</label>
                    <input
                      required
                      type="text"
                      placeholder="استفسار عام، شراكة، إلخ..."
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="w-full border-2 border-black px-4 py-3.5 font-bold placeholder:text-neutral-400 focus:outline-none focus:shadow-[4px_4px_0px_#0ea5e9] transition-all"
                    />
                  </div>
                </div>

                <textarea
                  required
                  rows="4"
                  placeholder="اكتب استفسارك هنا بكل وضوح وسنرد عليك في أقرب وقت..."
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="relative w-full border-2 border-black px-4 py-3.5 font-bold placeholder:text-neutral-400 focus:outline-none focus:shadow-[4px_4px_0px_#FF3BFF] transition-all mt-5 resize-none"
                ></textarea>

                <div className="relative mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-3 bg-black text-white font-black text-sm uppercase tracking-widest px-8 py-4 border-2 border-black shadow-[5px_5px_0px_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:bg-[#111] transition-all duration-200 cursor-pointer ${
                      sent ? 'bg-[#25D366] text-black' : ''
                    } disabled:opacity-70`}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> جاري الإرسال...</>
                    ) : sent ? (
                      <><Check className="w-5 h-5" /> تم استلام رسالتك</>
                    ) : (
                      <><Send className="w-5 h-5" /> إرسال الاستفسار</>
                    )}
                  </button>
                  <span className="text-xs font-bold text-neutral-500 text-center sm:text-right">
                    بياناتك آمنة ولن نشاركها مع أي طرف ثالث
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ============ الأسئلة الشائعة ============ */}
      <section className="relative bg-[#f6f6f4] border-y-4 border-black py-20 md:py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-sm font-black text-neutral-400">02</span>
            <span className="h-2 flex-1 bg-gradient-to-l from-black/20 to-transparent"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">FAQ — أسئلة شائعة</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-loose">
            عندك سؤال؟ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] via-[#FF3BFF] to-[#e4f542] inline-block pt-6 pb-6 -mb-6">جاوبناه.</span>
          </h2>

          <div className="mt-10 space-y-4">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="ct-faq group bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_#000]">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 text-right px-6 py-5 cursor-pointer hover:bg-[#e4f542]/20 transition-colors"
                  >
                    <span className="flex items-center gap-4">
                      <span className="font-mono text-[10px] font-black text-neutral-400" dir="ltr">0{i + 1}</span>
                      <span className="text-lg md:text-xl font-black">{f.q}</span>
                    </span>
                    <span className={`w-9 h-9 shrink-0 border-2 border-black flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-45 bg-[#e4f542]' : 'bg-white'}`}>
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <p className="px-6 pb-6 pr-[3.5rem] text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ خاتمة ============ */}
      <section className="relative bg-white overflow-hidden pt-20 md:pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-loose">
            النسخة التالية من <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] via-[#FF3BFF] to-[#e4f542] inline-block pt-6 pb-6 -mb-6">حضورك</span>
          </h2>
          <p className="mt-8 text-base md:text-lg text-neutral-600 font-medium max-w-xl mx-auto leading-relaxed">
            تواصل معنا الآن واختر الباقة المناسبة لهدفك اليوم — فريقنا يهيّئ كل شيء لانطلاقة فورية.
          </p>

          <a
            href="#contact-form"
            className="group mt-10 inline-flex items-center gap-3 bg-black text-white font-black text-sm uppercase tracking-widest px-9 py-5 border-2 border-black shadow-[6px_6px_0px_#e4f542] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[4px_4px_0px_#e4f542] transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366] group-hover:rotate-12 transition-transform" />
            راسل الدعم الفني
          </a>

          {/* 🔥 تحديث الروابط في الفوتر */}
          <div className="mt-10 flex items-center justify-center gap-8 font-bold text-sm text-neutral-700">
            <a href="https://t.me/BaarqStore" target="_blank" rel="noreferrer" className="hover:text-[#229ED9] underline underline-offset-4 transition-colors">تيلغرام</a>
            <a href="https://www.facebook.com/BarqStore11/" target="_blank" rel="noreferrer" className="hover:text-[#407BFF] underline underline-offset-4 transition-colors">فيسبوك</a>
            <Link to="/products#platform-tiktok" className="hover:text-black underline underline-offset-4 transition-colors">تيك توك</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}