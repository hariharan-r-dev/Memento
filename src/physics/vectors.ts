export interface Vec2 {
  x: number;
  y: number;
}

export const vec = (x: number, y: number): Vec2 => ({ x, y });

export const add = (a: Vec2, b: Vec2): Vec2 => ({
  x: a.x + b.x,
  y: a.y + b.y,
});

export const sub = (a: Vec2, b: Vec2): Vec2 => ({
  x: a.x - b.x,
  y: a.y - b.y,
});

export const scale = (v: Vec2, s: number): Vec2 => ({
  x: v.x * s,
  y: v.y * s,
});

export const len = (v: Vec2): number => Math.hypot(v.x, v.y);

export const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.y - b.y);

export const normalize = (v: Vec2): Vec2 => {
  const l = len(v);
  return l > 0.00001 ? { x: v.x / l, y: v.y / l } : { x: 0, y: 0 };
};

export const dot = (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y;

export const cross = (a: Vec2, b: Vec2): number => a.x * b.y - a.y * b.x;

export const lerp = (a: Vec2, b: Vec2, t: number): Vec2 => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

export const angle = (v: Vec2): number => Math.atan2(v.y, v.x);

export const clamp = (val: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, val));
