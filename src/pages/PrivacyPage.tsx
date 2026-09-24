import { Link } from 'react-router'

const GSF = '"GRAD" 0, "ROND" 0, "wdth" 100'
const DMS = '"opsz" 14'

const LAST_UPDATED = 'September 2026'

type Section = {
  heading: string
  body?: string
  items?: string[]
}

const sections: Section[] = [
  {
    heading: '1. Our approach to privacy',
    body: 'Memento is a desktop companion app, not an advertising platform. We collect the minimum information needed to make Memento work and improve it. We do not sell your data. We do not share it with third parties for marketing.',
  },
  {
    heading: '2. What we collect',
    items: [
      'Account information — if you create an account, we store your email address and a hashed password. We use this to sync your collection across devices.',
      "Collection data — which companions you've collected and your preferences. This is stored to restore your collection if you reinstall.",
      'Crash reports — if Memento crashes, we receive an anonymized report describing what went wrong. This contains no personal information.',
      'Usage analytics — aggregate, anonymized data about which features are used most. We use this to improve the app. This data cannot be traced back to you.',
    ],
  },
  {
    heading: '3. What we do not collect',
    items: [
      'We do not read or access the contents of your files, applications, or desktop.',
      'We do not capture screenshots of your screen.',
      'We do not sell, rent, or trade your information.',
      'We do not track your activity outside of Memento.',
    ],
  },
  {
    heading: '4. How we use your data',
    items: [
      'To provide the Memento service — syncing your collection, restoring purchases.',
      'To improve Memento — understanding which features are loved, which need work.',
      'To communicate with you — if you opt in, we may send you updates about new collections or features.',
    ],
  },
  {
    heading: '5. Data storage',
    body: 'Your data is stored on secure servers. We use industry-standard encryption for data in transit and at rest. We retain your data for as long as your account is active, or as needed to provide services.',
  },
  {
    heading: '6. Third-party services',
    body: 'Memento uses a small number of third-party services to operate. Each is selected for privacy-first practices. We do not permit these services to use your data for their own marketing.',
  },
  {
    heading: '7. Your rights',
    items: [
      'You can request a copy of the data we hold about you.',
      'You can request deletion of your account and associated data.',
      'You can opt out of analytics at any time in the app settings.',
      'You can contact us with any privacy concerns at hello@memento.app.',
    ],
  },
  {
    heading: '8. Children',
    body: 'Memento is not directed at children under 13. We do not knowingly collect data from children.',
  },
  {
    heading: '9. Changes to this policy',
    body: "We may update this Privacy Policy as Memento grows. We'll notify you of significant changes through the app or by email if you've provided one. Continued use after changes constitutes acceptance.",
  },
  {
    heading: '10. Open questions',
    body: "Privacy matters and we take it seriously. If something here is unclear or you have a concern, reach us at hello@memento.app — we're a small team and we read everything.",
  },
]

export default function PrivacyPage() {
  return (
    <main className="pt-[72px] px-6 md:px-14 lg:px-[56px]">
      {/* Page header */}
      <div className="border-b border-bone pb-[60px] pt-[96px]">
        <h1
          className="text-[48px] font-semibold leading-[48px] text-ink not-italic mb-[18px]"
          style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
        >
          Privacy Policy
        </h1>
        <p
          className="text-[14px] font-normal leading-[20px] text-ash"
          style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
        >
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-[672px] pt-[48px] pb-[80px] space-y-8">
        <p
          className="text-[14px] font-normal leading-[22.75px] text-ash"
          style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
        >
          We built Memento because we believe your desktop should feel personal. Your privacy is part
          of that. Here's exactly what we collect, why, and what you can do about it.
        </p>

        {sections.map((s, i) => (
          <div key={i} className="pt-[32px]">
            <h2
              className="text-[16px] font-normal leading-[24px] tracking-[0.25px] text-ink mb-[14px]"
              style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
            >
              {s.heading}
            </h2>
            {s.items ? (
              <ul className="space-y-3">
                {s.items.map((item, j) => (
                  <li key={j} className="flex gap-3 items-start">
                    <span
                      className="text-[14px] font-normal leading-[22.75px] text-stone shrink-0"
                      style={{ fontVariationSettings: DMS }}
                    >
                      –
                    </span>
                    <span
                      className="text-[14px] font-normal leading-[22.75px] text-ash"
                      style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className="text-[14px] font-normal leading-[22.75px] text-ash"
                style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
              >
                {s.body}
              </p>
            )}
          </div>
        ))}

        <div className="pt-10 border-t border-bone">
          <Link
            to="/terms"
            className="text-[14px] font-normal leading-[22.75px] text-ash border-b border-stone/40 pb-px hover:text-ink hover:border-ink transition-colors"
            style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
          >
            Read our Terms of Service
          </Link>
        </div>
      </div>
    </main>
  )
}
