import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

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

  if (loading) return <p className="text-sm font-bold text-neutral-500">جارٍ التحميل…</p>;
  if (!items.length) return <p className="text-sm font-bold text-neutral-500">لا توجد إشعارات.</p>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-black">غير المقروء: {unread}</span>
        <button onClick={markAll} className="text-xs font-black underline">تعليم الكل كمقروء</button>
      </div>
      {items.map((n) => (
        <button key={n._id} onClick={() => open(n)} className={`w-full text-right border-2 border-black p-3 shadow-[3px_3px_0px_#000] ${n.read ? 'bg-white' : 'bg-[#fffbeb]'}`}>
          <p className="font-black text-sm">{n.title}</p>
          {n.body && <p className="text-xs font-bold text-neutral-600 mt-1">{n.body}</p>}
          <p className="text-[10px] text-neutral-400 mt-1" dir="ltr">{new Date(n.createdAt).toLocaleString('ar')}</p>
        </button>
      ))}
    </div>
  );
}
