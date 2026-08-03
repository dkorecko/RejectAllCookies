const globalToggle = document.getElementById('global-toggle');
const siteToggle = document.getElementById('site-toggle');
const siteLabel = document.getElementById('site-label');
const countEl = document.getElementById('count');

let hostname = null;
let tabId = null;

async function load() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  tabId = tab.id;
  try {
    hostname = new URL(tab.url).hostname;
  } catch (e) {
    hostname = null;
  }
  siteLabel.textContent = hostname ? `Enabled on ${hostname}` : 'Enabled on this site';

  const stored = await browser.storage.local.get({ globalEnabled: true, disabledHosts: [] });
  globalToggle.checked = stored.globalEnabled;
  siteToggle.checked = hostname ? !stored.disabledHosts.includes(hostname) : true;
  siteToggle.disabled = !hostname;

  const resp = await browser.runtime.sendMessage({ type: 'get-count', tabId });
  countEl.textContent = resp?.count ?? 0;
}

globalToggle.addEventListener('change', async () => {
  await browser.storage.local.set({ globalEnabled: globalToggle.checked });
});

siteToggle.addEventListener('change', async () => {
  if (!hostname) return;
  const stored = await browser.storage.local.get({ disabledHosts: [] });
  const set = new Set(stored.disabledHosts);
  if (siteToggle.checked) {
    set.delete(hostname);
  } else {
    set.add(hostname);
  }
  await browser.storage.local.set({ disabledHosts: [...set] });
});

load();
