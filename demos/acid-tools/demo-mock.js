/* ACID Tools - static demo.
 * Every /api/* request of the dashboard is answered in the browser from the fictional
 * fixture data below (example.com / *.test). Nothing is sent to any server. */
(function () {
  'use strict';
  if (window.__ACID_DEMO__) return;
  window.__ACID_DEMO__ = true;

  // Folder the demo is really served from (published by the inline boot script) and the folder
  // the export was built for; they differ when the host site itself lives in a sub-folder.
  var BUILT_BASE = '/demos/' + 'acid-tools';
  var BASE = '';
  try {
    BASE = typeof self.__ACID_BASE__ === 'string'
      ? self.__ACID_BASE__
      : new URL(document.currentScript.src).pathname.replace(/\/demo-mock\.js$/, '');
  } catch (e) { BASE = ''; }

// ---------------------------------------------------------------- utils
function mulberry32(seed) {
  let a = seed >>> 0;
  return function rnd() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260930);
const pick = (arr, r = rnd) => arr[Math.floor(r() * arr.length)];
const int = (min, max, r = rnd) => min + Math.floor(r() * (max - min + 1));
function shuffle(arr, r = rnd) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const NOW = Date.now();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const isoAgo = (ms) => new Date(NOW - ms).toISOString();
function deadlineIso(dayOffset, hour = 18, minute = 0) {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString();
}
function log() {}

// ---------------------------------------------------------------- users
const AVATAR = (bg, txt) => 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="32" fill="${bg}"/><text x="32" y="41" font-size="26" font-family="Arial" text-anchor="middle" fill="#fff">${txt}</text></svg>`,
);
const users = [
  { id: 1, username: 'admin.demo', role: 'admin', tgNickname: 'demo_admin', telegramChatId: '100200301', responsibleAlias: 'Админ Демо', avatarUrl: AVATAR('#486cd0', 'АД'), createdAt: isoAgo(240 * DAY) },
  { id: 2, username: 'sokolova.mv', role: 'admin', tgNickname: 'demo_user_2', telegramChatId: '100200302', responsibleAlias: 'Соколова М.', avatarUrl: AVATAR('#d05648', 'СМ'), createdAt: isoAgo(198 * DAY) },
  { id: 3, username: 'kravtsov.ds', role: 'checker', tgNickname: 'demo_user_3', telegramChatId: '100200303', responsibleAlias: 'Кравцов Д.', avatarUrl: null, createdAt: isoAgo(151 * DAY) },
  { id: 4, username: 'orlova.ea', role: 'checker', tgNickname: 'demo_user_4', telegramChatId: '100200304', responsibleAlias: 'Орлова Е.', avatarUrl: null, createdAt: isoAgo(120 * DAY) },
  { id: 5, username: 'belov.an', role: 'checker', tgNickname: null, telegramChatId: null, responsibleAlias: 'Белов А.', avatarUrl: null, createdAt: isoAgo(77 * DAY) },
  { id: 6, username: 'tikhonova.pk', role: 'observer', tgNickname: 'demo_user_6', telegramChatId: '100200306', responsibleAlias: 'Тихонова П.', avatarUrl: null, createdAt: isoAgo(45 * DAY) },
  { id: 7, username: 'gromov.nv', role: 'observer', tgNickname: null, telegramChatId: null, responsibleAlias: 'Громов Н.', avatarUrl: null, createdAt: isoAgo(21 * DAY) },
  { id: 8, username: 'guest.viewer', role: 'guest', tgNickname: null, telegramChatId: null, responsibleAlias: null, avatarUrl: null, createdAt: isoAgo(6 * DAY) },
];
const ALIASES = ['Соколова М.', 'Кравцов Д.', 'Орлова Е.', 'Белов А.', 'Тихонова П.', 'Громов Н.', 'Ефимова К.', 'Админ Демо'];
const CURRENT_USER = { ...users[0], designPreview: false };

// ---------------------------------------------------------------- checks
const GEOS = ['BR', 'AR', 'MX', 'CL', 'CO', 'PE', 'DE', 'PL', 'ES', 'IT', 'PT', 'FR', 'RO', 'TR', 'KZ', 'UZ', 'ID', 'TH'];
const KTS = [
  'acid-track.example.test', 'sb-track.example.test', 'sb2-track.example.test',
  'tt-track.example.test', 'sl-track.example.test', 'pr-track.example.test', 'TG', 'LH',
];
const BRANDS = [
  'Nova Capital', 'Solaris Invest', 'Mercado Sol', 'Bank Aurora', 'Crypto Frontier', 'Vector Trade',
  'Lumen Finance', 'Altura Group', 'Grand Meridian', 'Zenit Profit', 'Olympus Bull', 'Quantum Ledger',
  'Международный инвестиционный фонд имени Александра Невского Групп',
];
const PROMOS = [
  'Lucky Draw', 'Кэшбэк 10%', 'Быстрый старт', 'VIP-доступ', 'Розыгрыш призов', 'Реферальный бонус',
  'Партнёрская программа', 'Новости - Обзор рынка за неделю для частных инвесторов',
  'Новости — Итоги квартала: что изменилось на рынке',
];
const APPROACHES = ['Каскад-1', 'Каскад-2', 'Квиз', 'Прямая ссылка', 'Ретаргет', 'Push-воронка'];
const WIDGET_TAGS = ['STEPS+TIMER', 'NOTIFICATION+DASHBOARD', 'CHEQUE', 'COMMENTS+DATES', 'CRYPTO', 'PROFIT+FOOTER', 'WHITELIST'];
const WIDGET_POOL = ['STEPS', 'TIMER', 'FOOTER', 'NOTIFICATION', 'DASHBOARD', 'DATES', 'CRYPTO', 'WHITELIST', 'PHONE_MASK', 'ANTISPAM', 'DEPOSIT', 'OFFER_VALUES'];
const SUBS = ['lp', 'promo', 'land', 'go', 'offer-hub', 'secure-invest', 'cdn-pages'];

function genUrl(idx, type) {
  const id = 40000 + int(100, 9999) + idx;
  if (type === 'offer') return `https://offers.example.test/offer/view?id=${id}`;
  if (idx % 9 === 0) {
    return `https://very-long-subdomain-for-promo-landing-network-eu-west-${idx}.example.com/campaigns/2026/autumn/redirect-chain/step-3/final-landing-page?id=${id}&utm_source=social_ads&utm_medium=cpc&utm_campaign=autumn_super_mega_promo_2026_extra_long_campaign_name&utm_content=variant_b_${idx}&sub_id_29=back`;
  }
  if (idx % 7 === 0) return `https://${pick(SUBS)}${idx}.example.com/pages/spring-sale-2026/index.php?id=${id}`;
  return `https://${pick(SUBS)}${idx}.example.com/${pick(['landing', 'promo', 'l', 'p'])}/${id}/index.php?id=${id}`;
}

function genNaming(idx, type) {
  const geo = pick(GEOS);
  const brand = idx % 13 === 0 ? BRANDS[12] : pick(BRANDS.slice(0, 12));
  const dep = pick([100, 150, 200, 250, 300, 500]);
  const ver = pick(['V1', 'V2', 'V3', 'LEGACY', 'FORM2']);
  const deal = pick(['CA', 'WA']);
  if (idx % 11 === 5) return `Landing Spring Sale (${pick(['STEPS', 'TIMER', 'CRYPTO'])}) ${dep}$`;
  if (type === 'offer') {
    return `[${geo}] ${brand} | ${pick(['OFFER', 'Оффер: базовый', 'Оффер: премиум'])} | ${pick(['FORM2', 'FORM3', 'F1'])} | ${dep}$ | ${deal} ${ver}`;
  }
  return `[${geo}] ${brand} | ${pick(PROMOS)} | ${pick(APPROACHES)} | ${pick(WIDGET_TAGS)} | ${dep}$ | ${deal} ${ver}`;
}

const ERR_TEMPLATES = {
  PHONE_MASK: () => ({ type: 'PHONE_MASK', message: 'Маска телефона не соответствует GEO', expected: '+55 (##) #####-####', actual: '+7 (###) ###-##-##', element: 'input[name="phone"]' }),
  ANTISPAM: () => ({ type: 'ANTISPAM', message: 'Не найден антиспам-скрипт на странице', expected: 'antispam.js в <head>', element: 'head' }),
  DEPOSIT: () => ({ type: 'DEPOSIT', message: 'Сумма депозита в форме не совпадает с неймингом', expected: '250$', actual: '300$', element: 'span.deposit-amount' }),
  DATES: (n) => ({ type: 'DATES', message: `Найдено хардкодных дат: ${n}`, items: [{ date: '12.09.2026', element: 'span.date', context: 'Акция действует до' }, { date: '01.10.2026', element: 'div.timer-note', context: 'Приём заявок закрыт' }] }),
  STEPS: () => ({ type: 'STEPS', message: 'Шаг 3 не найден в разметке виджета', expected: '.steps-item[data-step="3"]', element: 'section.steps' }),
  TIMER: () => ({ type: 'TIMER', message: 'Таймер обратного отсчёта не инициализирован', expected: 'window.startTimer()', actual: 'undefined', element: 'div#timer' }),
  FOOTER: () => ({ type: 'FOOTER', message: 'Отсутствует обязательная юридическая ссылка в футере', element: 'footer', expected: 'a[href*="privacy"]' }),
  NOTIFICATION: () => ({ type: 'NOTIFICATION', message: 'Всплывающее уведомление не соответствует шаблону', expected: 'toast.notification', actual: 'div.popup-old' }),
  DASHBOARD: () => ({ type: 'DASHBOARD', message: 'Блок дашборда содержит устаревшие значения', expected: 'data-dashboard="v3"', actual: 'data-dashboard="v1"' }),
  CRYPTO: () => ({ type: 'CRYPTO', message: 'Курс криптовалюты подставлен статически', element: 'span.rate' }),
  WHITELIST: (i) => ({ type: 'RESOURCE', message: 'Внешний ресурс не входит в whitelist', url: `https://cdn.example.net/lib/tracker-${i}.js` }),
};
const WARN_TEMPLATES = [
  (i) => ({ type: 'RESOURCE', message: 'Внешний скрипт не входит в белый список', url: `https://static.example.net/js/analytics-${i}.min.js` }),
  (i) => ({ type: 'RESOURCE_LOCAL_MISSING', message: `Локальный CSS файл недоступен: assets/css/theme-${i}.css` }),
  (i) => ({ type: 'WIDGET_MISSING_FROM_NAMING', message: `Виджет ${['TIMER','STEPS','CHEQUE'][i % 3]} указан в нейминге, но не найден на странице (№${i})` }),
  (i) => ({ type: 'SEO', message: `Отсутствует meta description (шаблон ${i})`, element: 'head' }),
  (i) => ({ type: 'IMAGE', message: `Изображение без атрибута alt (№${i})`, src: `https://img.example.com/banners/${i}.jpg`, element: 'img' }),
  (i) => ({ type: 'SPELL', message: `Найдено слово/фрагмент "гарантированый" в элементе <p class="lead-${i}">Гарантированый возврат в течение 14 дней</p> — опечатка, правильно "гарантированный"` }),
];
const GLOBAL_ERR = [
  (i) => ({ type: 'SOURCE', message: 'Inline-обработчик onclick найден в исходном коде', element: 'button', line: 200 + i, snippet: '<button onclick="track()">' }),
  (i) => ({ type: 'SECURITY', message: `Сторонний трекинг-пиксель обнаружен на странице`, url: `https://px.example.net/t.gif?i=${i}` }),
  (i) => ({ type: 'LINK', message: 'Ссылка формы ведёт не на {offer}', element: 'form', expected: '{offer}', actual: `https://wrong.example.com/go/${i}`, xpath: 'SOURCE_CODE_CHECK' }),
];

let uid = 1000;
function makeWidget(name, kind, i) {
  const base = { status: 'ok', errors: [], warnings: [], found: true, formsChecked: 1, debug: { forms: [{ formLabel: '#land-form', inputsInside: 3 }] } };
  if (kind === 'skip') return { widget: { ...base, status: 'skipped', noRules: true, found: false, debug: undefined }, err: 0, warn: 0 };
  if (kind === 'err') {
    if (name === 'OFFER_VALUES') {
      return {
        widget: {
          ...base, status: 'error', hasError: true, error: true,
          fields: [
            { field: 'brandname', expected: 'Nova Capital', actual: 'Nova Capitol', match: false, actualKey: 'brandname' },
            { field: 'offerint', expected: '4821', actual: '4821', match: true, actualKey: 'offerint' },
          ],
        },
        err: 1, warn: 0,
      };
    }
    const tpl = ERR_TEMPLATES[name] || ERR_TEMPLATES.STEPS;
    return { widget: { ...base, status: 'error', error: true, hasError: true, errors: [tpl(3 + (i % 4))], message: 'Найдены ошибки' }, err: 1, warn: 0 };
  }
  if (kind === 'warn') {
    const w = pick(WARN_TEMPLATES)(uid++);
    return { widget: { ...base, status: 'warn', warning: true, hasRecommendation: true, warnings: [w], message: 'Есть рекомендации' }, err: 0, warn: 1 };
  }
  if (name === 'OFFER_VALUES') {
    return { widget: { ...base, fields: [{ field: 'brandname', expected: 'Nova Capital', actual: 'Nova Capital', match: true }, { field: 'offerint', expected: '4821', actual: '4821', match: true }] }, err: 0, warn: 0 };
  }
  return { widget: base, err: 0, warn: 0 };
}

const STATUS_PLAN = [
  ...Array(26).fill('OK'), ...Array(13).fill('WARN'), ...Array(12).fill('ERROR'),
  ...Array(5).fill('APPROVE'), ...Array(4).fill('DELETED'),
];
const statusOrder = shuffle(STATUS_PLAN);

function buildCheck(idx) {
  const id = 1001 + idx;
  const r = mulberry32(id * 7919);
  const type = idx % 4 === 3 ? 'offer' : 'landing';
  const status = statusOrder[idx];
  const kt = KTS[idx % KTS.length === 6 || idx % KTS.length === 7 ? idx % KTS.length : Math.floor(r() * 6)];
  const location = idx % 17 === 0 ? null : GEOS[Math.floor(r() * GEOS.length)];
  const responsible = idx % 14 === 4 ? null : ALIASES[Math.floor(r() * ALIASES.length)];
  const hasBackdoor = status === 'ERROR' && idx % 4 === 0;
  const naming = genNaming(idx, type);
  const isLong = /Международный|Новости/.test(naming); // very long tags widen the table: keep them off page 1
  const checkedAgo = isLong ? 8 * DAY + Math.floor(r() * 6 * DAY) : idx < 10 ? Math.floor(r() * 20 * HOUR) + idx * 10 * MIN : Math.floor(r() * 14 * DAY) + idx * 20 * MIN;
  const createdAgo = checkedAgo + Math.floor((1 + r() * 20) * DAY);

  const widgetNames = shuffle(WIDGET_POOL, r).slice(0, int(3, 6, r));
  const widgets = {};
  const errors = [];
  const warnings = [];
  let errN = 0;
  let warnN = 0;
  const errWidgetCount = status === 'ERROR' || status === 'APPROVE' || status === 'DELETED' ? int(1, 3, r) : 0;
  const warnWidgetCount = status === 'WARN' ? int(1, 3, r) : (status === 'ERROR' ? int(0, 2, r) : (status === 'APPROVE' ? 1 : 0));
  widgetNames.forEach((name, k) => {
    let kind = 'ok';
    if (k < errWidgetCount) kind = 'err';
    else if (k < errWidgetCount + warnWidgetCount) kind = 'warn';
    else if (r() < 0.15) kind = 'skip';
    const { widget, err, warn } = makeWidget(name, kind, idx * 3 + k);
    widgets[name] = widget;
    errN += err;
    warnN += warn;
  });
  if (hasBackdoor) {
    const bd = { type: 'BACKDOOR', message: 'Обнаружены признаки бэкдора в скрипте', file: `assets/js/vendor-${idx}.min.js`, line: 1, indicators: ['eval(atob(', 'document.write(unescape'], detection: 'obfuscated-loader' };
    widgets.BACKDOOR = { status: 'error', error: true, hasError: true, found: true, errors: [bd], warnings: [] };
    errN += 1;
  }
  if (errWidgetCount > 0 && r() < 0.6) {
    errors.push(GLOBAL_ERR[Math.floor(r() * GLOBAL_ERR.length)](idx));
    errN += 1;
  }
  if (status === 'WARN' || status === 'ERROR') {
    const w = int(0, 2, r);
    for (let k = 0; k < w; k += 1) {
      const t = WARN_TEMPLATES[(idx + k) % WARN_TEMPLATES.length](uid++);
      warnings.push(t);
      warnN += 1;
    }
  }
  if (status === 'WARN' && warnN === 0) {
    warnings.push(WARN_TEMPLATES[idx % WARN_TEMPLATES.length](uid++));
    warnN += 1;
  }
  const attention = status === 'ERROR' && idx % 3 === 0;
  const issueGroups = {
    errors: [
      ...(errN > 0 ? [{ key: 'integration', label: 'Интеграция' }] : []),
      ...(attention ? [{ key: 'attention', label: 'Требует внимания' }] : []),
    ],
    warnings: warnN > 0 ? [{ key: 'recommendations', label: 'Рекомендации' }] : [],
    labels: Object.keys(widgets).slice(0, 3),
    hasBackdoor,
  };
  const checkedBy = pick([...ALIASES.slice(0, 5), 'autocheck-bot'], r);
  const isAutoCheck = checkedBy === 'autocheck-bot';

  const base = {
    id,
    entityKey: `landing:${id}`,
    url: genUrl(idx, type),
    pageType: type,
    location,
    kt,
    responsible,
    naming,
    checkType: isAutoCheck ? 'auto' : pick(['manual', 'recheck', 'manual'], r),
    checkedAt: isoAgo(checkedAgo),
    timestamp: isoAgo(checkedAgo),
    createdAt: isoAgo(createdAgo),
    status,
    approvalStatus: status === 'APPROVE' ? 'approve' : null,
    approvalComment: status === 'APPROVE' ? 'Согласовано с тимлидом: допускается по заявке #' + (300 + idx) : null,
    checkedBy,
    isAutoCheck,
    allTypes: type === 'offer' ? ['offer'] : ['landing', 'widgets'],
    errorsCount: errN,
    warningsCount: warnN,
    issueGroups,
  };
  const detail = {
    ...base,
    errors,
    warnings,
    widgets,
    checked: { recheckRequestedBy: r() < 0.4 ? pick(ALIASES.slice(0, 5), r) : null },
  };
  return { summary: base, detail };
}

const CHECK_COUNT = 60;
const checks = Array.from({ length: CHECK_COUNT }, (_, i) => buildCheck(i));
const checkById = (id) => checks.find((c) => c.summary.id === Number(id));

function checkBucket(s) {
  if (s.status === 'DELETED') return 'DELETED';
  if (s.approvalStatus === 'approve' || s.status === 'APPROVE') return 'APPROVE';
  return s.status;
}

function listChecks(q) {
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(20, Math.max(1, Number(q.limit) || 20));
  const search = String(q.search || '').trim().toLowerCase();
  const responsible = String(q.responsible || 'all').trim().toLowerCase();
  const status = String(q.status || 'all').trim().toUpperCase();
  const pageType = String(q.pageType || 'all').trim().toLowerCase();
  const location = String(q.location || 'all').trim().toLowerCase();
  const kt = String(q.kt || 'all').trim().toLowerCase();
  const sortField = String(q.sortField || 'checkedAt');
  const dir = String(q.sortDirection || 'desc').toLowerCase() === 'asc' ? 1 : -1;

  let rows = checks.map((c) => c.summary);
  rows = rows.filter((s) => {
    if (search && ![s.url, s.naming, s.responsible, s.kt].some((v) => String(v || '').toLowerCase().includes(search))) return false;
    if (responsible !== 'all') {
      if (responsible === '__unassigned__') { if (s.responsible) return false; } else if (String(s.responsible || '').toLowerCase() !== responsible) return false;
    }
    if (pageType !== 'all' && !String(s.pageType || '').toLowerCase().includes(pageType)) return false;
    if (location !== 'all' && String(s.location || '').toLowerCase() !== location) return false;
    if (kt !== 'all' && String(s.kt || '').toLowerCase() !== kt) return false;
    return true;
  });
  const statusCounts = { all: rows.length, BACKDOOR: 0, ERROR: 0, WARN: 0, OK: 0, APPROVE: 0, DELETED: 0 };
  rows.forEach((s) => {
    statusCounts[checkBucket(s)] += 1;
    if (s.issueGroups.hasBackdoor) statusCounts.BACKDOOR += 1;
  });
  if (status !== 'ALL') {
    rows = rows.filter((s) => (status === 'BACKDOOR' ? s.issueGroups.hasBackdoor : checkBucket(s) === status));
  }
  const val = (s) => {
    switch (sortField) {
      case 'id': return s.id;
      case 'createdAt': return Date.parse(s.createdAt);
      case 'timestamp': case 'checkedAt': return Date.parse(s.checkedAt);
      case 'errors': return s.errorsCount * 100 + s.warningsCount;
      case 'status': return checkBucket(s);
      default: return String(s[sortField] || '').toLowerCase();
    }
  };
  rows = rows.slice().sort((a, b) => {
    const x = val(a); const y = val(b);
    if (x < y) return -1 * dir;
    if (x > y) return 1 * dir;
    return 0;
  });
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    checks: rows.slice((page - 1) * limit, page * limit),
    pagination: { total, page, totalPages, limit },
    statusCounts,
  };
}

