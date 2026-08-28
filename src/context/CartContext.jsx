import { useState } from 'react';
import { CartContext } from './useCart';

const CART_KEY = 'barq_cart';

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    /* تجاهل أخطاء التخزين */
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  const add = (item) => {
    setItems((prev) => {
      const found = prev.find((it) => it.key === item.key);
      const next = found
        ? prev.map((it) => (it.key === item.key ? { ...it, count: it.count + 1 } : it))
        : [...prev, { ...item, count: 1 }];
      writeCart(next);
      return next;
    });
  };

  const setCount = (key, count) => {
    setItems((prev) => {
      const next =
        count <= 0
          ? prev.filter((it) => it.key !== key)
          : prev.map((it) => (it.key === key ? { ...it, count } : it));
      writeCart(next);
      return next;
    });
  };

  const remove = (key) => {
    setItems((prev) => {
      const next = prev.filter((it) => it.key !== key);
      writeCart(next);
      return next;
    });
  };

  const clear = () => {
    setItems([]);
    writeCart([]);
  };

  const count = items.reduce((n, it) => n + it.count, 0);
  const total = items.reduce((sum, it) => sum + parseFloat(it.price) * it.count, 0);

  return (
    <CartContext.Provider value={{ items, count, total, add, setCount, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}