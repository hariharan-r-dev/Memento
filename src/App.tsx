import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSettings } from './stores/settingsStore';
import { useCharmPhysics } from './hooks/useCharmPhysics';
import { useDrag } from './hooks/useDrag';
import { getCharmById } from './charms/registry';
import { getPetById } from './pets/registry';
import type { PetId } from './pets/types';
import { usePetMovement } from './pets/physics/petMovement';
import { RopeRenderer } from './components/Rope/RopeRenderer';
import { CharmRenderer } from './charms/components/CharmRenderer';
import { PetRenderer } from './pets/components/PetRenderer';
import { TopBracket } from './components/TopBracket/TopBracket';
import { Sparkles } from './components/ParticleEffects/Sparkles';
import { FortuneMessage } from './components/ParticleEffects/FortuneMessage';
import { SettingsModal } from './components/Settings/SettingsModal';
import type { SettingsTab } from './components/Settings/SettingsModal';
import { OnboardingModal } from './components/Onboarding/OnboardingModal';
import { CharmPicker } from './components/Pickers/CharmPicker';
import { PetPicker } from './components/Pickers/PetPicker';
import { ritualEngine } from './rituals/ritualEngine';
import { soundEffects } from './audio/soundEffects';
import { useLicense } from './stores/licenseStore';

// Helper to safely invoke Tauri commands
const invokeTauri = async (cmd: string, args?: Record<string, unknown>) => {
  try {
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke(cmd, args);
    }
  } catch (e) {
    console.error(`[invokeTauri] Error calling ${cmd}:`, e);
  }
};

