import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Jost } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { PageTransitionProvider } from "@/components/providers/PageTransition";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { Preloader } from "@/components/ui/Preloader";
import { site } from "@/data/site";
import { JsonLd, restaurantSchema, websiteSchema } from "@/lib/jsonld";
import "./globals.css";
import "./shapes.css";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const title = "Summer Town Resto Café — Continental Restaurant & Café in Panampilly Nagar, Kochi";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | Summer Town Resto Café, Kochi" },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Summer Town",
    "Summer Town Resto Cafe",
    "Summer Town Cafe Kochi",
    "Panampilly Nagar restaurant",
    "cafe in Panampilly Nagar",
    "best continental restaurant in Kochi",
    "continental food Kochi",
    "Italian restaurant Kochi",
    "pork ribs Kochi",
    "beef brisket Kochi",
    "steak restaurant Kochi",
    "desserts Kochi",
    "cheesecake Kochi",
    "Namitha Pramod cafe",
    "restaurants in Ernakulam",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "restaurant",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { capable: true, title: site.shortName, statusBarStyle: "black-translucent" },
  other: {
    "geo.region": "IN-KL",
    "geo.placename": "Panampilly Nagar, Kochi",
    "geo.position": `${site.geo.lat};${site.geo.lng}`,
    ICBM: `${site.geo.lat}, ${site.geo.lng}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f211b",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before first paint: skips the intro for repeat visits / reduced motion,
// and guarantees the page is revealed even if JavaScript never hydrates
// (data-static switches every scroll reveal to its final, visible state).
const boot = `(function(){var d=document.documentElement;function s(){d.setAttribute('data-visited','');d.setAttribute('data-loaded','1')}try{if(sessionStorage.getItem('st-visited')||matchMedia('(prefers-reduced-motion: reduce)').matches)s()}catch(e){s()}setTimeout(function(){d.setAttribute('data-loaded','1');if(!d.hasAttribute('data-hydrated'))d.setAttribute('data-static','')},5000)})();`;

const noJs = `.preloader{display:none!important}.sw>span,.sc>span,.fade-up,.hero-in,.hero-badge,.img-reveal,.img-reveal>*,.line-grow{transform:none!important;opacity:1!important;clip-path:none!important}.hero-sun,.hero-leaf,.hero-plate,.hero-ring{scale:1!important;rotate:0deg!important;opacity:1!important}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <noscript>
          <style>{noJs}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="eyebrow sr-only z-[200] rounded-full bg-terra px-5 py-3 text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <PageTransitionProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <MobileActionBar />
          </PageTransitionProvider>
        </SmoothScroll>
        <Preloader />
        <Cursor />
        <div className="grain" aria-hidden />
        <JsonLd data={[websiteSchema(), restaurantSchema()]} />
      </body>
    </html>
  );
}
