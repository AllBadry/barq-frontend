import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = 'https://barqstore.org';
const SITE_NAME = 'متجر برق | Barq Store';
const DEFAULT_IMAGE = `${SITE}/zap.png`;
const IMAGE_WIDTH = '2000';
const IMAGE_HEIGHT = '2000';

function upsertMeta(matchSelector, attrs, content) {
  const el = document.head.querySelector(matchSelector) || (() => {
    const node = document.createElement('meta');
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    document.head.appendChild(node);
    return node;
  })();
  if (content !== undefined) el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  if (href !== undefined) el.href = href;
}

function buildUrl(path) {
  const raw = `${SITE}${path}`;
  return raw.length > SITE.length ? raw.replace(/\/+$/, '') : raw;
}

export default function Seo({ title, description, path, noindex = false }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const url = buildUrl(path || pathname);

    document.title = title;
    upsertMeta('meta[name="description"]', { name: 'description' }, description);
    upsertMeta('meta[name="robots"]', { name: 'robots' }, noindex ? 'noindex, follow' : 'index, follow');
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, SITE_NAME);
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale' }, 'ar_JO');
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, 'website');
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, title);
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description);
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, url);
    upsertMeta('meta[property="og:image"]', { property: 'og:image' }, DEFAULT_IMAGE);
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt' }, 'شعار متجر برق');
    upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width' }, IMAGE_WIDTH);
    upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height' }, IMAGE_HEIGHT);
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description);
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, DEFAULT_IMAGE);
    upsertMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt' }, 'شعار متجر برق');
    upsertLink('canonical', url);
  }, [title, description, path, pathname, noindex]);

  return null;
}