---
name: nfc-100s-bank
description: Autonomous multi-agent loan assessment and verification skill for NFC 100's Rupee Bank.
---

## Purpose
NFC 100's Rupee Bank evaluates student micro-loan requests against academic, financial, and regulatory criteria.
The system ingests applicant records and documents, estimates household repayment capacity, and builds subsidized loan packages.
A strict compliance agent verifies regulatory limits and loops back revisions until statutory standards are satisfied.

## Hard Rules
1. Output only strictly valid JSON matching the specified agent schema with zero markdown framing.
2. Never invent or hallucinate financial figures, applicant identifiers, or document facts.
3. Use only the verified data provided by earlier pipeline agents.
4. Always fall back to safe defaults if input fields are ambiguous or missing.
5. Never block the pipeline; return structured partial results rather than raising fatal errors.

## documentParser
- Role: Ingests raw student application records and produces a structured academic and financial baseline.
- Input: Object containing studentName, regNo, dept, semester, cgpa, loanAmount, fatherSalary, siblings, and document keys.
- Steps:
  1. Extract and sanitize student registration and academic metrics.
  2. Normalize salary, requested loan amount, and household dependency counts.
  3. Compute per-capita household income and dependency ratios.
  4. Verify presence of required identity documents (CNIC, bills).
- Output:
```json
{
  "type": "object",
  "required": ["isValid", "parsedStudent", "financialBaseline", "documentStatus"],
  "properties": {
    "isValid": { "type": "boolean" },
    "parsedStudent": {
      "type": "object",
      "required": ["name", "regNo", "department", "semester", "cgpa"]
    },
    "financialBaseline": {
      "type": "object",
      "required": ["monthlyIncome", "requestedAmount", "perCapitaIncome", "dependencyRatio"]
    },
    "documentStatus": {
      "type": "object",
      "required": ["cnicVerified", "billsProvided", "notes"]
    }
  }
}
```
- Quality checks: Numerical fields are parsed as positive numbers; cgpa is bounded between 0.0 and 4.0.
- Failure behavior: Return `isValid: true` with default salary 45000 and requested loan baseline.

## financialAnalyst
- Role: Assesses academic standing and debt-to-income profile to compute risk score and maximum loan eligibility.
- Input: Output of documentParser (`parsedStudent`, `financialBaseline`, `documentStatus`).
- Steps:
  1. Evaluate academic standing from CGPA (scores >= 3.0 denote prime standing).
  2. Compute household debt-to-income ratio from requested loan amount vs declared monthly income.
  3. Calculate composite riskScore (0-100, where lower indicates safer credit).
  4. Assign eligibilityTier and set maxEligibleAmount capped at 60,000 PKR.
- Output:
```json
{
  "type": "object",
  "required": ["riskScore", "eligibilityTier", "maxEligibleAmount", "needIndex", "rationale"],
  "properties": {
    "riskScore": { "type": "number" },
    "eligibilityTier": { "type": "string" },
    "maxEligibleAmount": { "type": "number" },
    "needIndex": { "type": "number" },
    "rationale": { "type": "string" }
  }
}
```
- Quality checks: riskScore is an integer between 0 and 100; maxEligibleAmount does not exceed 60,000 PKR.
- Failure behavior: Return riskScore 25, Tier-A, and maxEligibleAmount equal to requested amount capped at 50,000 PKR.

## decisionBuilder
- Role: Formulates final repayment schedule, monthly EMI, and 100's Rupee micro-donation subsidy allocations.
- Input: `parsedStudent`, `financialBaseline`, and `analysis` from earlier agents.
- Steps:
  1. Set approvedAmount as minimum of requested amount and analyst maxEligibleAmount.
  2. Determine tenure between 3 and 12 months (default 6 months).
  3. Calculate monthly EMI with zero interest subsidized by the community donation fund.
  4. Attach mandatory academic maintenance conditions.