function checkHistory(url) {
  const c = checks.find((x) => x.summary.url === url);
  if (!c) return [];
  const s = c.summary;
  const r = mulberry32(s.id);
  const n = 4 + (s.id % 3);
  const statuses = ['ERROR', 'WARN', 'ERROR', 'OK', 'WARN', 'OK'];
  const rows = [];
  for (let k = 0; k < n; k += 1) {
    const st = k === 0 ? s.status : statuses[(k + s.id) % statuses.length];
    rows.push({
      id: s.id * 100 + k,
      url: s.url,
      status: st,
      approvalStatus: k === 0 ? s.approvalStatus : null,
      approvalComment: k === 0 ? s.approvalComment : (k === 2 ? 'Правки внесены, повторная проверка' : null),
      errorsCount: st === 'ERROR' ? int(1, 5, r) : 0,
      warningsCount: st === 'WARN' ? int(1, 4, r) : 0,
      errors: [], warnings: [],
      checkType: k % 2 ? 'recheck' : 'manual',
      checkedBy: k % 3 === 2 ? 'autocheck-bot' : pick(ALIASES.slice(0, 5), r),
      checked: { recheckRequestedBy: k % 2 ? pick(ALIASES.slice(0, 5), r) : null },
      timestamp: isoAgo(k * (int(1, 3, r) * DAY) + int(1, 6, r) * HOUR),
      createdAt: s.createdAt,
      isAutoCheck: k % 3 === 2,
    });
  }
  return rows;
}

