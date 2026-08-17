# Design Brief

## Direction

TechFix MIS — a dark-technical computer & gadget service management system that reads like a professional diagnostics console, now extended with a public status tracker and an admin statistics dashboard.

## Tone

Industrial/utilitarian dark theme — deep charcoal surfaces, electric cyan accents, and mono technical labels for a precise, trustworthy repair-shop identity; dashboard keeps the same console language.

## Differentiation

A "diagnostics console" feel: mono-font status labels, cyan status glow, and technical grid lines that make service management feel like precision engineering instead of generic SaaS.

## Color Palette

| Token      | OKLCH            | Role                          |
| ---------- | ---------------- | ----------------------------- |
| background | 0.13 0.02 260    | near-black charcoal canvas    |
| foreground | 0.93 0.01 260    | primary light text            |
| card       | 0.17 0.02 260    | elevated surface              |
| primary    | 0.72 0.14 200    | electric cyan accent/CTA      |
| accent     | 0.72 0.14 200    | electric cyan highlight       |
| muted      | 0.2 0.02 260     | secondary surface             |
| success    | 0.62 0.16 150    | green status (selesai)        |
| warning    | 0.74 0.14 80     | amber status (dikerjakan)     |
| destructive| 0.55 0.2 25      | red (batal/error)             |
| border     | 0.28 0.02 260    | hairline separators           |
| chart-1    | 0.72 0.14 200    | cyan — diterima (chart/stat)  |
| chart-2    | 0.74 0.14 80     | amber — dikerjakan (chart)    |
| chart-3    | 0.62 0.16 150    | green — selesai (chart)       |
| chart-4    | 0.62 0.15 280    | violet — diambil (chart)      |

## Typography

- Display: Space Grotesk — headings, hero, section titles, stat totals
- Body: DM Sans — paragraphs, forms, UI labels
- Mono: JetBrains Mono — status badges, tracking codes, IDs, dashboard readouts
- Scale: hero `text-4xl md:text-5xl font-bold tracking-tight`, h2 `text-2xl md:text-3xl font-bold tracking-tight`, stat value `text-3xl font-bold font-display`, label `text-xs font-semibold tracking-widest uppercase`, body `text-base`

## Elevation & Depth

Layered dark surfaces (background → card → secondary) separated by hairline borders and subtle lifted shadows; live status dots use a restrained cyan `status-glow` ring, avoiding neon.

## Structural Zones

| Zone          | Background  | Border   | Notes                                |
| ------------- | ----------- | -------- | ------------------------------------ |
| Header        | card        | border-b | sticky, cyan brand mark              |
| Tracker hero  | background  | —        | centered tracking-code input card    |
| Tracker card  | card        | border   | status stepper + device/service grid |
| Dashboard     | background  | —        | stat cards on card, bars on muted    |
| Footer        | card        | border-t | muted-foreground text                |

## Spacing & Rhythm

Spacious section gaps (`py-16 md:py-24`), consistent `gap-4/6` component grids, `px-6 md:px-8` container padding; dashboard uses compact `gap-4` stat grid.

## Component Patterns

- Buttons: `rounded-md` primary cyan with dark hover, destructive red variant
- Cards: `rounded-xl` card background with `border-border` and subtle shadow; stat cards use `shadow-elevated`
- Badges: `rounded-full` pill, mono font, color-coded by status (success/warning/destructive)
- Progress: status stepper with `progress-grow` fill; dashboard bars use `bg-chart-{1-4}` per status

## Motion

- Entrance: subtle fade + translate-up on load (`0.3s`)
- Hover: `transition-smooth` lift and border brightening
- Decorative: `status-pulse` on live status dot; `progress-grow` on stepper/stat bars

## Constraints

- Dark mode only; no light theme
- Status colors semantic: success/warning/destructive; chart colors reserved for dashboard breakdown
- Mono font reserved for technical readouts only
- No doNotBuild features (email notifications, status history timestamps)

## Signature Detail

Mono-font status badges with cyan/green/amber/violet color coding — the "diagnostics console" readout that makes every service record and dashboard stat feel like a technician's workbench.
