# 11 — Deployment

> **Playbook chapter:** 11 of 12
> **Last reviewed:** 2026-07-29

---

## Purpose

Deployment is the process of releasing software to a production environment where real users can access it. Done well, deployment is routine, low-risk, and fast to reverse. Done poorly, it is the most stressful event in the engineering cycle.

This chapter defines the standards, practices, and checklists that make deployment safe and repeatable.

---

## Scope

This chapter applies to all production deployments of software we build. It covers:

- Deployment pipeline design and CI/CD standards
- Environment management
- Release processes and approval gates
- Rollback and incident response
- Post-deployment verification

It does not cover infrastructure provisioning (which is handled in the architecture phase) or ongoing operational monitoring (which is addressed in chapter 05).

---

## Standard Process

### 1. Deployment Pipeline

Every project must have an automated deployment pipeline before the first production deployment. A pipeline that exists only for the first deployment is not a pipeline — it is a one-time script.

A production-ready pipeline must:

- Trigger automatically on merge to the main branch (or on a tagged release, depending on the release strategy)
- Run the full test suite and fail the deployment if any test fails
- Run the linter and type checker and fail the deployment if either fails
- Run a dependency vulnerability scan and fail on critical vulnerabilities
- Build the production artefact
- Deploy to staging before production
- Require explicit approval (or pass automated smoke tests) before promoting to production

The pipeline must be version-controlled alongside the application code.

### 2. Environment Strategy

Every project must maintain at minimum two environments:

| Environment | Purpose | Who accesses it |
|---|---|---|
| **Development** | Local developer machines; runs against local or shared dev dependencies | Engineering team only |
| **Staging** | Pre-production environment that mirrors production as closely as practical | Engineering team and client for acceptance testing |
| **Production** | Live environment serving real users | End users |

Environment-specific configuration (API endpoints, feature flags, log levels) must be managed through environment variables, never hardcoded in application code.

Secrets in each environment must be distinct. A production secret must never be used in staging or development.

### 3. Release Strategy

Agree on a release strategy with the client before the first deployment. Options include:

- **Continuous deployment:** every merge to main is automatically deployed to production after passing the pipeline
- **Scheduled releases:** deployments happen on a defined cadence (e.g. weekly)
- **Manual promotion:** the pipeline deploys to staging automatically; promotion to production requires explicit team or client approval

Document the agreed release strategy and the approval process for production deployments.

### 4. Pre-Deployment Checklist

Before every production deployment, verify:

- All pipeline stages pass (tests, lint, type check, security scan)
- The change has been reviewed and tested on staging
- Database migrations (if any) have been reviewed for reversibility and tested on staging
- The deployment has an agreed rollback plan
- The team has capacity to monitor the deployment and respond to issues in the hours following release
- Any required client sign-off has been obtained

### 5. Deployment Execution

- Deploy during low-traffic periods where possible
- Deploy one change at a time where possible — bundling multiple unrelated changes increases the blast radius of a problem
- Monitor application metrics and error rates in real time during and immediately after deployment
- Keep the deployment log: record what was deployed, when, by whom, and the pipeline run identifier

### 6. Post-Deployment Verification

After every production deployment:

- Verify that the application starts and serves requests (`/health` endpoint or equivalent)
- Manually verify the primary user journey in production
- Confirm that error rates and latency have not degraded
- Confirm that any database migrations completed successfully

A deployment is not complete until post-deployment verification passes. If verification fails, initiate rollback immediately.

### 7. Rollback

Every deployment must have a defined rollback plan before it is executed. The plan must answer:

- How will the previous version be restored? (re-deploy previous artefact, database migration rollback, feature flag toggle)
- How long will rollback take?
- Who has the authority to initiate a rollback?
- How will users be notified if service is disrupted?

Document the rollback plan for each deployment. Do not improvise rollback under pressure.

---

## Checklists

### Pipeline Setup Checklist

- [ ] Pipeline version-controlled alongside application code
- [ ] Test suite runs in pipeline and fails the build on failure
- [ ] Linter and type checker run in pipeline and fail the build on failure
- [ ] Dependency vulnerability scan runs in pipeline
- [ ] Staging deployment automated
- [ ] Production deployment requires explicit approval or passing smoke tests
- [ ] Environment variables managed per environment — no hardcoded config
- [ ] Secrets distinct per environment

### Pre-Deployment Checklist

- [ ] All pipeline stages passing
- [ ] Change tested and verified on staging
- [ ] Database migrations reviewed and tested (if applicable)
- [ ] Rollback plan documented
- [ ] Team available to monitor post-deployment
- [ ] Client sign-off obtained (if required)
- [ ] Deployment window agreed (low-traffic period preferred)

### Post-Deployment Checklist

- [ ] Application health check passes
- [ ] Primary user journey manually verified in production
- [ ] Error rate baseline confirmed — no regression from pre-deployment baseline
- [ ] Latency baseline confirmed — no regression
- [ ] Database migrations completed successfully (if applicable)
- [ ] Deployment logged (what, when, who, pipeline run)

---

## Best Practices

**Deploy frequently in small increments.**
The larger the deployment, the harder it is to diagnose a problem and the more users are affected by a rollback. Frequent small deployments reduce risk and make the deployment process routine.

**Make rollback easier than recovery.**
Design systems so that rolling back a deployment is faster and safer than forward-fixing in production. This means database migrations should be backwards-compatible and feature flags should be used for high-risk changes.

**Treat the pipeline as a product.**
A slow, flaky, or difficult-to-maintain pipeline is a tax on every deployment. Invest in keeping it fast, reliable, and straightforward to extend.

**Never test in production.**
Staging must be functionally equivalent to production for pre-deployment testing to mean anything. If staging and production diverge significantly, staging tests provide false confidence.

**Monitor before and after.**
Establish baselines for key metrics (error rate, p95 latency, throughput) before deploying. Compare them immediately after. A deployment that does not change any metric you monitor is a deployment you cannot validate.

**Log the deployment itself.**
Knowing exactly what was deployed and when is essential for incident investigation. If an error spike appears four hours after a deployment, you need to know what changed and when.

---

## Lessons Learned

*This section is updated after each project. Add a bullet with the date and a brief description of what was learned.*

- *(No entries yet. Add the first lesson after your next production deployment.)*

---

*← [10 Retrospectives](10_RETROSPECTIVES.md) · [12 Client Delivery →](12_CLIENT_DELIVERY.md)*
