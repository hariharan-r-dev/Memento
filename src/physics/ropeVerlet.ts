import { vec, sub, scale, clamp } from './vectors';
import type { Vec2 } from './vectors';

export interface RopePoint {
  pos: Vec2;
  prevPos: Vec2;
  mass: number;
  invMass: number;
  pinned: boolean;
}

export interface RopeConfig {
  numSegments: number;
  totalLength: number;
  stiffness: number; // Distance constraint stiffness (0.9..1.0)
  damping: number; // Air resistance damping (0.96..0.99)
  gravity: number; // Pixels / sec^2
  iterations: number; // Relaxation solver iterations
}

export const DEFAULT_ROPE_CONFIG: RopeConfig = {
  numSegments: 10,
  totalLength: 135,
  stiffness: 0.96,
  damping: 0.982,
  gravity: 980,
  iterations: 14,
};

export interface CharmPhysicsState {
  pos: Vec2;
  vel: Vec2;
  angle: number; // Radians (0 = vertical hanging straight down)
  angularVel: number; // Radians / sec
  isGrabbed: boolean;
  isSettled: boolean;
  settledTimer: number;
  pawWavePhase: number;
  bellJingle: number;
}

export class RopeSimulation {
  points: RopePoint[] = [];
  config: RopeConfig;
  segmentLength: number;
  anchor: Vec2;
  grabOffset: Vec2 = vec(0, 0);
  targetGrabPos: Vec2 = vec(0, 0);
  isGrabbed: boolean = false;
  isSettled: boolean = true;
  settledTimer: number = 2.0;
  lastHoverTime: number = 0;
  lastBodyHoverTime: number = 0;

  // Charm bob rotation state
  charmAngle: number = 0;
  charmAngularVel: number = 0;
  bellJingle: number = 0;

  constructor(anchor: Vec2, config: Partial<RopeConfig> = {}) {
    this.config = { ...DEFAULT_ROPE_CONFIG, ...config };
    this.anchor = { ...anchor };
    this.segmentLength = this.config.totalLength / this.config.numSegments;
    this.reset(anchor);
  }

  reset(anchor: Vec2) {
    this.anchor = { ...anchor };
    this.points = [];
    this.segmentLength = this.config.totalLength / this.config.numSegments;

    const numPoints = this.config.numSegments + 1;
    for (let i = 0; i < numPoints; i++) {
      const p = vec(anchor.x, anchor.y + i * this.segmentLength);
      const isAnchor = i === 0;
      const isBob = i === numPoints - 1;

      // Interior particles have balanced mass (0.22) for smooth wave propagation; charm bob at bottom has substantial mass (1.5)
      const mass = isAnchor ? 0 : isBob ? 1.5 : 0.22;
      const invMass = isAnchor ? 0 : 1.0 / mass;

      this.points.push({
        pos: { ...p },
        prevPos: { ...p },
        mass,
        invMass,
        pinned: isAnchor,
      });
    }

    this.isGrabbed = false;
    this.isSettled = true;
    this.settledTimer = 1.0;
    this.charmAngle = 0;
    this.charmAngularVel = 0;
    this.bellJingle = 0;
  }

  setAnchor(anchor: Vec2) {
    this.anchor = { ...anchor };
    if (this.points.length > 0) {
      this.points[0].pos = { ...anchor };
      this.points[0].prevPos = { ...anchor };
    }
    if (this.isSettled) {
      this.snapToVertical();
    }
  }

  setLength(newLength: number) {
    this.config.totalLength = Math.max(60, newLength);
    this.segmentLength = this.config.totalLength / this.config.numSegments;
    if (this.isSettled) {
      this.snapToVertical();
    }
  }

  updateConfig(cfg: Partial<RopeConfig>) {
    this.config = { ...this.config, ...cfg };
    if (cfg.totalLength !== undefined) {
      this.setLength(cfg.totalLength);
    }
  }

