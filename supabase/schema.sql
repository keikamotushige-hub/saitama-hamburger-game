-- 埼玉ハンバーグ殺人事件 専用（Voice AI Image Studio とは別プロジェクト）
-- Supabase SQL Editor で実行してください

create table if not exists public.game_accounts (
  id uuid primary key default gen_random_uuid(),
  login_id text unique not null,
  password_hash text not null,
  display_name text not null,
  role text not null check (role in ('owner', 'player')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.game_accounts enable row level security;

-- ログインAPI（サーバー）のみが読み取り可能
create policy "service role only"
  on public.game_accounts
  for all
  using (false);

-- 初期アカウント（パスワードはアプリ側 env と同じ値を使用）
-- 本番では Supabase Auth またはサーバー側ハッシュ照合を推奨

insert into public.game_accounts (login_id, password_hash, display_name, role)
values
  ('keikamotsushige@gmail.com', 'owner2026!', 'オーナー', 'owner'),
  ('family1', '1111', '家族プレイ1', 'player'),
  ('family2', '2222', '家族プレイ2', 'player'),
  ('test', 'test2026', 'テストプレイ', 'player')
on conflict (login_id) do nothing;
