# Content Strategy Planner — Build Tasks

Seven ordered tasks. Each is completable in one session. No automated tests.

---

## Task 1: Benchmark Data Layer and Type Definitions

**Goal:** Define all TypeScript types and populate the benchmark data that the rest of the app depends on.

**Deliverables:**

- `src/lib/types.ts` — All core types:
  - `Industry` enum: DTC Ecommerce, B2B SaaS, Local Services, Consumer App, Info Product / Creator Brand
  - `BusinessObjective` enum: Lead Generation, Demo / Consultation Booking, Purchase, Subscription / App Purchase
  - `Channel` enum: Instagram, TikTok, LinkedIn, Email, Blog/SEO, Webinar
  - `ContentFormat` enum: Short Video / UGC, Carousel / Multi-image, Thought Leadership Article, Case Study / Proof, Newsletter / Offer Email, Webinar / Live Session
  - `BenchmarkFitLabel` type: Strong Fit, Viable, Weak Fit, Overextended
  - `ChannelPlanInput` interface: monthly units, format, traffic per unit, production hours, destination CVR (optional override)
  - `PlannerInput` interface: industry, objective, selected channels with plan inputs, monthly available hours, value per conversion
  - `ChannelForecast` interface: forecast traffic, forecast conversions, forecast revenue, benchmark fit label, diagnostic details
  - `PlannerOutput` interface: channel forecasts, recommended mix, warnings, capacity utilization
  - `IndustryBenchmarkProfile` interface: per-channel benchmark cadence (monthly), engagement rates, default CVR by objective, preferred formats, channel weight/priority

- `src/lib/benchmarks.ts` — Complete benchmark data for all five industries:
  - DTC Ecommerce: Instagram 25/wk cadence 3.66% ER, LinkedIn 15/wk 4.15% ER, TikTok 4.5/wk 1.74% ER, Email 29.81% open 1.74% click, purchase CVR 1.4%, lead CVR 6.6%
  - B2B SaaS: LinkedIn 2/wk 3.72% ER, Instagram 18/wk 3.57% ER, TikTok 3/wk 0.74% ER, Email 2.4% CVR, SEO 2.6% CVR, Webinar 2.3% CVR, landing page 3.8% CVR
  - Local Services: Instagram 2/wk 4.23% ER, LinkedIn 2/wk 3.36% ER, TikTok 3/wk 0.95% ER, Email 2.6% CVR, SEO 2.7% CVR, general 2.9% CVR
  - Consumer App: LinkedIn 3.72% ER, Instagram 3.57% ER, TikTok 0.74% ER, store-to-install 26.4–33.7%, install-to-purchase 1–2%
  - Info Product / Creator Brand: Instagram carousel preferred, Email 35.63% open 2.62% click, Webinar 57% attend 8.74% CTA CTR, landing page 6.6% CVR
  - Preferred format mappings per channel per industry
  - Channel availability rules (e.g., Webinar only for B2B SaaS and Info Product)

- `src/lib/constants.ts` — Guardrail values:
  - CVR bounds by objective (lead 1–15%, purchase 0.5–6%, demo 0.5–10%, app 0.5–3%)
  - Content-unit ceilings (social 2× benchmark, email 20/mo, webinar 8/mo)
  - Format multiplier bounds (+10% max, −15% min)
  - Cadence multiplier table (<50%: 0.90, 50–120%: 1.00, 120–160%: 0.90, >160%: 0.75)

**Done when:** All types compile. Benchmark data is importable and covers every industry/channel/objective combination in the spec.

---

## Task 2: Forecasting Engine with All Formulas

**Goal:** Implement the core forecasting math that converts user inputs into traffic, conversion, and revenue forecasts.

**Deliverables:**

- `src/lib/forecasting.ts` — Core forecast functions:
  - `calculateCadenceMultiplier(plannedUnits, benchmarkCadence)` — returns multiplier per the cadence table
  - `getFormatMultiplier(format, channel, industry)` — returns 1.10, 1.00, or 0.85 based on preferred/neutral/weak fit
  - `forecastChannel(channelPlan, benchmarkProfile, valuePerConversion)` — returns `ChannelForecast`:
    - `ForecastTraffic = PlannedUnits × TrafficPerUnit × CadenceMultiplier × FormatMultiplier`
    - `ForecastConversions = ForecastTraffic × DestinationCVR`
    - `ForecastRevenue = ForecastConversions × ValuePerConversion`
  - `forecastAllChannels(plannerInput)` — runs `forecastChannel` for each active channel, returns array of `ChannelForecast`

