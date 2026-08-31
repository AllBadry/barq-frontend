import { useState, useEffect } from 'react';
import { AuthContext } from './useAuth';
import { api } from '../lib/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => !!api.getToken());

  // استرجاع الجلسة من التوكن المخزّن عند التحميل
  useEffect(() => {
    let active = true;
    const token = api.getToken();
    if (!token) return;
    api
      .request('/api/auth/me')
      .then((data) => {
        if (active) setUser(data.data.user);
      })
      .catch(() => {
        api.setToken(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const register = async ({ name, email, phone = '', password }) => {
    const res = await api.request('/api/auth/register', {
      method: 'POST',
      body: { name, email, phone, password },
    });
    api.setToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const login = async ({ email, password }) => {
    const res = await api.request('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    api.setToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const updateProfile = async ({ name, phone }) => {
    const res = await api.request('/api/auth/me', {
      method: 'PATCH',
      body: { name, phone },
    });
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await api.request('/api/auth/logout', { method: 'POST' });
    } catch {
      /* تجاهل أخطاء الخروج */
    }
    api.setToken(null);
    setUser(null);
  };

  const verifyEmail = async (code) => {
    const res = await api.request('/api/auth/verify-email', {
      method: 'POST',
      body: { code },
    });
    // تحديث بيانات المستخدم بعد التفعيل
    const me = await api.request('/api/auth/me');
    if (me.data) setUser(me.data.user);
    return res.data;
  };

  const resendVerification = async (data) => {
    const res = await api.request('/api/auth/resend-verification', { 
      method: 'POST',
      body: data // هنا نقوم بتمرير الإيميل للباك إند
    });
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, updateProfile, logout, verifyEmail, resendVerification }}>
      {children}
    </AuthContext.Provider>
  );
}
