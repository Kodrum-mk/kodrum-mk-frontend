import type { Metadata } from "next";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";
import { ContactForm } from "@/components/kontakt/ContactForm";

export const metadata: Metadata = {
  title: "Контакт",
  description:
    "Контактирај нè за прашања, пријавување или поддршка. Ние сме тука да помогнеме!",
};

const contactInfo = [
  { Icon: Mail, label: "Email", value: "kodrum.mk@gmail.com", href: "mailto:kodrum.mk@gmail.com" },
  { Icon: Phone, label: "Телефон", value: "+389 75 295 582", href: "tel:+38975295582" },
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

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