function chartData(range, responsible) {
  const r = mulberry32(range * 31 + (responsible === 'all' ? 1 : responsible.length));
  const labels = [];
  const success = [];
  const error = [];
  const created = [];
  for (let i = range - 1; i >= 0; i -= 1) {
    const d = new Date(NOW - i * DAY);
    labels.push(`${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`);
    const k = responsible === 'all' ? 1 : 0.35;
    success.push(Math.round((8 + r() * 26) * k));
    error.push(Math.round((2 + r() * 12) * k));
    created.push(Math.round((4 + r() * 20) * k));
  }
  return { labels, status: { success, error }, created };
}

// ---------------------------------------------------------------- widgets
const widgetSeed = [
  ['steps', 'v2', 'selector', 'Проверка блока шагов (последовательность и разметка)', true, { selector: '.steps-item', domSelector: 'section.steps', checkInlineInFile: false }, 412, 388],
  ['steps', 'v3', 'combined', 'Шаги воронки с валидацией data-атрибутов', true, { selector: '[data-step]', jsPatterns: ['initSteps(', 'stepsWidget.mount'], checkInlineInFile: true }, 205, 171],
  ['footer', 'v1', 'selector', 'Юридический футер и ссылки политики конфиденциальности', true, { selector: 'footer a[href*="privacy"]', validateLocale: true }, 530, 512],
  ['timer', 'v2', 'script', 'Таймер обратного отсчёта и его инициализация', true, { scriptPath: 'assets/js/timer.js', jsPatterns: ['startTimer(', 'countdown.init'] }, 301, 247],
  ['dashboard', 'v3', 'combined', 'Дашборд с показателями и актуальными значениями', true, { domSelector: '#dashboard', cssPatterns: ['.dash-card', '.dash-value'], jsonPaths: ['$.stats.total'] }, 118, 96],
  ['notification', 'v1', 'selector', 'Всплывающие уведомления на странице', true, { selector: '.toast.notification', checkDomInScript: true }, 264, 190],
  ['account', 'v1', 'custom', 'Личный кабинет: пользовательская проверка через кастомный код', false, { code: 'return document.querySelector("#account") !== null;' }, 47, 21],
  ['crypto', 'v2', 'script', 'Курсы криптовалют: динамическая подстановка', true, { scriptPath: 'assets/js/rates.js', jsPatterns: ['fetchRates('] }, 152, 141],
  ['dates', 'v4', 'combined', 'Поиск хардкодных дат и dtime_nums', true, { jsPatterns: ['dtime_nums', 'new Date('], cssPatterns: [], validateLocale: true, checkInlineInFile: true }, 640, 599],
  ['whitelist', 'v1', 'selector', 'Белый список внешних ресурсов', true, { selector: 'script[src], link[href]', jsonPaths: ['$.whitelist[*]'] }, 388, 371],
  ['cheque', 'v1', 'selector', 'Блок чека', false, { selector: '.cheque-box' }, 58, 30],
  ['comments', 'v2', 'selector', 'Комментарии пользователей', true, { selector: '.comments-list .comment', checkInlineInFile: false }, 173, 160],
  ['profit', 'v1', 'script', 'Калькулятор прибыли', true, { scriptPath: 'assets/js/profit.js', jsPatterns: ['calcProfit('] }, 92, 66],
  ['phone_mask', 'v2', 'combined', 'Маски телефонов по GEO', true, { selector: 'input[type=tel]', jsPatterns: ['IMask('], validateLocale: true }, 701, 615],
];
let widgetIdSeq = 1;
const widgets = widgetSeed.map(([type, version, method, description, enabled, cfg, used, passed]) => ({
  id: widgetIdSeq++,
  name: `${type}-${version}`,
  type, version, method, description, enabled,
  configs: { [method]: cfg },
  settings: type === 'timer' ? { minutes: 15, autoRestart: true } : (type === 'dates' ? { strict: true } : {}),
  stats: { used, passed, failed: used - passed },
  createdAt: isoAgo((120 - widgetIdSeq * 5) * DAY),
  updatedAt: isoAgo(widgetIdSeq * 3 * DAY),
}));

// ---------------------------------------------------------------- promo
const PROMO_GEOS = ['BR', 'MX', 'CL', 'DE', 'PL', 'IT', 'ES', 'TR'];
const PROMO_STATUS_PLAN = ['ERROR', 'ERROR', 'ERROR', 'WARN', 'WARN', 'WARN', 'WARN', 'OK', 'OK', 'OK', 'OK', 'AWAITING', 'AWAITING', 'OK'];
const promoChecks = PROMO_STATUS_PLAN.map((st, i) => {
  const id = 501 + i;
  const r = mulberry32(id * 131);
  const geo = PROMO_GEOS[i % PROMO_GEOS.length];
  const author = ['Alex.M', 'Ira.K', 'Denis.V', 'Kate.S', 'Max.P'][i % 5];
  const issues = [];
  if (st === 'ERROR') {
    issues.push({ severity: 'critical', type: 'spelling', message: 'Найдено слово/фрагмент "гарантированый" в элементе <p class="lead">Гарантированый возврат</p> — опечатка в слове', fragment: 'гарантированый', suggestion: 'гарантированный' });
    issues.push({ severity: 'critical', type: 'language', message: 'Текст блока не соответствует языку GEO: обнаружен английский фрагмент', fragment: 'Get your bonus now', suggestion: 'Получите бонус сейчас', fallbackReason: 'Основной домен недоступен', primaryDomain: 'kt-main.example.test', ktId: String(9000 + i), pageType: 'landing', checkedDomains: ['kt-main.example.test', 'kt-backup.example.test'], previewUrl: `https://preview.example.com/p/${id}`, snapshotUrl: `https://snap.example.com/s/${id}` });
  } else if (st === 'WARN') {
    issues.push({ severity: 'warning', type: 'style', message: 'Слишком длинный заголовок H1 (более 90 символов)', suggestion: 'Сократить до 60–70 символов' });
    if (i % 2) issues.push({ severity: 'info', type: 'note', message: 'Проверьте юридическую оговорку внизу страницы' });
  }
  const tokens = int(3000, 24000, r);
  const orchestrated = i % 2 === 0;
  return {
    id,
    sourceId: `PR-${20260 + i}`,
    sourceStatus: st === 'AWAITING' ? 'AWAITING' : 'SYNCED',
    naming: `[${geo}] ${author} | ${['Розыгрыш призов - Осенняя акция', 'Кэшбэк 10% - На первую покупку', 'Новости — Обзор рынка за неделю', 'Быстрый старт - Бонус за регистрацию'][i % 4]} | ${['Каскад', 'Квиз', 'Ретаргет'][i % 3]} | ${['STEPS', 'FORM2+TIMER', 'CHEQUE'][i % 3]} | ${[150, 250, 300][i % 3]}$ | ${['CA', 'WA'][i % 2]}`,
    url: `https://promo-${i + 1}.example.com/campaign/${id}/index.html?utm_source=promo_tool&utm_campaign=autumn_${id}${i % 5 === 0 ? '&extra=very-long-query-string-value-for-wrapping-test-abcdefghijklmnopqrstuvwxyz' : ''}`,
    responsible: ALIASES[i % 6],
    author,
    team: ['Team Alpha', 'Team Beta', 'Team Gamma'][i % 3],
    sourceCreatedAt: isoAgo((i + 2) * DAY),
    sourceCreatedDate: isoAgo((i + 2) * DAY).slice(0, 10),
    pageType: i % 3 === 0 ? 'offer' : 'landing',
    location: geo,
    integrationType: ['api', 'postback', 'iframe'][i % 3],
    processingStatus: st === 'AWAITING' ? 'pending' : 'checked',
    processingError: st === 'AWAITING' && i % 2 ? null : null,
    checkStatus: st === 'AWAITING' ? null : st,
    checkErrors: issues,
    latestAiRun: st === 'AWAITING' ? null : {
      inputTokens: Math.round(tokens * 0.8), outputTokens: Math.round(tokens * 0.2), totalTokens: tokens,
      costUsd: Number((tokens * 0.0000009).toFixed(6)), durationMs: int(2400, 19000, r),
      model: ['combo/acid-promo', 'gpt-4o-mini', 'gemini-2.0-flash'][i % 3], promptVersion: 'v7', createdAt: isoAgo(i * HOUR),
      rawResponse: orchestrated
        ? { spellcheck: { usage: { prompt_tokens: Math.round(tokens * 0.3), completion_tokens: 400, total_tokens: Math.round(tokens * 0.3) + 400 } }, language: { usage: { prompt_tokens: Math.round(tokens * 0.25), completion_tokens: 260, total_tokens: Math.round(tokens * 0.25) + 260 } }, verifier: { usage: { prompt_tokens: Math.round(tokens * 0.2), completion_tokens: 180, total_tokens: Math.round(tokens * 0.2) + 180 } } }
        : { mode: 'prompt', prompt: { usage: { prompt_tokens: Math.round(tokens * 0.8), completion_tokens: Math.round(tokens * 0.2), total_tokens: tokens } } },
    },
    checkedAt: st === 'AWAITING' ? null : isoAgo(i * 3 * HOUR + 40 * MIN),
    lastSyncedAt: isoAgo(i * HOUR + 10 * MIN),
    createdAt: isoAgo((i + 2) * DAY),
    updatedAt: isoAgo(i * HOUR),
  };
});
function promoBucket(p) {
  const s = String(p.checkStatus || p.sourceStatus || p.processingStatus || '').toUpperCase();
  if (s.includes('ERROR')) return 'ERROR';
  if (s.includes('WARN')) return 'WARN';
  if (s.includes('SYNCED') || s.includes('OK') || s.includes('CHECKED')) return 'OK';
  return 'AWAITING';
}
function listPromo(q) {
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(q.limit) || 20));
  const search = String(q.search || '').trim().toLowerCase();
  const eq = (v, f) => f === 'all' || String(v || '').toLowerCase() === f;
  const f = (k) => String(q[k] || 'all').trim().toLowerCase();
  let rows = promoChecks.filter((p) => (!search || [p.url, p.naming, p.responsible, p.author].some((v) => String(v || '').toLowerCase().includes(search)))
    && eq(p.responsible, f('responsible')) && eq(p.author, f('author')) && eq(p.team, f('team'))
    && eq(p.pageType, f('pageType')) && eq(p.location, f('location')) && eq(p.integrationType, f('integrationType')));
  const statusCounts = { all: rows.length, ERROR: 0, WARN: 0, OK: 0, AWAITING: 0 };
  rows.forEach((p) => { statusCounts[promoBucket(p)] += 1; });
  const status = String(q.status || 'all').trim().toUpperCase();
  if (status !== 'ALL') rows = rows.filter((p) => promoBucket(p) === status);
  const dir = String(q.sortDirection || 'desc') === 'asc' ? 1 : -1;
  const sf = String(q.sortField || 'checkedAt');
  const val = (p) => (['createdAt', 'checkedAt'].includes(sf) ? Date.parse(p[sf] || 0) : (sf === 'status' ? promoBucket(p) : String(p[sf] || '').toLowerCase()));
  rows = rows.slice().sort((a, b) => (val(a) < val(b) ? -1 * dir : val(a) > val(b) ? 1 * dir : 0));
  const total = rows.length;
  return {
    checks: rows.slice((page - 1) * limit, page * limit),
    pagination: { total, page, totalPages: Math.max(1, Math.ceil(total / limit)), limit },
    statusCounts,
  };
}
const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));

