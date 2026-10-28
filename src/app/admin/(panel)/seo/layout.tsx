import { SeoTabs } from '@/components/admin/SeoTabs';

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">SEO</h1>
        <p className="text-sm text-[#6b7a75]">Metadata, redirects, indexing and structured data for the whole website.</p>
      </div>
      <SeoTabs />
      {children}
    </div>
  );
}
