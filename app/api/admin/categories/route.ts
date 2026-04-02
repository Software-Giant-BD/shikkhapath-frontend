import { NextResponse } from "next/server";

import { fetchApi } from "@/lib/api/common";

export async function GET() {
  try {
    const response = await fetchApi("/admin/categories", { method: "GET" });
    const data = await response.json().catch(() => ({ message: "Invalid response format." }));

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Category API is unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const response = await fetchApi("/admin/categories", {
      method: "POST",
      body: formData,
    });
    const data = await response.json().catch(() => ({ message: "Invalid response format." }));

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Category API is unavailable." }, { status: 503 });
  }
}
