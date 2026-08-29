import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // رفع الشاشة لأعلى نقطة فور تغير الرابط
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}