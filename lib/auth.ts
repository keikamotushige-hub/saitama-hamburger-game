import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionUser, UserRole } from "./auth-types";
import { SESSION_COOKIE } from "./auth-types";
import { authenticateFromSupabase } from "./supabase";

const SESSION_DURATION = 60 * 60 * 24 * 7;
const FALLBACK_AUTH_SECRET = "saitama-hamburger-game-secret-2026";

function envOrFallback(value: string | undefined, fallback: string): string {
  const trimmed = (value ?? "").trim();
  return trimmed || fallback;
}

function getSecret(): Uint8Array {
  const secret = envOrFallback(
    process.env.AUTH_SECRET,
    FALLBACK_AUTH_SECRET,
  );
  return new TextEncoder().encode(secret);
}

interface PlayerCredential {
  loginId: string;
  password: string;
  name: string;
}

function getOwnerEmails(): string[] {
  const fromEnv = envOrFallback(
    process.env.OWNER_EMAIL,
    "keikamotushiige@gmail.com",
  );
  const extras = envOrFallback(process.env.OWNER_EMAIL_ALIASES, "keikamotushige@gmail.com");
  return [...new Set([fromEnv, ...extras.split(",")].map((e) => e.trim().toLowerCase()))].filter(Boolean);
}

function getEnvCredentials(): {
  owner: { emails: string[]; password: string; name: string };
  players: PlayerCredential[];
} {
  return {
    owner: {
      emails: getOwnerEmails(),
      password: envOrFallback(process.env.OWNER_PASSWORD, "owner2026!"),
      name: "オーナー",
    },
    players: [
      {
        loginId: envOrFallback(process.env.PLAYER1_ID, "family1"),
        password: envOrFallback(process.env.PLAYER1_PASSWORD, "1111"),
        name: envOrFallback(process.env.PLAYER1_NAME, "家族プレイ1"),
      },
      {
        loginId: envOrFallback(process.env.PLAYER2_ID, "family2"),
        password: envOrFallback(process.env.PLAYER2_PASSWORD, "2222"),
        name: envOrFallback(process.env.PLAYER2_NAME, "家族プレイ2"),
      },
      {
        loginId: envOrFallback(process.env.TEST_ID, "test"),
        password: envOrFallback(process.env.TEST_PASSWORD, "test2026"),
        name: envOrFallback(process.env.TEST_NAME, "テストプレイ"),
      },
    ],
  };
}

function authenticateFromEnv(
  loginId: string,
  password: string,
): SessionUser | null {
  const creds = getEnvCredentials();
  const normalizedId = loginId.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (
    creds.owner.emails.includes(normalizedId) &&
    normalizedPassword === creds.owner.password
  ) {
    return {
      email: loginId.trim(),
      name: creds.owner.name,
      role: "owner",
    };
  }

  for (const player of creds.players) {
    if (
      normalizedId === player.loginId.trim().toLowerCase() &&
      normalizedPassword === player.password
    ) {
      return {
        email: player.loginId.trim(),
        name: player.name,
        role: "player",
      };
    }
  }

  return null;
}

export async function authenticateUser(
  loginId: string,
  password: string,
): Promise<SessionUser | null> {
  try {
    const fromSupabase = await authenticateFromSupabase(loginId, password);
    if (fromSupabase) return fromSupabase;
  } catch {
    // Supabase未設定・障害時は env 認証へフォールバック
  }

  return authenticateFromEnv(loginId, password);
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
