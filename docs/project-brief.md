# Client Onboarding and Workflow Automation

Revision 2, 2026-10-13. User's "Ok go on" authorizes the next local portfolio demo under the existing fictional-data, no-publication, no-outbound boundaries. Subsequent owner request changes the onboarding demo's colors and layout to look distinct; visual revision 0.2.0 implements that request.

## Purpose and scope

Show how Navrenlo Technologies can make client onboarding visible, accountable and repeatable for a fictional service company. This is portfolio demonstration work, not a client engagement or measured business result. Use the unchanged approved ribbon N, "Custom software. Built for growth." and navrenlotech@gmail.com. No founder biography or company-age claims.

Coordinator simulation manages intake, review, task assignment, rule configuration and handover. Client simulation sees one selected fictional project and can complete client-owned checklist items. Roles are not real authentication or access control.

## Acceptance criteria

- ONB-001: Demo/fictional/simulated-role context visible, brand consistent, no invented client outcomes.
- ONB-002: Valid fictional intake creates a record; required fields, email and target date validated. Customers/contacts use sample data.
- ONB-003: Intake -> Review -> Onboarding -> Ready for handover -> Handed over. Review approval requires a review note and generates a four-item assigned template exactly once.
- ONB-004: Checklist tasks have an owner and due date, can be assigned and completed in coordinator mode; client simulation can complete only client-owned items for its selected project.
- ONB-005: All tasks must complete before readiness. Auto-ready rule can set readiness when the final task completes; rule-off workflow permits manual readiness. Reopening a ready task returns the project to Onboarding. Handed-over tasks are read-only.
- ONB-006: Handover requires notes of at least 10 non-whitespace characters and a completed checklist. History preserves all accepted changes.
- ONB-007: Rule switches change real local behavior. Welcome draft and overdue reminder preview generate labelled local drafts only. Reminder preview deduplicates by project/date/overdue task set. Disabled reminder rule blocks preview generation.
- ONB-008: Dashboard counts, pipeline, task lists and event log agree after changes. Search/filter/empty states work and do not carry accidentally into other screens.
- ONB-009: Session-only browser data survives reload, reset restores seeds; malformed stored data falls back to seeds. No real submissions, payments, uploads, accounts or external APIs.
- ONB-010: Usable desktop/mobile layout, semantic labels, visible keyboard focus, modal focus return, readable validation/status feedback. Record actual browser coverage.
- ONB-011: Deliver working build/source, screenshots, walkthrough and verification notes, with remaining limits clearly recorded.

## Decisions

Reuse the first demo's Vite + React + TypeScript stack and locked dependencies. SessionStorage, no backend. Local-only at an unused loopback port. Dates use the browser's local calendar. Automation events run synchronously when actions occur; no background scheduler or email transport is implied.

Deferred: production identity, permissions, real file collection, email delivery, CRM integration and publishing. The AI Knowledge and Support Assistant remains the next portfolio project after this demo.
