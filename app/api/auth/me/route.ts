import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import type { ApiResponse } from "@/lib/types";
import type { SessionUser } from "@/lib/auth-types";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json<ApiResponse<SessionUser>>(
      { success: false, error: "未ログイン" },
      { status: 401 },
    );
  }
  return NextResponse.json<ApiResponse<SessionUser>>({
    success: true,
    data: user,
  });
}
