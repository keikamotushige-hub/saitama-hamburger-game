import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, createSessionToken } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/auth-types";
import type { ApiResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email?.trim() || password == null || String(password).trim() === "") {
      return NextResponse.json<ApiResponse<{ role: string }>>(
        { success: false, error: "IDとパスワードを入力してください。" },
        { status: 400 },
      );
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json<ApiResponse<{ role: string }>>(
        { success: false, error: "IDまたはパスワードが正しくありません。" },
        { status: 401 },
      );
    }

    const token = await createSessionToken(user);
    const response = NextResponse.json<
      ApiResponse<{ role: string; name: string }>
    >({
      success: true,
      data: { role: user.role, name: user.name },
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[API /auth/login]", error);
    return NextResponse.json<ApiResponse<{ role: string }>>(
      { success: false, error: "ログイン処理中にエラーが発生しました。" },
      { status: 500 },
    );
  }
}