// ---------------------------------------------------------------- cleaner
const cleanerJobs = [];
{
  const specs = [
    ['done', 'clean', 2, 'Инвестиционная платформа Nova Capital — официальный сайт', ['nova-capital-landing-final-v3.zip']],
    ['done', 'suspicious', 1, 'Mercado Sol: акции и бонусы для новых клиентов', ['mercado-sol_promo-page.zip']],
    ['done', 'clean', 3, 'Пакет из трёх лендингов (BR/AR/MX)', ['batch-latam-1.zip', 'batch-latam-2.zip', 'batch-latam-3.zip']],
    ['done', 'incomplete', 5, null, ['landing-with-a-very-long-archive-name-that-should-be-truncated-in-the-table-cell-2026-09-11.zip']],
    ['error', 'clean', 7, null, ['broken-archive.zip']],
    ['cancelled', 'clean', 8, null, ['cancelled-by-user.zip']],
    ['done', 'clean', 10, 'Solaris Invest — Розыгрыш призов', ['solaris-invest.zip']],
    ['running', 'scanning', 0, null, ['zenit-profit-live.zip']],
    ['done', 'clean', 14, 'Quantum Ledger | Криптовалюты без комиссий', ['quantum-ledger.zip']],
  ];
  specs.forEach(([status, sec, daysAgo, title, archives], i) => {
    const createdAt = NOW - daysAgo * DAY - i * 37 * MIN;
    const isBatch = archives.length > 1;
    const job = {
      id: `job_${createdAt}_${(i + 1) * 7919 % 10000}`,
      kind: isBatch ? 'clean_batch' : 'clean',
      status,
      percent: status === 'running' ? 63 : (status === 'error' ? 41 : (status === 'cancelled' ? 17 : 100)),
      step: status === 'running' ? 'Удаление трекеров и метрик' : (status === 'done' ? 'Готово' : 'Остановлено'),
      error: status === 'error' ? 'Не удалось распаковать архив: повреждён central directory' : null,
      createdAt, updatedAt: createdAt + 90000,
      user: 'admin.demo',
      sourceArchives: archives,
      title,
      securityStatus: sec,
      dateReplacements: status === 'done' ? int(0, 12) : 0,
      hasDownload: status === 'done',
      hasPreview: status === 'done',
      outputZip: status === 'done' ? `out_${i}.zip` : null,
      previewDir: null,
      report: null,
    };
    if (status === 'done') {
      const one = {
        kind: 'clean', job_id: job.id, source_archive: archives[0], title: title || 'Очищенный лендинг', h1: title ? title.split(' — ')[0] : 'Главный заголовок',
        done: ['Удалены счётчики веб-аналитики', 'Удалены рекламные пиксели', 'Нормализована структура ассетов', 'Добавлен backfix.js', 'Заменены даты (dtime_nums)'],
        not_done: ['Локальные шрифты не изменялись'],
        warnings: sec === 'incomplete' ? ['Часть ресурсов не удалось проанализировать'] : [],
        missing_refs: [], date_replacements: job.dateReplacements,
        removed_attrs: ['onclick', 'data-track'], removed_tags: ['noscript', 'iframe'], removed_meta: ['generator'],
        security_scan: {
          status: sec === 'scanning' ? 'clean' : sec,
          summary: sec === 'suspicious' ? 'Найден обфусцированный скрипт, часть угроз обезврежена' : (sec === 'incomplete' ? 'Проверка неполная: пропущено 3 ресурса' : 'Признаков вредоносного кода не обнаружено'),
          remediation: sec === 'suspicious' ? { deleted: 1, sanitized: 2, actions: [{ file: 'assets/js/vendor.min.js', action: 'sanitized', reason: 'eval(atob(...))' }] } : undefined,
        },
        asset_structure: { enabled: true, moved: ['img/a.png', 'img/b.png', 'css/style.css'] },
        brand_detection: { enabled: true, used: true, brand: 'Nova Capital', provider: 'omniroute', replacements: 6, confidence: 0.94 },
      };
      job.report = isBatch ? { kind: 'clean_batch', job_id: job.id, results: archives.map((a, k) => ({ ...one, source_archive: a, job_id: `${job.id}_${k}` })) } : one;
    }
    cleanerJobs.push(job);
  });
}

// ---------------------------------------------------------------- tasks
const T = (title, description, status, priority, assignee, dl, extra = {}) => ({ title, description, status, priority, assignee, dl, ...extra });
const taskSeed = [
  T('Перепроверить лендинги Nova Capital после правки виджета STEPS', '## Что сделать\n\n- Запустить перепроверку для **12** лендингов из списка\n- Убедиться, что виджет `STEPS` находит шаг 3\n- Отписаться в чате команды\n\nСсылка на список: [таблица](https://docs.example.com/nova-capital)', 'in_progress', 'high', 'Кравцов Д.', 0, { timer: 'running', spent: 5400 }),
  T('Исправить маску телефона для GEO BR', 'Маска не соответствует формату `+55 (##) #####-####`. Проверить все лендинги с GEO BR и обновить виджет PHONE_MASK.', 'todo', 'urgent', 'Орлова Е.', -2),
  T('Сверить нейминг офферов за сентябрь', 'Выгрузить нейминг, сверить с таблицей закупки.\n\n1. Выгрузка\n2. Сверка\n3. Отчёт', 'todo', 'medium', 'Белов А.', 2),
  T('Подготовить отчёт по ошибкам виджета TIMER', 'Собрать статистику за 14 дней, выделить топ-10 проблемных страниц.', 'in_progress', 'medium', 'Соколова М.', 1, { timer: 'paused', spent: 2700 }),
  T('Обновить whitelist внешних ресурсов', 'Добавить новые CDN в белый список:\n\n- cdn.example.net\n- static.example.org', 'done', 'low', 'Кравцов Д.', -1, { spent: 3600 }),
  T('Разобрать очередь ручных проверок Mercado Sol', 'Очередь накопилась за выходные, нужно разобрать до конца дня.', 'todo', 'high', 'Тихонова П.', -5),
  T('Проверить работу Promo worker после обновления', 'После деплоя убедиться, что worker забирает записи из очереди и пишет отчёты.', 'in_progress', 'high', 'Админ Демо', 0, { timer: 'idle', spent: 900 }),
  T('Настроить уведомления Telegram о просроченных задачах', 'Сейчас уведомления приходят всем, нужно только исполнителю и постановщику.', 'todo', 'medium', 'Соколова М.', 3),
  T('Согласовать шаблон AI-промпта для проверки орфографии', 'Финальная версия промпта — в приложенном файле. Нужен review от двух проверяющих.', 'in_progress', 'medium', 'Орлова Е.', 6, { attach: true }),
  T('Удалить дубликаты проверок из выгрузки', '', 'done', 'low', 'Белов А.', -9, { spent: 7200 }),
  T('Проверить корректность GEO в новых лендингах (партия 42)', 'Часть лендингов выгружена без GEO. Проставить вручную.', 'todo', 'low', 'Громов Н.', 10),
  T('Написать инструкцию по работе с Cleaner для новичков', 'Короткая инструкция: загрузка архива, настройки, отчёт, предпросмотр, скачивание.', 'todo', 'medium', null, null),
  T('Расследовать бэкдор в vendor.min.js (партия «Zenit»)', 'Сканер нашёл `eval(atob(...))`. Нужно определить источник и вычистить все затронутые лендинги.', 'in_progress', 'urgent', 'Кравцов Д.', -1, { timer: 'paused', spent: 10800, attach: true }),
  T('Проверить долгое имя архива в Cleaner (усечение в таблице)', 'Очень длинное название задачи, которое должно корректно переноситься и обрезаться на карточке и в модальном окне просмотра без поломки вёрстки при узкой ширине экрана.', 'todo', 'low', 'Ефимова К.', 4),
  T('Ежедневная сверка статусов трекера', 'Сверить статусы синхронизации.', 'done', 'medium', 'Соколова М.', 0, { spent: 1800 }),
  T('Подготовить демо для нового заказчика', 'Собрать демо-стенд и тестовые данные.', 'done', 'high', 'Админ Демо', -3, { spent: 14400 }),
  T('Проверить доступность прокси BR Mobile', 'Прокси нестабильно отвечает, заменить или удалить.', 'todo', 'medium', 'Белов А.', -4),
  T('Обновить документацию по виджетам', 'Добавить описание новых методов `combined` и `custom`.', 'in_progress', 'low', 'Тихонова П.', 5, { timer: 'idle', spent: 1200 }),
];
const aliasToUser = (alias) => users.find((u) => u.responsibleAlias === alias);
let taskIdSeq = 900;
const tasks = taskSeed.map((t, i) => {
  const u = aliasToUser(t.assignee);
  const attachments = t.attach ? [
    { id: `att-${i}-1`, name: 'prompt-v7.txt', originalName: 'prompt-v7.txt', fileName: 'prompt-v7.txt', size: 18234, mimeType: 'text/plain', url: BASE + '/mock-files/prompt-v7.txt', uploadedAt: isoAgo(2 * DAY) },
    { id: `att-${i}-2`, name: 'screenshot.png', originalName: 'screenshot-error.png', fileName: 'screenshot.png', size: 248123, mimeType: 'image/png', url: BASE + '/mock-files/screenshot.svg', uploadedAt: isoAgo(DAY) },
  ] : [];
  return {
    id: taskIdSeq++,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    assignee: t.assignee,
    assigneeTg: u && u.tgNickname ? `@${u.tgNickname}` : null,
    creator: i % 2 ? 'Админ Демо' : 'Соколова М.',
    assigneeAvatarUrl: u ? u.avatarUrl : null,
    creatorAvatarUrl: null,
    deadline: t.dl === null ? null : deadlineIso(t.dl, 10 + (i % 8), i % 2 ? 30 : 0),
    deadlineNotifiedAt: t.dl !== null && t.dl < 0 && t.status !== 'done' ? isoAgo(HOUR * 3) : null,
    attachments,
    timeSpentSeconds: t.spent || 0,
    timerStartedAt: t.timer === 'running' ? isoAgo(25 * MIN) : null,
    timerStatus: t.timer || 'idle',
    timerLastUser: t.timer ? 'kravtsov.ds' : null,
    position: i,
    createdAt: isoAgo((3 + (i % 9)) * DAY),
    updatedAt: isoAgo((i % 5) * HOUR),
  };
});
const taskComments = {};
tasks.forEach((t, i) => {
  const n = i % 4;
  taskComments[t.id] = Array.from({ length: n }, (_, k) => ({
    id: t.id * 10 + k, taskId: t.id, authorUserId: 2 + ((i + k) % 4), author: ALIASES[(i + k) % 5], authorAvatarUrl: null,
    text: ['Взял в работу, начну после обеда.', 'Нашёл ещё три страницы с той же проблемой, добавил в список.', 'Готово, проверьте пожалуйста. Ссылка на отчёт в таблице.', 'Нужно уточнить требования: какой именно формат маски использовать?'][(i + k) % 4],
    attachments: [], createdAt: isoAgo((k + 1) * 5 * HOUR),
  }));
});