  grab(cursorPos: Vec2) {
    this.isGrabbed = true;
    this.isSettled = false;
    this.settledTimer = 0;

    const endPoint = this.getEndPosition();
    this.grabOffset = sub(cursorPos, endPoint);
    this.targetGrabPos = { ...endPoint };
  }

  drag(cursorPos: Vec2) {
    if (!this.isGrabbed) return;

    // Direct mouse kinematic authority with preserved grab offset
    const desiredPos = sub(cursorPos, this.grabOffset);

    // Compute displacement from fixed top anchor
    const fromAnchor = sub(desiredPos, this.anchor);
    const dist = Math.hypot(fromAnchor.x, fromAnchor.y);

    // Dynamic drag reach: allow pulling across desktop with natural maximum extension (1.35x total length)
    const L = this.config.totalLength;
    const maxReach = L * 1.35;
    let targetX = desiredPos.x;
    let targetY = desiredPos.y;

    if (dist > maxReach && dist > 0.0001) {
      targetX = this.anchor.x + (fromAnchor.x / dist) * maxReach;
      targetY = this.anchor.y + (fromAnchor.y / dist) * maxReach;
    }

    // Usable screen bounds safety clamping (keep on-screen and above taskbar/dock)
    const screenWidth = typeof window !== 'undefined' ? (window.screen.availWidth || window.innerWidth || 1920) : 1920;
    const screenHeight = typeof window !== 'undefined' ? (window.screen.availHeight || window.innerHeight || 1080) : 1080;
    const marginX = 40;
    const minY = this.anchor.y + 12; // Allow pushing all the way up near top mounting bezel
    const maxY = screenHeight - 65;

    targetX = clamp(targetX, marginX, screenWidth - marginX);
    targetY = clamp(targetY, minY, maxY);

    this.targetGrabPos = vec(targetX, targetY);

    // Direct endpoint control during drag
    const endIdx = this.points.length - 1;
    this.points[endIdx].pos = { ...this.targetGrabPos };
    this.points[endIdx].prevPos = { ...this.targetGrabPos };
    this.isSettled = false;
    this.settledTimer = 0;
  }

  release(releaseVelocity: Vec2) {
    this.isGrabbed = false;
    const endIdx = this.points.length - 1;
    const speed = Math.hypot(releaseVelocity.x, releaseVelocity.y);

    const endPos = this.points[endIdx].pos;
    const restY = this.anchor.y + this.config.totalLength;
    const distFromRest = Math.hypot(endPos.x - this.anchor.x, endPos.y - restY);

    // If released at or near original vertical position with near-zero velocity, freeze to rest immediately
    if (speed < 35 && distFromRest < 8.0) {
      this.rest();
      return;
    }

    this.isSettled = false;
    this.settledTimer = 0;

    // Transfer mouse release velocity into rope endpoint momentum
    const dt = 1 / 120;
    const cappedVel = scale(
      releaseVelocity,
      Math.min(1.0, 1200 / Math.max(1, speed)) * 0.9
    );

    this.points[endIdx].prevPos = sub(this.points[endIdx].pos, scale(cappedVel, dt));

    // Propagate momentum to adjacent lower rope segment for natural wave continuity
    if (endIdx > 1) {
      this.points[endIdx - 1].prevPos = sub(
        this.points[endIdx - 1].pos,
        scale(cappedVel, dt * 0.5)
      );
    }

    if (speed > 240) {
      this.bellJingle = 1.0;
    }
  }

