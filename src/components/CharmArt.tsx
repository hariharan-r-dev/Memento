import React from 'react'

type SVGProps = { className?: string }

const ManekiNeko = ({ className }: SVGProps) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="60" rx="16" ry="17" fill="#FDF8F0" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="40" cy="30" r="20" fill="#FDF8F0" stroke="#2A2820" strokeWidth="1.2"/>
    <polygon points="22,18 17,5 30,15" fill="#FDF8F0" stroke="#2A2820" strokeWidth="1.2" strokeLinejoin="round"/>
    <polygon points="23.5,16 19,8 29,14" fill="#F5C2C7"/>
    <polygon points="58,18 63,5 50,15" fill="#FDF8F0" stroke="#2A2820" strokeWidth="1.2" strokeLinejoin="round"/>
    <polygon points="56.5,16 61,8 51,14" fill="#F5C2C7"/>
    <circle cx="32.5" cy="28" r="3.5" fill="#2A2820"/>
    <circle cx="47.5" cy="28" r="3.5" fill="#2A2820"/>
    <circle cx="33.6" cy="26.8" r="1.2" fill="white"/>
    <circle cx="48.6" cy="26.8" r="1.2" fill="white"/>
    <ellipse cx="40" cy="33.5" rx="2" ry="1.5" fill="#F5A0A0"/>
    <path d="M37 35.5 Q40 38.5 43 35.5" stroke="#2A2820" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <line x1="22" y1="31" x2="36" y2="33" stroke="#2A2820" strokeWidth="0.7"/>
    <line x1="22" y1="34.5" x2="36" y2="34.5" stroke="#2A2820" strokeWidth="0.7"/>
    <line x1="44" y1="33" x2="58" y2="31" stroke="#2A2820" strokeWidth="0.7"/>
    <line x1="44" y1="34.5" x2="58" y2="34.5" stroke="#2A2820" strokeWidth="0.7"/>
    <ellipse cx="61" cy="24" rx="8" ry="9" fill="#FDF8F0" stroke="#2A2820" strokeWidth="1.2" transform="rotate(-18 61 24)"/>
    <ellipse cx="57.5" cy="15.5" rx="3" ry="2.2" fill="#FDF8F0" stroke="#2A2820" strokeWidth="0.9"/>
    <ellipse cx="63.5" cy="14.5" rx="3" ry="2.2" fill="#FDF8F0" stroke="#2A2820" strokeWidth="0.9"/>
    <ellipse cx="67" cy="19" rx="3" ry="2.2" fill="#FDF8F0" stroke="#2A2820" strokeWidth="0.9"/>
    <path d="M26 47 Q40 54 54 47" stroke="#D94040" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <circle cx="40" cy="51.5" r="4" fill="#F0C040" stroke="#2A2820" strokeWidth="0.8"/>
    <ellipse cx="40" cy="53.5" rx="1.2" ry="0.8" fill="#2A2820"/>
  </svg>
)

const EvilEye = ({ className }: SVGProps) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="32" fill="#C8906A" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="40" cy="40" r="26" fill="#1B4FD8"/>
    <circle cx="40" cy="40" r="20" fill="#2E6CF0"/>
    <circle cx="40" cy="40" r="14" fill="#FFFFFF"/>
    <circle cx="40" cy="40" r="9" fill="#2A2820"/>
    <circle cx="43" cy="37" r="3" fill="white"/>
    <circle cx="37" cy="43" r="1.5" fill="white" opacity="0.5"/>
    <circle cx="40" cy="40" r="32" stroke="#2A2820" strokeWidth="1.2"/>
    <path d="M10 40 Q40 12 70 40 Q40 68 10 40Z" stroke="#2A2820" strokeWidth="1" fill="none"/>
  </svg>
)