// ---------------------------------------------------------------- settings
const settings = {
  telegramNotificationsEnabled: true,
  promoWorkerEnabled: true,
  cleanerAiProvider: 'omniroute',
  cleanerAiModel: 'combo/acid-cleaner',
  cleanerAiOmniRouteTarget: 'server',
  lastUpdated: isoAgo(3 * HOUR),
};
const DEFAULT_PROMPT = 'Ты — QA-редактор рекламных лендингов. Проверь текст страницы на орфографию, пунктуацию и соответствие языку GEO. Верни JSON со списком проблем: severity, type, message, fragment, suggestion.';
const promoPrompt = { customPrompt: null, promptModeEnabled: false, updatedAt: isoAgo(2 * DAY), updatedBy: 'sokolova.mv' };
const aiModels = [
  { value: 'combo/acid-cleaner', label: 'combo/acid-cleaner', kind: 'combo' },
  { value: 'combo/acid-promo', label: 'combo/acid-promo', kind: 'combo' },
  { value: 'openai/gpt-4o-mini', label: 'gpt-4o-mini', kind: 'model', group: 'openai' },
  { value: 'gemini/gemini-2.0-flash', label: 'gemini-2.0-flash', kind: 'model', group: 'gemini' },
  { value: 'anthropic/claude-haiku', label: 'claude-haiku', kind: 'model', group: 'anthropic' },
];


// ---------------------------------------------------------------- response helpers
function send(res, status, body, headers) {
  res.result = {
    status: status,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, headers || {}),
    body: typeof body === 'string' ? body : JSON.stringify(body),
  };
}
const ok = (res, data, extra = {}) => send(res, 200, { success: true, ...(data === undefined ? {} : { data }), ...extra });
const notFound = (res, msg = 'Not found') => send(res, 404, { success: false, error: msg });
const SVG_PLACEHOLDER = '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="#2b2f3a"/><text x="160" y="106" font-size="20" font-family="Arial" text-anchor="middle" fill="#9aa4b5">mock attachment</text></svg>';

// ---------------------------------------------------------------- routes
const routes = [];
const route = (method, re, handler) => routes.push({ method, re, handler });

route('GET', /^\/api\/health$/, ({ res }) => ok(res, { status: 'mock' }));

// auth
route('GET', /^\/api\/auth\/me$/, ({ res }) => send(res, 200, { success: true, user: CURRENT_USER }));
route('POST', /^\/api\/auth\/login$/, ({ res }) => send(res, 200, { success: true, user: CURRENT_USER }));
route('POST', /^\/api\/auth\/logout$/, ({ res }) => send(res, 200, { success: true }));
route('GET', /^\/api\/auth\/telegram\/status$/, ({ res }) => send(res, 200, { isLinked: true, telegramChatId: '100200301', telegramUsername: 'demo_admin' }));
route('POST', /^\/api\/auth\/telegram\/link-token$/, ({ res }) => send(res, 200, { token: 'DEMO-1234', botUsername: 'example_demo_bot', deepLink: 'https://example.com/demo-bot?start=DEMO', expiresAt: new Date(NOW + 10 * MIN).toISOString() }));
route('POST', /^\/api\/auth\/telegram\/unlink$/, ({ res }) => send(res, 200, { success: true }));

// users
route('GET', /^\/api\/users$/, ({ res }) => ok(res, { users, responsibleAliasOptions: ALIASES }));
route('GET', /^\/api\/users\/responsible-aliases$/, ({ res }) => ok(res, ALIASES));
route('POST', /^\/api\/users$/, ({ res, body }) => {
  const u = { id: users.length + 1, tgNickname: null, telegramChatId: null, avatarUrl: null, createdAt: new Date().toISOString(), role: 'checker', responsibleAlias: null, ...body };
  users.push(u);
  ok(res, { user: u });
});
route('PUT', /^\/api\/users\/([^/]+)$/, ({ res, body, m }) => {
  const u = users.find((x) => String(x.id) === m[1] || x.username === decodeURIComponent(m[1]));
  if (!u) return notFound(res);
  Object.assign(u, body);
  return ok(res, { user: u });
});
route('DELETE', /^\/api\/users\/([^/]+)$/, ({ res, m }) => {
  const i = users.findIndex((x) => String(x.id) === m[1] || x.username === decodeURIComponent(m[1]));
  if (i >= 0) users.splice(i, 1);
  ok(res, {});
});
route('POST', /^\/api\/users\/[^/]+\/unlink-telegram$/, ({ res }) => ok(res, {}));
route('POST', /^\/api\/users\/[^/]+\/avatar\/upload$/, ({ res }) => ok(res, { avatarUrl: AVATAR('#48b94f', 'ЗФ') }));

// checks
route('GET', /^\/api\/checks$/, ({ res, query }) => ok(res, listChecks(query)));
route('DELETE', /^\/api\/checks$/, ({ res }) => ok(res, { deletedCount: 0 }));
route('GET', /^\/api\/checks\/meta$/, ({ res }) => ok(res, {
  allResponsibles: uniq(checks.map((c) => c.summary.responsible)),
  allLocations: uniq(checks.map((c) => c.summary.location)),
  allKts: uniq(checks.map((c) => c.summary.kt)),
}));
route('GET', /^\/api\/checks\/history$/, ({ res, query }) => {
  const history = checkHistory(String(query.url || ''));
  ok(res, { url: query.url, history, total: history.length });
});
route('GET', /^\/api\/chart-data$/, ({ res, query }) => ok(res, chartData(Math.min(90, Number(query.range) || 7), String(query.responsible || 'all'))));
route('GET', /^\/api\/stats$/, ({ res }) => ok(res, { total: CHECK_COUNT, errors: 12, warnings: 13 }));
route('GET', /^\/api\/check\/(\d+)$/, ({ res, m }) => {
  const c = checkById(m[1]);
  return c ? ok(res, c.detail) : notFound(res, 'Check not found');
});
route('PUT', /^\/api\/check\/(\d+)$/, ({ res, m, body }) => {
  const c = checkById(m[1]);
  if (!c) return notFound(res, 'Check not found');
  if (body.responsible !== undefined) { c.summary.responsible = body.responsible || null; c.detail.responsible = c.summary.responsible; }
  if (body.kt !== undefined) { c.summary.kt = body.kt || null; c.detail.kt = c.summary.kt; }
  return ok(res, c.detail);
});
route('DELETE', /^\/api\/check\/(\d+)$/, ({ res, m }) => {
  const c = checkById(m[1]);
  if (c) { c.summary.status = 'DELETED'; c.detail.status = 'DELETED'; }
  ok(res, {});
});
route('POST', /^\/api\/check\/force-status\/(\d+)$/, ({ res, m, body }) => {
  const c = checkById(m[1]);
  if (!c) return notFound(res);
  Object.assign(c.summary, { status: 'APPROVE', approvalStatus: 'approve', approvalComment: body.comment || null });
  Object.assign(c.detail, c.summary);
  return ok(res, c.detail);
});
route('POST', /^\/api\/check\/recheck\/(\d+)$/, ({ res }) => ok(res, { jobId: 'mock-job-1', status: 'queued' }));
route('GET', /^\/api\/run-check\/status\/[^/]+$/, ({ res }) => ok(res, { status: 'done', progress: 100 }));
route('POST', /^\/api\/run-check\/cancel\/[^/]+$/, ({ res }) => ok(res, {}));

