import { useEffect, useRef, useState, useCallback } from 'react';
import { vec } from '../physics/vectors';
import type { Vec2 } from '../physics/vectors';
import { RopeSimulation } from '../physics/ropeVerlet';
import type { CharmPhysicsState } from '../physics/ropeVerlet';
import { soundEffects } from '../audio/soundEffects';

interface UseCharmPhysicsProps {
  anchorX: number;
  ropeLength: number;
  swingIntensity?: number;
  damping?: number;
  bounciness?: number;
}

export const useCharmPhysics = ({
  anchorX,
  ropeLength,
  swingIntensity = 1.0,
  damping = 1.0,
  bounciness = 0.45,
}: UseCharmPhysicsProps) => {
  const anchorPos = useRef<Vec2>(vec(anchorX, 0));
  const ropeSim = useRef<RopeSimulation>(
    new RopeSimulation(anchorPos.current, {
      totalLength: ropeLength,
      gravity: 980 * swingIntensity,
      damping: Math.pow(0.975, damping),
      stiffness: 0.95 + bounciness * 0.04,
    })
  );

  const [charmState, setCharmState] = useState<CharmPhysicsState>(() =>
    ropeSim.current.getCharmState()
  );
  const [ropePath, setRopePath] = useState<string>(() => ropeSim.current.getSvgPath());
  const [ropePoints, setRopePoints] = useState<Vec2[]>(() => ropeSim.current.getPoints());
  const [isRitual, setIsRitual] = useState(false);

  // Synchronize anchor and rope length when props change
  useEffect(() => {
    anchorPos.current = vec(anchorX, 0);
    ropeSim.current.setAnchor(anchorPos.current);
    ropeSim.current.setLength(ropeLength);
  }, [anchorX, ropeLength]);

  // Synchronize dynamic physics parameters in real time without resetting position
  useEffect(() => {
    ropeSim.current.updateConfig({
      gravity: 980 * swingIntensity,
      damping: Math.pow(0.975, damping),
      stiffness: 0.95 + bounciness * 0.04,
      totalLength: ropeLength,
    });
  }, [swingIntensity, damping, bounciness, ropeLength]);

  // Main physics animation loop (120Hz fixed step)
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();
    let accumulatedTime = 0;
    const fixedDt = 1 / 120; // 120Hz physics step for crisp chain stability

    const loop = (now: number) => {
      const frameDelta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      accumulatedTime += frameDelta;

      while (accumulatedTime >= fixedDt) {
        ropeSim.current.step(fixedDt);
        accumulatedTime -= fixedDt;
      }

      // Sync React state
      setCharmState(ropeSim.current.getCharmState());
      setRopePath(ropeSim.current.getSvgPath());
      setRopePoints(ropeSim.current.getPoints());

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const grab = useCallback((pos: Vec2) => {
    ropeSim.current.grab(pos);
  }, []);

  const drag = useCallback((targetPos: Vec2) => {
    ropeSim.current.drag(targetPos);
  }, []);

  const release = useCallback((releaseVelocity: Vec2) => {
    ropeSim.current.release(releaseVelocity);
  }, []);

  const triggerRitual = useCallback(() => {
    setIsRitual(true);
    soundEffects.playRitualSparkle();

    // Give charm a natural pendulum ritual impulse
    const side = Math.random() > 0.5 ? 1 : -1;
    ropeSim.current.applyImpulse(vec(side * 420, 0), side * 1.8);

    setTimeout(() => {
      setIsRitual(false);
    }, 2200);
  }, []);

  const disturbRope = useCallback(
    (prevPos: Vec2, currPos: Vec2, cursorVel: Vec2) => {
      ropeSim.current.applyHoverDisturbance(prevPos, currPos, cursorVel, 14);
    },
    []
  );

  const disturbCharmBody = useCallback(
    (prevPos: Vec2, currPos: Vec2, cursorVel: Vec2) => {
      ropeSim.current.applyBodyHoverDisturbance(prevPos, currPos, cursorVel);
    },
    []
  );

  const resetPosition = useCallback(() => {
    anchorPos.current = vec(anchorX, 0);
    ropeSim.current.reset(anchorPos.current);
  }, [anchorX]);

  return {
    charmState,
    ropePath,
    ropePoints,
    isRitual,
    grab,
    drag,
    release,
    triggerRitual,
    disturbRope,
    disturbCharmBody,
    resetPosition,
  };
};
