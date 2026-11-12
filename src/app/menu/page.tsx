import type { Metadata } from "next";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { MenuHero } from "@/components/menu/MenuHero";
import { Button } from "@/components/ui/Button";
import { site } from "@/data/site";
import { breadcrumbSchema, JsonLd, menuSchema } from "@/lib/jsonld";

const title = "Menu — Steaks, Ribs, Pasta, Pizza & Desserts";
const description =
  "Explore the Summer Town Resto Café menu in Panampilly Nagar, Kochi: cheese-stuffed chicken, smoked pork ribs, beef brisket, steaks, pasta, pizza, burgers, crème brûlée, butterscotch cheesecake, mocktails and coffee — with photos and prices.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/menu" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/menu",
    siteName: site.name,
    title: `${title} | ${site.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description },
};

export default function MenuPage() {
  return (
    <>
      <MenuHero />
      <MenuBrowser />
      <section data-nav="light" className="bg-cream py-20 lg:py-28">
        <div className="shell flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="headline t-h2 max-w-[14ch] text-ink">
            Hungry yet? <em className="text-terra">Come on over.</em>
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button href="/#visit" variant="terra">
              Book a table
            </Button>
            <Button href={site.social.zomatoOrder} variant="ghost-dark">
              Order on Zomato
            </Button>
          </div>
        </div>
      </section>
      <JsonLd
        data={[
          menuSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Menu", path: "/menu" },
          ]),
        ]}
      />
    </>
  );
}