  // String hover: applies micro physical wave displacement along inner rope particles (1–3px)
  applyHoverDisturbance(
    prevCursor: Vec2,
    currCursor: Vec2,
    cursorVel: Vec2,
    radius: number = 14
  ): number {
    if (this.isGrabbed) return 0;

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    // Anti-accumulation cooldown: 120ms debounce between successive mousemove events within the same sweep
    if (now - this.lastHoverTime < 120) {
      return 0;
    }

    const lateralSpeed = Math.abs(cursorVel.x);
    const cursorDeltaX = currCursor.x - prevCursor.x;
    const cursorDeltaY = currCursor.y - prevCursor.y;
    const moveDist = Math.hypot(cursorDeltaX, cursorDeltaY);

    // Velocity-gated: only moving cursor crossing/brushing can disturb the rope
    if (lateralSpeed < 20 && moveDist < 1.2) {
      return 0;
    }

    const numPts = this.points.length;
    if (numPts < 2) return 0;

    let bestIntersectionSegment = -1;
    let bestIntersectionT = 0;
    let bestClosestSegment = -1;
    let bestClosestT = 0;
    let minSegmentDist = radius;

    // Line 1: Cursor movement path (C -> D)
    const cx = prevCursor.x;
    const cy = prevCursor.y;
    const dx = currCursor.x;
    const dy = currCursor.y;
    const sx = dx - cx;
    const sy = dy - cy;

    // Check each rope segment (A -> B)
    for (let k = 0; k < numPts - 1; k++) {
      const ax = this.points[k].pos.x;
      const ay = this.points[k].pos.y;
      const bx = this.points[k + 1].pos.x;
      const by = this.points[k + 1].pos.y;
      const rx = bx - ax;
      const ry = by - ay;

      // 1. Line segment intersection test (C->D with A->B)
      const denom = rx * sy - ry * sx;
      if (Math.abs(denom) > 1e-6) {
        const qpx = cx - ax;
        const qpy = cy - ay;
        const t = (qpx * sy - qpy * sx) / denom;
        const u = (qpx * ry - qpy * rx) / denom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
          bestIntersectionSegment = k;
          bestIntersectionT = t;
          break; // Direct line crossing found
        }
      }

      // 2. Point-to-segment projection from current cursor (D) to segment (A->B)
      const segLenSq = rx * rx + ry * ry;
      if (segLenSq > 0.0001) {
        const projT = clamp(((dx - ax) * rx + (dy - ay) * ry) / segLenSq, 0, 1);
        const closeX = ax + projT * rx;
        const closeY = ay + projT * ry;
        const d = Math.hypot(dx - closeX, dy - closeY);
        if (d < minSegmentDist) {
          minSegmentDist = d;
          bestClosestSegment = k;
          bestClosestT = projT;
        }
      }
    }

    const hasIntersection = bestIntersectionSegment !== -1;
    if (!hasIntersection && bestClosestSegment === -1) {
      return 0; // Cursor is outside the interaction zone
    }

    // Determine target continuous index along rope
    const crossingSegment = hasIntersection ? bestIntersectionSegment : bestClosestSegment;
    const crossingT = hasIntersection ? bestIntersectionT : bestClosestT;
    const floatIndex = crossingSegment + crossingT;

    // Directional impulse following cursor sweep direction
    const sweepDir = Math.sign(cursorDeltaX) || Math.sign(cursorVel.x) || 1;

    // Lateral direction weighting: suppresses disturbance when cursor moves parallel to rope
    const lateralRatio = Math.abs(cursorDeltaX) / Math.max(1, moveDist);
    const directionFactor = hasIntersection ? 1.0 : clamp(lateralRatio * 1.5, 0.1, 1.0);

    // Micro-impulse magnitude: normal crossing (~200-600px/s) -> ~1.2-2.4px, fast crossing (~1500px/s) -> max 3.5px
    const proximity = hasIntersection ? 1.0 : Math.pow(1 - minSegmentDist / radius, 1.8);
    const baseMagnitude = clamp(lateralSpeed * 0.002 + 0.8, 0.9, 3.5) * proximity * directionFactor;
    const totalImpulse = sweepDir * baseMagnitude;

    // Localized Gaussian distribution across particles (sigma = 0.8)
    for (let j = 1; j < numPts; j++) {
      const distFromCenter = Math.abs(j - floatIndex);
      const weight = Math.exp(-(distFromCenter * distFromCenter) / 1.28);
      if (weight > 0.02) {
        const pDisp = totalImpulse * weight;
        this.points[j].pos.x += pDisp;
        this.points[j].prevPos.x += pDisp * 0.2;
      }
    }

    this.lastHoverTime = now;
    this.isSettled = false;
    this.settledTimer = 0;

