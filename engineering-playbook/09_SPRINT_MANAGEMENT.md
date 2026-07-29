# 09 — Sprint Management

> **Playbook chapter:** 9 of 12
> **Last reviewed:** 2026-07-29

---

## Purpose

Sprint management is the practice of planning, executing, and communicating work in short, time-boxed cycles that produce a shippable increment of value at the end of each iteration. It provides the structure that keeps a project on track, surfaces problems early, and gives the client regular visibility into progress.

This chapter defines how we plan and run sprints from kick-off to close.

---

## Scope

This chapter applies to all projects running in iterative development cycles, regardless of whether they use a formal Scrum, Kanban, or hybrid approach. The principles generalise across methodologies; specific ceremony names may vary by project.

---

## Standard Process

### 1. Sprint Cadence

Default sprint length is two weeks. Shorter sprints (one week) may be appropriate for early-stage discovery-heavy work or projects with rapidly changing requirements. Longer sprints (three weeks) may suit stable, well-defined work with experienced teams.

Agree the sprint cadence with the client at project kick-off and hold to it. Changing sprint length mid-project disrupts planning rhythms and makes velocity tracking unreliable.

### 2. Backlog Refinement

Backlog refinement is an ongoing activity, not a one-time event. The engineering team and product owner (or client representative) should review and refine backlog items continuously, with a dedicated refinement session at least once per sprint.

In refinement, each candidate story is assessed for:
- Clarity of acceptance criteria — is the story ready to build?
- Sizing — does the team agree on the relative complexity?
- Dependencies — are there blockers that need to be resolved before this story can be picked up?
- Priority — does the order reflect the current product strategy?

Stories that are not refined are not eligible for sprint planning.

### 3. Sprint Planning

Sprint planning occurs at the start of each sprint. Its output is a sprint goal and a committed sprint backlog.

**Sprint goal:** one sentence describing the primary outcome the sprint will deliver. A good sprint goal makes it clear what value will be available at the end of the sprint. Stories in the sprint should collectively serve the goal.

**Capacity:** before selecting stories, assess available team capacity for the sprint. Account for planned leave, recurring meetings, and any non-feature commitments (technical debt, infrastructure, documentation).

**Commitment:** the team selects stories it is confident it can complete within the sprint, given its capacity. The commitment is to the sprint goal, not necessarily every story — unexpected complexity may force story substitution. The sprint goal should not be compromised.

Document the sprint plan: goal, committed stories, team capacity, and any known risks or dependencies.

### 4. Daily Communication

Maintain a lightweight daily check-in — whether a synchronous stand-up or an asynchronous status update — that answers:

- What progress was made since the last check-in?
- What is planned for today?
- Is there anything blocking progress?

The purpose is early identification of problems, not status reporting. Blockers raised in the daily check-in must have an owner and a resolution plan by the next check-in.

### 5. Sprint Execution

During the sprint:

- Work is picked up from the committed backlog in priority order
- Stories move through agreed workflow states (e.g. To Do → In Progress → In Review → Done)
- Scope additions mid-sprint are handled by the product owner: either a lower-priority story is removed to make room, or the new item enters the next sprint's backlog
- Blockers are escalated immediately — do not wait for a stand-up to surface a blocker that is stopping progress

### 6. Sprint Review

At the end of each sprint, demonstrate completed work to the client. The review should:

- Show working software against the sprint goal, not slides or status reports
- Cover every story completed in the sprint
- Invite feedback that informs the next sprint's planning
- Confirm what is and is not included in the sprint's output (incomplete stories are demoed only if instructed by the product owner)

### 7. Sprint Metrics

Track a small number of metrics to inform planning and identify trends:

- **Velocity:** story points (or story count) completed per sprint — used to calibrate future sprint capacity estimates
- **Completion rate:** percentage of committed stories completed — persistent shortfalls indicate over-commitment or scope creep
- **Carryover:** stories that did not complete and rolled to the next sprint — patterns in carryover reveal estimation or dependency problems

Do not use velocity as a performance target. It is a planning input, not a measure of effort.

---

## Checklists

### Sprint Planning Checklist

- [ ] Sprint goal agreed and documented
- [ ] Team capacity assessed for the sprint (leave, meetings, non-feature commitments)
- [ ] All committed stories are refined (acceptance criteria complete, sized)
- [ ] Dependencies between stories identified
- [ ] Known risks documented
- [ ] Sprint backlog shared with client

### Sprint Close Checklist

- [ ] All completed stories meet the definition of done
- [ ] Sprint review conducted with client
- [ ] Client feedback documented and added to backlog
- [ ] Incomplete stories assessed: carryover or descoped?
- [ ] Sprint metrics recorded (velocity, completion rate, carryover count)
- [ ] Retrospective scheduled (see chapter 10)
- [ ] Next sprint's candidate stories identified for refinement

---

## Best Practices

**Protect the sprint goal.**
Individual stories may change; the sprint goal should not. When unexpected complexity forces trade-offs, remove lower-priority stories rather than compromising the goal.

**Demo working software, not mock-ups.**
Sprint reviews that show wireframes or in-progress work create a false impression of completion. Show what is fully done. Partial work belongs in the next sprint, not in a demo.

**Surface blockers the moment they appear.**
A blocker discovered on day one of a sprint and reported on day eight has wasted seven days. Raise blockers immediately, regardless of the daily stand-up schedule.

**Under-commit and over-deliver.**
A sprint that completes all its stories and starts on the next sprint's backlog is better than a sprint that carries over half its commitment. Build in buffer and use it wisely.

**Keep the sprint backlog visible.**
Every team member should be able to see the state of every story at any time. Hidden progress is a management risk.

**Address technical debt in every sprint.**
Reserve a proportion of capacity (typically 15–20%) for technical debt and engineering improvements. A team that never addresses debt builds up drag that slows every subsequent sprint.

---

## Lessons Learned

*This section is updated after each project. Add a bullet with the date and a brief description of what was learned.*

- *(No entries yet. Add the first lesson after your next sprint cycle.)*

---

*← [08 Testing & Quality](08_TESTING_AND_QUALITY.md) · [10 Retrospectives →](10_RETROSPECTIVES.md)*
