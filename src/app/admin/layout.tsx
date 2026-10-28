import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vanzoo Admin',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root min-h-screen bg-[#f4f6f5] text-neutral-ink">{children}</div>;
}
