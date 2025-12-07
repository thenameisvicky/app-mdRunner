import { NextRequest } from "next/server";
import { GET as serverGET, POST as serverPOST } from "@/server/route";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET(request: NextRequest) {
  return serverGET(request);
}

export async function POST(request: NextRequest) {
  return serverPOST(request);
}

