# Kyllo Product Engineering Playbook

> **Version:** 1.0
> **Owner:** Kyllo Engineering
> **Last reviewed:** 2026-07-29

---

## What This Is

The Kyllo Product Engineering Playbook is the single authoritative reference for how we discover, design, build, ship, and support software products. It captures the processes, standards, checklists, and hard-won lessons that define the way we work — not as a bureaucratic record, but as a living guide that makes every project faster, more predictable, and more consistent.

This playbook covers the full product engineering lifecycle: from the first conversation with a client through discovery, architecture, development, testing, and deployment, to delivery and handover. It applies to every project we run, regardless of size or technology stack.

---

## Why It Exists

Good engineering is repeatable. The best teams do not reinvent their process on every project — they refine a shared process, document what works, and update it when they learn something better.

This playbook exists so that:

- **Every project starts from a solid foundation.** No guessing at how we structure requirements, review code, or manage sprints.
- **Knowledge does not live in one person's head.** Decisions, conventions, and lessons are written down and findable.
- **New team members ramp up faster.** The playbook is the answer to "how do we do things here?"
- **Clients get consistent quality.** The standards in this playbook are the standards our clients can hold us to.

---

## How to Use It

Each chapter in this playbook covers one phase or domain of our work. Chapters follow a common structure: purpose, scope, standard process, checklists, best practices, and a lessons-learned section that grows over time.

**For day-to-day work:** Use the relevant chapter's checklists and process section as a guide for the work in front of you.

**For project kick-off:** Work through chapters 1–4 (Discovery, Strategy, Requirements, Architecture) before writing a line of code.

**For sprint planning and delivery:** Chapters 9–12 cover the rhythms that keep a project on track.

**For onboarding:** Read the full playbook end-to-end. It is not long. The context it gives is worth more than any individual section.

---

## Chapters

| # | Chapter | What It Covers |
|---|---|---|
| 01 | [Product Discovery](01_PRODUCT_DISCOVERY.md) | Understanding the problem before proposing a solution |
| 02 | [Product Strategy](02_PRODUCT_STRATEGY.md) | Defining direction, success, and trade-offs |
| 03 | [Product Requirements](03_PRODUCT_REQUIREMENTS.md) | Translating strategy into buildable specifications |
| 04 | [Architecture](04_ARCHITECTURE.md) | Technical design decisions and system structure |
| 05 | [Security & Governance](05_SECURITY_AND_GOVERNANCE.md) | Security practices, compliance, and data handling |
| 06 | [AI Collaboration](06_AI_COLLABORATION.md) | Working effectively with AI tooling and AI-assisted development |
| 07 | [Engineering Standards](07_ENGINEERING_STANDARDS.md) | Code quality, conventions, and review practices |
| 08 | [Testing & Quality](08_TESTING_AND_QUALITY.md) | Test strategy, coverage standards, and QA processes |
| 09 | [Sprint Management](09_SPRINT_MANAGEMENT.md) | Planning, execution, and communication within sprints |
| 10 | [Retrospectives](10_RETROSPECTIVES.md) | Learning from what happened and improving what comes next |
| 11 | [Deployment](11_DEPLOYMENT.md) | Releasing software safely and reliably |
| 12 | [Client Delivery](12_CLIENT_DELIVERY.md) | Handover, documentation, and relationship practices |

---

## Principles

These principles underpin every chapter. When a situation is not covered by the playbook, default to these.

**Clarity over cleverness.**
Readable, obvious code and documentation outlasts clever code and institutional memory. Write for the next person.

**Decisions deserve reasons.**
A decision without a rationale is just a rule. Document *why*, not only *what*, so future teams can apply judgement at the edges.

**Checklists are not bureaucracy.**
They are memory aids. A missed checklist item in production is expensive. A skipped checklist step is a choice, not a shortcut.

**Slow down to go fast.**
Discovery, architecture, and requirements work done thoroughly upstream costs less than rework done downstream. The weeks we invest before writing code repay themselves many times over.

**The playbook is wrong in places.**
It reflects what we knew when we wrote it. When you discover something better — or something that does not hold — open a pull request. The lessons-learned section of each chapter is the front door for updates.

---

## Maintaining This Playbook

This playbook lives in the repository it was created in and should be versioned alongside the code it governs.

**To propose a change:** Open a pull request with a clear description of what is changing and why. Reference the project or incident that prompted the update.

**To add a lesson learned:** Add a bullet to the relevant chapter's "Lessons Learned" section. Include the date and enough context that someone reading it a year later will understand it without asking you.

**To flag something as outdated:** Open an issue or add a `> ⚠️ This section needs review.` callout inline. Do not silently follow an outdated process.

---

*This playbook is maintained by the Kyllo engineering team. Questions and contributions are welcome.*
