import { proxyCoachRequest } from "@/lib/adminBackend";

export async function GET(request: Request) {
  return proxyCoachRequest(request, "/api/admin/clients");
}

export async function POST(request: Request) {
  return proxyCoachRequest(request, "/api/admin/clients");
}
