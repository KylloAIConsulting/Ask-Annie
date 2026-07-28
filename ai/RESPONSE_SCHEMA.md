# Ask Annie Response Schema

**Version:** 1.0

**Status:** Active

---

# Purpose

Every AI model used by Ask Annie must return responses using this schema.

The schema provides:

- Consistent user experience
- Predictable frontend behaviour
- Easier testing
- Model independence
- Future extensibility

The AI may change.

The response format should not.

---

# JSON Schema

```json
{
  "summary": "",
  "riskLevel": "",
  "confidence": "",
  "explanation": "",
  "warningSigns": [],
  "recommendedActions": [],
  "thingsToAvoid": [],
  "officialVerificationAdvice": "",
  "privacyReminder": "",
  "emergencyAdvice": "",
  "requiresHumanReview": false
}
```

---

# Field Definitions

## summary

One sentence.

Explain the overall assessment.

Example:

> This message contains several warning signs commonly associated with phishing attempts.

---

## riskLevel

Allowed values only:

```

LOWER_RISK
CONCERNING
HIGH_RISK

```

---

## confidence

Allowed values:

```

LOW
MEDIUM
HIGH

```

Confidence refers to Annie's confidence in the assessment.

Not whether the content is safe.

---

## explanation

Maximum:

250 words

Explain:

- why Annie reached this conclusion
- which indicators influenced the assessment
- any uncertainty

Always use plain English.

---

## warningSigns

Array of concise observations.

Example

```json
[
"Unexpected payment request",
"Sense of urgency",
"Unknown website"
]
```

---

## recommendedActions

Ordered list.

Example

```json
[
"Pause before taking action.",
"Contact your bank using the number on your card.",
"Do not use the phone number provided in the message."
]
```

---

## thingsToAvoid

Actions the user should avoid.

Example

```json
[
"Do not click the link.",
"Do not reply.",
"Do not share verification codes."
]
```

---

## officialVerificationAdvice

Single paragraph.

Explain how the user can verify the request independently.

Never recommend using contact details supplied in suspicious content.

---

## privacyReminder

Example:

> Avoid sharing unnecessary personal or financial information until you have independently verified the request.

---

## emergencyAdvice

Only populated when appropriate.

Examples:

Bank fraud

Identity theft

Police impersonation

Account compromise

Otherwise:

Return an empty string.

---

## requiresHumanReview

Boolean.

True when:

- insufficient information exists
- evidence conflicts
- high consequence decision
- legal advice required
- medical advice required

Otherwise:

False.

---

# Future Fields

Future versions may include:

- detectedScamCategory
- detectedOrganisation
- estimatedFinancialRisk
- sentimentAnalysis
- urgencyScore
- languageConfidence
- accessibilityReadingLevel

---

# Validation Rules

Every response must satisfy:

✓ Every mandatory field present.

✓ No additional fields.

✓ Plain English.

✓ No markdown.

✓ No HTML.

✓ No emojis.

✓ No technical jargon.

✓ No unsupported certainty.

---

# Response Philosophy

The response should answer three questions:

1. What did Annie find?

2. Why does it matter?

3. What should the user do next?

If any of these are missing, the response is incomplete.