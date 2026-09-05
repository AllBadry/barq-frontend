import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Loader2, UploadCloud, Calendar, Package, CheckCircle2, Clock3, XCircle, ExternalLink, X } from 'lucide-react';
import { usePopup } from '../context/usePopup';

const statusLabel = (o) => {
  if (o.paymentStatus === 'paid') return { t: 'تم الدفع', c: 'bg-[#25D366] text-black', Icon: CheckCircle2 };
  if (o.paymentStatus === 'pending_review') return { t: 'قيد المراجعة', c: 'bg-[#e4f542] text-black', Icon: Clock3 };
  if (o.paymentStatus === 'rejected') return { t: 'مرفوض', c: 'bg-red-500 text-white', Icon: XCircle };
  return { t: 'بانتظار الدفع', c: 'bg-neutral-200 text-black', Icon: Clock3 };
};

const fmtDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('ar', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
};

function EmptyState() {
  return (
    <div className="border-2 border-black shadow-[6px_6px_0px_#000] bg-white p-10 text-center">
      <div className="mx-auto w-16 h-16 rounded-full border-2 border-black bg-[#407BFF]/15 flex items-center justify-center">
        <Package className="w-8 h-8 text-[#1650d6]" />
      </div>
      <h3 className="mt-5 text-xl font-black">لا توجد طلبات بعد</h3>
      <p className="mt-2 text-sm font-bold text-neutral-500 leading-relaxed">
        عندما تشتري باقة، ستظهر طلباتك هنا لتتابع حالة الدفع والتنفيذ.
      </p>
    </div>
  );
}

// نموذج رفع الإيصال (بدون تغيير)
function ReceiptForm({ data, setData, isSubmitting, onSubmit }) {
  return (
    <form id="receipt-form" onSubmit={onSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">الاسم الكامل (اختياري)</label>
        <input
          type="text"
          placeholder="مثال: أحمد"
          className="w-full border-2 border-black px-4 py-3 font-bold outline-none focus:shadow-[4px_4px_0px_#407BFF] transition-shadow"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
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
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">صورة الحوالة (إجباري)</label>
        <input
          required
          type="file"
          accept="image/*"
          className="w-full border-2 border-black p-2 font-bold outline-none cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-black file:bg-black file:text-white hover:file:bg-neutral-800 transition-all"
          onChange={(e) => setData({ ...data, file: e.target.files[0] })}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 border-2 border-black font-black uppercase tracking-widest hover:bg-[#e4f542] hover:text-black transition-colors shadow-[4px_4px_0px_#000] disabled:opacity-70"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> جاري الإرسال...</>
        ) : 'إرسال للتأكيد'}
      </button>
    </form>
  );
}

