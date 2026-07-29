import React from 'react';
import styles from './ResultsScreen.module.css';
import type { AnnieResponse, RiskLevel } from '../../types/annie';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ResultsScreenProps = {
  /** Validated response from the AI analysis. */
  result: AnnieResponse;
  /** Called when the user clicks "Leave feedback". Navigates to FeedbackScreen. */
  onFeedback: () => void;
  /** Called when the user clicks "Check another message". Resets session. */
  onReset: () => void;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Maps the machine-readable riskLevel to a plain-English label and the
 * CSS Module class that sets the badge colour. Both are always rendered in
 * text so colour is never the sole means of conveying information.
 */
const RISK_META: Record<
  RiskLevel,
  { label: string; badgeClass: string; sectionClass: string }
> = {
  LOWER_RISK: {
    label: 'Lower risk',
    badgeClass: styles.riskBadgeLower,
    sectionClass: styles.riskBannerLower,
  },
  CONCERNING: {
    label: 'Concerning',
    badgeClass: styles.riskBadgeConcerning,
    sectionClass: styles.riskBannerConcerning,
  },
  HIGH_RISK: {
    label: 'High risk',
    badgeClass: styles.riskBadgeHigh,
    sectionClass: styles.riskBannerHigh,
  },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** A visually distinct card section with a labelled heading. */
const ResultSection: React.FC<{
  heading: string;
  children: React.ReactNode;
  className?: string;
}> = ({ heading, children, className }) => (
  <div className={`${styles.section} ${className ?? ''}`.trim()}>
    <h2 className={styles.sectionHeading}>{heading}</h2>
    {children}
  </div>
);

/** Renders a list of strings as a styled `<ul>`. */
const BulletList: React.FC<{ items: readonly string[] }> = ({ items }) => (
  <ul className={styles.bulletList}>
    {items.map((item, i) => (
      <li key={i} className={styles.bulletItem}>
        {item}
      </li>
    ))}
  </ul>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Results screen — displays Annie's plain-English risk assessment.
 *
 * Conditional sections:
 *   - Warning signs   — rendered only when warningSigns.length > 0
 *   - Things to avoid — rendered only when thingsToAvoid.length > 0
 *   - Emergency advice — rendered only when emergencyAdvice is non-empty
 *   - Human review notice — rendered only when requiresHumanReview is true
 *
 * All three risk levels are covered by the fixture suite:
 *   FIXTURE_LOWER_RISK    — all conditional sections absent
 *   FIXTURE_CONCERNING    — warningSigns + thingsToAvoid present
 *   FIXTURE_HIGH_RISK     — all conditional sections present, requiresHumanReview: true
 */
const ResultsScreen: React.FC<ResultsScreenProps> = ({
  result,
  onFeedback,
  onReset,
}) => {
  const {
    summary,
    riskLevel,
    explanation,
    warningSigns,
    recommendedActions,
    thingsToAvoid,
    officialVerificationAdvice,
    privacyReminder,
    emergencyAdvice,
    requiresHumanReview,
  } = result;

  const risk = RISK_META[riskLevel];

  return (
    <section
      className={styles.screen}
      data-testid="screen-results"
      aria-label="Annie's assessment"
    >
      {/* ── Risk banner ─────────────────────────────────────────────────── */}
      <div className={`${styles.riskBanner} ${risk.sectionClass}`}>
        <span
          className={`${styles.riskBadge} ${risk.badgeClass}`}
          aria-label={`Risk level: ${risk.label}`}
        >
          {risk.label}
        </span>
        <h1 className={styles.summary}>{summary}</h1>
      </div>

      {/*
       * Human review notice — shown when the model is uncertain and a human
       * should be consulted. Rendered as role="note" so screen readers treat
       * it as complementary information without triggering a live-region
       * announcement on mount.
       */}
      {requiresHumanReview && (
        <div
          className={styles.humanReviewNotice}
          role="note"
          data-testid="human-review-notice"
        >
          <h2 className={styles.humanReviewHeading}>
            Talk to someone you trust
          </h2>
          <p className={styles.humanReviewBody}>
            Annie recommends getting a second opinion on this one. You could
            speak to a family member, friend, your local Citizens Advice, or
            call the Age UK advice line free on&nbsp;
            <strong>0800&nbsp;678&nbsp;1602</strong>.
          </p>
        </div>
      )}

      {/* ── Main sections ────────────────────────────────────────────────── */}
      <div className={styles.sections}>
        {/* Explanation — always shown */}
        <ResultSection heading="What Annie found">
          <p className={styles.bodyText}>{explanation}</p>
        </ResultSection>

        {/* Warning signs — only when present */}
        {warningSigns.length > 0 && (
          <ResultSection heading="Warning signs">
            <BulletList items={warningSigns} />
          </ResultSection>
        )}

        {/* Recommended actions — always shown */}
        <ResultSection heading="What to do next">
          <BulletList items={recommendedActions} />
        </ResultSection>

        {/* Things to avoid — only when present */}
        {thingsToAvoid.length > 0 && (
          <ResultSection heading="Things to avoid">
            <BulletList items={thingsToAvoid} />
          </ResultSection>
        )}

        {/* Official verification — always shown */}
        <ResultSection heading="How to verify">
          <p className={styles.bodyText}>{officialVerificationAdvice}</p>
        </ResultSection>

        {/* Emergency advice — only when non-empty; role="alert" so screen
            readers announce the urgent content when this screen first renders */}
        {emergencyAdvice && (
          <ResultSection
            heading="Urgent action needed"
            className={styles.emergencySection}
          >
            <p
              className={styles.bodyText}
              role="alert"
              data-testid="emergency-advice"
            >
              {emergencyAdvice}
            </p>
          </ResultSection>
        )}
      </div>

      {/* ── Privacy reminder ────────────────────────────────────────────── */}
      <p className={styles.privacyReminder}>{privacyReminder}</p>

      {/* ── Actions ─────────────────────────────────────────────────────── */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onFeedback}
        >
          Leave feedback
        </button>
        <button
          type="button"
          className={styles.resetButton}
          onClick={onReset}
        >
          Check another message
        </button>
      </div>
    </section>
  );
};

export default ResultsScreen;
