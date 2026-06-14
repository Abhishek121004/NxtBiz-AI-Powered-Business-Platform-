import { healthScoreWeights } from '../config/specRules.js';

export function calculateBusinessHealthScore(metrics = {}) {
  const factors = {
    customerSatisfaction: Number(metrics.customerSatisfaction ?? 75),
    responseTime: Number(metrics.responseTime ?? 70),
    invoiceCollection: Number(metrics.invoiceCollection ?? 75),
    ticketResolution: Number(metrics.ticketResolution ?? 70),
    leadConversion: Number(metrics.leadConversion ?? 65),
    meetingMomentum: Number(metrics.meetingMomentum ?? 60)
  };

  const score = Math.round(
    factors.customerSatisfaction * healthScoreWeights.customerSatisfaction +
      factors.responseTime * healthScoreWeights.responseTime +
      factors.invoiceCollection * healthScoreWeights.invoiceCollection +
      factors.ticketResolution * healthScoreWeights.ticketResolution +
      factors.leadConversion * healthScoreWeights.leadConversion
  );

  return { score, factors };
}
