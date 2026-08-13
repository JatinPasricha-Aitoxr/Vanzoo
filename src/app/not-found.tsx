import Link from 'next/link';
import { navLinks } from '@/lib/site';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70svh] flex-col justify-center py-section">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-display-lg">We couldn&apos;t find that page</h1>
      <p className="mt-4 max-w-xl text-lead text-neutral-body">
        The link may be out of date. Try one of these instead, or head back to the homepage.
      </p>

      <ul className="mt-8 flex flex-wrap gap-2.5">
        {navLinks
          .filter((link) => link.href !== '/')
          .map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="btn-secondary btn-md">
                {link.label}
              </Link>
            </li>
          ))}
        <li>
          <Link href="/blogs/" className="btn-secondary btn-md">
            Blogs
          </Link>
        </li>
      </ul>

      <div className="mt-10">
        <Link href="/" className="btn-primary btn-lg">
          Back to home
        </Link>
      </div>
    </div>
  );
}
