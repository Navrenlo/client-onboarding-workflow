# Architecture

React/TypeScript front end with a pure state model. Project records include fictional company/contact, service, target date, stage, review note, checklist and handover note. Tasks include owner, due date, completion flag and completed time. Events have a stable ID, project ID, kind, timestamp, text and optional draft message.

Model actions enforce coordinator/client simulation boundaries and stage invariants. Approval creates exactly one task template. Readiness depends on a fully complete checklist; reopening invalidates readiness. Handover freezes task edits. State changes return a new session snapshot plus local event records.

Rules: welcome draft on intake; automatic readiness when checklist complete; overdue reminder preview on explicit coordinator request. Reminder events deduplicate by project ID, local day and sorted overdue task IDs. No timers, remote jobs, transports or real delivery exist.

Storage snapshot includes version, projects, rules and events. Restore validates shape, IDs, links and stage/task invariants, then falls back to seeds if invalid. Browser storage failure falls back to in-memory state with a visible notice. Session data is not a durable audit log.

Views: Overview, Pipeline, Tasks, Automations, Event log, About; project detail contains review/checklist/handover and activity. Client mode narrows navigation and shows its selected project. Responsive pipeline uses a contained horizontally scrolling board; details and forms become one column on small screens.

Visual revision 0.2.0: charcoal horizontal workspace navigation, coral primary actions, teal progress and automation accents. Desktop overview has a full-width metric band, an active/attention work area and a right-side vertical pipeline summary. Tasks use horizontal assignment rows. Below tablet widths the summary moves into normal document flow; task controls stack at mobile widths. Business model and session-storage contract are unchanged.
