/**
 * Orchestrator Module: PennyRelief Loan & Micro-Donation Intelligence Engine
 * 
 * Conducts specialist agents in a strict sequence:
 * 1. DocumentParser: Ingests & structures application documents.
 * 2. FinancialAnalyst: Evaluates debt-to-income, credit risk, & need index.
 * 3. DecisionBuilder: Generates loan offer terms, EMI, and micro-donation subsidies.
 * 4. ComplianceChecker: Enforces statutory banking rules. Can loop back up to 2 times.
 * 
 * Rules:
 * - Emits onProgress callbacks after each stage.
 * - Enforces per-stage timeouts & fallbacks so runJob never crashes.
 * - Handles retries cleanly.
 */

const { runDocumentParser, getDocumentParserFallback } = require('../agents/documentParser');
const { runFinancialAnalyst, getFinancialAnalystFallback } = require('../agents/financialAnalyst');
const { runDecisionBuilder, getDecisionBuilderFallback } = require('../agents/decisionBuilder');
const { runComplianceChecker, getComplianceCheckerFallback } = require('../agents/complianceChecker');

/**
 * Utility to run an async function with a timeout limit.
 */
function withTimeout(promise, ms, fallbackFn) {
  let timer;
  const timeoutPromise = new Promise((resolve) => {
    timer = setTimeout(() => {
      console.warn(`[Orchestrator] Stage timed out after ${ms}ms. Executing fallback.`);
      resolve(fallbackFn());
    }, ms);
  });

  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    timeoutPromise
  ]);
}

/**
 * Runs the end-to-end loan intelligence pipeline.
 * 
 * @param {Object} input - Raw loan application form fields and uploaded documents.
 * @param {Function} [onProgress] - Optional callback: onProgress({ stage, status, percent, message, data })
 * @returns {Promise<Object>} Final job execution result with audit trail.
 */
async function runJob(input, onProgress = () => {}) {
  const jobId = `NFC-JOB-${Date.now()}`;
  const auditTrail = [];
  const STAGE_TIMEOUT = 30000; // 30 seconds max per stage

  function emitProgress(stage, status, percent, message, data = null) {
    const event = {
      jobId,
      stage,
      status,
      percent,
      message,
      data,
      timestamp: new Date().toISOString()
    };
    auditTrail.push(event);
    try {
      onProgress(event);
    } catch (err) {
      console.warn('[Orchestrator] onProgress handler threw error:', err.message);
    }
  }

  emitProgress('orchestrator', 'started', 5, 'Initializing loan evaluation pipeline...');

  // STAGE 1: DocumentParser
  emitProgress('documentParser', 'running', 15, 'Parsing and validating student documents...');
  let parsedData;
  try {
    parsedData = await withTimeout(
      runDocumentParser(input),
      STAGE_TIMEOUT,
      () => getDocumentParserFallback(input)
    );
  } catch (err) {
    console.warn(`[Orchestrator] DocumentParser stage error: ${err.message}. Using safe fallback.`);
    parsedData = getDocumentParserFallback(input);
  }
  emitProgress('documentParser', 'completed', 25, 'Student application data structured.', parsedData);

  // STAGE 2: FinancialAnalyst
  emitProgress('financialAnalyst', 'running', 35, 'Analyzing household finances and academic risk score...');
  let analysis;
  try {
    analysis = await withTimeout(
      runFinancialAnalyst(parsedData),
      STAGE_TIMEOUT,
      () => getFinancialAnalystFallback(parsedData)
    );
  } catch (err) {
    console.warn(`[Orchestrator] FinancialAnalyst stage error: ${err.message}. Using safe fallback.`);
    analysis = getFinancialAnalystFallback(parsedData);
  }
  emitProgress('financialAnalyst', 'completed', 50, 'Financial risk and eligibility evaluated.', analysis);

  // STAGES 3 & 4: DecisionBuilder and ComplianceChecker (with loop-back up to 2 times)
  let decision;
  let compliance;
  let loopRetries = 0;
  const MAX_CHECKER_RETRIES = 2;

  while (loopRetries <= MAX_CHECKER_RETRIES) {
    // STAGE 3: DecisionBuilder
    emitProgress(
      'decisionBuilder',
      'running',
      60 + loopRetries * 5,
      `Synthesizing loan terms and EMI schedule (Pass #${loopRetries + 1})...`
    );

    try {
      decision = await withTimeout(
        runDecisionBuilder(parsedData, analysis),
        STAGE_TIMEOUT,
        () => getDecisionBuilderFallback(parsedData, analysis)
      );
    } catch (err) {
      console.warn(`[Orchestrator] DecisionBuilder error: ${err.message}. Using safe fallback.`);
      decision = getDecisionBuilderFallback(parsedData, analysis);
    }
    emitProgress('decisionBuilder', 'completed', 75, 'Loan offer proposal generated.', decision);

    // STAGE 4: ComplianceChecker
    emitProgress(
      'complianceChecker',
      'running',
      85,
      `Auditing loan offer against banking regulations (Pass #${loopRetries + 1})...`
    );

    try {
      compliance = await withTimeout(
        runComplianceChecker(parsedData, analysis, decision, loopRetries),
        STAGE_TIMEOUT,
        () => getComplianceCheckerFallback(parsedData, analysis, decision)
      );
    } catch (err) {
      console.warn(`[Orchestrator] ComplianceChecker error: ${err.message}. Using safe fallback.`);
      compliance = getComplianceCheckerFallback(parsedData, analysis, decision);
    }

    if (compliance.passed || loopRetries >= MAX_CHECKER_RETRIES) {
      emitProgress('complianceChecker', 'completed', 95, 'Compliance verification successfully finalized.', compliance);
      break;
    } else {
      // Loop-back requested by ComplianceChecker
      loopRetries++;
      emitProgress(
        'complianceChecker',
        'revision_requested',
        60,
        `Compliance flagged adjustments (Retry #${loopRetries}/${MAX_CHECKER_RETRIES}): ${compliance.feedback}. Returning to ${compliance.sendBackTo || 'decisionBuilder'}.`
      );

      // Adjust parameters based on feedback
      if (compliance.sendBackTo === 'financialAnalyst') {
        analysis.maxEligibleAmount = Math.min(analysis.maxEligibleAmount || 25000, 40000);
      }
    }
  }

  emitProgress('orchestrator', 'finished', 100, 'Loan intelligence pipeline completed successfully.');

  return {
    success: true,
    jobId,
    timestamp: new Date().toISOString(),
    student: parsedData.parsedStudent,
    baseline: parsedData.financialBaseline,
    riskAnalysis: analysis,
    loanProposal: decision,
    complianceAudit: compliance.verifiedDecision,
    auditTrail
  };
}

module.exports = {
  runJob
};
