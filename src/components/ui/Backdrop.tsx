/**
 * Page backdrop: soft teal and yellow glows fading into a pale page, with the slanted bars and a dot of the
 * Kodrum mark as quiet decoration. Sits under the floating navbar (see `.site-header` in globals.css), so
 * it is the first child of <main>, which must be `relative`.
 */
export default function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(640px 460px at 8% 0, rgba(0,128,129,.16), transparent 70%), radial-gradient(560px 440px at 94% 0, rgba(250,204,11,.24), transparent 70%), linear-gradient(#ffffff 0, #f4f8f8 760px)",
        }}
      />
      <span className="absolute -left-24 top-[420px] hidden h-96 w-40 rotate-[34deg] rounded-[2.5rem] bg-teal/10 md:block" />
      <span className="absolute -right-24 top-[760px] hidden h-80 w-36 -rotate-[34deg] rounded-[2.5rem] bg-ink/5 md:block" />
      <span className="absolute left-[2%] top-[110px] hidden h-5 w-5 rounded-full bg-yellow xl:block" />
    </div>
  );
}
