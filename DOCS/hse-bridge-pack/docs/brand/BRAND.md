# HSE BRIDGE — Brand kit

Company: HSE BRIDGE (Health, Safety, Environment). Positioning: HSE solutions for sustainable projects.
Three business lines: Formation HSE, Vente EPI/EPC, Recrutement HSE (+ Conseil HSE).
Languages: French (default) and Arabic (RTL). Slogans seen on the flyers:
"Together for a safer tomorrow", "Invest in Safety, Invest in People", "Votre sécurité, notre priorité", "Des solutions HSE pour des projets durables".

## Logo (use AS IS, never redraw, recolor, stretch or add effects)
- `logo-light-transparent.png`: for white / light backgrounds (black text + gold bridge).
- `logo-dark-transparent.png`: for dark / green backgrounds (white text + gold bridge).
- `logo-*-original.jpg`: originals with solid background (reference only).
- Keep clear space around the logo, minimum width 120px. Copy the PNGs to `public/brand/`.
- Favicon: crop the bridge + "HSE" mark from the logo.

## Cover
- `cover-banner.jpg` (1242x451): hero/cover banner for the public home page header and for social/OG image.
  Keep its composition. Never stretch: use object-fit cover with a safe focal point on the worker and bridge.

## Colors (sampled from the flyers)
- Deep green: #073022 (primary dark, panels, footer, admin sidebar)
- Safety yellow: #FDCD1A (CTA buttons, highlights, active states)
- Logo gold: #D9A51F (only for the logo, thin accents)
- Black: #0A0A0A (headings on light), White: #FFFFFF (page background on public site)
- High-vis lime (vest): use very sparingly for tiny accents only.
Create CSS variables / Tailwind tokens from these and replace the old cyan accent everywhere.

## Style notes (from the flyers)
- Heavy uppercase sans-serif headlines (black or white), yellow highlight words ("HSE", "EPI / EPC").
- Yellow rounded banner with a dark green circular icon on the left for section headers.
- Cards: white, rounded, soft shadow, photo on top, circular dark-green icon overlapping the photo, bold title, 2-line description.
- Dark green side/bottom panels with white text and yellow underline accents.
- Script (handwritten) slogans used sparingly. Icons: solid dark green, simple.

## Flyers (content source: copy the official wording from them)
- `flyers/formation-hse-square.jpg`, `flyers/formation-hse-portrait.jpg`: 8 trainings + benefits.
- `flyers/vente-epi-epc.jpg`: EPI/EPC product categories + benefits.
- `flyers/recrutement-hse.jpg`: recruitment domains + benefits.
- `flyers/company-overview-ar-fr.jpg`: the three activities with Arabic titles (use for the Arabic translation).
