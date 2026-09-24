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
    heading: '1. Acceptance of terms',
    body: 'By downloading, installing, or using Memento, you agree to be bound by these Terms of Service. If you do not agree, please do not use Memento. These terms apply to the desktop application, this website, and any related services.',
  },
  {
    heading: '2. What Memento is',
    body: 'Memento is a desktop companion application that allows you to collect, display, and interact with digital characters on your computer. The application is provided for personal, non-commercial enjoyment.',
  },
  {
    heading: '3. Your collection',
    items: [
      'Charms and companions you collect within Memento are licensed to you, not sold. Your license is personal, non-transferable, and non-exclusive.',
      'We may add, modify, or retire companions from the available collection over time. We will give reasonable notice of significant changes.',
      'Do not attempt to extract, copy, or redistribute companion artwork or assets outside of the Memento application.',
    ],
  },
  {
    heading: '4. Acceptable use',
    items: [
      'Use Memento for its intended purpose — collecting and enjoying digital companions on your desktop.',
      'Do not reverse-engineer, decompile, or attempt to extract the source code of the application.',
      'Do not use Memento in any way that could harm our systems or other users.',
      "Do not create derivative works based on Memento's companion artwork without written permission.",
    ],
  },
  {
    heading: '5. Intellectual property',
    body: 'All companion artwork, application code, visual design, and branding associated with Memento are the exclusive property of Memento and its creators. Nothing in these terms grants you ownership of any intellectual property.',
  },
  {
    heading: '6. Updates and changes',
    body: 'We may release updates to Memento that change or add functionality. Some updates may be required for continued use. We may also change these Terms of Service from time to time. Continued use after a change constitutes acceptance of the revised terms.',
  },
  {
    heading: '7. Disclaimer of warranties',
    body: 'Memento is provided "as is" without warranties of any kind, express or implied. We do not warrant that the application will be error-free, uninterrupted, or meet your specific requirements. Use of Memento is at your own discretion and risk.',
  },
  {
    heading: '8. Limitation of liability',
    body: 'To the maximum extent permitted by law, Memento and its creators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the application or these services.',
  },
  {
    heading: '9. Governing law',
    body: 'These terms are governed by the laws of the jurisdiction in which Memento is incorporated, without regard to conflict of law provisions.',
  },
  {
    heading: '10. Contact',
    body: "Questions about these terms? Reach us at hello@memento.app — we're a small team and we read everything.",
  },
]

export default function TermsPage() {
  return (
    <main className="pt-[72px] px-6 md:px-14 lg:px-[56px]">
      {/* Page header */}
      <div className="border-b border-bone pb-[60px] pt-[80px]">
        <h1
          className="text-[48px] font-semibold leading-[48px] text-ink not-italic mb-[20px]"
          style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
        >
          Terms of Service
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
          These terms govern your use of Memento — the desktop application and this website. Please
          read them. They're written to be clear, not intimidating.
        </p>

        {sections.map((s, i) => (
          <div key={i} className="pt-[32px]">
            <h2
              className="text-[16px] font-normal leading-[24px] tracking-[0.25px] text-ink mb-[16px]"
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
            to="/privacy"
            className="text-[14px] font-normal leading-[22.75px] text-ash border-b border-stone/40 pb-px hover:text-ink hover:border-ink transition-colors"
            style={{ fontFamily: 'var(--font-headline)', fontVariationSettings: GSF }}
          >
            Read our Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  )
}