export const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings, updateSettings, resetAllSettings } = useSettings();
  const { isActivated, isCharmOwned, getFirstOwnedCharmId } = useLicense();

  // If unactivated, App does not render charm overlay and lets Rust handle windows

  // Listen for activation completed event across windows
  useEffect(() => {
    let unsub: (() => void) | undefined;
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      import('@tauri-apps/api/event').then(({ listen }) => {
        listen('activation-completed', () => {
          invokeTauri('show_main_window');
        }).then((u) => {
          unsub = u;
        });
      }).catch(() => {});
    }
    return () => {
      if (unsub) unsub();
    };
  }, []);

  // If activated and currently selected charm is not owned, switch to first owned charm
  useEffect(() => {
    if (isActivated && !isCharmOwned(settings.selectedCharm)) {
      const firstOwned = getFirstOwnedCharmId();
      updateSettings({ selectedCharm: firstOwned });
    }
  }, [isActivated, isCharmOwned, settings.selectedCharm, getFirstOwnedCharmId, updateSettings]);

  // Active Charm Definition from Registry
  const activeCharm = getCharmById(settings.selectedCharm);

  // Active Desktop Pet Definition from Registry
  const activePet = getPetById(settings.selectedPet);

  // Charm scale continuous multiplier (0.70x to 1.50x)
  const charmScale = typeof settings.charmSize === 'number' ? settings.charmSize : 1.0;

  // Work area safety clamping for desktop height (respects taskbar / dock boundaries)
  const maxAvailableHeight = typeof window !== 'undefined' ? (window.screen.availHeight || window.innerHeight) : 1080;
  const maxAllowedRope = Math.max(90, Math.min(220, maxAvailableHeight - 160));
  const effectiveRopeLength = Math.min(settings.ropeLength, maxAllowedRope);

  // Physics Hook with all dynamic parameters connected
  const {
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
  } = useCharmPhysics({
    anchorX: settings.anchorX,
    ropeLength: effectiveRopeLength,
    swingIntensity: settings.swingIntensity,
    damping: settings.damping,
    bounciness: settings.bounciness,
  });

  // Desktop Pet Autonomous Movement Simulation Hook
  const { petState, interactWithPet } = usePetMovement({
    pet: activePet,
    enabled: settings.showPet,
    behaviorIntensity: settings.petBehaviorIntensity,
    petScale: settings.petSize,
  });

  // UI state
  const [isHovered, setIsHovered] = useState(false);
  const [fortuneMessage, setFortuneMessage] = useState<string>('');
  const [isFortuneVisible, setIsFortuneVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('general');
  const [isDraggingBracket, setIsDraggingBracket] = useState(false);
  const [isCharmPickerOpen, setIsCharmPickerOpen] = useState(false);
  const [isPetPickerOpen, setIsPetPickerOpen] = useState(false);

  // Pointer position & velocity tracker for subtle physical rope hover
  const lastPointer = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  // Drag interaction for hanging charm
  const { handlePointerDown, handlePointerMove, handlePointerUp, isDragging } = useDrag({
    onGrab: (pos) => {
      grab(pos);
      invokeTauri('update_hit_test_state', { isDragging: true });
    },
    onDrag: (pos) => drag(pos),
    onRelease: (releaseVelocity) => {
      release(releaseVelocity);
      invokeTauri('update_hit_test_state', { isDragging: false });
    },
    sensitivity: settings.motionSensitivity,
  });

  // Sync Native Hit-Test State with Rust Windows platform monitor (for overlay pickers/onboarding)
  const isModalOpen = isCharmPickerOpen || isPetPickerOpen || (!settings.hasCompletedOnboarding && settings.showCharm);
  const isAnyDragging = isDragging || isDraggingBracket;

  // Dynamically compute rotated & scaled bounding box for active charm
  const charmHitbox = useMemo(() => {
    const charmSize = activeCharm.size || { width: 130, height: 160 };
    const charmAttachmentY = typeof activeCharm.attachmentPoint?.y === 'number' ? activeCharm.attachmentPoint.y : 10;
    const cx = charmState.pos.x;
    const cy = charmState.pos.y;

    // 4 corners in local coordinates relative to attachment point (0, 0)
    const halfW = (charmSize.width / 2) * charmScale;
    const topH = -charmAttachmentY * charmScale;
    const bottomH = (charmSize.height - charmAttachmentY) * charmScale;

    const cosA = Math.cos(charmState.angle);
    const sinA = Math.sin(charmState.angle);

    const corners = [
      { x: -halfW, y: topH },
      { x: halfW, y: topH },
      { x: -halfW, y: bottomH },
      { x: halfW, y: bottomH },
    ];

    let minWorldX = Infinity;
    let maxWorldX = -Infinity;
    let minWorldY = Infinity;
    let maxWorldY = -Infinity;

    for (const corner of corners) {
      const rotX = corner.x * cosA - corner.y * sinA;
      const rotY = corner.x * sinA + corner.y * cosA;
      const wx = cx + rotX;
      const wy = cy + rotY;
      if (wx < minWorldX) minWorldX = wx;
      if (wx > maxWorldX) maxWorldX = wx;
      if (wy < minWorldY) minWorldY = wy;
      if (wy > maxWorldY) maxWorldY = wy;
    }

    // Include 16px safety padding around the silhouette
    return {
      minX: Math.round(minWorldX - 16),
      maxX: Math.round(maxWorldX + 16),
      minY: Math.round(minWorldY - 16),
      maxY: Math.round(maxWorldY + 16),
    };
  }, [activeCharm, charmScale, charmState.pos.x, charmState.pos.y, charmState.angle]);

  useEffect(() => {
    invokeTauri('update_hit_test_state', {
      anchorX: Math.round(settings.anchorX),
      ropeLength: Math.round(effectiveRopeLength),
      charmX: Math.round(charmState.pos.x),
      charmY: Math.round(charmState.pos.y),
      charmMinX: charmHitbox.minX,
      charmMaxX: charmHitbox.maxX,
      charmMinY: charmHitbox.minY,
      charmMaxY: charmHitbox.maxY,
      petX: Math.round(petState.x),
      petY: Math.round(petState.y),
      hasPet: settings.showPet,
      isDragging: isAnyDragging,
      isModalOpen: isModalOpen,
    });
  }, [
    settings.anchorX,
    effectiveRopeLength,
    charmState.pos.x,
    charmState.pos.y,
    charmHitbox,
    petState.x,
    petState.y,
    settings.showPet,
    isAnyDragging,
    isModalOpen,
  ]);

  useEffect(() => {
    console.log('[Memento Startup Diagnostic]', {
      window: {
        width: typeof window !== 'undefined' ? window.innerWidth : 1920,
        height: typeof window !== 'undefined' ? window.innerHeight : 1080,
      },
      activeCharm: activeCharm.name,
      charmPosition: charmState.pos,
      charmScale,
      charmOpacity: settings.charmOpacity,
      ropeFirstParticle: ropePoints[0],
      ropeLastParticle: ropePoints[ropePoints.length - 1],
    });
  }, []);

  const handleResetPosition = useCallback(() => {
    const centerX = typeof window !== 'undefined' ? Math.round(window.innerWidth / 2) : 960;
    updateSettings({ anchorX: centerX });
    resetPosition();
  }, [updateSettings, resetPosition]);

  // Lucky ritual trigger orchestrated by ritualEngine
  const handlePerformRitual = useCallback(() => {
    if (!settings.enableRitual) return;

    ritualEngine.triggerRitual({
      charmId: activeCharm.id,
      soundEnabled: settings.soundEnabled && settings.ritualSound,
      notificationsEnabled: settings.notificationsEnabled && settings.ritualNotificationsEnabled,
      fortuneMessagesEnabled: settings.fortuneMessagesEnabled,
      onStartRitualState: () => {
        triggerRitual();
      },
      onShowFortune: (msg) => {
        setFortuneMessage(msg);
        setIsFortuneVisible(true);
      },
      onEndRitualState: () => {
        // Clean particle deallocation
      },
    });
  }, [
    activeCharm.id,
    settings.enableRitual,
    settings.soundEnabled,
    settings.ritualSound,
    settings.notificationsEnabled,
    settings.ritualNotificationsEnabled,
    settings.fortuneMessagesEnabled,
    triggerRitual,
  ]);

  // Listen to Tauri native tray / context menu / shortcut / single-instance events
  useEffect(() => {
    let unlistenRitual: (() => void) | undefined;
    let unlistenSettings: (() => void) | undefined;
    let unlistenReset: (() => void) | undefined;
    let unlistenSecondInstance: (() => void) | undefined;
    let unlistenOpenCharmPicker: (() => void) | undefined;
    let unlistenOpenPetPicker: (() => void) | undefined;
    let unlistenSetCharm: (() => void) | undefined;
    let unlistenSetPet: (() => void) | undefined;
    let unlistenSetShowPet: (() => void) | undefined;
    let unlistenSetPetBehavior: (() => void) | undefined;
    let unlistenSettingsUpdated: (() => void) | undefined;

    const setupListeners = async () => {
      try {
        if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
          const { listen } = await import('@tauri-apps/api/event');

          unlistenRitual = await listen('lucky-ritual', () => {
            handlePerformRitual();
          });

          unlistenSettings = await listen<string>('open-settings', (event) => {
            const tab = (event.payload as SettingsTab) || 'general';
            invokeTauri('open_settings_window', { tab }).catch(() => {
              setSettingsTab(tab);
              setIsSettingsOpen(true);
            });
          });

          unlistenReset = await listen('reset-position', () => {
            handleResetPosition();
          });

          unlistenSecondInstance = await listen('second-instance-detected', () => {
            soundEffects.playBellJingle(0.8);
          });

          unlistenOpenCharmPicker = await listen('open-charm-picker', () => {
            setIsCharmPickerOpen(true);
          });

          unlistenOpenPetPicker = await listen('open-pet-picker', () => {
            setIsPetPickerOpen(true);
          });

          unlistenSetCharm = await listen<string>('set-selected-charm', (event) => {
            if (event.payload) {
              updateSettings({ selectedCharm: event.payload });
            }
          });

          unlistenSetPet = await listen<string>('set-selected-pet', (event) => {
            if (event.payload) {
              updateSettings({ selectedPet: event.payload as PetId, showPet: true });
            }
          });

          unlistenSetShowPet = await listen<boolean>('set-show-pet', (event) => {
            updateSettings({ showPet: event.payload });
          });

          unlistenSetPetBehavior = await listen<number>('set-pet-behavior', (event) => {
            if (typeof event.payload === 'number') {
              updateSettings({ petBehaviorIntensity: event.payload });
            }
          });

          unlistenSettingsUpdated = await listen<Partial<typeof settings>>('settings-updated', (event) => {
            if (event.payload) {
              updateSettings(event.payload);
            }
          });
        }
      } catch (_e) {}
    };

    setupListeners();

    return () => {
      if (unlistenRitual) unlistenRitual();
      if (unlistenSettings) unlistenSettings();
      if (unlistenReset) unlistenReset();
      if (unlistenSecondInstance) unlistenSecondInstance();
      if (unlistenOpenCharmPicker) unlistenOpenCharmPicker();
      if (unlistenOpenPetPicker) unlistenOpenPetPicker();
      if (unlistenSetCharm) unlistenSetCharm();
      if (unlistenSetPet) unlistenSetPet();
      if (unlistenSetShowPet) unlistenSetShowPet();
      if (unlistenSetPetBehavior) unlistenSetPetBehavior();
      if (unlistenSettingsUpdated) unlistenSettingsUpdated();
    };
  }, [handlePerformRitual, handleResetPosition, updateSettings]);

  // Double click handler on charm
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handlePerformRitual();
  };

  // Native Context Menu Triggers
  const handleCharmContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    invokeTauri('show_context_menu', {
      target: 'charm',
      selectedCharm: settings.selectedCharm,
      selectedPet: settings.selectedPet,
      showPet: settings.showPet,
      behaviorIntensity: settings.petBehaviorIntensity,
    });
  };

  const handlePetContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    invokeTauri('show_context_menu', {
      target: 'pet',
      selectedCharm: settings.selectedCharm,
      selectedPet: settings.selectedPet,
      showPet: settings.showPet,
      behaviorIntensity: settings.petBehaviorIntensity,
    });
  };

  // Horizontal bracket dragging across full screen width
  const handleBracketMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingBracket(true);

    const startX = e.clientX;
    const initialAnchorX = settings.anchorX;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const maxAnchor = (typeof window !== 'undefined' ? window.innerWidth : 1920) - 40;
      const newAnchorX = Math.max(40, Math.min(maxAnchor, initialAnchorX + deltaX));
      updateSettings({ anchorX: newAnchorX });
    };

    const handleMouseUp = () => {
      setIsDraggingBracket(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Container pointer motion tracking (handles drag move + subtle physical rope hover)
  const handlePointerMoveContainer = (e: React.PointerEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      const now = performance.now();

      const prevX = lastPointer.current.time > 0 ? lastPointer.current.x : clientX;
      const prevY = lastPointer.current.time > 0 ? lastPointer.current.y : clientY;
      const dt = lastPointer.current.time > 0 ? Math.max(0.001, (now - lastPointer.current.time) / 1000) : 0.016;

      const vx = (clientX - prevX) / dt;
      const vy = (clientY - prevY) / dt;

      lastPointer.current = { x: clientX, y: clientY, time: now };

      handlePointerMove(e, rect);

      // Subtle physical hover: only when cursor is moving across string or charm body with velocity
      if (!isDragging && !isDraggingBracket && (Math.abs(vx) > 15 || Math.hypot(clientX - prevX, clientY - prevY) > 1.2)) {
        const localPrev = { x: prevX - rect.left, y: prevY - rect.top };
        const localCurr = { x: clientX - rect.left, y: clientY - rect.top };
        const vel = { x: vx, y: vy };

        const minRopeX = Math.min(...ropePoints.map((p) => p.x)) - 25;
        const maxRopeX = Math.max(...ropePoints.map((p) => p.x)) + 25;
        const maxRopeY = charmState.pos.y + 10;

        // String hover: physical rope crossover disturbance
        if (
          Math.min(localPrev.y, localCurr.y) <= maxRopeY &&
          Math.max(localPrev.y, localCurr.y) >= 0 &&
          Math.max(localPrev.x, localCurr.x) >= minRopeX &&
          Math.min(localPrev.x, localCurr.x) <= maxRopeX
        ) {
          disturbRope(localPrev, localCurr, vel);
        }
        // Charm body hover: physical 25-35% subtle displacement/tilt disturbance
        else if (
          localCurr.x >= charmHitbox.minX &&
          localCurr.x <= charmHitbox.maxX &&
          localCurr.y >= charmHitbox.minY &&
          localCurr.y <= charmHitbox.maxY
        ) {
          disturbCharmBody(localPrev, localCurr, vel);
        }
      }
    }
  };

  // First run onboarding completion
  const handleCompleteOnboarding = () => {
    updateSettings({ hasCompletedOnboarding: true });
    soundEffects.playRitualSparkle();
  };

  if (!isActivated) {
    return null;
  }

  if (!settings.showCharm && !settings.showPet) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none bg-transparent pointer-events-none"
      onContextMenu={(e) => e.preventDefault()}
      onPointerMove={handlePointerMoveContainer}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        lastPointer.current = { x: 0, y: 0, time: 0 };
      }}
    >
      {/* 1. Top Bezel Mounting Bracket with slider */}
      {settings.showCharm && (
        <div
          className="pointer-events-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onContextMenu={handleCharmContextMenu}
        >
          <TopBracket
            x={settings.anchorX}
            isDragging={isDraggingBracket}
            onMouseDown={handleBracketMouseDown}
          />
        </div>
      )}

      {/* 2. Desktop Pet Companion (Layer 2) */}
      {settings.showPet && (
        <PetRenderer
          pet={activePet}
          x={petState.x}
          y={petState.y}
          scale={settings.petSize}
          opacity={settings.petOpacity}
          currentState={petState.state}
          direction={petState.direction}
          isPetting={petState.isPetting}
          onInteract={() => {
            interactWithPet();
            soundEffects.playBellJingle(0.4);
          }}
          onContextMenu={handlePetContextMenu}
        />
      )}

      {/* 3. Braided Cord (Layer 3) */}
      {settings.showCharm && (
        <RopeRenderer
          ropePath={ropePath}
          points={ropePoints}
          primaryColor={activeCharm.colorTheme.cordPrimary}
          secondaryColor={activeCharm.colorTheme.cordSecondary}
          onPointerDown={(e) => {
            if (containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              handlePointerDown(e, rect);
            }
          }}
          onContextMenu={handleCharmContextMenu}
        />
      )}

      {/* 4. Active Hanging Talisman Charm (Layer 4) */}
      {settings.showCharm && (
        <CharmRenderer
          charm={activeCharm}
          pos={charmState.pos}
          angle={charmState.angle}
          scale={charmScale}
          opacity={settings.charmOpacity}
          pawWavePhase={charmState.pawWavePhase}
          bellJingle={charmState.bellJingle}
          isHovered={isHovered || isDragging}
          isRitual={isRitual}
          onPointerDown={(e) => {
            if (containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              handlePointerDown(e, rect);
            }
          }}
          onDoubleClick={handleDoubleClick}
          onContextMenu={handleCharmContextMenu}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      )}

      {/* 5. Golden Sparkle Particle Burst on Double Click (Layer 5) */}
      <Sparkles
        origin={{ x: charmState.pos.x, y: charmState.pos.y + 45 }}
        active={isRitual && settings.ritualParticles}
      />

      {/* 6. Auspicious Floating Fortune Pill (Layer 6) */}
      <FortuneMessage
        message={fortuneMessage}
        position={{ x: charmState.pos.x, y: charmState.pos.y }}
        visible={isFortuneVisible && settings.fortuneMessagesEnabled}
        onComplete={() => {
          setIsFortuneVisible(false);
          setFortuneMessage('');
        }}
      />

      {/* 7. Dedicated Visual Charm Picker Popover */}
      <CharmPicker
        isOpen={isCharmPickerOpen}
        onClose={() => setIsCharmPickerOpen(false)}
        selectedCharmId={settings.selectedCharm}
        onSelectCharm={(id) => {
          updateSettings({ selectedCharm: id });
        }}
      />

      {/* 8. Dedicated Visual Pet Picker Popover */}
      <PetPicker
        isOpen={isPetPickerOpen}
        onClose={() => setIsPetPickerOpen(false)}
        selectedPetId={settings.selectedPet}
        showPet={settings.showPet}
        onSelectPet={(id, enabled) => {
          updateSettings({ selectedPet: id, showPet: enabled });
        }}
      />

      {/* 9. Settings Fallback Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSettings}
        onResetPosition={handleResetPosition}
        onResetAllSettings={resetAllSettings}
        initialTab={settingsTab}
      />

      {/* 10. Onboarding Modal for First Launch after Activation */}
      {!settings.hasCompletedOnboarding && (
        <OnboardingModal
          isOpen={!settings.hasCompletedOnboarding}
          onHangItUp={handleCompleteOnboarding}
        />
      )}
    </div>
  );
};

export default App;
