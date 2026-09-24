import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router'

const GSF = '"GRAD" 0, "ROND" 0, "wdth" 100'
const DMS = '"opsz" 14'

export default function Root() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    setMobileMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-parchment" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* ── Header ─────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center px-6 md:px-10 transition-all duration-300 ${
          scrolled || !isHome
            ? 'bg-[rgba(250,250,247,0.96)] backdrop-blur-[12px] border-b border-[rgba(17,17,16,0.08)]'
            : 'bg-transparent'
        }`}
      >
        <Link
          to="/"
          className="text-ink text-[14px] font-normal uppercase shrink-0 hover:opacity-70 transition-opacity"
          style={{ letterSpacing: '2.52px', fontVariationSettings: DMS }}
        >
          MEMENTO
        </Link>

        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8">
          {[
            { label: 'Collection', to: '/#collection' },
            { label: 'Characters', to: '/' },
            { label: 'About', to: '/' },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="text-ash text-[12px] font-normal hover:text-ink transition-colors duration-200"
              style={{ fontVariationSettings: DMS }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            className="hidden md:flex items-center gap-2 text-[12px] font-semibold border border-[rgba(17,17,16,0.2)] px-5 py-2.5 rounded-[12px] hover:bg-ink hover:text-parchment hover:border-ink transition-all duration-200 cursor-pointer"
            style={{ fontVariationSettings: DMS }}
          >
            Download
          </button>
          <button
            className="md:hidden text-ash hover:text-ink p-1 cursor-pointer"
            onClick={() => setMobileMenuOpen(v => !v)}
          >
            <MenuIcon open={mobileMenuOpen} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-[72px] left-0 right-0 bg-parchment border-b border-bone px-6 py-6 flex flex-col gap-5 md:hidden">
            {[
              { label: 'Collection', to: '/#collection' },
              { label: 'Characters', to: '/' },
              { label: 'About', to: '/' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-ash hover:text-ink"
              >
                {label}
              </Link>
            ))}
            <button className="text-left text-sm font-medium">Download</button>
          </div>
        )}
      </header>

      {/* ── Page Content ───────────────────────────────── */}
      <Outlet />

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-[#f1efe2] px-6 md:px-14 lg:px-[56px] pt-[48px] pb-[48px]">
        {/* Row 1: MEMENTO + nav links */}
        <div className="flex items-start justify-between">
          <Link
            to="/"
            className="text-ink text-[14px] font-normal uppercase hover:opacity-70 transition-opacity"
            style={{ letterSpacing: '2.52px', fontVariationSettings: DMS }}
          >
            MEMENTO
          </Link>

          <div className="flex flex-wrap gap-x-8 gap-y-3 justify-end">
            {[
              { label: 'Collection', to: '/#collection' },
              { label: 'Characters', to: '/' },
              { label: 'About', to: '/' },
              { label: 'Download', to: '/' },
              { label: 'Privacy', to: '/privacy' },
              { label: 'Terms', to: '/terms' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-[12px] font-normal text-ash hover:text-ink transition-colors"
                style={{ fontVariationSettings: DMS }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Row 2: copyright + socials */}
        <div className="flex items-center justify-between mt-[48px]">
          <p
            className="text-[12px] font-normal text-stone"
            style={{ fontVariationSettings: DMS }}
          >
            © 2026 Memento
          </p>
          <div className="flex gap-5">
            {['Instagram', 'X', 'YouTube'].map(social => (
              <a
                key={social}
                href="#"
                className="text-[12px] font-normal text-stone hover:text-ash transition-colors"
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontVariationSettings: GSF,
                  letterSpacing: '1px',
                }}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      {open ? (
        <>
          <line x1="4" y1="4" x2="16" y2="16" />
          <line x1="16" y1="4" x2="4" y2="16" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="17" y2="6" />
          <line x1="3" y1="10" x2="17" y2="10" />
          <line x1="3" y1="14" x2="17" y2="14" />
        </>
      )}
    </svg>
  )
}
