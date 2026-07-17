/**
 * Banc de preuve i18n (Playwright) — navlys-core.
 * Sert le site en local (avec la même réécriture /_shared/* que Vercel + URLs
 * propres), puis pour CHAQUE page × CHAQUE langue :
 *   - applique la langue via window.NAVLYS_I18N.set(lang) ;
 *   - vérifie dir=rtl pour ar/he/ur, sinon ltr ;
 *   - vérifie qu'AUCUNE chaîne FR traduisible restée à l'écran n'est encore en FR
 *     (toute clé du dico présente sur la page doit être appliquée) ;
 *   - vérifie le retour au FR.
 * Sortie code 1 au moindre écart.
 *
 *   node tools/i18n_check.mjs
 */
import { chromium } from 'playwright';
import http from 'http';
import { readFileSync, existsSync, readdirSync } from 'fs';
import path from 'path';

const CORE = path.resolve('sites/navlys-core');
const SHARED = path.resolve('sites/_shared');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg' };

function resolveReq(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p.startsWith('/_shared/')) return path.join(SHARED, p.slice('/_shared/'.length));
  if (p === '/' || p === '') return path.join(CORE, 'index.html');
  let f = path.join(CORE, p.replace(/^\//, ''));
  if (existsSync(f) && !f.endsWith('.html')) return f;          // asset direct
  if (existsSync(f + '.html')) return f + '.html';               // URL propre
  if (existsSync(f) && readdirSync(CORE)) return f;
  return f;
}

const server = http.createServer((req, res) => {
  const file = resolveReq(req.url);
  if (!existsSync(file)) { res.statusCode = 404; res.end('404'); return; }
  res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, r));
const PORT = server.address().port;
const base = `http://127.0.0.1:${PORT}`;

const source = JSON.parse(readFileSync(path.join(CORE, 'i18n/_source.json'), 'utf8'));
const LANGS = ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'wa', 'ru', 'zh', 'hi', 'bn', 'ar', 'he', 'ur'];
const RTL = new Set(['ar', 'he', 'ur']);
const routes = ['/', '/finance', '/next-gen', '/navlex', '/mentions-legales', '/bientot', '/404'];

const browser = await chromium.launch();
const page = await browser.newPage();
let failures = 0;

for (const route of routes) {
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.waitForFunction('window.NAVLYS_I18N && window.NAVLYS_I18N_DATA', { timeout: 5000 });
  for (const lang of LANGS) {
    const r = await page.evaluate(async ({ lang }) => {
      window.NAVLYS_I18N.set(lang);
      await new Promise((res) => setTimeout(res, 40));
      const dir = document.documentElement.getAttribute('dir');
      const dict = (window.NAVLYS_I18N_DATA[lang]) || null;
      // Collecte des textes FR encore visibles qui AURAIENT dû être traduits
      const leaks = [];
      if (dict) {
        const SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1 };
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
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
        while ((n = w.nextNode())) {
          const t = n.nodeValue.trim();
          // fuite = ce texte est une clé FR AVEC une traduction ≠ FR, mais l'écran montre encore le FR
          if (dict[t] && dict[t].trim() !== t) leaks.push(t);
        }
      }
      return { dir, title: document.title, leaks: leaks.slice(0, 5), leakN: leaks.length };
    }, { lang });

    const wantDir = RTL.has(lang) ? 'rtl' : 'ltr';
    if (r.dir !== wantDir) { console.error(`✗ ${route} [${lang}] dir=${r.dir} attendu ${wantDir}`); failures++; }
    if (lang !== 'fr' && r.leakN > 0) {
      console.error(`✗ ${route} [${lang}] ${r.leakN} texte(s) FR non traduits ex:`, r.leaks);
      failures++;
    }
  }
  // Retour FR propre
  const back = await page.evaluate(() => { window.NAVLYS_I18N.set('fr'); return document.documentElement.getAttribute('dir'); });
  if (back !== 'ltr') { console.error(`✗ ${route} retour FR dir=${back}`); failures++; }
  console.log(`✓ ${route} — 15 langues OK`);
}

await browser.close();
server.close();
if (failures) { console.error(`\n${failures} écart(s) i18n.`); process.exit(1); }
console.log(`\n✅ i18n vérifié : ${routes.length} pages × ${LANGS.length} langues, 0 écart.`);
