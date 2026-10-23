/**
 * Agent 3: DecisionBuilder
 * Role: Formulates the structured loan offer, tenure options, monthly EMI repayment,
 * and micro-donation subsidy allocations.
 */

const { askGemma } = require('../llm/llm');
const { loadAgentSkill } = require('../llm/skillLoader');

const decisionBuilderSchema = {
  type: 'object',
  required: ['recommendation', 'approvedAmount', 'tenureMonths', 'monthlyEmi', 'subsidyGranted', 'conditions'],
  properties: {
    recommendation: { type: 'string' },
    approvedAmount: { type: 'number' },
    tenureMonths: { type: 'number' },
    monthlyEmi: { type: 'number' },
    subsidyGranted: { type: 'boolean' },
    conditions: {
      type: 'array',
      items: { type: 'string' }
    }
  }
};

/**
 * Deterministic safe default fallback when AI is unavailable or fails.
 */
function getDecisionBuilderFallback(parsedData, analysis) {
  const requested = parsedData?.financialBaseline?.requestedAmount || 25000;
  const maxEligible = analysis?.maxEligibleAmount || requested;
  const approved = Math.min(requested, maxEligible);
  const tenure = 6;
  const emi = Math.round(approved / tenure);

  return {
    recommendation: 'APPROVE',
    approvedAmount: approved,
    tenureMonths: tenure,
    monthlyEmi: emi,
    subsidyGranted: true,
    conditions: [
      'Maintain minimum 2.5 CGPA during repayment period.',
      'Repay monthly installments before the 5th of each month.'
    ]
  };
}

/**
 * Execute DecisionBuilder stage.
 */
async function runDecisionBuilder(parsedData, analysis) {
  const fallback = getDecisionBuilderFallback(parsedData, analysis);
  const systemPrompt = loadAgentSkill('decisionBuilder');

  const userPrompt = `Formulate the loan contract proposal given this analysis:
Student: ${JSON.stringify(parsedData.parsedStudent)}
Financial Baseline: ${JSON.stringify(parsedData.financialBaseline)}
Analyst Score: ${JSON.stringify(analysis)}

Rules:
- recommendation must be 'APPROVE', 'CONDITIONAL_APPROVAL', or 'REJECT'
- approvedAmount cannot exceed maxEligibleAmount (${analysis.maxEligibleAmount})
- tenureMonths must be between 3 and 12
- monthlyEmi must be approvedAmount divided by tenureMonths (subsidized by community penny micro-donations)
- subsidyGranted: boolean (true if student qualifies for 0% interest support)
- conditions: array of strings containing standard student compliance terms`;

  try {
    const result = await askGemma({
      system: systemPrompt,
      user: userPrompt,
      jsonSchema: decisionBuilderSchema,
      agentName: 'decisionBuilder'
    });

    return result;
  } catch (err) {
    console.warn(`[decisionBuilder] Falling back to safe default: ${err.message}`);
    return fallback;
  }
}

module.exports = {
  runDecisionBuilder,
  getDecisionBuilderFallback,
  decisionBuilderSchema
};
