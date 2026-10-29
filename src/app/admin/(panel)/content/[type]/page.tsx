import { notFound } from 'next/navigation';
import { ContentManager } from '@/components/admin/ContentManager';
import { TariffManager } from '@/components/admin/TariffManager';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ContentScreen({ params }: { params: { type: string } }) {
  if (params.type === 'pricing') {
    if ((await getSession())?.r !== 'admin') redirect('/admin/');
    return <TariffManager />;
  }
  if (!['service', 'product', 'area', 'faq'].includes(params.type)) notFound();
  return <ContentManager type={params.type} />;
}
