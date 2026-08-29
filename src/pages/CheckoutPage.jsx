import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import Seo from '../components/Seo';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';
import { api } from '../lib/api';

export default function CheckoutPage() {
  const pageRef = useRef(null);
  const { items, total, clear } = useCart();
  const { user } = useAuth();

  const [email, setEmail] = useState(user ? user.email || '' : '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  useGSAP(() => {
    gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 });
  }, { scope: pageRef });

  if (!user) {
    return (
      <main dir="rtl" className="w-full min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-xl font-black">سجّل الدخول لإتمام الطلب</p>
          <Link to="/auth" className="mt-4 inline-block bg-black text-white px-6 py-3 border-2 border-black hover:bg-[#407BFF]">تسجيل الدخول</Link>
        </div>
      </main>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!items.length) return setError('سلتك فارغة');

    const missing = items.filter((it) => !it.link || !it.link.trim());
    if (missing.length) return setError('الرجاء إدخال الرابط المستهدف لكل عنصر في السلة');
    const targetLink = items.map((it) => it.link.trim()).find(Boolean);

    const orderItems = items.map((it) => ({
      name: `${it.qty} ${it.cat} — ${it.platformName}${it.sub ? ` (${it.sub})` : ''}`,
      price: parseFloat(it.price),
      quantity: it.count,
      link: it.link.trim(),
    }));

    setBusy(true);
    try {
      const res = await api.request('/api/orders', {
        method: 'POST',
        body: { items: orderItems, targetLink, customerEmail: email || user.email },
      });
      setDone(res.data.order);
      clear();
    } catch (err) {
      setError(err.message || 'فشل إنشاء الطلب');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main ref={pageRef} dir="rtl" className="relative w-full min-h-screen bg-white text-black overflow-x-hidden selection:bg-[#e4f542]">
      <Navbar />
      <Seo
        title="إتمام الطلب | متجر برق"
        description="راجع تفاصيل طلبك وأكمل عملية الدفع بأمان في متجر برق — تفعيل فوري وضمان كامل."
        path="/checkout"
        noindex
      />
      <div className="relative max-w-3xl mx-auto px-6 pt-32 md:pt-40 pb-20">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-[#407BFF]">
          <ArrowLeft className="w-4 h-4" /> العودة للسلة
        </Link>

        <h1 className="mt-6 text-4xl md:text-5xl font-black tracking-tighter">إتمام الطلب</h1>

        {done ? (
          <div className="mt-10 border-2 border-black shadow-[10px_10px_0px_#000] bg-white p-10 text-center">
            <ShieldCheck className="w-12 h-12 mx-auto text-[#25D366]" />
            <h2 className="mt-4 text-2xl font-black">تم استلام طلبك ✅</h2>
            <p className="mt-2 text-sm font-bold text-neutral-500">رقم الطلب: #{String(done._id).slice(-6)}</p>
            <p className="mt-3 text-sm font-bold text-neutral-600">
              تحقق من إيميلك لتفاصيل التحويل البنكي (بنك الاتحاد). بعد التحويل ارفع الإيصال من صفحة بروفايلك.
            </p>
            <Link to="/profile" className="mt-6 inline-block bg-black text-white px-6 py-3 border-2 border-black hover:bg-[#407BFF]">الذهاب لبروفايلي</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
            <div className="space-y-4">
              <div className="border-2 border-black shadow-[6px_6px_0px_#000] bg-white p-5">
                <h2 className="font-black text-lg">المنتجات</h2>
                {items.map((it, i) => (
                  <div key={i} className="mt-3 flex items-center justify-between border-t border-black/10 pt-3 text-sm">
                    <span className="font-bold">{it.qty} {it.cat} — {it.platformName}</span>
                    <span className="font-black tabular-nums" dir="ltr">{it.price} JOD</span>
                  </div>
                ))}
              </div>

              <div className="border-2 border-black bg-neutral-50 p-3 text-xs font-bold text-neutral-600">
                الروابط المستهدفة مضبوطة لكل عنصر في السلة — يمكنك مراجعتها من صفحة السلة قبل الدفع.
              </div>

              <label className="block">
                <span className="text-[11px] font-black text-neutral-700">البريد الإلكتروني لتأكيد التحويل</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  className="mt-1 w-full bg-white border-2 border-black px-4 py-3.5 text-sm font-bold outline-none focus:shadow-[4px_4px_0px_#000]"
                />
              </label>
            </div>

            <aside className="lg:sticky lg:top-28 bg-white border-2 border-black shadow-[10px_10px_0px_#000] p-6">
              <h2 className="text-lg font-black uppercase tracking-wider">الملخص</h2>
              <div className="mt-4 flex items-center justify-between text-sm font-bold">
                <span className="text-neutral-500">الإجمالي</span>
                <span className="text-3xl font-black tabular-nums" dir="ltr">{total.toFixed(2)} <span className="text-[11px]">JOD</span></span>
              </div>

              <div className="mt-4 border-2 border-[#25D366] bg-[#f0fff5] p-3 text-xs font-bold text-neutral-700 leading-relaxed">
                🏦 الدفع عبر تحويل بنكي — بنك الاتحاد. ستصلك تفاصيل الحساب على بريدك فوراً.
              </div>

              {error && <p className="mt-3 text-xs font-black text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-[#25D366] text-black text-sm font-black uppercase tracking-widest py-4 border-2 border-black shadow-[4px_4px_0px_#000] hover:bg-[#1db954] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 transition-all disabled:opacity-60"
              >
                {busy ? 'جارٍ الإنشاء…' : 'إنشاء الطلب وتحويل البنك'}
              </button>

            </aside>
          </form>
        )}
      </div>
      <Footer />
    </main>
  );
}
