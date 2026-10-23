/**
 * SKILL.md Runtime Loader.
 * Reads the project root SKILL.md and extracts the designated instructions
 * for the requesting agent dynamically.
 */

const fs = require('fs');
const path = require('path');

const SKILL_FILE_PATH = path.resolve(__dirname, '../../SKILL.md');

/**
 * Loads the section of SKILL.md dedicated to a specific agent.
 * 
 * @param {string} agentName - The exact file name / agent identifier (e.g., 'documentParser')
 * @returns {string} The agent's specific instructions plus global Hard Rules.
 */
function loadAgentSkill(agentName) {
  try {
    if (!fs.existsSync(SKILL_FILE_PATH)) {
      console.warn(`[SkillLoader] Warning: SKILL.md not found at ${SKILL_FILE_PATH}`);
      return 'You are an autonomous banking intelligence agent. Output only valid JSON.';
    }

    const fullSkillContent = fs.readFileSync(SKILL_FILE_PATH, 'utf-8');

    // Extract Hard Rules
    const hardRulesMatch = fullSkillContent.match(/## Hard Rules([\s\S]*?)(?=## [A-Za-z0-9]+|\n#[^#]|$)/i);
    const hardRules = hardRulesMatch ? hardRulesMatch[1].trim() : '';

    // Extract Agent-specific section
    const agentRegex = new RegExp(`##\\s+${agentName}([\\s\\S]*?)(?=\\n##\\s+[A-Za-z0-9]+|\\n#[^#]|$)`, 'i');
    const agentMatch = fullSkillContent.match(agentRegex);

    if (agentMatch) {
      return `Global Hard Rules:\n${hardRules}\n\nAgent Instructions for ${agentName}:\n${agentMatch[1].trim()}`;
    }

    // Fallback: return general document if specific section not found
    return fullSkillContent;
  } catch (err) {
    console.error(`[SkillLoader] Error loading SKILL.md for ${agentName}:`, err.message);
    return 'You are an autonomous banking intelligence agent. Output only valid JSON.';
  }
}

module.exports = {
  loadAgentSkill,
  SKILL_FILE_PATH
};
