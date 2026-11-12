import type { MetadataRoute } from "next";
import { allItems } from "@/data/menu";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: site.lastUpdated,
      changeFrequency: "weekly",
      priority: 1,
      images: [
        `${site.url}/opengraph-image.jpg`,
        `${site.url}/images/venue/storefront.jpg`,
        `${site.url}/images/venue/interior.jpg`,
      ],
    },
    {
      url: `${site.url}/menu`,
      lastModified: site.lastUpdated,
      changeFrequency: "weekly",
      priority: 0.9,
      images: allItems.map((i) => `${site.url}${i.image}`),
    },
  ];
}