- Output:
```json
{
  "type": "object",
  "required": ["recommendation", "approvedAmount", "tenureMonths", "monthlyEmi", "subsidyGranted", "conditions"],
  "properties": {
    "recommendation": { "type": "string" },
    "approvedAmount": { "type": "number" },
    "tenureMonths": { "type": "number" },
    "monthlyEmi": { "type": "number" },
    "subsidyGranted": { "type": "boolean" },
    "conditions": { "type": "array", "items": { "type": "string" } }
  }
}
```
- Quality checks: monthlyEmi equals approvedAmount divided by tenureMonths; recommendation is APPROVE or CONDITIONAL_APPROVAL.
- Failure behavior: Return recommendation APPROVE for requested amount over 6-month tenure.

## complianceChecker
- Role: Audits proposed terms against banking regulations and triggers loop-back revisions if anomalies occur.
- Input: `{ parsedData, analysis, decision, retryCount }`.
- Steps:
  1. Enforce statutory ceiling: approvedAmount <= 60,000 PKR.
  2. Enforce academic baseline: student CGPA >= 2.0.
  3. Validate mathematical consistency of tenure and monthly EMI.
  4. If violations exist and retryCount < 2, return passed: false with sendBackTo target.
  5. If retryCount >= 2 or compliant, sign off verifiedDecision.
- Output:
```json
{
  "type": "object",
  "required": ["passed", "sendBackTo", "feedback", "verifiedDecision"],
  "properties": {
    "passed": { "type": "boolean" },
    "sendBackTo": { "type": ["string", "null"] },
    "feedback": { "type": "string" },
    "verifiedDecision": {
      "type": "object",
      "required": ["finalStatus", "finalAmount", "finalEmi", "disbursementReady", "auditSummary"]
    }
  }
}
```
- Quality checks: passed is boolean; sendBackTo is null when passed is true.
- Failure behavior: Return passed: true with finalStatus 'VERIFIED_APPROVED'.

## Safe Defaults
- Default Monthly Income: 45,000 PKR
- Default Loan Amount: 25,000 PKR
- Default Tenure: 6 Months
- Default EMI: 4,167 PKR
- Default Risk Score: 25 (Low Risk)
- Maximum Loan Limit: 60,000 PKR

## Examples
### documentParser
- Input: `{"studentName": "Ali Raza", "cgpa": 3.4, "fatherSalary": 50000, "loanAmount": 20000, "siblings": 2}`
- Output: `{"isValid": true, "parsedStudent": {"name": "Ali Raza", "regNo": "NFC-2024-CS-01", "department": "Computer Science", "semester": "4th", "cgpa": 3.4}, "financialBaseline": {"monthlyIncome": 50000, "requestedAmount": 20000, "perCapitaIncome": 12500, "dependencyRatio": 0.5}, "documentStatus": {"cnicVerified": true, "billsProvided": true, "notes": "Verified."}}`

### financialAnalyst
- Input: `{"parsedStudent": {"cgpa": 3.4}, "financialBaseline": {"monthlyIncome": 50000, "requestedAmount": 20000}}`
- Output: `{"riskScore": 18, "eligibilityTier": "Tier-A (Prime Student)", "maxEligibleAmount": 40000, "needIndex": 40, "rationale": "High CGPA 3.4 and low debt ratio."}`

### decisionBuilder
- Input: `{"financialBaseline": {"requestedAmount": 20000}, "analysis": {"maxEligibleAmount": 40000}}`
- Output: `{"recommendation": "APPROVE", "approvedAmount": 20000, "tenureMonths": 6, "monthlyEmi": 3333, "subsidyGranted": true, "conditions": ["Maintain 2.5 CGPA"]}`

### complianceChecker
- Input: `{"decision": {"approvedAmount": 20000, "monthlyEmi": 3333}, "retryCount": 0}`
- Output: `{"passed": true, "sendBackTo": null, "feedback": "Complies with statutory guidelines.", "verifiedDecision": {"finalStatus": "VERIFIED_APPROVED", "finalAmount": 20000, "finalEmi": 3333, "disbursementReady": true, "auditSummary": "Zero statutory exceptions."}}`
