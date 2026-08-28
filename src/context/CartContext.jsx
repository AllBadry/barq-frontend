import { useState, useEffect, useRef } from 'react';
import { CartContext } from './useCart';
import { useAuth } from './useAuth';
import { api } from '../lib/api';

const GUEST_KEY = 'barq_cart_guest';

function readGuest() {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeGuest(items) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  } catch {
    /* تجاهل أخطاء التخزين */
  }
}

// دمج سلتين حسب المفتاح (مجموع الكميات)
function mergeCarts(a = [], b = []) {
  const map = new Map();
  for (const it of a) if (it && it.key) map.set(it.key, { ...it });
  for (const it of b) {
    if (!it || !it.key) continue;
    const ex = map.get(it.key);
    if (ex) ex.count = (Number(ex.count) || 0) + (Number(it.count) || 0);
    else map.set(it.key, { ...it });
  }
  return [...map.values()];
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(readGuest);

  const itemsRef = useRef(items);
  const userRef = useRef(user);
  const prevUserId = useRef(null);
  const loadedRef = useRef(false);

  // مزامنة المراجع بعد الرسم (تُقرأ داخل المؤثرات والدوال)
  useEffect(() => {
    itemsRef.current = items;
    userRef.current = user;
  });

  // مزامنة السلة عند الانتقال بين (زائر ↔ مسجّل الدخول)
  useEffect(() => {
    const id = user ? user._id : null;
    if (id === prevUserId.current) return; // لا يوجد انتقال
    prevUserId.current = id;

    if (id) {
      // انتقال إلى مسجّل الدخول: ادمج سلة الزائر مع سلة المستخدم من السيرفر
      let active = true;
      api
        .request('/api/cart')
        .then((res) => {
          if (!active) return;
          const serverItems = (res && res.data && res.data.items) || [];
          const merged = mergeCarts(serverItems, itemsRef.current);
          setItems(merged);
          writeGuest([]); // سلّة الزائر تندمج في الحساب ثم تُفرَّغ
          loadedRef.current = true;
          api.request('/api/cart', { method: 'PUT', body: { items: merged } }).catch(() => {});
        })
        .catch(() => {
          loadedRef.current = true;
        });
      return () => {
        active = false;
      };
    }

    // انتقال إلى زائر: تعود السلة للتخزين المحلي (فارغة بعد الدمج)
    loadedRef.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readGuest());
  }, [user]);

  // حفظ السلة في المكان المناسب حسب حالة الدخول
  const persist = (next) => {
    if (userRef.current) {
      // مسجّل الدخول: احفظ مع الحساب على السيرفر
      api.request('/api/cart', { method: 'PUT', body: { items: next } }).catch(() => {});
    } else {
      // زائر: احفظ محلياً
      writeGuest(next);
    }
  };

  const add = (item) => {
    setItems((prev) => {
      const found = prev.find((it) => it.key === item.key);
      const next = found
        ? prev.map((it) => (it.key === item.key ? { ...it, count: it.count + 1 } : it))
        : [...prev, { ...item, count: 1 }];
      persist(next);
      return next;
    });
  };

  const setCount = (key, count) => {
    setItems((prev) => {
      const next =
        count <= 0
          ? prev.filter((it) => it.key !== key)
          : prev.map((it) => (it.key === key ? { ...it, count } : it));
      persist(next);
      return next;
    });
  };

  const remove = (key) => {
    setItems((prev) => {
      const next = prev.filter((it) => it.key !== key);
      persist(next);
      return next;
    });
  };

  const clear = () => {
    setItems([]);
    persist([]);
  };

  const count = items.reduce((n, it) => n + (Number(it.count) || 0), 0);
  const total = items.reduce((sum, it) => sum + parseFloat(it.price) * (Number(it.count) || 0), 0);

  return (
    <CartContext.Provider value={{ items, count, total, add, setCount, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}
