import { vec, sub, len } from './vectors';
import type { Vec2 } from './vectors';

export interface CharmPhysicsParams {
  mass: number;
  gravity: number;
  airDamping: number;
  springStiffness: number;
  angularDamping: number;
  tiltCoupling: number;
  restLength: number;
  elasticity: number;
}

export const DEFAULT_CHARM_PHYSICS: CharmPhysicsParams = {
  mass: 1.0,
  gravity: 1050,
  airDamping: 0.95,
  springStiffness: 120,
  angularDamping: 0.945,
  tiltCoupling: 0.0018,
  restLength: 140,
  elasticity: 0.45,
};

export interface CharmState {
  pos: Vec2;
  vel: Vec2;
  angle: number; // radians (0 = vertical down)
  angularVel: number; // radians / sec
  isGrabbed: boolean;
  isSettled: boolean;
  settledTimer: number;
  pawWavePhase: number;
  bellJingle: number; // 0..1 intensity of bell shake
}

export class CharmPhysics {
  state: CharmState;
  params: CharmPhysicsParams;
  anchor: Vec2;
  grabOffset: Vec2 = vec(0, 0);

  constructor(anchor: Vec2, params: Partial<CharmPhysicsParams> = {}) {
    this.params = { ...DEFAULT_CHARM_PHYSICS, ...params };
    this.anchor = { ...anchor };
    this.state = {
      pos: vec(anchor.x, anchor.y + this.params.restLength),
      vel: vec(0, 0),
      angle: 0,
      angularVel: 0,
      isGrabbed: false,
      isSettled: true,
      settledTimer: 5.0,
      pawWavePhase: 0,
      bellJingle: 0,
    };
  }

  setAnchor(anchor: Vec2) {
    this.anchor = { ...anchor };
    if (this.state.isSettled) {
      this.state.pos.x = anchor.x;
      this.state.pos.y = anchor.y + this.params.restLength;
    }
  }

  setRestLength(length: number) {
    this.params.restLength = length;
    if (this.state.isSettled) {
      this.state.pos.y = this.anchor.y + length;
    }
  }

  updateParams(params: Partial<CharmPhysicsParams>) {
    this.params = { ...this.params, ...params };
  }

  grab(cursorPos?: Vec2) {
    this.state.isGrabbed = true;
    this.state.isSettled = false;
    this.state.settledTimer = 0;
    this.state.vel = vec(0, 0);
    this.state.angularVel = 0;
    if (cursorPos) {
      this.grabOffset = sub(cursorPos, this.state.pos);
    } else {
      this.grabOffset = vec(0, 0);
    }
  }

  drag(cursorPos: Vec2, _dt?: number) {
    if (!this.state.isGrabbed) return;

    // Direct mouse kinematic authority with preserved grab offset
    const targetPos = sub(cursorPos, this.grabOffset);
    const dx = targetPos.x - this.anchor.x;
    const dy = targetPos.y - this.anchor.y;

    // Compute target pendulum angle from fixed anchor
    let targetAngle = Math.atan2(dx, Math.max(12, dy));

    // Clamp angle to safe physical bounds (approx ±77 degrees)
    const MAX_DRAG_ANGLE = 1.35;
    targetAngle = Math.max(-MAX_DRAG_ANGLE, Math.min(MAX_DRAG_ANGLE, targetAngle));

    this.state.angle = targetAngle;
    this.state.angularVel = 0;

    // Position along the pendulum arc at rope rest length
    const L = this.params.restLength;
    this.state.pos.x = this.anchor.x + Math.sin(targetAngle) * L;
    this.state.pos.y = this.anchor.y + Math.cos(targetAngle) * L;
    this.state.vel = vec(0, 0);
  }