// tracker / sync
route('GET', /^\/api\/tracker\/sync-status$/, ({ res }) => ok(res, {
  sync: { active: false, phase: 'idle', progress: 100, lastSyncAt: isoAgo(35 * MIN), found: 128, added: 17, message: 'Синхронизация завершена' },
  autocheck: { active: false, phase: 'idle' },
  recheck: { active: false, phase: 'idle' },
}));
route('GET', /^\/api\/promo\/recheck-range\/status$/, ({ res }) => ok(res, { active: false, phase: 'idle', processed: 0, total: 0 }));

// promo
route('GET', /^\/api\/promo\/checks$/, ({ res, query }) => ok(res, listPromo(query)));
route('GET', /^\/api\/promo\/checks\/meta$/, ({ res }) => ok(res, {
  allResponsibles: uniq(promoChecks.map((p) => p.responsible)),
  allAuthors: uniq(promoChecks.map((p) => p.author)),
  allTeams: uniq(promoChecks.map((p) => p.team)),
  allLocations: uniq(promoChecks.map((p) => p.location)),
  allPageTypes: uniq(promoChecks.map((p) => p.pageType)),
  allIntegrationTypes: uniq(promoChecks.map((p) => p.integrationType)),
}));
route('POST', /^\/api\/promo\/sync$/, ({ res }) => ok(res, { received: 14, upserted: 14 }));
route('POST', /^\/api\/promo\/worker\/run$/, ({ res }) => ok(res, { idle: true }));
route('POST', /^\/api\/promo\/checks\/(\d+)\/ai-check$/, ({ res, m }) => ok(res, { check: promoChecks.find((p) => p.id === Number(m[1])) || null, result: { status: 'OK', summary: 'AI-проверка завершена (мок)' } }));
route('POST', /^\/api\/promo\/checks\/(\d+)\/worker-recheck$/, ({ res }) => ok(res, { sourceId: 'PR-20260', status: 'OK', externalReport: { success: true, id: 4711 } }));

// cleaner
route('GET', /^\/api\/cleaner\/jobs$/, ({ res }) => send(res, 200, { success: true, jobs: cleanerJobs.map((j) => ({ ...j, report: null })) }));
route('GET', /^\/api\/cleaner\/jobs\/([^/]+)$/, ({ res, m }) => {
  const j = cleanerJobs.find((x) => x.id === m[1]);
  return j ? send(res, 200, { success: true, job: j }) : notFound(res);
});
route('GET', /^\/api\/cleaner\/jobs\/([^/]+)\/report$/, ({ res, m }) => {
  const j = cleanerJobs.find((x) => x.id === m[1]);
  return j && j.report ? send(res, 200, { success: true, report: j.report }) : notFound(res);
});
route('GET', /^\/api\/cleaner\/jobs\/([^/]+)\/preview-session$/, ({ res }) => send(res, 200, { success: true, previewUrl: BASE + '/mock-preview/index.html' }));
route('DELETE', /^\/api\/cleaner\/jobs\/([^/]+)$/, ({ res }) => send(res, 200, { success: true }));
route('POST', /^\/api\/cleaner\/jobs\/([^/]+)\/cancel$/, ({ res }) => send(res, 200, { success: true }));

// widgets
route('GET', /^\/api\/widgets$/, ({ res }) => ok(res, { widgets }));
route('POST', /^\/api\/widgets\/toggle-all$/, ({ res, body }) => { widgets.forEach((w) => { w.enabled = Boolean(body.enabled); }); ok(res, { widgets }); });
route('POST', /^\/api\/widgets$/, ({ res, body }) => { const w = { id: widgetIdSeq++, stats: { used: 0, passed: 0, failed: 0 }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...body }; widgets.push(w); ok(res, { widget: w }); });
route('PUT', /^\/api\/widgets\/(\d+)$/, ({ res, m, body }) => { const w = widgets.find((x) => x.id === Number(m[1])); if (!w) return notFound(res); Object.assign(w, body); return ok(res, { widget: w }); });
route('DELETE', /^\/api\/widgets\/(\d+)$/, ({ res, m }) => { const i = widgets.findIndex((x) => x.id === Number(m[1])); if (i >= 0) widgets.splice(i, 1); ok(res, {}); });

// settings
route('GET', /^\/api\/settings$/, ({ res }) => send(res, 200, { success: true, settings }));
route('POST', /^\/api\/settings$/, ({ res, body }) => { const { cleanerAiApiKey, ...rest } = body || {}; Object.assign(settings, rest, { lastUpdated: new Date().toISOString() }); send(res, 200, { success: true, settings }); });
route('GET', /^\/api\/settings\/cleaner-ai$/, ({ res }) => send(res, 200, {
  success: true,
  settings: { cleanerAiProvider: settings.cleanerAiProvider, cleanerAiModel: settings.cleanerAiModel, cleanerAiApiKeyConfigured: true, cleanerAiOmniRouteTarget: settings.cleanerAiOmniRouteTarget },
  omniRouteTargets: [{ target: 'server', configured: true, host: 'omni.example.test' }, { target: 'local', configured: true, host: 'localhost:20128' }],
}));
route('POST', /^\/api\/settings\/ai-models$/, ({ res }) => send(res, 200, { success: true, models: aiModels }));
route('POST', /^\/api\/settings\/ai-test-model$/, ({ res }) => send(res, 200, { success: true, latencyMs: 842, message: 'Модель отвечает (842 мс)' }));
function promptPayload() {
  return {
    success: true,
    prompt: promoPrompt.customPrompt || DEFAULT_PROMPT, customPrompt: promoPrompt.customPrompt, defaultPrompt: DEFAULT_PROMPT,
    usingDefault: !promoPrompt.customPrompt, promptModeEnabled: promoPrompt.promptModeEnabled,
    updatedAt: promoPrompt.updatedAt, updatedBy: promoPrompt.updatedBy, maxChars: 50000,
  };
}
route('GET', /^\/api\/settings\/promo-ai-prompt$/, ({ res }) => send(res, 200, promptPayload()));
route('POST', /^\/api\/settings\/promo-ai-prompt$/, ({ res, body }) => {
  if (body.reset) promoPrompt.customPrompt = null;
  else if (typeof body.prompt === 'string') promoPrompt.customPrompt = body.prompt === DEFAULT_PROMPT ? null : body.prompt;
  if (typeof body.promptModeEnabled === 'boolean') promoPrompt.promptModeEnabled = body.promptModeEnabled;
  send(res, 200, promptPayload());
});

// tasks
const findTask = (id) => tasks.find((t) => t.id === Number(id));
route('GET', /^\/api\/tasks$/, ({ res, query }) => {
  let list = tasks;
  if (query.status) list = list.filter((t) => t.status === query.status);
  if (query.assignee) list = list.filter((t) => t.assignee === query.assignee);
  if (query.search) list = list.filter((t) => t.title.toLowerCase().includes(String(query.search).toLowerCase()));
  ok(res, { tasks: list });
});
route('GET', /^\/api\/tasks\/users$/, ({ res }) => ok(res, { users: users.filter((u) => u.role !== 'guest').map((u) => ({ id: u.id, username: u.username, tgNickname: u.tgNickname, role: u.role, responsibleAlias: u.responsibleAlias, avatarUrl: u.avatarUrl })) }));
route('GET', /^\/api\/tasks\/files\/.*$/, ({ res }) => send(res, 200, SVG_PLACEHOLDER, { 'Content-Type': 'image/svg+xml' }));
route('POST', /^\/api\/tasks\/check-deadlines$/, ({ res }) => ok(res, { checked: tasks.length, sent: 3 }));
route('POST', /^\/api\/tasks\/upload$/, ({ res }) => ok(res, { files: [{ id: `att-new-${Date.now()}`, name: 'upload.png', originalName: 'upload.png', size: 1024, mimeType: 'image/png', url: '/api/tasks/files/upload.svg', uploadedAt: new Date().toISOString() }] }));
route('POST', /^\/api\/tasks\/reorder$/, ({ res, body }) => {
  (body.items || []).forEach((it) => { const t = findTask(it.id); if (t) { t.position = it.position; if (it.status) t.status = it.status; if (it.deadline !== undefined) t.deadline = it.deadline; } });
  ok(res, { tasks });
});
route('POST', /^\/api\/tasks$/, ({ res, body }) => {
  const u = aliasToUser(body.assignee);
  const t = { id: taskIdSeq++, attachments: [], timeSpentSeconds: 0, timerStatus: 'idle', timerStartedAt: null, timerLastUser: null, position: 0, assigneeTg: u && u.tgNickname ? `@${u.tgNickname}` : null, creator: 'Админ Демо', deadlineNotifiedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...body, deadline: body.deadline || null };
  tasks.unshift(t);
  ok(res, { task: t });
});
route('PUT', /^\/api\/tasks\/(\d+)$/, ({ res, m, body }) => { const t = findTask(m[1]); if (!t) return notFound(res); Object.assign(t, body, { updatedAt: new Date().toISOString() }); return ok(res, { task: t }); });
route('PATCH', /^\/api\/tasks\/(\d+)\/status$/, ({ res, m, body }) => { const t = findTask(m[1]); if (!t) return notFound(res); Object.assign(t, body, { updatedAt: new Date().toISOString() }); return ok(res, { task: t }); });
route('DELETE', /^\/api\/tasks\/(\d+)$/, ({ res, m }) => { const i = tasks.findIndex((t) => t.id === Number(m[1])); const t = tasks[i]; if (i >= 0) tasks.splice(i, 1); ok(res, { task: t || {} }); });
route('POST', /^\/api\/tasks\/(\d+)\/timer\/(start|pause|stop|log)$/, ({ res, m, body }) => {
  const t = findTask(m[1]); if (!t) return notFound(res);
  const act = m[2];
  const elapsed = t.timerStartedAt ? Math.floor((Date.now() - Date.parse(t.timerStartedAt)) / 1000) : 0;
  if (act === 'start') { t.timerStatus = 'running'; t.timerStartedAt = new Date().toISOString(); if (t.status === 'todo') t.status = 'in_progress'; }
  if (act === 'pause') { t.timeSpentSeconds += elapsed; t.timerStatus = 'paused'; t.timerStartedAt = null; }
  if (act === 'stop') { t.timeSpentSeconds += elapsed; t.timerStatus = 'idle'; t.timerStartedAt = null; }
  if (act === 'log') { t.timeSpentSeconds += Number(body.timeSpentSeconds) || 0; }
  return ok(res, { task: t });
});
route('GET', /^\/api\/tasks\/(\d+)\/comments$/, ({ res, m }) => ok(res, { comments: taskComments[m[1]] || [] }));
route('POST', /^\/api\/tasks\/(\d+)\/comments$/, ({ res, m, body }) => {
  const c = { id: Date.now(), taskId: Number(m[1]), authorUserId: 1, author: 'Админ Демо', authorAvatarUrl: null, text: body.text || '', attachments: body.attachments || [], createdAt: new Date().toISOString() };
  (taskComments[m[1]] = taskComments[m[1]] || []).push(c);
  ok(res, { comment: c });
});
route('PATCH', /^\/api\/tasks\/(\d+)\/comments\/(\d+)$/, ({ res, m, body }) => { const c = (taskComments[m[1]] || []).find((x) => x.id === Number(m[2])); if (c) c.text = body.text; ok(res, { comment: c || {} }); });
route('DELETE', /^\/api\/tasks\/(\d+)\/comments\/(\d+)$/, ({ res }) => ok(res, {}));


