import React from 'react';
import './settings.css';

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingRow: React.FC<SettingRowProps> = ({
  label,
  description,
  children,
}) => {
  return (
    <div className="settings-row">
      <div className="settings-row-info">
        <div className="settings-row-title">{label}</div>
        {description && (
          <div className="settings-row-desc">{description}</div>
        )}
      </div>
      <div className="settings-row-control">{children}</div>
    </div>
  );
};

interface SettingToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const SettingToggle: React.FC<SettingToggleProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`settings-toggle ${checked ? 'checked' : ''}`}
    >
      <div className="settings-toggle-thumb" />
    </button>
  );
};

interface SettingSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  formatValue?: (val: number) => string;
  onChange: (val: number) => void;
}

export const SettingSlider: React.FC<SettingSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  formatValue = (v) => `${v}`,
  onChange,
}) => {
  return (
    <div className="settings-slider-wrap">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="settings-slider-input"
      />
      <span className="settings-slider-badge">
        {formatValue(value)}
      </span>
    </div>
  );
};

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  return (
    <div className="settings-section">
      {title && (
        <div className="settings-section-title">
          {title}
        </div>
      )}
      <div className="settings-card">{children}</div>
    </div>
  );
};
