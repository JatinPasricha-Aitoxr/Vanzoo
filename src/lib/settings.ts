import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Site settings editable from /admin. Persisted to Upstash Redis (REST) when
 * UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are set — required on
 * Vercel, whose disk is read-only — otherwise to data/settings.json.
 */
export type Settings = { delhiEnabled: boolean };

export const DEFAULT_SETTINGS: Settings = { delhiEnabled: false };

const KEY = 'vanzoo:settings';
const FILE = path.join(process.cwd(), 'data', 'settings.json');

const redisUrl = () => process.env.UPSTASH_REDIS_REST_URL;
const redisToken = () => process.env.UPSTASH_REDIS_REST_TOKEN;

export function storageKind(): 'redis' | 'file' | 'none' {
  if (redisUrl() && redisToken()) return 'redis';
  return process.env.VERCEL ? 'none' : 'file';
}

async function redis(command: string[]): Promise<unknown> {
  const response = await fetch(redisUrl()!, {
    method: 'POST',
    headers: { Authorization: `Bearer ${redisToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Redis responded ${response.status}`);
  return ((await response.json()) as { result: unknown }).result;
}

export async function getSettings(): Promise<Settings> {
  try {
    const kind = storageKind();
    if (kind === 'redis') {
      const raw = (await redis(['GET', KEY])) as string | null;
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    }
    if (kind === 'file') {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(await readFile(FILE, 'utf8')) };
    }
  } catch {
    /* missing or unreadable — fall back to defaults */
  }
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Settings): Promise<void> {
  const kind = storageKind();
  if (kind === 'redis') {
    await redis(['SET', KEY, JSON.stringify(settings)]);
  } else if (kind === 'file') {
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, JSON.stringify(settings, null, 2), 'utf8');
  } else {
    throw new Error('No settings storage configured');
  }
}
