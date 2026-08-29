import { useState, useRef } from 'react';
import { Navigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { User, Mail, Phone, Lock, Save, LogOut, Check, ShieldCheck, ShoppingCart } from 'lucide-react';

import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import Seo from '../components/Seo';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';
import ConfirmDialog from '../components/ConfirmDialog';
import OrdersPanel from '../components/OrdersPanel';
import SupportPanel from '../components/SupportPanel';
import NotificationsPanel from '../components/NotificationsPanel';

function Field({ label, icon, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black text-neutral-700">
        {icon}
        {label}
      </span>
      <div className="relative mt-1">{children}</div>
    </label>
  );
}

const inputCls =
  'w-full bg-white border-2 border-black px-4 py-3.5 pl-11 text-sm font-bold outline-none placeholder:text-neutral-300 focus:shadow-[4px_4px_0px_#000] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all duration-150';

function ProfileInner({ user, updateProfile, logout, cartCount, verifyEmail, resendVerification }) {
  const pageRef = useRef(null);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyErr, setVerifyErr] = useState('');
  const [verifyOk, setVerifyOk] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);

  const confirmLogout = () => {
    setLogoutBusy(true);
    Promise.resolve(logout())
      .catch(() => {})
      .finally(() => {
        setLogoutBusy(false);
        setShowLogout(false);
      });
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setVerifyErr('');
    setVerifyOk('');
    setVerifying(true);
    verifyEmail(verifyCode)
      .then(() => setVerifyOk('تم تفعيل بريدك بنجاح ✓'))
      .catch((err) => setVerifyErr(err.message || 'رمز غير صحيح'))
      .finally(() => setVerifying(false));
  };

  const handleResend = () => {
    setVerifyErr('');
    setResendMsg('');
    resendVerification()
      .then((d) => setResendMsg(d?.message || 'تم إرسال رمز جديد'))
      .catch((err) => setVerifyErr(err.message || 'تعذّر الإرسال'));
  };

  useGSAP(() => {
    gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    gsap.fromTo(
      '.profile-bot',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
    );
  }, { scope: pageRef });

  const initial = user.name.trim().charAt(0) || 'ب';

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    updateProfile({ name, phone })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      })
      .catch((err) => setError(err.message));
  };

  const handleLogout = () => {
    setShowLogout(true);
  };

  return (
    <main ref={pageRef} dir="rtl" className="relative w-full min-h-screen bg-white text-black overflow-x-hidden selection:bg-[#e4f542]">
      <Navbar />
      <Seo
        title="بروفايلي | متجر برق — حساباتك كلها بضغطة"
        description="بروفايلك في متجر برق — عدّل اسمك ورقم هاتفك، وبريدك الإلكتروني يبقى ثابتاً."
        path="/profile"
        noindex
      />

      {/* التعديل هنا: زيادة الـ Padding العلوي (pt-40 md:pt-48) لكي لا يختبئ المحتوى أسفل التابات */}
      <div className="relative max-w-7xl mx-auto px-6 pt-40 md:pt-48 pb-20">
        <div className="absolute inset-0 dot-grid opacity-30" aria-hidden="true"></div>

        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 md:gap-8 items-start">
          {/* بطاقة الهوية */}
          <aside className="profile-bot bg-[#101314] text-white border-2 border-black shadow-[12px_12px_0px_#000] p-7 md:p-9 lg:sticky lg:top-36">
            <p className="text-[10px] font-mono font-black tracking-[0.35em] uppercase text-white/50">
              PROFILE / BARQ ID
            </p>

            <div className="mt-8 flex items-center gap-4">
              <span className="w-20 h-20 border-2 border-[#e4f542] bg-black flex items-center justify-center text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] via-[#FF3BFF] to-[#e4f542]">
                {initial}
              </span>
              <div>
                <p className="font-black text-2xl tracking-tighter">{user.name}</p>
                <p className="mt-1 text-xs font-bold text-white/50" dir="ltr">{user.email}</p>
              </div>
            </div>

            <div className="mt-8 space-y-3 text-xs font-bold text-white/70">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#e4f542] shrink-0" />
                بريدك الإلكتروني ثابت وغير قابل للتغيير
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#e4f542] shrink-0" />
                رقم هاتفك يظهر في طلباتك
              </div>
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-4 h-4 text-[#e4f542] shrink-0" />
                سلتك الحالية: <span className="text-white font-black" dir="ltr">{cartCount}</span> عنصر
              </div>
            </div>

            <Link
              to="/cart"
              className="mt-8 inline-flex items-center gap-2 border-2 border-white/25 text-white text-xs font-black uppercase tracking-wider px-5 py-3 hover:bg-white hover:text-black transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              عرض السلة
            </Link>

            <button
              onClick={handleLogout}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-[#e4f542] text-black text-xs font-black uppercase tracking-widest py-3.5 border-2 border-[#e4f542] hover:bg-transparent hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </aside>

          {/* نموذج التعديل */}
          <section className="profile-bot relative bg-white border-2 border-black shadow-[12px_12px_0px_#000] p-6 md:p-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
              بروفايلي
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] to-[#FF3BFF]">
                عدّل بياناتك
              </span>
            </h1>
            <p className="mt-3 text-sm font-bold text-neutral-500">
               يمكنك تعديل اسمك ورقم هاتفك — أما بريدك الإلكتروني فهو ثابت بجزء من هويتك.
            </p>

            {!user.isEmailVerified && (
              <div className="mt-6 border-2 border-[#407BFF] bg-[#eef4ff] p-4">
                <div className="flex items-center gap-2 text-sm font-black text-[#1d4ed8]">
                  <ShieldCheck className="w-4 h-4" />
                  بريدك غير مفعل بعد
                </div>
                <p className="mt-1.5 text-xs font-bold text-neutral-600">
                  أدخل رمز التفعيل الذي أرسلناه إلى بريدك لإكمال التسجيل.
                </p>
                <form onSubmit={handleVerify} className="mt-3 flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    dir="ltr"
                    className="flex-1 border-2 border-black px-4 py-3 text-sm font-bold outline-none focus:shadow-[3px_3px_0px_#000]"
                  />
                  <button
                    type="submit"
                    disabled={verifying}
                    className="bg-black text-white text-xs font-black px-5 py-3 border-2 border-black hover:bg-[#407BFF] transition-colors disabled:opacity-50"
                  >
                    {verifying ? 'جارٍ…' : 'تفعيل'}
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-xs font-black text-[#1d4ed8] px-3 py-3 hover:underline"
                  >
                    {resendMsg || 'إعادة إرسال'}
                  </button>
                </form>
                {verifyErr && <p className="mt-2 text-xs font-black text-red-600">{verifyErr}</p>}
                {verifyOk && <p className="mt-2 text-xs font-black text-green-600">{verifyOk}</p>}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-8 space-y-5 max-w-md">
              <div>
                <Field label="البريد الإلكتروني (ثابت)" icon={<Lock className="w-3.5 h-3.5" />}>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    disabled
                    dir="ltr"
                    className={`${inputCls} bg-neutral-100 text-neutral-500 cursor-not-allowed`}
                  />
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                </Field>
              </div>

              <div>
                <Field label="الاسم الكامل" icon={<User className="w-3.5 h-3.5" />}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: أحمد الزعبي"
                    className={inputCls}
                  />
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
                </Field>
              </div>

              <div>
                <Field label="رقم الهاتف (اختياري)" icon={<Phone className="w-3.5 h-3.5" />}>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+9627xxxxxxxx"
                    dir="ltr"
                    className={inputCls}
                  />
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
                </Field>
              </div>

              {error && (
                <p className="text-xs font-black text-red-600 bg-red-50 border-2 border-red-600 px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-black text-white text-sm font-black uppercase tracking-widest py-4 border-2 border-black hover:bg-[#407BFF] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 transition-all duration-200"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'تم الحفظ ✓' : 'حفظ التعديلات'}
              </button>
            </form>
          </section>
        </div>

        <p className="mt-14 text-center text-[10px] font-mono font-black tracking-[0.4em] uppercase text-neutral-400" dir="ltr">
          BARQ ID v1.0 — email_immutable · phone_optional
        </p>
      </div>

      <Footer />

      <ConfirmDialog
        open={showLogout}
        title="تسجيل الخروج"
        message="هل أنت متأكد من تسجيل الخروج من حسابك؟"
        confirmText="تسجيل الخروج"
        cancelText="إلغاء"
        danger
        busy={logoutBusy}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogout(false)}
      />
    </main>
  );
}

function TabBtn({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-xs md:text-sm font-black uppercase tracking-wider border-2 border-black whitespace-nowrap shrink-0 transition-colors ${
        active ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
      }`}
    >
      {label}
    </button>
  );
}

export default function ProfilePage() {
  const { user, loading, updateProfile, logout, verifyEmail, resendVerification } = useAuth();
  const { count } = useCart();
  const [tab, setTab] = useState('profile');

  if (loading) {
    return (
      <main dir="rtl" className="w-full min-h-screen bg-white flex items-center justify-center">
        <span className="w-10 h-10 rounded-full border-4 border-black border-t-transparent animate-spin" />
      </main>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div>
      {/* التعديل الأهم هنا: إزاحة التابات للأسفل لتبتعد عن الناف بار (top-[72px] md:top-[88px]) 
          مع z-[40] لتنزلق تحت الناف بار عند التمرير، وإخفاء شريط التمرير لأناقة أكثر */}
      <div className="fixed top-[72px] md:top-[88px] left-0 right-0 z-[40] flex gap-2 overflow-x-auto bg-white/95 backdrop-blur-md border-b-2 border-black px-6 py-3 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabBtn active={tab === 'profile'} onClick={() => setTab('profile')} label="الملف الشخصي" />
        <TabBtn active={tab === 'orders'} onClick={() => setTab('orders')} label="طلباتي" />
        <TabBtn active={tab === 'support'} onClick={() => setTab('support')} label="الدعم الفني" />
        <TabBtn active={tab === 'notifications'} onClick={() => setTab('notifications')} label="الإشعارات" />
      </div>

      {tab === 'profile' && (
        <ProfileInner
          key={user.email}
          user={user}
          updateProfile={updateProfile}
          logout={logout}
          cartCount={count}
          verifyEmail={verifyEmail}
          resendVerification={resendVerification}
        />
      )}

      {tab === 'orders' && (
        <PanelPage title="طلباتي">
          <OrdersPanel user={user} />
        </PanelPage>
      )}
      {tab === 'support' && (
        <PanelPage title="الدعم الفني">
          <SupportPanel user={user} />
        </PanelPage>
      )}
      {tab === 'notifications' && (
        <PanelPage title="الإشعارات">
          <NotificationsPanel />
        </PanelPage>
      )}
    </div>
  );
}

function PanelPage({ title, children }) {
  return (
    <main dir="rtl" className="relative w-full min-h-screen bg-white text-black overflow-x-hidden selection:bg-[#e4f542]">
      <Navbar />
      {/* التعديل هنا أيضاً: زيادة الـ Padding العلوي (pt-40 md:pt-48) */}
      <div className="relative max-w-3xl mx-auto px-6 pt-40 md:pt-48 pb-20">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{title}</h1>
        <div className="mt-8">{children}</div>
      </div>
      <Footer />
    </main>
  );
}