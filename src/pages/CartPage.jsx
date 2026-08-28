import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ShoppingCart, Plus, Minus, Trash2, Zap, ArrowLeft, ShieldCheck } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import Seo from '../components/Seo';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';
import { PLATFORMS, WA } from '../data/products';

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
            aria-label="زيادة الكمية"
          >
            <Plus className="w-4 h-4" />
          </button>
          <span className="w-9 text-center text-sm font-black tabular-nums" dir="ltr">
            {item.count}
          </span>
          <button
            onClick={() => setCount(item.key, item.count - 1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 transition-colors"
            aria-label="تقليل الكمية"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => remove(item.key)}
          className="w-9 h-9 flex items-center justify-center border-2 border-black text-black hover:bg-red-500 hover:text-white transition-colors"
          aria-label="حذف المنتج"
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

  useGSAP(() => {
    gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    gsap.fromTo(
      '.cart-bot',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
    );
    gsap.fromTo(
      '.cart-item',
      { x: () => (window.matchMedia('(min-width: 768px)').matches ? 34 : 0), opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }
    );
  }, { scope: pageRef, dependencies: [items.length] });

  const checkoutHref = () => {
    const lines = items.map(
      (it, i) =>
        `${i + 1}) ${it.qty} ${it.cat} — ${it.platformName}${it.sub ? ` (${it.sub})` : ''} — ${it.price} JOD${it.count > 1 ? ` ×${it.count}` : ''}`
    );
    const msg = [
      'مرحباً برق، أريد إتمام طلب من السلة:',
      ...lines,
      '',
      `الإجمالي: ${total.toFixed(2)} JOD`,
      ...(user
        ? ['', `الاسم: ${user.name}`, `واتساب: ${user.phone || 'غير مضاف'}`, `الإيميل: ${user.email}`]
        : []),
    ].join('\n');
    return `${WA}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <main ref={pageRef} dir="rtl" className="relative w-full min-h-screen bg-white text-black overflow-x-hidden selection:bg-[#e4f542]">
      <Navbar />
      <Seo
        title="سلة المشتريات | متجر برق"
        description="سلة مشترياتك في متجر برق — مراجعة طلباتك وإتمامها بضغطة واحدة عبر واتساب."
        path="/cart"
        noindex
      />

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
              <p className="mt-3 text-sm font-bold text-neutral-500">
                تصفّح المنتجات وأضِف ما يناسبك — متابعون، مشاهدات، لايكات لكل المنصات.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-8 bg-black text-white text-sm font-black uppercase tracking-widest px-8 py-4 border-2 border-black hover:bg-[#407BFF] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 transition-all duration-200"
              >
                تصفّح المنتجات
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 md:gap-8 items-start">
              {/* المنتجات */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[11px] font-mono font-black tracking-widest uppercase text-neutral-400 px-1">
                  <span>Add to cart → check_out via whatsapp</span>
                  <button
                    onClick={clear}
                    className="flex items-center gap-1.5 text-black hover:text-red-600 transition-colors font-sans"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    إفراغ الكل
                  </button>
                </div>
                {items.map((it, i) => (
                  <CartEntry key={it.key} item={it} index={i} />
                ))}
              </div>

              {/* الملخص */}
              <aside className="cart-bot lg:sticky lg:top-28 bg-white border-2 border-black shadow-[10px_10px_0px_#000] p-6 md:p-7">
                <h2 className="text-lg font-black uppercase tracking-wider">الملخص</h2>

                <div className="mt-5 space-y-3 text-sm font-bold">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">عدد العناصر</span>
                    <span className="font-black tabular-nums" dir="ltr">{count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">عدد الطلبات</span>
                    <span className="font-black tabular-nums" dir="ltr">{items.length}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t-2 border-black">
                    <span className="font-black">الإجمالي</span>
                    <span className="text-3xl font-black tabular-nums" dir="ltr">
                      {total.toFixed(2)}
                      <span className="text-[11px] font-black text-neutral-500 mr-1">JOD</span>
                    </span>
                  </div>
                </div>

                <a
                  href={checkoutHref()}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-[#25D366] text-black text-sm font-black uppercase tracking-widest py-4 border-2 border-black shadow-[4px_4px_0px_#000] hover:bg-[#1db954] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  إتمام الطلب عبر واتساب
                </a>

                <p className="mt-4 text-[11px] font-bold text-neutral-500 leading-relaxed">
                  {user ? (
                    <>
                      سيُرفق الطلب باسمك ورقمك ({user.name}
                      {user.phone ? ` — ${user.phone}` : ''}).
                    </>
                  ) : (
                    <>
                      <Link to="/auth" className="underline font-black text-black">سجّل دخولك</Link> ليُرفق الطلب باسمك ورقمك تلقائياً.
                    </>
                  )}
                </p>

                <div className="mt-5 flex items-center gap-2 text-[10px] font-mono font-black tracking-widest uppercase text-neutral-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                  تفعيل فوري · ضمان كامل
                </div>
              </aside>
            </div>
          )}

          {items.length > 0 && (
            <p className="mt-14 text-center text-[10px] font-mono font-black tracking-[0.4em] uppercase text-neutral-400" dir="ltr">
              BARQ CART v1.0 — NO REFUNDS AFTER 30 DAYS
            </p>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}