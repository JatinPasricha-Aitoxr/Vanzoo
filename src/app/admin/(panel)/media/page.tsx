import { MediaLibrary } from '@/components/admin/MediaPicker';
import { Card } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default function MediaScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Media library</h1>
        <p className="text-sm text-[#6b7a75]">Upload images, add alt text, and reuse them in the page builder.</p>
      </div>
      <Card><MediaLibrary /></Card>
    </div>
  );
}
