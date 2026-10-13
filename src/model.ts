export const stages = ['Intake', 'Review', 'Onboarding', 'Ready for handover', 'Handed over'] as const;
export type Stage = typeof stages[number];
export type Role = 'coordinator' | 'client';
export const team = [{ id: 'maya', name: 'Maya Turner', initials: 'MT' }, { id: 'leo', name: 'Leo Hart', initials: 'LH' }, { id: 'client', name: 'Client', initials: 'CL' }];
export const services = ['Website project', 'Internal business system', 'Workflow automation'];
export type Task = { id: string; title: string; ownerId: string; due: string; complete: boolean; completedAt: string | null };
export type Project = { id: string; company: string; contact: string; email: string; service: string; summary: string; target: string; created: string; stage: Stage; reviewNote: string; handoverNote: string; tasks: Task[] };
export type Event = { id: string; projectId: string | null; kind: 'Activity' | 'Automation' | 'Draft'; at: string; text: string; draftBody?: string; key?: string };
export type Rules = { welcome: boolean; autoReady: boolean; reminders: boolean };
export type State = { version: 1; projects: Project[]; rules: Rules; events: Event[] };
export const STORAGE_KEY = 'navrenlo-onboarding-v1';
export function dateOffset(days = 0) { const d = new Date(); d.setDate(d.getDate() + days); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
export function validDate(value: string) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(new Date(value).getTime()) && new Date(value).toISOString().slice(0, 10) === value; }
export const prettyDate = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
export const progress = (p: Project) => p.tasks.length ? Math.round(p.tasks.filter(t => t.complete).length / p.tasks.length * 100) : 0;
const meaningfulNote = (note: string) => note.replace(/\s/g, '').length >= 10;
export const allDone = (p: Project) => p.tasks.length > 0 && p.tasks.every(t => t.complete);
export const overdue = (p: Project) => ['Onboarding', 'Ready for handover'].includes(p.stage) ? p.tasks.filter(t => !t.complete && t.due < dateOffset()) : [];
const id = () => crypto.randomUUID();
function event(projectId: string | null, kind: Event['kind'], text: string, extra: Partial<Event> = {}): Event { return { id: id(), projectId, kind, text, at: new Date().toISOString(), ...extra }; }
function template(projectId: string): Task[] { return [
  { title: 'Complete sample intake questionnaire', ownerId: 'client', days: 2 },
  { title: 'Confirm scope and success criteria', ownerId: 'maya', days: 3 },
  { title: 'Confirm kickoff availability', ownerId: 'client', days: 4 },
  { title: 'Prepare onboarding handover', ownerId: 'leo', days: 5 },
].map((t, i) => ({ id: `${projectId}-T${i + 1}`, title: t.title, ownerId: t.ownerId, due: dateOffset(t.days), complete: false, completedAt: null })); }

export function seed(): State {
  const samples = [
    ['Fern Studio', 'Avery Stone', 'Website project', 'Intake'],
    ['Linden Works', 'Jamie Cole', 'Internal business system', 'Review'],
    ['Meadow Services', 'Taylor Quinn', 'Workflow automation', 'Onboarding'],
    ['Ivy Workspace', 'Riley West', 'Website project', 'Ready for handover'],
    ['Juniper Collective', 'Casey Hale', 'Internal business system', 'Handed over'],
    ['Clover Practice', 'Robin Blake', 'Workflow automation', 'Intake'],
  ] as const;
  const projects: Project[] = samples.map((s, i) => {
    const projectId = `ONB-${201 + i}`, advanced = i >= 2 && i <= 4;
    const tasks = advanced ? template(projectId).map((t, k) => { const complete = i >= 3 || k === 1 || k === 2; return { ...t, due: dateOffset(i === 2 && k === 0 ? -1 : k + 1), complete, completedAt: complete ? new Date().toISOString() : null }; }) : [];
    return { id: projectId, company: s[0], contact: s[1], email: `sample${i + 1}@example.com`, service: s[2], summary: `Fictional ${s[2].toLowerCase()} enquiry for ${s[0]}. Align the project scope, gather sample requirements and arrange a kickoff.`, target: dateOffset(14 + i), created: dateOffset(-i - 1), stage: s[3], reviewNote: advanced ? 'Sample scope reviewed and accepted for onboarding.' : '', handoverNote: i === 4 ? 'Fictional requirements and checklist reviewed. Ready for the next delivery stage.' : '', tasks };
  });
  return { version: 1, projects, rules: { welcome: true, autoReady: true, reminders: true }, events: projects.map(p => event(p.id, 'Activity', `Fictional sample loaded: ${p.stage}`)) };
}
export type Intake = Pick<Project, 'company' | 'contact' | 'email' | 'service' | 'summary' | 'target'>;
export type Action = { type: 'create'; input: Intake } | { type: 'review'; projectId: string } | { type: 'approve'; projectId: string; note: string } | { type: 'task'; projectId: string; taskId: string; complete?: boolean; ownerId?: string; due?: string } | { type: 'ready'; projectId: string } | { type: 'handover'; projectId: string; note: string } | { type: 'rule'; rule: keyof Rules; enabled: boolean } | { type: 'reminders' };

