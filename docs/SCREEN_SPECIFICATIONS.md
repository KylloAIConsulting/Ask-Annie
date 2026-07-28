# Ask Annie – MVP Screen Specifications

**Version:** 1.0  
**Status:** Active

---

# Purpose

This document defines the five core screens for the Ask Annie MVP.

It gives designers, developers and AI coding tools a clear description of:

- What appears on each screen
- What the user can do
- What each button should say
- How the user should feel
- How accessibility should be handled

The MVP should feel calm, simple and trustworthy.

---

# Screen 1 – Welcome

## Purpose

Help the user understand what Ask Annie does and begin an assessment quickly.

## Primary Message

### Heading

> Not sure if a message is genuine?

### Supporting Text

> Ask Annie can help you spot warning signs and decide what to do next.

### Reassurance

> You will not be judged. It is always sensible to check before you click, reply, pay or share information.

## Primary Actions

### Main Button

> Check a message

This should be the most prominent action.

### Secondary Button

> How Ask Annie works

This can open a simple explanation panel or move the user to a short information section.

## Optional Supporting Content

A small three-step explanation:

1. Share the message
2. Annie checks for warning signs
3. Get clear advice on what to do next

## Privacy Message

> Only share the information needed for the check. Remove personal details where possible.

## Design Requirements

- One clear primary action
- No sign-in requirement
- No technical language
- Large, readable heading
- Calm imagery or simple illustration
- No security shields, flashing alerts or threatening visuals

## Emotional Goal

The user should feel:

- Reassured
- Safe to continue
- Confident that checking is the right thing to do

---

# Screen 2 – Submit Content

## Purpose

Allow the user to paste suspicious text or upload an image.

## Heading

> What would you like Annie to check?

## Input Options

The user can choose between:

### Option 1

> Paste a message

### Option 2

> Upload a screenshot or photo

The user should not have to select a mode before seeing both options.

## Text Input

### Label

> Paste the message here

### Placeholder

> For example, paste the text from an email, text message or social media message.

### Guidance

> Remove names, account numbers and other personal details where possible.

## Image Upload

### Label

> Upload a screenshot or photo

### Supported Content

- Email screenshots
- Text messages
- Social media messages
- Letters
- Website pages
- QR codes in future versions

### Upload Button

> Choose an image

### Mobile Alternative

> Take a photo

This option should appear only where supported.

## Optional Context Field

### Label

> Is there anything else Annie should know?

### Placeholder

> For example, whether you were expecting the message or whether the sender contacted you before.

This field should be optional.

## Primary Button

> Check for warning signs

## Secondary Action

> Go back

## Validation Messages

If no content is supplied:

> Add a message or image before continuing.

If an unsupported image format is uploaded:

> This image type is not supported. Please choose a JPG, PNG or WebP image.

If the file is too large:

> This image is too large. Please choose a smaller image.

## Privacy Reminder

> Do not include passwords, security codes, full bank details or other highly sensitive information.

## Emotional Goal

The user should feel:

- In control
- Clear about what to submit
- Reassured about privacy
- Not rushed

---

# Screen 3 – Analysing

## Purpose

Reassure the user while Ask Annie reviews the content.

## Heading

> Annie is checking for warning signs

## Supporting Text

> This may take a few moments.

## Progress Messages

Progress messages may rotate calmly:

- Looking at the sender and wording
- Checking for pressure or urgency
- Reviewing requests for money or personal information
- Preparing clear guidance

## Privacy Reassurance

> Your information is being used only to provide this assessment.

## Cancel Option

> Cancel check

Cancellation should return the user to the submission screen without losing their content where technically possible.

## Loading Behaviour

- Use a simple progress indicator
- Avoid fake percentages
- Avoid countdown timers
- Avoid flashing animation
- Avoid alarming language

## Timeout Message

If analysis takes too long:

> This is taking longer than expected. Your information has not been lost.

Actions:

- Try again
- Return to your message

## Error Message

If the assessment fails:

> Annie could not complete the check this time.

Supporting text:

> Please try again. If the problem continues, you can still verify the message independently using the official contact details for the organisation.

## Emotional Goal

The user should feel:

- Reassured
- Supported
- Certain that something useful is happening
- Free from additional anxiety

---

# Screen 4 – Results

## Purpose

Explain the assessment clearly and tell the user what to do next.

## Opening Message

> Thank you for checking before taking action.

## Risk Summary

Display:

### Risk Level

One of:

- Lower Risk
- Concerning
- High Risk

### Confidence

One of:

- Low confidence
- Medium confidence
- High confidence

Confidence must always be explained as confidence in the assessment, not a measure of safety.

## Summary

Display one clear sentence from the `summary` field.

Example:

> This message contains several warning signs commonly associated with phishing attempts.

## Explanation

### Heading