- Channel-specific diagnostic calculations (inside forecast output):
  - Social: `Engagements = Impressions × BenchmarkEngagementRate`
  - Email: `Opens = Sends × OpenRate`, `Clicks = Sends × ClickRate`, `Conversions = Clicks × CVR`
  - Webinar: `Attendees = Registrations × 0.57`, `CTA_Clicks = Attendees × 0.0874`, `Conversions = CTA_Clicks × CVR`
  - SEO/Blog: `Conversions = Articles × SessionsPerArticle × SEOCVR`

- CVR resolution: use user override if provided, otherwise fall back to benchmark default for industry/channel/objective
- Guardrail enforcement: clamp CVR to bounds, cap content units at ceilings

**Done when:** Given a `PlannerInput`, the engine returns correct `ChannelForecast` objects for all active channels with proper cadence/format multipliers applied and guardrails enforced.

---

## Task 3: Recommendation Engine and Warnings

**Goal:** Build the logic that produces the recommended mix, benchmark fit labels, and all warnings.

**Deliverables:**

- `src/lib/recommendations.ts` — Recommendation functions:
  - `calculateBenchmarkFit(channelPlan, benchmarkProfile)` — returns one of: Strong Fit, Viable, Weak Fit, Overextended
    - Combines: cadence vs benchmark, format vs preferred, engagement expectation
  - `generateRecommendedMix(forecasts, plannerInput)` — reallocates content units:
    - Toward: strong benchmark fit, high conversions per unit, high revenue per hour, room before cadence deteriorates
    - Away from: weak fit, low revenue per unit, over-capacity cadence, weak bottom-funnel conversion
    - Respects capacity constraint (total hours ≤ available hours)
  - `detectUnderinvestedOpportunities(forecasts, benchmarkProfile)` — flags channels where:
    - Benchmark fit is good
    - Cadence is below efficient range (<50% of benchmark)
    - Conversions per unit are above plan average
  - `detectOverinvestedChannels(forecasts, benchmarkProfile)` — flags channels where:
    - Cadence exceeds benchmark-friendly zone (>120%)
    - Revenue per unit is below plan average
    - Another channel has higher revenue per hour
  - `calculateCapacityUtilization(plannerInput)` — returns `TotalPlannedHours / MonthlyAvailableHours`
    - If over 100%: identify which channels to cut first (lowest revenue per hour)

- `src/lib/engine.ts` — Main orchestrator:
  - `runPlanner(input: PlannerInput): PlannerOutput` — calls forecasting, then recommendations, returns complete output

**Done when:** `runPlanner` produces a complete `PlannerOutput` with forecasts, recommended mix, benchmark fit labels, warnings, and capacity utilization for any valid input combination.

---

## Task 4: Input Form UI

**Goal:** Build the input form that collects all user inputs per the spec's interface structure.

**Deliverables:**

- `src/app/page.tsx` — Main page, holds all state, renders input form and output dashboard

- Top section component(s):
  - Industry selector (dropdown or segmented control, 5 options)
  - Objective selector (dropdown, 4 options)
  - Monthly available hours (number input)
  - Value per conversion (currency input with industry-specific guidance label)

