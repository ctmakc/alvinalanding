# Alvina Landing: Critique And Redesign Brief

Updated: `2026-04-06`

## Brutal Review Of The Current Version

### 1. It still looks generated

- Too many rounded blocks, floating notes, and decorative overlays.
- The page still reads like a premium template for a generic realtor, not a site built from Alvina's actual public brand.
- The visual language says "designed landing page." It does not say "real Ottawa agent with an active public presence."

### 2. The hero is trying to do five jobs at once

- Oversized headline.
- Too much copy before trust is established.
- Too many supporting widgets competing with the portrait.
- Decorative proof blocks that feel invented rather than earned.

Result: the visitor spends energy decoding the layout instead of understanding the offer.

### 3. The content is backwards

- The old page explains structure and strategy instead of selling Alvina directly.
- Phrases about funnels, positioning, and brand systems are internal design language, not client-facing language.
- Buyers and sellers do not need a meta-explanation of the page. They need a clear reason to trust her and take the next step.

### 4. There is too much page for one landing

The previous structure acted like a mini-site:

- hero
- buyer path
- seller path
- proof
- social
- guides
- contact

The result is diluted intent. The landing should do one thing: move visitors into buyer help, seller help, guide request, or direct contact.

### 5. The photography system is weak

- The page relied on polished portrait imagery but did not use public brand materials strongly enough.
- It felt art-directed around image placeholders instead of around real-world source material.
- Supporting visuals were either repetitive or visually too "perfect," which makes the whole page feel less trustworthy.

## Public Source Inventory

These are the sources the redesign should explicitly use as signal, tone, and asset input.

### Facebook

Source:
- `https://www.facebook.com/AlvinaUsherOttawaRealEstate1Expert`

Public metadata retrieved on `2026-04-06`:
- `6,406 likes`
- `471 talking about this`
- `12+ yrs`
- positioning around helping Ottawa buyers and sellers

Usable asset:
- public profile image downloaded locally as [facebook-profile.jpg](/data/projects/alvinalanding/alvinalanding/assets/source-social/facebook-profile.jpg)

### Instagram

Source:
- `https://www.instagram.com/alvinaottawarealestateexpert/`

Public metadata retrieved on `2026-04-06`:
- `482 followers`
- `1,340 following`
- `1,561 posts`
- bio includes direct phone, email, brokerage, website, and `#ottawarealestate`

Usable asset:
- public profile image downloaded locally as [instagram-profile.jpg](/data/projects/alvinalanding/alvinalanding/assets/source-social/instagram-profile.jpg)

### Brokerage Profile

Source:
- `https://detailsrealty.ca/our-agents.html/alvina-usher/`

Usable asset:
- public headshot downloaded locally as [details-headshot.jpg](/data/projects/alvinalanding/alvinalanding/assets/source-social/details-headshot.jpg)

### Editorial / Educational Signal

Source:
- `https://nashaottawa.ca/ru/node/1653`

Title captured on `2026-04-06`:
- `Недвижимость Оттавы 2025: цены, продажи и прогноз | Жилищный Навигатор | Alvina Usher | Наша Оттава`

What matters:
- market explanation
- buyer and seller education
- advisory tone
- practical guidance instead of sales fluff

## Technical Limitation

Public HTML from Facebook and Instagram currently exposes profile-level metadata and profile imagery, but not a clean machine-readable gallery of post images. That means:

- stable public profile assets can be used now
- counts, bios, and public positioning can be used now
- a larger photo pull from actual posts will require a live logged-in browser session or manual asset export

The redesign should not wait for that. It should already improve massively using the assets and signals above.

## Redesign Goal

Build a landing page that feels:

- direct
- editorial
- personal
- credible
- more human
- less templated
- less decorative

## Content Strategy

### New core message

The page should sound like:

- an experienced Ottawa realtor
- calm and practical
- active in public
- educational, not gimmicky
- useful to buyers and sellers right now

### What to remove

- any copy that explains the redesign itself
- generic "strategy" filler
- repeated mentions of funnels, architecture, or brand system logic
- duplicate CTAs with identical meaning
- social sections that exist only to show more boxes

### What to add

- short headline
- short proof-led paragraph
- concrete public signals
- stronger buyer path
- stronger seller path
- cleaner guide offer
- faster contact close

## UI Direction

### Keep

- strong typography
- warm but restrained palette
- one dominant portrait in hero
- clear CTA hierarchy

### Remove

- stacked floating cards
- extra decorative portrait crops
- visual filler that competes with the main message
- repetitive rounded-card rhythm across every section

### New visual language

- editor-style layout
- stronger contrast
- fewer containers
- longer horizontal lines
- more negative space
- proof presented as a ledger or rail, not as more "feature cards"

## Final Page Structure

1. Hero
2. Public proof rail
3. Buyer / seller split
4. Guides block
5. Contact close

Nothing else unless it materially improves conversion.

## Section-Level Requirements

### Hero

- one sharp headline
- one supporting paragraph
- two CTAs max
- one source-backed stat row
- one main portrait
- one compact source note

### Public proof rail

- lead with source-backed trust
- include Facebook, Instagram, and editorial/market signals
- use compact text blocks, not sales cards

### Buyer / seller split

- each side gets a distinct promise
- each side gets three bullets max
- copy must sound practical and local
- seller side can reference listing efficiency / pricing / 3% offer context without turning the whole page into discount marketing

### Guides

- treat the two guides as real lead magnets
- keep copy short
- use existing guide covers

### Contact

- reduce fluff
- show immediate reasons to contact now
- keep phone, email, website, brokerage profile visible

## Production Notes

- prefer the public Facebook portrait as the hero image because it feels more human and less synthetic
- keep Instagram and brokerage imagery as supporting proof, not as decorative clutter
- do not hotlink social CDN assets in production when local copies exist
- if more social photos are later exported from a logged-in browser, swap them into the proof layer without changing page structure
