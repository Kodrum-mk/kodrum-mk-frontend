"use client";

import Button from "@/components/ui/Button";
import { PHONE } from "@/lib/site";

// Shown when something throws while rendering a page. The navbar and footer stay (they live in the layout).
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="u-wrap flex min-h-[60vh] items-center justify-center pb-20 pt-10">
      <div className="max-w-lg text-center">
        <h1 className="text-balance text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold leading-tight tracking-[-.02em] text-ink">
          Нешто тргна наопаку
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-body">
          Страницата не можеше да се вчита. Обидете се повторно, а ако проблемот
          остане, јавете ни се на{" "}
          <a
            href={`tel:${PHONE.e164}`}
            className="font-bold text-teal-dk underline underline-offset-4"
          >
            {PHONE.display}
          </a>
          .
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="yellow" size="lg" onClick={() => reset()}>
            Обиди се повторно
          </Button>
          <Button href="/" variant="outline" size="lg">
            Почетна страница
          </Button>
        </div>
      </div>
    </div>
  );
}
