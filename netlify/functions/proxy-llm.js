const fetch = require('node-fetch');

// Simple Netlify Function that forwards LLM requests to providers.
// Expects POST body: { provider: 'claude'|'openai'|'gemini', apiKey: '...', prompt: '...', model?: '...' }

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let body;
  try { body = JSON.parse(event.body); } catch (e) { return { statusCode: 400, body: 'Invalid JSON' }; }

  const { provider, apiKey, prompt, model } = body;
  if (!provider || !apiKey || !prompt) return { statusCode: 400, body: 'Missing provider, apiKey or prompt' };

  try {
    let resp;
    if (provider === 'claude') {
      resp = await fetch('https://api.anthropic.com/v1/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({ model: model || 'claude-2.1', prompt, max_tokens: 1000, temperature: 0.0 })
      });
    } else if (provider === 'openai') {
      resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ model: model || 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 8000, temperature: 0.0 })
      });
    } else if (provider === 'gemini') {
      // Forward to Gemini via Google GenAI REST (if needed). Keep simple passthrough for now.
      resp = await fetch('https://api.gen.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ model: model || 'gemini-2.5-flash', prompt })
      });
    } else {
      return { statusCode: 400, body: 'Unsupported provider' };
    }

    const text = await resp.text();
    return { statusCode: resp.status, body: text };

  } catch (err) {
    return { statusCode: 500, body: String(err) };
  }
};
