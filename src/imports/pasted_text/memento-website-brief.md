MEMENTO — SINGLE-PAGE CHARM COLLECTION WEBSITE

Build a polished, production-quality single-page website for Memento, a desktop companion app where users collect charming digital companions that live on their desktop.

Core concept

Memento is about collecting little companions.

The website should feel like a digital collectible cabinet, not a normal SaaS landing page and not a traditional e-commerce store.

The primary interaction is:

Browse the collection → select a charm → the selected charm appears hanging from the top-right of the page.

The hanging charm should feel like the physical/digital manifestation of the Memento concept.

1. Overall visual direction

Use the uploaded POP MART screenshots as layout and interaction references only.

Do NOT copy POP MART's branding, logo, typography, colors, navigation, product copy, or exact UI.

Create an original Memento identity.

Visual personality
Premium
Playful
Collectible
Minimal
Slightly nostalgic
Character-focused
Clean editorial layout
Lots of breathing room
White/light neutral foundation
Black typography
Subtle borders
Soft neutral backgrounds
Character artwork should be the visual focus

Avoid:

Generic SaaS gradients
Excessive glassmorphism
AI-style landing pages
Overly childish UI
Excessive rounded cards
Huge unnecessary hero sections
Dark gaming aesthetic
Copying POP MART
2. Header

Create a clean minimal header.

Left:

MEMENTO

Center navigation:

Collection
Characters
About

Right:

Search icon
Download
Small user/collection icon if appropriate

Keep the header approximately 72–80px high.

Make it sticky while scrolling.

On mobile, collapse navigation into a clean menu.

3. Hero / introduction

Do NOT create a huge conventional SaaS hero.

Create a compact editorial introduction.

Headline:

Little things worth keeping.

Supporting text:

Collect charming companions and let them live on your desktop.

Primary CTA:

Explore Collection

Secondary CTA:

Get Memento

The hero should visually transition immediately into the collection.

4. THE MOST IMPORTANT FEATURE — HANGING MEMENTO

Create a fixed/sticky hanging charm on the top-right side of the viewport.

This is the signature interaction of the website.

Position

The charm should hang from approximately:

80–85% viewport width

and:

0–10px from the top edge

The string/rope extends downward from the top edge.

The charm hangs naturally below the string.

Example conceptual structure:

                    ────────
                         │
                         │
                         │
                         🪬
                         
                         
MEMENTO
Little things worth keeping.

[ Collection grid... ]

The hanging charm should remain visible while the user scrolls.

Do not let it block important content.

On smaller screens, automatically reposition it so it doesn't cover the collection grid.

5. Hanging charm behavior

The hanging charm must be data-driven.

Do NOT hardcode one image.

Create a central charm data structure.

Example:

const charms = [
  {
    id: "maneki-neko",
    name: "Maneki Neko",
    image: "...",
    category: "Lucky",
  },
  {
    id: "evil-eye",
    name: "Evil Eye",
    image: "...",
    category: "Protection",
  },
  {
    id: "hamsa",
    name: "Hamsa",
    image: "...",
    category: "Protection",
  }
];

The exact artwork should use the provided/project charm assets.

6. Charm selection interaction

The entire collection grid must be interactive.

When the user clicks/taps a charm:

Immediately:
Mark that charm as selected.
Update the hanging charm image.
Update the hanging charm name.
Update any relevant metadata.
Preserve the user's scroll position.
Do NOT navigate to another page.

The page should remain a single-page experience.

7. Transition when changing charms

When the selected charm changes, animate the hanging charm.

Do NOT simply swap the image instantly.

Use a subtle transition:

Current charm
     ↓
slight swing / rotation
     ↓
image transition
     ↓
new charm settles

The animation should feel like a real hanging object.

Keep it elegant and fast:

approximately 400–700ms

Do not create exaggerated bouncing.

Once the new charm settles:

ZERO continuous idle movement.

The charm should remain completely still.

This is important.

8. Rope / hanging string

The rope should visually connect:

top anchor
    │
    │
    │
 attachment point
    ↓
  charm

The charm must never appear disconnected from the rope.

The rope should be:

Thin
Minimal
Slightly textured if appropriate
Neutral/dark
Visually subordinate to the charm

The rope should terminate at the actual attachment point of the charm, not the center of the artwork.

9. COLLECTION SECTION

This is the main section of the website.

Heading:

Collect your Mementos.

Supporting text:

Discover companions to keep on your desktop.

Then show all available charms in one collection grid.

Use the uploaded POP MART collection screenshot as inspiration for the density and browsing behavior.

10. Collection grid

Desktop:

6 columns

Tablet:

4 columns

Mobile:

2 columns

Each item should contain:

┌─────────────────────┐
│                     │
│      CHARACTER      │
│                     │
│                     │
└─────────────────────┘

