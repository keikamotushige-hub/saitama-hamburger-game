import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionUser, UserRole } from "./auth-types";
import { SESSION_COOKIE } from "./auth-types";

const SESSION_DURATION = 60 * 60 * 24 * 7;

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET が設定されていません");
  return new TextEncoder().encode(secret);
}

function trim(value: string | undefined, fallback: string): string {
  return (value ?? fallback).trim();
}

interface PlayerCredential {
  loginId: string;
  password: string;
  name: string;
}

export function getCredentials(): {
  owner: { email: string; password: string; name: string };
  players: PlayerCredential[];
} {
  return {
    owner: {
      email: trim(process.env.OWNER_EMAIL, "keikamotsushige@gmail.com"),
      password: trim(process.env.OWNER_PASSWORD, "owner2026!"),
      name: "オーナー",
    },
    players: [
      {
        loginId: trim(process.env.PLAYER1_ID, "family1"),
        password: trim(process.env.PLAYER1_PASSWORD, "1111"),
        name: trim(process.env.PLAYER1_NAME, "家族プレイ1"),
      },
      {
        loginId: trim(process.env.PLAYER2_ID, "family2"),
        password: trim(process.env.PLAYER2_PASSWORD, "2222"),
        name: trim(process.env.PLAYER2_NAME, "家族プレイ2"),
      },
    ],
  };
}

export function authenticateUser(
  loginId: string,
  password: string,
): SessionUser | null {
  const creds = getCredentials();
  const normalizedId = loginId.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (
    normalizedId === creds.owner.email.trim().toLowerCase() &&
    normalizedPassword === creds.owner.password.trim()
  ) {
    return {
      email: creds.owner.email.trim(),
      name: creds.owner.name,
      role: "owner",
    };
  }

  for (const player of creds.players) {
    if (
      normalizedId === player.loginId.trim().toLowerCase() &&
      normalizedPassword === player.password.trim()
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
