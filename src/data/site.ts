// Single source of truth for business details. Update here and every page,
// structured-data block and the sitemap pick it up.
export const site = {
  name: "Summer Town Resto Café",
  shortName: "Summer Town",
  legalName: "Summer Town Resto Cafe",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.summertownrestocafe.com").replace(/\/$/, ""),
  tagline: "Continental kitchen & café in Panampilly Nagar, Kochi",
  description:
    "Summer Town Resto Café is a Victorian-styled continental restaurant and café in Panampilly Nagar, Kochi — cheese-stuffed chicken, slow-smoked ribs and brisket, steaks, pasta, crème brûlée and butterscotch cheesecake, served under chandeliers.",
  founded: "2023",
  founder: "Namitha Pramod",
  phone: "+91 62380 23241",
  phoneHref: "tel:+916238023241",
  whatsapp: "916238023241",
  address: {
    street: "Building No. 73, 4th Cross Road, Opp. DDRC",
    area: "Panampilly Nagar",
    city: "Kochi",
    region: "Kerala",
    postalCode: "682036",
    country: "IN",
  },
  // Approximate — confirm against the Google Business Profile pin.
  geo: { lat: 9.9594, lng: 76.2961 },
  hours: {
    opens: "12:00",
    closes: "23:30",
    label: "12 PM – 11:30 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  priceRange: "₹₹",
  costForTwo: 1200,
  cuisines: ["Continental", "Italian", "Desserts", "Café"],
  social: {
    instagram: "https://www.instagram.com/summertownrestocafe/",
    instagramHandle: "@summertownrestocafe",
    facebook: "https://www.facebook.com/summertownrestocafe/",
    zomato: "https://www.zomato.com/kochi/summer-town-panampilly-nagar",
    zomatoOrder: "https://www.zomato.com/kochi/summer-town-panampilly-nagar/order",
    tripadvisor:
      "https://www.tripadvisor.in/Restaurant_Review-g4053412-d26340236-Reviews-Summer_Town_Resto_Cafe-Ernakulam_Kochi_Cochin_Ernakulam_District_Kerala.html",
  },
  maps: {
    directions: "https://www.google.com/maps/dir/?api=1&destination=Summer+Town+Resto+Cafe+Panampilly+Nagar+Kochi",
    embed: "https://www.google.com/maps?q=Summer+Town+Resto+Cafe,+4th+Cross+Road,+Panampilly+Nagar,+Kochi&output=embed",
  },
  lastUpdated: "2026-11-01",
} as const;

export const fullAddress = `${site.address.street}, ${site.address.area}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

export const nav = [
  { label: "Menu", href: "/menu" },
  { label: "Signatures", href: "/#signatures" },
  { label: "Our Story", href: "/#story" },
  { label: "Visit", href: "/#visit" },
] as const;
