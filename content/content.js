(function () {
  'use strict';

  const state = {
    enabled: true,
    handledBanners: new WeakSet(),
    handledElements: new WeakSet(),
    observer: null,
  };

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function sortByLengthDesc(list) {
    return [...list].sort((a, b) => b.length - a.length);
  }

  const REJECT_SORTED = sortByLengthDesc(RAC_REJECT_PHRASES);
  const ACCEPT_SORTED = sortByLengthDesc(RAC_ACCEPT_PHRASES);

  function matchesAny(text, phrases) {
    const t = normalize(text);
    if (!t) return false;
    return phrases.some((p) => t === p || t.includes(p));
  }

  function isVisible(el) {
    if (!(el instanceof Element)) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    const style = getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  // Depth-first search of `root` and any open shadow roots beneath it.
  function* deepQuery(root, selector) {
    if (!root || typeof root.querySelectorAll !== 'function') return;
    let matched;
    try {
      matched = root.querySelectorAll(selector);
    } catch (e) {
      matched = [];
    }
    yield* matched;
    for (const el of root.querySelectorAll('*')) {
      if (el.shadowRoot) yield* deepQuery(el.shadowRoot, selector);
    }
  }

  function clickElement(el) {
    if (!el || state.handledElements.has(el)) return false;
    state.handledElements.add(el);
    el.click();
    return true;
  }

  function reportHandled(name) {
    try {
      browser.runtime.sendMessage({ type: 'banner-handled', cmp: name });
    } catch (e) {
      // No background listener available (e.g. extension reloading) — non-fatal.
    }
  }

  function tryCmpRule(rule) {
    const banner = [...deepQuery(document, rule.banner)].find(isVisible);
    if (!banner || state.handledBanners.has(banner)) return false;
    const button = [...deepQuery(document, rule.reject)].find(isVisible);
    if (!button) return false;
    state.handledBanners.add(banner);
    clickElement(button);
    reportHandled(rule.name);
    return true;
  }

  function looksLikeBanner(el) {
    if (!isVisible(el)) return false;
    const text = normalize(el.textContent).slice(0, 500);
    if (!RAC_BANNER_KEYWORDS.some((k) => text.includes(k))) return false;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const positioned = style.position === 'fixed' || style.position === 'sticky';
    const bigEnough = rect.width > 150 && rect.height > 40;
    const zIndex = parseInt(style.zIndex, 10) || 0;
    return bigEnough && (positioned || zIndex > 0);
  }

  // Plain `<a>` is included (not just a[role="button"]) because plenty of CMPs
  // wire click handlers onto bare links with no button semantics. Safe to cast
  // this wide because callers only search inside a container that already
  // passed looksLikeBanner(), not the whole document.
  const CLICKABLE_SELECTOR =
    'button, a, [role="button"], input[type="button"], input[type="submit"]';

  function findRejectButtonIn(container) {
    const candidates = [...deepQuery(container, CLICKABLE_SELECTOR)].filter(isVisible);
    for (const el of candidates) {
      const label = el.textContent || el.value || el.getAttribute('aria-label') || '';
      if (matchesAny(label, REJECT_SORTED) && !matchesAny(label, ACCEPT_SORTED)) {
        return el;
      }
    }
    return null;
  }

  // Fallback for banners whose reject control carries no matchable text (icon-only,
  // or a language the wordlist doesn't cover) but exposes intent through markup,
  // e.g. Shoptet's `<a data-cc-reject-all>`. Keyed on attribute name/value instead
  // of a vendor's class names, so it isn't tied to any specific CMP.
  const REJECT_ATTR_PATTERN = /reject[-_]?all|decline[-_]?all|deny[-_]?all|refuse[-_]?all/i;

  function findRejectButtonByAttribute(container) {
    for (const el of deepQuery(container, '*')) {
      if (!isVisible(el)) continue;
      const attrs = el.attributes ? [...el.attributes] : [];
      if (attrs.some((a) => REJECT_ATTR_PATTERN.test(a.name) || REJECT_ATTR_PATTERN.test(a.value))) {
        return el;
      }
    }
    return null;
  }

  function genericScan() {
    for (const el of deepQuery(document, '*')) {
      if (state.handledBanners.has(el)) continue;
      if (!looksLikeBanner(el)) continue;
      const rejectBtn = findRejectButtonIn(el) || findRejectButtonByAttribute(el);
      if (rejectBtn) {
        state.handledBanners.add(el);
        clickElement(rejectBtn);
        reportHandled('generic');
        return true;
      }
    }
    return false;
  }

  function scan() {
    if (!state.enabled) return;
    for (const rule of RAC_CMP_RULES) {
      if (tryCmpRule(rule)) return;
    }
    genericScan();
  }

  let debounceTimer = null;
  function scheduleScan() {
    if (!state.enabled) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(scan, 150);
  }

  function startObserving() {
    if (state.observer) return;
    state.observer = new MutationObserver(scheduleScan);
    state.observer.observe(document.documentElement, { childList: true, subtree: true });
    scheduleScan();
  }

  function stopObserving() {
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }
  }

  async function computeEnabled() {
    let stored;
    try {
      stored = await browser.storage.local.get({ globalEnabled: true, disabledHosts: [] });
    } catch (e) {
      stored = { globalEnabled: true, disabledHosts: [] };
    }
    return stored.globalEnabled && !stored.disabledHosts.includes(location.hostname);
  }

  async function init() {
    state.enabled = await computeEnabled();
    if (state.enabled) startObserving();
  }

  try {
    browser.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (!('globalEnabled' in changes) && !('disabledHosts' in changes)) return;
      computeEnabled().then((nowEnabled) => {
        state.enabled = nowEnabled;
        if (nowEnabled) startObserving();
        else stopObserving();
      });
    });
  } catch (e) {
    // storage API unavailable in this frame context — extension still works, just
    // won't react to live toggle changes until next navigation.
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
