# 06 — AI Collaboration

> **Playbook chapter:** 6 of 12
> **Last reviewed:** 2026-07-29

---

## Purpose

AI-assisted development is now a standard part of how software is built. This chapter defines how we use AI tools effectively, responsibly, and consistently — as a force multiplier on engineering quality, not as a replacement for engineering judgement.

The goal is not to use AI as much as possible. The goal is to produce better software, faster, with higher confidence in its correctness and security.

---

## Scope

This chapter covers:

- AI tools used during the development lifecycle (code generation, code review, documentation, testing)
- Practices for prompting, reviewing, and integrating AI-generated output
- Responsibilities that remain with the human engineer regardless of AI involvement
- AI as a product feature (building systems that use AI models as a component)

It does not cover the ethics of AI systems in general — only the practical engineering standards for working with AI tools on our projects.

---

## Standard Process

### 1. Treat AI Output as a First Draft

AI-generated code, documentation, and analysis is a starting point, not a finished product. Every line of AI-generated code that enters the codebase must be:

- Read and understood by the engineer who accepts it
- Reviewed against the same standards as human-written code
- Tested to the same standard as human-written code

"The AI wrote it" is not a defence for a bug, a security vulnerability, or a quality shortcoming.

### 2. Prompting Effectively

The quality of AI output is strongly influenced by the quality of the prompt. Effective prompting practices:

- Provide context: the purpose of the code, the constraints it must satisfy, the existing patterns it should follow
- Specify the expected output format: language, framework, style, whether tests are required
- State what the code must not do as well as what it must do
- Provide examples of existing code in the project so the AI can match conventions
- Break large tasks into smaller, well-scoped prompts rather than asking for everything at once

### 3. Reviewing AI-Generated Code

Review AI-generated code with heightened attention to:

- **Correctness:** does it do what was asked? Does it handle edge cases?
- **Security:** does it introduce injection vulnerabilities, hardcoded credentials, or insecure defaults?
- **Completeness:** has the AI silently omitted error handling, validation, or logging?
- **Hallucinated APIs:** AI models sometimes generate calls to functions or libraries that do not exist. Verify all API calls against documentation.
- **Test coverage:** AI-generated code without tests is technical debt. Do not accept it without tests.
- **Licence compatibility:** AI models are trained on public code. For security-sensitive or proprietary systems, review AI-generated algorithmic code with additional care.

### 4. AI for Testing and Documentation

AI tools can significantly accelerate test and documentation writing. Use them to:

- Generate initial unit test scaffolding from function signatures and acceptance criteria
- Produce first drafts of inline documentation and README sections
- Generate edge-case test scenarios from a description of the function's behaviour
- Produce accessibility test cases from UI component descriptions

Apply the same review standards: read and validate every generated test assertion. A test that always passes is worse than no test.

### 5. AI in Product Features

When building systems that incorporate AI models as a component (generation, classification, analysis, summarisation), additional engineering standards apply:

- **Define the output schema:** use a typed schema (e.g. Zod) to validate AI model responses before passing them into application logic. Never trust raw model output.
- **Design for failure:** AI model APIs fail, return unexpected formats, and produce wrong answers. Every AI-dependent code path must handle these cases gracefully.
- **Use a service interface:** isolate AI model calls behind a service interface so the underlying model can be swapped or mocked without changing application logic.
- **Mock first, integrate second:** build and test application logic against a typed mock before connecting to the real model API. This keeps development fast and tests deterministic.
- **Log and monitor model behaviour:** log enough information (prompt shape, response shape, latency, error rate) to diagnose quality issues in production.
- **Rate limiting and cost management:** AI API calls have financial cost. Apply rate limiting to user-facing endpoints that trigger model calls. Monitor spend.

---

## Checklists

### AI-Generated Code Review Checklist

- [ ] Code has been read in full by the accepting engineer
- [ ] All API calls verified against current documentation (no hallucinated methods)
- [ ] Security-sensitive paths reviewed: no hardcoded credentials, no injection vectors, input is validated
- [ ] Error handling is present and explicit
- [ ] Tests are present and assertions are correct
- [ ] Code follows project conventions (naming, structure, formatting)
- [ ] No unexplained dependencies introduced

### AI Feature Integration Checklist

- [ ] Output schema defined and validated with a schema library
- [ ] Service interface created to isolate model calls
- [ ] Mock implementation built and used in tests
- [ ] Failure modes handled: API error, timeout, malformed response, empty response
- [ ] Rate limiting applied to user-facing endpoints
- [ ] Logging in place (prompt shape, response shape, latency, errors)
- [ ] Cost implications reviewed and accepted

---

## Best Practices

**AI amplifies existing standards — it does not replace them.**
A team with high engineering standards will produce better AI-assisted code than a team with low standards. AI does not compensate for absent code review, missing tests, or unclear requirements.

**Do not use AI to generate secrets handling, authentication, or cryptographic code without deep review.**
These areas require precise correctness. AI models produce plausible-looking code that may be subtly wrong in ways that only manifest under specific conditions.

**Keep AI out of the hot path for critical decisions.**
For product features where AI output directly drives a consequential action — sending a message, making a financial transaction, flagging a user — build in human confirmation steps or conservative fallback behaviour.

**Iterate prompts, not just code.**
If AI-generated code misses the mark, improve the prompt before rewriting the output manually. A better prompt produces better output next time; a manual fix does not.

**Document AI-assisted decisions.**
When an AI tool helps resolve a significant design or architectural question, note that in the relevant ADR or design document. Future team members deserve to know the source and should be able to evaluate whether the reasoning remains valid.

---

## Lessons Learned

*This section is updated after each project. Add a bullet with the date and a brief description of what was learned.*

- *(No entries yet. Add the first lesson after your next AI-assisted project.)*

---

*← [05 Security & Governance](05_SECURITY_AND_GOVERNANCE.md) · [07 Engineering Standards →](07_ENGINEERING_STANDARDS.md)*
