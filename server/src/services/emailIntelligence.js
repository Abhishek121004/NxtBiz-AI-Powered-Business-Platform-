import { emailRules } from '../config/specRules.js';

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

export function analyzeEmail({ subject = '', body = '' }) {
  const text = `${subject} ${body}`.toLowerCase();
  const positive = includesAny(text, emailRules.positiveSignals);
  const negative = includesAny(text, emailRules.negativeSignals);
  const critical = includesAny(text, emailRules.criticalUrgencySignals);

  let intent = 'general_inquiry';
  if (text.includes('meeting') || text.includes('schedule') || text.includes('calendar')) intent = 'schedule_meeting';
  if (text.includes('invoice') || text.includes('payment') || text.includes('bill')) intent = 'invoice_request';
  if (text.includes('support') || text.includes('broken') || text.includes('issue') || text.includes('failed')) intent = 'support_request';
  if (text.includes('pricing') || text.includes('demo') || text.includes('renew') || text.includes('quote')) intent = 'sales_opportunity';

  const urgency = critical ? 'critical' : negative ? 'high' : intent === 'schedule_meeting' ? 'medium' : 'low';
  const sentiment = negative ? 'negative' : positive ? 'positive' : 'neutral';

  return {
    sentiment,
    intent,
    urgency,
    confidence: critical || positive || negative ? 0.86 : 0.62,
    autoResponse: `NxtBiz has received your ${intent.replaceAll('_', ' ')} request and routed it to operations.`,
    recommendations: [
      urgency === 'critical' ? 'Escalate to a manager immediately.' : 'Review and respond from the email dashboard.',
      intent === 'support_request' ? 'Create or update a support ticket.' : 'Add the interaction to CRM history.'
    ]
  };
}
