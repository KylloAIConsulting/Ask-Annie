import { AiService, AnalyseInput } from './aiService';
import { AnnieResponse } from '@shared/annieResponse';

// ---------------------------------------------------------------------------
// Static mock responses — each passes the AnnieResponseSchema
// ---------------------------------------------------------------------------

const LOWER_RISK_RESPONSE: AnnieResponse = {
  summary:
    'Based on the information available, this message does not show obvious warning signs.',
  riskLevel: 'LOWER_RISK',
  confidence: 'HIGH',
  explanation:
    'The message you shared appears to come from a known source and does not contain the ' +
    'pressure, urgency or unusual requests that are commonly associated with scams. ' +
    'Annie did not identify strong indicators of fraud, though it is always sensible to ' +
    'verify important requests independently.',
  warningSigns: [],
  recommendedActions: [
    'If this message asks you to take an important action, verify it using official contact details.',
    'Use contact details from the official website or a trusted record, not from the message itself.',
  ],
  thingsToAvoid: [],
  officialVerificationAdvice:
    'If the message requests action from a known organisation, find their official contact ' +
    'details on their website or a recent statement and verify the request directly with them.',
  privacyReminder:
    'Avoid sharing unnecessary personal or financial information until you have independently verified the request.',
  emergencyAdvice: '',
  requiresHumanReview: false,
};

const CONCERNING_RESPONSE: AnnieResponse = {
  summary:
    'Based on the information available, this message contains some indicators that suggest caution is advisable.',
  riskLevel: 'CONCERNING',
  confidence: 'MEDIUM',
  explanation:
    'There are several indicators in this message that are commonly associated with ' +
    'suspicious communications. While Annie cannot confirm this is fraudulent, the ' +
    'combination of warning signs suggests you should pause and verify before taking any action.',
  warningSigns: [
    'Unexpected message from an unfamiliar sender',
    'Slight sense of urgency in the wording',
    'Request to follow a link or take prompt action',
  ],
  recommendedActions: [
    'Do not take any action yet.',
    'Contact the organisation using official contact details you find independently.',
    'Do not use the phone number or link provided in the message.',
    'Speak to a trusted friend or family member if you are unsure.',
  ],
  thingsToAvoid: [
    'Do not click any links in the message.',
    'Do not reply to the message.',
    'Do not share personal or financial information.',
  ],
  officialVerificationAdvice:
    'Find the official contact details for the organisation on their website or a recent ' +
    'statement. Call or email them directly to confirm whether the message is genuine.',
  privacyReminder:
    'Avoid sharing unnecessary personal or financial information until you have independently verified the request.',
  emergencyAdvice: '',
  requiresHumanReview: false,
};

const HIGH_RISK_RESPONSE: AnnieResponse = {
  summary:
    'Based on the information available, this message contains several warning signs that are strongly associated with fraud.',
  riskLevel: 'HIGH_RISK',
  confidence: 'HIGH',
  explanation:
    'This message contains multiple indicators that are commonly seen in scams. ' +
    'There is a sense of urgency, a request for financial action or personal information, ' +
    'and pressure to act quickly without verifying. Annie strongly recommends stopping ' +
    'and verifying this independently before taking any action.',
  warningSigns: [
    'Immediate payment or bank transfer requested',
    'Strong sense of urgency and pressure to act quickly',
    'Threat of account closure or legal action',
    'Request for personal or financial information',
    'Contact details that cannot be independently verified',
  ],
  recommendedActions: [
    'Stop. Do not click, reply, pay or share information.',
    'Do not use any phone numbers or links provided in this message.',
    'Contact your bank directly if you have already shared financial information.',
    'Report the message to Action Fraud (UK) at actionfraud.police.uk or call 0300 123 2040.',
    'Speak to a trusted person before taking any further action.',
  ],
  thingsToAvoid: [
    'Do not click any links in the message.',
    'Do not call the number provided.',
    'Do not transfer money.',
    'Do not share passwords, PINs or security codes.',
    'Do not download any attachments.',
  ],
  officialVerificationAdvice:
    'If this message claims to be from your bank, a government body or a known organisation, ' +
    'find their official contact details on their website or the back of your bank card. ' +
    'Call them directly and do not use any contact information from this message.',
  privacyReminder:
    'If you have already shared personal or financial information, contact your bank ' +
    'immediately using the number on the back of your card.',
  emergencyAdvice:
    'If you believe you have been a victim of fraud or have transferred money to a scammer, ' +
    'contact your bank immediately using the number on the back of your card and report it to ' +
    'Action Fraud at actionfraud.police.uk or by calling 0300 123 2040.',
  requiresHumanReview: true,
};

// ---------------------------------------------------------------------------
// Key map — embed these strings in the text field to select a mock response
// ---------------------------------------------------------------------------
const MOCK_KEYS: Array<[string, AnnieResponse]> = [
  ['__MOCK_HIGH_RISK__', HIGH_RISK_RESPONSE],
  ['__MOCK_CONCERNING__', CONCERNING_RESPONSE],
];

// ---------------------------------------------------------------------------
// MockAiService
// ---------------------------------------------------------------------------

export class MockAiService implements AiService {
  async analyse(input: AnalyseInput): Promise<AnnieResponse> {
    const text = input.text ?? '';

    for (const [key, response] of MOCK_KEYS) {
      if (text.includes(key)) {
        return response;
      }
    }

    return LOWER_RISK_RESPONSE;
  }
}
