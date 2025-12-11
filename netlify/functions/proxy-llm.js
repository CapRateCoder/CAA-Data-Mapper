// Netlify Function that forwards LLM requests to providers.
// Uses built-in Node.js fetch (available in Node 18+)
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
      resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({ 
          model: model || 'claude-3-sonnet-20240229', 
          max_tokens: 1024, 
          messages: [{ role: 'user', content: prompt }]
        })
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
      resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(apiKey), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
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
