"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function loginUser(email: string, password: string) {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    console.warn("WARNING: NEXT_PUBLIC_API_BASE_URL is not defined in .env file. Falling back to localhost.");
  }
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Invalid credentials provided.");
  }

  if (data?.resources?.token) {
    const cookieStore = await cookies();
    cookieStore.set("admin_token", data.resources.token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return data;
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/admin/login");
}
