# Content Strategy Planner — Product Specification

## Core Question

Given my industry, channels, content capacity, and conversion economics, what monthly content mix is most likely to produce valuable conversions without overpublishing or overinvesting in weak formats?

## What the Tool Is

Content Strategy Planner is a monthly content allocation tool. The user picks an industry, selects the channels they actually use, enters realistic traffic and economics, and the tool returns:

- Forecasted traffic by channel
- Forecasted conversions by channel
- Forecasted revenue by channel
- Benchmark-fit by channel and format
- A recommended monthly mix
- Warnings when cadence is too high, too low, or mismatched to the selected industry

This should not behave like a creative brainstorming app. It should behave like a compact operating tool for a marketing leader deciding where content effort should go.

## The Problem It Solves

Most teams know they need "more content," but they do not know:

- Which channel deserves more output
- Which format actually fits the channel
- Whether they are underpublishing or overpublishing
- Whether a content plan is likely to generate traffic, leads, or revenue
- Whether they should shift effort from one channel to another

The planner's job is to convert that into one decision: **What content should we publish next month, on which channels, in what quantity, and why?**

## Scope for Version 1

### Supported Channels

- Instagram
- TikTok
- LinkedIn
- Email
- Blog / SEO
- Webinar (for B2B SaaS and Creator / Info Product)

### Supported Industries

1. DTC Ecommerce
2. B2B SaaS
3. Local Services
4. Consumer App
5. Info Product / Creator Brand

Each industry mode loads a different benchmark profile rather than reusing the same logic across all five.

## Core Planning Model

### Standardized Planning Funnel

Every channel rolls up into the same economic structure:

```
Content Units → Traffic → Conversions → Revenue
```

Under that, the tool keeps a channel-specific diagnostic layer so the user can understand why one channel is forecasted higher or lower.

### Channel-Specific Diagnostic Funnels

**Social:**
```
Posts → Impressions → Engagement Rate → Traffic per Post → Conversion Rate → Revenue
```

**Email:**
```
Sends → Opens → Clicks → Conversion Rate → Revenue
```

**Blog / SEO:**
```
Articles → Organic Sessions → Conversion Rate → Revenue
```

**Webinar:**
```
Registrations → Attendees → CTA Clicks → Conversion Rate → Revenue
```

## User Inputs

### 1. Industry

One of the five industry modes.

### 2. Business Objective

Pick one:

- Lead Generation
- Demo / Consultation Booking
- Purchase
- Subscription / App Purchase

The bottom-of-funnel conversion default changes by objective and industry.

### 3. Monthly Content Plan by Channel

For each selected channel, the user enters:

- Monthly content units
- Primary format
- Average traffic per unit (from historical data)
- Monthly production hours required

The tool should not invent traffic volume. Traffic per asset should come from the user's actual history whenever possible.

### 4. Destination Conversion Rate

The user can either:

- Use the benchmark default for their industry / channel / objective
- Replace it with their own actual conversion rate

### 5. Value per Conversion

Always user-entered. The tool should never invent business value.

Guidance by industry:

- **DTC Ecommerce:** contribution margin per order
- **B2B SaaS:** expected gross profit per lead or booked demo
- **Local Services:** average gross profit per booked job
- **Consumer App:** day-90 value or first-purchase value
- **Info Product / Creator Brand:** contribution margin per sale

## Industry Benchmark Profiles

### DTC Ecommerce

Benchmark profile: retail / ecommerce.

| Channel | Engagement Rate | Benchmark Cadence | Notes |
|---------|----------------|-------------------|-------|
| Instagram | 3.66% | ~25 posts/week | Carousel preferred; Reel parity for fashion |
| LinkedIn | 4.15% | ~15 posts/week | Optional for employer brand |
| TikTok | 1.74% | ~4–5 posts/week | Video only |
| Email | 29.81% open, 1.74% click | — | Strong owned channel |

**Planning defaults:**
- Instagram and TikTok carry most upper-funnel content
- Email modeled as strong owned channel with realistic click rates
- LinkedIn optional, not core DTC demand channel

**Destination conversion defaults:**
- Purchase mode: 1.4% baseline
- Lead-capture mode: 6.6% baseline

### B2B SaaS

Benchmark profile: technology + SaaS.

| Channel | Engagement Rate | Benchmark Cadence | Notes |
|---------|----------------|-------------------|-------|
| LinkedIn | 3.72% | ~2 posts/week | Video preferred |
| Instagram | 3.57% | ~18 posts/week | — |
| TikTok | 0.74% | ~3 posts/week | Optional, secondary |
| Email | — | — | 2.4% content-to-lead CVR |
| SEO | — | — | 2.6% thought-leadership CVR |
| Webinar | — | — | 2.3% CVR |

