import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import Script from 'next/script';
import { CartDrawer } from '@/components/CartDrawer';
import { ContactRail } from '@/components/ContactRail';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { JsonLd } from '@/components/JsonLd';
import { ReviewsBand } from '@/components/ReviewsBand';
import { StoresAndReviews } from '@/components/StoresAndReviews';
import { CityProvider } from '@/components/CityProvider';
import { BookNowButton } from '@/components/BookNowButton';
import { PageGallery } from '@/components/PageGallery';
import { PageVideo } from '@/components/PageVideo';
import { CartProvider } from '@/lib/cart';
import { organizationSchema, websiteSchema } from '@/lib/seo';
import { GA_ID, GOOGLE_SITE_VERIFICATION, GTM_ID, SITE_URL, site } from '@/lib/site';
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
  themeColor: '#004A40',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable}`}>
      <head>
        {GTM_ID ? (
          <Script id="gtm" strategy="beforeInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        ) : null}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="beforeInteractive" />
        <Script id="gtag-init" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
      </head>
      <body>
        {GTM_ID ? (
          <>
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

        {/* The cart wraps the whole tree, not just the tariff pages: the header
            badge and the drawer live outside those routes. */}
        <CityProvider>
        <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <PageGallery />
          <ReviewsBand />
          <StoresAndReviews />
          <Footer />
          <ContactRail />
          <BookNowButton />
          <PageVideo />
          <CartDrawer />
        </CartProvider>
        </CityProvider>
      </body>
    </html>
  );
}
