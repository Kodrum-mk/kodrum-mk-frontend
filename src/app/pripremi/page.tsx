import type { Metadata } from "next";
import { PripremiClient } from "@/components/pripremi/PripremiClient";

export const metadata: Metadata = {
  title: "Припреми",
  description:
    "Активни припремни сесии за испити по факултет. Во живо, онлајн и хибридни формати.",
};

export default function PripremiPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#1E424A]/10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E424A] mb-4">
            Активни припреми
          </h1>
          <p className="text-lg text-[#1E424A]/70 max-w-3xl">
            Прелистај ги тековно достапните припремни сесии за различни
            факултети и предмети, и провери ги идните термини во календарот
            подолу.
          </p>
        </div>
      </div>
      <PripremiClient />
    </div>
  );
}
