# Summer Town Resto Café — website

Marketing site and menu for Summer Town Resto Café, Panampilly Nagar, Kochi.
Built with Next.js 16 (App Router, TypeScript, Cache Components), Tailwind CSS v4, GSAP + ScrollTrigger and Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all routes are static)
npm run start
```

Set the public domain before deploying (used for canonical URLs, sitemap, Open Graph and structured data):

```bash
cp .env.example .env.local   # then edit NEXT_PUBLIC_SITE_URL
```

## Where things live

| What | File |
| --- | --- |
| Address, phone, hours, social links, map | `src/data/site.ts` |
| Menu categories, dishes, prices, diet markers | `src/data/menu.ts` |
| FAQ (also emitted as FAQPage schema) | `src/data/faq.ts` |
| Home sections | `src/components/home/*` |
| Menu page (filters, search, dish dialog) | `src/components/menu/*` |
| Structured data (Restaurant, Menu, FAQ, Breadcrumbs) | `src/lib/jsonld.tsx` |
| Design tokens, animations | `src/app/globals.css` |

## Images

Photos live in `public/images/` (`menu/`, `hero/`, `moment/`, `venue/`).
After adding or replacing a photo, run:

```bash
npm run images     # compresses JPEGs and regenerates src/data/image-meta.ts (sizes + blur placeholders)
```

The logo was vectorised from `Summer Town Resto Cafe Logo.png` into `src/components/brand/paths.ts`.
`npm run brand` rebuilds the favicon, app icons and the social share image from those paths.

## Before launch

- **Prices** in `src/data/menu.ts` are placeholders — replace them with the current printed menu.
- **Dish list** is based on dishes mentioned in public reviews and articles; align it with the real menu.
- **Hours** are set to 12 PM – 11:30 PM daily (listings disagree) — confirm in `src/data/site.ts`.
- **Map coordinates** in `site.geo` are approximate — copy the exact pin from the Google Business Profile.
- **WhatsApp booking** sends to the café phone number; confirm that number is on WhatsApp.
- **Photos**: dish and hero photos are from Unsplash (free under the Unsplash License) and should be swapped for
  the café’s own photography when available. The venue photos are cropped from small screenshots; high-resolution
  originals will look sharper.

## Shapes & patterns

The design avoids stock arches, pills and rounded cards. Its shape language comes from the brand:

- **Morphable shapes** (`sun`, `cookie`, `flower`, `clover`, `seal`, `blob`, `squircle`, `leaf`, `leaf-alt`) are
  CSS polygons with the same point count, so any shape can animate into any other. Use `shape-<name>` classes or
  `var(--shape-<name>)`. Edit or add shapes in `scripts/shapes.mjs` and run `npm run shapes`.
- **Patterns** in `src/app/globals.css`: `awning` (striped café awning), `edge-scallop` / `edge-wave` (section edges),
  `ticket` (notched order ticket), `stamp` (perforated postage stamp), `cartouche` (Victorian frame), `leaf-pattern`.

## Performance notes

- Lower sections use `content-visibility` (`cv-auto`) so the browser skips their layout until they near the screen.
- The Google Map only mounts when the Visit section is close (it loads ~500 KB of Google scripts).
- Decorative loops pause when off screen; home sections hydrate in separate Suspense boundaries.
- Image placeholders are a single dominant colour (`npm run images`), keeping client JavaScript small.

## SEO

- Per-page metadata, canonical URLs, Open Graph / Twitter cards, `robots.txt`, `sitemap.xml` (with image entries),
  web manifest and icons.
- JSON-LD: `Restaurant`/`CafeOrCoffeeShop` (address, geo, hours, cuisine, price range, menu link), `WebSite`,
  `Menu` with every section and dish (price, image, vegetarian flag), `FAQPage` and `BreadcrumbList`.
- Every page is statically prerendered; all content is in the HTML before JavaScript runs.

## Motion & accessibility

- Animations respect `prefers-reduced-motion` (smooth scroll, preloader, scroll scenes and reveals are disabled).
- Content is visible without JavaScript (`<noscript>` styles) and the preloader has a CSS failsafe.
- Native `<dialog>` for dish details (focus trap, Esc), `<details>` for FAQ, skip link, labelled controls.
