# Caytori — Finalized Roles, User Stories & Feature Scope (v2.0 LOCKED — Senior QA Final)

> Status: **LOCKED** — no further drift. Senior-tester audit applied, redundancy removed, plotholes patched, SLA-breach feature added, components reused. All at established neumorphic design.
> Date: 2026-09-21

---

## 1) Role Model — Final (5 roles = 1 System + 4 Tenant). 0 deletions.

All 5 are load-bearing after QA audit. Consolidation attempted and rejected with concrete failure modes.

| # | Role ID (`src/data.ts:3`) | Display | Scope | Owns (least-privilege) | Explicitly CANNOT | Tester rationale if deleted |
|---|--------------------------|---------|-------|------------------------|-------------------|-----------------------------|
| P | `platform_admin` | Caytori Admin (System) | Cross-tenant SaaS operator | Tenant provisioning (register / suspend / activate in `src/components/Directory.tsx:100`), `allowSelfReg` toggle + trial length (`src/components/Settings.tsx:82`), aggregate platform KPI (`src/components/Analytics.tsx:63` + `src/components/Dashboard.tsx:142`), TLS/fencing banner. | Cannot open/read/comment/reassign any company ticket, cannot see employee PII/workload, cannot edit company settings. Fenced by `companyId` via `ticketsFor`. | Deleting leaks multi-tenancy: company admins would own self-registration policy and see cross-tenant metrics. |
| C | `company_admin` | Company Admin (Tenant Owner) | One company | Departments gallery + DepartmentDetail tabs Members/Tickets (`src/components/Directory.tsx:286`), IT Team invite/deactivate (`src/components/Directory.tsx:94`), Hierarchy L1–L4 + department heads (`src/components/Hierarchy.tsx`), Company Settings categories/rules/2FA (`src/components/Settings.tsx:113`), All Tickets audit view + Reports (`src/components/AppShell.tsx:88`). | Cannot RESOLVE/CLOSE on behalf of IT/reporter, cannot bypass `OPEN→IN_PROGRESS→RESOLVED→CLOSED`. Assignment allowed only as fallback; daily dispatch belongs to IT Lead. | Merging into IT Lead breaks SoD: company owner ≠ daily dispatcher in enterprise. Small firms can hold both accounts (no extra cost) without privilege merge. |
| L | `it_head` | IT Lead | Company IT ops | Full queue All vs Unassigned switcher + badge (`src/components/Tickets.tsx:168`), Assign & Review / Reassign, priority change via Escalate, escalation handover (`src/components/Tickets.tsx:380` EscalateModal), workload bars + overdue (`src/components/Dashboard.tsx:169`). | Cannot manage non-IT departments, cannot edit company profile/platform policy. | Merging into `it_employee` lets any L1 self-assign Critical, bypassing triage; L1–L3 vs LEAD (`src/data.ts:82`) only scopes handling, not queue ownership. |
| T | `it_employee` | IT Technician L1/L2/L3 | Company IT execution | My Assigned Tickets only (`src/data.ts:572`), Start work, Mark resolved (+2h), Escalate (creates `[ESCALATION HANDOVER]` comment), comment until CLOSED (`src/components/Tickets.tsx:640`). | Cannot see unassigned queue, cannot reassign arbitrarily, cannot close (needs reporter), cannot manage roster/hierarchy. | Deleting technician leaves no executor. |
| E | `normal_employee` | Employee | Own department | My Tickets only, New ticket (subject≥5 desc≥10, dept locked, category, priority) (`src/components/Tickets.tsx:1036`), Confirm fix→CLOSED or Not fixed→IN_PROGRESS (if `allowReopen`) (`src/components/Tickets.tsx:749`), comment until CLOSED. | Cannot see others' tickets, assign, resolve, manage users/depts/analytics. | Deleting reporter closes prematurely: IT could CLOSED without verification, breaking business guarantee. |

**Clarifications (not deletions):** `company_admin` now has audit `All Tickets` + `Reports` (was missing vs `ticketsFor`), Dashboard now uses Lead-style KPI for `company_admin` (`src/components/Dashboard.tsx:169`), `AppShell` passes lifted `allowReopen`/`categories` so both roles see same truth.

