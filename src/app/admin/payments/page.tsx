import AdminPaymentsContent from "@/components/admin/AdminPaymentsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments · Hybrid Pro admin",
  robots: { index: false, follow: false },
};

export default function AdminPaymentsPage() {
  return <AdminPaymentsContent />;
}