const Hamsa = ({ className }: SVGProps) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 72 C40 72 14 52 14 34 C14 28 18 24 22 24 C24 24 26 25 27.5 27 L27.5 20 C27.5 16.5 30 14 33 14 C35 14 36.8 15.2 37.8 17 C38.8 15.2 40 14 42 14 C44 14 45.2 15.2 45.8 17 C46.8 15.5 48.5 14.5 50.5 14.5 C53 14.5 55 16.5 55 19.5 L55 25 C57 23.5 59 23 61 23.5 C64.5 24.5 66 28 66 32 C66 50 40 72 40 72Z" fill="#C8906A" stroke="#2A2820" strokeWidth="1.3" strokeLinejoin="round"/>
    <circle cx="40" cy="40" r="7" fill="white" stroke="#2A2820" strokeWidth="1"/>
    <circle cx="40" cy="40" r="4.5" fill="#1B4FD8"/>
    <circle cx="40" cy="40" r="2.5" fill="#2A2820"/>
    <circle cx="41.2" cy="38.8" r="0.9" fill="white"/>
    <line x1="30" y1="38" x2="26" y2="38" stroke="#2A2820" strokeWidth="0.8"/>
    <line x1="50" y1="38" x2="54" y2="38" stroke="#2A2820" strokeWidth="0.8"/>
    <line x1="40" y1="28" x2="40" y2="31" stroke="#2A2820" strokeWidth="0.8"/>
  </svg>
)

const KoiFish = ({ className }: SVGProps) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M55 18 Q72 20 72 40 Q72 60 55 62 Q30 66 18 50 Q10 40 18 30 Q30 14 55 18Z" fill="#E8703A" stroke="#2A2820" strokeWidth="1.2"/>
    <path d="M55 22 Q67 24 67 40 Q67 56 55 58 Q36 62 24 48 Q16 40 24 32 Q36 18 55 22Z" fill="#F09060"/>
    <ellipse cx="35" cy="40" rx="10" ry="14" fill="#FDF8F0" opacity="0.6"/>
    <path d="M18 30 Q8 22 12 8 Q20 16 18 30Z" fill="#E8703A" stroke="#2A2820" strokeWidth="1"/>
    <path d="M18 50 Q8 58 12 72 Q20 64 18 50Z" fill="#E8703A" stroke="#2A2820" strokeWidth="1"/>
    <path d="M36 26 Q44 22 50 26" stroke="#C83232" strokeWidth="1" fill="none"/>
    <path d="M33 33 Q43 29 52 33" stroke="#C83232" strokeWidth="1" fill="none"/>
    <path d="M32 40 Q43 36 54 40" stroke="#C83232" strokeWidth="1" fill="none"/>
    <path d="M33 47 Q43 43 52 47" stroke="#C83232" strokeWidth="1" fill="none"/>
    <path d="M36 54 Q44 50 50 54" stroke="#C83232" strokeWidth="1" fill="none"/>
    <circle cx="58" cy="38" r="4" fill="#2A2820"/>
    <circle cx="59.2" cy="36.8" r="1.4" fill="white"/>
    <path d="M62 36 Q67 32 70 30" stroke="#2A2820" strokeWidth="0.8" fill="none"/>
    <path d="M62 38 Q68 38 72 38" stroke="#2A2820" strokeWidth="0.8" fill="none"/>
  </svg>
)

