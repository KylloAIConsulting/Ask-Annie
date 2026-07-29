# 04 — Architecture

> **Playbook chapter:** 4 of 12
> **Last reviewed:** 2026-07-29

---

## Purpose

Architecture is the set of significant technical decisions that shape a system — its structure, its key components, the boundaries between them, and the constraints that govern how they interact. Good architecture makes a system easier to build, test, change, and operate. Poor architecture makes every subsequent decision harder.

This chapter defines how we make, record, and communicate architectural decisions on every project.

---

## Scope

This chapter applies to:

- New products beginning technical design
- Significant new capabilities added to existing systems
- Refactoring work that changes system structure
- Any decision whose consequences are expensive to reverse

It covers both frontend and backend architecture, data modelling, integration design, and the process of recording decisions in a way that outlasts the people who made them.

---

## Standard Process

### 1. Understand Constraints Before Designing

Architecture begins with constraints, not components. Before proposing a structure, catalogue:

- **Technology mandates:** platforms, languages, or frameworks required or prohibited by the client
- **Integration requirements:** existing systems the new product must connect to
- **Non-functional requirements:** performance, scalability, accessibility, and security targets from the requirements brief
- **Operational constraints:** how the system will be hosted, monitored, and supported after launch
- **Team constraints:** the skills available to build and maintain the system

A design that ignores constraints is not architecture — it is a sketch.

### 2. Identify Architectural Drivers

Select the two to four requirements that will most significantly influence technical decisions. These are the architectural drivers. Every significant design decision should be traceable back to at least one driver. If a design decision cannot be justified by a driver, question whether the decision is necessary.

### 3. Design for Change

Systems change. Requirements change. Teams change. Design to minimise the cost of change:

- Separate concerns: keep business logic, data access, and presentation in distinct layers
- Define clear boundaries between components: communication across a boundary should be explicit and minimal
- Prefer reversible decisions over irreversible ones wherever the cost is comparable
- Document the decisions that are hard to reverse so future teams understand the constraints they are working within

### 4. Architecture Decision Records

Every significant architectural decision must be recorded as an Architecture Decision Record (ADR). An ADR captures:

- **Title:** short, present-tense description of the decision (e.g. "Use PostgreSQL for persistent storage")
- **Status:** proposed / accepted / deprecated / superseded
- **Context:** the forces at play that made this decision necessary
- **Decision:** what was decided
- **Consequences:** the expected outcomes — both positive and negative — of this decision

ADRs are stored in the project repository under `docs/adr/`. They are numbered sequentially and never deleted — when a decision is reversed, the original ADR is marked "superseded" and a new ADR records the new decision and references the old one.

### 5. Architecture Review

Before development begins, the proposed architecture should be reviewed by at least one person who was not the primary designer. The review should assess:

- Does the design address all architectural drivers?
- Are the boundaries between components clear?
- Are the data flows and integration points documented?
- Have security considerations been addressed at the design level?
- Are there single points of failure that should be mitigated?
- Is the design within the team's capability to build and operate?

### 6. Architecture Documentation

Maintain a lightweight architecture document in the project repository that describes:

- System context: what the system does and who uses it
- Container diagram: the major deployable units and how they communicate
- Key component boundaries and responsibilities
- Data model overview
- Integration points with external systems
- Known limitations and deferred decisions

This document should be updated when the architecture changes, not at the end of the project.

---

## Checklists

### Architecture Design Checklist

- [ ] Constraints inventoried (technology, integration, non-functional, operational, team)
- [ ] Architectural drivers identified and documented
- [ ] Major components identified with responsibilities defined
- [ ] Component boundaries and communication patterns documented
- [ ] Data model documented (entities, relationships, key constraints)
- [ ] Integration points with external systems identified
- [ ] Security considerations addressed at design level
- [ ] Deployment and hosting model documented
- [ ] Reversible vs irreversible decisions identified
- [ ] Architecture reviewed by at least one additional team member

### ADR Checklist

- [ ] ADR numbered and filed in `docs/adr/`
- [ ] Status set (proposed / accepted)
- [ ] Context section explains what made the decision necessary
- [ ] Decision section states clearly what was decided
- [ ] Consequences section lists both positive and negative outcomes
- [ ] Referenced from the architecture document where relevant

---

## Best Practices

**Record decisions, not just outcomes.**
The value of an ADR is not knowing what was decided — it is knowing why. A future team member who understands the context of a decision can make a better-informed choice about whether to maintain or change it.

**Prefer boring technology.**
Established, well-documented technology with a large community has lower long-term cost than novel alternatives with theoretical advantages. Choose the interesting new thing only when it solves a specific problem the boring alternative cannot.

**Design the error path, not just the happy path.**
How the system behaves when a dependency is unavailable, when input is invalid, or when an operation fails is as important as how it behaves when everything works. Document error behaviour explicitly.

**Avoid premature optimisation.**
Design for current scale with clear paths to scale further if needed. Engineering for ten times expected load before the product has proven its value diverts effort from building the product itself.

**Make implicit coupling explicit.**
Hidden dependencies between components are more dangerous than declared ones. If two components must change together, make that relationship explicit in code and documentation.

**Revisit the architecture document at the start of each sprint cycle.**
Architecture drift — the gap between the documented design and the actual system — compounds over time. A brief review at the start of each cycle catches drift early.

---

## Lessons Learned

*This section is updated after each project. Add a bullet with the date and a brief description of what was learned.*

- *(No entries yet. Add the first lesson after your next architecture engagement.)*

---

*← [03 Product Requirements](03_PRODUCT_REQUIREMENTS.md) · [05 Security & Governance →](05_SECURITY_AND_GOVERNANCE.md)*
