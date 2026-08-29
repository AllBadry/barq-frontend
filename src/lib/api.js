const API_URL = import.meta.env.VITE_API_URL || 'https://api.barqstore.org';
const TOKEN_KEY = 'barq_token';

function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* تجاهل */
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* استجابة فارغة */
  }

  if (!res.ok) {
    const message =
      (data && (data.message || (data.errors && data.errors[0] && data.errors[0].msg))) ||
      'حدث خطأ غير متوقع';
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return data;
}

export const api = {
  API_URL,
  getToken,
  setToken,
  request,
};
