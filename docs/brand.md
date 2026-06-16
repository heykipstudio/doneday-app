# Kip Brand Spec
> The master brand reference for Kip studio and all Kip apps.
> Domain: heykip.studio | Updated: June 2026

---

## Who is Kip?

Kip is a small, independent app studio building creative, lifestyle, and community tools for everyday people. Kip's apps are made to feel human — warm, inviting, and genuinely useful without being overwhelming.

The Kip mascot is a small round white chicken. Kip is friendly, a little soft, and always rooting for the person using the app.

---

## The Kip Family System

Kip operates as a **studio umbrella**. Each app is its own product with its own name, mascot, and accent colour — but they all share the same design DNA, tone of voice, and type system. The result is a family of apps that feel friendly and familiar, like they clearly come from the same place, without looking identical.

Think of it like this:
- **Kip studio** = the parent brand (chicken mascot, terracotta + olive palette)
- **Each app** = its own character, its own accent colour, its own mascot — but unmistakably Kip

### What stays the same across all apps
- Typography system (Inter for body, display font chosen per app)
- Tone of voice
- Shape language (rounded, soft, generous whitespace)
- Parchment as the default background
- Charcoal for text
- Mascot-driven illustration style

### What changes per app
- Accent colour (replaces terracotta)
- Secondary colour (replaces olive)
- App mascot / character
- Display / heading font (chosen to fit the app's personality)
- App name and wordmark

---

## Tone of Voice

**Core feeling:** A helpful friend, not a corporate product.

This tone applies to Kip studio AND every app in the family. The warmth is consistent even if the personality shifts slightly per app.

### Kip sounds like:
- Warm and encouraging, never cold or clinical
- Simple and clear — no jargon, no over-explaining
- Gently playful when appropriate, but never trying too hard
- Human — contractions, natural phrasing, conversational rhythm
- Inclusive — speaks to everyone, assumes nothing

### Kip does NOT sound like:
- Startup-speak ("leverage", "seamless", "unlock your potential")
- Overly formal or stiff
- Condescending or over-explaining
- Hyped or salesy

### Examples

| ❌ Don't write | ✅ Write instead |
|---|---|
| "Leverage our powerful tools to optimise your workflow" | "We built this to make your day a little easier." |
| "Onboarding complete. Proceed to dashboard." | "You're all set! Here's where the fun starts." |
| "Error: invalid input detected." | "Hmm, something doesn't look right — want to try again?" |
| "Unlock premium features today." | "There's more waiting for you when you're ready." |
| "Please enter your credentials." | "What's your email?" |

### Voice by context

- **UI labels & buttons:** Short, active, clear. "Save", "Let's go", "Try again", "Got it"
- **Empty states:** Warm and encouraging. "Nothing here yet — but that's about to change."
- **Errors:** Gentle, never blaming the user. Always offer a next step.
- **Onboarding:** Excited but not overwhelming. One thing at a time.
- **Success messages:** Celebratory but not over the top. "Done!" or "Nice one." works well.

---

## Typography System

### Body text (all apps, including Kip studio)
- **Font:** Inter
- Use for all body copy, UI labels, descriptions, form fields
- Medium weight for most UI, regular for longer text
- Generous line height — never tight

### Display / heading font (per app)
- Each app chooses its own display font that fits its personality
- It should feel warm and approachable — not sharp, cold, or overly geometric
- **JetBrains Mono** is reserved for the Kip studio wordmark only — use it for another app only if it genuinely fits perfectly
- When in doubt, a well-chosen rounded or humanist font works every time

---

## Colour System

### Kip Studio palette

| Name | Hex | Usage |
|---|---|---|
| Parchment | `#f1ece4` | Backgrounds, surfaces — used across ALL apps |
| Terracotta | `#d96b42` | Kip studio accent — CTAs, highlights, the dot in the wordmark |
| Olive | `#616a57` | Kip studio secondary — supporting elements, icons |
| Charcoal | `#2d3132` | Text — used across ALL apps |

### Per-app colour rules

Each app defines:
- **Accent colour** — replaces terracotta. Used for CTAs, highlights, key UI moments.
- **Secondary colour** — replaces olive. Used for supporting elements, tags, borders.
- Background always starts from **Parchment** `#f1ece4` (can be lightened or adapted slightly)
- Text always uses **Charcoal** `#2d3132`

Accent colours should:
- Feel warm or friendly (avoid cold blues, harsh neons)
- Work well against parchment
- Complement rather than clash with sibling app colours
- Each app in the family should have a distinct accent — no repeats

---

## Shape & Style (all apps)

- **Rounded corners everywhere** — buttons, cards, inputs, modals
- **Soft shadows** over hard borders
- **Generous whitespace** — never cramped
- **Illustrations > icons** where possible — lean into the mascot world
- No hard edges, no sharp angles in UI elements
- Mascots are round, soft, friendly — consistent illustration style across the family

---

## Kip Studio Identity

- **Mascot:** Small round white chicken with terracotta beak/comb, olive feet
- **Wordmark:** `kip.studio` in JetBrains Mono, lowercase, with a terracotta dot
- **Accent:** Terracotta `#d96b42`
- **Secondary:** Olive `#616a57`

---

## App Architecture Principles

Every Kip app follows these rules:

- **Web-first** — build for browser, mobile-responsive by default
- **GitHub for all code** — every app has its own repo under the Kip organisation
- **Spec-driven** — every app starts with a written spec before any code is written
- **Supabase for backend** — auth, database, storage (consistent pattern across apps)
- **Deployed via GitHub Pages or Vercel** — free hosting, automatic on push
- **No vendor lock-in** — avoid platforms that own your code

---

*Kip Brand Spec — heykip.studio*
