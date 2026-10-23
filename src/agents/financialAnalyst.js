/**
 * Agent 2: FinancialAnalyst
 * Role: Computes creditworthiness, academic standing score, and financial need index
 * to assign an eligibility tier and recommended lending ceiling.
 */

const { askGemma } = require('../llm/llm');
const { loadAgentSkill } = require('../llm/skillLoader');

const financialAnalystSchema = {
  type: 'object',
  required: ['riskScore', 'eligibilityTier', 'maxEligibleAmount', 'needIndex', 'rationale'],
  properties: {
    riskScore: { type: 'number' },
    eligibilityTier: { type: 'string' },
    maxEligibleAmount: { type: 'number' },
    needIndex: { type: 'number' },
    rationale: { type: 'string' }
  }
};

/**
 * Deterministic safe default fallback when AI is unavailable or fails.
 */
function getFinancialAnalystFallback(parsedData) {
  const cgpa = parsedData.parsedStudent?.cgpa || 3.0;
  const requested = parsedData.financialBaseline?.requestedAmount || 25000;
  const monthlyIncome = parsedData.financialBaseline?.monthlyIncome || 45000;

  // Simple heuristic
  const isHighGpa = cgpa >= 3.0;
  const needIndex = Math.min(100, Math.round((requested / Math.max(monthlyIncome, 1)) * 100));
  const riskScore = isHighGpa ? 20 : 45;
  const tier = riskScore < 30 ? 'Tier-A (Prime Student)' : 'Tier-B (Standard)';

  return {
    riskScore,
    eligibilityTier: tier,
    maxEligibleAmount: Math.min(requested, 50000),
    needIndex,
    rationale: `Fallback analysis: CGPA ${cgpa} indicates steady academic standing; household income ${monthlyIncome} PKR supports loan servicing.`
  };
}

/**
 * Execute FinancialAnalyst stage.
 */
async function runFinancialAnalyst(parsedData) {
  const fallback = getFinancialAnalystFallback(parsedData);
  const systemPrompt = loadAgentSkill('financialAnalyst');

  const userPrompt = `Evaluate the student loan risk and eligibility based on this verified data:
${JSON.stringify({
  student: parsedData.parsedStudent,
  financials: parsedData.financialBaseline,
  documents: parsedData.documentStatus
}, null, 2)}

Requirements:
- Calculate riskScore (number between 0 and 100, lower is better)
- Assign eligibilityTier (e.g., 'Tier-A (Prime Student)', 'Tier-B (Standard)', or 'Tier-C (High Risk)')
- Determine maxEligibleAmount (number in PKR, capped at 60,000 PKR for student micro-loans)
- Calculate needIndex (number 0 to 100 indicating financial urgency)
- Provide rationale (concise explanation of decision)`;

  try {
    const result = await askGemma({
      system: systemPrompt,
      user: userPrompt,
      jsonSchema: financialAnalystSchema,
      agentName: 'financialAnalyst'
    });

    return result;
  } catch (err) {
    console.warn(`[financialAnalyst] Falling back to safe default: ${err.message}`);
    return fallback;
  }
}

module.exports = {
  runFinancialAnalyst,
  getFinancialAnalystFallback,
  financialAnalystSchema
};
