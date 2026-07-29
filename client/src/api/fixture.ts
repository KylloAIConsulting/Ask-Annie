/**
 * Development-only fixture data for all three Annie risk levels.
 *
 * This module must NOT be imported directly in production code.
 * App.tsx gates its use behind DEV_USE_FIXTURE (from lib/fixtureMode.ts) and
 * performs a dynamic import so it is excluded from production bundles.
 */
import { AnnieResponseSchema, type AnnieResponse, type RiskLevel } from '@shared/annieResponse';

// ---------------------------------------------------------------------------
// Fixtures — validated at module load time against AnnieResponseSchema
// ---------------------------------------------------------------------------

/**
 * LOWER_RISK — a routine, legitimate-looking library notification.
 *
 * Demonstrates the absence of optional conditional sections:
 *   - warningSigns: empty (no red flags detected)
 *   - thingsToAvoid: empty (no risky actions to warn against)
 *   - emergencyAdvice: empty (no urgent action required)
 *   - requiresHumanReview: false
 */
export const FIXTURE_LOWER_RISK: AnnieResponse = AnnieResponseSchema.parse({
  summary:
    'This message appears to be a routine notification from your local library. Annie did not find any warning signs.',
  riskLevel: 'LOWER_RISK',
  confidence: 'HIGH',
  explanation:
    'The message uses plain, unhurried language, asks for nothing, and contains only information about a book reservation. There are no links to click, no requests for personal details, and no sense of urgency.',
  warningSigns: [],
  recommendedActions: [
    'Visit your library branch at the address you already know to collect your book.',
  ],
  thingsToAvoid: [],
  officialVerificationAdvice:
    'If you want to double-check, you can call your library using the number on their official website.',
  privacyReminder:
    'You do not need to share this message with anyone.',
  emergencyAdvice: '',
  requiresHumanReview: false,
});

/**
 * CONCERNING — a message that looks like a bank alert but has suspicious features.
 *
 * Demonstrates non-empty thingsToAvoid.
 */
export const FIXTURE_CONCERNING: AnnieResponse = AnnieResponseSchema.parse({
  summary:
    'This message claims to be from your bank about a suspicious transaction, but Annie spotted some warning signs worth checking before you do anything.',
  riskLevel: 'CONCERNING',
  confidence: 'MEDIUM',
  explanation:
    'While the message uses your bank\'s name and mentions a real-sounding reason to get in touch, it asks you to call a telephone number included in the message itself. Genuine banks rarely ask you to call numbers sent in a text. It is possible this is a real alert, but it is also a common pattern used by scammers.',
  warningSigns: [
    'Asks you to call a number provided in the message rather than the one on your card.',
    'Creates a mild sense of urgency without giving you time to verify.',
  ],
  recommendedActions: [
    'Do not call the number in this message.',
    'Find your bank\'s official customer service number on the back of your bank card or on their official website.',
    'Call that number and ask whether there is a genuine alert on your account.',
  ],
  thingsToAvoid: [
    'Do not call the number printed in this message — it may connect you to a scammer.',
    'Do not give out your PIN, passwords, or one-time security codes to anyone who calls you.',
  ],
  officialVerificationAdvice:
    'Your bank\'s genuine contact number is always printed on the back of your debit or credit card. Use that number to check whether this alert is real.',
  privacyReminder:
    'Do not forward this message to anyone until you have confirmed whether it is genuine.',
  emergencyAdvice: '',
  requiresHumanReview: false,
});

/**
 * HIGH_RISK — a classic advance-fee prize scam.
 *
 * Demonstrates:
 *   - non-empty emergencyAdvice (required for HIGH_RISK)
 *   - requiresHumanReview: true
 */
export const FIXTURE_HIGH_RISK: AnnieResponse = AnnieResponseSchema.parse({
  summary:
    'This message has all the hallmarks of a prize or advance-fee scam. Do not send any money or share any personal details.',
  riskLevel: 'HIGH_RISK',
  confidence: 'HIGH',
  explanation:
    'The message tells you that you have won a prize you never entered and asks you to pay a fee to release your winnings. This is a well-known scam technique. Once you pay the fee, the scammer will ask for more money or disappear entirely. No legitimate prize scheme asks winners to pay upfront.',
  warningSigns: [
    'Claims you have won a competition or lottery you never entered.',
    'Asks you to pay a fee before you can receive your prize.',
    'Uses urgent or excited language to pressure you into acting quickly.',
    'The sender\'s contact details cannot be verified against any known organisation.',
  ],
  recommendedActions: [
    'Do not reply to this message.',
    'Do not send any money.',
    'Delete the message.',
    'Report it to Action Fraud at www.actionfraud.police.uk or by calling 0300 123 2040.',
  ],
  thingsToAvoid: [
    'Do not send money, vouchers, or gift cards to claim a prize.',
    'Do not share your bank details, passport, or national insurance number.',
    'Do not click any links or call any numbers in this message.',
  ],
  officialVerificationAdvice:
    'No legitimate prize or lottery will ever ask you to pay a fee to collect your winnings. If you are unsure, speak to a trusted family member, your local Citizens Advice, or call the Age UK advice line on 0800 678 1602.',
  privacyReminder:
    'Do not share this message or your response with the original sender.',
  emergencyAdvice:
    'If you have already sent money or shared your bank details, call your bank immediately using the number on the back of your card and ask them to stop any payments. You should also report the scam to Action Fraud on 0300 123 2040.',
  requiresHumanReview: true,
});

// ---------------------------------------------------------------------------
// Fixture map (used by the selector)
// ---------------------------------------------------------------------------

const FIXTURES: Record<RiskLevel, AnnieResponse> = {
  LOWER_RISK: FIXTURE_LOWER_RISK,
  CONCERNING: FIXTURE_CONCERNING,
  HIGH_RISK: FIXTURE_HIGH_RISK,
};

// ---------------------------------------------------------------------------
// Selector
// ---------------------------------------------------------------------------

const VALID_LEVELS = new Set<string>(['LOWER_RISK', 'CONCERNING', 'HIGH_RISK']);

/**
 * Returns the fixture matching the supplied risk-level string.
 * Defaults to FIXTURE_LOWER_RISK when the value is absent or not a
 * recognised risk level — the expected behaviour when reading from an
 * unset or mis-typed environment variable.
 */
export function selectFixture(level?: string): AnnieResponse {
  if (level !== undefined && VALID_LEVELS.has(level)) {
    return FIXTURES[level as RiskLevel];
  }
  return FIXTURE_LOWER_RISK;
}

// ---------------------------------------------------------------------------
// Async helper
// ---------------------------------------------------------------------------

/**
 * Resolves with the supplied fixture after `delay` milliseconds.
 *
 * If an AbortSignal is supplied and is (or becomes) aborted before the timer
 * fires, the promise rejects with a DOMException whose name is 'AbortError'
 * and the pending timer is cleared.
 *
 * @param fixture - The AnnieResponse to resolve with.
 * @param delay   - Milliseconds to wait before resolving (default 1500).
 * @param signal  - Optional AbortSignal for cancellation.
 */
export function resolveFixture(
  fixture: AnnieResponse,
  delay = 1500,
  signal?: AbortSignal,
): Promise<AnnieResponse> {
  return new Promise<AnnieResponse>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('The fixture request was aborted.', 'AbortError'));
      return;
    }

    const timer = setTimeout(() => {
      resolve(fixture);
    }, delay);

    if (signal) {
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          reject(new DOMException('The fixture request was aborted.', 'AbortError'));
        },
        { once: true },
      );
    }
  });
}
