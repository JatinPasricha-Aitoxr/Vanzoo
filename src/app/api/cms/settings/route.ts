import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireSession } from '@/lib/auth';
import { getSettings, saveSettings, storageKind } from '@/lib/settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const a = await requireSession();
  if ('error' in a) return a.error;
  return NextResponse.json({ settings: await getSettings(), storage: storageKind() });
}

export async function PUT(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const body = z.object({ delhiEnabled: z.boolean() }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  try {
    await saveSettings({ ...(await getSettings()), delhiEnabled: body.data.delhiEnabled });
  } catch {
    return NextResponse.json({ error: 'Could not save settings.' }, { status: 503 });
  }
  await audit(a.session.u, 'settings_update', 'delhiEnabled', body.data);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true, settings: await getSettings() });
}
