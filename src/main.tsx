import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SettingsWindowView } from './components/Settings/SettingsWindowView'
import { ActivationWindowView } from './components/Activation/ActivationWindowView'

export const getWindowMode = (): 'settings' | 'activation' | 'main' => {
  if (typeof window === 'undefined') return 'main';

  // 1. Check Tauri v2 internal window/webview label metadata (synchronous & authoritative)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const internals = (window as any).__TAURI_INTERNALS__;
    const winLabel = internals?.metadata?.currentWindow?.label || internals?.metadata?.currentWebview?.label;
    if (winLabel === 'activation') return 'activation';
    if (winLabel === 'settings') return 'settings';
  } catch (_e) {}

  // 2. Injected window mode from Tauri initialization script
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).__MEMENTO_WINDOW_MODE__ === 'activation') return 'activation';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).__MEMENTO_WINDOW_MODE__ === 'settings') return 'settings';

  // 3. Synchronous URL Query Parameter check
  const search = window.location.search || '';
  if (search.includes('window=activation') || search.includes('activation')) return 'activation';
  if (search.includes('window=settings') || search.includes('settings')) return 'settings';

  // 4. Fallback check for hash / path / href / title tokens
  const hash = window.location.hash || '';
  const href = window.location.href || '';
  if (hash.includes('activation') || href.includes('activation')) return 'activation';
  if (hash.includes('settings') || href.includes('settings')) return 'settings';

  if (typeof document !== 'undefined' && document.title) {
    if (document.title.toLowerCase().includes('activation')) return 'activation';
    if (document.title.toLowerCase().includes('preference') || document.title.toLowerCase().includes('settings')) return 'settings';
  }

  return 'main';
};

const applyDocumentClasses = (mode: 'settings' | 'activation' | 'main') => {
  if (typeof document === 'undefined') return;
  const root = document.getElementById('root');

  if (mode === 'settings') {
    document.documentElement.className = 'settings-window';
    document.body.className = 'settings-window';
    document.documentElement.style.backgroundColor = '#0B1220';
    document.body.style.backgroundColor = '#0B1220';
    document.documentElement.style.pointerEvents = 'auto';
    document.body.style.pointerEvents = 'auto';
    if (root) {
      root.className = 'settings-window';
      root.style.backgroundColor = '#0B1220';
      root.style.pointerEvents = 'auto';
    }
  } else if (mode === 'activation') {
    document.documentElement.className = 'activation-window';
    document.body.className = 'activation-window';
    document.documentElement.style.backgroundColor = '#FFFFFF';
    document.body.style.backgroundColor = '#FFFFFF';
    document.documentElement.style.pointerEvents = 'auto';
    document.body.style.pointerEvents = 'auto';
    if (root) {
      root.className = 'activation-window';
      root.style.backgroundColor = '#FFFFFF';
      root.style.pointerEvents = 'auto';
    }
  } else {
    document.documentElement.className = '';
    document.body.className = '';
    document.documentElement.style.backgroundColor = 'transparent';
    document.body.style.backgroundColor = 'transparent';
    if (root) {
      root.className = '';
      root.style.backgroundColor = 'transparent';
    }
  }
};

// Immediate pre-render class application
applyDocumentClasses(getWindowMode());

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Memento] React error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, color: '#111827', background: '#FFFFFF', height: '100vh', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong</h2>
          <pre style={{ fontSize: 12, color: '#DC2626', marginTop: 12 }}>{this.state.error?.message || 'Unknown render error'}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const Root: React.FC = () => {
  const [mode, setMode] = React.useState<'settings' | 'activation' | 'main'>(() => getWindowMode());

  React.useEffect(() => {
    const detected = getWindowMode();
    if (detected !== mode) {
      setMode(detected);
    }
    applyDocumentClasses(detected);
  }, [mode]);

  if (mode === 'settings') {
    return (
      <ErrorBoundary>
        <SettingsWindowView />
      </ErrorBoundary>
    );
  }
  if (mode === 'activation') {
    return (
      <ErrorBoundary>
        <ActivationWindowView />
      </ErrorBoundary>
    );
  }
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)


