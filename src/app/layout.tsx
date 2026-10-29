import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans, Fraunces, Inter, Lato, Lora, Playfair_Display, Poppins } from 'next/font/google';
import Script from 'next/script';
import { CartDrawer } from '@/components/CartDrawer';
import { ContactRail } from '@/components/ContactRail';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { JsonLd } from '@/components/JsonLd';
import { ReviewsBand } from '@/components/ReviewsBand';
import { StoresAndReviews } from '@/components/StoresAndReviews';
import { SiteChrome } from '@/components/SiteChrome';
import { CityProvider } from '@/components/CityProvider';
import { BookNowButton } from '@/components/BookNowButton';
import { PageGallery } from '@/components/PageGallery';
import { PageVideo } from '@/components/PageVideo';
import { CartProvider } from '@/lib/cart';
import { organizationSchema, websiteSchema } from '@/lib/seo';
import { GA_ID, GOOGLE_SITE_VERIFICATION, GTM_ID, SITE_URL, site } from '@/lib/site';
import { NavProvider } from '@/components/SiteConfigContext';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { ANNOUNCE_HEIGHT } from '@/cms/announce';
import { designCss, getDesign, getSiteConfig } from '@/cms/siteConfig';
import { getServices } from '@/cms/content';
import { getFacts, setLiveDesign, setLiveFacts } from '@/cms/facts';
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

/**
 * Alternative faces an administrator can switch to (Design → Typography). They
 * are declared here so next/font self-hosts them, but `preload: false` keeps the
 * font files off the wire until a page actually uses one.
 */
const dPlayfair = Playfair_Display({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-d-playfair' });
const dLora = Lora({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-d-lora' });
const dCormorant = Cormorant_Garamond({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-d-cormorant', weight: ['400', '500', '600', '700'] });
const sDmSans = DM_Sans({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-s-dmsans' });
const sLato = Lato({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-s-lato', weight: ['400', '700'] });
const sPoppins = Poppins({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-s-poppins', weight: ['400', '500', '600', '700'] });

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const baseMetadata: Metadata = {
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

/** The favicon and touch icon follow the brand images set in Contact & locations. */
export async function generateMetadata(): Promise<Metadata> {
  const f = await getFacts();
  const mark = f.mark ?? '/images/brand/vanzoo-mark.png';
  const favicon = f.favicon ?? mark;
  const type = favicon.endsWith('.png') ? 'image/png' : favicon.endsWith('.webp') ? 'image/webp' : favicon.endsWith('.jpg') || favicon.endsWith('.jpeg') ? 'image/jpeg' : undefined;
  return { ...baseMetadata, icons: { icon: [{ url: favicon, ...(type ? { type } : {}) }], apple: [{ url: mark }] } };
}

export const viewport: Viewport = {
  themeColor: '#004A40',
  colorScheme: 'light',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [design, cfg, services, facts] = await Promise.all([getDesign(), getSiteConfig(), getServices(), getFacts()]);
  setLiveFacts(facts);
  setLiveDesign(design);
  const tokenCss = designCss(design);
  const ann = cfg.announcement;
  const announce = ann?.enabled && ann.text ? ann : null;
  return (
    <html lang="en-IN" style={announce ? ({ '--announce-h': `${ANNOUNCE_HEIGHT}px` } as React.CSSProperties) : undefined} className={`${display.variable} ${sans.variable} ${dPlayfair.variable} ${dLora.variable} ${dCormorant.variable} ${sDmSans.variable} ${sLato.variable} ${sPoppins.variable}`}>
      <head>
        {design['bp-tablet'] || design['bp-mobile'] ? (
          <script dangerouslySetInnerHTML={{ __html: `window.__vzDesign=${JSON.stringify(design).replace(/</g, '\\u003c')};` }} />
        ) : null}
        {Object.keys(facts).length ? (
          // Mirrors the CMS-edited contact facts to the browser before hydration, so client components render the same values as the server.
          <script dangerouslySetInnerHTML={{ __html: `window.__vzFacts=${JSON.stringify(facts).replace(/</g, '\\u003c')};` }} />
        ) : null}
        {tokenCss ? <style id="vz-tokens" dangerouslySetInnerHTML={{ __html: tokenCss }} /> : null}
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
        <NavProvider nav={cfg.nav} services={services.map((s) => ({ id: s.id, title: s.title }))}>
        <CartProvider>
          <SiteChrome
            before={<>{announce ? <AnnouncementBar a={announce} /> : null}<Header /></>}
            after={
              <>
                <PageGallery />
                <ReviewsBand />
                <StoresAndReviews />
                <Footer columns={cfg.footerColumns} socials={cfg.social} />
                <ContactRail />
                <BookNowButton />
                <PageVideo />
                <CartDrawer />
              </>
            }
          >
            {children}
          </SiteChrome>
        </CartProvider>
        </NavProvider>
        </CityProvider>
      </body>
    </html>
  );
}
