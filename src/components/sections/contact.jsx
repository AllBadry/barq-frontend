import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Send, MessageCircle, Mail, ArrowUpRight, Check } from 'lucide-react';
import { FaTelegramPlane ,} from 'react-icons/fa';
import { usePopup } from '../../context/usePopup';
import { api } from '../../lib/api';
import { Loader2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);



const CHANNELS = [
  {
    icon: MessageCircle,
    label: 'الدعم الفني',
    value: 'نظام التذاكر',
    note: 'الطريقة الرسمية للتواصل ',
    href: '#contact-form',
    bg: '#111111',
  },
  {
    icon: FaTelegramPlane,
    label: 'تيلغرام',
    value: '@BaarqStore',
    note: 'دعم مباشر عبر بوت التليغرام',
    href: 't.me/BaarqStore',
    bg: '#229ED9',
  },
  {
    icon: Mail,
    label: 'البريد الإلكتروني',
    value: 'support@barqstore.org',
    note: 'للاستفسارات والعروض الخاصة',
    href: 'mailto:support@barqstore.org',
    bg: '#407BFF',
  },
];

const FLOATERS = [
  { cls: 'w-5 h-5 rounded-md bg-[#407BFF]/25 border-2 border-black rotate-12', pos: 'top-[14%] right-[5%]', dd: '6s' },
  { cls: 'w-4 h-4 rounded-full bg-[#FF3BFF]/30 border-2 border-black', pos: 'bottom-[22%] right-[9%]', dd: '7s' },
  { cls: 'w-6 h-6 rounded-md bg-[#e4f542]/50 border-2 border-black -rotate-12', pos: 'bottom-[12%] left-[6%]', dd: '5.4s' },
  { cls: 'w-3.5 h-3.5 rounded-sm bg-black', pos: 'top-[38%] left-[4%]', dd: '4.8s' },
];

export default function Contact() {
  const HEAD_WORDS = ['خطك', 'المباشر', 'مع', 'برق'];
const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
const [isSubmitting, setIsSubmitting] = useState(false);
const [sent, setSent] = useState(false);
const { showPopup } = usePopup();
  const containerRef = useRef(null);
const [isLoading, setIsLoading] = useState(false);

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
      '.cta-word',
      { opacity: 0, y: 80, rotate: 3 },
      {
        opacity: 1,
        y: 0,
        rotate: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-heading', start: 'top 85%', toggleActions: 'play none none none' },
      }
    );

    gsap.utils.toArray('.cta-card').forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.09,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
        }
      );
    });

    gsap.fromTo(
      '.cta-form',
      { opacity: 0, y: 60, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-form', start: 'top 88%', toggleActions: 'play none none none' },
      }
    );
  }, { scope: containerRef });

  return (
    <section id="contact" ref={containerRef} className="relative bg-white text-black overflow-hidden" dir="rtl">
      <div className="absolute inset-0 pointer-events-none" data-parallax="0.3">
        <div className="absolute inset-0 dot-grid"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" data-parallax="0.55">
        {FLOATERS.map((f, i) => (
          <span key={i} className={`absolute ${f.pos}`}>
            <span className={`block ${f.cls}`} style={{ ['--dd']: f.dd, ['--dr']: '0deg', ['--dr2']: '8deg', animation: 'drift 6s ease-in-out infinite' }}></span>
          </span>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-10">
        <div className="flex items-center gap-4 mb-12">
          <span className="text-sm font-black text-neutral-400">04</span>
          <span className="h-2 flex-1 bg-gradient-to-l from-black/20 to-transparent"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">تواصل · نرد خلال دقائق</span>
        </div>

        <h2 className="cta-heading text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.2] flex flex-wrap items-end gap-x-4 gap-y-3 pb-4">
          {HEAD_WORDS.map((w, i) => (
            <span
              key={i}
              className={`cta-word inline-block pb-[0.12em] leading-[1.2] ${
                w === 'برق'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] via-[#FF3BFF] to-[#e4f542]'
                  : ''
              }`}
            >
              {w}
            </span>
          ))}
        </h2>

        <p className="text-neutral-600 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mt-6">
          فريقنا متاح على مدار الساعة للإجابة عن استفساراتك، وطلب عروض مخصصة، أو استشارة مجانية
          قبل الشراء — اختر القناة الأنسب لك.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16 items-start">
          {/* قنوات التواصل */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CHANNELS.map((c, i) => {
              const Icon = c.icon;
              return (
                <a
                  key={i}
                  href={c.href}
                  className="cta-card group bg-white border-2 border-black rounded-2xl p-6 shadow-[5px_5px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_#000]"
                      style={{ background: c.bg }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors" />
                  </div>
                  <h4 className="text-lg font-black mt-5">{c.label}</h4>
                  <p className="text-sm font-bold text-neutral-700" dir="ltr">{c.value}</p>
                  <p className="text-xs font-medium text-neutral-400 mt-2">{c.note}</p>
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
  );
}