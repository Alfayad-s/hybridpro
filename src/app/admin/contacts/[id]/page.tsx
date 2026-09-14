import AdminContactDetail from "@/components/admin/AdminContactDetail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact · Hybrid Pro admin",
  robots: { index: false, follow: false },
};

export default function AdminContactDetailPage() {
  return <AdminContactDetail />;
}