---

## 2) Isolated User Stories (exactly what each can / cannot do)

### System — Platform Admin
- As Platform Admin I can view **Platform Dashboard** registered 12 / active 11 / users 486 / tickets 3128 without tenant PII (`src/components/Dashboard.tsx:142`, `src/components/Analytics.tsx:63`).
- I can register/suspend/activate companies and open CompanyDetail (users/tickets/departments) (`src/components/Directory.tsx:243`, `src/components/Directory.tsx:689`).
- I can toggle **Allow self-registration** (propagates to `Login.tsx:38`) and edit support email/trial (`src/components/Settings.tsx:65`).
- I can see **Throughput & Lifecycle** aggregate charts and **Privacy Fencing Active** (`src/components/Analytics.tsx:110`).
- I cannot open ticket detail, search tickets, or view workload (no `tickets` NAV, fenced).

### Tenant — Company Admin
- Dashboard: Unassigned / In Progress / Overdue-or-Critical / All (overdue derived via `src/data.ts:isOverdue`) + IT workload bars (`src/components/Dashboard.tsx:169`).
- Audit All Tickets (read all company tickets, search subject|id, filter status, paginated 6/page, overdue badge) (`src/components/Tickets.tsx:80`, `src/components/Tickets.tsx:266`).
- Departments: create, view Members/Tickets tabs, deactivate department, manage heads (`src/components/Directory.tsx:286`, `src/components/Hierarchy.tsx:474`).
- IT Team: invite/deactivate (`src/components/Directory.tsx:364`), Hierarchy single-source L1–L4 (`src/components/Hierarchy.tsx:334`).
- Settings: company profile, categories (add/remove via `src/App.tsx:categories` lifted state), ticket rules Default priority / **allowReopen enforced** / auto-close, link card to Hierarchy (removed duplicate matrix) (`src/components/Settings.tsx:143`).
- Reports & Analytics category/status/priority/dept + avg resolution (`src/components/Analytics.tsx:205`).
- Cannot RESOLVE/CLOSE as proxy.

### Tenant — IT Lead
- Same Dashboard KPI as Company Admin (overdue-aware).
- Ticket Queue & Dispatch with All vs Unassigned sliding pill + badge count (`src/components/Tickets.tsx:168`).
- Assign & Review (OPEN→IN_PROGRESS) and Reassign (any non-CLOSED) via `src/components/Tickets.tsx:648`.
- TicketDetail modal `max-w-5xl` internally scrollable (`src/components/primitives.tsx:37`) shows SLA breach banner if `isOverdue` (`src/components/Tickets.tsx:866`), escalation banner, conversation, collapsible activity, comment.
- IT Staff / Hierarchy / Reports NAV as above; cannot manage Finance/HR departments or platform policy.

### Tenant — IT Technician (L1/L2/L3)
- My Assigned Tickets only via `src/data.ts:ticketsFor` (`assignee===me.name`), NAV `tickets_my` (`src/components/AppShell.tsx:106`).
- Start work on OPEN (claims to self), Mark resolved, Escalate via `EscalateModal` (tier buttons disabled for ≤current level, `src/components/Tickets.tsx:488`, reason required via `src/utils/validation.ts:validateEscalationReason`, creates handover comment).
- Comment until CLOSED; cannot see unassigned queue or manage roster.
- Dashboard: Assigned to me / In progress / Resolved / High-critical (no workload).

### Tenant — Employee
- My Tickets only (`reporter===me.name`), New ticket button only for this role (`src/components/Tickets.tsx:174`).
- Report issue modal (subject≥5, desc≥10, dept locked, category from shared `categories`, priority, deterministic `nextTicketId` via `src/data.ts:nextTicketId` avoids random collision) (`src/components/Tickets.tsx:1036`).
- Confirm fix→CLOSED, and Not fixed→IN_PROGRESS only if global `allowReopen` true (respects `src/components/Settings.tsx` toggle, `src/components/Tickets.tsx:749` with `allowReopen` prop from `src/App.tsx`).
- Dashboard personal counts + avg fix time scoped to own tickets.

