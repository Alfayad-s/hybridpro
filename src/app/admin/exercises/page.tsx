import AdminExercisesContent from "@/components/admin/AdminExercisesContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exercises · Hybrid Pro admin",
  robots: { index: false, follow: false },
};

export default function AdminExercisesPage() {
  return <AdminExercisesContent />;
}