const FoxSpirit = ({ className }: SVGProps) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="56" rx="15" ry="12" fill="#D4631A" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="40" cy="36" r="22" fill="#D4631A" stroke="#2A2820" strokeWidth="1.2"/>
    <polygon points="22,22 10,6 28,20" fill="#D4631A" stroke="#2A2820" strokeWidth="1.2" strokeLinejoin="round"/>
    <polygon points="23.5,20 13,8 27,19" fill="#F5A050"/>
    <polygon points="58,22 70,6 52,20" fill="#D4631A" stroke="#2A2820" strokeWidth="1.2" strokeLinejoin="round"/>
    <polygon points="56.5,20 67,8 53,19" fill="#F5A050"/>
    <ellipse cx="40" cy="40" rx="14" ry="12" fill="#F5E8D8"/>
    <circle cx="33" cy="32" r="5" fill="#F5C050"/>
    <circle cx="47" cy="32" r="5" fill="#F5C050"/>
    <circle cx="33" cy="32" r="3" fill="#2A2820"/>
    <circle cx="47" cy="32" r="3" fill="#2A2820"/>
    <circle cx="34" cy="31" r="1" fill="white"/>
    <circle cx="48" cy="31" r="1" fill="white"/>
    <ellipse cx="40" cy="43" rx="3" ry="2" fill="#2A2820"/>
    <path d="M36 46 Q40 50 44 46" stroke="#2A2820" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <line x1="20" y1="42" x2="35" y2="44" stroke="#2A2820" strokeWidth="0.7"/>
    <line x1="20" y1="45.5" x2="35" y2="45.5" stroke="#2A2820" strokeWidth="0.7"/>
    <line x1="45" y1="44" x2="60" y2="42" stroke="#2A2820" strokeWidth="0.7"/>
    <line x1="45" y1="45.5" x2="60" y2="45.5" stroke="#2A2820" strokeWidth="0.7"/>
    <path d="M26 60 Q32 64 40 65 Q48 64 54 60" stroke="#D4631A" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
)

const CloudBunny = ({ className }: SVGProps) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="58" rx="30" ry="14" fill="#D6E8F5" stroke="#2A2820" strokeWidth="1"/>
    <circle cx="22" cy="55" r="9" fill="#D6E8F5" stroke="#2A2820" strokeWidth="1"/>
    <circle cx="58" cy="55" r="9" fill="#D6E8F5" stroke="#2A2820" strokeWidth="1"/>
    <circle cx="35" cy="52" r="11" fill="#D6E8F5" stroke="#2A2820" strokeWidth="1"/>
    <circle cx="45" cy="52" r="11" fill="#D6E8F5" stroke="#2A2820" strokeWidth="1"/>
    <ellipse cx="40" cy="36" rx="16" ry="20" fill="#FAFAFA" stroke="#2A2820" strokeWidth="1.2"/>
    <ellipse cx="31" cy="16" rx="5" ry="12" fill="#FAFAFA" stroke="#2A2820" strokeWidth="1.1"/>
    <ellipse cx="31" cy="16" rx="3" ry="9" fill="#F5C2C7"/>
    <ellipse cx="49" cy="16" rx="5" ry="12" fill="#FAFAFA" stroke="#2A2820" strokeWidth="1.1"/>
    <ellipse cx="49" cy="16" rx="3" ry="9" fill="#F5C2C7"/>
    <circle cx="34" cy="34" r="3" fill="#2A2820"/>
    <circle cx="46" cy="34" r="3" fill="#2A2820"/>
    <circle cx="35" cy="33" r="1" fill="white"/>
    <circle cx="47" cy="33" r="1" fill="white"/>
    <ellipse cx="40" cy="39" rx="2" ry="1.5" fill="#F5A0A0"/>
    <path d="M37 41 Q40 44 43 41" stroke="#2A2820" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <line x1="26" y1="39" x2="36" y2="40" stroke="#2A2820" strokeWidth="0.7"/>
    <line x1="44" y1="40" x2="54" y2="39" stroke="#2A2820" strokeWidth="0.7"/>
  </svg>
)

