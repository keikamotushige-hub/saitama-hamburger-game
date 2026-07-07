interface CrownCarProps {
  className?: string;
  variant?: "black" | "silver" | "dark" | "white";
  headlightsOn?: boolean;
  brakeLights?: boolean;
  scale?: number;
}

export function CrownCar({
  className = "",
  variant = "black",
  headlightsOn = true,
  brakeLights = false,
  scale = 1,
}: CrownCarProps) {
  const body =
    variant === "white"
      ? { main: "#f0f2f5", dark: "#c8ccd4", trim: "#ffffff" }
      : variant === "silver"
        ? { main: "#8a9098", dark: "#5c636b", trim: "#d4dae0" }
        : variant === "dark"
          ? { main: "#1a1d22", dark: "#0a0c10", trim: "#3a4048" }
          : { main: "#12151a", dark: "#050608", trim: "#2a3038" };

  return (
    <svg
      viewBox="0 0 320 120"
      className={className}
      style={{ transform: `scale(${scale})` }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`crown-body-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={body.trim} />
          <stop offset="35%" stopColor={body.main} />
          <stop offset="100%" stopColor={body.dark} />
        </linearGradient>
        <linearGradient id={`crown-glass-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e2838" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0a1018" stopOpacity="0.85" />
        </linearGradient>
        <filter id="headlight-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="car-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>

      <ellipse cx="160" cy="108" rx="130" ry="8" fill="#000" opacity="0.45" />

      <g filter="url(#car-shadow)">
        <path
          d="M28 78 Q30 58 58 50 L88 44 Q120 38 160 36 Q200 38 232 44 L262 50 Q290 58 292 78 L288 84 Q286 88 280 88 L40 88 Q34 88 32 84 Z"
          fill={`url(#crown-body-${variant})`}
        />
        <path
          d="M72 48 Q110 40 160 38 Q210 40 248 48 L238 58 Q200 52 160 50 Q120 52 82 58 Z"
          fill={body.trim}
          opacity="0.5"
        />
        <path
          d="M90 46 L110 42 L150 40 L190 42 L210 46 L200 54 L160 52 L120 54 Z"
          fill={`url(#crown-glass-${variant})`}
        />
        <path
          d="M118 42 L122 54 M198 42 L194 54"
          stroke="#2a3545"
          strokeWidth="2"
        />

        <rect x="36" y="72" width="18" height="10" rx="3" fill="#111" />
        <rect x="266" y="72" width="18" height="10" rx="3" fill="#111" />

        <circle cx="78" cy="88" r="16" fill="#0a0a0a" />
        <circle cx="78" cy="88" r="11" fill="#1a1a1a" />
        <circle cx="78" cy="88" r="5" fill="#333" />
        <circle cx="242" cy="88" r="16" fill="#0a0a0a" />
        <circle cx="242" cy="88" r="11" fill="#1a1a1a" />
        <circle cx="242" cy="88" r="5" fill="#333" />

        <path d="M34 70 L42 62 M286 70 L278 62" stroke={body.trim} strokeWidth="2" />

        {headlightsOn && (
          <g filter="url(#headlight-glow)">
            <ellipse cx="30" cy="72" rx="8" ry="5" fill="#fff8e0" opacity="0.95" />
            <ellipse cx="30" cy="72" rx="20" ry="10" fill="#fff8c0" opacity="0.25" />
            <ellipse cx="290" cy="72" rx="8" ry="5" fill="#fff8e0" opacity="0.95" />
            <ellipse cx="290" cy="72" rx="20" ry="10" fill="#fff8c0" opacity="0.25" />
          </g>
        )}

        {brakeLights && (
          <>
            <rect x="34" y="74" width="10" height="6" rx="1" fill="#ff2020" opacity="0.9" />
            <rect x="276" y="74" width="10" height="6" rx="1" fill="#ff2020" opacity="0.9" />
          </>
        )}

        <rect x="148" y="58" width="24" height="3" rx="1" fill="#c0a060" opacity="0.7" />
        <text
          x="160"
          y="82"
          textAnchor="middle"
          fill="#666"
          fontSize="7"
          fontFamily="serif"
          letterSpacing="2"
        >
          CROWN
        </text>
      </g>
    </svg>
  );
}
