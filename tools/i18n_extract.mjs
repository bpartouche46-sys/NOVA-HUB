/**
 * Extracteur de clés i18n — nova-hub / navlys-core.
 * Charge chaque page dans un vrai navigateur (Playwright) et collecte, avec
 * EXACTEMENT les mêmes règles que le moteur `navlys-i18n.js`, tous les textes
 * traduisibles (nœuds de texte + attributs + <title>/méta). Sortie : la liste
 * FR canonique, alignée sur ce que verra le moteur au runtime.
 *
 *   node tools/i18n_extract.mjs           → écrit sites/navlys-core/i18n/_keys.json
 */
import { chromium } from 'playwright';
import { readdirSync, writeFileSync, mkdirSync } from 'fs';
import { pathToFileURL } from 'url';
import path from 'path';

const SITE = path.resolve('sites/navlys-core');
const OUT_DIR = path.join(SITE, 'i18n');
const pages = readdirSync(SITE).filter((f) => f.endsWith('.html'));

const collect = () => {
  const SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1 };
  const keys = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      let p = n.parentNode;
      while (p && p.nodeType === 1) {
        if (SKIP[p.tagName]) return NodeFilter.FILTER_REJECT;
        if (p.getAttribute && p.getAttribute('data-noi18n') != null) return NodeFilter.FILTER_REJECT;
        p = p.parentNode;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let n;
  while ((n = walker.nextNode())) keys.add(n.nodeValue.trim());

  ['placeholder', 'title', 'aria-label', 'alt'].forEach((a) => {
    document.querySelectorAll('[' + a + ']').forEach((el) => {
      if (el.closest('[data-noi18n]')) return;
      const v = (el.getAttribute(a) || '').trim();
      if (v) keys.add(v);
    });
  });
  document.querySelectorAll('button[value],input[type=button],input[type=submit]').forEach((el) => {
    const v = (el.getAttribute('value') || '').trim();
    if (v) keys.add(v);
  });
  if (document.title) keys.add(document.title.trim());
  document.querySelectorAll(
    'meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"]'
  ).forEach((m) => {
    const v = (m.getAttribute('content') || '').trim();
    if (v) keys.add(v);
  });
  return Array.from(keys);
};

const browser = await chromium.launch();
const page = await browser.newPage();
const all = new Map(); // key → [pages]
for (const f of pages) {
  await page.goto(pathToFileURL(path.join(SITE, f)).href, { waitUntil: 'domcontentloaded' });
  const keys = await page.evaluate(collect);
  for (const k of keys) {
    if (!all.has(k)) all.set(k, []);
    all.get(k).push(f);
  }
}
await browser.close();

const keys = Array.from(all.keys()).sort((a, b) => a.localeCompare(b, 'fr'));
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(path.join(OUT_DIR, '_keys.json'), JSON.stringify(keys, null, 2) + '\n');
console.log(`${keys.length} clés extraites de ${pages.length} pages → i18n/_keys.json`);
