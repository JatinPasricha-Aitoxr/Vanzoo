import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { dbConfigured, parseJson, query } from '@/lib/db';
import { auditJob, runAudit, type AuditReport } from '@/cms/seoAudit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const job = auditJob();
  let report: AuditReport | undefined = job.report;
  if (!report && dbConfigured()) {
    const rows = await query<{ v: unknown }>('SELECT v FROM settings WHERE k = "audit"');
    report = rows[0] ? parseJson<AuditReport | undefined>(rows[0].v, undefined) : undefined;
  }
  return NextResponse.json({ state: job.state, done: job.done, total: job.total, message: job.message, report });
}

/** Starts a crawl in the background; poll GET for progress. */
export async function POST(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const port = Number(process.env.PORT) || 3000; // never taken from the request, whose Host header the caller controls
  void runAudit(port);
  return NextResponse.json({ ok: true });
}
