// Phrases used by the generic (non-CMP-specific) fallback matcher in content.js.
// Matching is substring-based against normalized (lowercased, whitespace-collapsed) text.

const RAC_REJECT_PHRASES = [
  // English
  'reject all cookies', 'decline all cookies', 'reject all', 'decline all', 'refuse all', 'deny all',
  'necessary cookies only', 'use necessary cookies only', 'necessary only', 'only necessary',
  'essential only', 'only essential', 'continue without accepting', 'continue without agreeing',
  'do not accept', "don't accept", 'i disagree', 'disagree', 'decline', 'refuse', 'reject', 'deny',
  // German
  'alle ablehnen', 'nur notwendige cookies', 'nur notwendige', 'nur erforderliche', 'ablehnen',
  // French
  'tout refuser', 'refuser tout', 'continuer sans accepter', 'refuser',
  // Spanish
  'rechazar todo', 'rechazar todas', 'rechazar',
  // Italian
  'rifiuta tutto', 'rifiuta',
  // Portuguese
  'rejeitar tudo', 'recusar tudo', 'rejeitar', 'recusar',
  // Dutch
  'alles weigeren', 'alles afwijzen', 'weigeren',
  // Polish
  'odrzuć wszystkie', 'odrzuć',
  // Scandinavian
  'avvis alle', 'afvis alle', 'avvis', 'afvis',
  // Czech
  'odmítnout vše', 'pouze nezbytné', 'jen nezbytné', 'odmítnout',
  // Slovak
  'odmietnuť všetko', 'iba nevyhnutné', 'len nevyhnutné', 'odmietnuť', 'zamietnuť všetko', 'zamietnuť',
];

const RAC_ACCEPT_PHRASES = [
  // English
  'accept all cookies', 'allow all cookies', 'accept all', 'allow all', 'i agree', 'accept cookies',
  'allow cookies', 'agree', 'accept', 'allow',
  // German
  'alle akzeptieren', 'ich stimme zu', 'akzeptieren', 'zustimmen',
  // French
  'tout accepter', 'accepter tout', "j'accepte", 'accepter',
  // Spanish
  'aceptar todo', 'aceptar todas', 'aceptar',
  // Italian
  'accetta tutto', 'accetta',
  // Portuguese
  'aceitar tudo', 'aceitar',
  // Dutch
  'alles accepteren', 'accepteren',
  // Polish
  'zaakceptuj wszystkie', 'akceptuję',
  // Czech
  'přijmout vše', 'souhlasím', 'přijmout',
  // Slovak
  'prijať všetko', 'súhlasím', 'prijať',
];

const RAC_BANNER_KEYWORDS = [
  'cookie', 'cookies', 'consent', 'gdpr', 'privacy preferences',
  'datenschutz', 'confidentialité', 'privacidad', 'privacidade', 'privacy',
  'soubory cookie', 'súbory cookie', 'souhlas s cookies', 'súhlas s cookies',
];
