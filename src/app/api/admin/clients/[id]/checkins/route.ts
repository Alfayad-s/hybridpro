import { proxyCoachRequest } from "@/lib/adminBackend";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyCoachRequest(request, `/api/admin/clients/${id}/checkins`);
}
