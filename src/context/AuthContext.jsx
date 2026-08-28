import { useState } from 'react';
import { AuthContext } from './useAuth';

const USERS_KEY = 'barq_users';
const SESSION_KEY = 'barq_user';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON(SESSION_KEY, null));

  const register = ({ name, email, phone = '', password }) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim()) throw new Error('اكتب اسمك الكامل');
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) throw new Error('البريد الإلكتروني غير صالح');
    if (password.length < 6) throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');

    const users = readJSON(USERS_KEY, {});
    const account = { name: name.trim(), email: cleanEmail, phone: phone.trim() };
    users[cleanEmail] = account;
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
      /* تجاهل أخطاء التخزين */
    }
    setUser(account);
  };

  const login = ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) throw new Error('اكتب البريد الإلكتروني');
    if (!password) throw new Error('اكتب كلمة المرور');

    const users = readJSON(USERS_KEY, {});
    const account = users[cleanEmail];
    if (!account) throw new Error('هذا البريد غير مسجّل بعد — أنشئ حساباً أولاً');
    setUser(account);
  };

  const updateProfile = ({ name, phone }) => {
    if (!name.trim()) throw new Error('الاسم لا يمكن أن يكون فارغاً');
    if (!user) throw new Error('لا يوجد حساب مسجّل');

    const next = { ...user, name: name.trim(), phone: phone.trim() };
    const users = readJSON(USERS_KEY, {});
    users[next.email] = next;
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
      /* تجاهل أخطاء التخزين */
    }
    setUser(next);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, register, login, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}