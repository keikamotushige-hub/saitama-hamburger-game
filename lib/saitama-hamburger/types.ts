export type Scene = "title" | "prologue" | "select" | "battle" | "result";

export type CallPhase = "dialing-katsumi" | "katsumi" | "dialing-boss" | "boss" | "gunfight";

export interface CharacterDef {
  id: number;
  name: string;
  weapon: string;
  style: string;
  hp: number;
  atk: number;
  role: string;
}

export interface Fighter {
  id: string;
  name: string;
  weapon: string;
  hp: number;
  maxHp: number;
  atk: number;
  isEnemy: boolean;
  title?: string;
}

export const TOBE = {
  name: "とべ君",
  vehicle: "銀のハイエース",
};

export const KATSUMI = {
  name: "かつみ",
  title: "ひろしげ君一家・組長",
  organization: "ひろしげ一家",
  vehicle: "黒のセンチュリー",
  phone: "090-XXXX-1107",
};

export const SUZUKI_BOSS = {
  name: "鈴木",
  title: "敵対組織・鈴木組・組長",
  organization: "鈴木組（敵）",
  phone: "03-XXXX-0921",
};

export const CHARACTERS: CharacterDef[] = [
  {
    id: 1,
    name: "たかひろ",
    weapon: "拳銃",
    style: "腕まくり白シャツ",
    hp: 120,
    atk: 28,
    role: "先頭車・運転",
  },
  {
    id: 2,
    name: "ゆうや",
    weapon: "拳銃",
    style: "黒ベスト白シャツ",
    hp: 110,
    atk: 26,
    role: "副座・監視",
  },
  {
    id: 3,
    name: "ふじい",
    weapon: "指ミサイル/ゴルフクラブ",
    style: "襟立て白シャツ",
    hp: 130,
    atk: 32,
    role: "右リア・狙撃",
  },
  {
    id: 4,
    name: "こまつちゃん",
    weapon: "金属バット",
    style: "ネクタイ緩め白シャツ",
    hp: 140,
    atk: 24,
    role: "左リア・突入",
  },
];

export const ENEMIES: Omit<Fighter, "id">[] = [
  {
    name: SUZUKI_BOSS.name,
    title: "敵対組織・組長",
    weapon: "サブマシンガン",
    hp: 160,
    maxHp: 160,
    atk: 30,
    isEnemy: true,
  },
  {
    name: "鈴木組若頭",
    title: "幹部",
    weapon: "拳銃",
    hp: 100,
    maxHp: 100,
    atk: 24,
    isEnemy: true,
  },
  {
    name: "鈴木組の男",
    title: "組員",
    weapon: "拳銃",
    hp: 75,
    maxHp: 75,
    atk: 18,
    isEnemy: true,
  },
];

export const KATSUMI_LINES = [
  { speaker: "システム", text: "とべ君の銀ハイエースから、かつみ組長の黒センチュリーへ発信……" },
  { speaker: "システム", text: "かつみの電話は鳴らなかった。置きっぱなしのまま、静かに繋がる。" },
  { speaker: "かつみ", text: "……もしもし。黒センチュリーの中だ。" },
  { speaker: "とべ君", text: "かつみ組長。俺は銀のハイエースに乗ってる。ひろしげの件、敵の鈴木組長に直接繋ぐ。" },
  { speaker: "かつみ", text: "……わかった。お前たちの判断を信じる。容赦はするな。" },
  { speaker: "かつみ", text: "だが、ハイエースから降りるな。電話をかつみの電話に置いたまま、切るな。" },
];

export const BOSS_LINES = [
  { speaker: "システム", text: "敵対組織・鈴木組・組長に発信中……" },
  { speaker: "鈴木", text: "……誰だ。かつみか？" },
  { speaker: "とべ君", text: "違う。ひろしげ君の兄弟だ。お前の組がやったな。" },
  { speaker: "鈴木", text: "はは……駐車場に来たのか。いい度胸だ。" },
  { speaker: "鈴木", text: "電話、切るなよ。切ったら——" },
  { speaker: "とべ君", text: "切らない。お前が先に動くまで、こっちも動かない。" },
];

export function buildParty(selectedIds: number[]): Fighter[] {
  return CHARACTERS.filter((c) => selectedIds.includes(c.id)).map((c) => ({
    id: `ally-${c.id}`,
    name: c.name,
    weapon: c.weapon,
    hp: c.hp,
    maxHp: c.hp,
    atk: c.atk,
    isEnemy: false,
    title: c.role,
  }));
}

export function buildEnemies(): Fighter[] {
  return ENEMIES.map((enemy, index) => ({
    id: `enemy-${index}`,
    ...enemy,
  }));
}
