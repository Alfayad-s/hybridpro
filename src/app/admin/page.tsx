import AdminPageContent from "@/components/admin/AdminPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coach admin · Hybrid Pro",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPageContent />;
}