const BearCub = ({ className }: SVGProps) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="58" rx="18" ry="16" fill="#A06838" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="40" cy="34" r="24" fill="#A06838" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="23" cy="16" r="10" fill="#A06838" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="57" cy="16" r="10" fill="#A06838" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="23" cy="16" r="7" fill="#C87848"/>
    <circle cx="57" cy="16" r="7" fill="#C87848"/>
    <ellipse cx="40" cy="40" rx="14" ry="12" fill="#C8965A"/>
    <circle cx="33" cy="30" r="4.5" fill="#2A2820"/>
    <circle cx="47" cy="30" r="4.5" fill="#2A2820"/>
    <circle cx="34.2" cy="28.8" r="1.5" fill="white"/>
    <circle cx="48.2" cy="28.8" r="1.5" fill="white"/>
    <ellipse cx="40" cy="38" rx="5" ry="4" fill="#2A2820"/>
    <ellipse cx="40" cy="37" rx="3.5" ry="2.5" fill="#C87848"/>
    <ellipse cx="40" cy="38.5" rx="1.8" ry="1.2" fill="#2A2820"/>
    <path d="M36 42 Q40 46 44 42" stroke="#2A2820" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
  </svg>
)

const MoonCat = ({ className }: SVGProps) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 15 Q50 10 38 14 Q22 20 18 36 Q14 52 24 62 Q34 72 52 68 Q68 64 72 50 Q76 36 66 22 Q64 19 60 15Z" fill="#1A1A3E" stroke="#2A2820" strokeWidth="1.2"/>
    <path d="M54 12 Q48 22 54 32 Q62 28 64 18 Q60 10 54 12Z" fill="#F0D060" stroke="#2A2820" strokeWidth="1"/>
    <circle cx="38" cy="38" r="16" fill="#2E2E5A" stroke="#2A2820" strokeWidth="1"/>
    <polygon points="28,26 24,14 34,24" fill="#1A1A3E" stroke="#2A2820" strokeWidth="1" strokeLinejoin="round"/>
    <polygon points="48,26 52,14 42,24" fill="#1A1A3E" stroke="#2A2820" strokeWidth="1" strokeLinejoin="round"/>
    <circle cx="33" cy="37" r="4" fill="#F0D060"/>
    <circle cx="43" cy="37" r="4" fill="#F0D060"/>
    <circle cx="33" cy="37" r="2.5" fill="#2A2820"/>
    <circle cx="43" cy="37" r="2.5" fill="#2A2820"/>
    <circle cx="33.8" cy="36.2" r="0.9" fill="white"/>
    <circle cx="43.8" cy="36.2" r="0.9" fill="white"/>
    <ellipse cx="38" cy="43" rx="2" ry="1.5" fill="#F5A0A0"/>
    <line x1="24" y1="41" x2="34" y2="43" stroke="#8080B0" strokeWidth="0.7"/>
    <line x1="24" y1="44" x2="34" y2="44" stroke="#8080B0" strokeWidth="0.7"/>
    <line x1="42" y1="43" x2="52" y2="41" stroke="#8080B0" strokeWidth="0.7"/>
    <line x1="42" y1="44" x2="52" y2="44" stroke="#8080B0" strokeWidth="0.7"/>
    <circle cx="56" cy="54" r="4" fill="#F0D060" opacity="0.6"/>
    <circle cx="18" cy="24" r="2.5" fill="#F0D060" opacity="0.4"/>
  </svg>
)

const LuckyFrog = ({ className }: SVGProps) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="52" rx="22" ry="20" fill="#4A8C5C" stroke="#2A2820" strokeWidth="1.2"/>
    <ellipse cx="40" cy="48" rx="22" ry="20" fill="#4A8C5C" stroke="#2A2820" strokeWidth="1.2"/>
    <ellipse cx="40" cy="50" rx="16" ry="12" fill="#7AB88A"/>
    <circle cx="26" cy="30" r="10" fill="#4A8C5C" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="54" cy="30" r="10" fill="#4A8C5C" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="26" cy="30" r="7" fill="#5AAA6A"/>
    <circle cx="54" cy="30" r="7" fill="#5AAA6A"/>
    <circle cx="26" cy="30" r="4.5" fill="#2A2820"/>
    <circle cx="54" cy="30" r="4.5" fill="#2A2820"/>
    <circle cx="27.2" cy="28.8" r="1.5" fill="white"/>
    <circle cx="55.2" cy="28.8" r="1.5" fill="white"/>
    <path d="M30 48 Q40 54 50 48" stroke="#2A2820" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <circle cx="40" cy="62" r="10" fill="#F0C040" stroke="#2A2820" strokeWidth="1.2"/>
    <text x="40" y="66" textAnchor="middle" fill="#2A2820" fontSize="8" fontFamily="serif">元</text>
    <path d="M14 52 Q8 60 10 68 Q18 60 22 54Z" fill="#4A8C5C" stroke="#2A2820" strokeWidth="1"/>
    <path d="M66 52 Q72 60 70 68 Q62 60 58 54Z" fill="#4A8C5C" stroke="#2A2820" strokeWidth="1"/>
  </svg>
)

