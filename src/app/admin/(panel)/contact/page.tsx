import { redirect } from 'next/navigation';
import { ContactForm } from '@/components/admin/ContactForm';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ContactScreen() {
  if ((await getSession())?.r !== 'admin') redirect('/admin/');
  return <ContactForm />;
}
