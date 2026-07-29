# 12 — Client Delivery

> **Playbook chapter:** 12 of 12
> **Last reviewed:** 2026-07-29

---

## Purpose

Client delivery is the process of transferring a completed product — and the knowledge required to own and operate it — to the client. It is the final phase of every engagement and, done well, sets the client up for long-term success with what we have built together.

A clean delivery also protects us. A product handed over with clear documentation, a stable codebase, and well-managed access credentials leaves no loose ends that create support obligations or reputational risk after the engagement ends.

---

## Scope

This chapter applies to the close of every client engagement, whether the deliverable is a new product, a significant feature set added to an existing system, or a codebase transfer. It covers:

- Delivery documentation standards
- Knowledge transfer process
- Access and credential handover
- Post-delivery support arrangements
- Engagement close practices

---

## Standard Process

### 1. Delivery Planning

Begin planning the delivery at least one sprint before the intended close date. Delivery should not be an afterthought or a final-week rush. A delivery plan covers:

- What is being delivered (feature scope, technical artefacts, documentation)
- What is explicitly not included (deferred work, known limitations)
- Who on the client side is receiving the delivery
- What knowledge transfer sessions are required
- The timeline for access handover
- The agreed post-delivery support arrangement

Document the delivery plan and share it with the client for review.

### 2. Delivery Documentation

Every delivery must include the following documentation, written for the client's team — not for us:

**README / Getting Started guide**
- What the system does (one paragraph, plain language)
- How to run it locally (step by step, assuming no prior knowledge of the project)
- How to run the test suite
- How to configure it (all environment variables documented with descriptions and example values)
- Where to find additional documentation

**Architecture overview**
- System components and how they relate
- Data flows
- Integration points with external services
- Known limitations and design trade-offs

**Operations guide**
- How to deploy the system
- How to roll back a deployment
- What monitoring is in place and how to access it
- How to interpret common errors and what to do about them
- Who to contact if a dependency goes down

**Handover notes**
- What was built and what was deferred
- Any technical debt that was consciously carried forward, and its implications
- Recommendations for the next phase of development
- Any time-sensitive actions required (e.g. rotating a credential that expires, completing a deferred security fix)

### 3. Knowledge Transfer

Documentation alone is insufficient. Hold at minimum one knowledge transfer session with the client's technical team covering:

- Codebase walkthrough: structure, conventions, where things live
- Local setup: running the project from a clean checkout
- Deployment process: end to end, with the client's team performing the steps
- Operations: how to monitor, how to respond to common issues, how to roll back

Record knowledge transfer sessions where the client consents. Recordings are useful for team members who were not present.

### 4. Access and Credential Handover

Before the engagement closes:

- Transfer ownership of all relevant accounts, repositories, cloud infrastructure, and third-party services to the client
- Revoke any agency access that should not persist after delivery (developer accounts, deployment credentials, API keys held on the client's behalf)
- Confirm that the client holds all credentials necessary to operate and maintain the system independently
- Document the list of services transferred and confirm receipt with the client in writing

Never leave an engagement with active credentials that are not needed for an agreed post-delivery support arrangement.

### 5. Codebase Handover

Ensure the codebase is in a state the client can take forward:

- Main branch is clean, all open work either completed or documented as deferred
- No work-in-progress branches that would create confusion
- All tests passing
- No linting errors or type errors
- Dependencies up to date (or any outstanding updates documented)
- All secrets removed from the repository — a final audit of the history for accidentally committed credentials
- Licence files present and accurate

### 6. Post-Delivery Support

Agree the post-delivery support arrangement explicitly before the engagement closes. Common options:

- **No support:** the client takes full ownership on delivery with no ongoing obligation
- **Hypercare period:** a defined period (e.g. two to four weeks) of priority support following delivery, covering defects in the delivered work
- **Ongoing retainer:** a defined monthly commitment for maintenance, minor enhancements, and support

Document the agreed arrangement, its scope, its duration, and how the client raises issues within it. Ambiguity in support scope is a frequent source of post-engagement friction.

### 7. Engagement Close

Mark the engagement as closed when:

- Delivery documentation has been accepted by the client
- Knowledge transfer sessions are complete
- Access and credential handover is confirmed
- Any post-delivery support arrangement is documented and signed
- Final invoicing is complete
- A project retrospective has been scheduled or conducted (chapter 10)

---

## Checklists

### Delivery Readiness Checklist

- [ ] Delivery plan documented and shared with client
- [ ] README / Getting Started guide written and reviewed
- [ ] Architecture overview current and accurate
- [ ] Operations guide written
- [ ] Handover notes written (what was built, what was deferred, technical debt, recommendations)
- [ ] All tests passing on main branch
- [ ] No linting errors or type errors on main branch
- [ ] Repository history audited for accidentally committed secrets
- [ ] All dependencies documented in `.env.example` with descriptions

### Access Handover Checklist

- [ ] Client has ownership of: source code repository
- [ ] Client has ownership of: cloud infrastructure and hosting accounts
- [ ] Client has ownership of: domain names and DNS
- [ ] Client has ownership of: third-party service accounts used by the product
- [ ] Client has received: all credentials required to operate the system independently
- [ ] Agency access revoked for all accounts not required for agreed ongoing support
- [ ] Handover confirmed in writing by client

### Engagement Close Checklist

- [ ] All delivery documentation accepted by client
- [ ] Knowledge transfer sessions complete
- [ ] Access handover confirmed
- [ ] Post-delivery support arrangement documented and agreed
- [ ] Final invoice issued
- [ ] Project retrospective conducted or scheduled
- [ ] Lessons learned added to relevant playbook chapters

---

## Best Practices

**Write documentation for someone who was not in the room.**
Every person who contributed to the project knows things that are not written down. Delivery documentation must be written on the assumption that the reader has no context. Ask a team member unfamiliar with the project to follow the setup guide; if they get stuck, the guide is incomplete.

**Deliver continuously, not only at the end.**
Documentation, knowledge transfer, and access preparation should happen throughout the engagement, not in a final sprint. A project that does continuous delivery makes the close less stressful and the client more confident.

**Be explicit about what is not included.**
Clients often have expectations about delivered work that were never formally agreed. A clear handover document that lists what is included and what is not prevents post-delivery misunderstandings.

**Leave no loose ends.**
An active AWS account we created, a subscription we set up, a domain we registered — if it is not explicitly in scope for ongoing support, transfer it or cancel it. "We'll sort it out later" becomes an obligation that lingers.

**A good delivery builds the next engagement.**
The quality of the handover is often what the client remembers most. A well-documented, cleanly delivered product is a business development asset as much as a professional obligation.

**Capture the relationship, not just the project.**
At close, note what we learned about working with this client — their decision-making style, their technical team's strengths and gaps, what communication cadence worked best. This institutional knowledge belongs in our internal records, not in a retrospective filed in their repository.

---

## Lessons Learned

*This section is updated after each project. Add a bullet with the date and a brief description of what was learned.*

- *(No entries yet. Add the first lesson after your next client delivery.)*

---

*← [11 Deployment](11_DEPLOYMENT.md) · [README](README.md)*
