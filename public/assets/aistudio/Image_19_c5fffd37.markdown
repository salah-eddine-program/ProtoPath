---
name: ProtoPath Telemetry System
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#e79400'
  on-tertiary-container: '#563400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
  telemetry-num:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system targets electrical engineers, firmware architects, and embedded hardware developers operating in high-velocity prototyping environments. It merges the analytical rigor of electronic design automation (EDA) software (such as KiCad or Altium) with the polished, keyboard-first velocity of modern engineering issue trackers.

The aesthetic is anchored in an engineering-grade dark mode: deep, non-distracting navy-slate substrate surfaces contrasted against razor-sharp electric cyan telemetry accents. The interface acts as a calibrated instrument—uncluttered, highly legible under prolonged cognitive load, and visually organized around structural hierarchy. The emotional response is focused, precise, and dependable.

Key stylistic pillars:
- **Calibrated Instrument Feel:** Flat structural planes, fine-line technical separations, and status-driven signal indicators replace decorative visual fluff.
- **Precision Density:** Visual weight is driven by data hierarchy—monospaced telemetry readings and pinout diagnostics sitting beside clean functional typography.
- **Controlled Luminescence:** Cyan and emerald glow is used strictly as an active signal state (e.g., active logic levels, clock pulses, connection status), never as mere ambient decoration.

## Colors

The palette is engineered for precision contrast and telemetry legibility in dark environments.

### Palette Architecture
- **Primary (`#06B6D4` - Electric Cyan):** The primary signal carrier. Reserved for interactive focus, active pin routes, circuit state validation, and system telemetry highlights.
- **Secondary (`#10B981` - Logic Emerald):** Signals normal execution, verified ground planes, closed loops, and stable power rails (e.g., 3.3V rail stable).
- **Tertiary (`#F59E0B` - Logic Amber):** Represents threshold warnings, high impedance, unstable clock jitter, and unrouted nets.
- **Destructive / Error (`#F43F5E` - Conflict Rose):** Critical alerts, short circuits, pin conflicts, and thermal runaways.
- **Neutral Substrates (`#0B111E`, `#0F172A`, `#162032`, `#1E293B`):** Multi-layered dark slate steps that establish clear workspace separation without muddying contrast.

### Surface System
- **Canvas Base:** `#0B111E` (deep viewport floor, schematics backdrop).
- **Panel Surface Base:** `#0F172A` (sidebars, docked toolbars).
- **Card / Elevated Surface:** `#162032` (inspectors, metric displays).
- **Surface Highlight / Active:** `#1E293B` (hover layers, selected nodes).
- **Structural Outlines:** `rgba(148, 163, 184, 0.12)` for borders; `rgba(6, 182, 212, 0.4)` for active borders.

### Text Contrast
- **High-contrast Primary:** `#F8FAFC` (readouts, titles, active labels).
- **Secondary / Supporting:** `#94A3B8` (attribute keys, metadata).
- **Muted / Disabled:** `#64748B` (inactive traces, default pins).

## Typography

Typography balances rapid UI scanning with exact hardware readout interpretation. 

- **Interface Labels & Structure (`Inter`):** Handles section heads, modal titles, breadcrumbs, and command actions. Its geometric neutrality guarantees readability in multi-column toolboxes and dense menus.
- **Hardware Telemetry & Data (`JetBrains Mono`):** Every value associated with an electrical or firmware property—pin definitions (e.g., `GPIO_21`, `PA0`), voltage metrics (`+3.314V`), memory addresses (`0x00FF4A`), and terminal outputs—must be set in JetBrains Mono. Tabular lining ensures vertical columns of fluctuating measurements remain perfectly locked without horizontal jitter.
- **Bi-directional Precision:** Monospaced values and electrical symbols (`Ω`, `µF`, `V`) always run strictly LTR even when paired with localized RTL text strings, ensuring hardware notation integrity.

## Layout & Spacing

The dashboard uses a structured multi-pane engineering layout. The workspace is built to maximize horizontal and vertical real estate for schematic viewports, pin matrices, and signal stream monitors.

### Layout Model
- **Docked Canvas Architecture:** The screen is divided into fixed operational regions: a compact 56px global utility strip on the far left, a collapsible 280px component/net inspector panel, a flexed center viewport (canvas or waveform view), and an adjustable 320px telemetry right sidebar.
- **Desktop Grid:** A 12-column fluid grid governs standard dashboard pages, using `gutter` (16px) and `margin-lg` (32px).
- **Tablet / Responsive Adaptation:** Below 1024px, the net inspector and telemetry drawer collapse into slide-over panels accessible via keyboard shortcuts or toolbar icons.
- **Mobile Viewport (below 768px):** The UI drops to a single primary stream with sticky bottom telemetry controls; gutters drop to 12px and section margins to 16px.

### Spacing Discipline
Component internals adhere to strict compact increments:
- `space-xs` (4px): Micro-gaps between status LED indicators and their text labels; nested pin badges.
- `space-sm` (8px): Form input inner vertical padding; table row spacing.
- `space-md` (12px): Standard card and panel padding for maximum information density.
- `space-lg` (20px): Structural gap between independent module groupings.
- `space-xl` (32px): Outer margins for settings views and overview matrices.