> Why Annie thinks this

Use the `explanation` field.

The content should:

- Use plain English
- Explain uncertainty
- Avoid unsupported conclusions
- Avoid technical jargon

## Warning Signs

### Heading

> Warning signs Annie noticed

Use the `warningSigns` array.

Show each item as a concise list entry.

If no warning signs are found:

> Annie did not identify any obvious warning signs from the information provided.

Follow with:

> Important requests should still be verified independently.

## Recommended Actions

### Heading

> What to do next

Use the ordered `recommendedActions` array.

The first action should be the most important.

## Things to Avoid

### Heading

> Avoid doing this for now

Use the `thingsToAvoid` array.

Hide this section when the array is empty.

## Independent Verification

### Heading

> How to verify it safely

Use the `officialVerificationAdvice` field.

The user should be told to:

- Find official contact details independently
- Use a known website, card, statement or trusted record
- Avoid contact information supplied in the suspicious content

## Privacy Reminder

Display the `privacyReminder` field.

## Emergency Advice

Show only when `emergencyAdvice` contains content.

Use a calm but prominent panel.

## Human Review Message

When `requiresHumanReview` is true:

> Annie cannot give a confident answer from the information available. Consider asking a trusted person or relevant professional to review it with you.

## Primary Action

> Check another message

## Secondary Actions

- Save this advice
- Share with someone I trust
- Report a problem with this result

Saving and sharing may be delayed until after the first MVP if implementation would slow delivery.

## Risk Presentation Rules

Risk must not be communicated through colour alone.

Each risk level must include:

- Text label
- Icon
- Short explanation

Suggested icons:

- Lower Risk: check mark in a circle
- Concerning: eye or caution symbol
- High Risk: stop hand or warning symbol

Avoid:

- Skull icons
- Police sirens
- Aggressive red screens
- Dramatic language
- Percentage scam scores

## Emotional Goal

The user should feel:

- Clear about the risk
- Calm enough to make a decision
- Confident about what to do next
- Supported rather than frightened

---

# Screen 5 – Feedback

## Purpose

Learn whether the assessment helped the user.

## Heading

> Did Annie help you decide what to do?

## Primary Feedback Options

- Yes
- Not sure
- No

Use large, accessible buttons.

## Optional Follow-Up

### Label

> Tell us more

### Placeholder

> What was helpful, confusing or missing?

The user should not be required to provide written feedback.

## Optional Outcome Question

> What did you decide to do?

Options:

- I stopped and checked independently
- I decided not to continue
- I continued after verifying it
- I am still unsure
- Prefer not to say

## Privacy Reminder

> Please do not include personal, financial or account information in your feedback.

## Submit Button

> Send feedback

## Skip Action

> Skip

## Confirmation Message

> Thank you. Your feedback will help make Annie more useful and easier to understand.

## Final Action

> Return home

## Emotional Goal

The user should feel:

- Heard
- Appreciated
- Free to skip
- Confident that feedback is optional

---

# Navigation Rules

The MVP should use simple navigation.

## Global Navigation

Include:

- Ask Annie logo or wordmark
- Home
- How it works
- Privacy

Avoid complex menus.

## Back Navigation

Users should be able to return to the previous screen without losing entered content wherever possible.

## Exit Behaviour

If a user tries to leave after entering content:

> Leave this check?

Supporting text:

> The information you added may be lost.

Actions:

- Stay
- Leave

---

# Mobile Experience

The MVP should be designed mobile-first.

Requirements:

- No horizontal scrolling
- Buttons span most of the screen width
- Touch targets at least 44 by 44 pixels
- Image upload works with mobile photo libraries
- Camera capture supported where practical
- Text remains readable without zoom
- Important actions remain visible above the fold where possible

---

# Desktop Experience

On larger screens:

- Keep the main content in a narrow central column
- Avoid stretching text across the full screen
- Use supporting space for reassurance, privacy notes or illustrations
- Keep the main user journey visually dominant

---

# Accessibility Requirements

All screens must:

- Support keyboard navigation
- Use visible focus states
- Use semantic headings
- Include labels for all inputs
- Include meaningful alternative text
- Announce loading and validation states to screen readers
- Avoid colour-only meaning
- Support browser zoom to 200%
- Meet WCAG 2.2 AA as the minimum target

---

# Content Principles

Every screen should:

- Tell the user what is happening
- Explain what the user needs to do
- Avoid blaming the user
- Avoid creating panic
- Use familiar words
- Give one primary action
- Make privacy guidance visible

---

# MVP Completion Criteria

The screen flow is complete when a user can:

1. Understand what Ask Annie does
2. Submit text or an image
3. Receive a structured assessment
4. Understand the warning signs
5. Know what action to take
6. Submit optional feedback
7. Start another assessment

The experience must work on both mobile and desktop.