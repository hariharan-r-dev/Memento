import React, { useState, useEffect } from 'react';
import {
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
  KeyRound,
  CheckCircle2,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useSettings, DEFAULT_SETTINGS } from '../../stores/settingsStore';
import type { AppSettings } from '../../stores/settingsStore';
import { ALL_CHARMS } from '../../charms/registry';
import { ALL_PETS } from '../../pets/registry';
import { useLicense } from '../../stores/licenseStore';
import {
  SettingRow,
  SettingToggle,
  SettingSlider,
  SettingsSection,
} from './SettingRow';
import './settings.css';

export type SettingsTab =
  | 'general'
  | 'license'
  | 'charms'
  | 'pets'
  | 'rope'
  | 'physics'
  | 'sound'
  | 'rituals'
  | 'notifications'
  | 'shortcut'
  | 'about';

// Safely emit settings updates to Tauri
const emitTauri = async (event: string, payload?: unknown) => {
  try {
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      const { emit } = await import('@tauri-apps/api/event');
      await emit(event, payload);
    }
  } catch (_e) {}
};

// Safely invoke Tauri commands
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

export const SettingsWindowView: React.FC = () => {
  const { settings, updateSettings, resetAllSettings } = useSettings();
  const {
    isActivated,
    licenseKey,
    plan,
    planName,
    entitlements,
    ownedMementos,
    deviceId,
    deactivateLicense,
    isCharmOwned,
  } = useLicense();
  const [activeTab, setActiveTab] = useState<SettingsTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'appearance') return 'rope';
      if (tab) return tab as SettingsTab;
    }
    return 'general';
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [charmCategoryFilter, setCharmCategoryFilter] = useState<string>('all');

  // Ensure Settings Window document and root have full pointer-events interactivity
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('settings-window');
      document.body.classList.add('settings-window');
      document.documentElement.style.pointerEvents = 'auto';
      document.body.style.pointerEvents = 'auto';
      const root = document.getElementById('root');
      if (root) {
        root.style.pointerEvents = 'auto';
      }
    }
  }, []);

  // Sync settings update to main overlay
  const handleUpdate = (partial: Partial<AppSettings>) => {
    updateSettings(partial);
    emitTauri('settings-updated', partial);
  };

  // Listen for tab navigation events from Tauri
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    const setup = async () => {
      try {
        if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
          const { listen } = await import('@tauri-apps/api/event');
          unlisten = await listen<string>('navigate-tab', (event) => {
            if (event.payload) {
              const tab = event.payload === 'appearance' ? 'rope' : (event.payload as SettingsTab);
              setActiveTab(tab);
            }
          });
        }
      } catch (_e) {}
    };
    setup();
    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const navItems: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <ShieldCheck style={{ width: 16, height: 16 }} /> },
    { id: 'license', label: 'License & Plan', icon: <KeyRound style={{ width: 16, height: 16 }} /> },
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
    <div className="settings-window-container">
      {/* 1. Desktop Preferences Navigation Sidebar */}
      <aside className="settings-sidebar">
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

        {/* Small subtle application identity at bottom */}
        <div className="settings-sidebar-brand">
          <span style={{ color: '#F59E0B', fontSize: '12px' }}>✦</span>
          <span>Lucky Charm Preferences</span>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="settings-content-pane">
        {/* ========================================================= */}
        {/* TAB 1: GENERAL */}
        {/* ========================================================= */}
        {activeTab === 'general' && (
          <div>
            <div className="settings-page-header">
              <h1 className="settings-page-title">General</h1>
              <p className="settings-page-desc">
                Control how Lucky Charm behaves on your desktop.
              </p>
            </div>

            <SettingsSection title="Display & Placement">
              <SettingRow
                label="Show Hanging Charm"
                description="Display talisman attached to the top bezel."
              >
                <SettingToggle
                  checked={settings.showCharm}
                  onChange={(checked) => handleUpdate({ showCharm: checked })}
                />
              </SettingRow>

              <SettingRow
                label="Always on Top"
                description="Keep charm floating above other windows."
              >
                <SettingToggle
                  checked={settings.alwaysOnTop}
                  onChange={(checked) => handleUpdate({ alwaysOnTop: checked })}
                />
              </SettingRow>

              <SettingRow
                label="Launch on Startup"
                description="Start Lucky Charm automatically when Windows boots."
              >
                <SettingToggle
                  checked={settings.launchAtStartup}
                  onChange={(checked) => handleUpdate({ launchAtStartup: checked })}
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
                  onChange={(v) => handleUpdate({ charmSize: v })}
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
                  onChange={(v) => handleUpdate({ charmOpacity: v })}
                />
              </SettingRow>
            </SettingsSection>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: LICENSE & PLAN */}
        {/* ========================================================= */}
        {activeTab === 'license' && (
          <div>
            <div className="settings-page-header">
              <h1 className="settings-page-title">License & Plan</h1>
              <p className="settings-page-desc">
                View your active Memento license, plan details, and device status.
              </p>
            </div>

            <SettingsSection title="Subscription & Plan">
              <SettingRow
                label="Plan Tier"
                description={planName ? `Active entitlement: ${planName}` : 'No active license found.'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isActivated ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', fontSize: '12px', fontWeight: 600 }}>
                      <CheckCircle2 style={{ width: 13, height: 13 }} />
                      <span>{planName || 'Activated'}</span>
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', fontSize: '12px', fontWeight: 600 }}>
                      Not Activated
                    </span>
                  )}
                </div>
              </SettingRow>

              <SettingRow
                label="Entitlements"
                description="Customization & talisman capacity."
              >
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                  {entitlements?.customization ? 'Customization Enabled · ' : 'Standard Mode · '}
                  {entitlements?.maxMementos ? `Up to ${entitlements.maxMementos} Mementos` : 'Standard'}
                </span>
              </SettingRow>

              <SettingRow
                label="License Key"
                description="Assigned license key for this workstation."
              >
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '12px', color: '#CBD5E1', letterSpacing: '0.05em' }}>
                  {licenseKey ? `${licenseKey.substring(0, 8)}••••••••${licenseKey.slice(-4)}` : '—'}
                </span>
              </SettingRow>

              <SettingRow
                label="Device ID"
                description="Unique identifier for hardware binding."
              >
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '11px', color: '#64748B' }}>
                  {deviceId}
                </span>
              </SettingRow>
            </SettingsSection>

            <SettingsSection title="Unlocked Mementos">
              <div className="settings-card" style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: 8 }}>
                  {plan === 'memento_complete'
                    ? 'All 11 Mementos unlocked with your Complete plan.'
                    : `You have ${ownedMementos.length} Mementos unlocked on this license.`}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ALL_CHARMS.map((charm) => {
                    const isOwned = !isActivated || (plan === 'memento_complete') || ownedMementos.includes(charm.id);
                    return (
                      <span
                        key={charm.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: '11px',
                          fontWeight: isOwned ? 600 : 400,
                          backgroundColor: isOwned ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                          color: isOwned ? '#FBBF24' : '#64748B',
                          border: isOwned ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        {isOwned ? '✓' : '🔒'} {charm.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </SettingsSection>

            {isActivated && (
              <SettingsSection title="License Management">
                <div className="settings-card">
                  <div className="settings-row">
                    <div className="settings-row-info">
                      <div className="settings-row-title">Deactivate on this Device</div>
                      <div className="settings-row-desc">
                        Release this device binding to transfer your license to another machine.
                      </div>
                    </div>
                    <div className="settings-row-control">
                      {showDeactivateConfirm ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            type="button"
                            onClick={async () => {
                              await deactivateLicense();
                              await invokeTauri('deactivate_license');
                              setShowDeactivateConfirm(false);
                              await invokeTauri('hide_main_window');
                              await invokeTauri('open_activation_window');
                            }}
                            className="settings-button settings-button-danger"
                          >
                            Confirm Deactivate
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDeactivateConfirm(false)}
                            className="settings-button"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowDeactivateConfirm(true)}
                          className="settings-button settings-button-danger"
                        >
                          <LogOut style={{ width: 13, height: 13 }} />
                          <span>Deactivate</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </SettingsSection>
            )}

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
              <a
                href="https://buymemento.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#F59E0B',
                  fontSize: '12px',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                <span>Manage Plan & Purchases on Website</span>
                <ExternalLink style={{ width: 12, height: 12 }} />
              </a>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CHARMS */}
        {/* ========================================================= */}
        {activeTab === 'charms' && (
          <div>
            <div className="settings-page-header">
              <h1 className="settings-page-title">Charms</h1>
              <p className="settings-page-desc">
                Choose the talisman displayed on your desktop.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="settings-tab-pills">
              {[
                { id: 'all', label: 'All' },
                { id: 'devotional', label: 'Devotional' },
                { id: 'cultural', label: 'Cultural' },
                { id: 'cars', label: 'Cars' },
                { id: 'protection', label: 'Protection' },
                { id: 'prosperity', label: 'Prosperity' },
                { id: 'calm', label: 'Calm' },
                { id: 'goals', label: 'Goals' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCharmCategoryFilter(cat.id)}
                  className={`settings-tab-pill ${charmCategoryFilter === cat.id ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="settings-section">
              <div className="settings-section-title">Choose your talisman</div>
              <div className="settings-grid-2col">
                {ALL_CHARMS.filter((c) => {
                  if (charmCategoryFilter === 'all') return true;
                  if (charmCategoryFilter === 'cultural') {
                    return c.category === 'cultural' || c.region !== 'Global';
                  }
                  return c.category === charmCategoryFilter;
                }).map((charm) => {
                  const isSelected =
                    settings.selectedCharm === charm.id ||
                    (settings.selectedCharm === 'lucky-cat' && charm.id === 'maneki-neko');
                  const isOwned = !isActivated || (plan === 'memento_complete') || isCharmOwned(charm.id);
                  const ArtworkComponent = charm.artwork;
                  return (
                    <button
                      key={charm.id}
                      type="button"
                      onClick={() => {
                        if (isOwned) {
                          handleUpdate({ selectedCharm: charm.id });
                        }
                      }}
                      className={`settings-item-card ${isSelected ? 'selected' : ''} ${!isOwned ? 'opacity-65' : ''}`}
                    >
                      <div className="card-preview">
                        <ArtworkComponent
                          scale={0.62}
                          angle={0}
                          isHovered={isSelected}
                          isRitual={false}
                          pawWavePhase={1.0}
                          bellJingle={0.4}
                        />
                      </div>
                      <div className="card-footer">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="card-name">{charm.name}</div>
                          <div className="card-tag">
                            {charm.category.charAt(0).toUpperCase() + charm.category.slice(1)} · {charm.region} {!isOwned && '· 🔒 Locked'}
                          </div>
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

        {/* ========================================================= */}
        {/* TAB 3: PETS */}
        {/* ========================================================= */}
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
                  onChange={(checked) => handleUpdate({ showPet: checked })}
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
                      onClick={() => handleUpdate({ selectedPet: pet.id, showPet: true })}
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
                  onChange={(v) => handleUpdate({ petSize: v })}
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
                  onChange={(v) => handleUpdate({ petOpacity: v })}
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
                  onChange={(v) => handleUpdate({ petBehaviorIntensity: v })}
                />
              </SettingRow>
            </SettingsSection>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ROPE */}
        {/* ========================================================= */}
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
                  onChange={(v) => handleUpdate({ ropeLength: v })}
                />
              </SettingRow>

              <SettingRow
                label="Rope Style"
                description="Braided cord style and traditional color palette."
              >
                <select
                  value={settings.ropeStyle}
                  onChange={(e) => handleUpdate({ ropeStyle: e.target.value as any })}
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

        {/* ========================================================= */}
        {/* TAB 5: PHYSICS */}
        {/* ========================================================= */}
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
                  onChange={(v) => handleUpdate({ swingIntensity: v })}
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
                  onChange={(v) => handleUpdate({ damping: v })}
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
                  onChange={(v) => handleUpdate({ bounciness: v })}
                />
              </SettingRow>
            </SettingsSection>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: SOUND */}
        {/* ========================================================= */}
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
                  onChange={(checked) => handleUpdate({ soundEnabled: checked })}
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
                  onChange={(v) => handleUpdate({ soundVolume: v })}
                />
              </SettingRow>

              <SettingRow
                label="Ritual Sound"
                description="Auspicious bell chime during Lucky Ritual."
              >
                <SettingToggle
                  checked={settings.ritualSound && settings.ritualSoundEnabled}
                  onChange={(checked) => handleUpdate({ ritualSound: checked, ritualSoundEnabled: checked })}
                />
              </SettingRow>

              <SettingRow
                label="Pet Sounds"
                description="Cheerful sounds when interacting with companion."
              >
                <SettingToggle
                  checked={settings.petSoundsEnabled && settings.bellSoundEnabled}
                  onChange={(checked) => handleUpdate({ petSoundsEnabled: checked, bellSoundEnabled: checked })}
                />
              </SettingRow>
            </SettingsSection>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: RITUALS */}
        {/* ========================================================= */}
        {activeTab === 'rituals' && (
          <div>
            <div className="settings-page-header">
              <h1 className="settings-page-title">Rituals</h1>
              <p className="settings-page-desc">
                Configure the visual and audio effects used during Lucky Ritual.
              </p>
            </div>

            <SettingsSection title="Lucky Ritual Settings">
              <SettingRow
                label="Lucky Ritual"
                description="Trigger fortune blessing on charm double-click."
              >
                <SettingToggle
                  checked={settings.enableRitual}
                  onChange={(checked) => handleUpdate({ enableRitual: checked })}
                />
              </SettingRow>

              <SettingRow
                label="Ritual Sound"
                description="Play resonant chime when ritual begins."
              >
                <SettingToggle
                  checked={settings.ritualSound}
                  onChange={(checked) => handleUpdate({ ritualSound: checked })}
                />
              </SettingRow>

              <SettingRow
                label="Ritual Particles"
                description="Golden sparkle burst during ritual blessing."
              >
                <SettingToggle
                  checked={settings.ritualParticles}
                  onChange={(checked) => handleUpdate({ ritualParticles: checked })}
                />
              </SettingRow>

              <SettingRow
                label="Fortune Messages"
                description="Display uplifting fortune pill on ritual completion."
              >
                <SettingToggle
                  checked={settings.fortuneMessagesEnabled}
                  onChange={(checked) => handleUpdate({ fortuneMessagesEnabled: checked })}
                />
              </SettingRow>
            </SettingsSection>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: NOTIFICATIONS */}
        {/* ========================================================= */}
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
                  onChange={(checked) => handleUpdate({ notificationsEnabled: checked })}
                />
              </SettingRow>

              <SettingRow
                label="Fortune Notifications"
                description="Receive periodic auspicious fortune notifications."
              >
                <SettingToggle
                  checked={settings.ritualNotificationsEnabled}
                  onChange={(checked) => handleUpdate({ ritualNotificationsEnabled: checked })}
                />
              </SettingRow>
            </SettingsSection>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 9: SHORTCUT */}
        {/* ========================================================= */}
        {activeTab === 'shortcut' && (
          <div>
            <div className="settings-page-header">
              <h1 className="settings-page-title">Shortcut</h1>
              <p className="settings-page-desc">
                Configure the global hotkey to toggle Lucky Charm visibility.
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
                  padding: '5px 12px',
                  background: '#162035',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FDE68A',
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
                  onClick={() => {
                    emitTauri('reset-position');
                    const centerX = typeof window !== 'undefined' ? Math.round(window.innerWidth / 2) : 960;
                    handleUpdate({ anchorX: centerX });
                  }}
                  className="settings-button"
                >
                  <RotateCcw style={{ width: 13, height: 13 }} />
                  <span>Reset Position</span>
                </button>
              </SettingRow>
            </SettingsSection>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 10: ABOUT */}
        {/* ========================================================= */}
        {activeTab === 'about' && (
          <div>
            <div className="settings-page-header">
              <h1 className="settings-page-title">About</h1>
              <p className="settings-page-desc">
                Application information and credits.
              </p>
            </div>

            <SettingsSection title="Lucky Charm">
              <SettingRow
                label="Version"
                description="Lucky Charm Desktop"
              >
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '12px', fontWeight: 600, color: '#FDE68A' }}>
                  0.1.0
                </span>
              </SettingRow>

              <SettingRow
                label="About"
                description="A small desktop companion for your workspace."
              >
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>
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
                            resetAllSettings();
                            setShowResetConfirm(false);
                            emitTauri('settings-updated', DEFAULT_SETTINGS);
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
  );
};

export default SettingsWindowView;
