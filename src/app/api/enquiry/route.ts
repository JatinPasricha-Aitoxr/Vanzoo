import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

/**
 * Enquiry endpoint.
 *
 * Validates and normalises the payload, then stores it through every channel
 * that is configured: a local file (data/enquiries.jsonl, off Vercel), an email
 * via Resend (RESEND_API_KEY + ENQUIRY_TO_EMAIL) and/or a webhook
 * (ENQUIRY_WEBHOOK_URL). If none can store it the route answers 503.
 */

export const runtime = 'nodejs';
/** The rest of the site is static; this route must not be. */
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/;
const MAX_FIELD = 2000;

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, MAX_FIELD) : '';
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Honeypot — a filled hidden field means a bot. Answer 200 so it learns
  // nothing from the response, but drop the submission.
  if (clean(payload.company)) {
    return NextResponse.json({ ok: true });
  }

  const enquiry = {
    name: clean(payload.name),
    email: clean(payload.email),
    phone: clean(payload.phone),
    city: clean(payload.city),
    bestTime: clean(payload.bestTime),
    serviceType: clean(payload.serviceType),
    contactMethod: clean(payload.contactMethod),
    message: clean(payload.message),
    receivedAt: new Date().toISOString(),
  };

  const errors: string[] = [];
  if (enquiry.name.length < 2) errors.push('name');
  if (!EMAIL_RE.test(enquiry.email)) errors.push('email');
  if (!PHONE_RE.test(enquiry.phone)) errors.push('phone');
  if (enquiry.message.length < 10) errors.push('message');

  if (errors.length > 0) {
    return NextResponse.json(
      { error: 'Some fields need attention.', fields: errors },
      { status: 422 },
    );
  }

  // Every configured channel gets the enquiry; it counts as received if at
  // least one of them stores it. With none configured (and no writable disk)
  // we answer 503 rather than telling the visitor "sent" about a lost enquiry.
  const results = await Promise.allSettled([
    saveToFile(enquiry),
    sendEmail(enquiry),
    sendToWebhook(enquiry),
  ]);
  const stored = results.filter((r) => r.status === 'fulfilled' && r.value === true).length;
  results.forEach((r) => {
    if (r.status === 'rejected') console.error('[enquiry] channel failed', r.reason);
  });

  if (stored === 0) {
    console.error('[enquiry] no storage channel succeeded', enquiry);
    return NextResponse.json(
      { error: 'We could not save your enquiry right now. Please call us.' },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}

type Enquiry = Record<string, string>;

/** Appends one JSON line to data/enquiries.jsonl. Works on a normal server or
 *  in `next dev`; on read-only hosts (Vercel) it is skipped. */
async function saveToFile(enquiry: Enquiry): Promise<boolean> {
  if (process.env.VERCEL) return false;
  const dir = path.join(process.cwd(), 'data');
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, 'enquiries.jsonl'), JSON.stringify(enquiry) + '\n', 'utf8');
  return true;
}

/** Emails the enquiry through Resend (https://resend.com) when configured. */
async function sendEmail(enquiry: Enquiry): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  if (!key || !to) return false;
  const lines = Object.entries(enquiry)
    .filter(([, value]) => value)
    .map(([field, value]) => `${field}: ${value}`)
    .join('\n');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM_EMAIL || 'Vanzoo Website <onboarding@resend.dev>',
      to: to.split(',').map((address) => address.trim()),
      reply_to: enquiry.email || undefined,
      subject: `New Vanzoo enquiry — ${enquiry.name}${enquiry.serviceType ? ` (${enquiry.serviceType})` : ''}`,
      text: lines,
    }),
  });
  if (!response.ok) throw new Error(`Resend responded ${response.status}`);
  return true;
}

/** Forwards to a webhook (Google Sheets Apps Script, Zapier, CRM…) when set. */
async function sendToWebhook(enquiry: Enquiry): Promise<boolean> {
  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!webhook) return false;
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiry),
  });
  if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
  return true;
}
