# 02 — Product Strategy

> **Playbook chapter:** 2 of 12
> **Last reviewed:** 2026-07-29

---

## Purpose

Product strategy translates a validated problem into a clear direction for the product. It defines what success looks like, where the product is headed, what it will and will not do, and how the team will make trade-off decisions when they arise.

A strategy is not a feature list. It is the frame that makes every subsequent decision faster and more consistent.

---

## Scope

This chapter applies to:

- New products entering design or build
- Existing products undergoing a significant pivot or expansion
- Engagements where the client lacks a documented product strategy

It does not replace product ownership. The client retains responsibility for strategic direction; this chapter describes how we surface, challenge, and document that direction before committing to a build.

---

## Standard Process

### 1. Define Success Metrics

Agree on how success will be measured before writing requirements. Good success metrics are:

- **Specific:** tied to a measurable outcome, not a vague aspiration
- **Attributable:** the product's performance should have a direct bearing on the metric
- **Time-bound:** have a target date or review cadence
- **Agreed:** signed off by the client, not unilaterally defined by the team

Distinguish between:
- **Primary metric:** the one number that, above all others, tells us whether the product is working
- **Secondary metrics:** supporting signals that give context to the primary metric
- **Guardrail metrics:** numbers that must not deteriorate — they indicate unintended harm

Document all three categories before strategy is finalised.

### 2. Establish the Product Vision

Write a one- to three-sentence product vision that describes what the product will be in its mature state, for whom, and what it will enable them to do. The vision should be:

- Ambitious enough to provide direction over multiple sprints
- Concrete enough to exclude things the product is clearly not
- Stable enough to survive individual feature decisions

The vision is not a marketing tagline. It is a working tool for the team.

### 3. Define the MVP Boundary

Identify the smallest version of the product that delivers genuine value to users and provides meaningful signal about whether the broader vision is viable.

A good MVP:
- Solves a real problem for a real user in a complete way
- Is not merely a proof of concept or internal demo
- Leaves enough out that it can be built quickly
- Generates learning that informs what to build next

Document explicitly what is in the MVP and, equally importantly, what is not. Deferred items belong in a backlog, not in "later" conversations.

### 4. Prioritisation Framework

Agree with the client how trade-offs will be made when scope, quality, cost, and timeline are in tension. Common frameworks include:

- **MoSCoW:** Must have / Should have / Could have / Won't have
- **RICE scoring:** Reach × Impact × Confidence ÷ Effort
- **Impact vs Effort matrix:** quick wins, major projects, fill-ins, time sinks

The choice of framework matters less than the fact that one exists and the client has agreed to use it. Document which framework applies to this engagement.

### 5. Risks and Dependencies

Surface strategic risks before development begins. Categories to consider:

- **Market risk:** will users want this?
- **Feasibility risk:** can this be built with available technology and budget?
- **Adoption risk:** will users actually use it after launch?
- **Dependency risk:** are there third-party services, integrations, or teams the product relies on?

Each risk should have an owner and a mitigation strategy.

### 6. Strategy Output

Strategy concludes with a strategy brief that captures:

- Product vision
- Success metrics (primary, secondary, guardrails)
- MVP scope (in and out)
- Prioritisation framework
- Key risks and mitigations
- Anything the product explicitly will not do

This document must be reviewed and approved by the client before requirements work begins.

---

## Checklists

### Strategy Workshop Checklist

- [ ] Discovery brief reviewed and discovery sign-off confirmed
- [ ] Product vision drafted and discussed with client
- [ ] Primary success metric agreed
- [ ] Secondary and guardrail metrics documented
- [ ] MVP boundary defined — in-scope items listed
- [ ] MVP boundary defined — explicitly out-of-scope items listed
- [ ] Prioritisation framework selected and agreed
- [ ] Strategic risks identified with owners assigned

### Strategy Sign-off Checklist

- [ ] Strategy brief written
- [ ] Vision statement approved by client
- [ ] Success metrics approved by client
- [ ] MVP scope approved by client
- [ ] Prioritisation framework confirmed in writing
- [ ] Risks and mitigations reviewed
- [ ] Strategy brief filed and accessible to the full project team

---

## Best Practices

**Write the out-of-scope list as carefully as the in-scope list.**
What a product does not do is as important as what it does. An explicit out-of-scope list prevents scope creep and resolves ambiguity quickly when new requests arrive.

**Challenge vanity metrics.**
"Number of users" and "page views" are easy to game and rarely indicate real value. Push for metrics that reflect user success, not user presence.

**The MVP is a learning vehicle, not a stripped-down product.**
An MVP that is too small generates no useful signal. An MVP that is too large never ships. Calibrate it to the smallest thing that puts the core value hypothesis to a real test.

**Document what the product is not for.**
A product that tries to serve everyone serves no one well. Explicitly naming excluded user groups or use cases is a strategic decision, not a failure of ambition.

**Strategy must survive personnel changes.**
If the product strategy lives only in the head of one person on the client side, it will fragment when they leave or are unavailable. A written, approved strategy brief is insurance.

**Revisit strategy at the start of each sprint cycle.**
Strategy is not set-and-forget. At the start of every sprint, spend five minutes confirming the agreed direction has not changed. If it has, update the brief before proceeding.

---

## Lessons Learned

*This section is updated after each project. Add a bullet with the date and a brief description of what was learned.*

- *(No entries yet. Add the first lesson after your next strategy engagement.)*

---

*← [01 Product Discovery](01_PRODUCT_DISCOVERY.md) · [03 Product Requirements →](03_PRODUCT_REQUIREMENTS.md)*
