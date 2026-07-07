import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return client;
}

interface GameAccountRow {
  login_id: string;
  password_hash: string;
  display_name: string;
  role: "owner" | "player";
  is_active: boolean;
}

export async function authenticateFromSupabase(
  loginId: string,
  password: string,
): Promise<{ email: string; name: string; role: "owner" | "player" } | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const normalizedId = loginId.trim().toLowerCase();
  const normalizedPassword = password.trim();

  const { data, error } = await supabase
    .from("game_accounts")
    .select("login_id, password_hash, display_name, role, is_active")
    .eq("is_active", true)
    .ilike("login_id", normalizedId)
    .maybeSingle<GameAccountRow>();

  if (error || !data) return null;
  if (data.password_hash.trim() !== normalizedPassword) return null;

  return {
    email: data.login_id,
    name: data.display_name,
    role: data.role,
  };
}