export function reduce(state: State, action: Action, role: Role, selectedProjectId = ''): State {
  if (role === 'client' && (action.type !== 'task' || action.projectId !== selectedProjectId || action.ownerId !== undefined || action.due !== undefined)) throw new Error('This action is unavailable in the selected client simulation.');
  if (action.type === 'create') {
    const input = Object.fromEntries(Object.entries(action.input).map(([k, v]) => [k, v.trim()])) as Intake;
    if ([input.company, input.contact, input.summary].some(v => !v)) throw new Error('Complete company, contact and project notes.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) throw new Error('Enter a valid sample email.');
    if (!services.includes(input.service)) throw new Error('Choose a project type.');
    if (!validDate(input.target) || input.target < dateOffset()) throw new Error('Choose today or a future target date.');
    const p: Project = { ...input, id: `ONB-${id().slice(0, 6).toUpperCase()}`, created: dateOffset(), stage: 'Intake', tasks: [], reviewNote: '', handoverNote: '' };
    const events = [event(p.id, 'Activity', 'Fictional intake received')];
    if (state.rules.welcome) events.push(event(p.id, 'Draft', 'Welcome message draft created', { draftBody: `Hello ${p.contact},\n\nYour fictional ${p.service.toLowerCase()} intake for ${p.company} is ready for review. This is a local demo draft; no message has been sent.` }));
    return { ...state, projects: [p, ...state.projects], events: [...state.events, ...events] };
  }
  if (action.type === 'rule') {
    if (!(action.rule in state.rules)) throw new Error('Unknown automation rule.');
    if (state.rules[action.rule] === action.enabled) return state;
    let projects = state.projects;
    const events = [event(null, 'Activity', `${action.rule} rule ${action.enabled ? 'enabled' : 'disabled'}`)];
    if (action.rule === 'autoReady' && action.enabled) projects = projects.map(p => { if (p.stage === 'Onboarding' && allDone(p)) { events.push(event(p.id, 'Automation', 'Checklist complete: automatically marked ready for handover')); return { ...p, stage: 'Ready for handover' }; } return p; });
    return { ...state, projects, rules: { ...state.rules, [action.rule]: action.enabled }, events: [...state.events, ...events] };
  }
  if (action.type === 'reminders') {
    if (!state.rules.reminders) throw new Error('Enable overdue reminder drafts before running the preview.');
    const events: Event[] = [];
    for (const p of state.projects) {
      const tasks = overdue(p); if (!tasks.length) continue;
      const key = `reminder:${p.id}:${dateOffset()}:${tasks.map(t => t.id).sort().join(',')}`;
      if (!state.events.some(e => e.key === key)) events.push(event(p.id, 'Draft', 'Overdue reminder draft created', { key, draftBody: `Fictional reminder for ${p.company}:\n\n${tasks.map(t => `- ${t.title} / ${team.find(o => o.id === t.ownerId)!.name} / due ${prettyDate(t.due)}`).join('\n')}\n\nLocal preview only. No message has been sent.` }));
    }
    return { ...state, events: [...state.events, ...events] };
  }
  const p = state.projects.find(p => p.id === action.projectId);
  if (!p) throw new Error('Project not found.');
  let next = p; const events: Event[] = [];
  switch (action.type) {
    case 'review':
      if (p.stage !== 'Intake') throw new Error('Only intake records can enter review.');
      next = { ...p, stage: 'Review' }; events.push(event(p.id, 'Activity', 'Intake moved to review')); break;
    case 'approve':
      if (p.stage !== 'Review') throw new Error('Only reviewed intake can be approved.');
      if (action.note.trim().length < 10) throw new Error('Add review notes with at least 10 characters.');
      next = { ...p, stage: 'Onboarding', reviewNote: action.note.trim(), tasks: template(p.id) };
      events.push(event(p.id, 'Activity', 'Intake approved'), event(p.id, 'Automation', 'Four onboarding tasks created and assigned from the template')); break;
    case 'task': {
      if (!['Onboarding', 'Ready for handover'].includes(p.stage)) throw new Error('Tasks can only change during onboarding.');
      const task = p.tasks.find(t => t.id === action.taskId); if (!task) throw new Error('Task not found.');
      if (role === 'client' && task.ownerId !== 'client') throw new Error('Only client-owned tasks can change in client simulation.');
      if (action.ownerId !== undefined && !team.some(t => t.id === action.ownerId)) throw new Error('Choose a valid task owner.');
      if (action.due !== undefined && !validDate(action.due)) throw new Error('Choose a valid task due date.');
      const edited: Task = { ...task, ownerId: action.ownerId ?? task.ownerId, due: action.due ?? task.due, complete: action.complete ?? task.complete, completedAt: action.complete === undefined ? task.completedAt : action.complete === task.complete ? task.completedAt : action.complete ? new Date().toISOString() : null };
      if (JSON.stringify(edited) === JSON.stringify(task)) return state;
      next = { ...p, tasks: p.tasks.map(t => t.id === task.id ? edited : t) };
      events.push(event(p.id, 'Activity', action.complete !== undefined && action.complete !== task.complete ? `${task.title}: ${edited.complete ? 'completed' : 'reopened'}` : `${task.title}: assignment updated`));
      if (p.stage === 'Ready for handover' && !allDone(next)) { next.stage = 'Onboarding'; events.push(event(p.id, 'Automation', 'Readiness withdrawn: checklist item reopened')); }
      if (next.stage === 'Onboarding' && allDone(next) && state.rules.autoReady) { next.stage = 'Ready for handover'; events.push(event(p.id, 'Automation', 'Checklist complete: automatically marked ready for handover')); }
      break;
    }
    case 'ready':
      if (p.stage !== 'Onboarding' || !allDone(p)) throw new Error('Complete every checklist item before marking ready.');
      next = { ...p, stage: 'Ready for handover' }; events.push(event(p.id, 'Activity', 'Coordinator marked ready for handover')); break;
    case 'handover':
      if (p.stage !== 'Ready for handover' || !allDone(p)) throw new Error('Project must be ready with every task completed.');
      if (!meaningfulNote(action.note)) throw new Error('Add handover notes with at least 10 non-whitespace characters.');
      next = { ...p, stage: 'Handed over', handoverNote: action.note.trim() }; events.push(event(p.id, 'Activity', 'Onboarding handed over')); break;
  }
  return { ...state, projects: state.projects.map(project => project.id === p.id ? next : project), events: [...state.events, ...events] };
}

const isText = (v: unknown): v is string => typeof v === 'string';
function validTask(t: Task): boolean { return !!t && isText(t.id) && isText(t.title) && !!t.title.trim() && team.some(o => o.id === t.ownerId) && isText(t.due) && validDate(t.due) && typeof t.complete === 'boolean' && (t.complete ? isText(t.completedAt) && Number.isFinite(new Date(t.completedAt).getTime()) : t.completedAt === null); }
export function validState(input: unknown): input is State {
  if (!input || typeof input !== 'object') return false; const s = input as State;
  if (s.version !== 1 || !s.rules || !['welcome', 'autoReady', 'reminders'].every(k => typeof s.rules[k as keyof Rules] === 'boolean') || !Array.isArray(s.projects) || !Array.isArray(s.events)) return false;
  if (!s.projects.every(p => p && ['id', 'company', 'contact', 'email', 'service', 'summary', 'target', 'created', 'reviewNote', 'handoverNote'].every(k => isText((p as unknown as Record<string, unknown>)[k])) && [p.company, p.contact, p.summary].every(v => !!v.trim()) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email) && services.includes(p.service) && stages.includes(p.stage) && validDate(p.target) && validDate(p.created) && Array.isArray(p.tasks) && p.tasks.every(validTask) && new Set(p.tasks.map(t => t.id)).size === p.tasks.length && (['Intake', 'Review'].includes(p.stage) ? !p.tasks.length && !p.handoverNote : p.tasks.length === 4 && p.reviewNote.trim().length >= 10 && p.tasks.every((t, i) => t.id === `${p.id}-T${i + 1}` && t.title === template(p.id)[i].title)) && (!['Ready for handover', 'Handed over'].includes(p.stage) || allDone(p)) && (p.stage === 'Handed over' ? meaningfulNote(p.handoverNote) : !p.handoverNote))) return false;
  if (new Set(s.projects.map(p => p.id)).size !== s.projects.length) return false;
  return new Set(s.events.map(e => e?.id)).size === s.events.length && s.events.every(e => e && isText(e.id) && isText(e.text) && ['Activity', 'Automation', 'Draft'].includes(e.kind) && isText(e.at) && Number.isFinite(new Date(e.at).getTime()) && (e.projectId === null || s.projects.some(p => p.id === e.projectId)) && (e.kind !== 'Draft' || isText(e.draftBody)) && (e.key === undefined || isText(e.key)));
}
export function load(): State {
  try { const saved: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null'); if (validState(saved)) return saved; } catch { /* Restore fictional seed data if storage is unavailable or invalid. */ }
  return seed();
}
