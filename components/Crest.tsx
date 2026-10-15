export function Crest({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 56"
      className={className}
      role="img"
      aria-label="PSMO College crest"
    >
      <defs>
        <linearGradient id="crestGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="55%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
      <path
        d="M24 1 46 9v22c0 13-9 20-22 24C11 51 2 44 2 31V9L24 1Z"
        fill="url(#crestGrad)"
      />
      <path
        d="M24 5 42 11.5V31c0 11-7.5 17-18 20.5C13.5 48 6 42 6 31V11.5L24 5Z"
        fill="none"
        stroke="#f0b429"
        strokeWidth="1.6"
      />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="Georgia, 'Times New Roman', serif"
      >
        PSMO
      </text>
      <text
        x="24"
        y="41"
        textAnchor="middle"
        fontSize="6.5"
        fill="#f0b429"
        fontFamily="Georgia, 'Times New Roman', serif"
        letterSpacing="0.5"
      >
        BCA
      </text>
    </svg>
  );
}
