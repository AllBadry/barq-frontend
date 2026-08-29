import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';

const statusLabel = (o) => {
  if (o.paymentStatus === 'paid') return { t: 'تم الدفع ✅', c: 'bg-[#25D366]' };
  if (o.paymentStatus === 'pending_review') return { t: 'بانتظار مراجعة الإيصال', c: 'bg-[#e4f542]' };
  if (o.paymentStatus === 'rejected') return { t: 'مرفوض ❌', c: 'bg-red-500 text-white' };
  return { t: 'بانتظار الدفع', c: 'bg-neutral-200' };
};

export default function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState('');
  const fileRefs = useRef({});

  const load = () => {
    api.request('/api/orders/my-orders').then((r) => setOrders(r.data.orders)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const upload = async (id) => {
    const file = fileRefs.current[id]?.files?.[0];
    if (!file) return setMsg('اختر صورة الإيصال أولاً');
    const fd = new FormData();
    fd.append('receipt', file);
    setBusyId(id);
    setMsg('');
    try {
      await api.request(`/api/orders/${id}/receipt`, { method: 'POST', body: fd });
      setMsg('تم رفع الإيصال ✅ بانتظار تأكيد الأدمن');
      load();
    } catch (e) {
      setMsg(e.message || 'فشل الرفع');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="text-sm font-bold text-neutral-500">جارٍ التحميل…</p>;
  if (!orders.length) return <p className="text-sm font-bold text-neutral-500">لا توجد طلبات بعد.</p>;

  return (
    <div className="space-y-4">
      {msg && <p className="text-xs font-black text-[#1d4ed8]">{msg}</p>}
      {orders.map((o) => {
        const s = statusLabel(o);
        return (
          <div key={o._id} className="border-2 border-black shadow-[4px_4px_0px_#000] bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="font-black">طلب #{String(o._id).slice(-6)}</span>
              <span className={`text-xs font-black px-2 py-1 ${s.c}`}>{s.t}</span>
            </div>
            <div className="mt-2 text-sm font-bold space-y-1">
              {o.items.map((it, i) => (
                <div key={i} className="flex justify-between">
                  <span>{it.name} ×{it.quantity}</span>
                  <span dir="ltr">{it.price} JOD</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-500" dir="ltr">الرابط: {o.targetLink}</p>
            <p className="text-sm font-black mt-1" dir="ltr">الإجمالي: {o.totalPrice} JOD</p>

            {o.paymentStatus !== 'paid' && o.paymentStatus !== 'rejected' && (
              <div className="mt-3 flex items-center gap-2">
                <input ref={(el) => { fileRefs.current[o._id] = el; }} type="file" accept="image/*" className="text-xs" />
                <button
                  onClick={() => upload(o._id)}
                  disabled={busyId === o._id}
                  className="bg-black text-white text-xs font-black px-3 py-2 border-2 border-black hover:bg-[#407BFF] disabled:opacity-60"
                >
                  {busyId === o._id ? 'جارٍ الرفع…' : 'رفع الإيصال'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
