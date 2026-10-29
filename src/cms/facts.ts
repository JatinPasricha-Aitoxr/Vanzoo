import { unstable_cache } from 'next/cache';
import type { LiveFacts } from '@/lib/site';
import { readSetting } from './seoStore';

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
}
