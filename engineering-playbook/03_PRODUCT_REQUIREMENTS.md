# 03 — Product Requirements

> **Playbook chapter:** 3 of 12
> **Last reviewed:** 2026-07-29

---

## Purpose

Product requirements translate an agreed strategy into unambiguous, buildable specifications. They are the contract between what the client wants and what the engineering team builds. Good requirements prevent rework, reduce misunderstanding, and make estimation reliable.

---

## Scope

This chapter applies to all feature work that enters the engineering backlog. It covers how requirements are elicited, documented, validated, and maintained throughout a project's lifetime.

It does not cover project-level strategy or technical architecture — those are handled in chapters 02 and 04 respectively.

---

## Standard Process

### 1. Requirements Elicitation

Gather requirements through structured conversations with stakeholders, informed by the discovery brief and strategy brief. Do not begin writing requirements from assumptions. Techniques include:

- Stakeholder interviews focused on goals, not features
- User story mapping — laying out the user journey end to end before slicing it into stories
- Example mapping — for each requirement, producing concrete examples of acceptance criteria before writing formal specifications
- Review of existing systems, processes, or documentation the product must integrate with or replace

### 2. Requirements Hierarchy

Organise requirements at three levels:

**Epics** — large bodies of work representing a significant capability or user journey. An epic is too large to be built in a single sprint. It groups related stories and provides context for prioritisation.

**User stories** — a single capability expressed from the user's perspective in the form: *As a [user type], I want to [do something], so that [I achieve some outcome].* A story should be completable within a single sprint.

**Acceptance criteria** — specific, testable conditions that must be true for a story to be considered complete. Written in the Given / When / Then format where possible. A story without acceptance criteria is not ready to build.

### 3. Non-Functional Requirements

Document non-functional requirements explicitly. They are easy to omit because they do not map to visible features, but they have significant architectural and testing implications.

Categories to address for every project:

- **Performance:** response time targets, throughput under load
- **Accessibility:** WCAG compliance level, assistive technology support
- **Security:** authentication model, data classification, input validation standards
- **Reliability:** uptime target, acceptable data loss window, error handling behaviour
- **Scalability:** expected user volume, growth assumptions
- **Browser and device support:** target environments with version ranges

### 4. Requirement Validation

Before a requirement enters the sprint backlog, validate it against the INVEST criteria:

- **Independent:** can be built without depending on another incomplete story
- **Negotiable:** the how is open; only the what and why are fixed
- **Valuable:** delivers value to a user or the business, not just technical housekeeping
- **Estimable:** the team can size it with reasonable confidence
- **Small:** fits within a single sprint
- **Testable:** has clear acceptance criteria that can be verified

Any story that fails one or more of these criteria should be refined before sprint planning.

### 5. Backlog Maintenance

The backlog is a living document. Maintain it actively:

- Groom the backlog before every sprint planning session
- Archive or delete stories that will never be built
- Re-estimate stories whose scope has materially changed
- Keep acceptance criteria current — a story whose criteria no longer reflect current understanding is misleading

---

## Checklists

### Story Readiness Checklist

- [ ] Written as a user story (As a / I want / So that)
- [ ] Acceptance criteria written (Given / When / Then preferred)
- [ ] Non-functional requirements noted if applicable (performance, accessibility, security)
- [ ] Dependencies on other stories or external systems identified
- [ ] Story passes INVEST criteria
- [ ] Sized by the engineering team
- [ ] Approved by the client or product owner

### Requirements Baseline Checklist

- [ ] All epics identified and mapped to strategy brief
- [ ] MVP stories identified and separated from post-MVP backlog
- [ ] Non-functional requirements documented for all categories
- [ ] Acceptance criteria complete for all sprint-1 stories
- [ ] Backlog reviewed and prioritised with client
- [ ] Open questions listed with owners and resolution dates

---

## Best Practices

**Write acceptance criteria before implementation begins.**
Acceptance criteria written after the fact describe what was built, not what was needed. Write them during requirements, confirm them during sprint planning, and treat them as the definition of done.

**Use examples to clarify ambiguity.**
When a requirement is unclear, ask for a concrete example. "What would you expect to see if a user does X?" reveals edge cases that abstract descriptions hide.

**Distinguish must-have from nice-to-have in writing.**
Verbal agreement that something is "essential" does not prevent it from being deprioritised when time runs short. Document priority explicitly and get it confirmed in writing.

**Avoid solution language in requirements.**
Requirements describe what the system does and for whom. Implementation details belong in technical design, not in user stories. "The system sends an email notification" is a requirement. "The system uses SendGrid to dispatch an SMTP message" is an implementation detail.

**Keep stories independent wherever possible.**
Interdependent stories create sequencing constraints that complicate sprint planning and increase the risk of a sprint delivering no shippable value. Slice stories along user value, not technical layers.

**Version control the backlog.**
Store requirements in a system that records changes over time. When scope changes, document when it changed, why, and who approved the change.

---

## Lessons Learned

*This section is updated after each project. Add a bullet with the date and a brief description of what was learned.*

- *(No entries yet. Add the first lesson after your next requirements engagement.)*

---

*← [02 Product Strategy](02_PRODUCT_STRATEGY.md) · [04 Architecture →](04_ARCHITECTURE.md)*
