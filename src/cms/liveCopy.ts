/**
 * Editable copy. Wraps a built-in content object in a read-through Proxy: every
 * string read is checked against the CMS overrides (`__vzCopy[source][path]`)
 * and the override wins. With no overrides it returns the object's own values,
 * so nothing changes until an editor changes something.
 *
 * Overrides are published to `globalThis.__vzCopy` on the server (boot / save)
 * and to the browser by an inline script, exactly like contact facts, so server
 * and client components always agree. No server-only imports here.
 */
export type CopyOverrides = Record<string, Record<string, string>>;

const store = (): CopyOverrides | undefined => (globalThis as { __vzCopy?: CopyOverrides }).__vzCopy;

export function setLiveCopy(c: CopyOverrides) {
  (globalThis as { __vzCopy?: CopyOverrides }).__vzCopy = c;
}

export function liveCopy<T extends object>(source: string, base: T): T {
  const wrap = (obj: object, path: string): object =>
    new Proxy(obj, {
      get(target, prop, receiver) {
        const v = Reflect.get(target, prop, receiver);
        if (typeof prop === 'symbol') return v;
        const p = path ? `${path}.${prop}` : prop;
        if (typeof v === 'string') return store()?.[source]?.[p] ?? v;
        if (v && typeof v === 'object') return wrap(v as object, p);
        return v;
      },
    });
  return wrap(base, '') as T;
}

/** Every string leaf of an object as `path → text` (used by the editor and the API's validation). */
export function stringLeaves(value: unknown, path = '', out: Record<string, string> = {}): Record<string, string> {
  if (typeof value === 'string') {
    out[path] = value;
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => stringLeaves(v, path ? `${path}.${i}` : String(i), out));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) stringLeaves(v, path ? `${path}.${k}` : k, out);
  }
  return out;
}
