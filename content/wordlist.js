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
  'odmítnout vše', 'pouze nezbytné', 'jen nezbytné', 'odmítnout', 'odmítám',
  // Slovak
  'odmietnuť všetko', 'iba nevyhnutné', 'len nevyhnutné', 'odmietnuť', 'zamietnuť všetko', 'zamietnuť',
  'odmietam',
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

// Buttons that open a detailed preferences/settings panel instead of rejecting
// directly - used by the settings-flow fallback in content.js for banners with
// no one-click reject control (e.g. only "Accept all" + "Show details").
//
// Deliberately avoids bare generic nouns like "settings"/"details"/"preferences"
// on their own - a real banner caught in testing (vysajto.sk) also lists
// third-party attribution links like "Google Ads - podrobnosti tu" ("...details
// here") inside the same container, and a bare noun matches those too, causing
// the wrong link to be clicked instead of the actual settings button.
const RAC_SETTINGS_PHRASES = [
  // English
  'manage preferences', 'manage cookies', 'cookie settings', 'privacy settings',
  'customize', 'customise', 'more options', 'show details', 'show purposes',
  // German
  'einstellungen verwalten', 'cookie einstellungen', 'anpassen',
  // French
  'gérer les préférences', 'personnaliser',
  // Spanish
  'gestionar preferencias', 'configurar', 'personalizar',
  // Italian
  'gestisci preferenze', 'personalizza',
  // Portuguese
  'gerir preferências', 'gerenciar preferências',
  // Dutch
  'voorkeuren beheren', 'aanpassen',
  // Polish
  'zarządzaj preferencjami',
  // Czech
  'spravovat předvolby',
  // Slovak
  'spravovať predvoľby', 'ukázať podrobnosti',
];

// Buttons that save/confirm only the currently-selected (i.e. still-unchecked-by-
// -default or manually-deselected) categories from a preferences panel - the
// closest equivalent to "reject" on CMPs that don't offer a direct reject-all.
const RAC_SAVE_SELECTION_PHRASES = [
  // English
  'save settings', 'save preferences', 'save selection', 'save choices',
  'confirm choices', 'confirm my choices', 'accept selected', 'allow selected', 'confirm selection',
  // German
  'auswahl speichern', 'einstellungen speichern', 'auswahl bestätigen',
  // French
  'enregistrer mes choix', 'confirmer mes choix', 'enregistrer la sélection',
  // Spanish
  'guardar preferencias', 'guardar selección', 'confirmar selección',
  // Italian
  'salva preferenze', 'salva selezione',
  // Portuguese
  'guardar preferências', 'guardar seleção',
  // Dutch
  'voorkeuren opslaan', 'selectie opslaan',
  // Polish
  'zapisz ustawienia', 'zapisz wybór',
  // Czech
  'přijmout vybrané', 'uložit nastavení', 'uložit výběr',
  // Slovak
  'prijať vybrané', 'uložiť nastavenia', 'uložiť výber', 'potvrdiť výber',
];

const RAC_BANNER_KEYWORDS = [
  'cookie', 'cookies', 'consent', 'gdpr', 'privacy preferences',
  'datenschutz', 'confidentialité', 'privacidad', 'privacidade', 'privacy',
  'soubory cookie', 'súbory cookie', 'souhlas s cookies', 'súhlas s cookies',
];
