import React, { useEffect, useState } from 'react';

interface FortuneMessageProps {
  message: string;
  position: { x: number; y: number };
  visible: boolean;
  onComplete?: () => void;
}

export const FortuneMessage: React.FC<FortuneMessageProps> = ({
  message,
  position,
  visible,
  onComplete,
}) => {
  const [show, setShow] = useState(false);
  const [fadeState, setFadeState] = useState<'entering' | 'floating' | 'leaving'>('entering');

  useEffect(() => {
    if (!visible || !message) {
      setShow(false);
      return;
    }

    setShow(true);
    setFadeState('entering');

    const t1 = setTimeout(() => {
      setFadeState('floating');
    }, 150);

    const t2 = setTimeout(() => {
      setFadeState('leaving');
    }, 2000);

    const t3 = setTimeout(() => {
      setShow(false);
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [visible, message]);

  if (!show || !message) return null;

  return (
    <div
      className="fortune-message-pill absolute pointer-events-none select-none z-50 flex items-center justify-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 60}px`,
        transform: `translate(-50%, ${fadeState === 'entering' ? '12px' : fadeState === 'leaving' ? '-18px' : '-4px'}) scale(${
          fadeState === 'entering' ? 0.85 : fadeState === 'leaving' ? 0.95 : 1
        })`,
        opacity: fadeState === 'entering' ? 0.9 : fadeState === 'leaving' ? 0 : 1,
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="px-4 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-amber-400/40 shadow-xl shadow-amber-950/20 text-xs font-medium text-amber-200 flex items-center gap-1.5 tracking-wide whitespace-nowrap">
        <span className="text-amber-400 font-bold text-sm">✦</span>
        <span>{message}</span>
        <span className="text-amber-400 font-bold text-sm">✦</span>
      </div>
    </div>
  );
};
