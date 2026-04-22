import { NextResponse } from "next/server";
import { savePaymentRequest } from "@/lib/actions";

export async function POST(request: Request) {
  const result = await savePaymentRequest(await request.json());
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
