import { redirect } from 'next/navigation';
import { UsersManager } from '@/components/admin/UsersManager';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function UsersScreen() {
  const s = await getSession();
  if (s?.r !== 'admin') redirect('/admin/');
  return <UsersManager />;
}
