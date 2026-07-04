import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
   console.log("Middleware:", request.nextUrl.pathname);
  // Bỏ qua các file tĩnh, API và trang maintenance
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/maintenance") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // ======================
  // Kiểm tra đăng nhập Admin
  // ======================

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin_token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }

    return NextResponse.next();
  }

  // ======================
  // Kiểm tra Maintenance
  // ======================

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabase
    .from("maintenance")
    .select("enabled")
    .eq("id", 1)
    .single();

  if (data?.enabled) {
    return NextResponse.redirect(
      new URL("/maintenance", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};