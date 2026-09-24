import React from 'react';

interface LuckyCatProps {
  scale?: number;
  pawWavePhase?: number;
  bellJingle?: number; // 0..1
  isHovered?: boolean;
  isRitual?: boolean;
}

export const LuckyCat: React.FC<LuckyCatProps> = ({
  scale = 1,
  pawWavePhase = 0,
  bellJingle = 0,
  isHovered = false,
  isRitual = false,
}) => {
  // Calculate dynamic paw rotation based on hover / ritual / phase
  const pawRotation = isRitual
    ? Math.sin(pawWavePhase * 16) * 18 - 8
    : isHovered
    ? Math.sin(pawWavePhase * 6) * 12 - 5
    : Math.sin(pawWavePhase * 1.5) * 4;

  // Bell rattle offset
  const bellOffsetX = Math.sin(bellJingle * 32) * (bellJingle * 3.5);
  const bellRotation = Math.cos(bellJingle * 24) * (bellJingle * 15);

  return (
    <div
      className="lucky-cat-container relative select-none pointer-events-auto cursor-grab active:cursor-grabbing"
      style={{
        width: `${84 * scale}px`,
        height: `${100 * scale}px`,
        transformOrigin: '50% 5px',
        transition: 'none',
      }}
    >
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Ceramic Porcelain Gradients */}
          <radialGradient id="bodyPorcelain" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#FBF8F3" />
            <stop offset="90%" stopColor="#EDE5D8" />
            <stop offset="100%" stopColor="#E2D8C7" />
          </radialGradient>

          <radialGradient id="headPorcelain" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FAF7F2" />
            <stop offset="92%" stopColor="#EBE1D2" />
            <stop offset="100%" stopColor="#DFCDB8" />
          </radialGradient>

          {/* Calico Orange Patch */}
          <radialGradient id="calicoOrange" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#F4A261" />
            <stop offset="70%" stopColor="#E76F51" />
            <stop offset="100%" stopColor="#C85236" />
          </radialGradient>

          {/* Calico Charcoal Patch */}
          <radialGradient id="calicoDark" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#4A4E69" />
            <stop offset="100%" stopColor="#22223B" />
          </radialGradient>

          {/* Metallic Gold Gradient */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="25%" stopColor="#FFD166" />
            <stop offset="65%" stopColor="#E09F3E" />
            <stop offset="100%" stopColor="#9E6B20" />
          </linearGradient>

          {/* Red Collar Gradient */}
          <linearGradient id="redCollar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EF233C" />
            <stop offset="100%" stopColor="#B8001F" />
          </linearGradient>

          {/* Soft Shadow Under Cat */}
          <radialGradient id="softShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {/* --- TOP HANGING ATTACHMENT RING --- */}
        <g id="hanging-loop">
          <ellipse cx="50" cy="9" rx="5.5" ry="6" stroke="url(#goldGradient)" strokeWidth="2.8" />
          <ellipse cx="50" cy="14" rx="4" ry="3.5" fill="url(#goldGradient)" />
          {/* Decorative Red Knot */}
          <path
            d="M 46 14 C 44 18, 41 21, 38 23 M 54 14 C 56 18, 59 21, 62 23"
            stroke="#D90429"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>

        {/* --- EARS --- */}
        {/* Left Ear (Dark/Calico) */}
        <g id="left-ear">
          <path
            d="M 24 38 C 18 20, 26 12, 38 23 Z"
            fill="url(#headPorcelain)"
          />
          {/* Dark calico tip on left ear */}
          <path
            d="M 22 30 C 18 20, 26 12, 34 19 C 29 23, 25 26, 22 30 Z"
            fill="url(#calicoDark)"
          />
          {/* Inner pink ear */}
          <path
            d="M 26 34 C 23 25, 27 20, 34 26 Z"
            fill="#FFB5A7"
            opacity="0.85"
          />
        </g>

        {/* Right Ear (Orange Calico) */}
        <g id="right-ear">
          <path
            d="M 76 38 C 82 20, 74 12, 62 23 Z"
            fill="url(#calicoOrange)"
          />
          {/* Inner pink ear */}
          <path
            d="M 74 34 C 77 25, 73 20, 66 26 Z"
            fill="#FFB5A7"
            opacity="0.85"
          />
        </g>

        {/* --- BODY (LOWER TORSO) --- */}
        <g id="torso">
          {/* Main rounded ceramic body */}
          <ellipse cx="50" cy="85" rx="34" ry="30" fill="url(#bodyPorcelain)" />
          
          {/* Right side Calico Patch on back/body */}
          <path
            d="M 72 70 C 83 76, 85 92, 74 102 C 68 98, 67 80, 72 70 Z"
            fill="url(#calicoOrange)"
            opacity="0.9"
          />

          {/* Left subtle Dark Patch */}
          <path
            d="M 28 85 C 22 92, 23 100, 31 104 C 27 98, 26 90, 28 85 Z"
            fill="url(#calicoDark)"
            opacity="0.85"
          />

          {/* White Belly Oval */}
          <ellipse cx="50" cy="88" rx="21" ry="18" fill="#FFFFFF" opacity="0.75" />

          {/* Feet (Cute tucked paws) */}
          <ellipse cx="36" cy="111" rx="8" ry="5.5" fill="url(#headPorcelain)" />
          <line x1="33" y1="112" x2="33" y2="115" stroke="#DFCDB8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="38" y1="112" x2="38" y2="115" stroke="#DFCDB8" strokeWidth="1.2" strokeLinecap="round" />

          <ellipse cx="64" cy="111" rx="8" ry="5.5" fill="url(#headPorcelain)" />
          <line x1="61" y1="112" x2="61" y2="115" stroke="#DFCDB8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="66" y1="112" x2="66" y2="115" stroke="#DFCDB8" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* --- HEAD --- */}
        <g id="head">
          <circle cx="50" cy="46" r="28" fill="url(#headPorcelain)" />

          {/* Calico Spot on Head/Forehead */}
          <path
            d="M 58 22 C 68 24, 73 34, 69 42 C 62 38, 59 28, 58 22 Z"
            fill="url(#calicoOrange)"
            opacity="0.95"
          />

          {/* Specular Porcelain Highlight */}
          <ellipse cx="40" cy="30" rx="8" ry="4" fill="#FFFFFF" opacity="0.6" transform="rotate(-15 40 30)" />

          {/* Cute Smiling Closed Eyes (^ ᵕ ^) */}
          <path
            d="M 33 46 C 36 41, 42 41, 45 46"
            stroke="#2B2D42"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Delicate eyelashes */}
          <path d="M 44 43 L 47 41" stroke="#2B2D42" strokeWidth="1.6" strokeLinecap="round" />

          <path
            d="M 55 46 C 58 41, 64 41, 67 46"
            stroke="#2B2D42"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path d="M 66 43 L 69 41" stroke="#2B2D42" strokeWidth="1.6" strokeLinecap="round" />

          {/* Sweet Pink Nose */}
          <polygon points="48.5,50 51.5,50 50,52.5" fill="#E76F51" />

          {/* Curved Smiling Mouth */}
          <path
            d="M 46 54 C 48 56.5, 50 56.5, 50 53 C 50 56.5, 52 56.5, 54 54"
            stroke="#2B2D42"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Soft Peach Cheek Blush */}
          <ellipse cx="31" cy="52" rx="5.5" ry="3.2" fill="#F4A261" opacity="0.45" />
          <ellipse cx="69" cy="52" rx="5.5" ry="3.2" fill="#F4A261" opacity="0.45" />

          {/* Whiskers */}
          {/* Left Whiskers */}
          <line x1="22" y1="49" x2="11" y2="47" stroke="#8D99AE" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
          <line x1="21" y1="53" x2="10" y2="55" stroke="#8D99AE" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
          {/* Right Whiskers */}
          <line x1="78" y1="49" x2="89" y2="47" stroke="#8D99AE" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
          <line x1="79" y1="53" x2="90" y2="55" stroke="#8D99AE" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* --- RED COLLAR & GOLD BELL --- */}
        <g id="collar-group">
          {/* Braided Red Collar Ribbon */}
          <path
            d="M 27 66 C 38 74, 62 74, 73 66 C 70 70, 30 70, 27 66 Z"
            fill="url(#redCollar)"
          />
          <path
            d="M 28 66 C 39 73.5, 61 73.5, 72 66"
            stroke="#FFE6A7"
            strokeWidth="1"
            strokeDasharray="2 2"
            fill="none"
          />

          {/* Gold Bell with Jingle Offset & Rotation */}
          <g
            id="gold-bell"
            style={{
              transform: `translate(${bellOffsetX}px, 0px) rotate(${bellRotation}deg)`,
              transformOrigin: '50px 72px',
              transition: 'transform 0.05s ease-out',
            }}
          >
            {/* Bell attachment ring */}
            <circle cx="50" cy="70" r="2.5" fill="url(#goldGradient)" />
            {/* Bell body */}
            <circle cx="50" cy="74.5" r="6" fill="url(#goldGradient)" stroke="#B7791F" strokeWidth="0.8" />
            {/* Bell slit line */}
            <line x1="46" y1="75.5" x2="54" y2="75.5" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="50" cy="77" r="1.4" fill="#78350F" />
            {/* Bell Specular Shimmer */}
            <ellipse cx="48" cy="72.5" rx="1.8" ry="1" fill="#FFFFFF" opacity="0.8" />
          </g>
        </g>

        {/* --- GOLD KOBAN (LUCKY COIN / OMAMORI) --- */}
        <g id="lucky-koban" transform="translate(36, 82)">
          {/* Oval Coin */}
          <rect
            x="0"
            y="0"
            width="17"
            height="24"
            rx="8.5"
            fill="url(#goldGradient)"
            stroke="#B7791F"
            strokeWidth="1.2"
          />
          {/* Coin Inner Border */}
          <rect
            x="2"
            y="2"
            width="13"
            height="20"
            rx="6.5"
            stroke="#D97706"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Kanji: 福 (Good Fortune / Luck) */}
          <text
            x="8.5"
            y="15.5"
            textAnchor="middle"
            fill="#78350F"
            fontSize="10"
            fontWeight="bold"
            fontFamily="serif"
          >
            福
          </text>
        </g>

        {/* --- LEFT PAW (RESTING ON COIN) --- */}
        <g id="left-paw">
          <ellipse cx="37" cy="85" rx="6.5" ry="5.5" fill="url(#headPorcelain)" />
          {/* Pink paw pad */}
          <ellipse cx="37" cy="85" rx="3.2" ry="2.5" fill="#FFB5A7" opacity="0.75" />
        </g>

        {/* --- RIGHT PAW (RAISED WAVING / BECKONING) --- */}
        <g
          id="right-paw-raised"
          style={{
            transform: `rotate(${pawRotation}deg)`,
            transformOrigin: '72px 76px',
            transition: 'transform 0.15s ease-out',
          }}
        >
          {/* Upper Arm */}
          <path
            d="M 68 76 C 75 74, 82 66, 80 52 C 78 42, 68 44, 68 54 Z"
            fill="url(#headPorcelain)"
          />
          {/* Paw Hand (Raised & Beckoning forward) */}
          <ellipse cx="76" cy="46" rx="8" ry="7" fill="url(#headPorcelain)" />
          {/* Soft Pink Paw Pads */}
          <ellipse cx="76" cy="46" rx="4.5" ry="3.5" fill="#FFB5A7" />
          {/* Tiny toe pads */}
          <circle cx="72" cy="41" r="1.5" fill="#FFB5A7" />
          <circle cx="76" cy="39.5" r="1.5" fill="#FFB5A7" />
          <circle cx="80" cy="41" r="1.5" fill="#FFB5A7" />
        </g>
      </svg>
    </div>
  );
};
