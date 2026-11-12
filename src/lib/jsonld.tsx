import { faqs } from "@/data/faq";
import { menu } from "@/data/menu";
import { site } from "@/data/site";

const abs = (path: string) => `${site.url}${path}`;
const restaurantId = `${site.url}/#restaurant`;

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.name,
  alternateName: [site.shortName, "Summer Town Cafe Kochi"],
  inLanguage: "en-IN",
  publisher: { "@id": restaurantId },
});

export const restaurantSchema = () => ({
  "@context": "https://schema.org",
  "@type": ["Restaurant", "CafeOrCoffeeShop"],
  "@id": restaurantId,
  name: site.name,
  alternateName: site.shortName,
  description: site.description,
  url: site.url,
  logo: abs("/icon-512.png"),
  image: [
    abs("/opengraph-image.jpg"),
    abs("/images/venue/storefront.jpg"),
    abs("/images/venue/interior.jpg"),
    abs("/images/menu/cheese-stuffed-chicken.jpg"),
  ],
  telephone: site.phone,
  priceRange: site.priceRange,
  currenciesAccepted: "INR",
  servesCuisine: site.cuisines,
  acceptsReservations: true,
  hasMenu: abs("/menu"),
  foundingDate: site.founded,
  founder: { "@type": "Person", name: site.founder },
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: `${site.address.area}, ${site.address.city}`,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  hasMap: site.maps.directions,
  areaServed: ["Panampilly Nagar", "Kadavanthra", "Ernakulam", "Kochi"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: site.hours.days.map((d) => `https://schema.org/${d}`),
      opens: site.hours.opens,
      closes: site.hours.closes,
    },
  ],
  sameAs: [site.social.instagram, site.social.facebook, site.social.zomato, site.social.tripadvisor],
});

export const faqSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const menuSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Menu",
  "@id": `${site.url}/menu#menu`,
  name: `${site.name} Menu`,
  url: abs("/menu"),
  inLanguage: "en-IN",
  mainEntityOfPage: abs("/menu"),
  provider: { "@id": restaurantId },
  hasMenuSection: menu.map((c) => ({
    "@type": "MenuSection",
    name: c.name,
    description: c.description,
    url: abs(`/menu#${c.slug}`),
    hasMenuItem: c.items.map((i) => ({
      "@type": "MenuItem",
      name: i.name,
      description: i.description,
      image: abs(i.image),
      ...(i.diet === "veg" ? { suitableForDiet: "https://schema.org/VegetarianDiet" } : {}),
      offers: { "@type": "Offer", price: i.price, priceCurrency: "INR", availability: "https://schema.org/InStock" },
    })),
  })),
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});
