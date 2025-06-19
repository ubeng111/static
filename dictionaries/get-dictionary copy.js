// get-dictionary.js
import 'server-only';

const dictionaries = {
  'us': () => import('./us.json').then((module) => module.default),
  'es': () => import('./es.json').then((module) => module.default),
  'fr': () => import('./fr.json').then((module) => module.default),
  'it': () => import('./it.json').then((module) => module.default),
  'nl': () => import('./nl.json').then((module) => module.default),
  'de': () => import('./de.json').then((module) => module.default),
  'pl': () => import('./pl.json').then((module) => module.default),
  'bg': () => import('./bg.json').then((module) => module.default),
  'th': () => import('./th.json').then((module) => module.default),
  'hk': () => import('./hk.json').then((module) => module.default),
  'ua': () => import('./ua.json').then((module) => module.default),
  'cz': () => import('./cz.json').then((module) => module.default),
  'dk': () => import('./dk.json').then((module) => module.default),
  'no': () => import('./no.json').then((module) => module.default),
  'se': () => import('./se.json').then((module) => module.default),
  'ro': () => import('./ro.json').then((module) => module.default),
  'tr': () => import('./tr.json').then((module) => module.default),
  'br': () => import('./br.json').then((module) => module.default),
  'my': () => import('./my.json').then((module) => module.default),
  'ru': () => import('./ru.json').then((module) => module.default),
  'id': () => import('./id.json').then((module) => module.default),
  'il': () => import('./il.json').then((module) => module.default),
  'kr': () => import('./kr.json').then((module) => module.default),
  'jp': () => import('./jp.json').then((module) => module.default),
  'cn': () => import('./cn.json').then((module) => module.default),

  'in': () => import('./in.json').then((module) => module.default),
  'mx': () => import('./mx.json').then((module) => module.default),
  'sa': () => import('./sa.json').then((module) => module.default),
  'ch': () => import('./ch.json').then((module) => module.default),
  'za': () => import('./za.json').then((module) => module.default),
  // 'ar': () => import('./ar.json').then((module) => module.default), // Dihapus: Argentina
  'eg': () => import('./eg.json').then((module) => module.default),
};

export const getdictionary = async (locale) => {
  if (dictionaries[locale]) {
    return dictionaries[locale]();
  }
  return dictionaries['us']();
};