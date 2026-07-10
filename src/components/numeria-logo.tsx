/**
 * Numeria Institute logo — exact SVG mark from the website.
 * Stylized "N" with 4 navy dots at corners, 2 teal dots in middle,
 * inside a subtle circle outline.
 */
interface LogoProps {
  size?: number;
  className?: string;
  /** Use light strokes (for dark backgrounds) or dark strokes (for light backgrounds) */
  variant?: "light" | "dark";
}

export function NumeriaLogo({ size = 42, className, variant = "light" }: LogoProps) {
  const stroke = variant === "light" ? "white" : "#1B2A4E";
  const circleStroke =
    variant === "light" ? "rgba(255,255,255,0.22)" : "rgba(27,42,78,0.22)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Numeria Institute"
    >
      <circle cx="22" cy="22" r="19" stroke={circleStroke} strokeWidth="1.2" fill="none" />
      <line x1="13" y1="10" x2="13" y2="34" stroke={stroke} strokeWidth="2.8" strokeLinecap="round" />
      <line x1="13" y1="10" x2="31" y2="34" stroke={stroke} strokeWidth="2.8" strokeLinecap="round" />
      <line x1="31" y1="10" x2="31" y2="34" stroke={stroke} strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="13" cy="10" r="3.2" fill="#1A3C6E" stroke={stroke} strokeWidth="2" />
      <circle cx="13" cy="34" r="3.2" fill="#1A3C6E" stroke={stroke} strokeWidth="2" />
      <circle cx="31" cy="10" r="3.2" fill="#1A3C6E" stroke={stroke} strokeWidth="2" />
      <circle cx="31" cy="34" r="3.2" fill="#1A3C6E" stroke={stroke} strokeWidth="2" />
      <circle cx="18.5" cy="18" r="3" fill="#2DD4BF" />
      <circle cx="25.5" cy="26" r="3" fill="#2DD4BF" />
    </svg>
  );
}

/** Full lockup: logo + wordmark "NUMERIA INSTITUTE" */
export function NumeriaLogoFull({
  size = 42,
  className,
  variant = "light",
}: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-[#1B2A4E]";
  const subColor = variant === "light" ? "text-white/60" : "text-[#1B2A4E]/60";

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <NumeriaLogo size={size} variant={variant} />
      <div className="flex flex-col leading-none">
        <span className={`font-bold text-lg tracking-tight ${textColor}`}>
          NUMERIA
        </span>
        <span className={`text-[10px] tracking-[0.2em] uppercase ${subColor}`}>
          Institute
        </span>
      </div>
    </div>
  );
}
