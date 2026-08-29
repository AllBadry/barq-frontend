import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ShoppingBag, Ticket, Bell, CheckCheck, Inbox } from 'lucide-react';

const typeMeta = {
  order: { Icon: ShoppingBag, color: 'bg-[#e4f542]' },
  ticket: { Icon: Ticket, color: 'bg-[#407BFF]/20' },
  system: { Icon: Bell, color: 'bg-[#FF3BFF]/20' },
};

const fmtDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('ar', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

function EmptyState() {
  return (
    <div className="border-2 border-black shadow-[6px_6px_0px_#000] bg-white p-10 text-center">
      <div className="mx-auto w-16 h-16 rounded-full border-2 border-black bg-[#FF3BFF]/20 flex items-center justify-center">
        <Inbox className="w-8 h-8 text-[#c2189b]" />
      </div>
      <h3 className="mt-5 text-xl font-black">لا توجد إشعارات</h3>
      <p className="mt-2 text-sm font-bold text-neutral-500 leading-relaxed">
        عندما تتحدث حالة طلباتك أو يرد الدعم، ستجد الإشعارات هنا.
      </p>
    </div>
  );
}

export default function NotificationsPanel() {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => {
    api.request('/api/notifications').then((r) => {
      setItems(r.data.items);
      setUnread(r.data.unread);
    }).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const open = async (n) => {
    if (!n.read) {
      try { await api.request(`/api/notifications/${n._id}/read`, { method: 'PUT' }); } catch { /* تجاهل */ }
      load();
    }
    if (n.link) navigate(n.link);
  };

  const markAll = async () => {
    try { await api.request('/api/notifications/read-all', { method: 'PUT' }); } catch { /* تجاهل */ }
    load();
  };

  if (loading) {
    return (
      <div className="border-2 border-black shadow-[6px_6px_0px_#000] bg-white p-10 text-center">
        <span className="inline-block w-8 h-8 rounded-full border-4 border-black border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!items.length) return <EmptyState />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-[#101314] border-2 border-black shadow-[4px_4px_0px_#000] px-4 py-3">
        <span className="text-sm font-black text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#e4f542]" />
          {unread > 0 ? (
            <>لديك <span className="text-[#e4f542]">{unread}</span> غير مقروء</>
          ) : (
            <>كل الإشعارات مقروءة</>
          )}
        </span>
        {unread > 0 && (
          <button
            onClick={markAll}
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#e4f542] hover:underline"
          >
            <CheckCheck className="w-4 h-4" />
            تعليم الكل كمقروء
          </button>
        )}
      </div>

      {items.map((n) => {
        const meta = typeMeta[n.type] || typeMeta.system;
        const { Icon } = meta;
        const unreadItem = !n.read;
        return (
          <button
            key={n._id}
            onClick={() => open(n)}
            className={`w-full text-right flex items-start gap-3 border-2 border-black p-4 shadow-[4px_4px_0px_#000] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] ${unreadItem ? 'bg-[#fffbeb]' : 'bg-white'}`}
          >
            <span className={`w-10 h-10 shrink-0 rounded-lg border-2 border-black flex items-center justify-center ${meta.color}`}>
              <Icon className="w-5 h-5 text-black" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-sm leading-snug ${unreadItem ? 'font-black' : 'font-bold'} ${unreadItem ? '' : 'text-neutral-600'}`}>
                  {n.title}
                </p>
                {unreadItem && (
                  <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-[#407BFF] border-2 border-black" aria-label="غير مقروء" />
                )}
              </div>
              {n.body && <p className={`text-xs mt-1 leading-relaxed ${unreadItem ? 'font-bold text-neutral-700' : 'font-bold text-neutral-500'}`}>{n.body}</p>}
              <p className="text-[10px] text-neutral-400 mt-1.5 flex items-center gap-1" dir="ltr">
                {fmtDate(n.createdAt)}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
