import type { Metadata } from "next";
import Arrow from "@/components/ui/Arrow";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: { absolute: "404 — Страницата не е пронајдена | Кодрум" },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="u-wrap flex min-h-[60vh] items-center justify-center pb-20 pt-10">
      <div className="max-w-lg text-center">
        <p className="text-[clamp(5rem,18vw,8rem)] font-black leading-none tracking-[-.04em] text-teal">
          404
        </p>
        <h1 className="mt-4 text-balance text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold leading-tight tracking-[-.02em] text-ink">
          Страницата не е пронајдена
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-body">
          Страницата што ја барате не постои или е преместена. Провери дали
          URL-то е точно или се врати на почетната страница.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/" variant="yellow" size="lg">
            Почетна страница
            <Arrow className="h-5 w-5" />
          </Button>
          <Button href="/kontakt" variant="outline" size="lg">
            Контакт
          </Button>
        </div>
      </div>
    </div>
  );
}
