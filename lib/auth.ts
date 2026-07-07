import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionUser, UserRole } from "./auth-types";
import { SESSION_COOKIE } from "./auth-types";

const SESSION_DURATION = 60 * 60 * 24 * 7;
const AUTH_SECRET = "saitama-hamburger-game-secret-2026";

/** Vercel環境変数に依存せず、常にログインできる組み込みアカウント */
const BUILTIN_ACCOUNTS: Array<{
  loginIds: string[];
  password: string;
  name: string;
  role: UserRole;
}> = [
  {
    loginIds: ["keikamotushige@gmail.com", "keikamotushiige@gmail.com"],
    password: "111111",
    name: "オーナー",
    role: "owner",
  },
  {
    loginIds: ["family1"],
    password: "1111",
    name: "家族プレイ1",
    role: "player",
  },
  {
    loginIds: ["family2"],
    password: "2222",
    name: "家族プレイ2",
    role: "player",
  },
  {
    loginIds: ["tobe", "とべ"],
    password: "3333",
    name: "とべ君",
    role: "player",
  },
  {
    loginIds: ["test"],
    password: "1111",
    name: "テストプレイ",
    role: "player",
  },
];

function getSecret(): Uint8Array {
  return new TextEncoder().encode(AUTH_SECRET);
}

function authenticateBuiltin(
  loginId: string,
  password: string,
): SessionUser | null {
  const normalizedId = loginId.trim().toLowerCase();
  const normalizedPassword = password.trim();

  for (const account of BUILTIN_ACCOUNTS) {
    const matchedId = account.loginIds.find(
      (id) => id.toLowerCase() === normalizedId,
    );
    if (matchedId && normalizedPassword === account.password) {
      return {
        email: loginId.trim(),
        name: account.name,
        role: account.role,
      };
    }
  }

  return null;
}

export async function authenticateUser(
  loginId: string,
  password: string,
): Promise<SessionUser | null> {
  return authenticateBuiltin(loginId, password);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.email || !payload.name || !payload.role) return null;
    return {
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