const RedPanda = ({ className }: SVGProps) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="56" rx="16" ry="14" fill="#C0522A" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="40" cy="34" r="22" fill="#C0522A" stroke="#2A2820" strokeWidth="1.2"/>
    <polygon points="24,18 18,4 30,16" fill="#C0522A" stroke="#2A2820" strokeWidth="1.1" strokeLinejoin="round"/>
    <polygon points="25,16 21,7 29,15" fill="#E8703A"/>
    <polygon points="56,18 62,4 50,16" fill="#C0522A" stroke="#2A2820" strokeWidth="1.1" strokeLinejoin="round"/>
    <polygon points="55,16 59,7 51,15" fill="#E8703A"/>
    <ellipse cx="28" cy="36" rx="10" ry="9" fill="#F0E8D8"/>
    <ellipse cx="52" cy="36" rx="10" ry="9" fill="#F0E8D8"/>
    <ellipse cx="40" cy="38" rx="8" ry="6" fill="#F0E8D8"/>
    <ellipse cx="28" cy="36" rx="6" ry="5.5" fill="#3A2218"/>
    <ellipse cx="52" cy="36" rx="6" ry="5.5" fill="#3A2218"/>
    <circle cx="28" cy="35" r="4" fill="#2A2820"/>
    <circle cx="52" cy="35" r="4" fill="#2A2820"/>
    <circle cx="29.2" cy="33.8" r="1.4" fill="white"/>
    <circle cx="53.2" cy="33.8" r="1.4" fill="white"/>
    <ellipse cx="40" cy="42" rx="2.5" ry="2" fill="#2A2820"/>
    <path d="M36.5 44.5 Q40 48 43.5 44.5" stroke="#2A2820" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <line x1="22" y1="42" x2="35" y2="43" stroke="#2A2820" strokeWidth="0.7"/>
    <line x1="22" y1="45" x2="35" y2="44.5" stroke="#2A2820" strokeWidth="0.7"/>
    <line x1="45" y1="43" x2="58" y2="42" stroke="#2A2820" strokeWidth="0.7"/>
    <line x1="45" y1="44.5" x2="58" y2="45" stroke="#2A2820" strokeWidth="0.7"/>
    <path d="M24 60 Q32 66 40 67 Q48 66 56 60" stroke="#C0522A" strokeWidth="8" fill="none" strokeLinecap="round"/>
    <path d="M24 60 Q32 66 40 67 Q48 66 56 60" stroke="#3A2218" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="4 4"/>
  </svg>
)

