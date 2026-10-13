# Navrenlo Client Onboarding and Workflow Automation

Working portfolio demonstration by Navrenlo Technologies. Custom software. Built for growth.

Version 0.2.0 gives this demo its own visual identity: charcoal top navigation, coral actions, teal progress and a restructured dashboard/task layout. Existing onboarding flows are preserved.

Flowline Services and all clients, staff, projects, tasks and metrics are fictional. This is demonstration work, not a client engagement or production service. Coordinator/client roles are simulated; they are not real authentication or access control. No messages are sent.

## Open the built demo

Node.js is required. Run `npm ci` and `npm run build`, then `node scripts/serve.mjs`. Open `http://127.0.0.1:5176`. The `dist/` directory is generated locally and is not committed. Set `PORT` to an unused port if needed. Stop with Ctrl+C.

## Develop and verify

Run `npm ci`, then `npm run dev` (normally port 5175). `npm test` runs the model tests. `npm run build` checks TypeScript and builds the app. `node scripts/verify-browser.mjs` runs browser verification against port 5175 using installed Microsoft Edge. Evidence is written to `work/evidence/`.

## Walkthrough

1. As Coordinator, create a fictional intake, or open Fern Studio from Pipeline.
2. Move it to Review, add review notes and approve. A four-item checklist is created and assigned.
3. Adjust task owners/due dates if needed; save assignment changes before completing a task.
4. Switch to Client (simulated), select that fictional company and complete the client-owned tasks. Team-owned items are read-only in this view.
5. Return to Coordinator and complete the remaining checklist. When automatic readiness is enabled, the project moves to Ready for handover. When disabled, use Mark ready for handover after all items are complete.
6. Reopen an item to see readiness withdrawn. Complete it again, add meaningful handover notes and complete handover. Handed-over tasks are locked.
7. Open Automations to switch rules. Run reminder preview for fictional overdue tasks; repeated runs with the same project/day/task set do not create duplicate drafts. View drafts from Event log; each says Preview / Not sent.
8. Reset fictional demo data to restore projects, checklist progress, rules, drafts and history.

## Data and automation limits

SessionStorage holds changes only in the current browser tab. Reload retains them; independent browser sessions start from seeds. Tabs opened from an existing tab can inherit sessionStorage depending on browser behavior. Storage failure falls back to memory with a visible notice. Invalid snapshots restore fictional seed records. No real data should be entered.

Automation rules run locally when an action occurs. There is no background scheduler, email/SMS transport, external API, backend, uploaded document, payment, CRM integration or production account. The About email link opens the user's mail application without sending anything.

The approved checklist is a fixed four-task demonstration template. Due dates use local calendar dates; tasks due before today and incomplete on active onboarding are overdue. Reminder previews can describe client or team tasks but remain unsent local text. Readiness requires every item complete; reopening withdraws it. Handover requires at least 10 non-whitespace characters in the note and freezes task editing.

## Verification and contents

Strict TypeScript/build, six model tests and Edge browser workflow checks passed. Browser checks include intake-to-handover, roles, automation toggles, deduplication, validation, storage/reset, assignment edits, 320/390/1440/1920 layouts, long names, modal focus return and no external HTTP requests. Independent review findings were fixed and verified. Screenshots are in `screenshots/` in the delivery package.

Safari/Firefox, a full keyboard-only end-to-end run, screen-reader/contrast audit and dependency vulnerability audit were not performed. This is not a production security certification. See `docs/verification.md`.

`src/` contains React/TypeScript and tests; `public/branding/` contains the unchanged approved logo; `scripts/` contains the local server and browser verification; `docs/` records requirements, architecture, decisions, QA, release and task progress. The dependency lockfile and demonstration screenshots are included. Dependencies, generated builds, caches and local test output are not committed.

Public contact: navrenlotech@gmail.com
