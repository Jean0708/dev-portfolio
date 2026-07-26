# Design QA

## Evidence

- Source visual truth:
  - `/var/folders/9z/bdrtng4j073554bq2s5wrbb00000gn/T/codex-clipboard-575ffd42-5e84-4aa2-88b9-ab9387332498.png`
  - `/Users/jean/Desktop/Jean的作品案例整理/10_IP设计/定格背景.png`
  - `/Users/jean/Desktop/Jean的作品案例整理/10_IP设计/小狗奔跑.mp4`
- Implementation:
  - `design-qa-implementation-home.png`
  - `design-qa-implementation-detail.png`
  - `design-qa-implementation-mobile-intro.png`
  - `design-qa-implementation-mobile-about.png`
- Combined comparison: `design-qa-comparison.png`
- Desktop viewport override: 1440 × 900 CSS px.
- Desktop screenshot pixels: 1425 × 891; device scale factor 1. No density normalization was required.
- Mobile viewport override: 390 × 844 CSS px; device scale factor 1.
- Source pixels: mood-board reference 736 × 1104; supplied hero still 1672 × 941.
- State: homepage after the first IP-video cycle, plus the initial video state, profile state, selected-work state, medical case detail, and PDF viewer state.

## Full-view comparison

The combined comparison places the mood-board reference, exact supplied meadow/IP still, and the browser-rendered homepage in one image. The implementation preserves the requested sky-and-meadow warmth, desktop-window framing, cream paper surfaces, high-contrast serif hierarchy, compact sans-serif labels, and a restrained lime accent. It converts the collage reference into a calmer portfolio composition instead of copying its dense slide layout.

## Focused region comparison

- Hero: browser captures verify both the full-window opening animation and the post-animation editorial layout.
- About: the mobile and desktop captures verify folder tabs, paper hierarchy, IP crop, and responsive stacking.
- Work: browser capture verifies real project images inside the folder-card system.
- Detail: browser capture verifies the dark secondary-page language and the live PDF document window.
- Additional pixel crops were not needed because the required typography, controls, imagery, and card edges are clearly readable in the captured desktop and mobile states.

## Findings

- No actionable P0, P1, or P2 issues remain.
- Fonts and typography: Instrument Serif and Inter produce the intended editorial/system contrast; Chinese copy uses the declared CJK fallback. Headline wrapping is controlled at desktop and mobile widths.
- Spacing and layout rhythm: the first viewport has a clear left-copy/right-window split, generous section breathing room, and a consistent 18–26 px component radius family. Mobile sections stack without horizontal overflow.
- Colors and visual tokens: meadow blue/green, warm cream, forest green, folder yellow, and lime accent map consistently across the homepage and dark case pages.
- Image quality and asset fidelity: the supplied IP video and still are used directly; project cards use original case imagery; no visible project imagery is replaced with a placeholder.
- Copy and content: project names and categories are grounded in the supplied case folders. Unconfirmed employment details are explicitly marked as content to refine rather than presented as facts.

## Comparison history

1. First desktop and mobile pass
   - P2: the Chinese hero headline wrapped too tightly on narrow screens.
   - P2: the medical case title orphaned its final character on desktop.
2. Fixes
   - Reduced and rebalanced hero headline sizing and line height, with desktop nowrap and mobile-specific wrapping.
   - Increased the detail-title measure and reduced its responsive maximum size.
   - Added anchor scroll margins so fixed navigation does not obscure section headings.
3. Post-fix evidence
   - `design-qa-implementation-home.png` shows the final hero hierarchy.
   - `design-qa-implementation-detail.png` shows the medical title on one line.
   - Mobile captures show the intro window and folder profile without overflow.

## Primary interactions tested

- IP video autoplay, fade monitoring, ended-state reveal, manual replay, and Skip Intro.
- Anchor navigation and section scrolling.
- Profile folder tabs and selected state.
- Project-card navigation to secondary routes.
- Dark case page, embedded PDF viewer, back navigation, and related-case links.
- Desktop and mobile responsive states.
- Browser console errors checked: none from the site.

## Follow-up polish

- P3: the next iteration can replace provisional biography and experience copy with the final resume wording.
- P3: project-card ordering, cover crops, and richer hover choreography can be refined after the homepage direction is approved.

final result: passed
