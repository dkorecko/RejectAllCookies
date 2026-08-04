# Reject All Cookies

A Firefox extension that automatically clicks "reject/decline" on cookie
consent banners as you browse, instead of you having to do it on every site.

## How it works

Two layers, both running in a content script injected into every page and
every iframe (`manifest.json`):

1. **CMP-specific rules** (`content/rules.js`) — exact selectors for the
   consent-management platforms most sites actually use (OneTrust, Cookiebot,
   Didomi, Usercentrics, Quantcast, Sourcepoint, Osano, Complianz, Borlabs,
   Iubenda, CookieYes, Klaro, Axeptio, Cookie-Script, TrustArc). When one of
   these is detected, its dedicated "reject all" button is clicked directly —
   the most reliable path.
2. **Generic fallback** (`content/content.js` + `content/wordlist.js`) — for
   every other site, a `MutationObserver` watches for newly-rendered elements
   that look like a cookie banner (visible, fixed/sticky or high z-index,
   mentions "cookie"/"consent"/"gdpr", contains clickable controls), then
   searches its buttons/links for reject-style text ("Reject all", "Decline",
   "Necessary only", "Ablehnen", "Refuser", "Rechazar", ...) in several
   languages, while explicitly avoiding anything that also reads as an accept
   button.

Both layers pierce open shadow DOM (needed for web-component-based widgets
like Usercentrics) and run inside cross-origin iframes (needed for CMPs like
Sourcepoint/TrustArc that render their UI in a sandboxed frame), since the
content script is injected with `all_frames: true`.

Everything runs locally in the page — no network requests, no external
service. The only persisted data is your on/off preference, in
`browser.storage.local`.

## Known limitations

- CMP markup changes over time; if a specific site stops being caught, its
  selector in `content/rules.js` likely needs updating (see below).
- Multi-step "open preferences → then reject" flows (a few TrustArc/Quantcast
  configurations) aren't chased across screens — only single-click reject
  controls are handled. The generic fallback often still catches these if a
  one-click "reject" is present on the first screen.
- This clicks whatever the site itself renders. If a site sets cookies before
  showing a banner (a red flag for GDPR-compliant CMPs, but it does happen),
  this extension can't retroactively stop that.

## Privacy

This extension collects no data. It makes no network requests and has no
analytics, telemetry, or remote server of any kind — everything it does
happens locally in the page you're viewing. The only thing it stores is your
on/off preference (the global toggle and, optionally, a per-site override
list), saved locally via the browser's extension storage API. That data never
leaves your device and is never shared with the developer or anyone else.

## Installing (development / personal use)

Firefox requires either signing (for permanent installs of unpacked
extensions) or loading as a temporary add-on (fine for personal use, but reset
each restart):

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select `manifest.json` in this folder.

**Flatpak Firefox/Floorp:** selecting `manifest.json` directly will install but
the popup will render as a collapsed empty panel. Flatpak's sandbox only grants
access to the single file you pick via the portal file dialog, not the sibling
files it references (`popup/popup.html`, `content/*.js`, etc.) — those fail to
load silently. Instead, build a single packed file and load that:

```sh
npm install   # once, to fetch web-ext
npm run build
mv web-ext-artifacts/reject_all_cookies-*.zip web-ext-artifacts/reject_all_cookies.xpi
```

Then select that `.xpi` in the same **Load Temporary Add-on…** dialog — a
single file gets a single portal grant that covers everything packed inside it.
Rebuild it after every code change (it isn't live-reloaded like an unpacked
directory is).

To keep it installed across restarts without submitting to
addons.mozilla.org, you can package it as a `.xpi` and self-host, but Firefox
(non-ESR/non-Nightly) still requires it to be signed by Mozilla to load
permanently. The simplest path for personal daily use is to submit it (even
unlisted) via https://addons.mozilla.org/developers/ for automatic signing,
then install the signed `.xpi`.

## Using it

Click the toolbar icon to:

- Toggle the extension globally on/off.
- Toggle it for the current site only (kept in `disabledHosts` in storage).
- See how many banners it's handled on the current page (badge + popup
  counter).

## Extending the CMP rule list

Add an entry to `RAC_CMP_RULES` in `content/rules.js`:

```js
{
  name: 'SomeCMP',
  banner: '#selector-for-the-visible-dialog',
  reject: '#selector-for-its-reject-all-button',
}
```

Both `banner` and `reject` are CSS selectors matched via `deepQuery()`, so
shadow-DOM-hosted markup works without any extra flag.

## Publishing a new version

Listed on [addons.mozilla.org](https://addons.mozilla.org/), so installs
auto-update once a new version is approved. Releases are handled by
`.github/workflows/release.yml`: pushing a `vX.Y.Z` tag lints the extension,
checks the tag matches `manifest.json`'s version, then signs and submits it
to AMO's listed channel. The git tag itself is the release marker — there's
no separate GitHub Release object.

There's no separate "create the add-on on the website first" step — since
`manifest.json` already pins an explicit `id`
(`browser_specific_settings.gecko.id`), the first ever tag push creates the
listing on AMO directly. `amo-metadata.json` supplies the fields AMO
requires to create a *listed* add-on that the extension package itself
doesn't carry (summary, category, license) — update it if those should ever
change.

One-time setup — add the AMO credentials as repo secrets (never paste these
into chat, a commit, or a CLI arg; `gh secret set` prompts for the value so
it never touches shell history):

```sh
gh secret set AMO_JWT_ISSUER
gh secret set AMO_JWT_SECRET
```

Get the key/secret pair from
https://addons.mozilla.org/developers/addon/api/key/.

To ship a release:

1. Bump `"version"` in `manifest.json` and commit it.
2. `git tag vX.Y.Z && git push origin vX.Y.Z` (must match the manifest
   version exactly, e.g. `v1.1.0` for `"version": "1.1.0"`).
3. Watch the run under the repo's **Actions** tab — it finishes once the
   submission is accepted. Check the AMO
   developer dashboard (linked above) for actual review/publish status;
   once approved it's published and pushed to existing installs
   automatically.

`scripts/release.sh` (invoked by CI via `npm run release`) also works
locally if you ever need to sign/submit without going through a tag push —
just export `AMO_JWT_ISSUER`/`AMO_JWT_SECRET` in your shell first.

## License

MIT — see [LICENSE](LICENSE).