const Tanuki = ({ className }: SVGProps) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="58" rx="17" ry="14" fill="#8A6040" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="40" cy="34" r="22" fill="#8A6040" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="24" cy="18" r="10" fill="#8A6040" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="56" cy="18" r="10" fill="#8A6040" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="24" cy="18" r="7" fill="#A07858"/>
    <circle cx="56" cy="18" r="7" fill="#A07858"/>
    <path d="M28 8 Q40 2 52 8 Q48 14 40 14 Q32 14 28 8Z" fill="#5A8A3A" stroke="#2A2820" strokeWidth="1"/>
    <ellipse cx="33" cy="38" rx="9" ry="8" fill="#E8D8C0"/>
    <ellipse cx="47" cy="38" rx="9" ry="8" fill="#E8D8C0"/>
    <ellipse cx="40" cy="40" rx="7" ry="6" fill="#E8D8C0"/>
    <ellipse cx="33" cy="38" rx="5.5" ry="5" fill="#5A3A20"/>
    <ellipse cx="47" cy="38" rx="5.5" ry="5" fill="#5A3A20"/>
    <circle cx="33" cy="37" r="4" fill="#2A2820"/>
    <circle cx="47" cy="37" r="4" fill="#2A2820"/>
    <circle cx="34.2" cy="35.8" r="1.3" fill="white"/>
    <circle cx="48.2" cy="35.8" r="1.3" fill="white"/>
    <ellipse cx="40" cy="43" rx="3" ry="2.5" fill="#2A2820"/>
    <ellipse cx="40" cy="42.5" rx="2" ry="1.5" fill="#C87858"/>
    <path d="M36 46 Q40 50 44 46" stroke="#2A2820" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <ellipse cx="40" cy="54" rx="8" ry="5" fill="#C8A878" stroke="#2A2820" strokeWidth="1"/>
  </svg>
)

const StarBird = ({ className }: SVGProps) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="46" rx="20" ry="22" fill="#5A9AAA" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="40" cy="30" r="18" fill="#5A9AAA" stroke="#2A2820" strokeWidth="1.2"/>
    <ellipse cx="40" cy="40" rx="14" ry="12" fill="#7ABAC8"/>
    <path d="M58 38 Q68 32 72 24 Q64 28 62 36Z" fill="#5A9AAA" stroke="#2A2820" strokeWidth="1"/>
    <path d="M62 48 Q72 52 76 60 Q66 54 62 46Z" fill="#5A9AAA" stroke="#2A2820" strokeWidth="1"/>
    <path d="M22 60 Q16 70 20 76 Q26 66 28 58Z" fill="#5A9AAA" stroke="#2A2820" strokeWidth="1"/>
    <path d="M58 60 Q64 70 60 76 Q54 66 52 58Z" fill="#5A9AAA" stroke="#2A2820" strokeWidth="1"/>
    <circle cx="35" cy="28" r="5" fill="#2A2820"/>
    <circle cx="36.5" cy="26.8" r="1.8" fill="white"/>
    <path d="M44 26 Q50 24 54 28" stroke="#F0C040" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <polygon points="40,8 41.5,13 47,13 42.5,16.5 44,22 40,18.5 36,22 37.5,16.5 33,13 38.5,13" fill="#F0C040" stroke="#2A2820" strokeWidth="0.8"/>
    <path d="M33 50 Q40 56 47 50" stroke="#2A2820" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <circle cx="20" cy="30" r="3" fill="#F0C040" opacity="0.5"/>
    <circle cx="65" cy="40" r="2" fill="#F0C040" opacity="0.4"/>
  </svg>
)

const DefaultCharm = ({ className }: SVGProps) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="32" fill="#E8E7DF" stroke="#2A2820" strokeWidth="1.2"/>
    <circle cx="40" cy="40" r="16" fill="#C8906A" opacity="0.4"/>
    <circle cx="40" cy="40" r="6" fill="#C8906A"/>
  </svg>
)

const ART_MAP: Record<string, (props: SVGProps) => React.ReactElement> = {
  'maneki-neko': ManekiNeko,
  'evil-eye': EvilEye,
  'hamsa': Hamsa,
  'koi-fish': KoiFish,
  'fox-spirit': FoxSpirit,
  'cloud-bunny': CloudBunny,
  'bear-cub': BearCub,
  'moon-cat': MoonCat,
  'lucky-frog': LuckyFrog,
  'red-panda': RedPanda,
  'tanuki': Tanuki,
  'star-bird': StarBird,
}

export function CharmArt({ id, className }: { id: string; className?: string }) {
  const Component = ART_MAP[id] ?? DefaultCharm
  return <Component className={className} />
}
