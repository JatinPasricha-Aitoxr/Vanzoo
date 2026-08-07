import { NextResponse } from 'next/server';

/**
 * Enquiry endpoint.
 *
 * Validates and normalises the payload, then hands it to whichever delivery
 * channel is configured. Nothing is persisted here — see README "Enquiry form"
 * for wiring this to a mail provider or CRM before launch. Until
 * `ENQUIRY_WEBHOOK_URL` is set, submissions are logged server-side and the
 * request still succeeds, so the form is testable without a provider account.
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

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!webhook) {
    console.info('[enquiry] no ENQUIRY_WEBHOOK_URL configured; enquiry not delivered', enquiry);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry),
    });
    if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
  } catch (error) {
    console.error('[enquiry] delivery failed', error);
    return NextResponse.json({ error: 'Could not deliver enquiry.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
