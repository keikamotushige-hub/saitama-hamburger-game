export const PRODUCTION_URL = "https://saitama-hamburger-game.vercel.app";

export type UserRole = "owner" | "player" | "guest";

export interface SessionUser {
  email: string;
  name: string;
  role: UserRole;
}

export const SESSION_COOKIE = "hamburger_game_session";

// ひろしげ君一家（味方）— 組長：かつみ
export const KATSUMI_LEADER = {
  name: "かつみ",
  title: "ひろしげ君一家・組長",
  organization: "ひろしげ一家",
};

// 敵対組織 — 組長：鈴木
export const SUZUKI_LEADER = {
  name: "鈴木",
  title: "敵対組織・鈴木組・組長",
  organization: "鈴木組（敵）",
};
