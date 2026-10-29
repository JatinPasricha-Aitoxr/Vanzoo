import { PostEditor } from '@/components/admin/PostEditor';

export const dynamic = 'force-dynamic';

export default function PostEditScreen({ params }: { params: { slug: string } }) {
  return <PostEditor slug={params.slug} />;
}
