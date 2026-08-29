import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/useCart';
import { cartItem, linkGuide } from '../data/products';

export default function AddToCartButton({ p, g, item, compact = false }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(false);
  const [link, setLink] = useState('');
  const [err, setErr] = useState('');
  const guide = linkGuide(g);

  const confirm = () => {
    const v = link.trim();
    if (!v) {
      setErr(`الرجاء إدخال ${guide.label}`);
      return;
    }
    add(cartItem(p, g, item, v));
    setShow(false);
    setLink('');
    setErr('');
    setDone(true);
    setTimeout(() => setDone(false), 1400);
  };

  const btn = (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShow(true);
      }}
      aria-label={done ? 'أُضيف إلى السلة' : 'أضِف إلى السلة'}
      className={
        compact
          ? `w-8 h-8 rounded-md border-2 border-black flex items-center justify-center shrink-0 transition-all duration-150 ${
              done ? 'bg-[#e4f542]' : 'bg-white hover:bg-[#407BFF] hover:text-white opacity-0 group-hover:opacity-100'
            }`
          : `inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-3 rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-200 ${
              done ? 'bg-[#e4f542] hover:bg-[#d6e72c]' : 'bg-white hover:bg-[#407BFF] hover:text-white'
            }`
      }
    >
      {done ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
      {!compact && (done ? 'أُضيف' : 'أضِف للسلة')}
    </button>
  );

  return (
    <>
      {btn}
      {show &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShow(false)}
          >
            <div
              className="w-full max-w-md bg-white border-2 border-black shadow-[10px_10px_0px_#000] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-black tracking-tighter">إلى أين تريد التوجيه؟</h3>
              <p className="mt-1 text-sm font-bold text-neutral-800">
                {item.qty} {g.cat} — {p.name}
                {g.sub ? ` (${g.sub})` : ''}
              </p>
              <label className="mt-4 block text-[11px] font-black uppercase tracking-widest text-neutral-900">
                {guide.label}
              </label>
              <input
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                  setErr('');
                }}
                dir="ltr"
                autoFocus
                placeholder={guide.placeholder}
                className="mt-1 w-full bg-white border-2 border-black px-4 py-3.5 text-sm font-bold outline-none placeholder:text-neutral-600 focus:shadow-[4px_4px_0px_#000]"
              />
              <p className="mt-2 text-[11px] font-bold text-neutral-800 leading-relaxed">{guide.hint}</p>
              {err && <p className="mt-2 text-xs font-black text-red-600">{err}</p>}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={confirm}
                  className="flex-1 bg-black text-white text-sm font-black uppercase tracking-widest py-3 border-2 border-black hover:bg-[#407BFF] transition-colors"
                >
                  إضافة للسلة
                </button>
                <button
                  onClick={() => setShow(false)}
                  className="px-5 bg-white text-black text-sm font-black uppercase tracking-widest py-3 border-2 border-black hover:bg-neutral-100 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