**Planning defaults:**
- LinkedIn, SEO, email, and webinar receive highest weight
- TikTok optional and usually secondary
- Video preferred for LinkedIn

**Destination conversion defaults:**
- Lead / demo mode: 3.8% SaaS landing-page median
- Content-to-lead: 1.7% organic social, 2.4% email, 2.6% SEO, 2.3% webinar

### Local Services

Benchmark profile: professional services (proxy).

| Channel | Engagement Rate | Benchmark Cadence | Notes |
|---------|----------------|-------------------|-------|
| Instagram | 4.23% | ~2 posts/week | Carousel preferred |
| LinkedIn | 3.36% | ~2 posts/week | Video preferred |
| TikTok | 0.95% | ~3 posts/week | Experimental |
| Email | — | — | 2.6% CVR |
| SEO | — | — | 2.7% CVR |

**Planning defaults:**
- Instagram, SEO, email, and LinkedIn are core channels
- TikTok experimental unless brand has proof of local traction
- Carousel preferred for Instagram, video for LinkedIn

**Destination conversion defaults:**
- General local-service lead mode: 2.9%
- SEO-heavy mode: 2.7%
- Email-driven mode: 2.6%

### Consumer App

Benchmark profile: technology + app-conversion.

| Channel | Engagement Rate | Benchmark Cadence | Notes |
|---------|----------------|-------------------|-------|
| LinkedIn | 3.72% | — | Only if professional angle |
| Instagram | 3.57% | — | Discovery channel |
| TikTok | 0.74% | — | Discovery channel |

**App-specific conversion benchmarks:**
- App Store page-view to install: 33.7%
- Google Play page-view to install: 26.4%
- Install-to-purchase: 1%–2%

**Planning defaults:**
- TikTok and Instagram important for discovery, low purchase conversion
- LinkedIn only if professional/B2B angle
- Avoid overstating app revenue from content
- High top-of-funnel, strict bottom-of-funnel

**Destination conversion defaults:**
- Store-view to install: 26.4%–33.7%
- Install-to-purchase: 1%–2%

### Info Product / Creator Brand

Benchmark profile: influencer + landing-page + email + webinar.

| Channel | Details | Notes |
|---------|---------|-------|
| Instagram | Carousel leads, then photos and Reels | Primary channel |
| TikTok | Underperforms vs median in influencer benchmarks | Test selectively |
| Email | 35.63% open, 2.62% click | Primary owned channel |
| Webinar | 57% reg-to-attend, 8.74% CTA CTR | Primary conversion channel |
| Landing page | 6.6% median conversion | — |

**Planning defaults:**
- Instagram, email, and webinar are primary
- TikTok tested selectively, not assumed best
- Carousel preferred for Instagram

**Destination conversion defaults:**
- Lead-capture mode: 6.6%
- Webinar mode: registrations → 57% attendees → 8.74% CTA CTR → destination conversion
- Email mode: 35.63% open, 2.62% click, then destination conversion

## Content Formats

### Supported Formats

1. Short Video / UGC
2. Carousel / Multi-image
3. Thought Leadership Article
4. Case Study / Proof
5. Newsletter / Offer Email
6. Webinar / Live Session

### Format Multiplier Rules

- **Preferred format for channel:** +10% traffic efficiency
- **Neutral format:** no adjustment (1.0×)
- **Weak-fit format:** −15% traffic efficiency

Never let a format multiplier exceed +10% or go below −15%.

### Preferred-Format Defaults by Channel

| Channel | Preferred Format | Notes |
|---------|-----------------|-------|
| Instagram | Carousel | DTC/fashion can allow Reel parity |
| TikTok | Short Video | Only format |
| LinkedIn | Video (B2B SaaS, Local Services, executive) | Thought leadership article also strong |
| Blog / SEO | Thought Leadership Article, Case Study | — |
| Email | Newsletter / Offer Email | — |
| Webinar | Webinar / Live Session | — |

## Forecasting Math

### Core Standardized Forecast

For any channel `c`:

```
ForecastTraffic_c = PlannedUnits_c × HistoricalTrafficPerUnit_c × CadenceMultiplier_c × FormatMultiplier_c

ForecastConversions_c = ForecastTraffic_c × DestinationCVR_c

ForecastRevenue_c = ForecastConversions_c × ValuePerConversion
```

### Cadence Multiplier

Compare planned cadence to benchmark-optimal cadence for that industry and channel:

| Planned vs Benchmark | Multiplier |
|---------------------|------------|
| Under 50% | 0.90 |
| 50%–120% | 1.00 |
| 120%–160% | 0.90 |
| Above 160% | 0.75 |

