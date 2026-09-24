import { createBrowserRouter } from 'react-router'
import Root from './components/Root'
import HomePage from './pages/HomePage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'terms', Component: TermsPage },
      { path: 'privacy', Component: PrivacyPage },
    ],
  },
])
