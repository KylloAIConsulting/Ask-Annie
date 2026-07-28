# Ask Annie – Design System

**Version:** 1.0  
**Status:** Active

---

# Purpose

The Ask Annie design system creates a consistent, accessible and trustworthy visual experience.

The interface should feel:

- Calm
- Warm
- Clear
- Modern
- Human
- Dependable

Ask Annie should not look like a cybersecurity dashboard, banking portal or generic AI chatbot.

---

# Brand Personality

Ask Annie is a trusted digital companion.

The visual identity should communicate:

- Safety without fear
- Confidence without arrogance
- Warmth without being childish
- Professionalism without feeling corporate
- Simplicity without looking unfinished

---

# Colour Palette

## Primary Colour

### Annie Teal

```text
#176B68
```

Use for:

- Primary buttons
- Links
- Focused interface elements
- Brand highlights

This colour should communicate calm confidence and trust.

---

## Primary Dark

### Deep Teal

```text
#0E4544
```

Use for:

- Hover states
- Main headings
- Strong contrast elements

---

## Background

### Warm White

```text
#FAF9F6
```

Use as the primary page background.

Avoid pure white across the entire application where a warmer background improves comfort.

---

## Surface

### White

```text
#FFFFFF
```

Use for:

- Cards
- Input fields
- Result panels
- Modal windows

---

## Primary Text

### Charcoal

```text
#202827
```

Use for body text and headings.

---

## Secondary Text

### Slate

```text
#53605E
```

Use for supporting text.

Text must still meet contrast requirements.

---

## Border

### Soft Grey

```text
#D8DEDC
```

Use for:

- Input borders
- Dividers
- Card outlines

---

# Risk Colours

Colour must never be the only way risk is communicated.

## Lower Risk

```text
#2E7D5B
```

Use with:

- Text label
- Check icon
- Short description

## Concerning

```text
#B26A00
```

Use with:

- Text label
- Caution icon
- Short description

## High Risk

```text
#B33A3A
```

Use with:

- Text label
- Stop or warning icon
- Short description

Avoid filling the entire screen with risk colours.

Use risk colours as accents only.

---

# Typography

## Primary Font

Use:

```text
Inter
```

Fallback:

```text
Arial, Helvetica, sans-serif
```

The font should be:

- Highly readable
- Neutral
- Familiar
- Accessible on mobile and desktop

---

# Type Scale

## Display Heading

```text
48px desktop
36px mobile
Line height: 1.15
Weight: 700
```

## Page Heading

```text
36px desktop
30px mobile
Line height: 1.2
Weight: 700
```

## Section Heading

```text
24px
Line height: 1.3
Weight: 650
```

## Card Heading

```text
20px
Line height: 1.35
Weight: 650
```

## Body Large

```text
18px
Line height: 1.6
Weight: 400
```

## Body

```text
16px
Line height: 1.6
Weight: 400
```

## Supporting Text

```text
14px
Line height: 1.5
Weight: 400
```

Body text should not be smaller than 16px for core user journeys.

---

# Spacing System

Use an 8-pixel spacing system.

```text
4px
8px
16px
24px
32px
48px
64px
96px
```

Recommended use:

- 8px between related labels and inputs
- 16px between items within a component
- 24px between component groups
- 32px between sections
- 48px or more between major page areas

---

# Layout

## Content Width

Main user journey:

```text
Maximum width: 720px
```

Informational pages:

```text
Maximum width: 960px
```

## Page Padding

Mobile:

```text
16px
```

Tablet:

```text
24px
```

Desktop:

```text
32px
```

---

# Buttons

## Primary Button

Use for the main action on a screen.

Style:

- Annie Teal background
- White text
- Minimum height 48px
- Border radius 10px
- Clear hover and focus states
- Medium-to-bold text

Examples:

- Check a message
- Check for warning signs
- Check another message

## Secondary Button

Use for less important actions.

Style:

- White or transparent background
- Annie Teal text
- Visible border
- Minimum height 48px
- Border radius 10px

## Destructive Button

Use rarely.

A destructive action should:

- State exactly what will happen
- Never rely on red colour alone
- Require confirmation when data may be lost

## Button Labels

Use clear action language.

Good:

- Check this message
- Upload an image
- Try again

Avoid:

- Submit
- Continue
- Proceed
- Execute

unless the surrounding context makes the action unmistakable.

---

# Form Controls

All controls must include visible labels.

## Text Areas

- Minimum height: 180px
- Resizable where appropriate
- Clear focus state
- Helpful placeholder
- Error text below the field
- Character limit only where necessary

## File Upload

The upload area should include:

- Clear label
- Supported formats
- Maximum file size
- Keyboard activation
- Drag-and-drop support on desktop
- Standard file selection on mobile

## Optional Fields

Mark optional fields clearly.

Do not mark every required field with an asterisk where there are very few inputs.

---

# Cards

Use cards for:

- Result sections
- Warning signs
- Recommended actions
- Privacy reminders
- Supporting information

Card style:

- White surface
- Soft border
- 12px to 16px border radius
- Minimal shadow
- 24px internal padding
- Clear heading

Avoid excessive nested cards.

---

# Icons

Icons should:

- Support the text
- Never replace essential labels
- Use a consistent visual style
- Include accessible names where needed

Preferred style:

- Simple outline icons
- Rounded edges
- Familiar symbols

Avoid:

- Cartoon mascots in warning states
- Threatening imagery
- Complex cybersecurity symbols
- Decorative icons that add confusion

---

# Annie Illustration

Annie may later use a simple brand illustration or avatar.

The character should feel:

- Warm
- Capable
- Calm
- Age-inclusive
- Culturally neutral

The character should not:

- Look childish
- Look like a robot stereotype
- Appear to impersonate a human professional
- Wear police, medical or financial authority symbols

The MVP does not require a character illustration.

---

# Feedback and Status Messages

## Success

Use calm confirmation language.

Example:

> Your feedback has been sent.

## Error

Explain:

1. What happened
2. Whether content was lost
3. What the user can do next

Example:

> Annie could not complete the check. Your message is still here, so you can try again.

## Loading

Explain what is happening.

Avoid fake progress percentages.

---

# Motion

Motion should be minimal.

Permitted uses:

- Button state changes
- Gentle panel transitions
- Loading indicator
- Success confirmation

Avoid:

- Flashing
- Pulsing alerts
- Rapid movement
- Full-screen animation
- Motion that cannot be reduced

Respect the user's reduced-motion preference.

---

# Voice and Tone

## Calm

> Take a moment before replying.

Not:

> Warning! You may be under attack.

## Clear

> Contact the organisation using the number on its official website.

Not:

> Conduct external validation through a verified channel.

## Reassuring

> Thank you for checking before taking action.

Not:

> You should have identified this sooner.

## Honest

> Annie cannot confirm whether this is genuine from the information provided.

Not:

> This is safe.

---

# Accessibility Standard

The product should target WCAG 2.2 AA.

This includes:

- Sufficient colour contrast
- Visible keyboard focus
- Semantic HTML
- Proper form labels
- Screen-reader announcements
- Reduced-motion support
- Minimum touch target size
- Colour-independent status information
- Clear error identification

Accessibility is a release requirement, not a future enhancement.

---

# Design Review Questions

Before approving any screen, ask:

1. Is the main action obvious?
2. Can the user understand the screen quickly?
3. Does the language reduce anxiety?
4. Is risk communicated without relying on colour?
5. Can the screen be used by keyboard?
6. Does the user know what happens next?
7. Is unnecessary information being requested?
8. Does this feel like Ask Annie?

If any answer is no, revise the design.