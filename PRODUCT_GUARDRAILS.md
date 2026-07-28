# Ask Annie Product Guardrails

**Version:** 1.0  
**Status:** Active

---

# Purpose

This document defines the non-negotiable rules for developing Ask Annie.

Every engineer, contributor, contractor and AI coding assistant working on this repository must follow these guardrails.

If implementation guidance conflicts with these guardrails, these guardrails take precedence.

---

# Product Mission

Ask Annie exists to help people make safer digital decisions.

Every feature, design decision and code change should support this mission.

If a proposed feature does not clearly improve the user's ability to make a safer digital decision, it should be challenged before implementation.

---

# Product Values

Every change should improve at least one of the following:

- Trust
- Simplicity
- Accessibility
- Privacy
- Security
- Clarity
- Confidence

Changes that reduce any of these values require explicit review.

---

# AI Behaviour

Annie is a trusted AI companion.

She is not:

- a cybersecurity expert
- a lawyer
- a police officer
- a financial adviser
- a replacement for professional judgement

Annie should guide users, not make decisions for them.

---

# User Experience

The application should always feel:

- Calm
- Friendly
- Patient
- Honest
- Reassuring
- Professional

Never create unnecessary anxiety.

Never shame the user.

Never use fear as a design tool.

---

# Privacy Rules

Never:

- store submitted messages unless explicitly approved
- store uploaded screenshots by default
- log message contents
- log uploaded image contents
- expose user data in logs
- expose AI prompts in client-side code

Collect the minimum data necessary to complete the request.

---

# Security Rules

Never:

- expose API keys
- hard-code secrets
- bypass server-side validation
- trust client-side validation
- execute user content
- render model-generated HTML
- disable security headers
- remove rate limiting without approval

Security should never be sacrificed for development speed.

---

# AI Output Rules

Every AI response must:

- conform to the documented response schema
- pass server-side validation
- explain uncertainty
- avoid unsupported certainty
- provide practical next steps

Never display raw model output directly to users.

---

# Accessibility Rules

Accessibility is a release requirement.

Never remove:

- keyboard navigation
- visible focus states
- semantic HTML
- screen-reader support
- sufficient colour contrast
- reduced-motion support

All new features must maintain WCAG 2.2 AA compliance.

---

# Design Rules

Do not redesign Ask Annie without approval.

Maintain:

- the documented colour palette
- typography
- spacing system
- interaction patterns
- tone of voice

Consistency is more important than novelty.

---

# Engineering Rules

Prefer:

- small pull requests
- small commits
- clear commit messages
- modular components
- reusable code
- automated tests

Avoid unnecessary complexity.

Choose the simplest solution that satisfies the requirements.

---

# Feature Creep

Do not add features simply because they are technically possible.

Before implementing any feature, ask:

1. Does this help users make safer digital decisions?
2. Is this required for the MVP?
3. Is there evidence users need it?
4. Does it introduce unnecessary complexity?

If the answer is "No" to any of these, postpone the feature.

---

# AI Coding Assistant Rules

Before writing code, every AI coding assistant must:

1. Read the repository documentation.
2. Identify the relevant requirements.
3. Explain its implementation plan.
4. Wait for approval before making major architectural changes.

AI coding assistants must not:

- rewrite documentation unnecessarily
- rename files without reason
- replace established architecture
- ignore response schemas
- invent product behaviour
- remove tests
- remove accessibility
- introduce dependencies without justification

---

# Code Quality

Every contribution should leave the repository in a better state than it was found.

When possible:

- reduce duplication
- improve readability
- improve testability
- improve documentation
- improve maintainability

Avoid premature optimisation.

---

# Documentation

If code changes alter behaviour, update the relevant documentation in the same change.

The documentation and implementation should never drift apart.

---

# Decision Making

When multiple solutions exist, choose the one that best supports:

1. User trust
2. Security
3. Accessibility
4. Simplicity
5. Maintainability
6. Performance

Performance should not come at the expense of trust or safety.

---

# Definition of Success

Ask Annie is successful when users:

- understand the advice
- know what to do next
- feel more confident
- trust the product enough to return

The goal is not to impress users with AI.

The goal is to help them make better decisions.

---

# Final Principle

Every line of code should answer one question:

> Does this make Ask Annie a more trustworthy companion?

If the answer is no, reconsider the change.
