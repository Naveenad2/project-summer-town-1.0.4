// Small menu types and helpers, split from the menu data so client components
// can use them without bundling every dish.
export type Diet = "veg" | "nonveg" | "egg";
export type Tag = "signature" | "bestseller" | "spicy" | "chef" | "share";

export type MenuItem = {
  slug: string;
  name: string;
  description: string;
  price: number;
  diet: Diet;
  image: string;
  tags?: Tag[];
};

export type MenuCategory = {
  slug: string;
  name: string;
  kicker: string;
  description: string;
  image: string;
  items: MenuItem[];
};

export const tagLabel: Record<Tag, string> = {
  signature: "Signature",
  bestseller: "Bestseller",
  spicy: "Spicy",
  chef: "Chef’s pick",
  share: "To share",
};

export const dietLabel: Record<Diet, string> = {
  veg: "Vegetarian",
  nonveg: "Non-vegetarian",
  egg: "Contains egg",
};

export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;
