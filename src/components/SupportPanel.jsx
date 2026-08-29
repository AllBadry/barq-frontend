import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function SupportPanel() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => {
    api.request('/api/tickets/my').then((r) => setTickets(r.data.tickets)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setMsg('');
    try {
      await api.request('/api/tickets', { method: 'POST', body: { message: text.trim() } });
      setText('');
      setMsg('تم إرسال رسالتك للدعم ✅');
      load();
    } catch (err) {
      setMsg(err.message || 'فشل الإرسال');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="text-sm font-bold text-neutral-500">جارٍ التحميل…</p>;

  return (
    <div className="space-y-4">
      <form onSubmit={send} className="border-2 border-black shadow-[4px_4px_0px_#000] bg-white p-4">
        <p className="text-sm font-black">أرسل رسالة للدعم الفني</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="mt-2 w-full border-2 border-black p-3 text-sm font-bold outline-none focus:shadow-[3px_3px_0px_#000]"
          placeholder="اكتب مشكلتك أو استفسارك…"
        />
        <button type="submit" disabled={busy} className="mt-2 bg-black text-white text-xs font-black px-4 py-2 border-2 border-black hover:bg-[#407BFF] disabled:opacity-60">
          {busy ? 'جارٍ الإرسال…' : 'إرسال'}
        </button>
        {msg && <span className="ml-3 text-xs font-black text-[#1d4ed8]">{msg}</span>}
      </form>

      {!tickets.length && <p className="text-sm font-bold text-neutral-500">لا توجد تذاكر.</p>}

      {tickets.map((t) => (
        <div key={t._id} className="border-2 border-black shadow-[4px_4px_0px_#000] bg-white">
          <button
            onClick={() => setOpenId(openId === t._id ? null : t._id)}
            className="w-full flex items-center justify-between p-3 text-right"
          >
            <span className="font-black text-sm">{t.subject}</span>
            <span className={`text-xs font-black px-2 py-1 ${t.status === 'open' ? 'bg-[#e4f542]' : 'bg-neutral-200'}`}>
              {t.status === 'open' ? 'مفتوحة' : 'مغلقة'}
            </span>
          </button>
          {openId === t._id && (
            <div className="border-t-2 border-black p-3 space-y-2">
              {t.messages.map((m, i) => (
                <div key={i} className={`text-sm p-2 border ${m.from === 'admin' ? 'bg-[#eef4ff] border-[#407BFF]' : 'bg-white border-black'}`}>
                  <p className="text-[10px] font-black text-neutral-400">{m.from === 'admin' ? 'الدعم الفني' : 'أنت'}</p>
                  <p className="font-bold">{m.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
