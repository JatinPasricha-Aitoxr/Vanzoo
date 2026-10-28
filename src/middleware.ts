import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/lib/session';

/**
 * - admin.* host: serves the admin app (other paths redirect to /admin).
 * - /admin, /api/cms, /preview: require a valid session (except the login screen).
 * - State-changing API calls must come from the same origin (CSRF).
 * - Admin and preview responses are never indexed.
 * When ADMIN_HOST is set (e.g. admin.vanzoo.in), the admin is reachable only on
 * that host; the public domain answers 404 for it.
 */
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = (req.headers.get('host') || '').toLowerCase().split(':')[0];
  const adminHost = (process.env.ADMIN_HOST || '').toLowerCase();
  const isAdminHost = host.startsWith('admin.') || (adminHost !== '' && host === adminHost);
  // The site uses trailing slashes; compare paths without them.
  let path = url.pathname.replace(/\/+$/, '') || '/';

  // On the admin host everything lives under /admin; send other paths there.
  if (isAdminHost && !path.startsWith('/admin') && !path.startsWith('/api') && !path.startsWith('/_next') && !path.startsWith('/uploads') && !path.startsWith('/images')) {
    const to = req.nextUrl.clone();
    to.pathname = path === '/login' ? '/admin/login' : '/admin';
    to.search = '';
    return NextResponse.redirect(to);
  }

  const isAdminPath = path.startsWith('/admin');
  const isCmsApi = path.startsWith('/api/cms');
  const isPreview = path.startsWith('/preview');

  if (adminHost && !isAdminHost && (isAdminPath || isCmsApi)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const isPublicAuth = path === '/admin/login' || path === '/api/cms/auth/login';
  if ((isAdminPath || isCmsApi || isPreview) && !isPublicAuth) {
    const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      if (isCmsApi) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
      const login = req.nextUrl.clone();
      login.pathname = '/admin/login';
      login.search = '';
      return NextResponse.redirect(login);
    }
  }

  if (isCmsApi && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    const origin = req.headers.get('origin');
    if (origin && new URL(origin).host.toLowerCase() !== (req.headers.get('host') || '').toLowerCase()) {
      return NextResponse.json({ error: 'Cross-origin request blocked.' }, { status: 403 });
    }
  }

  const res = NextResponse.next();
  if (isAdminPath || isCmsApi || isPreview) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.headers.set('Cache-Control', 'no-store');
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/|videos/|uploads/).*)'],
};