### System Behavior (cross-role invariants)
- Lifecycle strictly `OPEN→IN_PROGRESS→RESOLVED→CLOSED`; only reporter can close, only IT can resolve.
- Comments/activity retained after CLOSED (history immutable).
- Pagination 6/page prevents infinite scroll; search filters case-insensitive; modal body scrolls (`src/components/primitives.tsx:64` `max-h-[92vh] overflow-y-auto overscroll-contain`) outer page never scrolls behind overlay.
- Notifications are live-derived from latest 5 updated tickets (`src/components/AppShell.tsx:156`); fallback static if no activity.

---

## 3) Feature Set — Kept / Removed / Added (senior-tester contemplation)

**Kept (business-critical, load-bearing):**
- Multi-tenant fencing, 4-stage lifecycle + 9-step workflow (Landing + FAQ).
- Role-scoped dashboards, queue assignment/reassignment, escalation tiers L1–L4 with SLA minutes (`src/data.ts:82`), priority/category/department, conversation + activity history.
- Departments gallery with Members/Tickets tabs + invite via email+shareable link + inactive archive drawer (`src/components/Directory.tsx:839`).
- Reports/Analytics plain arithmetic + avg resolution.
- Hierarchy L1–L4 + Department Heads single source (`src/components/Hierarchy.tsx`).

**Removed / Consolidated (redundancy, bloat, page scroll):**
- **Duplicate hierarchy matrix in Settings** removed (`src/components/Settings.tsx:182` deleted) → replaced with single "Open Hierarchy" link card to avoid drift between two editors. Saves ~35 lines and one scroll page.
- **Orphan local category state in Settings** removed → lifted to `src/App.tsx:categories` and shared with `src/components/Tickets.tsx:1036` CreateTicket via props (`src/components/AppShell.tsx:129`). Add/remove now propagates to ticket creation; no ghost categories.
- **Orphan local allowReopen toggle** removed → lifted to `src/App.tsx:allowReopen` and enforced in `src/components/Tickets.tsx:749` (`Not fixed` hidden when disabled). Toggles in Settings vs Profile are now distinct: Settings = global policy, Profile = personal email/comment prefs (kept separate intentionally).
- **Random ticket ID** removed → deterministic `nextTicketId(existing)` (`src/data.ts:SLA_HOURS` helper) avoids `Math.random` collision plothole found by tester.
- **Unbounded ticket list page scroll** capped via pagination (`src/components/Tickets.tsx:95` `PAGE_SIZE=6`) + pager UI.
- **Modal page-scroll leak** fixed via `src/components/primitives.tsx:37` + `CreateTicket` wrapper (`max-h-[92vh]` internal scrollbar); already-contained Directory `max-h-80/72` kept.

**Added (lacking — QA found gaps):**
- **SLA breach / Overdue system** (`src/data.ts:SLA_HOURS` Critical 8h / High 24h / Medium 48h / Low 72h, `isOverdue` util): 
  - List badge `Overdue` (`src/components/Tickets.tsx:291`), detail banner with priority-specific SLA text (`src/components/Tickets.tsx:862`), Dashboard card flips to Overdue when >0 (`src/components/Dashboard.tsx:170`). This was the top missing business need: IT had no way to know a High ticket sat 3 days.
  - IT Lead can now prioritize/escalate overdue; dashboard KPI alerts.
- **Live notifications** (`src/components/AppShell.tsx:156` derived from 5 latest updated tickets) — replaces stale static mock; tester noted notifications never changed after new ticket.
- **Escalation downgrade guard** (`src/components/Tickets.tsx:488` disables tiers ≤ currentLevel) — prevents `L3 → L1` downgrade that bypasses hierarchy.
- **Deterministic ticket ID + handover comment** already included.

**Deferred (explicitly out-of-scope for v1 efficiency):**
- File attachments / rich text (adds storage/compliance), @mentions bulk, auto-escalation scheduler (SLA stays target-only), bulk import.

---

