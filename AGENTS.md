# Project Operating Rules

## Core Principle
Every request follows the same three-part pattern. Apply it by default, even when not explicitly spelled out:
1. **Assume a role relevant to the task** (senior PM, product designer, security engineer, senior engineer, etc.)
2. **Pause before acting** — ask clarifying questions, audit, or diagnose before writing/changing code
3. **Define the output** — exact sections, exact format, no guessing, no filler

---

## Standing Rules for this Repo
- **Universal Responsiveness**: Every UI must be fully responsive across the full range of real-world screens — not just standard mobile/tablet/desktop breakpoints. Explicitly account for:
  - Foldable phones (both folded and unfolded states: ~717px–884px)
  - Flip phones with cover/outer displays
  - Small older devices (~320px, ~375px, ~412px)
  - Tablets (~768px–1024px)
  - Laptops (~1280px–1440px)
  - Desktops (~1920px)
  - Ultra-wide & 4K/5K monitors (~2560px+)
  - Any unusual aspect ratios using fluid layouts, relative units, and container queries where helpful.
- **Attribution**: Every project built under this workflow is a Bezalel Technologies product. Unless specified otherwise, include attribution in the footer (and README) crediting Bezalel Technologies with a link to [https://www.bezalel.website/](https://www.bezalel.website/) — e.g., `Built by [Bezalel Technologies](https://www.bezalel.website/)`. Match the site's existing footer/credits pattern if one already exists rather than duplicating it.
- **Scope Discipline**: Do NOT shotgun changes. Do NOT refactor unrelated code. Do NOT fix things not asked about.
- **Behavior Preservation**: Behavior must remain identical unless an explicit behavior change is requested. No new dependencies without asking. No renaming public APIs without asking.
- **Flag Ambiguity**: If a requirement, cause, or fix is ambiguous, flag it rather than inventing an answer.
- **Change Summaries**: Provide a summary of every non-trivial change for diff review before it is considered done.
- **Explicit Cleanliness**: If something is genuinely clean / has no issues, say so explicitly rather than staying silent.

---

## Reference Library

### Color Palettes
- **Palette A — Warm Neutral / Earthy**: Pebble `#EEEEEE` · Yam `#EA9216` · Cadet Blue `#3A4750` · High Tide `#313841`
- **Palette B — Muted Natural / Sage**: Almond `#D6BD98` · Matcha Brew `#677D6A` · Forest Roast `#40534C` · Eclipse `#1A3636`
- **Palette C — Corporate Blue / Orange**: White `#F9F9F9` · Blue `#004E72` · Navy Blue `#092634` · Orange `#FF6E42`
- **Palette D — Fresh Green (Fintech / Agri friendly)**: Soft Sage Mint `#E2F0CC` · Apple Green `#8BC53D` · Dark Forest Green `#012F13` · Near-Black Green `#011207`
- **Palette E — Luxury / High-Contrast**: Crimson Depth `#710014` · Warm Sand `#B38F6F` · Soft Pearl `#F2F1ED` · Obsidian Black `#161616`

*Suggested fits:*
- A/C for corporate & B2B tools
- B/D for agribusiness or eco-conscious brands (e.g. Osotua Farming)
- D for fintech/wallet apps
- E for premium/luxury client work

### UI Pattern Reference — Fintech / Wallet Apps
Reference: "Money Loop" style app (green primary `#0F5132`-range, card-based layout). Adapt colors to chosen palette.
- **Home**: Greeting header (logo + notification bell + avatar), masked account number, large balance display (bold whole number, muted decimals), pill-shaped primary/secondary action buttons (`+ Add Money` filled, `Withdraw` outlined/gray), Recent Activity list with icon + merchant + timestamp + amount (green for credit, black/gray for debit).
- **Invest Tab**: Portfolio value header, asset-category cards (equities, crypto), watchlist rows with ticker + price + % change.
- **Bottom Nav**: Pill/capsule style, active tab highlighted in a rounded container.
- **Activity Tab**: Search bar + Today/Week/Month filter chips, grouped-by-date transaction list.
- **Notifications**: Grouped Today/This Week sections, icon-tagged entries (money, security, cashback, promo).

---

## Operating Phases & Protocols

### Phase 0 — New Project Bootstrap (Run in order before code is written)
- **0a. PRD (Senior Product Manager)**:
  - Ask up to 5 clarifying questions (target user, must vs nice-to-have, constraints, definition of done). Wait for answers.
  - Deliver: 1. Problem statement, 2. Target user + 2 personas, 3. Goals & non-goals, 4. User stories, 5. Feature list (MVP / v2 / later), 6. Detailed functional requirements, 7. Data model sketch, 8. Edge cases & failure states, 9. Success metrics, 10. Open questions.
- **0b. Full UI & UX Design Brief (Senior Product Designer)**:
  - Deliver: 1. Design principles, 2. Visual direction, 3. Design tokens, 4. Screen inventory, 5. User flows, 6. Per-screen layout, 7. Component library, 8. States, 9. Responsive behaviour, 10. Accessibility.

### Phase 1 — During Development
- **1a. Fast Debugging**:
  - Step 1: Restate problem.
  - Step 2: List 3–5 root causes ranked by probability with reasoning.
  - Step 3: Single fastest verification check for each.
  - Step 4: Stop and wait for results.
  - Step 5: Minimal fix with explanation and verification instructions only after cause is confirmed.
- **1b. Pre-Launch Security Audit (Security Engineer)**:
  - Audit: Auth/session, IDOR/BOLA, secrets, injection, input validation/sanitization, rate limits, CORS/headers, sensitive data leaks, payment tampering, source maps, etc.
  - Output: Severity, file/line, exploit scenario, exact code fix. Ranked summary. No changes without approval. Explicitly report clean categories.
- **1c. E2E Testing (Playwright)**:
  - Install/config Playwright (local + CI, traces, retries, screenshots).
  - List critical user journeys for approval first.
  - Implement tests with resilient selectors (`data-testid`/role), auth fixtures, test data seeding/cleanup, npm scripts (`test:e2e`, `test:e2e:ui`, `test:e2e:ci`), and CI workflow.
- **1d. Dead Code Cleanup & Refactor (Senior Engineer)**:
  - Phase 1 Audit: Table of unused files, imports, deps, endpoints, commented code, duplicates with confidence & risk levels. No changes; stop and wait.
  - Phase 2 Execute: Only on approved items.
- **1e. Clean Git Commits**:
  - Summarize changes, atomic Conventional Commits (`type(scope): summary`), build/test integrity at every commit, exact git commands.
- **1f. Reusable Skill Extraction**:
  - Name, trigger description, step-by-step instructions, constraints, output template, worked example, failure modes.
