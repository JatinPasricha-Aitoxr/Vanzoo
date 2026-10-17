/**
 * Forgiving search over tariff rows: lower-cased, punctuation-insensitive,
 * singular/plural-insensitive and aware of everyday synonyms, so "pants",
 * "trouser" and "pant/trouser" all find the same row.
 */

const SYNONYMS: Record<string, string[]> = {
  pant: ['trouser', 'pants', 'bottom'],
  trouser: ['pant', 'pants'],
  jean: ['denim'],
  tshirt: ['tee', 'top'],
  shirt: ['formal'],
  saree: ['sari'],
  lehenga: ['lehnga', 'lengha', 'ghagra'],
  kurta: ['kurti'],
  sherwani: ['achkan'],
  salwar: ['salvar', 'shalwar', 'patiala'],
  coat: ['blazer', 'overcoat'],
  jacket: ['blazer'],
  suit: ['blazer', 'tuxedo'],
  sweater: ['jumper', 'pullover', 'woollen', 'woolen'],
  shawl: ['stole', 'wrap'],
  dupatta: ['stole', 'scarf'],
  blanket: ['quilt', 'rajai', 'comforter', 'duvet'],
  quilt: ['blanket', 'rajai'],
  comforter: ['blanket', 'duvet'],
  bedsheet: ['sheet', 'bedding', 'linen'],
  curtain: ['drape', 'drapes'],
  carpet: ['rug', 'mat'],
  sneaker: ['shoe', 'trainer'],
  shoe: ['sneaker', 'footwear'],
  sandal: ['chappal', 'slipper', 'footwear', 'slide'],
  birkenstock: ['sandal', 'clog', 'footwear'],
  boot: ['shoe', 'footwear'],
  handbag: ['bag', 'purse'],
  toy: ['teddy', 'stuffed'],
  dress: ['gown', 'frock'],
};

const REVERSE: Record<string, string[]> = {};
for (const [key, list] of Object.entries(SYNONYMS)) {
  for (const word of list) (REVERSE[stemSimple(word)] ??= []).push(key);
}
function stemSimple(word: string): string {
  return stem(word);
}

/** "Pants" → "pant", "Dresses" → "dress", "T-Shirt" → "tshirt". */
export function stem(word: string): string {
  const w = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (w.length > 4 && w.endsWith('ies')) return `${w.slice(0, -3)}y`;
  if (w.length > 4 && (w.endsWith('ches') || w.endsWith('shes') || w.endsWith('sses') || w.endsWith('xes'))) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map(stem);
}

/** True when every word the visitor typed matches the item or its group. */
export function matchesQuery(query: string, ...fields: string[]): boolean {
  const wanted = tokens(query);
  if (wanted.length === 0) return true;
  const haystack = tokens(fields.join(' '));
  // Also match "tshirt" typed as "t shirt" / "t-shirt".
  const joined = haystack.join('');
  return wanted.every((term) => {
    const options = [term, ...(SYNONYMS[term] ?? []).map(stem), ...(REVERSE[term] ?? [])];
    return options.some((option) => haystack.some((h) => h.includes(option) || option.includes(h) && h.length > 3) || joined.includes(option));
  });
}
