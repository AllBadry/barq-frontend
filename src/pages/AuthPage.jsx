import { useState, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Zap, Mail, Lock, User, Phone, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaTiktok } from 'react-icons/fa';

import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import Seo from '../components/Seo';
import { useAuth } from '../context/useAuth';

const BLOB = 'radial-gradient(circle at center, transparent 0 58%, rgba(255,255,255,0.14) 60% 100%)';

function FieldLabel({ icon, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black text-neutral-700">
        {icon}
        {children}
      </span>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function AuthPage() {
  const pageRef = useRef(null);
  const pillRef = useRef(null);
  const watermarkRef = useRef(null);
  const headingRef = useRef(null);
  const fieldsRef = useRef(null);
  const brandInnerRef = useRef(null);
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyAddr, setVerifyAddr] = useState('');
  const [resending, setResending] = useState(false);
  const { user, loading, register, login, verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();

  const isLogin = mode === 'login';
  const showVerify = mode === 'verify' || (user && !user.isEmailVerified);

  const switchMode = (next) => {
    if (next === mode) return;
    setError('');
    setVerifyCode('');
    setMode(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login({ email, password });
        navigate('/profile', { replace: true });
      } else {
        await register({ name, email, phone: whatsapp, password });
        setVerifyAddr(email);
        setMode('verify');
      }
    } catch (err) {
      const msg = err.message || 'حدث خطأ أثناء العملية';
      // إن كان الحساب غير مفعل، السيرفر أرسل رمزاً جديداً — نوجّه لشاشة التفعيل
      if (isLogin && /تفعيل|verify/i.test(msg)) {
        setVerifyAddr(email);
        setMode('verify');
        setError('تم إرسال رمز تفعيل جديد إلى بريدك — أدخله لتفعيل حسابك');
      } else {
        setError(msg);
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await verifyEmail(verifyCode);
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(err.message || 'رمز التفعيل غير صحيح');
    }
  };

  const handleResend = async () => {
    setError('');
    setResending(true);
    try {
      const data = await resendVerification();
      setError(data?.message ? `✔ ${data.message}` : 'تم إرسال رمز جديد إلى بريدك');
    } catch (err) {
      setError(err.message || 'تعذّر إعادة إرسال الرمز');
    } finally {
      setResending(false);
    }
  };

  useGSAP(() => {
    gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    gsap.fromTo(
      '.auth-bot-appear',
      { y: 46, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' }
    );
    gsap.fromTo(
      '.auth-brand-appear',
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power4.inOut', delay: 0.15 }
    );
  }, { scope: pageRef });

  useGSAP(() => {
    if (isLogin) {
      gsap.to(pillRef.current, { x: '0%', duration: 0.55, ease: 'power4.inOut' });
      watermarkRef.current && (watermarkRef.current.textContent = 'LOGIN');
    } else {
      gsap.to(pillRef.current, { x: '-100%', duration: 0.55, ease: 'power4.inOut' });
      watermarkRef.current && (watermarkRef.current.textContent = 'SIGNUP');
    }
    gsap.fromTo(
      headingRef.current,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power4.out' }
    );
    gsap.fromTo(
      fieldsRef.current?.querySelectorAll('.auth-field'),
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out', overwrite: true }
    );
  }, { scope: pageRef, dependencies: [mode] });

  useGSAP(() => {
    if (!brandInnerRef.current) return;
    const xTo = gsap.quickTo(brandInnerRef.current, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(brandInnerRef.current, 'y', { duration: 0.6, ease: 'power3.out' });
    const onMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      xTo(nx * 28);
      yTo(ny * 22);
    };
    const el = brandInnerRef.current;
    el.addEventListener('pointermove', onMove);
    return () => el.removeEventListener('pointermove', onMove);
  }, { scope: brandInnerRef });

  const inputCls =
    'auth-field w-full bg-white border-2 border-black px-4 py-3.5 pl-11 text-sm font-bold outline-none placeholder:text-neutral-300 focus:shadow-[4px_4px_0px_#000] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all duration-150';

  if (loading) return null;

  if (user && user.isEmailVerified) return <Navigate to="/profile" replace />;

  return (
    <main ref={pageRef} dir="rtl" className="relative w-full min-h-screen bg-white text-black overflow-x-hidden selection:bg-[#e4f542]">
      <Navbar />
      <Seo
        title="دخول النظام | متجر برق — حساباتك كلها بضغطة"
        description="سجّل دخولك أو أنشئ حساباً جديداً في متجر برق لمتابعة طلباتك وأكوادك على إنستغرام وفيسبوك وتيك توك."
        path="/auth"
        noindex
      />

      <div className="relative max-w-7xl mx-auto px-6 py-14 md:py-20">
        {/* شبكة خلفية */}
        <div className="absolute inset-0 dot-grid opacity-30" aria-hidden="true"></div>

        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-6 md:gap-8 items-stretch">
          {/* ====== لوحة العلامة التجارية ====== */}
          <section className="auth-brand-appear relative overflow-hidden bg-[#101314] text-white border-2 border-black shadow-[12px_12px_0px_#000] min-h-[380px] lg:min-h-[640px] flex flex-col">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '22px 22px' }}></div>
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full shape-spin" style={{ ['--r']: '18s', background: BLOB }}></div>
            <div className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full shape-spin-rev" style={{ ['--r']: '26s', background: BLOB }}></div>

            <div ref={brandInnerRef} className="relative flex-1 flex flex-col p-7 md:p-10">
              {/* الشعار الكبير */}
              <div className="flex items-center gap-4">
                <span className="orbit-spin w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[#e4f542] bg-black flex items-center justify-center" style={{ ['--r']: '16s' }}>
                  <Zap className="w-8 h-8 md:w-9 md:h-9 text-[#e4f542] fill-current" />
                </span>
                <div>
                  <p className="font-black text-2xl md:text-3xl tracking-tighter lowercase" dir="ltr">
                    BARQ<span className="text-[#e4f542]"> STORE</span>
                  </p>
                  <p className="text-[10px] font-mono font-black tracking-[0.35em] uppercase text-white/50 mt-1">
                    Growth · Followers · Fire
                  </p>
                </div>
              </div>

              {/* جملة الترحيب */}
              <div className="mt-10 md:mt-14">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e4f542]/40 text-[#e4f542] text-[10px] font-black uppercase tracking-[0.3em]">
                  <Sparkles className="w-3 h-3" />
                  نظام حسابات بَرْق
                </span>
                <h1 className="mt-7 text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter">
                  حساباتك
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] via-[#FF3BFF] to-[#e4f542]">
                    كلها بضغطة
                  </span>
                </h1>
                <p className="mt-6 max-w-sm text-sm md:text-base font-medium text-white/60 leading-relaxed">
                  تابع طلباتك، اسحب أكوادك، وراقب نمو حساباتك على إنستغرام وفيسبوك وتيك توك كلها من مكان واحد.
                </p>
              </div>

              {/* مميزات سريعة */}
              <ul className="mt-8 md:mt-10 space-y-2.5 text-xs font-bold text-white/70 max-w-sm">
                {['فلترة فورية لكل طلباتك', 'تأكيد تسليم لحظي عبر واتساب', '100% حفظ للبيانات تشفيراً'].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#e4f542] shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>

              {/* أيقونات عائمة + موسيقى */}
              <div className="mt-auto pt-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {[FaInstagram, FaTiktok, FaWhatsapp].map((Ic, i) => (
                    <span key={i} className="drifty w-10 h-10 border border-white/15 bg-white/5 flex items-center justify-center rounded-full" style={{ ['--dd']: `${4 + i}s`, ['--dr']: `${i * 4}deg` }}>
                      <Ic className="w-4 h-4" />
                    </span>
                  ))}
                </div>
                <div className="flex items-end gap-1 h-8" dir="ltr">
                  {[4, 7, 5, 9, 6, 8, 5].map((h, i) => (
                    <span key={i} className="eq-bar w-1.5 bg-gradient-to-t from-[#407BFF] to-[#FF3BFF]" style={{ height: `${h * 10}%`, animationDelay: `${i * 0.13}s` }}></span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ====== نموذج الدخول/الحساب ====== */}
          <section className="relative bg-white border-2 border-black shadow-[12px_12px_0px_#000] p-6 md:p-10 lg:p-12 flex items-center">
            {/* علامة مائية ضخمة */}
            <span
              ref={watermarkRef}
              dir="ltr"
              className="pointer-events-none absolute -top-8 left-0 text-[11rem] md:text-[16rem] font-black leading-none text-transparent select-none whitespace-nowrap"
              style={{ WebkitTextStroke: '2px rgba(0,0,0,0.06)' }}
            >
              LOGIN
            </span>

            <div ref={fieldsRef} className="relative w-full max-w-md mx-auto">
              <div className="auth-bot-appear text-[10px] font-mono font-black tracking-[0.35em] uppercase text-neutral-400">
                AUTH / {isLogin ? '01' : '02'}
              </div>

              {/* ====== زر التبديل الرهيب ====== */}
              <div className="auth-bot-appear relative mt-4 grid grid-cols-2 border-2 border-black bg-white select-none">
                <span ref={pillRef} className="absolute inset-y-0 right-0 w-1/2 bg-black z-0 overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-l from-[#407BFF] via-[#FF3BFF] to-purple-500 opacity-80"></span>
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#e4f542] rotate-45"></span>
                </span>
                <button
                  onClick={() => switchMode('login')}
                  className={`relative z-10 py-4 text-sm font-black uppercase tracking-wider transition-colors duration-300 ${isLogin ? 'text-white' : 'text-black hover:bg-neutral-100'}`}
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => switchMode('register')}
                  className={`relative z-10 py-4 text-sm font-black uppercase tracking-wider transition-colors duration-300 ${!isLogin ? 'text-white' : 'text-black hover:bg-neutral-100'}`}
                >
                  إنشاء حساب
                </button>
              </div>

              {/* العنوان المتغير */}
               <h2 ref={headingRef} className="mt-9 text-4xl md:text-5xl font-black tracking-tighter leading-none">
                 {showVerify ? (
                   <>
                     فعّل بريدك
                     <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] to-[#e4f542]">رمز التفعيل</span>
                   </>
                 ) : isLogin ? (
                   <>
                     أهلًا بعودتك
                     <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#407BFF] to-[#FF3BFF]">تسجيل الدخول</span>
                   </>
                 ) : (
                   <>
                     ابدأ رحلتك
                     <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FF3BFF] to-[#e4f542]">إنشاء حساب جديد</span>
                   </>
                 )}
               </h2>
               <p className="mt-3 text-sm font-bold text-neutral-500">
                 {showVerify
                   ? 'أدخلنا رمز التفعيل في بريدك الإلكتروني لإكمال التسجيل.'
                   : isLogin
                   ? 'سجّل دخولك للمتابعة من حيث توقفت.'
                   : 'دقيقة واحدة وتبدأ التوفير والتتبع.'}
               </p>

{/* الحقول */}
               {showVerify ? (
                 <form onSubmit={handleVerify} className="auth-body mt-8 space-y-4">
                   <div>
                     <FieldLabel icon={<ShieldCheck className="w-3.5 h-3.5" />}>رمز التفعيل (6 أرقام)</FieldLabel>
                     <div className="relative mt-1">
                       <input
                         type="text"
                         inputMode="numeric"
                         value={verifyCode}
                         onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                         placeholder="123456"
                         dir="ltr"
                         className={inputCls}
                       />
                       <ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
                     </div>
                     <p className="mt-2 text-xs font-bold text-neutral-500">
                       أرسلنا الرمز إلى{' '}
                       <span dir="ltr" className="font-black text-black">{verifyAddr || (user && user.email) || 'بريدك'}</span>{' '}
                       — تحقق من صندوق الوارد ومجلد البريد المزعج (Spam).
                     </p>
                   </div>

                   {error && (
                     <p className="text-xs font-black text-red-600 bg-red-50 border-2 border-red-600 px-3 py-2">{error}</p>
                   )}

                   <button
                     type="submit"
                     className="auth-field w-full mt-2 flex items-center justify-center gap-2 bg-black text-white text-sm font-black uppercase tracking-widest py-4 border-2 border-black hover:bg-neutral-800 hover:shadow-[6px_6px_0px_#e4f542] hover:-translate-y-0.5 transition-all duration-200"
                   >
                     <ShieldCheck className="w-4 h-4" />
                     فعّل بريدي
                     <ArrowLeft className="w-4 h-4" />
                   </button>

                   <button
                     type="button"
                     onClick={handleResend}
                     disabled={resending}
                     className="text-[11px] font-black text-neutral-400 hover:text-[#407BFF] transition-colors"
                   >
                     {resending ? 'جارٍ الإرسال…' : 'إعادة إرسال الرمز'}
                   </button>
                 </form>
               ) : (
               <form onSubmit={handleSubmit} className="auth-body mt-8 space-y-4">
                {!isLogin && (
                  <div>
                    <FieldLabel icon={<User className="w-3.5 h-3.5" />}>الاسم الكامل</FieldLabel>
                    <div className="relative mt-1">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: أحمد الزعبي"
                        className={inputCls}
                      />
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
                    </div>
                  </div>
                )}

                <div>
                  <FieldLabel icon={<Mail className="w-3.5 h-3.5" />}>البريد الإلكتروني</FieldLabel>
                  <div className="relative mt-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      dir="ltr"
                      className={inputCls}
                    />
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <FieldLabel icon={<Phone className="w-3.5 h-3.5" />}>واتساب (اختياري)</FieldLabel>
                    <div className="relative mt-1">
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+9627xxxxxxxx"
                        dir="ltr"
                        className={inputCls}
                      />
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <FieldLabel icon={<Lock className="w-3.5 h-3.5" />}>كلمة المرور</FieldLabel>
                    {isLogin && (
                      <button type="button" className="text-[11px] font-black text-neutral-400 hover:text-[#407BFF] transition-colors">
                        نسيت كلمة المرور؟
                      </button>
                    )}
                  </div>
                  <div className="relative mt-1">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      dir="ltr"
                      className={inputCls}
                    />
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
                  </div>
                </div>

                {error && (
                  <p className="text-xs font-black text-red-600 bg-red-50 border-2 border-red-600 px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="auth-field w-full mt-2 flex items-center justify-center gap-2 bg-black text-white text-sm font-black uppercase tracking-widest py-4 border-2 border-black hover:bg-neutral-800 hover:shadow-[6px_6px_0px_#e4f542] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  {isLogin ? 'ادخُل الآن' : 'أنشئ الحساب'}
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {isLogin && (
                  <button
                    type="button"
                    onClick={() => { setVerifyAddr(email); switchMode('verify'); }}
                    className="block w-full text-center text-[11px] font-black text-neutral-400 hover:text-[#407BFF] transition-colors"
                  >
                    لدي رمز تفعيل؟ ادخله هنا
                  </button>
                )}
               </form>
               )}

               {/* الفاصل */}
              <div className="auth-bot-appear mt-7 flex items-center gap-3">
                <span className="flex-1 h-0.5 bg-black/10"></span>
                <span className="text-[10px] font-mono font-black tracking-[0.3em] uppercase text-neutral-400">أو</span>
                <span className="flex-1 h-0.5 bg-black/10"></span>
              </div>

              {/* زر جوجل (واجهة فقط — غير مفعّل بعد) */}
              <div className="auth-bot-appear mt-6">
                <button
                  type="button"
                  onClick={() => {}}
                  className="group relative w-full flex items-center justify-center gap-3 border-2 border-black bg-white text-sm font-black py-3.5 hover:bg-neutral-50 hover:shadow-[5px_5px_0px_#000] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <GoogleIcon />
                  <span>المتابعة بحساب Google</span>
                  <span className="absolute -top-3 -left-3 px-2 py-0.5 bg-[#e4f542] text-black text-[9px] font-black uppercase tracking-widest border-2 border-black rotate-[-4deg]">
                    قريباً
                  </span>
                </button>
              </div>

              <p className="auth-bot-appear mt-8 text-[10px] font-mono font-black tracking-widest uppercase text-neutral-300 text-center">
                بتسجيلك فأنت توافق على شروط الاستخدام الخدمة — Frontend only v0.1
              </p>
            </div>
          </section>
        </div>

      </div>

      <Footer />
    </main>
  );
}