import AdminClientDetail from "@/components/admin/AdminClientDetail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client · Hybrid Pro admin",
  robots: { index: false, follow: false },
};

export default function AdminClientPage() {
  return <AdminClientDetail />;
}
