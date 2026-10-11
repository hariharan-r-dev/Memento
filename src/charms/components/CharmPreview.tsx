import React from 'react';
import type { CharmDefinition } from '../types';

interface CharmPreviewProps {
  charm: CharmDefinition;
  isSelected?: boolean;
  isLocked?: boolean;
  maxHeight?: number;
  maxWidth?: number;
  containerHeight?: number | string;
  className?: string;
}

export const CharmPreview: React.FC<CharmPreviewProps> = ({
  charm,
  isSelected = false,
  isLocked = false,
  maxHeight = 72,
  maxWidth = 96,
  containerHeight = 84,
  className = '',
}) => {
  const ArtworkComponent = charm.artwork;
  const charmWidth = charm.size?.width || 120;
  const charmHeight = charm.size?.height || 140;

  // Proportional containment scale ensuring all artwork details (including connectors and feet) fit comfortably inside the preview box
  const scaleX = maxWidth / charmWidth;
  const scaleY = maxHeight / charmHeight;
  const fitScale = Math.min(scaleX, scaleY, 0.65);

  return (
    <div
      className={`charm-preview-viewport relative w-full flex items-center justify-center overflow-hidden pointer-events-none select-none my-0.5 ${className} ${
        isLocked ? 'grayscale-[40%]' : ''
      }`}
      style={{
        height: typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight,
        maxHeight: typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight,
      }}
    >
      {/* Centered hover scaling container */}
      <div className="charm-preview-hover-wrapper flex items-center justify-center w-full h-full transition-transform duration-150 group-hover:scale-105">
        {/* Exact dimension scaler anchored at true center */}
        <div
          className="charm-preview-scaler flex items-center justify-center shrink-0"
          style={{
            width: `${charmWidth}px`,
            height: `${charmHeight}px`,
            transform: `scale(${fitScale})`,
            transformOrigin: 'center center',
          }}
        >
          <ArtworkComponent
            scale={1.0}
            angle={0}
            isHovered={isSelected}
            isRitual={false}
            pawWavePhase={1.0}
            bellJingle={0.5}
          />
        </div>
      </div>
    </div>
  );
};
