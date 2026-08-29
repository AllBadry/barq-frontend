import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { LifeBuoy, Send, MessageCircle, ChevronDown, Clock, CheckCircle2, Headset, MailOpen } from 'lucide-react';

const fmtTime = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('ar', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

function EmptyState() {
  return (
    <div className="border-2 border-black shadow-[6px_6px_0px_#000] bg-white p-10 text-center">
      <div className="mx-auto w-16 h-16 rounded-full border-2 border-black bg-[#e4f542] flex items-center justify-center">
        <Headset className="w-8 h-8 text-black" />
      </div>
      <h3 className="mt-5 text-xl font-black">لا توجد رسائل دعم بعد</h3>
      <p className="mt-2 text-sm font-bold text-neutral-500 leading-relaxed">
        أرسل استفسارك الأول وسيقوم فريق الدعم بالرد عليك في أقرب وقت.
      </p>
    </div>
  );
}

export default function SupportPanel() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const chatScroller = useRef(null);
  const inputRef = useRef(null);

  const load = () => {
    api.request('/api/tickets/my').then((r) => setTickets(r.data.tickets)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  // تمرير الشات لآخر رسالة عند فتح تذكرة
  useEffect(() => {
    if (openId && chatScroller.current) {
      setTimeout(() => {
        chatScroller.current.scrollTop = chatScroller.current.scrollHeight;
      }, 60);
    }
  }, [openId, tickets]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setMsg('');
    setErr('');
    try {
      await api.request('/api/tickets', { method: 'POST', body: { message: text.trim() } });
      setText('');
      setMsg('تم إرسال رسالتك للدعم ✅');
      load();
      setTimeout(() => setMsg(''), 3200);
    } catch (error) {
      setErr(error.message || 'فشل الإرسال');
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  if (loading) {
    return (
      <div className="border-2 border-black shadow-[6px_6px_0px_#000] bg-white p-10 text-center">
        <span className="inline-block w-8 h-8 rounded-full border-4 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* نموذج إرسال رسالة جديدة */}
      <form onSubmit={send} className="border-2 border-black shadow-[6px_6px_0px_#000] bg-[#101314] p-5 md:p-6">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 shrink-0 rounded-lg bg-[#e4f542] border-2 border-black flex items-center justify-center">
            <LifeBuoy className="w-6 h-6 text-black" />
          </span>
          <div>
            <p className="text-white font-black text-lg leading-tight">أرسل رسالة للدعم الفني</p>
            <p className="text-white/60 text-xs font-bold">فريقنا يرد خلال ساعات العمل</p>
          </div>
        </div>
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          dir="rtl"
          className="mt-4 w-full bg-white border-2 border-black p-3.5 text-sm font-bold outline-none placeholder:text-neutral-300 focus:shadow-[4px_4px_0px_#e4f542] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all duration-150"
          placeholder="اكتب مشكلتك أو استفسارك…"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 bg-[#e4f542] text-black text-xs font-black px-6 py-3 border-2 border-[#e4f542] hover:bg-transparent hover:text-white transition-colors disabled:opacity-60 disabled:hover:bg-[#e4f542] disabled:hover:text-black"
          >
            <Send className="w-4 h-4" />
            {busy ? 'جارٍ الإرسال…' : 'إرسال'}
          </button>
          {err && <span className="text-xs font-black text-red-400">{err}</span>}
          {msg && <span className="text-xs font-black text-[#e4f542]">{msg}</span>}
        </div>
      </form>

      {/* قائمة التذاكر / الشات */}
      {!tickets.length ? (
        <EmptyState />
      ) : (
        tickets.map((t) => {
          const isOpen = openId === t._id;
          const resolved = t.status === 'resolved';
          return (
            <div key={t._id} className="border-2 border-black shadow-[6px_6px_0px_#000] bg-white overflow-hidden">
              {/* رأس التذكرة */}
              <button
                onClick={() => setOpenId(isOpen ? null : t._id)}
                className="w-full flex items-center justify-between gap-3 px-4 md:px-5 py-4 text-right bg-white hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-10 h-10 shrink-0 rounded-full border-2 border-black flex items-center justify-center ${resolved ? 'bg-neutral-200' : 'bg-[#407BFF]/15'}`}>
                    <MessageCircle className={`w-5 h-5 ${resolved ? 'text-neutral-500' : 'text-[#1650d6]'}`} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-black text-sm md:text-base truncate">{t.subject || 'استفسار'}</p>
                    <p className="text-[11px] font-bold text-neutral-400 mt-0.5">
                      {t.messages.length} رسالة · {fmtTime(t.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] font-black px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000] ${
                      resolved ? 'bg-neutral-200 text-black' : 'bg-[#e4f542] text-black'
                    }`}
                  >
                    {resolved ? 'مغلقة' : 'مفتوحة'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-black transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* رسالة تفتح — بدون border أعلى لأن الرأس ختمه */}
              {isOpen && (
                <div className="border-t-2 border-black">
                  {/* الفقاعات */}
                  <div ref={chatScroller} className="max-h-[420px] overflow-y-auto p-4 md:p-5 space-y-3 bg-neutral-50/70">
                    {t.messages.map((m, i) => {
                      const mine = m.from === 'user';
                      return (
                        <div key={i} className={`flex ${mine ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[78%] md:max-w-[70%]`}>
                            <div
                              className={`relative px-4 py-2.5 border-2 border-black text-sm font-bold leading-relaxed ${
                                mine
                                  ? 'bg-white'
                                  : 'bg-[#eef4ff]'
                              }`}
                            >
                              {/* ذيل الفقاعة */}
                              <span
                                className="absolute top-3 w-3 h-3 border-2 border-black bg-inherit rotate-45"
                                style={{
                                  [mine ? 'right' : 'left']: '-8px',
                                  borderRight: mine ? 'none' : '2px solid #000',
                                  borderLeft: mine ? '2px solid #000' : 'none',
                                  borderBottom: mine ? 'none' : '2px solid #000',
                                }}
                              />
                              <p className="text-[10px] font-black text-neutral-400 mb-1">
                                {mine ? 'أنت' : 'الدعم الفني'}
                              </p>
                              <p className="text-[15px]">{m.text}</p>
                            </div>
                            <p className={`mt-1 text-[10px] font-bold text-neutral-400 flex items-center gap-1 ${mine ? '' : 'justify-end'}`}>
                              <Clock className="w-3 h-3" />
                              {fmtTime(m.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* الرد داخل التذكرة المفتوحة */}
                  {!resolved && (
                    <div className="border-t-2 border-black bg-white p-4">
                      <form onSubmit={send} className="flex items-end gap-2">
                        <input
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          dir="rtl"
                          className="flex-1 border-2 border-black px-4 py-3 text-sm font-bold outline-none placeholder:text-neutral-300 focus:shadow-[4px_4px_0px_#407BFF] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all duration-150"
                          placeholder="اكتب ردك…"
                        />
                        <button
                          type="submit"
                          disabled={busy}
                          className="shrink-0 flex items-center gap-2 bg-black text-white text-xs font-black px-4 py-3 border-2 border-black hover:bg-[#407BFF] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] transition-all disabled:opacity-60"
                        >
                          <Send className="w-4 h-4" />
                          {busy ? '…' : 'إرسال'}
                        </button>
                      </form>
                      {err && <p className="mt-2 text-xs font-black text-red-600">{err}</p>}
                      {msg && (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-green-700 bg-green-100 border-2 border-green-700 px-2.5 py-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {msg}
                        </p>
                      )}
                    </div>
                  )}

                  {resolved && (
                    <div className="border-t-2 border-black bg-neutral-50 p-4 flex items-center justify-center gap-2 text-xs font-black text-neutral-500">
                      <MailOpen className="w-4 h-4" />
                      هذه التذكرة مغلقة — يمكنك فتح تذكرة جديدة من أعلى الصفحة.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
