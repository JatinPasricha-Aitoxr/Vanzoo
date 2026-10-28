
import { cn } from '@/lib/cn';

/** Small admin UI primitives so every screen looks and behaves the same. */
export const btn = {
  primary: 'inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A5C4B] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#084a3c] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A5C4B]',
  gold: 'inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFB107] px-3.5 py-2 text-sm font-semibold text-[#1b2b26] transition hover:bg-[#f2a400] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFB107]',
  ghost: 'inline-flex items-center justify-center gap-2 rounded-lg border border-[#d6dedb] bg-white px-3 py-2 text-sm font-medium text-neutral-ink transition hover:bg-[#eef3f1] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A5C4B]',
  danger: 'inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600',
};

export const input =
  'w-full rounded-lg border border-[#cfd8d4] bg-white px-3 py-2 text-sm text-neutral-ink placeholder:text-[#9aa8a3] focus:border-[#0A5C4B] focus:outline-none focus:ring-2 focus:ring-[#0A5C4B]/20';

export function Badge({ tone, children }: { tone: 'green' | 'gold' | 'grey' | 'red'; children: React.ReactNode }) {
  const t = {
    green: 'bg-emerald-100 text-emerald-800',
    gold: 'bg-amber-100 text-amber-900',
    grey: 'bg-slate-100 text-slate-700',
    red: 'bg-red-100 text-red-800',
  }[tone];
  return <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-semibold', t)}>{children}</span>;
}

export function Card({ title, children, actions, className }: { title?: string; children: React.ReactNode; actions?: React.ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-xl border border-[#e0e8e5] bg-white shadow-sm', className)}>
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-[#eef2f0] px-5 py-3.5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#51635d]">{title}</h2>
          {actions}
        </header>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export async function api<T = Record<string, unknown>>(url: string, init?: RequestInit & { json?: unknown }): Promise<T & { error?: string }> {
  // The site uses trailing slashes; asking for them directly saves a 308 redirect round trip.
  const target = url.includes('?') || url.endsWith('/') ? url : url + '/';
  const res = await fetch(target, {
    ...init,
    headers: { ...(init?.json !== undefined ? { 'Content-Type': 'application/json' } : {}), ...init?.headers },
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { error: (data as { error?: string }).error ?? `Request failed (${res.status})` } as T & { error?: string };
  return data as T & { error?: string };
}