MANEKI NEKO
Lucky

Use very light neutral backgrounds behind character artwork.

Avoid heavy card shadows.

Avoid excessive rounded corners.

Characters should have enough space to be clearly visible.

11. Selected charm state

When a charm is selected:

Add a subtle visual border
Slightly change the background
Show a small Selected indicator
Keep the character artwork unchanged
Do not enlarge the entire card dramatically

Example:

┌─────────────────────┐
│                     │
│       🐱            │
│                     │
└─────────────────────┘
      MANEKI NEKO
         Selected

Only one charm can be selected at a time.

12. Hover interaction

Desktop hover:

Slight image scale: approximately 1.02–1.04
Very subtle upward movement
Name becomes slightly stronger
Cursor becomes pointer

Do NOT create excessive animations.

The product should feel premium and calm.

13. Collection categories

Above the grid, provide simple filter controls:

All

Lucky

Protection

Cute

Animals

Characters

The default should be:

All

Show every charm.

Changing a category should filter the grid without navigating away.

The hanging charm should remain visible.

If the currently selected charm is filtered out, keep the hanging charm visible until another charm is selected.

14. Search

Add a simple collection search.

Placeholder:

Search Mementos

Searching:

"cat"

should show matching charms.

Search should filter the collection instantly.

No page reload.

15. Charm information

When a charm is selected, show a small information panel near the hanging charm or beneath the collection introduction.

Example:

MANEKI NEKO

The little one that brings good fortune.

Lucky · Classic · Companion

Keep descriptions short.

Do not make this look like a traditional e-commerce product page.

The focus is collecting, not purchasing.

16. Desktop companion connection

After the collection section, introduce what Memento actually is.

Heading:

They don't just belong in your collection.

Supporting text:

Bring your Mementos to life on your desktop.

Show a large visual/mockup of the Memento desktop application.

Demonstrate:

Charm hanging beside the screen
Desktop environment
Different companions
Subtle interaction
Collection switching

CTA:

Download Memento

Secondary:

Meet the companions

17. Physical + digital concept

Create a section explaining that Memento can eventually bridge digital and physical collecting.

Heading:

Keep them close.

Supporting text:

Collect them digitally. Bring your favorites into the real world.

Visually show:

Digital Memento → Physical Memento

Do not make this section feel like an e-commerce product launch yet.

It should communicate the larger ecosystem.

18. Collection philosophy

Add a simple editorial section:

Every collection starts with one.

Then display several characters arranged loosely around the page.

Copy:

Start with one companion.
Discover another.
Build a collection that's yours.

This should feel emotional and collectible rather than sales-heavy.

19. Final CTA

End with a strong but minimal section.

Find your first Memento.

Supporting text:

A little companion for your desktop.

Button:

Get Memento

Secondary:

Explore Collection

20. Footer

Minimal footer:

MEMENTO

Navigation:

Collection
Characters
About
Download
Privacy
Terms

Social:

Instagram
X
YouTube

Copyright:

© 2026 Memento

21. Responsive behavior
Desktop

The hanging charm is prominently visible in the top-right.

Collection:

6 columns

Tablet

Collection:

4 columns

Move the hanging charm slightly inward if necessary.

Mobile

Collection:

2 columns

The hanging charm should become smaller and move toward the upper-right corner.

It must never cover:

Navigation
Character names
Buttons
Search
Collection cards

The interaction must remain fully usable with touch.

22. Important implementation requirements

Build the collection from a single reusable charm data array.

Do NOT manually create separate components for every charm.

Use:

Charm data
     ↓
Collection grid
     ↓
Selected charm state
     ↓
Hanging charm
     ↓
Information panel

There must be one source of truth for the selected charm.

When:

selectedCharm = charms[5]

everything associated with the selected charm should update automatically.

23. Asset requirements

Use the actual Memento charm artwork/assets provided by the project.

Do NOT:

Generate random replacement characters
Use generic stock illustrations
Use random AI-generated characters
Replace the user's existing charm artwork
Copy POP MART character artwork

The uploaded screenshots are visual references for layout and collection presentation, not assets to reproduce.

24. Animation philosophy

Animation should communicate physical presence.

Use motion only where meaningful:

Selecting a charm → subtle swing
Hovering → subtle scale
Filtering → smooth grid transition
Scrolling → natural reveal

Do NOT add:

Constant floating
Random movement
Continuous swinging
Excessive parallax
Confetti
Cursor-following effects
Unnecessary gradients
Sound effects

After interaction, the hanging charm should return to a perfectly still resting state.

25. Final design principle

The website should make the user feel:

“I want to see what companions I can collect.”

Not:

“This is another desktop utility.”

The collection is the hero.

The hanging charm is the signature interaction.

The desktop application is the reason these characters exist.

Build the entire experience around that relationship.

MEMENTO

Little things worth keeping.