import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ShoppingCart, Plus, Minus, Trash2, Zap, ArrowLeft, ShieldCheck, Loader2, CheckCircle, AlertTriangle, X } from 'lucide-react';

import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import Seo from '../components/Seo';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';
import { PLATFORMS } from '../data/products';
import { api } from '../lib/api';

function CartEntry({ item, index }) {
  const { setCount, remove } = useCart();
  const platform = PLATFORMS.find((p) => p.id === item.platformId);
  const Icon = platform?.Icon;

  return (
    <div className="cart-item flex items-center gap-4 p-4 md:p-5 bg-white border-2 border-black shadow-[4px_4px_0px_#000]">
      <span
        className="w-12 h-12 shrink-0 rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]"
        style={{ background: platform?.color ?? '#111', color: '#fff' }}
      >
        {Icon ? <Icon className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono font-black tracking-[0.25em] uppercase text-neutral-400" dir="ltr">
          {item.en}/#{index + 1}
        </p>
        <h3 className="mt-0.5 font-black text-sm md:text-base truncate">
          {item.qty} {item.cat} — {item.platformName}
          {item.sub ? <span className="text-neutral-500 font-bold"> ({item.sub})</span> : null}
        </h3>
        {item.link ? (
          <p className="mt-0.5 text-[11px] font-bold text-[#1d4ed8] truncate" dir="ltr">
            ↳ {item.link}
          </p>
        ) : null}
        <p className="mt-0.5 text-lg font-black tabular-nums" dir="ltr">
          {item.price}
          <span className="text-[10px] font-black text-neutral-500 mr-1">JOD</span>
        </p>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <div className="flex items-center border-2 border-black">
          <button
            onClick={() => setCount(item.key, item.count + 1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#e4f542] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <span className="w-9 text-center text-sm font-black tabular-nums" dir="ltr">
            {item.count}
          </span>
          <button
            onClick={() => setCount(item.key, item.count - 1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => remove(item.key)}
          className="w-9 h-9 flex items-center justify-center border-2 border-black text-black hover:bg-red-500 hover:text-white transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const pageRef = useRef(null);
  const { items, count, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState(null); // لحفظ حالة البوب-أب (success, error, login)

  // دالة إتمام الشراء
  const handleCheckout = async () => {
    if (!user) {
      setPopup({ 
        type: 'login', 
        title: 'عذراً يا برق!', 
        text: 'الرجاء تسجيل الدخول أولاً لإتمام طلبك وربطه بحسابك.' 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items: items.map(it => ({
          productId: it.productId,
          name: `${it.qty} ${it.cat} - ${it.platformName}`,
          price: it.price,
          quantity: it.count,
          link: it.link
        })),
        targetLink: items[0]?.link || ''
      };

      await api.request('/api/orders', {
        method: 'POST',
        body: orderData
      });

      clear(); // إفراغ السلة
      setPopup({ 
        type: 'success', 
        title: 'تم استلام طلبك! 🎉', 
        text: 'راجع بريدك الإلكتروني لتفاصيل التحويل البنكي. يمكنك الآن الانتقال لصفحة طلباتك لرفع إيصال الدفع.' 
      });

    } catch (err) {
      setPopup({ 
        type: 'error', 
        title: 'حدث خطأ!', 
        text: err.message || 'واجهنا مشكلة أثناء معالجة الطلب، حاول مرة أخرى.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useGSAP(() => {
    gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    gsap.fromTo('.cart-bot', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
    gsap.fromTo('.cart-item', { x: () => (window.matchMedia('(min-width: 768px)').matches ? 34 : 0), opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' });
  }, { scope: pageRef, dependencies: [items.length] });

  return (
    <main ref={pageRef} dir="rtl" className="relative w-full min-h-screen bg-white text-black overflow-x-hidden selection:bg-[#e4f542]">
      <Navbar />
      <Seo title="سلة المشتريات | متجر برق" description="سلة مشترياتك في متجر برق." path="/cart" noindex />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 md:pt-40 pb-20">
        <div className="absolute inset-0 dot-grid opacity-30" aria-hidden="true"></div>

        <div className="relative">
          <div className="cart-bot flex items-center gap-3">
            <span className="w-12 h-12 bg-black text-white border-2 border-black flex items-center justify-center rotate-3">
              <ShoppingCart className="w-6 h-6" />
            </span>
            <div>
              <p className="text-[10px] font-mono font-black tracking-[0.3em] uppercase text-neutral-400">
                BARQ CART / {String(count).padStart(2, '0')}_ITEMS
              </p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mt-1">
                سلة<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] via-[#FF3BFF] to-[#e4f542]"> المشتريات</span>
              </h1>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="cart-bot mt-12 border-2 border-black shadow-[10px_10px_0px_#000] bg-white p-12 md:p-20 text-center">
              <span className="inline-flex w-24 h-24 items-center justify-center border-4 border-dashed border-black/20 text-black/20">
                <ShoppingCart className="w-12 h-12" />
              </span>
              <h2 className="mt-6 text-2xl md:text-3xl font-black">سلتك فارغة يا برق ⚡</h2>
              <p className="mt-3 text-sm font-bold text-neutral-500">تصفّح المنتجات وأضِف ما يناسبك.</p>
              <Link to="/products" className="inline-flex items-center gap-2 mt-8 bg-black text-white text-sm font-black uppercase tracking-widest px-8 py-4 border-2 border-black hover:bg-[#407BFF] transition-all">
                تصفّح المنتجات <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 md:gap-8 items-start">
              {/* المنتجات */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[11px] font-mono font-black tracking-widest uppercase text-neutral-400 px-1">
                  <span>Add to cart → check_out</span>
                  <button onClick={clear} className="flex items-center gap-1.5 text-black hover:text-red-600 transition-colors font-sans">
                    <Trash2 className="w-3.5 h-3.5" /> إفراغ الكل
                  </button>
                </div>
                {items.map((it, i) => <CartEntry key={it.key} item={it} index={i} />)}
              </div>

              {/* الملخص */}
              <aside className="cart-bot lg:sticky lg:top-28 bg-white border-2 border-black shadow-[10px_10px_0px_#000] p-6 md:p-7">
                <h2 className="text-lg font-black uppercase tracking-wider">الملخص</h2>
                <div className="mt-5 space-y-3 text-sm font-bold">
                  <div className="flex items-center justify-between"><span className="text-neutral-500">عدد العناصر</span><span className="font-black tabular-nums" dir="ltr">{count}</span></div>
                  <div className="flex items-center justify-between pt-4 border-t-2 border-black"><span className="font-black">الإجمالي</span><span className="text-3xl font-black tabular-nums" dir="ltr">{total.toFixed(2)}<span className="text-[11px] font-black text-neutral-500 mr-1">JOD</span></span></div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-black text-white text-sm font-black uppercase tracking-widest py-4 border-2 border-black shadow-[4px_4px_0px_#000] hover:bg-[#407BFF] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> جاري التنفيذ...</> : <><ShoppingCart className="w-5 h-5" /> إتمام الطلب الآن</>}
                </button>
              </aside>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* البوب-أب الاحترافي بديل הـ alert */}
      {popup && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" dir="rtl">
          <div className="relative w-full max-w-sm bg-white text-black border-2 border-black shadow-[10px_10px_0px_#000] p-8 text-center animate-in fade-in zoom-in duration-200">
            
            {/* الأيقونة حسب الحالة */}
            <div className="flex justify-center mb-4">
              {popup.type === 'success' && <CheckCircle className="w-16 h-16 text-[#25D366]" />}
              {popup.type === 'error' && <AlertTriangle className="w-16 h-16 text-red-500" />}
              {popup.type === 'login' && <ShieldCheck className="w-16 h-16 text-[#407BFF]" />}
            </div>

            <h3 className="text-2xl font-black mb-3">{popup.title}</h3>
            <p className="text-sm font-bold text-neutral-600 leading-relaxed mb-8">{popup.text}</p>
            
            <div className="flex flex-col gap-3">
              {popup.type === 'success' && (
                <button onClick={() => { setPopup(null); navigate('/profile'); }} className="w-full bg-black text-white py-3.5 border-2 border-black font-black uppercase hover:bg-[#e4f542] hover:text-black transition-colors shadow-[3px_3px_0px_#000]">
                  الانتقال لرفع الإيصال
                </button>
              )}
              {popup.type === 'login' && (
                <button onClick={() => { setPopup(null); navigate('/auth'); }} className="w-full bg-black text-white py-3.5 border-2 border-black font-black uppercase hover:bg-[#e4f542] hover:text-black transition-colors shadow-[3px_3px_0px_#000]">
                  تسجيل الدخول
                </button>
              )}
              <button onClick={() => setPopup(null)} className="w-full bg-white text-black py-3 border-2 border-black font-black uppercase hover:bg-neutral-100 transition-colors">
                إغلاق
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
}