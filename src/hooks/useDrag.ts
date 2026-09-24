import { useRef, useState, useCallback, useEffect } from 'react';
import { vec, sub, scale, len, dist } from '../physics/vectors';
import type { Vec2 } from '../physics/vectors';

interface PositionSample {
  pos: Vec2;
  time: number;
}

interface UseDragProps {
  onGrab: (pos: Vec2) => void;
  onDrag: (pos: Vec2) => void;
  onRelease: (releaseVelocity: Vec2) => void;
  sensitivity?: number;
}

type PointerState = 'REST' | 'POINTER_DOWN' | 'DRAGGING';

export const useDrag = ({ onGrab, onDrag, onRelease, sensitivity = 1.0 }: UseDragProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const pointerStateRef = useRef<PointerState>('REST');
  const startPosRef = useRef<Vec2>(vec(0, 0));
  const samplesRef = useRef<PositionSample[]>([]);
  const lastPosRef = useRef<Vec2>(vec(0, 0));
  const capturedTargetRef = useRef<{ el: HTMLElement; id: number } | null>(null);

  const endDrag = useCallback(
    (targetEl?: HTMLElement, pointerId?: number) => {
      const prevState = pointerStateRef.current;
      pointerStateRef.current = 'REST';
      setIsDragging(false);

      const target = targetEl || capturedTargetRef.current?.el;
      const pid = pointerId !== undefined ? pointerId : capturedTargetRef.current?.id;
      if (target && pid !== undefined) {
        try {
          target.releasePointerCapture?.(pid);
        } catch (_e) {}
      }
      capturedTargetRef.current = null;

      // If it was only a click/tap (never exceeded drag threshold), do NOTHING (no release impulse, no physics change)
      if (prevState !== 'DRAGGING') {
        samplesRef.current = [];
        return;
      }

      // Calculate release flick velocity from recent samples
      let releaseVelocity = vec(0, 0);
      const samples = samplesRef.current;

      if (samples.length >= 2) {
        const oldest = samples[0];
        const newest = samples[samples.length - 1];
        const dt = (newest.time - oldest.time) / 1000;

        if (dt > 0.005 && dt < 0.25) {
          const delta = sub(newest.pos, oldest.pos);
          releaseVelocity = scale(delta, (1 / dt) * sensitivity);
        }
      }

      // Cap maximum flick velocity to avoid extreme clipping
      const maxSpeed = 1400;
      const speed = len(releaseVelocity);
      if (speed > maxSpeed) {
        releaseVelocity = scale(releaseVelocity, maxSpeed / speed);
      }

      onRelease(releaseVelocity);
      samplesRef.current = [];
    },
    [onRelease, sensitivity]
  );

  // Global safety listeners: ensure pointerup/pointercancel anywhere always ends drag cleanly
  useEffect(() => {
    const handleGlobalUp = () => {
      if (pointerStateRef.current !== 'REST') {
        endDrag();
      }
    };
    window.addEventListener('pointerup', handleGlobalUp);
    window.addEventListener('pointercancel', handleGlobalUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalUp);
      window.removeEventListener('pointercancel', handleGlobalUp);
    };
  }, [endDrag]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, containerRect: DOMRect) => {
      // Only handle primary left click (button === 0) for dragging.
      // Right-click (button === 2) and other buttons must pass through freely to trigger context menu without pointer capture collision.
      if (e.button !== 0) return;

      e.stopPropagation();

      const el = e.target as HTMLElement;
      try {
        el.setPointerCapture?.(e.pointerId);
        capturedTargetRef.current = { el, id: e.pointerId };
      } catch (_e) {}

      const clientX = e.clientX - containerRect.left;
      const clientY = e.clientY - containerRect.top;
      const startPos = vec(clientX, clientY);

      pointerStateRef.current = 'POINTER_DOWN';
      startPosRef.current = startPos;
      lastPosRef.current = startPos;
      samplesRef.current = [{ pos: startPos, time: performance.now() }];
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent, containerRect: DOMRect) => {
      if (pointerStateRef.current === 'REST') return;

      const clientX = e.clientX - containerRect.left;
      const clientY = e.clientY - containerRect.top;
      const curPos = vec(clientX, clientY);
      const now = performance.now();

      if (pointerStateRef.current === 'POINTER_DOWN') {
        const moveDist = dist(curPos, startPosRef.current);
        // Only enter DRAGGING state if movement exceeds threshold (6px)
        if (moveDist >= 6) {
          pointerStateRef.current = 'DRAGGING';
          setIsDragging(true);
          onGrab(startPosRef.current);
          onDrag(curPos);
        }
        return;
      }

      if (pointerStateRef.current === 'DRAGGING') {
        samplesRef.current.push({ pos: curPos, time: now });

        // Keep only recent samples (last 90ms) for accurate flick velocity
        while (samplesRef.current.length > 6 || (samplesRef.current.length > 2 && now - samplesRef.current[0].time > 90)) {
          samplesRef.current.shift();
        }

        lastPosRef.current = curPos;
        onDrag(curPos);
      }
    },
    [onGrab, onDrag]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      endDrag(e.target as HTMLElement, e.pointerId);
    },
    [endDrag]
  );

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isDragging,
  };
};
