/**
 * Agent 1: DocumentParser
 * Role: Normalizes and verifies incoming student loan application fields,
 * validates declared household numbers, and produces a structured financial baseline.
 */

const { askGemma } = require('../llm/llm');
const { loadAgentSkill } = require('../llm/skillLoader');

const documentParserSchema = {
  type: 'object',
  required: ['isValid', 'parsedStudent', 'financialBaseline', 'documentStatus'],
  properties: {
    isValid: { type: 'boolean' },
    parsedStudent: {
      type: 'object',
      required: ['name', 'regNo', 'department', 'semester', 'cgpa']
    },
    financialBaseline: {
      type: 'object',
      required: ['monthlyIncome', 'requestedAmount', 'perCapitaIncome', 'dependencyRatio']
    },
    documentStatus: {
      type: 'object',
      required: ['cnicVerified', 'billsProvided', 'notes']
    }
  }
};

/**
 * Deterministic safe default fallback when AI is unavailable or fails.
 */
function getDocumentParserFallback(input) {
  const salary = parseFloat(input.fatherSalary) || 45000;
  const siblings = parseInt(input.siblings, 10) || 3;
  const requested = parseFloat(input.loanAmount) || 25000;
  const householdMembers = siblings + 2; // student + parents

  return {
    isValid: true,
    parsedStudent: {
      name: input.studentName || 'Student',
      regNo: input.regNo || 'NFC-REG-UNKNOWN',
      department: input.dept || 'Engineering',
      semester: input.semester || '1st',
      cgpa: parseFloat(input.cgpa) || 3.0
    },
    financialBaseline: {
      monthlyIncome: salary,
      requestedAmount: requested,
      perCapitaIncome: Math.round(salary / householdMembers),
      dependencyRatio: Number((siblings / householdMembers).toFixed(2))
    },
    documentStatus: {
      cnicVerified: Boolean(input.documents?.cnicFront || input.cnicFrontImage),
      billsProvided: Boolean(input.documents?.electricityBill || input.electricityBillImage),
      notes: 'Fallback baseline generated deterministically from form submission.'
    }
  };
}

/**
 * Execute DocumentParser stage.
 */
async function runDocumentParser(input) {
  const fallback = getDocumentParserFallback(input);
  const systemPrompt = loadAgentSkill('documentParser');

  const userPrompt = `Parse and validate the following student loan submission data:
${JSON.stringify({
  studentName: input.studentName,
  regNo: input.regNo,
  dept: input.dept,
  semester: input.semester,
  cgpa: input.cgpa,
  loanAmount: input.loanAmount,
  loanPurpose: input.loanPurpose,
  fatherName: input.fatherName,
  fatherOccupation: input.fatherOccupation,
  fatherSalary: input.fatherSalary,
  siblings: input.siblings,
  providedDocuments: Object.keys(input.documents || input.files || {})
}, null, 2)}

Return a JSON object conforming exactly to the required schema with:
- isValid: boolean
- parsedStudent: { name, regNo, department, semester, cgpa (number) }
- financialBaseline: { monthlyIncome (number), requestedAmount (number), perCapitaIncome (number), dependencyRatio (number) }
- documentStatus: { cnicVerified (boolean), billsProvided (boolean), notes (string) }`;

  try {
    const result = await askGemma({
      system: systemPrompt,
      user: userPrompt,
      jsonSchema: documentParserSchema,
      agentName: 'documentParser'
    });

    return result;
  } catch (err) {
    console.warn(`[documentParser] Falling back to safe default: ${err.message}`);
    return fallback;
  }
}

module.exports = {
  runDocumentParser,
  getDocumentParserFallback,
  documentParserSchema
};
