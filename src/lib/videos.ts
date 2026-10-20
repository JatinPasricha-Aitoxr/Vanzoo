import 'server-only';
import { readdirSync } from 'node:fs';
import path from 'node:path';

/**
 * Page videos live in /public/videos as `<key>.mp4`, where <key> is:
 *   home · services · pricing · membership · hydrocarbon · about · areas · contact
 *   or a service slug (couture-care, shoe-care, curtain-cleaning …).
 * (`hero-desktop` and `hero-mobile` are the homepage hero loop and are ignored.)
 *
 * Dropping a file in is all it takes — nothing in the code lists the videos, so
 * a page without its own file simply shows no player (or the `home` video as a
 * fallback in the floating preview).
 */
const IGNORED = new Set(['hero-desktop', 'hero-mobile']);

export function availableVideos(): string[] {
  try {
    return readdirSync(path.join(process.cwd(), 'public', 'videos'))
      .filter((file) => /\.mp4$/i.test(file))
      .map((file) => file.replace(/\.mp4$/i, ''))
      .filter((key) => !IGNORED.has(key));
  } catch {
    return [];
  }
}

export function videoFor(key: string): string | null {
  return availableVideos().includes(key) ? `/videos/${key}.mp4` : null;
}
