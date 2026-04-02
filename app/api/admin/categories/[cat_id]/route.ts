import { NextResponse } from "next/server";

import { fetchApi } from "@/lib/api/common";

export async function GET(_: Request, { params }: { params: Promise<{ cat_id: string }> }) {
  try {
    const { cat_id } = await params;

    const response = await fetchApi(`/admin/categories/${cat_id}`, { method: "GET" });
    const data = await response.json().catch(() => ({ message: "Invalid response format." }));

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Category API is unavailable." }, { status: 503 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ cat_id: string }> }) {
  try {
    const { cat_id } = await params;
    const formData = await request.formData();

    const response = await fetchApi(`/admin/categories/${cat_id}`, {
      method: "PUT",
      body: formData,
    });
    const data = await response.json().catch(() => ({ message: "Invalid response format." }));

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Category API is unavailable." }, { status: 503 });
  }
}
