# Client Onboarding and Workflow Automation: QA Plan

Date: 2026-10-13 | Navrenlo portfolio demo 2 | Status: plan only; checks not run.

## Scope

Fictional local React + TypeScript app with sessionStorage and reset. Workflow: Intake -> Review -> Onboarding -> Ready for handover -> Handed over. Coordinator and Client are simulations, not authentication or production access control. Preserve the existing Navrenlo logo unchanged. No publishing, paid APIs, authentication, actual messages, uploads, or real data. Drafts and automation events stay local.

All boxes below are pending verification. Record pass/fail/blocked, reproduction steps, and evidence when executed. This assignment runs no builds or application checks.

## Acceptance Checklist

### Presentation and Local State

- [ ] Core views clearly identify fictional data, simulated roles, and local-only drafts. No claim of sent messages, real integrations, real customers, or production security. Existing Navrenlo logo renders with unchanged artwork, color, and proportions.
- [ ] Intake validation rejects missing required fields and whitespace-only values without creating records. Valid fictional intake creates exactly one project in Intake, with stable links to tasks, drafts, and events.
- [ ] Navigation, role changes, and reload retain projects, tasks, rule settings, drafts, and log in the same browser session through sessionStorage. Describe session lifetime honestly; do not promise cross-device or durable storage.
- [ ] Reset restores the documented seed projects, tasks, rule defaults, drafts, log, selection, and dashboard counts; reload cannot resurrect pre-reset changes. Reset cancellation, if offered, changes nothing.
- [ ] Full walkthrough produces no external submissions or service calls; only local app assets/development traffic are expected. No message sending, uploads, credentials, paid API use, or real-data entry is required.

### Roles and Workflow

- [ ] Coordinator moves Intake to Review. Approval is available only in Review and moves the project to Onboarding, creating the template tasks once with both Client and Team assignments. Repeated approval cannot duplicate tasks or events.
- [ ] Coordinator can complete and reassign unfinished tasks during Onboarding, and reopen completed tasks before handover. Reassignment updates ownership and role views consistently without changing completion status or duplicating tasks.
- [ ] Client sees only the selected project's detail and task view; changing selection refreshes all project-linked content without stale tasks or drafts. Client can complete only their own assigned tasks; Team/other-client completion, reassignment, approval, stage changes, rule changes, and handover are unavailable and guarded in state-changing actions.
- [ ] Partially completed task lists cannot become Ready for handover through either automatic or manual actions. Every required template task must be complete; a missing/empty template is a setup failure, not a shortcut to readiness.
- [ ] With auto-ready on, completing the last outstanding task moves Onboarding to Ready for handover, including when the last task is completed by Client. With it off, the project remains Onboarding until Coordinator explicitly marks it ready after all tasks finish.
- [ ] Toggling auto-ready changes the rule's saved state and affects subsequent task completions. Test any effect on an already-complete Onboarding project against the documented behavior; do not silently assume a retroactive transition.
- [ ] Reopening any completed task in Ready for handover returns the project to Onboarding. Finishing it again follows the current auto-ready setting; manual readiness stays blocked while it is open.
- [ ] Handover is Coordinator-only, requires Ready for handover plus all tasks complete, and rejects completion notes with fewer than 10 characters after trimming whitespace. Test 9, 10, and whitespace-only characters; valid notes persist with the handover event.
- [ ] Handed over freezes task completion, reopening, and reassignment in both roles and in action handlers. Retained notes/tasks remain readable; repeat handover and invalid/skipped-stage actions cannot mutate records or create success events.

### Rules, Drafts, Log, and Counts

