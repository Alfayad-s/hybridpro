import { proxyCoachRequest } from "@/lib/adminBackend";

export async function GET(request: Request) {
  return proxyCoachRequest(request, "/api/admin/stats");
}
