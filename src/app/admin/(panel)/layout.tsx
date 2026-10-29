import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return <AdminShell user={session.u} role={session.r}>{children}</AdminShell>;
}
