interface HiAceVanProps {
  className?: string;
  scale?: number;
  headlightsOn?: boolean;
}

/** とべ君の車 — 銀のハイエース */
export function HiAceVan({
  className = "",
  scale = 1,
  headlightsOn = true,
}: HiAceVanProps) {
  return (
    <svg
      viewBox="0 0 380 140"
      className={className}
      style={{ transform: `scale(${scale})` }}
      aria-hidden
    >
      <defs>
        <linearGradient id="hiace-silver" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8eaee" />
          <stop offset="45%" stopColor="#b8bcc4" />
          <stop offset="100%" stopColor="#8a9098" />
        </linearGradient>
        <linearGradient id="hiace-glass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2a3545" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#151a22" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <ellipse cx="190" cy="125" rx="155" ry="8" fill="#000" opacity="0.4" />
      <path
        d="M25 95 L25 55 Q28 42 55 38 L95 34 L285 34 L325 38 Q352 42 355 55 L355 95 Z"
        fill="url(#hiace-silver)"
      />
      <rect x="55" y="36" width="270" height="38" rx="2" fill="url(#hiace-glass)" />
      <line x1="140" y1="36" x2="140" y2="74" stroke="#4a5568" strokeWidth="2" />
      <line x1="240" y1="36" x2="240" y2="74" stroke="#4a5568" strokeWidth="2" />
      <circle cx="75" cy="98" r="16" fill="#111" />
      <circle cx="75" cy="98" r="10" fill="#333" />
      <circle cx="305" cy="98" r="16" fill="#111" />
      <circle cx="305" cy="98" r="10" fill="#333" />
      {headlightsOn && (
        <>
          <ellipse cx="28" cy="82" rx="9" ry="5" fill="#fffde8" opacity="0.95" />
          <ellipse cx="352" cy="82" rx="9" ry="5" fill="#fffde8" opacity="0.95" />
        </>
      )}
      <text x="190" y="90" textAnchor="middle" fill="#666" fontSize="7" fontFamily="sans-serif" letterSpacing="2">
        HIACE
      </text>
    </svg>
  );
}
