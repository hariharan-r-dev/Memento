import React, { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  rotSpeed: number;
  shape: 'star' | 'circle' | 'diamond';
  birthTime: number;
  lifeMs: number;
}

interface SparklesProps {
  origin: { x: number; y: number };
  active: boolean;
  onComplete?: () => void;
}

const GOLD_PALETTE = ['#FFF275', '#FFD166', '#FFB703', '#FFFFFF', '#F4A261', '#E76F51'];

export const Sparkles: React.FC<SparklesProps> = ({ origin, active, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const wasActiveRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // When active transitions from false -> true, burst new particles
    if (active && !wasActiveRef.current) {
      wasActiveRef.current = true;

      const now = performance.now();
      const newParticles: Particle[] = Array.from({ length: 24 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.4;
        const speed = 50 + Math.random() * 110;
        return {
          id: i,
          x: origin.x,
          y: origin.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 15,
          size: 4 + Math.random() * 6,
          color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
          opacity: 1.0,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 360,
          shape: Math.random() > 0.4 ? 'star' : Math.random() > 0.5 ? 'diamond' : 'circle',
          birthTime: now,
          lifeMs: 1200 + Math.random() * 400, // 1.2s - 1.6s lifetime
        };
      });

      setParticles(newParticles);
    } else if (!active && wasActiveRef.current) {
      wasActiveRef.current = false;
      setParticles([]);
      if (onCompleteRef.current) onCompleteRef.current();
    }
  }, [active, origin.x, origin.y]);

  // Particle animation & deterministic lifetime cleanup loop
  useEffect(() => {
    if (particles.length === 0) return;

    let animationId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.04, (now - lastTime) / 1000);
      lastTime = now;

      setParticles((prev) => {
        if (prev.length === 0) return prev;

        const updated: Particle[] = [];
        for (const p of prev) {
          const age = now - p.birthTime;
          if (age >= p.lifeMs) {
            continue; // particle has expired, do not retain
          }

          const progress = Math.min(1.0, age / p.lifeMs);
          const rawOpacity = 1 - Math.pow(progress, 1.5);
          const safeOpacity = Number.isFinite(rawOpacity) ? Math.max(0, Math.min(1, rawOpacity)) : 0;

          if (safeOpacity <= 0.01) {
            continue; // fade out expired
          }

          updated.push({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt + 35 * dt * dt, // gentle downward gravity drift
            vx: p.vx * 0.95,
            vy: p.vy * 0.95,
            rotation: p.rotation + p.rotSpeed * dt,
            opacity: safeOpacity,
          });
        }

        if (updated.length === 0 && onCompleteRef.current) {
          onCompleteRef.current();
        }

        return updated;
      });

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [particles.length > 0]); // only runs while particles exist

  if (particles.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-visible">
      {particles.map((p) => {
        if (p.opacity <= 0.01) return null;
        return (
          <g
            key={p.id}
            transform={`translate(${p.x}, ${p.y}) rotate(${p.rotation})`}
            opacity={p.opacity}
          >
            {p.shape === 'star' ? (
              <path
                d={`M 0 ${-p.size} Q 0 0 ${p.size} 0 Q 0 0 0 ${p.size} Q 0 0 ${-p.size} 0 Q 0 0 0 ${-p.size}`}
                fill={p.color}
                filter="drop-shadow(0 0 4px rgba(255,215,0,0.8))"
              />
            ) : p.shape === 'diamond' ? (
              <polygon
                points={`0,${-p.size * 0.8} ${p.size * 0.6},0 0,${p.size * 0.8} ${-p.size * 0.6},0`}
                fill={p.color}
                filter="drop-shadow(0 0 3px rgba(255,215,0,0.6))"
              />
            ) : (
              <circle
                cx="0"
                cy="0"
                r={p.size * 0.5}
                fill={p.color}
                filter="drop-shadow(0 0 3px rgba(255,255,255,0.8))"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};
