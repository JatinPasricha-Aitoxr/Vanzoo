import { unstable_cache } from 'next/cache';
import type { LiveFacts } from '@/lib/site';
import { readSetting } from './seoStore';
import { setLiveCopy, type CopyOverrides } from './liveCopy';

/** Contact details, booking links and store addresses an administrator can change. See `LiveFacts` in lib/site.ts. */
export const FACTS_TAG = 'facts';

export const readFacts = () => readSetting<LiveFacts>('facts', {});
export const getFacts = unstable_cache(readFacts, ['live-facts'], { tags: [FACTS_TAG], revalidate: 300 });

/** Publishes the facts to this process; lib/site.ts getters read them at render time. */
export function setLiveFacts(f: LiveFacts) {
  (globalThis as { __vzFacts?: LiveFacts }).__vzFacts = f;
}

export async function loadLiveFacts() {
  setLiveFacts(await readFacts());
  const { readSetting: read } = await import('./seoStore');
  setLiveDesign(await read<Record<string, string>>('design', {}));
  setLiveCopy(await read<CopyOverrides>('copy', {}));
}

export const COPY_TAG = 'copy';
export const getCopyOverrides = unstable_cache(() => readSetting<CopyOverrides>('copy', {}), ['live-copy'], { tags: [COPY_TAG], revalidate: 300 });

/** Publishes the design settings (breakpoints) to this process; cms/schema.ts reads them at render time. */
export function setLiveDesign(d: Record<string, string>) {
  (globalThis as { __vzDesign?: Record<string, string> }).__vzDesign = d;
}