    return Math.abs(totalImpulse);
  }

  // Charm body hover: micro physical reaction (~0.5–1.0px max displacement)
  applyBodyHoverDisturbance(
    _prevCursor: Vec2,
    currCursor: Vec2,
    cursorVel: Vec2
  ): number {
    if (this.isGrabbed) return 0;

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - this.lastBodyHoverTime < 140) {
      return 0;
    }

    const lateralSpeed = Math.abs(cursorVel.x);
    if (lateralSpeed < 25) return 0;

    const endIdx = this.points.length - 1;
    const endPt = this.points[endIdx];
    const distToCharm = Math.hypot(
      currCursor.x - endPt.pos.x,
      currCursor.y - (endPt.pos.y + 35)
    );

    const bodyRadius = 45;
    if (distToCharm > bodyRadius) return 0;

    const proximity = 1 - distToCharm / bodyRadius;
    const sweepDir = Math.sign(cursorVel.x) || 1;

    // Micro displacement: max ~0.8px
    const displacement =
      sweepDir *
      clamp(lateralSpeed * 0.0008 + 0.3, 0.3, 0.8) *
      proximity;

    endPt.pos.x += displacement;
    endPt.prevPos.x += displacement * 0.2;
    if (endIdx > 1) {
      this.points[endIdx - 1].pos.x += displacement * 0.3;
      this.points[endIdx - 1].prevPos.x += displacement * 0.06;
    }

    // Smooth rotational nudge
    this.charmAngularVel += sweepDir * clamp(lateralSpeed * 0.0001 + 0.005, 0.005, 0.02) * proximity;

    this.lastBodyHoverTime = now;
    this.isSettled = false;
    this.settledTimer = 0;

    return Math.abs(displacement);
  }

  applyImpulse(impulse: Vec2, _angularImpulse: number = 0) {
    this.isSettled = false;
    this.settledTimer = 0;
    this.bellJingle = 1.0;

    const endIdx = this.points.length - 1;
    const dt = 1 / 120;

    this.points[endIdx].prevPos = sub(this.points[endIdx].pos, scale(impulse, dt));
    if (endIdx > 1) {
      this.points[endIdx - 1].prevPos = sub(
        this.points[endIdx - 1].pos,
        scale(impulse, dt * 0.65)
      );
    }
    if (endIdx > 2) {
      this.points[endIdx - 2].prevPos = sub(
        this.points[endIdx - 2].pos,
        scale(impulse, dt * 0.35)
      );
    }
  }

  step(dt: number) {
    this.bellJingle = Math.max(0, this.bellJingle - dt * 2.5);

    // Fast static rest short-circuit (0 computation when at rest)
    if (this.isSettled && !this.isGrabbed) {
      this.snapToVertical();
      return;
    }

    const numPoints = this.points.length;
    const endIdx = numPoints - 1;

    // Calculate current maximum speed for progressive tail damping
    let curMaxSpeed = 0;
    for (let i = 1; i < numPoints; i++) {
      const pt = this.points[i];
      const spd = Math.hypot(pt.pos.x - pt.prevPos.x, pt.pos.y - pt.prevPos.y) / dt;
      if (spd > curMaxSpeed) curMaxSpeed = spd;
    }

    // Natural air damping, plus gentle progressive decay when motion is already small (< 18px/s)
    let dampingFactor = this.config.damping;
    if (curMaxSpeed < 18.0) {
      const lowSpeedDecay = 1.0 - ((18.0 - curMaxSpeed) / 18.0) * 0.04;
      dampingFactor *= lowSpeedDecay;
    }

    const damping = Math.pow(dampingFactor, dt * 60);
    const gravityAccel = vec(0, this.config.gravity);

    // 1. Verlet integration for all free particles
    for (let i = 1; i < numPoints; i++) {
      const pt = this.points[i];
      if (pt.pinned) continue;

      if (i === endIdx && this.isGrabbed) {
        pt.pos = { ...this.targetGrabPos };
        pt.prevPos = { ...this.targetGrabPos };
        continue;
      }

      // Verlet position integration with air damping
      const vx = (pt.pos.x - pt.prevPos.x) * damping;
      const vy = (pt.pos.y - pt.prevPos.y) * damping;
      const ax = gravityAccel.x * (dt * dt);
      const ay = gravityAccel.y * (dt * dt);

      const nextX = pt.pos.x + vx + ax;
      const nextY = pt.pos.y + vy + ay;

      pt.prevPos.x = pt.pos.x;
      pt.prevPos.y = pt.pos.y;
      pt.pos.x = nextX;
      pt.pos.y = nextY;
    }

    // Screen bounds safety clamping for free particles (prevent escaping visible desktop)
    const screenWidth = typeof window !== 'undefined' ? (window.screen.availWidth || window.innerWidth || 1920) : 1920;
    const screenHeight = typeof window !== 'undefined' ? (window.screen.availHeight || window.innerHeight || 1080) : 1080;
    for (let i = 1; i < numPoints; i++) {
      const pt = this.points[i];
      if (!pt.pinned && !(i === endIdx && this.isGrabbed)) {
        pt.pos.x = clamp(pt.pos.x, 20, screenWidth - 20);
        pt.pos.y = clamp(pt.pos.y, 0, screenHeight - 30);
      }
    }

    // 2. Iterative Distance Constraint Relaxation (Gauss-Seidel)
    const iterations = this.config.iterations;
    const stiffness = this.config.stiffness;
    const segLen = this.segmentLength;

    for (let iter = 0; iter < iterations; iter++) {
      // Top anchor is strictly fixed
      this.points[0].pos = { ...this.anchor };

      // Dragged endpoint is held strictly at pointer target
      if (this.isGrabbed) {
        this.points[endIdx].pos = { ...this.targetGrabPos };
      }

      // Relax segment distance constraints
      for (let i = 0; i < numPoints - 1; i++) {
        const pA = this.points[i];
        const pB = this.points[i + 1];

        const dx = pB.pos.x - pA.pos.x;
        const dy = pB.pos.y - pA.pos.y;
        const currentDist = Math.hypot(dx, dy);

        if (currentDist < 0.0001) continue;

        const delta = (currentDist - segLen) / currentDist;
        const wA = pA.invMass;
        const wB = (i + 1 === endIdx && this.isGrabbed) ? 0 : pB.invMass;
        const totalW = wA + wB;

        if (totalW > 0) {
          const ratioA = (wA / totalW) * delta * stiffness;
          const ratioB = (wB / totalW) * delta * stiffness;

          if (!pA.pinned) {
            pA.pos.x += dx * ratioA;
            pA.pos.y += dy * ratioA;
          }
          if (!pB.pinned && !(i + 1 === endIdx && this.isGrabbed)) {
            pB.pos.x -= dx * ratioB;
            pB.pos.y -= dy * ratioB;
          }
        }
      }
    }

    // Gentle curvature smoothing across interior segments (applied once per step for flexible catenary)
    for (let i = 1; i < numPoints - 1; i++) {
      const pPrev = this.points[i - 1];
      const pCurr = this.points[i];
      const pNext = this.points[i + 1];

      if (!pCurr.pinned && !(i === endIdx && this.isGrabbed)) {
        const midX = (pPrev.pos.x + pNext.pos.x) * 0.5;
        const midY = (pPrev.pos.y + pNext.pos.y) * 0.5;
        pCurr.pos.x += (midX - pCurr.pos.x) * 0.04;
        pCurr.pos.y += (midY - pCurr.pos.y) * 0.04;
      }
    }

    // 3. Smooth Charm Rotational Dynamics (Follows lower rope tangent smoothly with controlled rotation)
    const pBase = endIdx >= 2 ? this.points[endIdx - 2] : this.points[endIdx - 1];
    const pEnd = this.points[endIdx];
    const chordDx = pEnd.pos.x - pBase.pos.x;
    const chordDy = pEnd.pos.y - pBase.pos.y;

    // When hanging down naturally, chordDy > 0. When pushed upward, chordDy <= 0, charm hangs down (angle -> 0).
    let targetAngle = 0;
    if (chordDy > 2.0) {
      targetAngle = Math.atan2(chordDx, chordDy);
    } else {
      targetAngle = Math.atan2(chordDx, Math.max(10.0, chordDy + 15.0)) * 0.4;
    }

    // Clamp rotation angle to a natural, visually controlled range (±32 degrees / ±0.558 radians)
    const MAX_ROTATION = 0.558;
    targetAngle = clamp(targetAngle, -MAX_ROTATION, MAX_ROTATION);

    const angleDiff = targetAngle - this.charmAngle;

    // Critically damped tangent tracking (zero secondary rotation vibration)
    const followRate = 18.0;
    this.charmAngle += angleDiff * Math.min(1.0, followRate * dt);
    this.charmAngularVel = angleDiff * followRate;

    if (Math.abs(this.charmAngle) < 0.002 && Math.abs(angleDiff) < 0.002) {
      this.charmAngle = 0;
      this.charmAngularVel = 0;
    }

    // 4. Settling & Snap-to-Rest Detection
    // Once velocity, displacement, and angular deviation decay below visual threshold, lock to rest
    if (!this.isGrabbed) {
      let maxSpeed = 0;
      let maxDevX = 0;
      const restY = this.anchor.y + this.config.totalLength;
      const endDevY = Math.abs(this.points[endIdx].pos.y - restY);

      for (let i = 1; i < numPoints; i++) {
        const pt = this.points[i];
        const spd = Math.hypot(pt.pos.x - pt.prevPos.x, pt.pos.y - pt.prevPos.y) / dt;
        const devX = Math.abs(pt.pos.x - this.anchor.x);
        if (spd > maxSpeed) maxSpeed = spd;
        if (devX > maxDevX) maxDevX = devX;
      }

      if (maxSpeed < 4.0 && maxDevX < 2.0 && endDevY < 3.0 && Math.abs(this.charmAngle) < 0.03) {
        this.settledTimer += dt;
        if (this.settledTimer > 0.08) {
          this.rest();
        }
      } else {
        this.settledTimer = 0;
      }
    }
  }

  snapToVertical() {
    const numPoints = this.points.length;
    for (let i = 0; i < numPoints; i++) {
      const y = this.anchor.y + i * this.segmentLength;
      this.points[i].pos.x = this.anchor.x;
      this.points[i].pos.y = y;
      this.points[i].prevPos.x = this.anchor.x;
      this.points[i].prevPos.y = y;
    }
    this.charmAngle = 0;
    this.charmAngularVel = 0;
  }

  rest() {
    this.isSettled = true;
    this.settledTimer = 1.0;
    this.snapToVertical();
    this.bellJingle = 0;
  }

  getEndPosition(): Vec2 {
    return this.points[this.points.length - 1].pos;
  }

  getEndVelocity(): Vec2 {
    const endPt = this.points[this.points.length - 1];
    return scale(sub(endPt.pos, endPt.prevPos), 120);
  }

  getCharmState(): CharmPhysicsState {
    const endPt = this.points[this.points.length - 1];
    return {
      pos: { ...endPt.pos },
      vel: this.getEndVelocity(),
      angle: this.charmAngle,
      angularVel: this.charmAngularVel,
      isGrabbed: this.isGrabbed,
      isSettled: this.isSettled,
      settledTimer: this.settledTimer,
      pawWavePhase: 0,
      bellJingle: this.bellJingle,
    };
  }

  getPoints(): Vec2[] {
    return this.points.map((p) => p.pos);
  }

  // Smooth Catmull-Rom to Cubic Bézier SVG path string
  getSvgPath(): string {
    const pts = this.points;
    if (pts.length < 2) return '';

    let d = `M ${pts[0].pos.x.toFixed(1)} ${pts[0].pos.y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1].pos : pts[i].pos;
      const p1 = pts[i].pos;
      const p2 = pts[i + 1].pos;
      const p3 = i < pts.length - 2 ? pts[i + 2].pos : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    return d;
  }
}
