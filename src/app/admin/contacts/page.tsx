import AdminContactsContent from "@/components/admin/AdminContactsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact submissions · Hybrid Pro admin",
  robots: { index: false, follow: false },
};

export default function AdminContactsPage() {
  return <AdminContactsContent />;
}