// ---------------------------------------------------------------- demo-only behaviour (overrides are matched first)
const override = (method, re, handler) => routes.unshift({ method, re, handler });

// Cleaner: jobs really progress and finish, uploads create a simulated job.
const CLEAN_STEPS = [[0, 'Распаковка архива'], [18, 'Поиск трекеров и пикселей'], [40, 'Удаление трекеров и метрик'], [62, 'Проверка безопасности'], [78, 'Нормализация дат и структуры ассетов'], [92, 'Сборка ZIP']];
const sims = new Map();
function cleanerReport(job) {
  const archives = job.sourceArchives;
  const one = {
    kind: 'clean', job_id: job.id, source_archive: archives[0], title: job.title || 'Очищенный лендинг', h1: 'Главный заголовок',
    done: ['Удалены счётчики веб-аналитики', 'Удалены рекламные пиксели', 'Нормализована структура ассетов', 'Добавлен backfix.js', 'Заменены даты (dtime_nums)'],
    not_done: ['Локальные шрифты не изменялись'],
    warnings: [], missing_refs: [], date_replacements: job.dateReplacements,
    removed_attrs: ['onclick', 'data-track'], removed_tags: ['noscript', 'iframe'], removed_meta: ['generator'],
    security_scan: { status: 'clean', summary: 'Признаков вредоносного кода не обнаружено' },
    asset_structure: { enabled: true, moved: ['img/a.png', 'img/b.png', 'css/style.css'] },
    brand_detection: { enabled: true, used: true, brand: 'Zenit Profit', provider: 'omniroute', replacements: 4, confidence: 0.91 },
  };
  return archives.length > 1
    ? { kind: 'clean_batch', job_id: job.id, results: archives.map((a, k) => ({ ...one, source_archive: a, job_id: job.id + '_' + k })) }
    : one;
}
function tickCleaner(job) {
  const sim = sims.get(job.id);
  if (!sim || job.status !== 'running') return;
  const p = sim.from + (100 - sim.from) * ((Date.now() - sim.start) / sim.duration);
  job.updatedAt = Date.now();
  if (p >= 100) {
    Object.assign(job, { status: 'done', percent: 100, step: 'Готово', securityStatus: 'clean', dateReplacements: 7, hasDownload: true, hasPreview: true, outputZip: 'out_' + job.id + '.zip' });
    job.report = cleanerReport(job);
    sims.delete(job.id);
    return;
  }
  job.percent = Math.floor(p);
  job.step = CLEAN_STEPS.filter((s) => s[0] <= job.percent).pop()[1];
}
function startSeededCleanerRun() {
  const seeded = cleanerJobs.find((j) => j.status === 'running' && !sims.has(j.id));
  if (seeded) { seeded.createdAt = Date.now() - 20000; sims.set(seeded.id, { start: Date.now(), from: seeded.percent, duration: 14000 }); }
}
override('GET', /^\/api\/cleaner\/jobs$/, ({ res }) => {
  startSeededCleanerRun();
  cleanerJobs.forEach(tickCleaner);
  send(res, 200, { success: true, jobs: cleanerJobs.map((j) => ({ ...j, report: null })) });
});
override('GET', /^\/api\/cleaner\/jobs\/([^/]+)$/, ({ res, m }) => {
  const j = cleanerJobs.find((x) => x.id === decodeURIComponent(m[1]));
  if (!j) return notFound(res);
  tickCleaner(j);
  return send(res, 200, { success: true, job: j });
});
override('POST', /^\/api\/cleaner\/jobs$/, ({ res, body }) => {
  const names = (body.files || []).map((f) => f.name);
  const archives = names.length ? names : ['landing.zip'];
  const createdAt = Date.now();
  const job = {
    id: 'job_' + createdAt + '_' + Math.floor(Math.random() * 9000 + 1000),
    kind: archives.length > 1 ? 'clean_batch' : 'clean',
    status: 'running', percent: 0, step: CLEAN_STEPS[0][1], error: null, createdAt, updatedAt: createdAt,
    user: CURRENT_USER.username, sourceArchives: archives, title: null, securityStatus: 'scanning',
    dateReplacements: 0, hasDownload: false, hasPreview: false, outputZip: null, previewDir: null, report: null,
  };
  cleanerJobs.unshift(job);
  sims.set(job.id, { start: createdAt, from: 0, duration: 9000 });
  send(res, 200, { success: true, job });
});
override('POST', /^\/api\/cleaner\/jobs\/([^/]+)\/cancel$/, ({ res, m }) => {
  const j = cleanerJobs.find((x) => x.id === decodeURIComponent(m[1]));
  if (j && j.status === 'running') { Object.assign(j, { status: 'cancelled', step: 'Остановлено', updatedAt: Date.now() }); sims.delete(j.id); }
  send(res, 200, { success: true, job: j || null });
});
override('DELETE', /^\/api\/cleaner\/jobs\/([^/]+)$/, ({ res, m }) => {
  const i = cleanerJobs.findIndex((x) => x.id === decodeURIComponent(m[1]));
  if (i >= 0) { sims.delete(cleanerJobs[i].id); cleanerJobs.splice(i, 1); }
  send(res, 200, { success: true });
});

// Tracker sync / autocheck / recheck and the promo range recheck: simulated background runs.
const trackerState = {
  sync: { active: false, phase: 'idle', progress: 100, lastSyncAt: isoAgo(35 * MIN), found: 128, added: 17, message: 'обновление списка завершено' },
  autocheck: { active: false, phase: 'idle' },
  recheck: { active: false, phase: 'idle' },
};
const trackerRuns = {};
function tickTracker() {
  Object.keys(trackerRuns).forEach((key) => {
    const run = trackerRuns[key];
    const snap = trackerState[key];
    const part = Math.min(1, (Date.now() - run.start) / run.duration);
    if (part >= 1) {
      Object.assign(snap, { active: false, phase: 'idle', progress: 100, processed: run.total, total: run.total, finishedAt: new Date().toISOString(), lastSyncAt: new Date().toISOString(), found: run.total, added: Math.round(run.total * 0.12), message: 'готово: обработано ' + run.total + ' из ' + run.total });
      delete trackerRuns[key];
      return;
    }
    const processed = Math.floor(run.total * part);
    Object.assign(snap, { active: true, phase: 'running', progress: Math.floor(part * 100), processed, total: run.total, found: processed, added: Math.round(processed * 0.12), message: 'обработка: ' + processed + ' из ' + run.total });
  });
}
override('GET', /^\/api\/tracker\/sync-status$/, ({ res }) => { tickTracker(); ok(res, trackerState); });
override('POST', /^\/api\/tracker\/sync$/, ({ res, body }) => {
  const mode = String(body.mode || 'sync');
  const key = mode === 'recheck' ? 'recheck' : (mode === 'autocheck' || mode === 'auto-check-file' ? 'autocheck' : 'sync');
  const total = key === 'sync' ? 128 : 42;
  trackerRuns[key] = { start: Date.now(), duration: 10000, total };
  trackerState[key] = { active: true, mode, phase: 'running', progress: 0, processed: 0, total, found: 0, added: 0, startedAt: new Date().toISOString(), date: body.dateTo || undefined, autocheckScope: body.autocheckScope, recheckGroup: body.recheckGroup, fileName: body.fileName || null, sendTelegramReports: Boolean(body.sendTelegramReports), message: 'запуск...' };
  send(res, 200, { success: true, message: 'started', data: trackerState });
});
override('POST', /^\/api\/tracker\/sync\/stop$/, ({ res, body }) => {
  tickTracker();
  const key = body.mode === 'recheck' ? 'recheck' : (body.mode === 'autocheck' || body.mode === 'auto-check-file' ? 'autocheck' : 'sync');
  if (trackerRuns[key]) { delete trackerRuns[key]; Object.assign(trackerState[key], { active: false, phase: 'idle', finishedAt: new Date().toISOString(), message: 'остановлено пользователем' }); }
  send(res, 200, { success: true, message: 'stopped', data: trackerState });
});
let promoRange = { active: false, phase: 'idle', processed: 0, total: 0 };
let promoRangeRun = null;
function tickPromoRange() {
  if (!promoRangeRun) return;
  const part = Math.min(1, (Date.now() - promoRangeRun.start) / promoRangeRun.duration);
  const total = promoRange.total;
  const processed = Math.floor(total * part);
  Object.assign(promoRange, { processed, successCount: processed, failedCount: 0, progress: Math.floor(part * 100), currentSourceId: part < 1 ? 'PR-' + (20260 + processed) : null });
  if (part >= 1) { Object.assign(promoRange, { active: false, phase: 'idle', finishedAt: new Date().toISOString(), message: 'готово: перепроверено ' + total }); promoRangeRun = null; }
}
override('GET', /^\/api\/promo\/recheck-range\/status$/, ({ res }) => { tickPromoRange(); ok(res, promoRange); });
override('POST', /^\/api\/promo\/recheck-range$/, ({ res, body }) => {
  promoRange = { active: true, phase: 'running', processed: 0, total: promoChecks.length, successCount: 0, failedCount: 0, progress: 0, dateFrom: body.dateFrom || null, dateTo: body.dateTo || null, sendTelegramReports: Boolean(body.sendTelegramReports), useAiCheck: body.useAiCheck !== false, startedAt: new Date().toISOString(), message: 'запуск...' };
  promoRangeRun = { start: Date.now(), duration: 9000 };
  send(res, 200, { success: true, message: 'started', data: promoRange });
});
override('POST', /^\/api\/promo\/recheck-range\/stop$/, ({ res }) => {
  tickPromoRange();
  if (promoRangeRun) { promoRangeRun = null; Object.assign(promoRange, { active: false, phase: 'idle', finishedAt: new Date().toISOString(), message: 'остановлено пользователем' }); }
  send(res, 200, { success: true, message: 'stopped', data: promoRange });
});

