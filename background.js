const counts = new Map();

browser.runtime.onMessage.addListener((message, sender) => {
  if (message?.type === 'banner-handled') {
    const tabId = sender.tab?.id;
    if (tabId == null) return;
    const next = (counts.get(tabId) || 0) + 1;
    counts.set(tabId, next);
    browser.action.setBadgeText({ tabId, text: String(next) });
    browser.action.setBadgeBackgroundColor({ tabId, color: '#2e7d32' });
    return;
  }
  if (message?.type === 'get-count') {
    return Promise.resolve({ count: counts.get(message.tabId) || 0 });
  }
});

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    counts.delete(tabId);
    browser.action.setBadgeText({ tabId, text: '' });
  }
});

browser.tabs.onRemoved.addListener((tabId) => {
  counts.delete(tabId);
});
