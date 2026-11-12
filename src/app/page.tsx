import type { Metadata } from "next";
import { Suspense, type ComponentType } from "react";
import { Awning } from "@/components/home/Awning";
import { DayCycle } from "@/components/home/DayCycle";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { House } from "@/components/home/House";
import { MenuIndex } from "@/components/home/MenuIndex";
import { Moments } from "@/components/home/Moments";
import { Signatures } from "@/components/home/Signatures";
import { Story } from "@/components/home/Story";
import { Visit } from "@/components/home/Visit";
import { faqSchema, JsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Each boundary hydrates on its own, so React can yield between sections
// instead of hydrating the whole page in one long task.
const belowFold: ComponentType[] = [Awning, Story, Signatures, DayCycle, House, MenuIndex, Moments, Visit, Faq];

export default function Home() {
  return (
    <>
      <Hero />
      {belowFold.map((Section, i) => (
        <Suspense key={i}>
          <Section />
        </Suspense>
      ))}
      <JsonLd data={faqSchema()} />
    </>
  );
}
