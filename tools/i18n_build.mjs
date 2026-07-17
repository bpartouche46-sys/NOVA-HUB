/**
 * Assemble les dictionnaires i18n/<lang>.json en un seul fichier chargé par les
 * pages : sites/_shared/navlys-i18n-data.js  → window.NAVLYS_I18N_DATA = {…}.
 *
 * Contrôle qualité (échoue si un souci) :
 *   - chaque langue doit couvrir 100 % des clés de _source.json ;
 *   - aucune clé fantôme (hors _source.json) ;
 *   - aucune valeur vide.
 *
 *   node tools/i18n_build.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const DIR = path.resolve('sites/navlys-core/i18n');
const OUT = path.resolve('sites/_shared/navlys-i18n-data.js');
const LANGS = ['en', 'es', 'pt', 'it', 'de', 'nl', 'wa', 'ru', 'zh', 'hi', 'bn', 'ar', 'he', 'ur'];

const source = JSON.parse(readFileSync(path.join(DIR, '_source.json'), 'utf8'));
const srcSet = new Set(source);

let hardFail = false;
const data = {};
for (const lang of LANGS) {
  const f = path.join(DIR, `${lang}.json`);
  if (!existsSync(f)) { console.error(`✗ ${lang}: fichier manquant`); hardFail = true; continue; }
  let dict;
  try { dict = JSON.parse(readFileSync(f, 'utf8')); }
  catch (e) { console.error(`✗ ${lang}: JSON invalide — ${e.message}`); hardFail = true; continue; }

  const miss = source.filter((k) => !(k in dict));
  const extra = Object.keys(dict).filter((k) => !srcSet.has(k));
  const empty = Object.keys(dict).filter((k) => !String(dict[k] ?? '').trim());
  if (miss.length || extra.length || empty.length) {
    console.error(`✗ ${lang}: manquantes=${miss.length} fantômes=${extra.length} vides=${empty.length}`);
    if (miss.length) console.error('   manquantes:', miss.slice(0, 8));
    if (extra.length) console.error('   fantômes:', extra.slice(0, 8));
    if (empty.length) console.error('   vides:', empty.slice(0, 8));
    hardFail = true;
    continue;
  }
  // Réordonne selon _source.json pour un diff stable
  const ordered = {};
  for (const k of source) ordered[k] = dict[k];
  data[lang] = ordered;
  console.log(`✓ ${lang}: ${source.length}/${source.length}`);
}

if (hardFail) {
  console.error('\nAssemblage refusé : corrige les langues ci-dessus.');
  process.exit(1);
}

const banner =
  '/* NAVLYS i18n — données générées par tools/i18n_build.mjs. NE PAS ÉDITER À LA MAIN.\n' +
  `   ${LANGS.length} langues × ${source.length} chaînes. Source : sites/navlys-core/i18n/*.json */\n`;
writeFileSync(OUT, banner + 'window.NAVLYS_I18N_DATA = ' + JSON.stringify(data, null, 0) + ';\n');
console.log(`\n→ ${path.relative(process.cwd(), OUT)} (${LANGS.length} langues)`);
