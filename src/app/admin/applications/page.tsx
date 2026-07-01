import { ApplicationsAdmin } from "@/components/admin/ApplicationsAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Админ | Кодрум",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ApplicationsAdminPage() {
  return <ApplicationsAdmin />;
}