export default function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // متغيرات البوب-أب المحلي الخاص بالنموذج
  const [uploadOrderId, setUploadOrderId] = useState(null);
  const [uploadData, setUploadData] = useState({ name: '', email: '', file: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // استدعاء نظام التنبيهات العالمي
  const { showPopup } = usePopup();

  const load = () => {
    api.request('/api/orders/my-orders')
      .then((r) => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openReceiptModal = (id) => {
    setUploadOrderId(id);
    setUploadData({ name: '', email: '', file: null });
  };

  // دالة الإرسال
  const submitReceipt = async (e) => {
    e.preventDefault();
    if (!uploadData.file) {
      // استخدام النظام العالمي للتنبيه
      showPopup({ type: 'warning', title: 'تنبيه', text: 'الرجاء اختيار صورة حوالة كليك (CliQ) أولاً.' });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('receipt', uploadData.file);
    if (uploadData.name) formData.append('name', uploadData.name);
    if (uploadData.email) formData.append('email', uploadData.email);

    try {
      await api.request(`/api/orders/${uploadOrderId}/receipt`, { method: 'POST', body: formData });

      setUploadOrderId(null); // إغلاق النموذج المحلي
      setUploadData({ name: '', email: '', file: null });
      load(); // تحديث الطلبات
      
      // إظهار رسالة النجاح عبر النظام العالمي
      showPopup({
        type: 'success',
        title: 'تم استلام إيصالك بنجاح!',
        text: 'يجري التحقق من الدفع. سيتم تنفيذ طلبات السوشيال ميديا خلال (1-24 ساعة)، أما الاشتراكات الرقمية فسيصلك التفعيل على إيميلك خلال (ساعة إلى ساعتين). تواصل مع الدعم إن احتجت لأي مساعدة! 🎉',
      });
    } catch (err) {
      // إظهار رسالة الخطأ عبر النظام العالمي
      showPopup({
        type: 'error',
        title: 'حدث خطأ',
        text: err.message || 'فشل رفع الإيصال، الرجاء المحاولة مرة أخرى.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="border-2 border-black shadow-[6px_6px_0px_#000] bg-white p-10 text-center">
        <span className="inline-block w-8 h-8 rounded-full border-4 border-black border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!orders.length) return <EmptyState />;

  return (
    <div className="space-y-5 relative">
      {orders.map((o) => {
        const s = statusLabel(o);
        const { Icon } = s;

        return (
          <div key={o._id} className="border-2 border-black shadow-[6px_6px_0px_#000] bg-white relative overflow-hidden">
            <div className={`h-2 w-full ${s.c} border-b-2 border-black`} />
            <div className="p-4 md:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 shrink-0 rounded-lg bg-[#101314] text-white flex items-center justify-center">
                    <span className="font-black" dir="ltr">#{String(o._id).slice(-6).toUpperCase()}</span>
                  </span>
                  <div>
                    <span className="font-black text-lg block leading-tight">
                      طلب <span dir="ltr">#{String(o._id).slice(-6).toUpperCase()}</span>
                    </span>
                    <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {fmtDate(o.createdAt)}
                    </span>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000] self-start sm:self-auto ${s.c}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {s.t}
                </span>
              </div>

              <div className="mt-4 text-sm font-bold divide-y-2 divide-black/10 border-2 border-black bg-neutral-50 rounded-none">
                {o.items.map((it, i) => (
                  <div key={i} className="flex justify-between items-center gap-4 px-3 py-2.5">
                    <span className="leading-snug flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#407BFF] shrink-0" />
                      {it.name} <span className="text-[#407BFF]">×{it.quantity}</span>
                    </span>
                    <span dir="ltr" className="shrink-0 font-black">{it.price} <span className="text-neutral-400 text-xs">JOD</span></span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-neutral-500 font-bold flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    الرابط المستهدف:
                    <a href={o.targetLink} target="_blank" rel="noreferrer" className="text-[#1d4ed8] underline truncate max-w-[220px] inline-block align-bottom" dir="ltr">{o.targetLink}</a>
                  </p>
                  <p className="text-2xl font-black mt-2 flex items-end gap-1.5">
                    الإجمالي:
                    <span dir="ltr" className="text-[#101314]">{o.totalPrice} <span className="text-xs text-neutral-500">JOD</span></span>
                  </p>
                </div>

                {o.paymentStatus !== 'paid' && o.paymentStatus !== 'rejected' && o.paymentStatus !== 'pending_review' && (
                  <button
                    onClick={() => openReceiptModal(o._id)}
                    className="bg-[#e4f542] text-black text-sm font-black px-5 py-3 border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all flex items-center justify-center gap-2"
                  >
                    <UploadCloud className="w-4 h-4" />
                    أكمل الشراء / ارفع الحوالة
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* بوب-أب محلي (Local Modal) للنموذج فقط */}
      {uploadOrderId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" dir="rtl">
          <div className="relative w-full max-w-md bg-white border-2 border-black shadow-[10px_10px_0px_#000] p-6 md:p-8 animate-in fade-in zoom-in duration-200">
            {/* زر إغلاق الـ Modal المحلي */}
            <button 
              onClick={() => setUploadOrderId(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-black tracking-tighter mb-2">إتمام الدفع</h3>
            <p className="text-xs font-bold text-neutral-500 mb-2 leading-relaxed">
              يرجى إرفاق صورة لحوالة كليك (CliQ) لإتمام الطلب.
            </p>
            <div className="space-y-2 text-sm font-bold text-neutral-800 bg-neutral-50 p-4 border-2 border-black shadow-[3px_3px_0px_#000]">
  <div className="flex items-center justify-between">
    <span className="text-neutral-500 text-xs font-mono uppercase">جهة التحويل</span>
    <span className="font-black text-black">بنك الاتحاد</span>
  </div>
  <div className="flex items-center justify-between">
    <span className="text-neutral-500 text-xs font-mono uppercase">اسم المستفيد</span>
    <span className="font-black text-black">علاء السكسك</span>
  </div>
  <div className="flex items-center justify-between pt-2 border-t border-black/10">
    <span className="text-neutral-500 text-xs font-mono uppercase">معرف كليك (CliQ)</span>
    <span className="font-mono font-black bg-black text-[#e4f542] px-2 py-0.5 tracking-widest text-sm" dir="ltr">SIK12</span>
  </div>
</div>
            <ReceiptForm
              data={uploadData}
              setData={setUploadData}
              isSubmitting={isSubmitting}
              onSubmit={submitReceipt}
            />
          </div>
        </div>
      )}
    </div>
  );
}