import { menu } from "@/data/menu";
import { MenuIndexClient } from "./MenuIndexClient";

export function MenuIndex() {
  const categories = menu.map(({ slug, name, kicker, image, items }) => ({
    slug,
    name,
    kicker,
    image,
    count: items.length,
  }));
  return <MenuIndexClient categories={categories} />;
}
