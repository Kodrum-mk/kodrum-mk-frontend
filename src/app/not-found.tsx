import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Страницата не е пронајдена | Кодрум",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-[#008081] mb-6">404</p>
        <h1 className="text-3xl font-bold text-[#1E424A] mb-4">
          Страницата не е пронајдена
        </h1>
        <p className="text-[#1E424A]/70 mb-8 leading-relaxed">
          Страницата што ја барате не постои или е преместена. Провери дали URL-то е
          точно или се врати на почетната страница.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="bg-[#008081] hover:bg-[#006566] text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md text-sm"
          >
            Почетна страница
          </Link>
          <Link
            href="/kontakt"
            className="bg-white hover:bg-[#F2F0E7] text-[#1E424A] font-medium py-3 px-6 rounded-lg transition-colors border border-[#1E424A]/20 text-sm"
          >
            Контакт
          </Link>
        </div>
      </div>
    </div>
  );
}
