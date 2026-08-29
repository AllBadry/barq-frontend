import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, X, Zap, CornerDownLeft, ArrowRight, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { api } from '../../lib/api'; // استدعاء API متجر برق
import AddToCartButton from '../AddToCartButton';

// مكون عرض صف النتيجة الفردي
function ResultRow({ product }) {
  // مطابقة بيانات المنتج القادمة من الداتا بيز مع ما يحتاجه زر السلة
  const category = product.category || { name: 'متجر برق', enName: 'STORE', color: '#407BFF', dark: '#1d4ed8' };
  
  const formattedPlatform = {
    id: category.slug || 'store',
    name: category.name,
    en: category.enName || 'STORE',
    color: category.color || '#407BFF',
    dark: category.dark || '#1d4ed8',
    Icon: Zap
  };

  const formattedGroup = {
    cat: product.groupName || product.name,
    sub: product.subGroup || null,
    badge: product.badge || null
  };

  const itemData = {
    id: product._id,
    qty: product.qty || '1,000',
    price: product.price
  };

  return (
    <div className="search-result-item group w-full flex items-center gap-4 p-3 text-right border-2 border-transparent hover:border-black hover:bg-neutral-50 cursor-default transition-all duration-150">
      <span
        className="relative w-11 h-11 shrink-0 rounded-md border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]"
        style={{ background: category.color || '#407BFF', color: category.dark || '#fff' }}
      >
        <Zap className="w-5 h-5" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-black text-sm truncate">
          {product.name}
          {product.subGroup ? <span className="text-neutral-400"> ({product.subGroup})</span> : null}
        </span>
        <span className="block text-[11px] font-bold text-neutral-500 mt-0.5" dir="ltr">
          {product.qty} · {category.enName || 'STORE'} / {category.name}
        </span>
      </span>
      <span className="shrink-0 flex items-center gap-2">
        <span className="text-lg font-black tabular-nums" dir="ltr">
          {product.price}
          <span className="text-[10px] text-neutral-500 mr-1">JOD</span>
        </span>
        <AddToCartButton p={formattedPlatform} g={formattedGroup} item={itemData} compact />
      </span>
    </div>
  );
}

export default function SearchOverlay({ onClose }) {
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // أنيميشن الفتح والإغلاق
  useGSAP(() => {
    gsap.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(
      '.search-bot',
      { y: -40, scale: 0.94, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.4)', delay: 0.05 }
    );
    requestAnimationFrame(() => inputRef.current?.focus());
  }, { scope: rootRef });

  // إغلاق النافذة عبر زر ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // جلب النتائج من الباك إند مع تأخير زمني (Debounce) لمنع الطلبات المفرطة
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.request(`/api/products/search?q=${encodeURIComponent(query)}`, { method: 'GET' });
        if (res && res.data) {
          setResults(res.data.products || []);
        }
      } catch (err) {
        console.error('فشل البحث في السيرفر:', err);
      } finally {
        setLoading(false);
      }
    }, 300); // تأخير 300 ملي ثانية أثناء الكتابة

    return () => clearTimeout(timer);
  }, [query]);

  // أنيميشن ظهور النتائج عند تغيرها
  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(
        listRef.current.querySelectorAll('.search-result-item'),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: 'power3.out', overwrite: true }
      );
    }
  }, [results, query]);

  const showSuggestions = query.trim() === '';

  return (
    <div ref={rootRef} dir="rtl" className="fixed inset-0 z-[130] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 md:pt-28 px-4" role="dialog" aria-modal="true">
      <div
        ref={cardRef}
        className="search-bot w-full max-w-xl bg-white border-4 border-black shadow-[12px_12px_0px_#000] flex flex-col max-h-[72vh]"
      >
        {/* رأس البوت */}
        <div className="flex items-center gap-3 px-5 py-4 bg-[#111] text-white">
          <span className="w-9 h-9 shrink-0 bg-[#e4f542] text-black border-2 border-black flex items-center justify-center rotate-3 mr-1">
            <Zap className="w-5 h-5 fill-current" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black uppercase tracking-widest">Barbot — البحث في المنتجات</p>
            <p className="text-[10px] text-white/60 font-bold mt-0.5">ابحث عن أي باقة في متجر برق لحظياً</p>
          </div>
          {loading && <Loader2 className="w-5 h-5 animate-spin text-[#e4f542]" />}
          <button
            onClick={onClose}
            className="w-9 h-9 shrink-0 border-2 border-white/30 hover:border-white hover:bg-white hover:text-black flex items-center justify-center transition-all"
            aria-label="إغلاق البحث"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* حقل البحث */}
        <div className="relative border-b-4 border-black">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن متابعين، مشاهدات، لايكات..."
            className={`w-full bg-white text-black font-black text-lg py-4 outline-none placeholder:text-neutral-300 transition-all ${query ? 'pr-20 pl-4' : 'pr-12 pl-4'}`}
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                requestAnimationFrame(() => inputRef.current?.focus());
              }}
              className="absolute right-11 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center border-2 border-transparent hover:border-black hover:bg-neutral-100 text-neutral-400 hover:text-black transition-all"
              aria-label="مسح البحث"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="absolute left-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 text-[10px] font-mono font-black border-2 border-black px-1.5 py-0.5 text-neutral-400">
            <CornerDownLeft className="w-3 h-3" />
            ESC
          </kbd>
        </div>

        {/* النتائج والمحتوى */}
        <div ref={listRef} className="overflow-y-auto flex-1 p-4">
          {showSuggestions ? (
            <div className="py-8 text-center text-neutral-400">
              <p className="text-xs font-bold uppercase tracking-widest">ابدأ الكتابة للبحث عن الباقات في قاعدة البيانات...</p>
            </div>
          ) : results.length > 0 ? (
            <div>
              <p className="px-2 pb-2 text-[10px] font-mono font-black tracking-[0.3em] uppercase text-neutral-400">
                {results.length} نتيجة مطابقة لـ «{query}»
              </p>
              <div className="border-2 border-black divide-y-2 divide-black/10">
                {results.map((product) => (
                  <ResultRow key={product._id} product={product} />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid place-items-center h-full py-16 text-center px-6">
              <div>
                <span className="inline-flex w-16 h-16 items-center justify-center border-4 border-dashed border-black/20 text-3xl">
                  ∅
                </span>
                <p className="mt-4 font-black text-lg">لا توجد نتائج لـ «{query}»</p>
                <p className="mt-1 text-sm font-bold text-neutral-500">تأكد من كتابة الكلمة بشكل صحيح أو جرّب كلمات أخرى.</p>
              </div>
            </div>
          )}
        </div>

        {/* التذييل */}
        <div className="px-5 py-3 border-t-2 border-black flex items-center justify-between text-[10px] font-mono font-black tracking-widest uppercase text-neutral-400 bg-neutral-50">
          <span>BARQ LIVE SEARCH</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse"></span>
            متصل بقاعدة البيانات
          </span>
        </div>
      </div>
    </div>
  );
}