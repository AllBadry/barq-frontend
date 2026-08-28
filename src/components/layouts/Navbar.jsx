import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, ShoppingCart, User, Menu, X, Zap } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

const LINKS = [
  { to: '/#home', label: 'الرئيسية' },
  { to: '/products', label: 'المنتجات' },
  { to: '/about', label: 'من نحن' },
  { to: '/contact', label: 'التواصل' },
];

export default function Navbar() {
  const navRef = useRef();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const close = () => setOpen(false);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.out',
    });
  }, { scope: navRef });

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[100] w-full bg-white text-black border-b-2 border-black"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
        
        {/* الشعار - زوايا حادة تماماً */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer select-none group" dir="ltr">
          <div className="w-10 h-10 bg-black text-white border-2 border-black flex items-center justify-center font-black group-hover:bg-[#3b82f6] transition-colors">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase">
            BARQ<span className="text-[#3b82f6]"> STORE</span>
          </span>
        </Link>

        {/* روابط التنقل - حادة ونظيفة (ديسكتوب) */}
        <ul className="hidden md:flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-neutral-700">
          {LINKS.map((l, i) => (
            <li key={i}>
              <Link to={l.to} className="px-5 py-2.5 hover:text-black hover:bg-neutral-100 border border-transparent hover:border-black transition-all inline-block">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* الإجراءات والأزرار - حواف قائمة 100% */}
        <div className="flex items-center gap-3">
          <button onClick={() => setSearchOpen(true)} className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-neutral-100 transition-all" aria-label="بحث">
            <Search className="w-4 h-4" />
          </button>

          <Link to="/#offers" className="relative w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-neutral-100 transition-all">
            <ShoppingCart className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600"></span>
          </Link>

          <Link to="/auth" className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all">
            <User className="w-3.5 h-3.5" />
            <span>دخول النظام</span>
          </Link>

          <button className="md:hidden w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black" onClick={() => setOpen(!open)} aria-label="القائمة">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* قائمة الجوال: تفتح بزر الخطوط الثلاثة */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b-2 border-black shadow-[0_20px_30px_rgba(0,0,0,0.15)] z-50">
          <ul className="p-4 pb-2 space-y-1">
            {LINKS.map((l, i) => (
              <li key={i}>
                <Link
                  to={l.to}
                  onClick={close}
                  className="flex items-center justify-between px-5 py-4 text-sm font-black hover:bg-neutral-100 transition-all group border border-transparent hover:border-black"
                >
                  {l.label}
                  <span className="w-2 h-2 bg-black group-hover:bg-[#e4f542] transition-colors"></span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="p-4 pt-2 flex items-stretch gap-3">
            <Link
              to="/auth"
              onClick={close}
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white text-xs font-black uppercase tracking-wider px-6 py-3.5 hover:bg-neutral-800 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>دخول النظام</span>
            </Link>
            <Link
              to="/#offers"
              onClick={close}
              className="relative w-12 h-12 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-neutral-100 transition-all shrink-0"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600"></span>
            </Link>
          </div>
        </div>
      )}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </nav>
  );
}