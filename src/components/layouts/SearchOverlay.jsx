import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, X, Zap, CornerDownLeft, ArrowRight, ShoppingCart, Check } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { searchProducts, SUGGESTIONS, POPULAR, orderLink, cartItem } from '../../data/products';
import { useCart } from '../../context/useCart';

function ResultRow({ r, onPick, onAdd }) {
  const Icon = r.p.Icon;
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd(cartItem(r.p, r.g, r.item));
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onPick();
      }}
      className="search-result-item group w-full flex items-center gap-4 p-3 text-right border-2 border-transparent hover:border-black hover:bg-neutral-50 cursor-pointer transition-all duration-150"
    >
      <span
        className="relative w-11 h-11 shrink-0 rounded-md border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]"
        style={{ background: r.p.color, color: r.p.dark }}
      >
        <Icon className="w-5 h-5" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-black text-sm truncate">
          {r.g.cat} — {r.p.name}
          {r.g.sub ? <span className="text-neutral-400"> ({r.g.sub})</span> : null}
        </span>
        <span className="block text-[11px] font-bold text-neutral-500 mt-0.5" dir="ltr">
          {r.item.qty} · {r.p.en}/{r.g.cat}
        </span>
      </span>
      <span className="shrink-0 flex items-center gap-2">
        <span className="text-lg font-black tabular-nums" dir="ltr">
          {r.item.price}
          <span className="text-[10px] text-neutral-500 mr-1">JOD</span>
        </span>
        <span className="w-8 h-8 rounded-md border-2 border-black flex items-center justify-center bg-[#e4f542] opacity-0 group-hover:opacity-100 transition-opacity">
          <FaWhatsapp className="w-4 h-4" />
        </span>
        <button
          onClick={handleAdd}
          aria-label={added ? 'أُضيف إلى السلة' : 'أضف إلى السلة'}
          className={`w-8 h-8 rounded-md border-2 border-black flex items-center justify-center shrink-0 transition-all duration-150 ${
            added ? 'bg-[#e4f542]' : 'bg-white hover:bg-[#407BFF] hover:text-white opacity-0 group-hover:opacity-100'
          }`}
        >
          {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
        </button>
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
  const { add } = useCart();

  useGSAP(() => {
    gsap.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(
      '.search-bot',
      { y: -40, scale: 0.94, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.4)', delay: 0.05 }
    );
    requestAnimationFrame(() => inputRef.current?.focus());
  }, { scope: rootRef });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    gsap.fromTo(
      listRef.current?.querySelectorAll('.search-result-item'),
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: 'power3.out', overwrite: true }
    );
  }, [query]);

  const results = searchProducts(query);
  const showSuggestions = query.trim() === '';

  const pick = (r) => {
    window.open(orderLink(r.p, r.g, r.item), '_blank', 'noreferrer');
    onClose();
  };

  const list = showSuggestions ? POPULAR : results;

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
            <p className="text-[10px] text-white/60 font-bold mt-0.5">اكتب ما تريد، وسنوصلك بالبوت عبر واتساب</p>
          </div>
          <span className="flex items-end gap-0.5 h-4">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="eq-bar w-1 bg-[#e4f542]" style={{ height: '100%', animationDelay: `${i * 0.12}s` }}></span>
            ))}
          </span>
          {query && (
            <button
              onClick={() => {
                setQuery('');
                requestAnimationFrame(() => inputRef.current?.focus());
              }}
              className="h-9 shrink-0 flex items-center gap-1.5 border-2 border-white/30 hover:border-white hover:bg-white hover:text-black px-2.5 text-[11px] font-black uppercase tracking-wider text-white/80 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              رجوع
            </button>
          )}
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
            placeholder="ابحث في المنتجات..."
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

        {/* المحتوى */}
        <div ref={listRef} className="overflow-y-auto flex-1">
          {showSuggestions ? (
            <>
              <div className="px-5 pt-4">
                <p className="text-[10px] font-mono font-black tracking-[0.3em] uppercase text-neutral-400">اقتراحات سريعة</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.q}
                      onClick={() => setQuery(s.q)}
                      className="px-3 py-1.5 border-2 border-black text-[11px] font-black shadow-[2px_2px_0px_#000] hover:bg-[#e4f542] transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <p className="mt-5 text-[10px] font-mono font-black tracking-[0.3em] uppercase text-neutral-400">الأكثر طلباً</p>
              </div>
              <div className="p-5 pt-3">
                <div className="border-2 border-black divide-y-2 divide-black/10">
                  {list.map((r, i) => (
                    <ResultRow key={i} r={r} onPick={() => pick(r)} onAdd={add} />
                  ))}
                </div>
              </div>
            </>
          ) : results.length ? (
            <div className="p-4">
              <p className="px-2 pb-2 text-[10px] font-mono font-black tracking-[0.3em] uppercase text-neutral-400">
                {results.length} نتيجة لـ «{query}»
              </p>
              <div className="border-2 border-black divide-y-2 divide-black/10">
                {results.map((r, i) => (
                  <ResultRow key={i} r={r} onPick={() => pick(r)} onAdd={add} />
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
                <p className="mt-1 text-sm font-bold text-neutral-500">جرّب: متابعون، مشاهدات، لايكات، إنستغرام...</p>
              </div>
            </div>
          )}
        </div>

        {/* التذييل */}
        <div className="px-5 py-3 border-t-2 border-black flex items-center justify-between text-[10px] font-mono font-black tracking-widest uppercase text-neutral-400 bg-neutral-50">
          <span>BARQ SEARCH v1.0</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#25D366]"></span>
            متصل بالبوت
          </span>
        </div>
      </div>
    </div>
  );
}