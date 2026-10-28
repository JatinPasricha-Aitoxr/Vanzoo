'use client';

import { usePathname } from 'next/navigation';

/**
 * The public site's header, footer and floating widgets wrap every page except
 * the admin, which has its own layout. Passed in as slots so they stay server
 * components.
 */
export function SiteChrome({
  before,
  after,
  children,
}: {
  before: React.ReactNode;
  after: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? '';
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return <>{children}</>;
  return (
    <>
      {before}
      <main id="main">{children}</main>
      {after}
    </>
  );
}
