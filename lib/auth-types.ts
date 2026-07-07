export const PRODUCTION_URL = "https://saitama-hamburger-game.vercel.app";

export type UserRole = "owner" | "player" | "guest";

export interface SessionUser {
  email: string;
  name: string;
  role: UserRole;
}

export const SESSION_COOKIE = "hamburger_game_session";
