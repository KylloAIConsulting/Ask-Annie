# 01 — Product Discovery

> **Playbook chapter:** 1 of 12
> **Last reviewed:** 2026-07-29

---

## Purpose

Product discovery is the structured process of understanding a problem deeply before proposing or designing a solution. Its goal is to ensure that the team builds the right thing — not merely to build the thing right.

Discovery prevents the most expensive mistake in software development: investing significant time and money building something that does not solve the actual problem.

---

## Scope

This chapter applies to:

- New product engagements at the start of a client relationship
- New feature work with significant scope or uncertainty
- Pivot or redesign decisions on existing products
- Any situation where the problem definition is unclear or contested

It does not apply to well-defined, low-ambiguity tasks such as bug fixes, dependency upgrades, or minor enhancements with agreed specifications.

---

## Standard Process

### 1. Stakeholder Alignment

Identify all stakeholders — those who have requirements, those who will use the product, and those who will be affected by it. Ensure every significant stakeholder has the opportunity to contribute to problem definition before the solution phase begins.

Key questions to answer:
- Who is the primary decision-maker on the client side?
- Whose problems are we solving?
- Who has the authority to change scope or direction?

### 2. Problem Definition

Articulate the problem in plain language before discussing technology. A good problem statement:

- Describes the current state (what is happening today)
- Describes the desired state (what should be happening)
- Identifies who is affected and how
- Avoids prescribing a solution

Document the agreed problem statement and get explicit sign-off from the client before proceeding.

### 3. User Research

Understand the people who will use the product. This may take the form of stakeholder interviews, user interviews, observation, surveys, or analysis of existing data. Minimum viable user research for any project is at least two conversations with representative users.

Document findings as user needs, not feature requests. A user who says "I need a button to export to CSV" is expressing a need to get data out of the system — the CSV format is a proposed solution, not the requirement.

### 4. Constraints Inventory

Surface non-negotiable constraints early. Common constraint categories:

- **Technical:** existing systems that must be integrated, mandated technology choices, infrastructure limitations
- **Regulatory / legal:** data residency, accessibility standards, industry compliance requirements
- **Business:** budget, timeline, team capacity
- **Operational:** how the product will be supported after launch, who owns it

### 5. Assumptions and Risks Log

Document what the team is assuming to be true. Every significant assumption is a risk. Capture:

- The assumption
- What would happen if it is wrong
- How the assumption could be validated before it causes harm

### 6. Discovery Output

Discovery concludes with a written output — typically a discovery brief or problem statement document — that captures:

- Agreed problem statement
- User needs (not feature list)
- Constraints
- Key assumptions and associated risks
- Open questions that must be answered before architecture or requirements begin

This document must be reviewed and approved by the client before the project advances to strategy.

---

## Checklists

### Discovery Kick-off Checklist

- [ ] All key stakeholders identified and contacted
- [ ] Primary client decision-maker confirmed
- [ ] Discovery scope and timeline agreed with client
- [ ] At least two user interviews scheduled or completed
- [ ] Constraints inventory started

### Discovery Close Checklist

- [ ] Problem statement written and approved by client
- [ ] User needs documented (not feature list)
- [ ] Constraints inventory complete
- [ ] Assumptions and risks log created
- [ ] Open questions documented with owners assigned
- [ ] Discovery brief reviewed and signed off by client
- [ ] Team aligned on what success looks like

---

## Best Practices

**Separate problem from solution in every conversation.**
When a client describes a feature they want, ask "what problem does that solve?" at least once before accepting it as a requirement. The stated feature is often not the best solution to the underlying problem.

**Record interviews.**
With permission, record stakeholder and user interviews. Memory is unreliable. Recordings allow the team to go back and find details that were missed in the moment.

**Include sceptics.**
If someone in the organisation is doubtful about the project, talk to them early. Their objections are often legitimate risks that the enthusiasts have rationalised away.

**Time-box discovery.**
Discovery can expand indefinitely if not constrained. Set a fixed end date at the start. Incomplete discovery is better than perpetual discovery with no output.

**Do not fall in love with the first problem statement.**
The first articulation of the problem is almost always incomplete. Expect to revise it as user research reveals complexity.

**Surface tension between stakeholders early.**
If two stakeholders have conflicting needs, this is a product decision that must be made before design begins — not a conflict that can be designed around.

---

## Lessons Learned

*This section is updated after each project. Add a bullet with the date and a brief description of what was learned.*

- *(No entries yet. Add the first lesson after your next discovery engagement.)*

---

*← [README](README.md) · [02 Product Strategy →](02_PRODUCT_STRATEGY.md)*