// Tasks: uploaded files stay in the browser (object URLs), comments can be deleted.
override('POST', /^\/api\/tasks\/upload$/, ({ res, body }) => {
  const files = (body.files && body.files.length ? body.files : [{ name: 'upload.png', size: 1024, type: 'image/png', url: BASE + '/mock-files/screenshot.svg' }]);
  ok(res, { files: files.map((f, i) => ({ id: 'att-new-' + Date.now() + '-' + i, name: f.name, originalName: f.name, fileName: f.name, size: f.size, mimeType: f.type || 'application/octet-stream', url: f.url, uploadedAt: new Date().toISOString() })) });
});
override('DELETE', /^\/api\/tasks\/(\d+)\/comments\/(\d+)$/, ({ res, m }) => {
  taskComments[m[1]] = (taskComments[m[1]] || []).filter((c) => c.id !== Number(m[2]));
  ok(res, {});
});
override('POST', /^\/api\/users\/[^/]+\/avatar\/upload$/, ({ res, body }) => {
  const f = (body.files || [])[0];
  ok(res, { avatarUrl: f && f.url ? f.url : AVATAR('#48b94f', 'АД') });
});

// ---------------------------------------------------------------- dispatcher
function dispatch(method, url, body) {
  const pathname = BASE && url.pathname.indexOf(BASE + '/api/') === 0 ? url.pathname.slice(BASE.length) : url.pathname;
  const query = Object.fromEntries(url.searchParams.entries());
  const res = {};
  for (const r of routes) {
    if (r.method !== method) continue;
    const m = r.re.exec(pathname);
    if (m) {
      try { r.handler({ req: {}, res, url, query, body: body || {}, m }); } catch (e) { console.warn('[demo-mock]', method, pathname, e); send(res, 500, { success: false, error: 'mock error' }); }
      if (!res.result) send(res, 200, { success: true });
      return res.result;
    }
  }
  send(res, 200, method === 'GET' ? { success: true, data: [] } : { success: true, data: {} });
  return res.result;
}

function isApiPath(pathname) {
  return pathname.indexOf('/api/') === 0 || (BASE && pathname.indexOf(BASE + '/api/') === 0);
}

function readBody(body) {
  if (body == null) return {};
  if (typeof body === 'string') { try { return JSON.parse(body || '{}'); } catch (e) { return {}; } }
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    const out = { files: [] };
    body.forEach((value, key) => {
      if (typeof File !== 'undefined' && value instanceof File) {
        let url = BASE + '/mock-files/screenshot.svg';
        try { url = URL.createObjectURL(value); } catch (e) { /* keep placeholder */ }
        out.files.push({ field: key, name: value.name, size: value.size, type: value.type, url: url });
      } else { out[key] = value; }
    });
    return out;
  }
  return {};
}

// ---------------------------------------------------------------- browser shims
function inDemo(pathname) {
  return BASE ? pathname === BASE || pathname.indexOf(BASE + '/') === 0 : true;
}

// Address bar always shows ".../index.html" (a real file, so a reload works on any static host),
// while the router keeps working with the canonical "folder/" URLs.
(function () {
  const rawPush = window.history.pushState.bind(window.history);
  const rawReplace = window.history.replaceState.bind(window.history);
  const explicit = function (url) {
    if (url == null) return url;
    try {
      const target = new URL(String(url), window.location.href);
      if (target.origin !== window.location.origin || !inDemo(target.pathname) || !/\/$/.test(target.pathname)) return url;
      return target.pathname + 'index.html' + target.search + target.hash;
    } catch (e) { return url; }
  };
  const canonicalize = function () {
    const p = window.location.pathname;
    if (/\/index\.html$/.test(p) && inDemo(p)) {
      try { rawReplace(window.history.state, '', p.slice(0, -10) + window.location.search + window.location.hash); } catch (e) { /* ignore */ }
    }
  };
  window.history.pushState = function (state, unused, url) { return rawPush(state, unused, explicit(url)); };
  window.history.replaceState = function (state, unused, url) { return rawReplace(state, unused, explicit(url)); };
  canonicalize();
  // Registered before the router's own listener: back/forward hand it a canonical URL.
  window.addEventListener('popstate', canonicalize);
  window.addEventListener('pageshow', function (event) { if (event.persisted) canonicalize(); });
})();

const realFetch = window.fetch ? window.fetch.bind(window) : null;
window.fetch = function demoFetch(input, init) {
  let href; let method = 'GET'; let body; let signal;
  try {
    const isRequest = typeof Request !== 'undefined' && input instanceof Request;
    href = isRequest ? input.url : String(input);
    method = String((init && init.method) || (isRequest && input.method) || 'GET').toUpperCase();
    body = init && init.body;
    signal = (init && init.signal) || (isRequest && input.signal) || null;
  } catch (e) { href = String(input); }
  let url;
  try { url = new URL(href, window.location.href); } catch (e) { url = null; }
  if (url && url.origin === window.location.origin && method === 'HEAD' && inDemo(url.pathname) && /\/$/.test(url.pathname)) {
    // The client router probes the page URL before loading its data files. Answer locally so that
    // navigation never depends on the host resolving "folder/" to "folder/index.html".
    return Promise.resolve(new Response(null, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
  }
  if (url && url.origin === window.location.origin && BASE !== BUILT_BASE && method === 'GET' && inDemo(url.pathname) && /\.txt$/.test(url.pathname) && realFetch) {
    // Route data files carry asset paths of the folder the export was built for: adjust them for the real one.
    return realFetch(input, init).then(function (res) {
      if (!res.ok) return res;
      return res.text().then(function (text) {
        return new Response(text.split(BUILT_BASE + '/').join(BASE + '/'), { status: res.status, statusText: res.statusText, headers: res.headers });
      });
    });
  }
  if (!url || url.origin !== window.location.origin || !isApiPath(url.pathname)) {
    return realFetch ? realFetch(input, init) : Promise.reject(new TypeError('fetch unavailable'));
  }
  return new Promise(function (resolve, reject) {
    const abort = function () { reject(new DOMException('The operation was aborted.', 'AbortError')); };
    if (signal && signal.aborted) { abort(); return; }
    const delay = method === 'GET' ? 90 + Math.floor(Math.random() * 140) : 220 + Math.floor(Math.random() * 200);
    const timer = setTimeout(function () {
      if (signal) signal.removeEventListener('abort', onAbort);
      let result;
      try { result = dispatch(method === 'HEAD' ? 'GET' : method, url, readBody(body)); } catch (e) { result = { status: 500, headers: { 'Content-Type': 'application/json' }, body: '{"success":false,"error":"mock error"}' }; }
      resolve(new Response(result.body, { status: result.status, headers: result.headers }));
    }, delay);
    function onAbort() { clearTimeout(timer); abort(); }
    if (signal) signal.addEventListener('abort', onAbort, { once: true });
  });
};

// Server-sent events: the stream connects and then stays quiet.
const RealEventSource = window.EventSource;
function DemoEventSource(url) {
  let target;
  try { target = new URL(String(url), window.location.href); } catch (e) { target = null; }
  if (RealEventSource && target && !(target.origin === window.location.origin && isApiPath(target.pathname))) {
    return new RealEventSource(url);
  }
  const self = this;
  const bus = document.createDocumentFragment();
  this.url = String(url);
  this.readyState = 0;
  this.withCredentials = false;
  this.onopen = null; this.onmessage = null; this.onerror = null;
  this.addEventListener = bus.addEventListener.bind(bus);
  this.removeEventListener = bus.removeEventListener.bind(bus);
  this.dispatchEvent = bus.dispatchEvent.bind(bus);
  this.close = function () { self.readyState = 2; };
  setTimeout(function () {
    if (self.readyState === 2) return;
    self.readyState = 1;
    const ev = new Event('open');
    if (typeof self.onopen === 'function') self.onopen(ev);
    bus.dispatchEvent(ev);
  }, 60);
}
DemoEventSource.CONNECTING = 0; DemoEventSource.OPEN = 1; DemoEventSource.CLOSED = 2;
window.EventSource = DemoEventSource;

if (navigator.sendBeacon) {
  const realBeacon = navigator.sendBeacon.bind(navigator);
  navigator.sendBeacon = function (url, payload) {
    try {
      const target = new URL(String(url), window.location.href);
      if (target.origin === window.location.origin && isApiPath(target.pathname)) return true;
    } catch (e) { return true; }
    return realBeacon(url, payload);
  };
}

// The demo never leaves its own folder: downloads and external links only show a note.
let noteTimer = null;
function note(kind) {
  const en = document.documentElement.lang === 'en';
  const text = kind === 'download'
    ? (en ? 'Demo: file downloads are disabled' : 'Демо: скачивание файлов отключено')
    : (en ? 'Demo: external links are disabled' : 'Демо: внешние ссылки отключены');
  let el = document.getElementById('acid-demo-note');
  if (!el) {
    el = document.createElement('div');
    el.id = 'acid-demo-note';
    el.setAttribute('role', 'status');
    el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483647;padding:10px 16px;border-radius:999px;background:#1f1f23;color:#f5f5f6;border:1px solid rgba(255,255,255,.14);font:500 13px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.45);pointer-events:none;transition:opacity .2s;max-width:calc(100vw - 32px);text-align:center';
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.style.opacity = '1';
  clearTimeout(noteTimer);
  noteTimer = setTimeout(function () { el.style.opacity = '0'; }, 2200);
}
function classify(href) {
  if (!href || /^(#|javascript:|blob:|data:|mailto:|tel:)/i.test(href)) return null;
  let target;
  try { target = new URL(href, window.location.href); } catch (e) { return null; }
  if (target.origin !== window.location.origin) return 'external';
  if (isApiPath(target.pathname)) return 'download';
  if (BASE && target.pathname.indexOf(BASE + '/') !== 0 && target.pathname !== BASE) return 'external';
  return null;
}
document.addEventListener('click', function (event) {
  const anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
  if (!anchor) return;
  const kind = classify(anchor.getAttribute('href'));
  if (!kind) return;
  event.preventDefault();
  event.stopPropagation();
  note(kind);
}, true);
const realOpen = window.open ? window.open.bind(window) : null;
window.open = function (href) {
  const kind = classify(href == null ? '' : String(href));
  if (kind) { note(kind); return null; }
  return realOpen ? realOpen.apply(null, arguments) : null;
};
})();