Publishing more does not automatically produce proportionally more forecast traffic.

### Channel-Specific Diagnostic Formulas

**Social:**
```
Engagements = Impressions × BenchmarkEngagementRate
```

**Email:**
```
Opens = Sends × OpenRate
Clicks = Sends × ClickRate
Conversions = Clicks × DestinationCVR
```

**Webinar:**
```
Attendees = Registrations × 57%
CTA_Clicks = Attendees × 8.74%
Conversions = CTA_Clicks × DestinationCVR
```

**SEO / Blog:**
```
ForecastConversions = Articles × HistoricalSessionsPerArticle × SEOCVR
```

## Outputs

### 1. Forecast Traffic by Channel

Increases when: planned units go up, traffic per unit goes up, format is better fit, cadence is in benchmark zone.

Flattens/declines when: planned units exceed benchmark cadence badly, weak-fit format is used.

### 2. Forecast Conversions by Channel

Increases when: forecast traffic rises, user chooses higher converting destination, industry profile has stronger channel benchmark.

Does NOT change when: value per conversion changes.

### 3. Forecast Revenue by Channel

Changes only when: forecast conversions change OR value per conversion changes. Scales linearly with value per conversion.

### 4. Channel Benchmark Fit

Combines: cadence vs benchmark cadence, selected format vs preferred format, benchmark engagement expectation.

Labels:
- **Strong Fit**
- **Viable**
- **Weak Fit**
- **Overextended**

### 5. Recommended Mix

The most important strategic output. Reallocates content units toward channels with:

- Strong benchmark fit
- High forecast conversions per unit
- High forecast revenue per hour
- Room before cadence deteriorates

Reallocates away from channels with:

- Weak fit
- Low revenue per unit
- Over-capacity cadence
- Weak bottom-funnel conversion

### 6. Underinvested Opportunity

Appears when:
- A channel has good benchmark fit
- Cadence is below the efficient range
- Conversions per unit are above the plan average

### 7. Overinvested Channel Warning

Appears when:
- Cadence exceeds the benchmark-friendly zone
- Revenue per unit is falling
- Another channel has higher projected revenue per hour

### 8. Capacity Utilization

```
CapacityUtilization = TotalPlannedHours / MonthlyAvailableHours
```

If over capacity: recommendation engine cuts lower-return channels first. Final plan shows what to remove, not just that the plan is "too much."

## Guardrails

### 1. Content-Unit Ceilings

- Social: no more than 2× benchmark cadence before severe penalties
- Email: no more than 20 campaign sends per month
- Webinar: no more than 8 webinars per month

### 2. Destination CVR Bounds

| Objective | Min | Max |
|-----------|-----|-----|
| Lead capture | 1% | 15% |
| Ecommerce purchase | 0.5% | 6% |
| B2B demo / consultation | 0.5% | 10% |
| App install-to-purchase | 0.5% | 3% |

### 3. Value per Conversion

No invented value. User must enter it.

### 4. Format Multiplier Bounds

Never exceed +10% or go below −15% in version 1.

## Interface Structure

### Top Section
- Industry selector
- Objective selector
- Monthly capacity (available hours)
- Value per conversion

### Middle Section
- Channel planning grid
- Format selector per channel
- Traffic-per-unit inputs
- Destination CVR inputs (with benchmark defaults)

### Bottom Section
- Forecast by channel (traffic, conversions, revenue)
- Recommended mix
- Underused opportunity / overinvested warnings
- Scenario compare for one alternative plan

### What NOT to Include

- Chat sidebars
- Fake AI assistant panels
- Spinning score wheels
- Decorative trend animations
- "Creativity scores"
- Floating windows that don't change the recommendation
- Engagement widgets not tied to forecasted value

Every visible section supports the same decision: **what content mix should we publish next month?**

## Executive Wording

### Use These Labels
- Forecast Traffic
- Forecast Conversions
- Forecast Revenue
- Benchmark Fit
- Recommended Mix
- Underinvested Opportunity
- Overinvested Channel
- Revenue per Content Unit
- Revenue per Production Hour

### Never Use
- Content IQ
- Viral Score
- AI Content Brain
- Creator DNA
- Smart Content Wizard

## Color Scheme

Defined in CLAUDE.md. Summary:

- **Background:** deep navy / near-black
- **Surfaces:** slate / charcoal panels
- **Primary text:** soft white
- **Secondary text:** muted cool gray
- **Status:** steel blue (neutral), muted teal (strong fit), amber (caution), muted red (weak fit)
- **Channel accents:** muted magenta (Instagram), subdued cyan (TikTok), controlled blue (LinkedIn), amber (Email), emerald (SEO/Blog), violet (Webinar)
