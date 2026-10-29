import { redirect } from 'next/navigation';
import { SiteMenus } from '@/components/admin/SiteMenus';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function SiteScreen() {
  if ((await getSession())?.r !== 'admin') redirect('/admin/');
  return <SiteMenus />;
}