- [ ] Welcome draft on: new intake records one local welcome draft linked to that project and an automation event. Off: subsequent intake creates no welcome draft. Toggling, reload, navigation, and repeated submission do not duplicate a draft or backfill historical intake unless explicitly documented.
- [ ] Overdue reminder on: preview creates local reminder drafts only for unfinished overdue tasks in active projects. Exclude completed tasks, future/not-yet-due tasks, tasks with no due date, and Handed over projects. Verify the displayed clock/date convention and exact due boundary.
- [ ] Repeating overdue preview with unchanged eligible tasks creates no duplicate drafts. Idempotency identity remains stable across reload and role switching; reassign/reopen/due-date scenarios follow a documented identity policy, with no unexplained duplicate reminders.
- [ ] Overdue reminder off: preview creates no drafts. Re-enabling affects subsequent previews; completing a task removes it from eligibility. Previously generated drafts remain clearly historical and never imply delivery.
- [ ] Every rule toggle actually changes behavior and persists. Relevant accepted actions log the correct project/task, simulated actor, timestamp, and outcome, including automatic readiness and draft creation. Failed/no-op actions never appear as successful transitions; log and UI agree after reload/reset.
- [ ] Dashboard stage counts reconcile with the underlying projects after intake, approval, readiness, reopening, handover, and reset; each project belongs to exactly one stage and stage totals equal total projects. Task/overdue/draft counts use clearly defined scope and reconcile with matching lists and filters.

### Mobile and Keyboard

- [ ] At 360px and 390px mobile widths and a desktop viewport, project selection, task actions, rule controls, drafts, log, notes, and reset remain usable without overlapping/clipped text or page-wide horizontal scrolling. Tables may use a contained scroll area.
- [ ] Complete the core workflow using keyboard only: logical tab order, visible focus, labelled fields, operable role/project selectors and toggles, readable validation, and focus restoration after dialogs. Disabled actions remain understandable; status/assignment is not conveyed by color alone.

## Walkthrough

Use fictional projects A and B, seeded or created locally, with Client and Team tasks. Include an unfinished overdue task, a future task, and a completed overdue task. Capture baseline counts and rule settings.

| Step | Action | Expected result |
| --- | --- | --- |
| 1 | Reset; inspect desktop Dashboard, branding, roles, and rule defaults. | Documented seed state, unchanged logo, clear demo context, reconciled counts. |
| 2 | Enable welcome drafts; submit A with a blank required field, then valid fictional values. Disable welcome drafts and create B. | Invalid submission changes nothing. A is Intake with one local welcome draft; B is Intake with none. |
| 3 | Move A to Review; approve it; repeat the approval attempt. | A enters Onboarding with one template task set containing Client and Team assignments; no duplicates. |
| 4 | As Client select A, then B, then A; attempt a Team-task action and complete an own task. | No stale cross-project content; only own completion succeeds. Counts and events agree. |
| 5 | As Coordinator reassign an unfinished task from Client to Team, then inspect Client view. Complete all but one task with auto-ready off. | Ownership updates immediately; Client loses completion capability for that task. A stays Onboarding; premature mark-ready is blocked. |
| 6 | Complete the last task with auto-ready off; manually mark ready. Reopen one task. | Manual readiness succeeds only after all finish. Reopening returns A to Onboarding. |
| 7 | Enable auto-ready; finish the reopened task. Repeat with the last task assigned to Client. | Last completion moves A to Ready for handover in both actor cases, with accurate events. |
| 8 | Try handover notes of 9 trimmed characters and whitespace only; then use "Setup verified." and hand over. Try task changes afterward. | Invalid notes block handover. Valid notes persist; A becomes Handed over and all task mutations are blocked. |
| 9 | On an active project with overdue tasks, enable reminders and preview twice; reload and preview again. Disable the rule and preview. | Only eligible tasks generate drafts, once per documented identity; disabled rule generates none. Nothing is sent. |
| 10 | Compare dashboard totals, detail views, draft list, and event log; switch roles and reload. | Counts and records reconcile; session changes and rule settings persist without extra events/drafts. |
| 11 | Repeat selection, own-task completion, manual readiness, notes validation, and toggles with keyboard and mobile layouts. Reset and reload. | Core actions are accessible; reset restores baseline without resurrecting session work. |

## Risks and Release Criteria

- Simulated roles provide no security boundary; browser-local data can be edited and may be lost when the session ends. Present this as a portfolio simulation.
- Date boundaries and reminder identity can cause false overdue results or duplicate drafts. Record the clock convention, auto-ready retroactivity, and reminder identity policy before claiming those checks pass.
- Block demo acceptance for premature readiness, unauthorized simulated-role actions, editable handed-over tasks, invalid handover notes, duplicate template tasks/drafts, ineffective toggles, misleading logs/counts, session/reset failures, unusable core mobile/keyboard actions, changed logo, or prohibited integrations/data.
- This plan does not verify implementation, network behavior, accessibility, or branding. Passing future local QA does not authorize publishing.
