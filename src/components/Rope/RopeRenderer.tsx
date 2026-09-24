import type { Vec2 } from '../../physics/vectors';

interface RopeRendererProps {
  ropePath: string;
  points: Vec2[];
  primaryColor?: string;
  secondaryColor?: string;
  onPointerDown?: (e: React.PointerEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export const RopeRenderer: React.FC<RopeRendererProps> = ({
  ropePath,
  points,
  primaryColor = '#D90429',
  secondaryColor = '#FFF5EB',
  onPointerDown,
  onContextMenu,
}) => {
  if (points.length < 2) return null;

  const bottomPt = points[points.length - 1];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
      <defs>
        {/* Gold Bead Gradient */}
        <linearGradient id="beadGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="35%" stopColor="#FFD166" />
          <stop offset="85%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        {/* Top Clamp Bracket Gradient */}
        <linearGradient id="bracketGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="60%" stopColor="#1F2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>

      {/* Invisible Interactive Hit Path for Dragging & Context Menu */}
      <path
        d={ropePath}
        fill="none"
        stroke="transparent"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-auto cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          if (e.button === 2) {
            e.preventDefault();
            e.stopPropagation();
            onContextMenu?.(e as unknown as React.MouseEvent);
            return;
          }
          onPointerDown?.(e);
        }}
        onContextMenu={onContextMenu}
      />

      {/* 1. Base Red Cord */}
      <path
        d={ropePath}
        fill="none"
        stroke={primaryColor}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Twisted White/Cream Braided Mizuhiki Pattern */}
      <path
        d={ropePath}
        fill="none"
        stroke={secondaryColor}
        strokeWidth="1.6"
        strokeDasharray="4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Fine Metallic Gold Thread Accent */}
      <path
        d={ropePath}
        fill="none"
        stroke="#FFD166"
        strokeWidth="0.75"
        strokeDasharray="2 6"
        strokeLinecap="round"
      />

      {/* 4. Bottom Gold Attachment Bead & Ring */}
      <g transform={`translate(${bottomPt.x}, ${bottomPt.y})`}>
        {/* Gold Ring */}
        <circle cx="0" cy="-3" r="3.5" fill="none" stroke="url(#beadGold)" strokeWidth="1.8" />
        {/* Main Sphere Bead */}
        <circle cx="0" cy="2" r="4.2" fill="url(#beadGold)" />
        {/* Bead Specular Dot */}
        <circle cx="-1.2" cy="0.8" r="1.2" fill="#FFFFFF" opacity="0.85" />
      </g>
    </svg>
  );
};
