import { redirect } from 'next/navigation';
import { DesignTokens } from '@/components/admin/DesignTokens';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DesignScreen() {
  if ((await getSession())?.r !== 'admin') redirect('/admin/');
  return <DesignTokens />;
}
