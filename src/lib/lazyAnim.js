// lib/lazyAnim.js
// إيقاف الأنيميشنات الزخرفية الثقيلة (CSS animations) عندما تكون خارج
// مجال الرؤية، مع متابعة إضافة أي عناصر جديدة ديناميكياً. الهدف: تفادي
// تعلّق (jank) السكرول السريع على الهاتف/الايباد الناتج عن أنيميشن مستمر
// على عناصر لا يراها المستخدم أصلاً.

const PAUSABLE =
  '.blob-breath, .orbit-spin, .orbit-spin-rev, .shape-spin, .shape-spin-rev, ' +
  '.drifty, .drift-a, .drift-b, .drift-c, .t-marquee, .cube3d, .orb3d';

let io = null;
let observed = new WeakSet();

function register(el) {
  if (!io || observed.has(el)) return;
  observed.add(el);
  io.observe(el);
}

function scan(root) {
  if (typeof IntersectionObserver === 'undefined') return [];
  (root?.querySelectorAll?.(PAUSABLE) || []).forEach(register);
  if (root === document) {
    // بادئ التشغيل: صِد كل عنصر موجود
    document.querySelectorAll(PAUSABLE).forEach(register);
  }
}

let mutObs = null;

export function initLazyAnim() {
  if (typeof IntersectionObserver === 'undefined') return;

  if (io) return; // مهيأ مسبقاً

  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        // نوقف/نشغّل النمط بحسب الرؤية
        e.target.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
      });
    },
    { rootMargin: '200px 0px' } // حيّز إضافي لبدء الأنيميشن قبل الوصول مباشرة
  );

  scan(document);

  // متابعة العناصر الديناميكية (Lazy sections / تابات)
  if (typeof MutationObserver !== 'undefined' && !mutObs) {
    mutObs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.matches?.(PAUSABLE)) register(node);
            node.querySelectorAll?.(PAUSABLE).forEach(register);
          }
        });
      }
    });
    mutObs.observe(document.body, { childList: true, subtree: true });
  }
}

// التنظيف عند الحاجة (يُستدعى يدوياً فقط عند إلغاء التركيب)
export function destroyLazyAnim() {
  io?.disconnect();
  mutObs?.disconnect();
  io = null;
  mutObs = null;
  observed = new WeakSet();
}

export default initLazyAnim;
