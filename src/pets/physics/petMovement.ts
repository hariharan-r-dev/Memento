import { useState, useEffect, useRef } from 'react';
import type { PetDefinition, PetState } from '../types';

export interface PetSimState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  state: PetState;
  direction: 'left' | 'right';
  isPetting: boolean;
}

interface UsePetMovementProps {
  pet: PetDefinition;
  enabled: boolean;
  behaviorIntensity?: number;
  petScale?: number;
  initialX?: number;
  initialY?: number;
}

export const usePetMovement = ({
  pet,
  enabled,
  behaviorIntensity = 1.0,
  petScale = 1.0,
  initialX,
  initialY,
}: UsePetMovementProps) => {
  // Compute usable desktop work area
  const availWidth = typeof window !== 'undefined' ? (window.screen.availWidth || window.innerWidth || 1920) : 1920;
  const availHeight = typeof window !== 'undefined' ? (window.screen.availHeight || window.innerHeight || 1080) : 1080;

  // Pet dimensions and bottom roaming zone boundaries
  const halfW = 40 * petScale;
  const halfH = 32 * petScale;
  const bottomMargin = 22; // Clearance above taskbar / dock
  const maxY = Math.max(150, availHeight - bottomMargin - halfH);
  const zoneHeight = Math.max(90, Math.min(180, availHeight * 0.15));
  const minY = Math.max(50, maxY - zoneHeight);

  const minX = 40 + halfW;
  const maxX = Math.max(minX + 100, availWidth - 40 - halfW);

  const defaultSpawnX = Math.max(minX, Math.min(maxX, initialX ?? Math.round(availWidth * 0.35)));
  const defaultSpawnY = Math.max(minY, Math.min(maxY, initialY ?? Math.round(maxY - 10)));

  const [petState, setPetState] = useState<PetSimState>({
    x: defaultSpawnX,
    y: defaultSpawnY,
    vx: 0,
    vy: 0,
    state: 'IDLE',
    direction: 'right',
    isPetting: false,
  });

  const stateRef = useRef<PetSimState>({
    x: defaultSpawnX,
    y: defaultSpawnY,
    vx: 0,
    vy: 0,
    state: 'IDLE',
    direction: 'right',
    isPetting: false,
  });

  const cursorRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  const nextStateTimeRef = useRef<number>(Date.now() + 2500);
  const targetPosRef = useRef<{ x: number; y: number }>({ x: defaultSpawnX, y: defaultSpawnY });

  // Mouse move listener across window to track cursor distance
  useEffect(() => {
    if (!enabled) return;

    const handlePointerMove = (e: MouseEvent) => {
      cursorRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      cursorRef.current.active = false;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [enabled]);

  // Main Movement & Autonomous Behavior State Machine Loop
  useEffect(() => {
    if (!enabled) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const current = stateRef.current;
      const nowMs = Date.now();

      // Dynamic work area bounds on resize
      const curAvailWidth = typeof window !== 'undefined' ? (window.screen.availWidth || window.innerWidth || 1920) : 1920;
      const curAvailHeight = typeof window !== 'undefined' ? (window.screen.availHeight || window.innerHeight || 1080) : 1080;
      const curMaxY = Math.max(150, curAvailHeight - bottomMargin - halfH);
      const curZoneHeight = Math.max(90, Math.min(180, curAvailHeight * 0.15));
      const curMinY = Math.max(50, curMaxY - curZoneHeight);
      const curMinX = 40 + halfW;
      const curMaxX = Math.max(curMinX + 100, curAvailWidth - 40 - halfW);

      // 1. Check Cursor Proximity in the bottom zone
      const cursor = cursorRef.current;
      const distToCursor = Math.hypot(cursor.x - current.x, cursor.y - current.y);
      const noticeDist = pet.cursorReactionDistance * behaviorIntensity;

      if (cursor.active && distToCursor < noticeDist && current.state !== 'INTERACT') {
        if (current.state === 'SLEEP') {
          // Deep sleepers (cat, panda) remain resting; alert pets (puppy, bunny, bird, shiba) wake up on cursor approach
          if (pet.id !== 'cat' && pet.id !== 'panda') {
            current.state = 'NOTICE_CURSOR';
            current.direction = cursor.x < current.x ? 'left' : 'right';
            nextStateTimeRef.current = nowMs + 1800;
          }
        } else if (current.state === 'HUNGRY') {
          // Hungry pet turns toward cursor without cancelling the food thought
          current.direction = cursor.x < current.x ? 'left' : 'right';
        } else if (current.state !== 'NOTICE_CURSOR') {
          current.state = 'NOTICE_CURSOR';
          current.direction = cursor.x < current.x ? 'left' : 'right';
          nextStateTimeRef.current = nowMs + 1800;
        }
      }

      // 2. State Machine Transitions based on Timers
      if (nowMs >= nextStateTimeRef.current) {
        const rand = Math.random();
        const b = pet.behaviors;
        const hungerRate = b.hungerChance || 0.14;

        if (current.state === 'NOTICE_CURSOR' || current.state === 'INTERACT') {
          // Move slightly toward or away from cursor occasionally
          if (rand < b.wanderChance) {
            current.state = 'MOVE';
            targetPosRef.current = {
              x: Math.max(curMinX, Math.min(curMaxX, current.x + (Math.random() - 0.5) * 260)),
              y: Math.max(curMinY, Math.min(curMaxY, current.y + (Math.random() - 0.5) * 60)),
            };
            nextStateTimeRef.current = nowMs + (b.moveDurationMin + Math.random() * (b.moveDurationMax - b.moveDurationMin));
          } else if (rand < b.wanderChance + hungerRate * 0.5) {
            current.state = 'HUNGRY';
            nextStateTimeRef.current = nowMs + 4500 + Math.random() * 2000;
          } else {
            current.state = 'IDLE';
            nextStateTimeRef.current = nowMs + (b.idleDurationMin + Math.random() * (b.idleDurationMax - b.idleDurationMin));
          }
        } else if (current.state === 'MOVE' || current.state === 'WANDER') {
          // After moving, transition to sit, sleep, hungry, or idle
          const pSit = b.sitChance;
          const pSleep = pSit + b.sleepChance;
          const pHunger = pSleep + hungerRate;

          if (rand < pSit) {
            current.state = 'SIT';
            nextStateTimeRef.current = nowMs + 3500 + Math.random() * 4000;
          } else if (rand < pSleep) {
            current.state = 'SLEEP';
            nextStateTimeRef.current = nowMs + 5000 + Math.random() * 6000;
          } else if (rand < pHunger) {
            current.state = 'HUNGRY';
            nextStateTimeRef.current = nowMs + 4500 + Math.random() * 2000;
          } else {
            current.state = 'IDLE';
            nextStateTimeRef.current = nowMs + (b.idleDurationMin + Math.random() * (b.idleDurationMax - b.idleDurationMin));
          }
        } else if (current.state === 'HUNGRY') {
          // After thinking about food, transition to move or idle
          if (rand < 0.6) {
            current.state = 'MOVE';
            targetPosRef.current = {
              x: curMinX + Math.random() * (curMaxX - curMinX),
              y: curMinY + Math.random() * (curMaxY - curMinY),
            };
            nextStateTimeRef.current = nowMs + (b.moveDurationMin + Math.random() * (b.moveDurationMax - b.moveDurationMin));
          } else {
            current.state = 'IDLE';
            nextStateTimeRef.current = nowMs + 2500 + Math.random() * 3000;
          }
        } else {
          // From IDLE / SIT / SLEEP -> Wander, Sit, Sleep, Hungry, or Idle
          const pMove = b.wanderChance;
          const pSit = pMove + b.sitChance;
          const pSleep = pSit + b.sleepChance;
          const pHunger = pSleep + hungerRate;

          if (rand < pMove) {
            current.state = 'MOVE';
            targetPosRef.current = {
              x: curMinX + Math.random() * (curMaxX - curMinX),
              y: curMinY + Math.random() * (curMaxY - curMinY),
            };
            nextStateTimeRef.current = nowMs + (b.moveDurationMin + Math.random() * (b.moveDurationMax - b.moveDurationMin));
          } else if (rand < pSit) {
            current.state = 'SIT';
            nextStateTimeRef.current = nowMs + 3000 + Math.random() * 3500;
          } else if (rand < pSleep) {
            current.state = 'SLEEP';
            nextStateTimeRef.current = nowMs + 5000 + Math.random() * 6000;
          } else if (rand < pHunger) {
            current.state = 'HUNGRY';
            nextStateTimeRef.current = nowMs + 4500 + Math.random() * 2000;
          } else {
            current.state = 'IDLE';
            nextStateTimeRef.current = nowMs + 2000 + Math.random() * 3000;
          }
        }
      }

      // 3. Movement Physics (Velocity, Damping, Bounds)
      if (current.state === 'MOVE' || current.state === 'WANDER') {
        const dx = targetPosRef.current.x - current.x;
        const dy = targetPosRef.current.y - current.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
          const speed = pet.movementSpeed * behaviorIntensity;
          current.vx = (dx / dist) * speed;
          current.vy = (dy / dist) * speed * 0.4;
          current.direction = current.vx < 0 ? 'left' : 'right';
        } else {
          current.vx *= 0.8;
          current.vy *= 0.8;
          current.state = 'IDLE';
        }
      } else {
        current.vx *= 0.85;
        current.vy *= 0.85;
      }

      // 4. Boundary deceleration & turning (no teleportation)
      if (current.x <= curMinX + 15 && current.vx < 0) {
        current.vx *= 0.5;
        current.direction = 'right';
        targetPosRef.current.x = curMinX + 120 + Math.random() * 150;
      } else if (current.x >= curMaxX - 15 && current.vx > 0) {
        current.vx *= 0.5;
        current.direction = 'left';
        targetPosRef.current.x = curMaxX - 120 - Math.random() * 150;
      }

      // Step position
      current.x += current.vx * dt;
      current.y += current.vy * dt;

      // Hard clamp bounds strictly above taskbar and within screen boundaries
      current.x = Math.max(curMinX, Math.min(curMaxX, current.x));
      current.y = Math.max(curMinY, Math.min(curMaxY, current.y));

      // Push state update
      setPetState({ ...current });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [enabled, pet, behaviorIntensity, halfW, halfH, bottomMargin]);

  const interactWithPet = () => {
    stateRef.current.state = 'INTERACT';
    stateRef.current.isPetting = true;
    nextStateTimeRef.current = Date.now() + 2000;
    setTimeout(() => {
      stateRef.current.isPetting = false;
    }, 1200);
  };

  return {
    petState,
    interactWithPet,
  };
};
