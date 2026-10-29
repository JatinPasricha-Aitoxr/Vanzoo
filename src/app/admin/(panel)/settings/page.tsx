import { redirect } from 'next/navigation';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function SettingsScreen() {
  if ((await getSession())?.r !== 'admin') redirect('/admin/');
  return <SettingsForm />;
}
