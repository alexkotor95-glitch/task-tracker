"use client";

import React from "react";

// ── ChartGrid ──────────────────────────────────────────────────────────────
interface ChartGridProps {
  opacity?: number;
  lat?: number;
  lon?: number;
  withCompassPoints?: boolean;
  className?: string;
}

export const ChartGrid: React.FC<ChartGridProps> = ({
  opacity = 0.5,
  lat = 12,
  lon = 12,
  withCompassPoints = false,
  className = "",
}) => {
  const lines: React.ReactNode[] = [];
  for (let i = 1; i < lat; i++) {
    lines.push(
      <line key={`h${i}`} x1="0" y1={(100 / lat) * i} x2="100" y2={(100 / lat) * i} />
    );
  }
  for (let i = 1; i < lon; i++) {
    lines.push(
      <line key={`v${i}`} x1={(100 / lon) * i} y1="0" x2={(100 / lon) * i} y2="100" />
    );
  }
  return (
    <svg
      className={`chart-bg ${className}`}
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      style={{ opacity }}
      aria-hidden="true"
    >
      <g stroke="var(--line)" strokeWidth="0.06" opacity="0.35">{lines}</g>
      <g stroke="var(--line)" strokeWidth="0.12" opacity="0.45">
        <line x1="50" y1="0" x2="50" y2="100" />
        <line x1="0" y1="50" x2="100" y2="50" />
      </g>
      {withCompassPoints && (
        <g fill="var(--brass)" opacity="0.7" fontSize="2.6" fontFamily="var(--font-mono)" letterSpacing="0.3">
          <text x="49" y="3.5" textAnchor="middle">N</text>
          <text x="49" y="99" textAnchor="middle">S</text>
          <text x="98" y="51.5" textAnchor="end">E</text>
          <text x="2" y="51.5">W</text>
        </g>
      )}
    </svg>
  );
};

// ── CompassDial ────────────────────────────────────────────────────────────
interface CompassDialProps {
  rings?: number[];
  showCardinals?: boolean;
  showTicks?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const CompassDial: React.FC<CompassDialProps> = ({
  rings = [44, 36, 28, 20],
  showCardinals = true,
  showTicks = true,
  className = "",
  style = {},
}) => {
  const ticks: React.ReactNode[] = [];
  if (showTicks) {
    for (let i = 0; i < 360; i += 6) {
      const isMajor = i % 30 === 0;
      const len = isMajor ? 3.2 : 1.4;
      const r1 = 46.5;
      const r2 = r1 - len;
      const a = (i - 90) * (Math.PI / 180);
      const x1 = 50 + r1 * Math.cos(a);
      const y1 = 50 + r1 * Math.sin(a);
      const x2 = 50 + r2 * Math.cos(a);
      const y2 = 50 + r2 * Math.sin(a);
      ticks.push(
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="var(--ink)"
          strokeWidth={isMajor ? 0.35 : 0.18}
          opacity={isMajor ? 0.55 : 0.3}
        />
      );
    }
  }
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      {rings.map((r, i) => (
        <circle
          key={i} cx="50" cy="50" r={r}
          fill="none" stroke="var(--ink)"
          strokeWidth={i === 0 ? 0.4 : 0.22}
          opacity={0.55 - i * 0.1}
        />
      ))}
      {ticks}
      <g stroke="var(--ink)" strokeWidth="0.15" opacity="0.18">
        <line x1="50" y1="6" x2="50" y2="94" />
        <line x1="6" y1="50" x2="94" y2="50" />
        <line x1="18" y1="18" x2="82" y2="82" />
        <line x1="82" y1="18" x2="18" y2="82" />
      </g>
      {showCardinals && (
        <g fontFamily="var(--font-display)" fontWeight="600" fontSize="4.2" fill="var(--ink)" textAnchor="middle">
          <text x="50" y="11.5">N</text>
          <text x="50" y="92">S</text>
          <text x="91" y="51.6">E</text>
          <text x="9" y="51.6">W</text>
          <g fontFamily="var(--font-mono)" fontSize="2.2" fill="var(--muted)" opacity="0.8">
            <text x="79" y="24">NE</text>
            <text x="79" y="79">SE</text>
            <text x="21" y="79">SW</text>
            <text x="21" y="24">NW</text>
          </g>
        </g>
      )}
    </svg>
  );
};

