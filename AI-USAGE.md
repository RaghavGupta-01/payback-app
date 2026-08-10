# AI Usage

## Tools used
- Claude (Anthropic) — architecture planning, schema design, FastAPI endpoint scaffolding,
  seed script logic, frontend component structure, debugging (e.g. duplicate route
  registration issue), README/ASSUMPTIONS/DECISIONS drafting.
- Antigravity (Google) — UI layout refinements, transition animations, typography, and database seed parser updates.

## Where used
- Initial system architecture and DB schema design
- Backend endpoint implementation (transactions, rewards, redeem)
- Seed script data-cleaning logic (timestamp normalization, amount coercion, category fallback)
- Frontend structure (component breakdown, state management split)
- Component polishing (unified transactions card, slide-over animations, typography hierarchy, hover states, and chart view toggles)
- Documentation drafting (README, ASSUMPTIONS, DECISIONS)

## Examples of AI output rejected or fixed
1. Duplicate-route bug: AI-suggested route structure caused
   FastAPI to silently ignore filter params because Step 2's basic route and Step 3's
   filtered route were both registered on the same path; had to remove the duplicate.

2. AI's first responsive approach for the table below 768px was to hide/collapse lower priority columns (category, payment method) on narrow screens. Rejected because it silently drops information the brief requires to be visible (filterable fields like category); switched to a horizontally scrollable container instead so all columns stay accessible at any width.

3. Chart tooltip collision: A suggested floating tooltip box collided with the center text of the donut chart. Modified the approach to project active segment data directly into the center gap instead of rendering a floating overlay.