- Middle section — Channel planning grid:
  - Channel toggle row: enable/disable each channel (with industry-aware defaults — e.g., Webinar only shows for B2B SaaS and Info Product)
  - Per enabled channel:
    - Monthly content units (number input, capped at ceiling)
    - Format selector (dropdown, filtered to valid formats for channel)
    - Average traffic per unit (number input — user's historical data)
    - Production hours (number input)
    - Destination CVR (number input, pre-filled with benchmark default, editable, clamped to bounds)

- State management:
  - When industry changes: update channel availability, reset CVR defaults, update format options, update value-per-conversion guidance
  - When objective changes: update CVR defaults across channels
  - All inputs stored in a shape that maps directly to `PlannerInput`

**Done when:** The form renders correctly for all 5 industries, all inputs are functional, changing industry/objective updates defaults appropriately, and the form produces a valid `PlannerInput` object.

---

## Task 5: Output Dashboard UI

**Goal:** Build the output display that shows all forecast results, recommendations, and warnings.

**Deliverables:**

- Forecast table component:
  - Columns: Channel, Forecast Traffic, Forecast Conversions, Forecast Revenue
  - One row per active channel plus a totals row
  - Numbers formatted appropriately (traffic as integers, revenue as currency)

- Benchmark Fit display:
  - Per-channel fit label (Strong Fit / Viable / Weak Fit / Overextended)
  - Cadence comparison indicator (planned vs benchmark)
  - Format match indicator

- Recommended Mix component:
  - Shows reallocated content units per channel
  - Delta from current plan (e.g., "+4 LinkedIn, −6 TikTok")
  - Revenue per Content Unit and Revenue per Production Hour per channel

- Warnings panel:
  - Underinvested Opportunity cards (channel name, reason, suggested action)
  - Overinvested Channel cards (channel name, reason, suggested reallocation)

- Capacity utilization bar:
  - Shows TotalPlannedHours / MonthlyAvailableHours as percentage
  - If over 100%: shows which channels the engine recommends cutting

- Channel-specific diagnostic detail (expandable or secondary view):
  - Social: impressions, engagement rate, engagements
  - Email: sends, opens, clicks, conversions
  - Webinar: registrations, attendees, CTA clicks, conversions
  - SEO: articles, sessions, conversions

- All labels use executive wording from spec (Forecast Traffic, not "Estimated Visits")

**Done when:** All eight output types from the spec are rendered with correct data. Dashboard updates reactively when inputs change.

---

## Task 6: Wire Everything Together and Test All Interactions

**Goal:** Connect the input form to the engine to the output dashboard. Verify every interaction path works correctly.

**Deliverables:**

- Wire `page.tsx` state → `runPlanner()` → output components
  - Forecasts recalculate on every input change (debounced if needed for performance)
  - Output dashboard reflects current state at all times

- Verify all interaction paths:
  - Switching industry updates: channel availability, CVR defaults, format options, benchmark cadences, value guidance
  - Switching objective updates: CVR defaults across all channels
  - Changing content units: forecast traffic changes, cadence multiplier kicks in at thresholds, warnings update
  - Changing format: format multiplier applies, benchmark fit updates
  - Changing traffic per unit: forecast scales proportionally
  - Changing CVR: conversions change, revenue changes, traffic stays same
  - Changing value per conversion: only revenue changes
  - Changing hours: capacity utilization updates, recommended mix adjusts if over capacity
  - Enabling/disabling channels: forecasts add/remove, recommended mix adjusts

- Edge cases:
  - All channels disabled: show empty state
  - Zero traffic per unit: forecast shows zero without errors
  - CVR at bounds: clamping works, no errors
  - Content units at ceiling: caps enforced
  - Over capacity: engine recommends cuts, UI shows them

- Scenario compare:
  - Allow user to snapshot current plan and compare against a modified version
  - Show side-by-side delta in traffic, conversions, revenue

**Done when:** Every input change produces correct, immediate output updates. No console errors. All guardrails enforced in UI. Scenario compare functional.

---

## Task 7: Visual Polish Using CLAUDE.md Design System

**Goal:** Apply the full design system from CLAUDE.md. Make the tool look like a premium executive planning instrument.

**Deliverables:**

- Tailwind config — extend with design system colors:
  - Background: deep navy / near-black
  - Surfaces: slate / charcoal panels
  - Primary text: soft white
  - Secondary text: muted cool gray
  - Status: steel blue, muted teal, amber, muted red
  - Channel accents: muted magenta (Instagram), subdued cyan (TikTok), controlled blue (LinkedIn), amber (Email), emerald (SEO/Blog), violet (Webinar)

- Layout and spacing:
  - Clean grid layout, no visual clutter
  - Proper section separation between input and output areas
  - Consistent padding and spacing throughout

- Typography:
  - Executive-weight headings
  - Clear hierarchy between section titles, labels, and values
  - Monospace or tabular figures for numeric data

- Interactive states:
  - Hover, focus, active states for all inputs and selectors
  - Smooth transitions on forecast updates
  - Clear visual feedback when values change

- Channel identity:
  - Each channel row/card uses its accent color subtly (border, icon, or indicator — not full background)
  - Benchmark fit labels colored by status (teal for strong, amber for caution, red for weak)

- Mobile responsive:
  - Stacked layout on small screens
  - Channel grid collapses to single column
  - Forecast table scrolls horizontally if needed
  - All touch targets adequately sized

- Final cleanup:
  - Remove all default Next.js boilerplate styling
  - No decorative elements that don't serve the recommendation
  - Every pixel supports the core decision: what content mix to publish next month

**Done when:** The tool matches the CLAUDE.md design system. Dark premium aesthetic throughout. Fully responsive. No boilerplate remnants. Dev server builds with no errors.
