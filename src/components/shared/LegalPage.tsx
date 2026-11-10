import SectionHeading from "@/components/ui/SectionHeading";

/** Privacy policy / terms: a heading, the last-updated line and numbered sections in one white card. */
export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { title: string; content: string }[];
}) {
  return (
    <div className="u-wrap pb-20 pt-6 sm:pt-10">
      <SectionHeading
        as="h1"
        title={title}
        intro={updated}
        className="mb-8 max-w-3xl"
      />
      <div className="mx-auto max-w-3xl space-y-8 rounded-3xl border-2 border-line bg-white p-6 shadow-[0_24px_60px_-40px_rgba(30,66,74,.5)] sm:p-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="mb-3 text-[21px] font-extrabold tracking-[-.01em] text-ink">
              {s.title}
            </h2>
            <p className="text-[17px] leading-relaxed text-body">{s.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
