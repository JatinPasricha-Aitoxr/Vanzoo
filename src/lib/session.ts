/**
 * Signed session cookie, built on Web Crypto so it works in both Edge
 * middleware and Node route handlers. Format: base64url(payload).base64url(hmac).
 */
export type Session = { u: string; r: 'admin' | 'editor'; exp: number };

export const SESSION_COOKIE = 'vz_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

const enc = new TextEncoder();

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 24) return s;
  if (process.env.NODE_ENV === 'production') return ''; // sessions disabled until configured
  return 'dev-only-session-secret-not-for-production';
}

const b64url = (bytes: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function key(): Promise<CryptoKey | null> {
  const s = secret();
  if (!s) return null;
  return crypto.subtle.importKey('raw', enc.encode(s), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function signSession(session: Omit<Session, 'exp'>): Promise<string> {
  const k = await key();
  if (!k) throw new Error('SESSION_SECRET is not configured');
  const payload = b64url(enc.encode(JSON.stringify({ ...session, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })));
  const sig = b64url(await crypto.subtle.sign('HMAC', k, enc.encode(payload)));
  return `${payload}.${sig}`;
}

export async function verifySession(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const k = await key();
  if (!k) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', k, fromB64url(sig), enc.encode(payload));
    if (!ok) return null;
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as Session;
    return data.exp > Math.floor(Date.now() / 1000) ? data : null;
  } catch {
    return null;
  }
}

/** Shared secret for middleware → internal API calls (never exposed to browsers). */
export async function internalToken(): Promise<string> {
  const k = await key();
  if (!k) return '';
  return b64url(await crypto.subtle.sign('HMAC', k, enc.encode('vanzoo-internal-v1')));
}
