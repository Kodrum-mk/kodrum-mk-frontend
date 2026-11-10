import Faq from "@/components/ui/Faq";
import { HOME_FAQ } from "@/data/faq";
import { Testimonials } from "./Testimonials";

/** Student testimonials, then the FAQ. */
export function InfoSection() {
  return (
    <>
      <section className="u-wrap pb-16 sm:pb-20">
        <Testimonials />
      </section>
      <Faq items={HOME_FAQ} id="home-faq" className="u-wrap pb-20" />
    </>
  );
}
