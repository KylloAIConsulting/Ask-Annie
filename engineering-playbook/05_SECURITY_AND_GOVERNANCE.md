# 05 — Security & Governance

> **Playbook chapter:** 5 of 12
> **Last reviewed:** 2026-07-29

---

## Purpose

Security and governance ensure that the systems we build protect user data, resist attack, and meet applicable legal and regulatory obligations. These are not afterthoughts or final-sprint polish items — they are design constraints that must be addressed from the first sprint.

This chapter defines the minimum security baseline for every project, the process for classifying data and risk, and the governance practices that keep systems maintainable and auditable over time.

---

## Scope

This chapter applies to all production systems we build or operate. It covers:

- Data classification and handling
- Authentication and authorisation
- Input validation and output encoding
- Dependency management and vulnerability tracking
- Secrets management
- Logging, monitoring, and incident response
- Regulatory and compliance considerations

It is a baseline, not a ceiling. High-risk projects (financial data, health data, systems serving vulnerable populations) require additional controls beyond what is described here.

---

## Standard Process

### 1. Data Classification

Before writing any code that handles user data, classify the data the system will process:

| Class | Description | Examples |
|---|---|---|
| **Public** | Intended for unrestricted disclosure | Marketing content, published documentation |
| **Internal** | Not sensitive but not for public release | Usage analytics, internal configuration |
| **Confidential** | Business-sensitive or personally identifiable | User email addresses, usage history, payment metadata |
| **Restricted** | Highly sensitive; regulated or legally protected | Health records, financial account data, authentication credentials |

Document the data classes present in the system at the start of architecture. Each class has different requirements for encryption, access control, retention, and deletion.

### 2. Threat Modelling

For any system handling Confidential or Restricted data, conduct a lightweight threat model before architecture is finalised. Use the STRIDE framework as a prompt:

- **Spoofing:** can an attacker impersonate a legitimate user or service?
- **Tampering:** can data be modified in transit or at rest without detection?
- **Repudiation:** can an actor deny having taken an action?
- **Information disclosure:** can data be accessed by unauthorised parties?
- **Denial of service:** can the system be made unavailable to legitimate users?
- **Elevation of privilege:** can a low-privilege user gain higher-privilege access?

Document identified threats and the controls chosen to mitigate them.

### 3. Authentication and Authorisation

- Use an established identity provider or authentication library. Do not implement custom authentication unless there is a specific, documented reason the standard approach cannot be used.
- Apply the principle of least privilege: every user and service account has the minimum permissions required to perform its function.
- Document the authorisation model (who can do what) before implementation begins.
- Session tokens must be invalidated on logout and must expire.

### 4. Input Validation and Output Encoding

- Validate all input at the server boundary. Client-side validation is a user-experience aid, not a security control.
- Use a schema validation library (e.g. Zod) to enforce input shape, type, and range.
- Encode all output that will be rendered in a browser to prevent cross-site scripting.
- Use parameterised queries or an ORM for all database interactions. Never construct queries by string concatenation.

### 5. Secrets Management

- No secrets in source code. Ever.
- No secrets in client-side code. Ever.
- Store secrets in the environment's secrets management facility (environment variables injected at runtime, a secrets manager service).
- Rotate secrets on a defined schedule and immediately upon suspected compromise.
- Document which secrets the project requires in `.env.example` with descriptions but no values.

### 6. Dependency Management

- Pin direct dependencies to exact versions in production.
- Run automated dependency vulnerability scanning as part of the CI pipeline.
- Review and act on vulnerability reports within agreed SLAs:
  - Critical: within 24 hours
  - High: within 7 days
  - Moderate: within the next sprint
  - Low: tracked in backlog
- Remove unused dependencies. Every dependency is an attack surface.

### 7. Logging and Monitoring

- Log sufficient information to reconstruct the sequence of events leading to an incident.
- Never log credentials, session tokens, or sensitive user data.
- Ensure logs are structured (JSON preferred) and stored in a system that supports querying and retention.
- Define alert thresholds for error rates, latency, and security events before launch.

### 8. Incident Response

Document a basic incident response plan before go-live:

- How will the team be notified of an incident?
- Who is the primary responder?
- What is the process for assessing severity?
- How will affected users be notified if required?
- How will a post-incident review be conducted?

---

## Checklists

### Pre-Build Security Checklist

- [ ] Data classification completed and documented
- [ ] Threat model completed (required for Confidential/Restricted data)
- [ ] Authentication and authorisation model documented
- [ ] Secrets management approach confirmed — no secrets in code
- [ ] Input validation strategy defined
- [ ] Regulatory requirements identified (GDPR, accessibility legislation, sector-specific rules)

### Pre-Launch Security Checklist

- [ ] Dependency vulnerability scan run and findings addressed
- [ ] No secrets in source code (automated check in CI)
- [ ] Authentication tested: unauthorised access returns 401/403, not 200
- [ ] Input validation tested: malformed and oversized inputs handled gracefully
- [ ] Error responses do not leak stack traces, internal paths, or system details in production
- [ ] Rate limiting applied to authentication endpoints and user-facing APIs
- [ ] HTTPS enforced; HTTP redirects to HTTPS
- [ ] Security headers set (Content-Security-Policy, X-Content-Type-Options, etc.)
- [ ] Logging in place; no sensitive data in logs
- [ ] Incident response plan documented and shared with client

---

## Best Practices

**Security is a design constraint, not a feature.**
Adding security controls after the system is built is expensive and often incomplete. Address authentication, authorisation, and data classification in the architecture phase.

**Assume the network is hostile.**
Validate and authorise every request at the server boundary, regardless of where it originates. Internal services can be compromised.

**Defence in depth.**
No single control is sufficient. Layer controls so that a failure in one does not expose the system to complete compromise.

**Make the secure path the easy path.**
If following the secure approach requires more effort than an insecure shortcut, developers will take the shortcut under pressure. Make secure patterns the default in code scaffolding and templates.

**Privacy by design.**
Collect only the data required to provide the service. Retain it only as long as necessary. Give users meaningful control over their data.

**Test your assumptions.**
A threat model is a hypothesis. Validate it with automated scanning, penetration testing (for high-risk systems), and code review focused on security boundaries.

---

## Lessons Learned

*This section is updated after each project. Add a bullet with the date and a brief description of what was learned.*

- *(No entries yet. Add the first lesson after your next security review.)*

---

*← [04 Architecture](04_ARCHITECTURE.md) · [06 AI Collaboration →](06_AI_COLLABORATION.md)*
