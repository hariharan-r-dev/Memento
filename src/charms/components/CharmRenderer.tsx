import React from 'react';
import type { Vec2 } from '../../physics/vectors';
import type { CharmDefinition } from '../types';
import { getCharmById } from '../registry';

interface CharmRendererProps {
  charm?: CharmDefinition;
  charmId?: string;
  pos: Vec2;
  angle: number;
  scale?: number;
  opacity?: number;
  pawWavePhase?: number;
  bellJingle?: number;
  isHovered?: boolean;
  isRitual?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const CharmRenderer: React.FC<CharmRendererProps> = ({
  charm,
  charmId,
  pos,
  angle,
  scale = 1.0,
  opacity = 1.0,
  pawWavePhase = 0,
  bellJingle = 0,
  isHovered = false,
  isRitual = false,
  onPointerDown,
  onDoubleClick,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
}) => {
  const activeCharm = charm || getCharmById(charmId);
  const ArtworkComponent = activeCharm.artwork;

  return (
    <div
      className="charm-hitbox absolute select-none cursor-grab active:cursor-grabbing z-30 pointer-events-auto"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -12px)',
      }}
      onPointerDown={(e) => {
        if (e.button === 2) {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu?.(e as unknown as React.MouseEvent);
          return;
        }
        onPointerDown?.(e);
      }}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ArtworkComponent
        scale={scale}
        angle={angle}
        isHovered={isHovered}
        isRitual={isRitual}
        pawWavePhase={pawWavePhase}
        bellJingle={bellJingle}
        opacity={opacity}
      />
    </div>
  );
};
