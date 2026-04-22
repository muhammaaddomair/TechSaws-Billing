import { NextResponse } from "next/server";
import { saveClient } from "@/lib/actions";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const input = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());
  const result = await saveClient(input);
  if (!contentType.includes("application/json")) {
    return NextResponse.redirect(new URL(`/dashboard/clients?message=${encodeURIComponent(result.message)}`, request.url), {
      status: 303
    });
  }
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
