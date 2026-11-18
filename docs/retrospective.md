# Retrospective — iteration 1 (v1.0.0)

- Date: 2026-11-19 · Span: 2026-11-09 → 2026-11-19 (11 calendar days)
- Sources: `docs/backlog.md` (estimates), Claude Code session logs (real hours), merged PRs #37–#84.

## Estimated vs real

| Phase | Estimated | Real | Deviation |
|---|---|---|---|
| A–B Definition + planning | not estimated | 3.0 h | — |
| C Design (Penpot, then design in code; includes D1 scaffold) | 7 h | 20.8 h | +197 % |
| D Foundations (D2–D7) | 11 h | 1.7 h (≈ 3–4 h with D1) | −85 % |
| E Development, backlog tasks (E1–E7) | 38 h | 9.2 h | −76 % |
| E Development, issues not in the backlog (#53 #55 #57 #58 #61 #62 #65 #67) | 0 h | 6.0 h | — |
| F Production (#32 #80 #34 #35 #36) | 9 h | ≈ 2.5 h | −72 % |
| **Total** | **65 h** (78 h with 20 % contingency) | **≈ 43 h** (33–50 h, see Method) | −34 % |

## What the numbers say

**The total is a coincidence, not an accurate estimate.** The phases miss by −85 % to +197 %; they only cancel out in the sum. An estimate that wrong per phase can't be used to plan, even if the total lands under budget.

**Foundations (11 h → ~3 h): the estimate was wrong, not the work.** D was standard setup (Prettier, Husky, Vitest, MSW, Playwright, CI, Vercel): known patterns, no product decisions, the kind of work an agent does in minutes. The backlog said "AI-assisted" but was estimated at a human pace. The cost showed up later in a different form: tooling set up without being fully understood. The Prettier Tailwind plugin trimmed a class and caused the empty band on phones (#30), and CSP needed `'unsafe-eval'` for Spotify's script (#32). Fast delegation also risks the learning goal: speed only counts if the setup could be rebuilt without the agent.

**Design (7 h → 21 h): execution problems.**
- Rework: screens were first assembled "blind" through Penpot's plugin API, then dropped and rebuilt in code (2026-11-12). The risk was flagged (M) but had no fallback and no early trial of the tool.
- Unbounded polish: refining had no timebox and no "good enough" criterion.
- In its favour: moving design into code was the right call and made E faster (the see-fix loop is immediate).

**Development: on time, off scope.** E took 15 h against 38 h, but **40 % of it (6 h) was work that wasn't in the backlog**: autoplay with listening intent, ⏮ / ⏭, a turntable that follows the real playback, a crate that feels alive while loading, and failed-roll feedback. They made the product better, but scope changed without replanning. Here the spare time hid it; on a tight project it would be a delay.

**Real hours are undercounted.** The logs measure time with Claude active. They miss thinking away from the keyboard, manual checks in the browser, the Spotify and Vercel dashboards, and Penpot by hand.

## Pattern

With an agent, **mechanical work gets overestimated** (configuration, CRUD, tests on clear seams) and **judgment work gets underestimated** (design, UX, product decisions, choosing between options). The bottleneck is the human deciding and reviewing, not the code being written.

## What went well

- One issue = one branch + PR every time, protected `main`, CI (`checks` + `e2e`) before every merge.
- Every structural decision recorded as an ADR (0001–0008); the PRD updated when rules changed.
- TDD on agreed seams; e2e on the full stack with Spotify faked, so CI never calls the real Spotify.
- Accessibility (WCAG 2.2 AA), responsive and hardening done before 1.0, not after.
- A real v1.0.0 in production, with release notes for every milestone.

## What went wrong

- No time tracking from day 1, although this retrospective (F5) was planned from the start. Real hours had to be rebuilt from logs.
- Estimates not calibrated to AI-assisted work.
- A risky tool (Penpot via MCP) adopted for a whole phase without a one-screen trial.
- Design polish without a timebox.
- Scope added in E without replanning.

## Next time

1. **Log hours per issue from day 1**: one line when the issue closes is enough.
2. **Estimate by uncertainty, not by volume**: mechanical work low; judgment work (design, UX, product) high and with a timebox.
3. **Spike risky tools on one screen or task** before committing a phase to them.
4. **Issue not in the backlog → replan first**: estimate it and decide what moves out.
5. **Delegated work ends with a 10-minute "explain it to me"**, so the learning goal isn't lost to speed.

## Method

- Every `timestamp` in the 14 Claude Code session logs (`~/.claude/projects/<project>/*.jsonl`, 17k events), sorted together so overlapping sessions merge.
- Active time = sum of the gaps between consecutive events of up to 15 min; longer gaps count as breaks. Sensitivity: 5 min → 32.6 h, 10 min → 39.1 h, 15 min → 42.9 h, 30 min → 50.3 h.
- Each gap is assigned to the next merged PR (the work leads to that merge), then to its phase. D1 (scaffold) shipped inside the design PR #37, so its time counts as C.
- The scripts were run once and are not kept in the repo.
