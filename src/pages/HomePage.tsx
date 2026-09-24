import { useState, useRef } from 'react'
import { charms, CATEGORIES, type Charm, type CharmCategory } from '../data/charms'
import { CharmArt } from '../components/CharmArt'

const GSF = '"GRAD" 0, "ROND" 0, "wdth" 100'
const DMS = '"opsz" 14'

type PricingCardProps = {
  title: string
  price: string
  billing: string
  tagline: string
  features: string[]
  cta: string
  highlighted?: boolean
}

function PricingCard({ title, price, billing, tagline, features, cta, highlighted }: PricingCardProps) {
  return (
    <div
      className={`flex flex-col px-6 py-8 rounded-[12px] border cursor-pointer hover:-translate-y-0.5 transition-transform duration-200 ${
        highlighted
          ? 'bg-ivory border-[rgba(17,17,16,0.3)]'
          : 'bg-parchment border-bone'
      }`}
      style={{ borderWidth: '0.8px' }}
    >
      {/* Header */}
      <div className="pb-6" style={{ minHeight: '115px' }}>
        <p
          className="text-[14px] font-normal leading-[20px] text-ink"
          style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
        >
          {title}
        </p>
        <p
          className="text-[28px] font-normal leading-[36px] text-ink mt-4"
          style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
        >
          {price}
        </p>
        <p
          className="text-[11px] font-normal leading-[15px] text-stone mt-1"
          style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
        >
          {billing}
        </p>
      </div>

      <div className="bg-bone h-px mb-6 shrink-0" />

      <p
        className="text-[12px] font-normal leading-[19.5px] text-[#595853] mb-6"
        style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
      >
        {tagline}
      </p>

      <ul className="space-y-2.5 mb-8 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex gap-2.5 items-start">
            <span
              className="text-[12px] font-normal leading-[16px] text-amber shrink-0 mt-px"
              style={{ fontVariationSettings: DMS }}
            >
              ✓
            </span>
            <span
              className="text-[12px] font-normal leading-[16px] text-[#595853]"
              style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full text-[14px] font-medium leading-[15px] tracking-[0.25px] py-[14px] rounded-[12px] border transition-all duration-200 cursor-pointer ${
          highlighted
            ? 'bg-ink text-parchment border-ink hover:bg-ink/85'
            : 'bg-transparent text-ink border-[rgba(17,17,16,0.2)] hover:border-ink/60'
        }`}
        style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
      >
        {cta}
      </button>
    </div>
  )
}

export default function HomePage() {
  const [selectedCharm, setSelectedCharm] = useState<Charm>(charms[0])
  const [displayCharm, setDisplayCharm] = useState<Charm>(charms[0])
  const [isSwinging, setIsSwinging] = useState(false)
  const [activeCategory, setActiveCategory] = useState<'All' | CharmCategory>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const collectionRef = useRef<HTMLElement>(null)
  const swingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSelect = (charm: Charm) => {
    if (charm.id === selectedCharm.id) return
    if (swingTimer.current) clearTimeout(swingTimer.current)
    setSelectedCharm(charm)
    setIsSwinging(true)
    swingTimer.current = setTimeout(() => setDisplayCharm(charm), 300)
    swingTimer.current = setTimeout(() => setIsSwinging(false), 720)
  }

  const filtered = charms.filter(c => {
    const matchCat = activeCategory === 'All' || c.category === activeCategory
    const matchSearch =
      searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchCat && matchSearch
  })

  const scrollToCollection = () =>
    collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <>
      {/* ── Hanging Charm ──────────────────────────────── */}
      <div
        className="fixed z-40 top-0 hidden sm:flex flex-col items-center"
        style={{ right: 'clamp(60px, 14%, 180px)' }}
      >
        <div
          className={isSwinging ? 'charm-swinging' : ''}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div className="bg-ink/25 mx-auto" style={{ width: '1px', height: '72px' }} />
          <div className="relative">
            <CharmArt
              key={displayCharm.id}
              id={displayCharm.id}
              className="w-16 h-16 md:w-20 md:h-20 charm-appear drop-shadow-sm"
            />
          </div>
          <p
            className="text-center text-[9px] md:text-[10px] text-ash uppercase mt-1.5 leading-tight"
            style={{ letterSpacing: '0.18em' }}
          >
            {displayCharm.name}
          </p>
          <div className="h-px w-8 bg-bone my-2" />
          <p className="text-center text-[9px] text-stone max-w-[80px] leading-snug hidden md:block">
            {displayCharm.description}
          </p>
          <div className="hidden md:flex flex-wrap justify-center gap-1 mt-2 max-w-[90px]">
            {displayCharm.tags.map(tag => (
              <span
                key={tag}
                className="text-[8px] tracking-wide text-ash border border-stone/40 px-1.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="pt-[120px] pb-16 px-6 md:px-14 lg:px-[56px]">
        <div className="max-w-2xl">
          <h1
            className="text-[48px] font-medium leading-[1.3] mb-[18px] text-ink not-italic"
            style={{
              fontFamily: 'var(--font-headline)',
              fontVariationSettings: GSF,
            }}
          >
            <span className="block">Little things</span>
            <span className="block">worth keeping.</span>
          </h1>
          <p
            className="text-[18px] font-normal leading-[1.3] tracking-[0.25px] text-ash mb-10 max-w-[320px]"
            style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
          >
            Collect charming companions and let them live on your desktop.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={scrollToCollection}
              className="bg-ink text-parchment text-[14px] font-medium px-7 py-[14px] rounded-[12px] hover:bg-ink/85 transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-sans)', fontVariationSettings: DMS }}
            >
              Explore Collection
            </button>
            <button
              className="text-ink text-[14px] font-medium px-7 py-[14px] rounded-[12px] border border-[rgba(17,17,16,0.2)] hover:border-ink/60 transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-sans)', fontVariationSettings: DMS }}
            >
              Get Memento
            </button>
          </div>
        </div>
      </section>

      {/* ── Collection Section ─────────────────────────── */}
      <section
        ref={collectionRef}
        id="collection"
        className="px-6 md:px-14 lg:px-[56px] pb-24 pt-[72px] border-t border-bone"
      >
        <div className="mb-12">
          <h2
            className="text-[32px] font-medium leading-[40px] mb-3 text-ink"
            style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
          >
            Collect your Mementos.
          </h2>
          <p
            className="text-[16px] font-normal leading-[24px] tracking-[0.25px] text-ash"
            style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
          >
            Discover companions to keep on your desktop.
          </p>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[12px] font-medium px-4 py-2 rounded-[12px] border transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-ink text-parchment border-ink'
                    : 'border-bone text-ash hover:border-stone hover:text-ink'
                }`}
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontVariationSettings: GSF,
                  borderWidth: '0.8px',
                  letterSpacing: activeCategory === cat ? '0.5px' : undefined,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="sm:ml-auto">
            <div
              className="flex items-center gap-2 border border-bone px-4 py-2 rounded-[12px] focus-within:border-stone transition-colors"
              style={{ borderWidth: '0.8px' }}
            >
              <SearchIcon />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Mementos"
                className="bg-transparent text-[12px] outline-none w-36 text-ink"
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontVariationSettings: GSF,
                  color: '#111110',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-stone hover:text-ash cursor-pointer text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-ash text-sm">
            No Mementos found. Try a different search.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-bone">
            {filtered.map(charm => {
              const isSelected = charm.id === selectedCharm.id
              return (
                <button
                  key={charm.id}
                  onClick={() => handleSelect(charm)}
                  className={`group relative bg-parchment p-4 pt-5 flex flex-col items-center text-center cursor-pointer transition-all duration-200 ${
                    isSelected ? 'bg-ivory' : 'hover:bg-ivory/60'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 ring-[0.8px] ring-ink/20 pointer-events-none" />
                  )}
                  <div className="aspect-square w-full flex items-center justify-center mb-4 overflow-hidden">
                    <CharmArt
                      id={charm.id}
                      className="w-[72%] h-[72%] transition-transform duration-300 ease-out group-hover:scale-[1.04] group-hover:-translate-y-0.5"
                    />
                  </div>
                  <p
                    className="text-[12px] font-medium leading-[12.5px] text-ink text-center mb-1"
                    style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
                  >
                    {charm.name}
                  </p>
                  <p
                    className="text-[11px] font-normal leading-[13.5px] tracking-[0.225px] text-stone text-center"
                    style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
                  >
                    {charm.category}
                  </p>
                  {isSelected && (
                    <p className="text-[9px] text-amber tracking-[0.12em] uppercase mt-1.5">
                      Selected
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </section>

      {/* ── Desktop Companion Section ──────────────────── */}
      <section className="px-6 md:px-14 lg:px-[56px] py-24 border-t border-bone">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] tracking-[0.22em] text-amber uppercase mb-6">Desktop App</p>
              <h2
                className="text-3xl md:text-4xl font-medium leading-[1.1] mb-6 text-ink"
                style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
              >
                They don't just belong in your collection.
              </h2>
              <p
                className="text-[16px] font-normal leading-[24px] text-ash mb-8 max-w-sm"
                style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
              >
                Bring your Mementos to life on your desktop. They hang beside your work, wait for
                you between tasks, and make your screen feel a little more alive.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  className="bg-ink text-parchment text-[14px] font-semibold px-7 py-[14px] rounded-[12px] hover:bg-ink/85 transition-colors cursor-pointer"
                  style={{ fontFamily: 'var(--font-sans)', fontVariationSettings: DMS }}
                >
                  Download Memento
                </button>
                <button
                  className="text-ink text-[14px] font-semibold px-7 py-[14px] rounded-[12px] border border-[rgba(17,17,16,0.2)] hover:border-ink/60 transition-colors cursor-pointer"
                  style={{ fontFamily: 'var(--font-sans)', fontVariationSettings: DMS }}
                >
                  Meet the companions
                </button>
              </div>
            </div>
            <DesktopMockup charm={displayCharm} />
          </div>
        </div>
      </section>

      {/* ── Pricing Section ────────────────────────────── */}
      <section className="px-6 md:px-14 lg:px-[56px] py-24 border-t border-bone">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <h2
              className="text-[36px] font-medium text-ink mb-4"
              style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
            >
              Build your collection.
            </h2>
            <p
              className="text-[16px] font-normal leading-[24px] text-ash max-w-sm"
              style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
            >
              Start with the essentials, collect more, or create something that's uniquely yours.
            </p>
          </div>

          <div className="relative">
            {/* "For Collectors" badge centered above middle card */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-[10px] z-10 bg-ink px-3 py-1 rounded-[12px] whitespace-nowrap hidden md:block"
            >
              <p
                className="text-[9px] font-normal leading-[13.5px] tracking-[0.25px] text-parchment"
                style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
              >
                For Collectors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1 — Memento */}
              <PricingCard
                title="Memento"
                price="$2.99"
                billing="one-time"
                tagline="Start your collection."
                features={[
                  'All current standard collections',
                  'Cars · Nature · Devotional',
                  'Future standard updates',
                  'Windows + macOS',
                ]}
                cta="Get Memento"
              />

              {/* Card 2 — Custom Memento (highlighted) */}
              <PricingCard
                title="Custom Memento"
                price="$3.99"
                billing="starting from"
                tagline="Make something that's yours."
                features={[
                  'Create a personalized Memento',
                  'Create from your own idea',
                ]}
                cta="Create a Memento"
                highlighted
              />

              {/* Card 3 — Memento+ */}
              <PricingCard
                title="Memento+"
                price="$4.99"
                billing="one-time"
                tagline="For those who want a little more."
                features={[
                  'Everything in Memento',
                  'Premium Mementos',
                  'Exclusive collections',
                  'Advanced customization',
                  'Limited-edition Mementos',
                  'Early access to new collections',
                  'Memento+ exclusive drops',
                ]}
                cta="Get Memento+"
              />
            </div>
          </div>

          <p
            className="text-center text-[11px] font-normal leading-[15px] tracking-[0.65px] uppercase text-stone mt-10"
            style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
          >
            One purchase. No recurring subscription.
          </p>
        </div>
      </section>

      {/* ── Final CTA Section ──────────────────────────── */}
      <section className="px-6 md:px-14 lg:px-[56px] py-24 border-t border-bone text-center">
        <h2
          className="text-[48px] md:text-[60px] font-medium italic leading-[63px] mb-6 text-ink"
          style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
        >
          Find your first Memento.
        </h2>
        <p
          className="text-[16px] font-medium leading-[24px] text-ash mb-12 max-w-[320px] mx-auto"
          style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
        >
          A little companion for your desktop.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            className="bg-ink text-parchment text-[14px] font-semibold px-10 py-[14px] rounded-[12px] hover:bg-ink/85 transition-colors cursor-pointer"
            style={{ fontFamily: 'var(--font-sans)', fontVariationSettings: DMS }}
          >
            Get Memento
          </button>
          <button
            onClick={scrollToCollection}
            className="text-ink text-[14px] font-semibold px-10 py-[14px] rounded-[12px] border border-[rgba(17,17,16,0.2)] hover:border-ink/60 transition-colors cursor-pointer"
            style={{ fontFamily: 'var(--font-sans)', fontVariationSettings: DMS }}
          >
            Explore Collection
          </button>
        </div>
      </section>
    </>
  )
}

/* ── Sub-components ────────────────────────────────── */

function DesktopMockup({ charm }: { charm: Charm }) {
  return (
    <div className="relative select-none">
      <div className="rounded-lg overflow-hidden border border-bone bg-ivory shadow-sm">
        <div className="flex items-center gap-1.5 px-4 py-3 bg-bone/60 border-b border-bone">
          <div className="w-3 h-3 rounded-full bg-stone/50" />
          <div className="w-3 h-3 rounded-full bg-stone/50" />
          <div className="w-3 h-3 rounded-full bg-stone/50" />
        </div>
        <div className="relative h-56 md:h-64 bg-gradient-to-br from-stone/10 to-bone overflow-hidden">
          <div className="absolute top-6 left-6 right-20 bottom-6 bg-parchment/80 border border-stone/30 rounded shadow-sm">
            <div className="h-6 bg-ivory border-b border-bone flex items-center px-3 gap-1.5">
              <div className="w-2 h-2 rounded-full bg-stone/40" />
              <div className="w-2 h-2 rounded-full bg-stone/40" />
              <div className="w-2 h-2 rounded-full bg-stone/40" />
            </div>
            <div className="p-4 space-y-2">
              <div className="h-2 bg-bone rounded w-3/4" />
              <div className="h-2 bg-bone rounded w-1/2" />
              <div className="h-2 bg-bone rounded w-5/6" />
              <div className="h-2 bg-bone rounded w-2/3" />
            </div>
          </div>
          <div className="absolute top-0 right-6 flex flex-col items-center">
            <div className="w-px h-10 bg-ink/20" />
            <CharmArt key={charm.id} id={charm.id} className="w-14 h-14 drop-shadow-md charm-appear" />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-16 h-3 bg-stone/30 border border-bone/60 mt-0" />
      </div>
      <div className="flex justify-center">
        <div className="w-32 h-2 bg-stone/20 border-x border-b border-bone/60" />
      </div>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" className="text-ash shrink-0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="5.5" />
      <line x1="12.5" y1="12.5" x2="16" y2="16" />
    </svg>
  )
}


