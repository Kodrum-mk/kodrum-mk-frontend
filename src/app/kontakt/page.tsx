import type { Metadata } from "next";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

export const metadata: Metadata = {
  title: "Контакт",
  description:
    "Контактирај нè за прашања, пријавување или поддршка. Ние сме тука да помогнеме!",
};

const contactInfo = [
  { Icon: Mail, label: "Email", value: "info@kodrum.mk", href: "mailto:info@kodrum.mk" },
  { Icon: Phone, label: "Телефон", value: "+389 XX XXX XXX", href: "tel:+389XXXXXXXX" },
  { Icon: MapPin, label: "Локација", value: "Скопје, Македонија", href: null },
];

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1E424A] mb-6">
              Контакт
            </h1>
            <p className="text-lg text-[#1E424A]/70 mb-10 leading-relaxed">
              Имате прашање или сакате да се пријавите за курс? Контактирајте нè
              директно и ние ќе ви одговориме во најкраток рок.
            </p>

            <div className="space-y-5 mb-10">
              {contactInfo.map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#008081]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#008081]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1E424A]/60 mb-0.5">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="text-base font-semibold text-[#1E424A] hover:text-[#008081] transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-base font-semibold text-[#1E424A]">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium text-[#1E424A]/60 mb-4">
                Следи нè на:
              </p>
              <div className="flex gap-3">
                {[
                  { href: "https://facebook.com", Icon: Facebook, label: "Facebook" },
                  { href: "https://instagram.com", Icon: Instagram, label: "Instagram" },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-12 h-12 rounded-lg bg-[#1E424A] hover:bg-[#008081] text-white flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right – Contact form */}
          <div className="bg-[#F2F0E7] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-[#1E424A] mb-6">
              Испрати порака
            </h2>
            <form className="space-y-5" >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="ime"
                    className="block text-sm font-medium text-[#1E424A] mb-1.5"
                  >
                    Ime *
                  </label>
                  <input
                    id="ime"
                    name="ime"
                    type="text"
                    required
                    placeholder="Вашето Ime"
                    className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="prezime"
                    className="block text-sm font-medium text-[#1E424A] mb-1.5"
                  >
                    Презиме *
                  </label>
                  <input
                    id="prezime"
                    name="prezime"
                    type="text"
                    required
                    placeholder="Вашето презиме"
                    className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#1E424A] mb-1.5"
                >
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="vas@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="predmet"
                  className="block text-sm font-medium text-[#1E424A] mb-1.5"
                >
                  Предмет / Тема
                </label>
                <input
                  id="predmet"
                  name="predmet"
                  type="text"
                  placeholder="Тема на вашата порака"
                  className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="poraka"
                  className="block text-sm font-medium text-[#1E424A] mb-1.5"
                >
                  Порака *
                </label>
                <textarea
                  id="poraka"
                  name="poraka"
                  required
                  rows={5}
                  placeholder="Напиши ја вашата порака тука..."
                  className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all resize-none text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#008081] hover:bg-[#006566] text-white font-medium py-3.5 px-6 rounded-lg transition-colors shadow-md text-sm"
              >
                Испрати
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
