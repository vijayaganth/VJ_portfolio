import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Glow } from "@/components/motion/Glow";
import { PageMotion } from "@/components/motion/PageMotion";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Journey } from "@/components/sections/Journey";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <PageMotion>
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Work />
        <Journey />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <Glow />
    </PageMotion>
  );
}
