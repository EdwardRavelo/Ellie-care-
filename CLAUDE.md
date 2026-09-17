# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project overview

**Ellie Care — Guía de Atención** is a 100% static web app (no backend, no build step) used by call center operators in real time during emergency calls. Speed of information access is the #1 UX priority — operators cannot spend more than 3 seconds finding a speech.

## Running the app

No build step required. Open `index.html` directly in a browser, or serve locally:

```bash
npx serve .
# or
python -m http.server 8080
```

Deploy to production:

```bash
npx vercel --prod --yes
```

## Architecture

All protocol content is **inline in `index.html`** — there is no separate data file or build step. The core files are:

- **`index.html`** — all protocol steps, speeches, rules, and UI structure. This is the single source of truth for content.
- **`styles/main.css`** — CSS custom properties (light mode only), all component styles, responsive breakpoints.
- **`scripts/app.js`** — scroll fade-in via IntersectionObserver, clipboard copy with fallback, 20-min EVN timer, lightbox, and dynamic wrapping of `.thumb-row` elements with a "Referencia visual" header.
- **`manual.html`** — full manual view; shares `styles/main.css` and follows the same design system.
- **`discrepancias.html`** — standalone discrepancy report (print-oriented); uses its own inline styles, not `main.css`.

## Page layout

The page has four vertical sections in order:

1. **Pasos Generales** — applies to all calls (steps 1–2 with screenshots)
2. **Decision strip** — ¿Qué tipo de evento es?
3. **`.branches` grid** — 3 columns: EF (green) | EVN (violet) | EVS (red)
4. **`#section-nd` — Sin Contacto** — separate section below the 3 columns, lower visual hierarchy (orange, horizontal step flow ND-1→ND-4, plus ND-5 nocturno card)
5. **WPP guide** — WhatsApp messaging rules per event type

**Sin Contacto is not a 4th branch** — it is a separate complementary protocol with different hierarchy.

## Color system (mandatory)

| Tipo | CSS vars prefix | Actual var names |
|------|----------------|-----------------|
| GENERAL | blue | `--c-general`, `--bg-general`, `--br-general` |
| EF | green | `--c-ef`, `--bg-ef`, `--br-ef` |
| EVN | violet | `--c-evn`, `--bg-evn`, `--br-evn` |
| EVS | red | `--c-evs`, `--bg-evs`, `--br-evs` |
| Sin Contacto | orange | `--c-nd`, `--bg-nd`, `--br-nd` |

Never use inline styles for theme colors — always use the CSS vars. Only one theme (light) is defined in `:root`; there is no dark mode and no `[data-theme]` variant.

## Design constraints

- **Fonts:** `Inter` for UI, `JetBrains Mono` for speech blocks (loaded from Google Fonts).
- Speech blocks: distinct background (`--speech-bg`), monospace font, labeled with 🎙️.
- Icons: 🎙️ speech · ⚠️ rule · 📋 operative action.
- **Light mode only** — no dark mode, no theme toggle, no localStorage theme key.
- Responsive: primary target is desktop/tablet. `.branches` collapses to 2 cols at ≤1100px, 1 col at ≤800px.

## Protocol summary

All calls start with **Pasos Generales**. Then branch:

- **EF (Evento Falso):** Error, affiliate is fine. Confirm twice, identify cause, close as EF.
- **EVN (Evento Verdadero Sin Asistencia):** Real event, affiliate refuses help. Confirm twice, 20-min follow-up timer, send WhatsApp, call AP, close as EVN–CERRADO.
- **EVS (Evento Verdadero Con Asistencia):** Affiliate needs help. Gather info → hold → call emergency services → call AP/network → stay on line → confirm assistance → send WhatsApp per stage.
- **Sin Contacto (SC):** No communication established. Up to 6 attempts to affiliate, then 5 companions (2 calls each), leave event OPEN, retry after 1 hour. Nocturnal rule (ND-5): caída detection = no active calls at night; help button = 24/7 always.