  release(releaseVelocity: Vec2) {
    this.state.isGrabbed = false;
    const speed = len(releaseVelocity);
    const absAngle = Math.abs(this.state.angle);

    // If brought back near resting position and released without flick velocity, snap to rest immediately
    if (speed < 28 && absAngle < 0.045) {
      this.rest();
      return;
    }

    this.state.isSettled = false;
    this.state.settledTimer = 0;

    // Convert mouse linear release velocity to tangential angular velocity: omega = v_tangential / L
    const L = Math.max(50, this.params.restLength);
    const cosA = Math.cos(this.state.angle);
    const sinA = Math.sin(this.state.angle);
    const tangentialVelocity = releaseVelocity.x * cosA - releaseVelocity.y * sinA;
    let releaseAngularVel = (tangentialVelocity / L) * 0.9;

    // Cap angular velocity to prevent unnatural spinning
    const MAX_ANGULAR_VEL = 12.0;
    releaseAngularVel = Math.max(-MAX_ANGULAR_VEL, Math.min(MAX_ANGULAR_VEL, releaseAngularVel));

    this.state.angularVel = releaseAngularVel;

    // Bell jingle only on strong release
    if (speed > 220) {
      this.state.bellJingle = 1.0;
    }
  }

  applyImpulse(impulse: Vec2, angularImpulse: number = 0) {
    const L = Math.max(50, this.params.restLength);
    const cosA = Math.cos(this.state.angle);
    const sinA = Math.sin(this.state.angle);
    const tangentialImpulse = impulse.x * cosA - impulse.y * sinA;
    
    this.state.angularVel += (tangentialImpulse / L) + angularImpulse;
    this.state.isSettled = false;
    this.state.settledTimer = 0;
    this.state.bellJingle = 1.0;
  }

  applyTorque(torque: number) {
    this.state.angularVel += torque;
    this.state.isSettled = false;
    this.state.settledTimer = 0;
  }

  step(dt: number) {
    // Decay bell jingle
    this.state.bellJingle = Math.max(0, this.state.bellJingle - dt * 2.8);

    if (this.state.isGrabbed) {
      return;
    }

    // Fast short-circuit: when in static resting state, freeze coordinates with 0 computation
    if (this.state.isSettled) {
      this.state.vel = vec(0, 0);
      this.state.angularVel = 0;
      this.state.angle = 0;
      this.state.pos.x = this.anchor.x;
      this.state.pos.y = this.anchor.y + this.params.restLength;
      return;
    }

    const L = Math.max(50, this.params.restLength);

    // True Damped Pendulum Equation of Motion:
    // theta'' = -(g / L) * sin(theta) - damping * theta'
    const gravityAccel = -(this.params.gravity / L) * Math.sin(this.state.angle);
    this.state.angularVel += gravityAccel * dt;

    // Angular velocity damping
    const dampingFactor = Math.pow(this.params.angularDamping, dt * 60);
    this.state.angularVel *= dampingFactor;

    // Angle integration
    this.state.angle += this.state.angularVel * dt;

    // Calculate exact physical position from fixed anchor along the rope length
    const sinAngle = Math.sin(this.state.angle);
    const cosAngle = Math.cos(this.state.angle);

    this.state.pos.x = this.anchor.x + sinAngle * L;
    this.state.pos.y = this.anchor.y + cosAngle * L;

    // Linear velocity vector
    this.state.vel.x = cosAngle * L * this.state.angularVel;
    this.state.vel.y = -sinAngle * L * this.state.angularVel;

    // Snap-to-Rest Threshold: when close to vertical and moving very slowly, freeze immediately
    const absAngle = Math.abs(this.state.angle);
    const absAngVel = Math.abs(this.state.angularVel);

    if (absAngle < 0.005 && absAngVel < 0.035) {
      this.state.settledTimer += dt;
      if (this.state.settledTimer > 0.15) {
        this.rest();
      }
    } else {
      this.state.settledTimer = 0;
    }
  }

  rest() {
    this.state.isSettled = true;
    this.state.settledTimer = 1.0;
    this.state.vel = vec(0, 0);
    this.state.angularVel = 0;
    this.state.angle = 0;
    this.state.pos.x = this.anchor.x;
    this.state.pos.y = this.anchor.y + this.params.restLength;
    this.state.bellJingle = 0;
  }
}