## Elevation & Depth

Visual hierarchy is constructed through tonal stepping and crisp boundary lines rather than heavy drop shadows, mimicking instrument software.

### Elevation Strategy
- **Layer 0 (Canvas/Background):** `#0B111E`. The deep ground plane. Displays subtle 16px CSS dot-grid overlays (`rgba(148, 163, 184, 0.05)`) when viewing the schematic or breadboard editor.
- **Layer 1 (Panels & Toolbars):** `#0F172A`. Separated by a 1px border (`rgba(148, 163, 184, 0.1)`). No shadow.
- **Layer 2 (Widgets & Cards):** `#162032`. Uses a 1px border (`rgba(148, 163, 184, 0.14)`). Provides an elevated workstation surface for oscilloscopes, pin-out maps, and telemetry graphs.
- **Layer 3 (Modals & Overlays):** `#1E293B`. Bordered by `rgba(6, 182, 212, 0.3)`. Paired with an ultra-diffused shadow: `0 16px 32px -8px rgba(0, 0, 0, 0.6)`.

### Instrument Glow & Telemetry Accents
Active electrical traces and selected pins utilize a localized pseudo-glow using CSS box-shadow:
- `box-shadow: 0 0 12px rgba(6, 182, 212, 0.25)` for active high/selected components.
- `box-shadow: 0 0 12px rgba(16, 185, 129, 0.25)` for closed circuits and power nets.
- `box-shadow: 0 0 12px rgba(244, 63, 94, 0.35)` for detected hardware faults.

## Shapes

The design system employs a soft-cornered technical geometry (`roundedness: 1`), enforcing 4px (`0.25rem`) corner radiuses across standard interactive elements.

- **Micro Radii (4px / 0.25rem):** Applied to buttons, input fields, dropdown triggers, and status tags. This avoids harsh, razor-sharp brutalism while retaining an industrial, software-instrument appearance.
- **Container Radii (8px / 0.5rem - `rounded-lg`):** Applied to telemetry cards, floating command palettes, and docked sidebars.
- **Circular Elements:** Reserved strictly for round test points (TP1, TP2), hardware breakout holes, and circular status LED diodes (6px or 8px diameter).

## Components

### Buttons & Trigger Controls
- **Primary Action:** Solid electric cyan (`#06B6D4`) background with deep slate text (`#0B111E`), font weight 600. Border: 1px solid `#22D3EE`. On hover, brightness escalates with a subtle cyan glow.
- **Secondary / Panel Button:** Background `#162032`, border 1px solid `rgba(148, 163, 184, 0.16)`, text `#F8FAFC`. On hover, border transitions to `#06B6D4` and background to `#1E293B`.
- **Ghost / Utility Icon Button:** Transparent background, text `#94A3B8`. Hover state turns text to `#F8FAFC` and surface to `rgba(255, 255, 255, 0.05)`.

### Chips & Telemetry Tags
- Compact height (20px to 24px) using `JetBrains Mono` body-sm.
- **State Badges:** Semi-transparent background matching the status token (`rgba(6, 182, 212, 0.12)` for cyan, `rgba(16, 185, 129, 0.12)` for emerald), accompanied by a 1px border matching the respective accent at 30% opacity.
- Must include a 6px status LED dot positioned to the left of the text readout.

### Input Fields & Terminal Selectors
- Background `#0B111E`, border 1px solid `rgba(148, 163, 184, 0.2)`, text `#F8FAFC`.
- Focus state: Border instantly shifts to `#06B6D4`, accompanied by an inner ring `0 0 0 1px #06B6D4`.
- Input fields holding pin variables or electrical values feature a static monospaced suffix (`V`, `mA`, `Hz`, `GPIO`) styled in `#64748B`.

### Checkboxes & Toggle Switches
- Checkboxes: 16x16px boxes with 2px radius. Inactive: border `rgba(148, 163, 184, 0.3)`. Checked: `#06B6D4` fill with `#0B111E` checkmark.
- Logic Switches (Bistable): Compact 32x18px pill track. Off state is `#1E293B`; On state is `#06B6D4`. The toggle thumb is 14px solid `#FFFFFF`.

### Cards & Telemetry Panels
- Structured with a distinct header bar (28px height, bottom border 1px solid `rgba(148, 163, 184, 0.08)`) containing an icon, Inter label-sm title in uppercase with tracking, and right-aligned JetBrains Mono status or refresh rate indicator.
- Body area is padded with `space-md` (12px), housing waveform plots, netlists, or register bitfields.

### Hardware-Specific Components
- **Pinout Map Cells:** Grid items featuring pin number (`JetBrains Mono` 10px muted) alongside interactive function label (e.g., `SPI_MOSI / GPIO12`) with color-coded logic tags.
- **Telemetry Readout Tiles:** High-density summary cards displaying an oversized telemetry value (`telemetry-num`, 20px) stacked above an Inter label-sm indicator (e.g., `CORE TEMP`, `BUS LOAD`).