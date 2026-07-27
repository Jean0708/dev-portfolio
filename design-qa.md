# Design QA — Resizable Case Window and Cinematic IP Intro

## Source visual truth

- Case window layout reference:
  - `/var/folders/9z/bdrtng4j073554bq2s5wrbb00000gn/T/codex-clipboard-ce8843fa-749e-4531-9131-eee2d770af63.png`
- Retro resizable-window style reference:
  - `/var/folders/9z/bdrtng4j073554bq2s5wrbb00000gn/T/codex-clipboard-af43ff07-f40a-4cc2-8fa2-d5b2ce7ca9b4.png`
- Frosted play-button reference:
  - `/var/folders/9z/bdrtng4j073554bq2s5wrbb00000gn/T/codex-clipboard-15c5ef7c-713e-4228-959f-8887bb969913.png`
- Draggable retro-window reference:
  - `/var/folders/9z/bdrtng4j073554bq2s5wrbb00000gn/T/codex-clipboard-c8dd6d3b-d920-48e2-97f9-8e60d2e1a022.png`
- Video edge-spacing correction reference:
  - `/var/folders/9z/bdrtng4j073554bq2s5wrbb00000gn/T/codex-clipboard-090c00c7-5069-4677-a3b0-c0ca373a512a.png`
- Supplied hero still:
  - `/Users/jean/Desktop/Jean的作品案例整理/10_IP设计/定格背景.png`
- Supplied hero video:
  - `/Users/jean/Desktop/Jean的作品案例整理/10_IP设计/小狗奔跑.mp4`

## Implementation evidence

- Implementation URL:
  - `http://localhost:3000/`
  - `http://localhost:3000/work/credit-activity`
- Case window desktop:
  - `/private/tmp/jean-resizable-window-desktop.png`
- Case window resized state:
  - `/private/tmp/jean-resizable-window-verified.png`
- Case window mobile:
  - `/private/tmp/jean-resizable-window-mobile.png`
- Hero initial state:
  - `/private/tmp/jean-hero-initial-glass-play.png`
- Hero expanded and playing:
  - `/private/tmp/jean-hero-expanded-playing.png`
- Hero final faded state:
  - `/private/tmp/jean-hero-final-faded.png`
- Hero draggable retro-window state:
  - `/private/tmp/jean-home-draggable-window.png`
- Case draggable retro-window state:
  - `/private/tmp/jean-case-draggable-window.png`
- Hero edge-to-edge video state:
  - `/private/tmp/jean-home-video-edge-to-edge-desktop.png`
- Side-by-side comparison boards:
  - `/private/tmp/jean-window-reference-comparison.png`
  - `/private/tmp/jean-hero-reference-comparison.png`
  - `/private/tmp/jean-draggable-window-reference-comparison.png`
  - `/private/tmp/jean-home-video-edge-reference-comparison-desktop.png`

## Viewports and normalization

- Case desktop CSS viewport: 1440 × 900.
- Case desktop screenshot: 1418 × 1812 pixels; browser density and visible-page capture retained.
- Case resized screenshot: 1425 × 891 pixels.
- Case mobile CSS viewport: 390 × 844.
- Case mobile screenshot: 375 × 812 pixels.
- Hero browser viewport: 454 × 690 CSS pixels and screenshot pixels.
- Frosted-button reference: 520 × 212 pixels.
- Retro-window reference: 736 × 1308 pixels.
- Comparison boards use contain-fit normalization on a shared neutral canvas. The references are style crops rather than full-page screens, so focused component comparison is used instead of claiming exact full-page scale equivalence.

## Full-view comparison

- The case page retains its dark portfolio context while the document viewer now carries the reference's classic desktop-window hierarchy: title bar, square window controls, menu row, canvas, status strip, and a visible resize corner.
- The hero preserves the supplied scenic background. The initial state uses a single frosted circular play icon with no explanatory copy. The expanded state becomes a full-background film layer, then fades away to reveal the final hero.
- The homepage animation window now uses the same forest-green title bar, paper menu strip, square window controls, and inner bevel as the case viewer. The compact window can be repositioned without changing the play interaction.
- The video/still now begins immediately below the menu strip and reaches the left, right, and bottom edges of the content area. The former 3–5 pixel inner grey frame has been removed.
- The final mobile hero keeps the headline above the dog subject without a single-character orphan line.

## Focused component comparison

- Play control: the implementation matches the reference's isolated circular play affordance and translucent glass treatment, while intentionally removing the attached text panel per the latest direction.
- Case window: the implementation translates the old desktop/Paint chrome into the portfolio's forest-green and paper palette without copying unrelated poster imagery.
- Resize affordance: the lower-right handle is visible, uses the existing Phosphor icon set, supports pointer dragging, double-click reset, and keyboard arrow resizing.
- Move affordance: both window title bars use the same move state and bounded positioning. Pointer dragging is the primary interaction; focused title bars also support keyboard arrow movement.

## Interaction verification

- Initial frosted play icon: visible and uniquely accessible.
- Click play: passed; hero enters `hero-expanded`, video begins, and the film window fills the hero.
- Edge-to-edge media: passed at 1174 × 682; no inner border or padding remains around the video viewport.
- Hover/skip affordance: skip control appears in the playing DOM and is the sole full-film interaction target.
- Click skip: passed; phase changes through fade to done, video opacity reaches zero, and playback pauses.
- Natural video ending: passed; film fades out and the still-background hero remains.
- Case minimize and expand: passed; height changes to 40 pixels and restores.
- Case maximize and restore: passed; class and height change correctly.
- Case resize: passed; keyboard verification changed the window from 1365 × 738 to 1341 × 714 pixels. Pointer drag uses the same size state.
- Homepage move: passed; keyboard verification changed the window transform from `translate3d(0px, 0px, 0px)` to `translate3d(14px, 14px, 0px)`. Pointer dragging uses the same position state.
- Case move: passed; keyboard verification changed the window transform from `translate3d(0px, 0px, 0px)` to `translate3d(16px, 16px, 0px)`. Pointer dragging uses the same position state.
- Move and resize affordances are separated: title bar moves, lower-right handle resizes.
- Mobile case window: passed at 390 × 844 without horizontal overflow.
- Browser console: no errors.
- Production build: passed.
- Lint: passed with image-optimization warnings only; no errors.

## Findings

- No actionable P0, P1, or P2 differences remain for the requested states.

## Comparison history

1. The case viewer initially had a generic rounded frame with decorative dots. It was replaced with a functional retro title bar, menu row, status strip, resize handle, and working window controls.
2. Native browser resizing was too subtle and difficult to verify. It was replaced with an explicit custom resize handle and keyboard resizing support.
3. The hero initially included “PLAY THE STORY” copy plus replay and close controls. Those were removed in favor of one frosted play icon and a one-shot cinematic sequence.
4. The expanded video initially behaved as a contained player. It now grows into the full hero background and fades out on skip or natural completion.
5. The first mobile title size left a single Chinese character on its own line. The mobile display size was reduced so the phrase wraps as a balanced block.
6. The homepage small window and case viewer previously used related but different chrome. They now share one retro desktop-window language, with movement constrained to their owning page region.
7. The video viewport previously retained a grey inner frame. It was removed so the media is embedded flush inside the window content area.

## Follow-up polish

- [P3] Fine-tune glass opacity after the user compares it on their own display brightness.
- [P3] Adjust the skip-icon reveal position if the user prefers top-right rather than centered hover feedback.

final result: passed
