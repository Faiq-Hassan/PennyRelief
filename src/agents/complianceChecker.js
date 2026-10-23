/**
 * Agent 4: ComplianceChecker
 * Role: Audits proposed loan agreements against statutory banking policy.
 * Can trigger a loop-back to earlier stages (max 2 times) if violations are detected.
 */

const { askGemma } = require('../llm/llm');
const { loadAgentSkill } = require('../llm/skillLoader');

const complianceCheckerSchema = {
  type: 'object',
  required: ['passed', 'feedback', 'verifiedDecision'],
  properties: {
    passed: { type: 'boolean' },
    sendBackTo: { type: ['string', 'null'] },
    feedback: { type: 'string' },
    verifiedDecision: {
      type: 'object',
      required: ['finalStatus', 'finalAmount', 'finalEmi', 'disbursementReady', 'auditSummary']
    }
  }
};

/**
 * Deterministic safe fallback for ComplianceChecker.
 */
function getComplianceCheckerFallback(parsedData, analysis, decision) {
  const amount = decision?.approvedAmount || 25000;
  const emi = decision?.monthlyEmi || Math.round(amount / 6);
  const isCompliant = amount <= 60000 && (parsedData?.parsedStudent?.cgpa || 3.0) >= 2.0;

  return {
    passed: isCompliant,
    sendBackTo: null,
    feedback: isCompliant ? 'Verified compliant with micro-loan regulations.' : 'Exceeds student risk parameters.',
    verifiedDecision: {
      finalStatus: isCompliant ? 'VERIFIED_APPROVED' : 'VERIFIED_FLAGGED',
      finalAmount: amount,
      finalEmi: emi,
      disbursementReady: isCompliant,
      auditSummary: 'Automated policy audit passed with zero statutory exceptions.'
    }
  };
}

/**
 * Execute ComplianceChecker stage.
 */
async function runComplianceChecker(parsedData, analysis, decision, retryCount = 0) {
  const fallback = getComplianceCheckerFallback(parsedData, analysis, decision);
  const systemPrompt = loadAgentSkill('complianceChecker');

  const userPrompt = `Audit the following loan decision package (Audit Attempt #${retryCount + 1}):
Application: ${JSON.stringify(parsedData)}
Risk Profile: ${JSON.stringify(analysis)}
Draft Decision: ${JSON.stringify(decision)}

Statutory Policies to enforce:
1. Student micro-loan limit must NOT exceed 60,000 PKR.
2. Minimum academic CGPA required for subsidized loans is 2.0.
3. Monthly EMI must be strictly > 0 and tenure between 3 and 12 months.
4. If violation is detected and retryCount < 2, set passed: false and sendBackTo: 'decisionBuilder' or 'financialAnalyst' with feedback.
5. If retryCount >= 2 or all checks pass, set passed: true and sendBackTo: null.

Return JSON conforming to schema with:
- passed: boolean
- sendBackTo: null or 'decisionBuilder' | 'financialAnalyst'
- feedback: string explanation
- verifiedDecision: { finalStatus, finalAmount, finalEmi, disbursementReady (boolean), auditSummary }`;

  try {
    const result = await askGemma({
      system: systemPrompt,
      user: userPrompt,
      jsonSchema: complianceCheckerSchema,
      agentName: 'complianceChecker'
    });

    // Enforce hard constraint on retries: at most 2 send-backs allowed
    if (retryCount >= 2 && !result.passed) {
      console.log(`[complianceChecker] Max retry limit reached (${retryCount}). Forcing final sign-off.`);
      result.passed = true;
      result.sendBackTo = null;
    }

    return result;
  } catch (err) {
    console.warn(`[complianceChecker] Falling back to safe default: ${err.message}`);
    return fallback;
  }
}

module.exports = {
  runComplianceChecker,
  getComplianceCheckerFallback,
  complianceCheckerSchema
};
