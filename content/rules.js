// Selector rules for well-known consent-management platforms (CMPs).
// Each rule: `banner` locates the visible consent dialog, `reject` locates its
// "reject/decline all" control. Both are checked with deepQuery() in content.js,
// so shadow-DOM-hosted widgets (e.g. Usercentrics) are matched the same way.
//
// CMPs regularly change their markup, so treat this as a living list: if a site's
// banner isn't caught, inspect its DOM and add/adjust a rule here.

const RAC_CMP_RULES = [
  {
    name: 'OneTrust',
    banner: '#onetrust-banner-sdk, #onetrust-consent-sdk',
    reject: '#onetrust-reject-all-handler',
  },
  {
    name: 'Cookiebot',
    banner: '#CybotCookiebotDialog',
    reject:
      '#CybotCookiebotDialogBodyButtonDecline, button#CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll, #CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll',
  },
  {
    name: 'Didomi',
    banner: '#didomi-host, .didomi-popup-container',
    reject:
      '#didomi-notice-disagree-button, .didomi-continue-without-agreeing, button[aria-label="Disagree"]',
  },
  {
    name: 'Quantcast',
    banner: '.qc-cmp2-container',
    reject: '.qc-cmp2-summary-buttons button[mode="secondary"]',
  },
  {
    name: 'Sourcepoint',
    banner: '.message-container, .sp_choice_type_13',
    reject: '.sp_choice_type_13, button[title="Reject All"], button[aria-label="Reject All"]',
  },
  {
    name: 'Osano',
    banner: '.osano-cm-window',
    reject: '.osano-cm-denyAll, .osano-cm-button--type_denyAll',
  },
  {
    name: 'Usercentrics',
    banner: 'usercentrics-root',
    reject: 'button[data-testid="uc-deny-all-button"]',
  },
  {
    name: 'Complianz',
    banner: '.cmplz-cookiebanner, #cmplz-cookiebanner-container',
    reject: '.cmplz-deny, .cmplz-btn.cmplz-deny',
  },
  {
    name: 'Borlabs Cookie',
    banner: '#BorlabsCookieBox',
    reject: '._brlbs-btn-refuse, .brlbs-btn-refuse, [data-borlabs-cookie-refuse-all]',
  },
  {
    name: 'Iubenda',
    banner: '.iubenda-cs-container, #iubenda-cs-banner',
    reject: '.iubenda-cs-reject-btn',
  },
  {
    name: 'CookieYes',
    banner: '#cky-consent-container, .cky-consent-container',
    reject: '.cky-btn-reject',
  },
  {
    name: 'Klaro',
    banner: '.klaro',
    reject: '.cm-btn.cm-btn-decline, .cn-decline',
  },
  {
    name: 'Axeptio',
    banner: '#axeptio_overlay',
    reject: '#axeptio_btn_dismiss',
  },
  {
    name: 'Cookie-Script',
    banner: '#cookiescript_injected',
    reject: '#cookiescript_reject',
  },
  {
    name: 'TrustArc',
    banner: '#truste-consent-track',
    reject: '#truste-consent-required, .trustarc-reject-all, #trustarc-reject-btn',
  },
  {
    // Google's own legacy notice on Google Sites/Blogger-hosted domains
    // ("This site uses cookies from Google..."). It has no reject choice,
    // only an acknowledge button (labelled "Got it" or a localized
    // equivalent) - dismissed via the semantic data-cookie-path attribute
    // rather than Google's minified class names, which change across builds.
    name: 'Google Sites/Blogger cookie notice',
    banner: 'div[data-cookie-path]',
    reject: 'div[data-cookie-path] [role="button"]',
  },
];