// ── CompassNeedle ──────────────────────────────────────────────────────────
interface CompassNeedleProps {
  length?: number;
  width?: number;
  north?: string;
  south?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const CompassNeedle: React.FC<CompassNeedleProps> = ({
  length = 38,
  width = 6,
  north = "var(--rose)",
  south = "var(--ink)",
  className = "",
  style = {},
}) => (
  <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
    <defs>
      <linearGradient id="needle-shine-n" x1="0" x2="0" y1="1" y2="0">
        <stop offset="0%" stopColor={north} stopOpacity="0.5" />
        <stop offset="100%" stopColor={north} stopOpacity="1" />
      </linearGradient>
      <linearGradient id="needle-shine-s" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={south} stopOpacity="0.6" />
        <stop offset="100%" stopColor={south} stopOpacity="1" />
      </linearGradient>
    </defs>
    <polygon points={`50,${50 - length} ${50 - width / 2},50 ${50 + width / 2},50`} fill="url(#needle-shine-n)" />
    <polygon points={`50,${50 + length} ${50 - width / 2},50 ${50 + width / 2},50`} fill="url(#needle-shine-s)" />
    <circle cx="50" cy="50" r="2.2" fill="var(--brass)" />
    <circle cx="50" cy="50" r="0.9" fill="var(--bg)" />
  </svg>
);

// ── CompassRose ────────────────────────────────────────────────────────────
interface CompassRoseProps {
  size?: number;
  className?: string;
  showLabels?: boolean;
}

export const CompassRose: React.FC<CompassRoseProps> = ({
  size = 220,
  className = "",
  showLabels = true,
}) => {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const angle = i * 45;
    const isMajor = i % 2 === 0;
    const len = isMajor ? 44 : 28;
    const w = isMajor ? 5 : 3.5;
    pts.push({ angle, len, w, isMajor });
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="none" stroke="var(--ink)" strokeWidth="0.25" opacity="0.5" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="var(--ink)" strokeWidth="0.18" opacity="0.35" />
      <circle cx="50" cy="50" r="14" fill="none" stroke="var(--ink)" strokeWidth="0.25" opacity="0.5" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        const r1 = 47.5, r2 = 45.5;
        return (
          <line key={i}
            x1={50 + r1 * Math.cos(a)} y1={50 + r1 * Math.sin(a)}
            x2={50 + r2 * Math.cos(a)} y2={50 + r2 * Math.sin(a)}
            stroke="var(--ink)" strokeWidth="0.2" opacity="0.4"
          />
        );
      })}
      {pts.map(({ angle, len, w, isMajor }, i) => {
        const tip = { x: 50, y: 50 - len };
        const left = { x: 50 - w, y: 50 - 4 };
        const right = { x: 50 + w, y: 50 - 4 };
        return (
          <g key={i} transform={`rotate(${angle} 50 50)`}>
            <polygon
              points={`${tip.x},${tip.y} ${left.x},${left.y} 50,50`}
              fill={isMajor ? "var(--ink)" : "var(--brass)"}
              opacity={isMajor ? 0.92 : 0.85}
            />
            <polygon
              points={`${tip.x},${tip.y} ${right.x},${right.y} 50,50`}
              fill={isMajor ? "var(--brass)" : "var(--ink)"}
              opacity={isMajor ? 0.85 : 0.55}
            />
          </g>
        );
      })}
      <circle cx="50" cy="50" r="3" fill="var(--bg)" stroke="var(--ink)" strokeWidth="0.4" />
      <circle cx="50" cy="50" r="1.1" fill="var(--brass)" />
      {showLabels && (
        <g fontFamily="var(--font-display)" fontWeight="600" fontSize="3.8" fill="var(--ink)" textAnchor="middle">
          <text x="50" y="6.5">N</text>
          <text x="50" y="97.5">S</text>
          <text x="96" y="51.4">E</text>
          <text x="4" y="51.4">W</text>
        </g>
      )}
    </svg>
  );
};

// ── BrandMark ──────────────────────────────────────────────────────────────
interface BrandMarkProps {
  size?: number;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ size = 26 }) => {
  const ref = React.useRef<SVGGElement>(null);
  React.useEffect(() => {
    let t = 0;
    let raf: number;
    const tick = () => {
      t += 0.012;
      const r = Math.sin(t) * 6;
      if (ref.current) ref.current.style.transform = `rotate(${r}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <g ref={ref} style={{ transformOrigin: "16px 16px", transition: "transform .1s linear" }}>
        <polygon points="16,4 13.4,16 16,16" fill="var(--rose)" />
        <polygon points="16,4 18.6,16 16,16" fill="var(--rose)" opacity="0.7" />
        <polygon points="16,28 13.4,16 16,16" fill="currentColor" />
        <polygon points="16,28 18.6,16 16,16" fill="currentColor" opacity="0.6" />
      </g>
      <circle cx="16" cy="16" r="1.6" fill="var(--brass)" />
    </svg>
  );
};

// ── RadialRays ─────────────────────────────────────────────────────────────
interface RadialRaysProps {
  count?: number;
  opacity?: number;
  className?: string;
}

export const RadialRays: React.FC<RadialRaysProps> = ({
  count = 36,
  opacity = 0.18,
  className = "",
}) => {
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * 360;
    lines.push(
      <line
        key={i} x1="50" y1="50" x2="50" y2="0"
        stroke="var(--ink)" strokeWidth="0.15"
        transform={`rotate(${a} 50 50)`}
      />
    );
  }
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ opacity, position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {lines}
    </svg>
  );
};
