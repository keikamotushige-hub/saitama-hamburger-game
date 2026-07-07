interface CenturyCarProps {
  className?: string;
  scale?: number;
  headlightsOn?: boolean;
}

/** かつみ組長の車 — 黒のセンチュリー */
export function CenturyCar({
  className = "",
  scale = 1,
  headlightsOn = true,
}: CenturyCarProps) {
  return (
    <svg
      viewBox="0 0 360 130"
      className={className}
      style={{ transform: `scale(${scale})` }}
      aria-hidden
    >
      <defs>
        <linearGradient id="century-black" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a2a30" />
          <stop offset="50%" stopColor="#0a0a0e" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="century-glass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a2030" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#050810" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <ellipse cx="180" cy="118" rx="150" ry="9" fill="#000" opacity="0.5" />
      <path
        d="M30 85 Q32 55 75 48 L120 42 Q180 36 240 42 L285 48 Q328 55 330 85 L325 92 Q320 96 310 96 L50 96 Q40 96 35 92 Z"
        fill="url(#century-black)"
      />
      <path
        d="M95 50 Q150 42 180 40 Q210 42 265 50 L255 62 Q180 56 105 62 Z"
        fill="url(#century-glass)"
      />
      <rect x="155" y="44" width="50" height="4" rx="1" fill="#8a7a50" opacity="0.8" />
      <circle cx="85" cy="96" r="18" fill="#0a0a0a" />
      <circle cx="85" cy="96" r="12" fill="#151515" />
      <circle cx="275" cy="96" r="18" fill="#0a0a0a" />
      <circle cx="275" cy="96" r="12" fill="#151515" />
      {headlightsOn && (
        <>
          <ellipse cx="32" cy="78" rx="10" ry="6" fill="#fff8e0" opacity="0.9" />
          <ellipse cx="328" cy="78" rx="10" ry="6" fill="#fff8e0" opacity="0.9" />
        </>
      )}
      <text x="180" y="82" textAnchor="middle" fill="#555" fontSize="8" fontFamily="serif" letterSpacing="3">
        CENTURY
      </text>
    </svg>
  );
}
