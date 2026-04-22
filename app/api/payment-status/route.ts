import { NextResponse } from "next/server";
import { updatePaymentStatus } from "@/lib/actions";

export async function POST(request: Request) {
  const result = await updatePaymentStatus(await request.json());
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
