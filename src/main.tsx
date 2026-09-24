import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SettingsWindowView } from './components/Settings/SettingsWindowView'

const isSettingsWindow = typeof window !== 'undefined' && window.location.search.includes('window=settings');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isSettingsWindow ? <SettingsWindowView /> : <App />}
  </StrictMode>,
)

