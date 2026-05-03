import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");

  if (!tag) {
    return NextResponse.json({ message: "Tag is required" }, { status: 400 });
  }

  // @ts-ignore - 'max' is a new argument in some Next.js versions to handle deprecation
  revalidateTag(tag, 'max');

  return NextResponse.json({ revalidated: true, now: Date.now(), tag });
}
