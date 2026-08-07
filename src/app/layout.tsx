import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import Script from 'next/script';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { JsonLd } from '@/components/JsonLd';
import { organizationSchema, websiteSchema } from '@/lib/seo';
import { GOOGLE_SITE_VERIFICATION, GTM_ID, SITE_URL, site } from '@/lib/site';
import './globals.css';

/**
 * Fonts are self-hosted by next/font at build time — no render-blocking request
 * to fonts.googleapis.com, and `display: swap` so text paints immediately.
 * Both are variable fonts, so the whole weight range costs one file each.
 */
const display = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  axes: ['SOFT', 'WONK', 'opsz'],
});

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vanzoo – Luxury Fabric Care & Eco-Friendly Dry Cleaning',
    // Page titles carry their own branding, so the template only fills gaps.
    template: '%s',
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  formatDetection: { telephone: true, address: true, email: true },
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  icons: {
    icon: [{ url: '/images/brand/vanzoo-mark.png', type: 'image/png' }],
    apple: [{ url: '/images/brand/vanzoo-mark.png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#1E6177',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable}`}>
      <body>
        {GTM_ID ? (
          <>
            {/* afterInteractive keeps GTM off the critical path — it loads once
                the page is usable rather than blocking first paint. */}
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
                title="Google Tag Manager"
              />
            </noscript>
          </>
        ) : null}

        <JsonLd data={[organizationSchema(), websiteSchema()]} />

        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
