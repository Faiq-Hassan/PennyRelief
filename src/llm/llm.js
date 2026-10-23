/**
 * Unified LLM Gateway for Gemma 4.
 * 
 * Uses Node.js native fetch (zero external dependencies).
 * Complies with hackathon requirements:
 * - Default provider: Local Ollama (http://127.0.0.1:11434/api/chat) with model gemma4:e4b
 *   (stream: false, format: "json", images as base64 in "images")
 * - Alternative provider: Gemini API with model gemma-4-26b-a4b-it
 *   (selected by env var LLM_PROVIDER=gemini and GEMINI_API_KEY)
 * - 120s timeout with AbortSignal.timeout
 * - One retry on invalid JSON
 * - Schema validation
 * - Standardized logging line per call: agent name, model id, provider, latency in ms
 */

// In-memory call log for inspection and verification ("npm run proof")
const callHistory = [];

/**
 * Get call history for verification reporting.
 */
function getGemmaCallHistory() {
  return [...callHistory];
}

/**
 * Clear call history.
 */
function clearGemmaCallHistory() {
  callHistory.length = 0;
}

/**
 * Simple schema validator supporting standard JSON schema types and required fields.
 */
function validateSchema(data, schema) {
  if (!schema || typeof schema !== 'object') return true;
  if (schema.type === 'object' && schema.required && Array.isArray(schema.required)) {
    for (const req of schema.required) {
      if (data[req] === undefined || data[req] === null) {
        throw new Error(`Schema validation error: missing required property "${req}"`);
      }
    }
  }
  return true;
}

/**
 * Primary LLM interface.
 * 
 * @param {Object} options
 * @param {string} options.system - System instructions (loaded from SKILL.md)
 * @param {string} options.user - User prompt
 * @param {string[]} [options.images] - Optional array of base64 image strings
 * @param {Object} [options.jsonSchema] - Optional JSON schema for validation
 * @param {string} [options.agentName] - Name of the calling agent (for logging & auditing)
 * @returns {Promise<Object>} Parsed JSON response from Gemma 4
 */
async function askGemma({ system = '', user = '', images = [], jsonSchema = null, agentName = 'GeneralAgent' }) {
  const provider = (process.env.LLM_PROVIDER || 'ollama').toLowerCase();
  const timeoutMs = 120000; // 120 seconds timeout

  const modelId = provider === 'gemini' ? 'gemma-4-26b-a4b-it' : 'gemma4:e4b';

  async function executeCall(attemptPrompt) {
    const startTime = Date.now();

    if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is required when LLM_PROVIDER=gemini');
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=${apiKey}`;

      const contents = [];
      const parts = [];

      if (system) {
        parts.push({ text: `System Instructions:\n${system}\n\n` });
      }

      parts.push({ text: attemptPrompt });

      if (images && images.length > 0) {
        for (const img of images) {
          parts.push({
            inlineData: {
              mimeType: 'image/jpeg',
              data: img.replace(/^data:image\/\w+;base64,/, '')
            }
          });
        }
      }

      contents.push({ role: 'user', parts });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        }),
        signal: AbortSignal.timeout(timeoutMs)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini API returned status ${res.status}: ${errorText}`);
      }

      const resData = await res.json();
      const latencyMs = Date.now() - startTime;
      const rawText = resData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return { rawText, latencyMs };
    } else {
      // Default: Ollama provider
      const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/chat';

      const messages = [];
      if (system) {
        messages.push({ role: 'system', content: system });
      }

      const userMsg = { role: 'user', content: attemptPrompt };
      if (images && images.length > 0) {
        userMsg.images = images.map(img => img.replace(/^data:image\/\w+;base64,/, ''));
      }
      messages.push(userMsg);

      const res = await fetch(ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma4:e4b',
          stream: false,
          format: 'json',
          messages
        }),
        signal: AbortSignal.timeout(timeoutMs)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Ollama API returned status ${res.status}: ${errorText}`);
      }

      const resData = await res.json();
      const latencyMs = Date.now() - startTime;
      const rawText = resData?.message?.content || '';
      return { rawText, latencyMs };
    }
  }

  // Attempt 1
  let result;
  let parsedJson = null;
  let lastError = null;

  try {
    result = await executeCall(user);
    parsedJson = JSON.parse(result.rawText.trim());
    if (jsonSchema) {
      validateSchema(parsedJson, jsonSchema);
    }
  } catch (err) {
    lastError = err;
    // Attempt 2: One retry on invalid JSON or parse failure
    try {
      const retryPrompt = `${user}\n\nIMPORTANT: Your previous output could not be parsed as valid JSON or failed schema. You MUST return ONLY a strictly valid JSON object matching this schema. No markdown formatting, no code blocks, only raw JSON.`;
      result = await executeCall(retryPrompt);
      const cleaned = result.rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedJson = JSON.parse(cleaned);
      if (jsonSchema) {
        validateSchema(parsedJson, jsonSchema);
      }
    } catch (retryErr) {
      const latencyMs = result?.latencyMs || 0;
      console.error(`[Gemma 4 Call FAILED] agent: ${agentName} | model: ${modelId} | provider: ${provider} | latency: ${latencyMs}ms | error: ${retryErr.message}`);
      throw new Error(`Gemma 4 execution failed for agent ${agentName}: ${retryErr.message}`);
    }
  }

  const latencyMs = result.latencyMs;
  // Required log line for every call: agent name, model id, provider, latency in ms
  console.log(`[Gemma 4 Call] agent: ${agentName} | model: ${modelId} | provider: ${provider} | latency: ${latencyMs}ms`);

  // Record into call history for proof verification
  callHistory.push({
    agent: agentName,
    modelId,
    provider,
    latencyMs,
    outputSnippet: JSON.stringify(parsedJson).substring(0, 120) + (JSON.stringify(parsedJson).length > 120 ? '...' : ''),
    timestamp: new Date().toISOString()
  });

  return parsedJson;
}

module.exports = {
  askGemma,
  getGemmaCallHistory,
  clearGemmaCallHistory
};
