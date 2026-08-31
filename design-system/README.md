# Pro24 Design System → Figma (.fig)

The website's design system lives in code at `assets/css/main.css`. This folder is the bridge to Figma.

## What's here

- **`figma-tokens.json`** — every color, font, size, radius, and shadow from the live site, in the
  Tokens Studio format that Figma understands. Values were extracted 1:1 from `main.css`, so the
  Figma library and the website can never drift apart.

## Getting a real .fig file (in order of least effort)

### Option A — Let Claude build the library in Figma (recommended)
1. Authorize the Figma connector: claude.ai → Settings → Connectors → Figma
   (or run `/mcp` inside an interactive `claude` terminal session).
2. Ask Claude to "generate the Pro24 design library in Figma from figma-tokens.json".
   Claude creates the file in your Figma account: color styles, text styles, and core components
   (buttons, service card, review card, eyebrow, badges, nav, footer).
3. In Figma: **File → Save local copy…** → you now have `Pro24-Design-System.fig`.

### Option B — Import the tokens yourself
1. In Figma, install the free **Tokens Studio for Figma** plugin.
2. Plugins → Tokens Studio → Tools → Load from file → pick `figma-tokens.json`.
3. "Create styles & variables" — Figma now has all Pro24 colors/type as native styles.
4. **File → Save local copy…** for the .fig.

### Option C — Clone the full rendered pages into Figma
For editable page mock-ups (not just tokens): install the **html.to.design** plugin in Figma and
feed it the live site URL (repo must be public / Pages on) or run it against the local files.
It rebuilds each page as real Figma layers. Then save as .fig.

## Non-negotiables when designing in Figma

- **Anton is display-only**, always uppercase, never bold/italic (it has one weight).
- **Chrome headline effect**: text fill = 5-stop vertical gradient (stops in tokens), plus the
  `textShadow` effect token. Red accent words use `brand.red` flat.
- **One red.** `#EC1B1F` for accents/CTAs, `#A90F13` only as the gradient bottom of buttons.
- **Dark always**: backgrounds come from the four `bg` steps; never pure black, never white cards.
- Cards: `bg.3` fill, 1px `hairline.default` stroke, radius 14, hover = `hairline.strong` + red glow.
- Phone number everywhere: **612-235-8696**.

Fonts are free Google Fonts: [Anton](https://fonts.google.com/specimen/Anton) ·
[Montserrat](https://fonts.google.com/specimen/Montserrat) — install locally for Figma.
