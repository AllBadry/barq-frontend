// lib/isTouch.js
// كشف أجهزة اللمس (جوال/ايباد/تابلت) للحسم في تعطيل أنيميشنات
// السكرول التمريرية (scrub) والتثبيت (pin) التي تسبب تعلّق السكرول.
// نفضّل تخطيها تماماً على شاشات اللمس والاكتفاء بتشغيل مرة واحدة عند الظهور.

export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return (
    (typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches) ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
}
