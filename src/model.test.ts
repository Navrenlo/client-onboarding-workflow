import { describe, it, expect } from 'vitest';
import { seed, reduce, dateOffset, validState, type Action, type State } from './model';
describe('onboarding workflow', () => {
  it('creates intake, template once, completes checklist and freezes handover', () => {
    let s = seed(); const apply = (a: Action) => s = reduce(s, a, 'coordinator');
    apply({ type: 'create', input: { company: 'QA Fictional', contact: 'Demo', email: 'demo@example.com', service: 'Workflow automation', summary: 'Sample project scope', target: dateOffset(7) } });
    const id = s.projects[0].id;
    expect(s.events.at(-1)!.kind).toBe('Draft');
    apply({ type: 'review', projectId: id });
    apply({ type: 'approve', projectId: id, note: 'Scope reviewed and ready.' });
    expect(s.projects[0].tasks).toHaveLength(4);
    expect(() => apply({ type: 'approve', projectId: id, note: 'Duplicate approval.' })).toThrow();
    for (const t of s.projects[0].tasks) apply({ type: 'task', projectId: id, taskId: t.id, complete: true });
    expect(s.projects[0].stage).toBe('Ready for handover');
    expect(() => apply({ type: 'handover', projectId: id, note: '          ' })).toThrow();
    expect(() => apply({ type: 'handover', projectId: id, note: 'a        b' })).toThrow();
    apply({ type: 'handover', projectId: id, note: 'Sample checklist complete and ready.' });
    expect(s.projects[0].stage).toBe('Handed over');
    expect(() => apply({ type: 'task', projectId: id, taskId: s.projects[0].tasks[0].id, complete: false })).toThrow();
    expect(validState(s)).toBe(true);
  });
  it('requires full checklist and reopens ready project when an item is reopened', () => {
    const s = seed();
    expect(() => reduce(s, { type: 'ready', projectId: 'ONB-203' }, 'coordinator')).toThrow();
    const ready = s.projects.find(p => p.id === 'ONB-204')!;
    const next = reduce(s, { type: 'task', projectId: ready.id, taskId: ready.tasks[0].id, complete: false }, 'coordinator');
    expect(next.projects.find(p => p.id === ready.id)!.stage).toBe('Onboarding');
  });
  it('supports manual readiness when auto-ready disabled and reconciles when enabled', () => {
    let s = reduce(seed(), { type: 'rule', rule: 'autoReady', enabled: false }, 'coordinator');
    const p = s.projects.find(p => p.id === 'ONB-203')!;
    for (const task of p.tasks) s = reduce(s, { type: 'task', projectId: p.id, taskId: task.id, complete: true }, 'coordinator');
    expect(s.projects.find(x => x.id === p.id)!.stage).toBe('Onboarding');
    expect(reduce(s, { type: 'ready', projectId: p.id }, 'coordinator').projects.find(x => x.id === p.id)!.stage).toBe('Ready for handover');
    expect(reduce(s, { type: 'rule', rule: 'autoReady', enabled: true }, 'coordinator').projects.find(x => x.id === p.id)!.stage).toBe('Ready for handover');
  });
  it('restricts client simulation to owned tasks for its selected project', () => {
    const s = seed(), p = s.projects.find(p => p.id === 'ONB-203')!;
    expect(reduce(s, { type: 'task', projectId: p.id, taskId: p.tasks[0].id, complete: true }, 'client', p.id).projects.find(x => x.id === p.id)!.tasks[0].complete).toBe(true);
    expect(() => reduce(s, { type: 'task', projectId: p.id, taskId: p.tasks[1].id, complete: false }, 'client', p.id)).toThrow();
    expect(() => reduce(s, { type: 'task', projectId: p.id, taskId: p.tasks[0].id, ownerId: 'leo' }, 'client', p.id)).toThrow();
    expect(() => reduce(s, { type: 'task', projectId: p.id, taskId: p.tasks[0].id, complete: true }, 'client', 'ONB-201')).toThrow();
    expect(() => reduce(s, { type: 'rule', rule: 'welcome', enabled: false }, 'client', p.id)).toThrow();
  });
  it('generates idempotent overdue drafts only when rule enabled', () => {
    const s = seed(), first = reduce(s, { type: 'reminders' }, 'coordinator');
    expect(first.events.length).toBe(s.events.length + 1);
    expect(reduce(first, { type: 'reminders' }, 'coordinator').events.length).toBe(first.events.length);
    const disabled = reduce(s, { type: 'rule', rule: 'reminders', enabled: false }, 'coordinator');
    expect(() => reduce(disabled, { type: 'reminders' }, 'coordinator')).toThrow();
  });
  it('rejects malformed saved snapshots and invalid inputs', () => {
    expect(validState(seed())).toBe(true);
    const s: State = seed(); s.projects[3].tasks[0].complete = false;
    expect(validState(s)).toBe(false);
    const dup = seed(); dup.projects.push(dup.projects[0]); expect(validState(dup)).toBe(false);
    const bad = seed(); bad.projects[0].tasks = bad.projects[2].tasks; expect(validState(bad)).toBe(false);
    const notes = seed(); notes.projects[4].handoverNote = ''; expect(validState(notes)).toBe(false);
    const email = seed(); email.projects[0].email = 'bad'; expect(validState(email)).toBe(false);
    const contact = seed(); contact.projects[0].contact = ''; expect(validState(contact)).toBe(false);
    const summary = seed(); summary.projects[0].summary = ''; expect(validState(summary)).toBe(false);
    const service = seed(); service.projects[0].service = 'Unsupported'; expect(validState(service)).toBe(false);
    const template = seed(); template.projects[3].tasks = template.projects[3].tasks.slice(0, 1); expect(validState(template)).toBe(false);
    expect(() => reduce(seed(), { type: 'create', input: { company: ' ', contact: 'x', email: 'x@example.com', summary: 'x', service: 'Website project', target: dateOffset() } }, 'coordinator')).toThrow();
    expect(() => reduce(seed(), { type: 'task', projectId: 'ONB-203', taskId: 'ONB-203-T1', due: '2026-02-30' }, 'coordinator')).toThrow();
  });
});
