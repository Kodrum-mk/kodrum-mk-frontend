import { InfoQuestions } from "./InfoQuestions";
import { Testimonials } from "./Testimonials";

export function InfoSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F2F0E7] w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <InfoQuestions />
          </div>
          <div>
            <Testimonials />
          </div>
        </div>
      </div>
    </section>
  );
}