## 4) Plotholes Tested & Fixed (tester mindset: “what if…?”)

| What if… | Failure before | Fix (component reuse) |
|----------|----------------|----------------------|
| Two tickets race-create same `CT-xxxxxxx`? | `Math.random` collision | `src/data.ts:nextTicketId` scans max ID +1 |
| Ticket sits OPEN 5 days as Low? | No flag, appears normal | `isOverdue` → list `Overdue` badge + detail banner + dashboard Overdue |
| IT assigns to deactivated tech? | Static `STAFF` dropdown allows any | Dropdown now derived from same source as Directory; guard to hide inactive (structure ready; add inactive set when backend exists) |
| Dept deactivated yet new ticket picks it? | Employee dept locked; but Directory create unaffected | Employee flow uses `CURRENT_USER.department` locked; Directory deactivation visually warns and blocks new invites via status check |
| Company disables “allow reopen” then employee clicks Not fixed? | Button always shows `src/components/Tickets.tsx:709` | Lifted `allowReopen` (`src/App.tsx` → `AppShell` → `Tickets` → `TicketDetail` `canReopen`); button hidden when false |
| Tech escalates `LEAD → L1` downgrade? | All 4 tier buttons enabled `src/components/Tickets.tsx:489` | Disable tiers ≤ currentLevel, cursor-not-allowed + tooltip |
| User edits categories in Settings but CreateTicket still shows old 8? | Local `cats` state never exported `src/components/Settings.tsx:18` | Lifted `categories` to `src/App.tsx`, `onCategoriesChange` propagates |
| Page has 200 tickets? | Infinite vertical scroll | Pagination `PAGE_SIZE=6` (`src/components/Tickets.tsx:95`) |
| Long ticket thread opens modal, page behind scrolls? | Outer `overflow-y-auto` leaked | `src/components/primitives.tsx:64` inner `max-h-[92vh] overflow-y-auto overscroll-contain`, outer `overscroll-contain`, footer sticky |
| Duplicate hierarchy editor in two pages causes drift? | Settings matrix + Hierarchy page duplicate `IT_HIERARCHY_TIERS` | Settings section replaced by link card to single source (`src/components/Settings.tsx:220`) |
| Notifications show yesterday’s ticket after new activity? | Static `NOTIFICATIONS` array `src/components/AppShell.tsx:47` | Derived from latest `tickets` sorted by `updatedAt` (`src/components/AppShell.tsx:156`) |

---

## 5) Components — Reused / Consolidated

- `src/components/primitives.tsx:Logo, Modal, Field, Toggle, Section, SettingRow, Toast, Button, StatusBadge, PriorityBadge, Avatar, Card, InlineError` — reused across Tickets, Directory, Hierarchy, Settings, Profile. Modal now flex-col with sticky header/ scrollable body reused everywhere (no duplicate overlay code except CreateTicket now unified to same pattern).
- `src/data.ts:isOverdue` reused in list, detail, dashboard.
- `src/data.ts:nextTicketId` reused in CreateTicket (no second generator).
- `src/utils/validation.ts:validateEscalationReason / validateFullName / validateUserDoesNotExist / validateSlaMinutes` reused in escalate, invite, hierarchy edit.

---

## 6) Scroll & Overflow — Final

- `src/components/primitives.tsx:37-108` — Modal outer `overflow-y-auto overscroll-contain`, inner `max-h-[92vh] flex flex-col overflow-hidden`, body `flex-1 overflow-y-auto [scrollbar-width:thin]`.
- `src/components/Tickets.tsx:1036` CreateTicket same wrapper.
- `src/components/Tickets.tsx:95` pagination caps page height.
- Existing Directory drawers `max-h-72/80` and activity collapse retained — no extra page scroll.

---

## 7) Designs Preserved

- Neumorphic tokens `var(--primary/#35cab3)` etc., `neu*` surfaces, `JetBrains Mono` IDs, `Sora` headings (`src/index.css` untouched), Framer Motion transitions, `var(--radius)=1.25rem`.

---

*Locked v2.0 — any new feature must update this doc and pass the “what if…?” table above.*
