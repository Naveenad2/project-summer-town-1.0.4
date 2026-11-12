import { fullAddress, site } from "./site";

export const faqs = [
  {
    q: "Where is Summer Town Resto Café located?",
    a: `We’re at ${fullAddress} — on 4th Cross Road in Panampilly Nagar, opposite DDRC, a few minutes from Kadavanthra and MG Road.`,
  },
  {
    q: "What are your opening hours?",
    a: `We’re open every day from ${site.hours.label}. The kitchen takes last orders about 30 minutes before closing.`,
  },
  {
    q: "What kind of food do you serve?",
    a: "A continental and Italian menu: cheese-stuffed chicken, slow-smoked pork ribs and beef brisket, steaks, pasta, pizza, burgers, all-day café plates, and desserts like crème brûlée and butterscotch cheesecake — plus mocktails, shakes and coffee.",
  },
  {
    q: "Do you take table reservations?",
    a: `Yes. Use the booking form on this page to send us your request on WhatsApp, or call ${site.phone}. Walk-ins are always welcome, subject to availability.`,
  },
  {
    q: "Are there vegetarian options?",
    a: "Plenty — salads, bowls, pasta, pizza, sandwiches, desserts and every drink on the menu has a vegetarian option. Each dish is marked on our menu page.",
  },
  {
    q: "How much does a meal for two cost?",
    a: `Around ₹${site.costForTwo.toLocaleString("en-IN")} for two people, before taxes.`,
  },
  {
    q: "Is parking available?",
    a: "There is limited parking in front of the café and street parking along the Panampilly Nagar cross roads. We recommend a cab or auto at peak dinner hours.",
  },
  {
    q: "Can I order for delivery?",
    a: "Yes — Summer Town is available for delivery and takeaway on Zomato.",
  },
] as const;
