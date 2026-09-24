import { proxyCoachRequest } from "@/lib/adminBackend";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; checkinId: string }> },
) {
  const { id, checkinId } = await params;
  return proxyCoachRequest(request, `/api/admin/clients/${id}/checkins/${checkinId}`);
}
