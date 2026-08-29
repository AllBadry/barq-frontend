import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Loader2, UploadCloud, X } from 'lucide-react';

const statusLabel = (o) => {
  if (o.paymentStatus === 'paid') return { t: 'تم الدفع ✅', c: 'bg-[#25D366] text-black' };
  if (o.paymentStatus === 'pending_review') return { t: 'قيد المراجعة ⏳', c: 'bg-[#e4f542] text-black' };
  if (o.paymentStatus === 'rejected') return { t: 'مرفوض ❌', c: 'bg-red-500 text-white' };
  return { t: 'بانتظار الدفع', c: 'bg-neutral-200 text-black' };
};

export default function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالات البوب-أب (Modal)
  const [uploadModal, setUploadModal] = useState(null); // يحفظ الـ ID للطلب المراد رفع إيصاله
  const [uploadData, setUploadData] = useState({ name: '', email: '', file: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () => {
    api.request('/api/orders/my-orders')
      .then((r) => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  
  useEffect(() => {
    load();
  }, []);

  // دالة إرسال الإيصال والبيانات
  const submitReceipt = async (e) => {
    e.preventDefault();
    if (!uploadData.file) return alert('الرجاء اختيار صورة حوالة كليك (CliQ) أولاً');

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('receipt', uploadData.file);
    if (uploadData.name) formData.append('name', uploadData.name);
    if (uploadData.email) formData.append('email', uploadData.email);

    try {
      await api.request(`/api/orders/${uploadModal}/receipt`, { 
        method: 'POST', 
        body: formData 
      });
      
      alert('تم إرسال إيصالك بنجاح! 🎉 سيقوم الأدمن بمراجعته وتفعيل طلبك فوراً.');
      setUploadModal(null); // إغلاق البوب-أب
      setUploadData({ name: '', email: '', file: null }); // تصفير البيانات
      load(); // تحديث الطلبات
    } catch (e) {
      alert(e.message || 'فشل رفع الإيصال، الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-sm font-bold text-neutral-500">جارٍ التحميل…</p>;
  if (!orders.length) return <p className="text-sm font-bold text-neutral-500">لا توجد طلبات بعد.</p>;

  return (
    <div className="space-y-4 relative">
      {orders.map((o) => {
        const s = statusLabel(o);

        return (
          <div key={o._id} className="border-2 border-black shadow-[4px_4px_0px_#000] bg-white p-4 md:p-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="font-black text-lg">طلب #{String(o._id).slice(-6).toUpperCase()}</span>
              <span className={`text-xs font-black px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000] self-start sm:self-auto ${s.c}`}>
                {s.t}
              </span>
            </div>
            
            <div className="mt-4 text-sm font-bold space-y-2 bg-neutral-50 p-3 border border-black/10 rounded-md">
              {o.items.map((it, i) => (
                <div key={i} className="flex justify-between items-start gap-4">
                  <span className="leading-snug">{it.name} <span className="text-[#407BFF]">×{it.quantity}</span></span>
                  <span dir="ltr" className="shrink-0">{it.price} JOD</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs text-neutral-500 font-bold" dir="ltr">
                  الرابط: <a href={o.targetLink} target="_blank" rel="noreferrer" className="text-[#1d4ed8] underline">{o.targetLink}</a>
                </p>
                <p className="text-xl font-black mt-1" dir="ltr">
                  الإجمالي: {o.totalPrice} <span className="text-xs text-neutral-500">JOD</span>
                </p>
              </div>

              {/* إظهار زر الرفع فقط إذا كان الطلب بانتظار الدفع */}
              {o.paymentStatus !== 'paid' && o.paymentStatus !== 'rejected' && o.paymentStatus !== 'pending_review' && (
                <button
                  onClick={() => setUploadModal(o._id)}
                  className="bg-[#e4f542] text-black text-sm font-black px-5 py-3 border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] transition-all flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  أكمل الشراء / ارفع الحوالة
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* البوب-أب (Modal) الخاص برفع الإيصال */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white border-2 border-black shadow-[10px_10px_0px_#000] p-6 md:p-8 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => {
                setUploadModal(null);
                setUploadData({ name: '', email: '', file: null });
              }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-black tracking-tight mb-2">إتمام الدفع</h3>
            <p className="text-xs font-bold text-neutral-500 mb-6 leading-relaxed">
              يرجى إدخال بياناتك للتواصل، وإرفاق صورة لحوالة كليك (CliQ) الخاصة بهذا الطلب.
            </p>

            <form onSubmit={submitReceipt} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">الاسم الكامل (اختياري)</label>
                <input 
                  type="text" 
                  placeholder="مثال: أحمد" 
                  className="w-full border-2 border-black px-4 py-3 font-bold outline-none focus:shadow-[4px_4px_0px_#407BFF] transition-shadow"
                  value={uploadData.name}
                  onChange={e => setUploadData({...uploadData, name: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">البريد الإلكتروني للإشعارات</label>
                <input 
                  required 
                  type="email" 
                  placeholder="example@mail.com" 
                  className="w-full border-2 border-black px-4 py-3 font-bold outline-none focus:shadow-[4px_4px_0px_#FF3BFF] transition-shadow"
                  dir="ltr"
                  value={uploadData.email}
                  onChange={e => setUploadData({...uploadData, email: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">صورة الحوالة (إجباري)</label>
                <input 
                  required 
                  type="file" 
                  accept="image/*" 
                  className="w-full border-2 border-black p-2 font-bold outline-none cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-black file:bg-black file:text-white hover:file:bg-neutral-800 transition-all"
                  onChange={e => setUploadData({...uploadData, file: e.target.files[0]})} 
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3.5 border-2 border-black font-black uppercase tracking-widest hover:bg-[#e4f542] hover:text-black transition-colors shadow-[4px_4px_0px_#000] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : 'إرسال للتأكيد'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}