import { proxyCoachRequest } from "@/lib/adminBackend";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyCoachRequest(request, `/api/admin/exercises/${id}`);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyCoachRequest(request, `/api/admin/exercises/${id}`);
}
