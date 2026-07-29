# 10 — Retrospectives

> **Playbook chapter:** 10 of 12
> **Last reviewed:** 2026-07-29

---

## Purpose

A retrospective is a structured team reflection on a completed sprint or project phase. Its purpose is to identify what is working, what is not, and what the team will change in the next cycle. Done well, retrospectives are the primary engine of continuous improvement.

A retrospective that produces no action is a ceremony. A retrospective that produces actions no one follows through on is worse than no retrospective — it trains the team to dismiss the process. The measure of a retrospective is what changes as a result.

---

## Scope

This chapter applies to:

- Sprint retrospectives held at the end of every sprint
- Project retrospectives held at the close of a project or major phase
- Incident retrospectives (post-mortems) conducted after significant production issues

It covers the process for running retrospectives and the standard for documenting and following up on their outputs.

---

## Standard Process

### 1. Sprint Retrospective

Sprint retrospectives are held at the end of every sprint, before planning for the next sprint begins. They are team-internal by default — the client does not normally attend. They are not the place to raise concerns with the client; they are the place to agree how the team will work better.

**Typical duration:** 45–60 minutes for a two-week sprint.

**Participants:** the full engineering team. The product owner may attend if the team finds it valuable; their presence should be agreed rather than assumed.

**Structure:**

1. **Set the stage (5 minutes):** remind the team that the retrospective is a safe space. Nothing said in the retrospective should be used as a performance measure. The purpose is improvement, not blame.

2. **Gather data (15 minutes):** collect observations across two or three dimensions. Common formats:
   - *What went well / What could be improved / What will we try*
   - *Start / Stop / Continue*
   - *Mad / Sad / Glad*

   Give the team time to write observations individually before sharing. This reduces anchoring on the first person to speak.

3. **Generate insights (15 minutes):** group related observations. Identify themes. Ask "why" at least twice on significant pain points to move past symptoms to root causes.

4. **Decide what to do (15 minutes):** select one to three actions the team will take in the next sprint. Each action must have an owner and a clear definition of done. Actions without owners are not actions.

5. **Close (5 minutes):** confirm the action list. Note the date by which each action will be reviewed.

### 2. Project Retrospective

A project retrospective is conducted at the close of a project or major phase. It is longer and broader than a sprint retrospective and may involve a wider set of stakeholders including client representatives.

A project retrospective should produce:

- A written record of what worked and what did not
- Recommendations for future projects of similar type
- Updates to this playbook where lessons are generalisable

The output of a project retrospective must be documented — see section 4 below.

### 3. Incident Retrospective (Post-Mortem)

When a significant production incident occurs, a retrospective is conducted within five business days. Incident retrospectives are blameless: the goal is to understand how the system and process allowed the incident to occur, not to assign fault to individuals.

An incident retrospective covers:

- Timeline of the incident: what happened, when, and in what order
- Impact: who was affected, for how long, and in what way
- Root cause analysis: the chain of contributing factors that led to the incident
- Contributing factors: process, tooling, or knowledge gaps that allowed the incident to occur
- Action items: specific, owned changes to prevent recurrence or reduce future impact

The output is filed as an incident report in the project repository under `docs/incidents/`.

### 4. Retrospective Documentation

Every sprint retrospective must produce a written record, however brief, that captures:

- Date
- Participants
- What went well (summary)
- What could be improved (summary)
- Actions agreed, with owners and review dates

Sprint retrospective notes are stored in `retrospectives/` in the project repository, named `SPRINT_NN_RETROSPECTIVE.md`.

Project and incident retrospective outputs are stored in `docs/retrospectives/` and `docs/incidents/` respectively.

---

## Checklists

### Sprint Retrospective Checklist

- [ ] Retrospective scheduled within 24 hours of sprint close
- [ ] Full team present or represented
- [ ] Observations gathered individually before group discussion
- [ ] Root cause explored for the most significant pain points
- [ ] One to three actions agreed — each with an owner and a review date
- [ ] Actions from the previous retrospective reviewed: complete, in progress, or dropped?
- [ ] Retrospective notes written up and filed in `retrospectives/`

### Project Retrospective Checklist

- [ ] All team members (and relevant client stakeholders if appropriate) invited
- [ ] Discovery through delivery covered: what worked and what did not at each phase
- [ ] Generalisable lessons identified for playbook update
- [ ] Action items assigned with owners
- [ ] Output documented and filed

### Incident Retrospective Checklist

- [ ] Retrospective conducted within five business days of the incident
- [ ] Timeline documented with accurate timestamps
- [ ] Impact quantified (users affected, duration, data implications)
- [ ] Root cause identified — not just the proximate trigger
- [ ] Contributing factors identified (process, tooling, knowledge gaps)
- [ ] Action items assigned to prevent recurrence
- [ ] Incident report filed in `docs/incidents/`

---

## Best Practices

**Open with the previous retrospective's actions.**
Begin every sprint retrospective by reviewing the actions agreed in the last one. If an action was not completed, discuss why before adding more. An unreviewed action list is a list of broken promises.

**Separate problem identification from solution generation.**
The most common retrospective failure is jumping to solutions before the problem is fully understood. Spend more time on "why does this keep happening?" than on "what should we do about it?"

**Limit actions to one to three per retrospective.**
A list of ten actions is a list of zero actions. Prioritise ruthlessly. One action that is actually completed is worth more than ten that are forgotten.

**Rotate the facilitator.**
When the same person always facilitates, the retrospective reflects their perspective. Rotating facilitators surfaces different patterns and gives the team shared ownership of the process.

**Document blameless, act on systemic.**
The blameless culture of incident retrospectives applies equally to sprint retrospectives. When a process or tool fails, the system failed — not the person who used it. Direct action at systemic causes.

**Update the playbook.**
A lesson learned that stays in a retrospective document helps one team. A lesson that is incorporated into this playbook helps every future project. When a retrospective surfaces something genuinely generalisable, update the relevant chapter.

---

## Lessons Learned

*This section is updated after each project. Add a bullet with the date and a brief description of what was learned.*

- *(No entries yet. Add the first lesson after your next retrospective.*

---

*← [09 Sprint Management](09_SPRINT_MANAGEMENT.md) · [11 Deployment →](11_DEPLOYMENT.md)*
