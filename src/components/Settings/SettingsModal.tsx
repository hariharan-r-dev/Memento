import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Palette,
  PawPrint,
  Cable,
  Activity,
  Volume2,
  Sparkles,
  Bell,
  Keyboard,
  Info,
  RotateCcw,
} from 'lucide-react';
import type { AppSettings } from '../../stores/settingsStore';
import { ALL_CHARMS } from '../../charms/registry';
import { ALL_PETS } from '../../pets/registry';
import {
  SettingRow,
  SettingToggle,
  SettingSlider,
  SettingsSection,
} from './SettingRow';
import './settings.css';

export type SettingsTab =
  | 'general'
  | 'charms'
  | 'pets'
  | 'rope'
  | 'physics'
  | 'sound'
  | 'rituals'
  | 'notifications'
  | 'shortcut'
  | 'about';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdate: (partial: Partial<AppSettings>) => void;
  onResetPosition?: () => void;
  onResetAllSettings?: () => void;
  initialTab?: SettingsTab;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdate,
  onResetPosition,
  onResetAllSettings,
  initialTab = 'general',
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const navItems: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <ShieldCheck style={{ width: 16, height: 16 }} /> },
    { id: 'charms', label: 'Charms', icon: <Palette style={{ width: 16, height: 16 }} /> },
    { id: 'pets', label: 'Pets', icon: <PawPrint style={{ width: 16, height: 16 }} /> },
    { id: 'rope', label: 'Rope', icon: <Cable style={{ width: 16, height: 16 }} /> },
    { id: 'physics', label: 'Physics', icon: <Activity style={{ width: 16, height: 16 }} /> },
    { id: 'sound', label: 'Sound', icon: <Volume2 style={{ width: 16, height: 16 }} /> },
    { id: 'rituals', label: 'Rituals', icon: <Sparkles style={{ width: 16, height: 16 }} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell style={{ width: 16, height: 16 }} /> },
    { id: 'shortcut', label: 'Shortcut', icon: <Keyboard style={{ width: 16, height: 16 }} /> },
    { id: 'about', label: 'About', icon: <Info style={{ width: 16, height: 16 }} /> },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        userSelect: 'none',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '860px',
          maxWidth: '92vw',
          height: '600px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            height: '44px',
            backgroundColor: '#F9FAFB',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#D97706', fontWeight: 'bold', fontSize: '13px' }}>✦</span>
            <span style={{ fontWeight: 600, fontSize: '13px', color: '#111827' }}>
              Memento Preferences
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: '#6B7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Main Body */}
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* Sidebar */}
          <aside className="settings-sidebar" style={{ height: '100%' }}>
            <div className="settings-nav-list">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`settings-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="settings-sidebar-brand">
              <span style={{ color: '#D97706', fontSize: '12px' }}>✦</span>
              <span>Preferences</span>
            </div>
          </aside>

          {/* Content Pane */}
          <main className="settings-content-pane">
            {/* 1. GENERAL */}
            {activeTab === 'general' && (
              <div>
                <div className="settings-page-header">
                  <h1 className="settings-page-title">General</h1>
                  <p className="settings-page-desc">
                    Control how Memento behaves on your desktop.
                  </p>
                </div>

                <SettingsSection title="Display & Placement">
                  <SettingRow
                    label="Show Hanging Charm"
                    description="Display talisman attached to the top bezel."
                  >
                    <SettingToggle
                      checked={settings.showCharm}
                      onChange={(checked) => onUpdate({ showCharm: checked })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Always on Top"
                    description="Keep charm floating above other windows."
                  >
                    <SettingToggle
                      checked={settings.alwaysOnTop}
                      onChange={(checked) => onUpdate({ alwaysOnTop: checked })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Launch on Startup"
                    description="Start Memento automatically when Windows boots."
                  >
                    <SettingToggle
                      checked={settings.launchAtStartup}
                      onChange={(checked) => onUpdate({ launchAtStartup: checked })}
                    />
                  </SettingRow>
                </SettingsSection>

                <SettingsSection title="Appearance">
                  <SettingRow
                    label="Charm Size"
                    description="Adjust talisman scale on display."
                  >
                    <SettingSlider
                      value={settings.charmSize}
                      min={0.7}
                      max={1.5}
                      step={0.05}
                      formatValue={(v) => `${Math.round(v * 100)}%`}
                      onChange={(v) => onUpdate({ charmSize: v })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Charm Opacity"
                    description="Transparency level of hanging charm."
                  >
                    <SettingSlider
                      value={settings.charmOpacity}
                      min={0.3}
                      max={1.0}
                      step={0.05}
                      formatValue={(v) => `${Math.round(v * 100)}%`}
                      onChange={(v) => onUpdate({ charmOpacity: v })}
                    />
                  </SettingRow>
                </SettingsSection>
              </div>
            )}

            {/* 2. CHARMS */}
            {activeTab === 'charms' && (
              <div>
                <div className="settings-page-header">
                  <h1 className="settings-page-title">Charms</h1>
                  <p className="settings-page-desc">
                    Choose the talisman displayed on your desktop.
                  </p>
                </div>

                <div className="settings-section">
                  <div className="settings-section-title">Choose your charm</div>
                  <div className="settings-grid-2col">
                    {ALL_CHARMS.map((charm) => {
                      const isSelected =
                        settings.selectedCharm === charm.id ||
                        (settings.selectedCharm === 'lucky-cat' && charm.id === 'maneki-neko');
                      const ArtworkComponent = charm.artwork;
                      return (
                        <button
                          key={charm.id}
                          type="button"
                          onClick={() => onUpdate({ selectedCharm: charm.id })}
                          className={`settings-item-card ${isSelected ? 'selected' : ''}`}
                        >
                          <div className="card-preview">
                            <ArtworkComponent
                              scale={0.56}
                              angle={0}
                              isHovered={isSelected}
                              isRitual={false}
                            />
                          </div>
                          <div className="card-footer">
                            <div>
                              <div className="card-name">{charm.name}</div>
                              <div className="card-tag">{charm.shortDescription}</div>
                            </div>
                            {isSelected && <span className="card-check">✓</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 3. PETS */}
            {activeTab === 'pets' && (
              <div>
                <div className="settings-page-header">
                  <h1 className="settings-page-title">Pets</h1>
                  <p className="settings-page-desc">
                    Choose a desktop companion.
                  </p>
                </div>

                <SettingsSection title="Companion Mode">
                  <SettingRow
                    label="Desktop Companion"
                    description="Enable animated companion roaming at the bottom of your screen."
                  >
                    <SettingToggle
                      checked={settings.showPet}
                      onChange={(checked) => onUpdate({ showPet: checked })}
                    />
                  </SettingRow>
                </SettingsSection>

                <div className="settings-section">
                  <div className="settings-section-title">Choose your companion</div>
                  <div className="settings-grid-2col">
                    {ALL_PETS.map((pet) => {
                      const isSelected = settings.selectedPet === pet.id;
                      const ArtworkComponent = pet.artwork;
                      return (
                        <button
                          key={pet.id}
                          type="button"
                          onClick={() => onUpdate({ selectedPet: pet.id, showPet: true })}
                          className={`settings-item-card ${isSelected ? 'selected' : ''}`}
                        >
                          <div className="card-preview">
                            <ArtworkComponent
                              state="IDLE"
                              direction="right"
                              isHovered={isSelected}
                              scale={0.75}
                            />
                          </div>
                          <div className="card-footer">
                            <div>
                              <div className="card-name">{pet.name}</div>
                              <div className="card-tag">{pet.subtitle}</div>
                            </div>
                            {isSelected && <span className="card-check">✓</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <SettingsSection title="Companion Settings">
                  <SettingRow
                    label="Pet Size"
                    description="Adjust desktop pet scale on screen."
                  >
                    <SettingSlider
                      value={settings.petSize}
                      min={0.7}
                      max={1.5}
                      step={0.05}
                      formatValue={(v) => `${Math.round(v * 100)}%`}
                      onChange={(v) => onUpdate({ petSize: v })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Pet Opacity"
                    description="Transparency of desktop companion."
                  >
                    <SettingSlider
                      value={settings.petOpacity}
                      min={0.3}
                      max={1.0}
                      step={0.05}
                      formatValue={(v) => `${Math.round(v * 100)}%`}
                      onChange={(v) => onUpdate({ petOpacity: v })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Behavior Intensity"
                    description="How frequently the pet wanders and interacts."
                  >
                    <SettingSlider
                      value={settings.petBehaviorIntensity}
                      min={0.5}
                      max={1.8}
                      step={0.05}
                      formatValue={(v) => `${v.toFixed(2)}x`}
                      onChange={(v) => onUpdate({ petBehaviorIntensity: v })}
                    />
                  </SettingRow>
                </SettingsSection>
              </div>
            )}

            {/* 4. ROPE */}
            {activeTab === 'rope' && (
              <div>
                <div className="settings-page-header">
                  <h1 className="settings-page-title">Rope</h1>
                  <p className="settings-page-desc">
                    Adjust the appearance and length of the hanging string.
                  </p>
                </div>

                <SettingsSection title="Cord Appearance">
                  <SettingRow
                    label="Rope Length"
                    description="Distance the talisman hangs from top screen bezel."
                  >
                    <SettingSlider
                      value={settings.ropeLength}
                      min={90}
                      max={220}
                      step={5}
                      formatValue={(v) => `${v}px`}
                      onChange={(v) => onUpdate({ ropeLength: v })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Rope Style"
                    description="Braided cord style and traditional color palette."
                  >
                    <select
                      value={settings.ropeStyle}
                      onChange={(e) => onUpdate({ ropeStyle: e.target.value as any })}
                      className="settings-select"
                    >
                      <option value="red-white">Red & White (Shinto Celebration)</option>
                      <option value="gold">Auspicious Gold (Solar Radiance)</option>
                      <option value="indigo">Indigo Mizuhiki (Protection & Calm)</option>
                      <option value="natural">Natural Twine (Sacred Twine)</option>
                      <option value="black">Obsidian Minimal (Modern Cord)</option>
                    </select>
                  </SettingRow>
                </SettingsSection>
              </div>
            )}

            {/* 5. PHYSICS */}
            {activeTab === 'physics' && (
              <div>
                <div className="settings-page-header">
                  <h1 className="settings-page-title">Physics</h1>
                  <p className="settings-page-desc">
                    Adjust how the charm responds to physical interaction.
                  </p>
                </div>

                <SettingsSection title="Pendulum & Chain Dynamics">
                  <SettingRow
                    label="Swing Intensity"
                    description="Natural gravity and momentum pull strength."
                  >
                    <SettingSlider
                      value={settings.swingIntensity}
                      min={0.5}
                      max={1.8}
                      step={0.05}
                      formatValue={(v) => `${v.toFixed(2)}x`}
                      onChange={(v) => onUpdate({ swingIntensity: v })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Damping"
                    description="Air resistance and how quickly the charm settles."
                  >
                    <SettingSlider
                      value={settings.damping}
                      min={0.5}
                      max={1.8}
                      step={0.05}
                      formatValue={(v) => `${v.toFixed(2)}x`}
                      onChange={(v) => onUpdate({ damping: v })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Bounciness"
                    description="Elastic cord stretchiness and rebound response."
                  >
                    <SettingSlider
                      value={settings.bounciness}
                      min={0.1}
                      max={0.9}
                      step={0.05}
                      formatValue={(v) => `${Math.round(v * 100)}%`}
                      onChange={(v) => onUpdate({ bounciness: v })}
                    />
                  </SettingRow>
                </SettingsSection>
              </div>
            )}

            {/* 6. SOUND */}
            {activeTab === 'sound' && (
              <div>
                <div className="settings-page-header">
                  <h1 className="settings-page-title">Sound</h1>
                  <p className="settings-page-desc">
                    Configure audio feedback for interactions and rituals.
                  </p>
                </div>

                <SettingsSection title="Audio Feedback">
                  <SettingRow
                    label="Sound Effects"
                    description="Master toggle for all audio feedback."
                  >
                    <SettingToggle
                      checked={settings.soundEnabled}
                      onChange={(checked) => onUpdate({ soundEnabled: checked })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Volume"
                    description="Overall audio playback loudness."
                  >
                    <SettingSlider
                      value={settings.soundVolume}
                      min={0.0}
                      max={1.0}
                      step={0.05}
                      formatValue={(v) => `${Math.round(v * 100)}%`}
                      onChange={(v) => onUpdate({ soundVolume: v })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Ritual Sound"
                    description="Auspicious bell chime during Daily Ritual."
                  >
                    <SettingToggle
                      checked={settings.ritualSound && settings.ritualSoundEnabled}
                      onChange={(checked) => onUpdate({ ritualSound: checked, ritualSoundEnabled: checked })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Pet Sounds"
                    description="Cheerful sounds when interacting with companion."
                  >
                    <SettingToggle
                      checked={settings.petSoundsEnabled && settings.bellSoundEnabled}
                      onChange={(checked) => onUpdate({ petSoundsEnabled: checked, bellSoundEnabled: checked })}
                    />
                  </SettingRow>
                </SettingsSection>
              </div>
            )}

            {/* 7. RITUALS */}
            {activeTab === 'rituals' && (
              <div>
                <div className="settings-page-header">
                  <h1 className="settings-page-title">Rituals</h1>
                  <p className="settings-page-desc">
                    Configure the visual and audio effects used during Daily Ritual.
                  </p>
                </div>

                <SettingsSection title="Ritual Settings">
                  <SettingRow
                    label="Ritual"
                    description="Trigger fortune blessing on charm double-click."
                  >
                    <SettingToggle
                      checked={settings.enableRitual}
                      onChange={(checked) => onUpdate({ enableRitual: checked })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Ritual Sound"
                    description="Play resonant chime when ritual begins."
                  >
                    <SettingToggle
                      checked={settings.ritualSound}
                      onChange={(checked) => onUpdate({ ritualSound: checked })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Ritual Particles"
                    description="Golden sparkle burst during ritual blessing."
                  >
                    <SettingToggle
                      checked={settings.ritualParticles}
                      onChange={(checked) => onUpdate({ ritualParticles: checked })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Fortune Messages"
                    description="Display blessed fortune pill on ritual completion."
                  >
                    <SettingToggle
                      checked={settings.fortuneMessagesEnabled}
                      onChange={(checked) => onUpdate({ fortuneMessagesEnabled: checked })}
                    />
                  </SettingRow>
                </SettingsSection>
              </div>
            )}

            {/* 8. NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div>
                <div className="settings-page-header">
                  <h1 className="settings-page-title">Notifications</h1>
                  <p className="settings-page-desc">
                    Configure desktop notifications and alerts.
                  </p>
                </div>

                <SettingsSection title="System Alerts">
                  <SettingRow
                    label="Notifications"
                    description="Send native desktop notifications for fortunes and rituals."
                  >
                    <SettingToggle
                      checked={settings.notificationsEnabled}
                      onChange={(checked) => onUpdate({ notificationsEnabled: checked })}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Fortune Notifications"
                    description="Receive periodic auspicious fortune notifications."
                  >
                    <SettingToggle
                      checked={settings.ritualNotificationsEnabled}
                      onChange={(checked) => onUpdate({ ritualNotificationsEnabled: checked })}
                    />
                  </SettingRow>
                </SettingsSection>
              </div>
            )}

            {/* 9. SHORTCUT */}
            {activeTab === 'shortcut' && (
              <div>
                <div className="settings-page-header">
                  <h1 className="settings-page-title">Shortcut</h1>
                  <p className="settings-page-desc">
                    Configure the global hotkey to toggle Memento visibility.
                  </p>
                </div>

                <SettingsSection title="Global Hotkey">
                  <SettingRow
                    label="Global Shortcut"
                    description="Press anywhere to toggle charm visibility."
                  >
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 10px',
                      background: '#F3F4F6',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#111827',
                    }}>
                      Ctrl + Shift + D
                    </div>
                  </SettingRow>

                  <SettingRow
                    label="Reset Anchor Position"
                    description="Center hanging bracket on the top screen bezel."
                  >
                    <button
                      type="button"
                      onClick={() => onResetPosition && onResetPosition()}
                      className="settings-button"
                    >
                      <RotateCcw style={{ width: 13, height: 13 }} />
                      <span>Reset Position</span>
                    </button>
                  </SettingRow>
                </SettingsSection>
              </div>
            )}

            {/* 10. ABOUT */}
            {activeTab === 'about' && (
              <div>
                <div className="settings-page-header">
                  <h1 className="settings-page-title">About</h1>
                  <p className="settings-page-desc">
                    Application information and credits.
                  </p>
                </div>

                <SettingsSection title="Memento">
                  <SettingRow
                    label="Version"
                    description="Memento Desktop"
                  >
                    <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                      0.1.0
                    </span>
                  </SettingRow>

                  <SettingRow
                    label="About"
                    description="A small desktop companion for your workspace."
                  >
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>
                      Tauri 2 + React + TypeScript
                    </span>
                  </SettingRow>
                </SettingsSection>

                <div className="settings-section">
                  <div className="settings-section-title">Restore Defaults</div>
                  <div className="settings-card">
                    <div className="settings-row">
                      <div className="settings-row-info">
                        <div className="settings-row-title">Reset All Preferences</div>
                        <div className="settings-row-desc">Restore all settings to their factory default values.</div>
                      </div>
                      <div className="settings-row-control">
                        {showResetConfirm ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              type="button"
                              onClick={() => {
                                onResetAllSettings && onResetAllSettings();
                                setShowResetConfirm(false);
                              }}
                              className="settings-button settings-button-danger"
                            >
                              Confirm Reset
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowResetConfirm(false)}
                              className="settings-button"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowResetConfirm(true)}
                            className="settings-button settings-button-danger"
                          >
                            <RotateCcw style={{ width: 13, height: 13 }} />
                            <span>Reset All</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
