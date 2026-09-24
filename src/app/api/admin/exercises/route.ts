import { proxyCoachRequest } from "@/lib/adminBackend";

export async function GET(request: Request) {
  return proxyCoachRequest(request, "/api/admin/exercises");
}

export async function POST(request: Request) {
  return proxyCoachRequest(request, "/api/admin/exercises");
}
