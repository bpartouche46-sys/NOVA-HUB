/**
 * Construit la liste FR à traduire à partir de i18n/_keys.json en retirant :
 *   - les lectures DYNAMIQUES du simulateur finance (nombres recalculés au runtime),
 *   - les jetons purement emoji / symbole / nombre / marque (non traduisibles).
 * Sortie : i18n/_source.json (tableau FR canonique à envoyer aux traducteurs).
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const DIR = path.resolve('sites/navlys-core/i18n');
const keys = JSON.parse(readFileSync(path.join(DIR, '_keys.json'), 'utf8'));

// Snapshots dynamiques du simulateur (regénérés par finance.html en JS)
const DYNAMIC = new Set([
  '10 000 €', '10 ans', '100 €', '27 468 €', '52 800 €', '7 700 €',
  'Tu as mis 22 000 € — soit 5 468 € construits sans jamais tout risquer.'
]);

// Purement non-textuel (emoji seul, symbole seul, nombre/pourcentage/prix seul)
const isNonText = (s) => {
  if (DYNAMIC.has(s)) return true;
  if (/^Tu as mis /.test(s)) return true;              // phrase templatée du simulateur (nombres runtime)
  if (/^[\d\s.,%–€-]+$/.test(s)) return true;          // nombres / prix / plages
  // aucune lettre latine ni cyrillique (donc emoji/symbole seul, ex. "·", "⚖️", "①")
  if (!/[A-Za-zÀ-ÿ]/.test(s)) return true;
  return false;
};

const src = keys.filter((k) => !isNonText(k)).sort((a, b) => a.localeCompare(b, 'fr'));
writeFileSync(path.join(DIR, '_source.json'), JSON.stringify(src, null, 2) + '\n');
console.log(`${src.length} chaînes à traduire (sur ${keys.length}) → i18n/_source.json`);
