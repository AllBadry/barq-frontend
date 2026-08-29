import { useState, useEffect } from 'react';
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
  const [messages, setMessages] = useState({}); // لحفظ الرسائل لكل طلب على حدة
  const [selectedFiles, setSelectedFiles] = useState({}); // لحفظ الملفات المحددة لكل طلب

  const load = () => {
    api.request('/api/orders/my-orders')
      .then((r) => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  
  useEffect(() => {
    load();
  }, []);

  const handleFileChange = (e, orderId) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [orderId]: file }));
      setMessages(prev => ({ ...prev, [orderId]: { text: `تم تحديد: ${file.name}`, type: 'info' } }));
    }
  };

  const uploadReceipt = async (orderId) => {
    const file = selectedFiles[orderId];
    if (!file) {
      setMessages(prev => ({ ...prev, [orderId]: { text: 'الرجاء اختيار صورة الإيصال أولاً', type: 'error' } }));
      return;
    }

    const formData = new FormData();
    formData.append('receipt', file);
    setBusyId(orderId);
    
    // إزالة الرسالة السابقة أثناء الرفع
    setMessages(prev => ({ ...prev, [orderId]: { text: 'جارٍ الرفع...', type: 'info' } }));

    try {
      // إرسال الصورة للباك إند
      const res = await api.request(`/api/orders/${orderId}/receipt`, { 
        method: 'POST', 
        body: formData 
      });
      
      setMessages(prev => ({ ...prev, [orderId]: { text: 'تم رفع الإيصال ✅ بانتظار التأكيد', type: 'success' } }));
      // مسح الملف من الواجهة بعد النجاح
      setSelectedFiles(prev => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
      load(); // تحديث قائمة الطلبات
    } catch (e) {
      setMessages(prev => ({ ...prev, [orderId]: { text: e.message || 'فشل الرفع', type: 'error' } }));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="text-sm font-bold text-neutral-500">جارٍ التحميل…</p>;
  if (!orders.length) return <p className="text-sm font-bold text-neutral-500">لا توجد طلبات بعد.</p>;

  return (
    <div className="space-y-4">
      {orders.map((o) => {
        const s = statusLabel(o);
        const msg = messages[o._id];

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

            {/* عرض رسالة الخطأ أو النجاح الخاصة بهذا الطلب فقط */}
            {msg && (
              <p className={`mt-2 text-xs font-black ${
                msg.type === 'error' ? 'text-red-600' : 
                msg.type === 'success' ? 'text-green-600' : 'text-blue-600'
              }`}>
                {msg.text}
              </p>
            )}

            {/* عرض أزرار الرفع فقط إذا لم يكن مدفوعاً أو مرفوضاً */}
            {o.paymentStatus !== 'paid' && o.paymentStatus !== 'rejected' && o.paymentStatus !== 'pending_review' && (
              <div className="mt-3 flex items-center gap-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, o._id)}
                  className="text-xs" 
                />
                <button
                  onClick={() => uploadReceipt(o._id)}
                  disabled={busyId === o._id || !selectedFiles[o._id]}
                  className="bg-black text-white text-xs font-black px-3 py-2 border-2 border-black hover:bg-[#407BFF] disabled:opacity-50"
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