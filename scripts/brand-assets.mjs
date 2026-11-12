// Builds favicon / app icons / Open Graph image from the traced logo paths.
import sharp from "sharp";
import { writeFile, readFile, rm } from "node:fs/promises";
import { join } from "node:path";

import { EMBLEM_FRAME as FRAME, EMBLEM_LEAVES as LEAVES, WORDMARK, SUBLINE } from "../src/components/brand/paths.ts";

const FOREST = "#10221C";
const CREAM = "#F3EBDD";
const TERRA = "#D0693A";

const emblem = (fill, leafFill = fill) =>
  `<path d="${FRAME}" fill="${fill}" fill-rule="evenodd"/>` +
  LEAVES.map((d) => `<path d="${d}" fill="${leafFill}"/>`).join("");

// Square icon: emblem centred on forest green
const iconSvg = (
  size,
  radius,
) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1400 1400">
  <rect width="1400" height="1400" rx="${radius}" fill="${FOREST}"/>
  <g transform="translate(277 150) scale(1.0)">${emblem(CREAM, TERRA)}</g>
</svg>`;

const app = join(process.cwd(), "src", "app");
await writeFile(join(app, "icon.svg"), iconSvg(64, 300));
await sharp(Buffer.from(iconSvg(180, 0)))
  .png()
  .toFile(join(app, "apple-icon.png"));
await sharp(Buffer.from(iconSvg(512, 0)))
  .png()
  .toFile(join(process.cwd(), "public", "icon-512.png"));
await sharp(Buffer.from(iconSvg(192, 0)))
  .png()
  .toFile(join(process.cwd(), "public", "icon-192.png"));

// favicon.ico with an embedded 48px PNG
const png48 = await sharp(Buffer.from(iconSvg(48, 260)))
  .png()
  .toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(48, 6);
header.writeUInt8(48, 7);
header.writeUInt8(0, 8);
header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png48.length, 14);
header.writeUInt32LE(22, 18);
await rm(join(app, "favicon.ico"), { force: true });
await writeFile(join(app, "favicon.ico"), Buffer.concat([header, png48]));

// Open Graph image 1200x630
const photo = await sharp(join(process.cwd(), "public/images/hero/ribeye.jpg"))
  .resize(470, 590, { fit: "cover" })
  .modulate({ brightness: 0.95 })
  .toBuffer();
const archMask = Buffer.from(
  `<svg width="470" height="590"><path d="M0 590 V235 A235 235 0 0 1 470 235 V590 Z" fill="#fff"/></svg>`,
);
const archPhoto = await sharp(photo)
  .composite([{ input: archMask, blend: "dest-in" }])
  .png()
  .toBuffer();
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><radialGradient id="g" cx="0.25" cy="0.1" r="0.9"><stop offset="0" stop-color="#2A4A3E"/><stop offset="1" stop-color="${FOREST}"/></radialGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(80 92) scale(0.16)">${emblem(CREAM, TERRA)}</g>
  <g transform="translate(80 318) scale(0.26)"><path d="${WORDMARK}" fill="${CREAM}" fill-rule="evenodd"/></g>
  <g transform="translate(80 384) scale(0.26)"><path d="${SUBLINE}" fill="${TERRA}" fill-rule="evenodd"/></g>
  <rect x="80" y="456" width="80" height="2" fill="${TERRA}"/>
  <text x="80" y="504" font-family="Georgia, 'Times New Roman', serif" font-size="30" font-style="italic" fill="${CREAM}" opacity="0.85">Continental kitchen &amp; café</text><text x="80" y="544" font-family="Georgia, serif" font-size="22" letter-spacing="3" fill="#D0693A">PANAMPILLY NAGAR · KOCHI</text>
</svg>`;
await sharp(Buffer.from(ogSvg))
  .composite([{ input: archPhoto, left: 670, top: 40 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(join(app, "opengraph-image.jpg"));
await writeFile(
  join(app, "opengraph-image.alt.txt"),
  "Summer Town Resto Café — continental kitchen & café in Panampilly Nagar, Kochi",
);
await writeFile(
  join(app, "twitter-image.alt.txt"),
  "Summer Town Resto Café — continental kitchen & café in Panampilly Nagar, Kochi",
);
await writeFile(join(app, "twitter-image.jpg"), await readFile(join(app, "opengraph-image.jpg")));
console.log("brand assets written");
