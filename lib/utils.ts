import type { ApiResponse } from "./types";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export async function parseApiResponse<T>(response: Response): Promise<T> {
  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.success) {
    const message = !json.success
      ? json.error
      : `リクエストに失敗しました (${response.status})`;
    throw new Error(message);
  }

  return json.data;
}
