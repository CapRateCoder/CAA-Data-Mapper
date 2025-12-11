import { FieldMapping, MappingConfidence } from '../types';

const extractJson = (text: string) => {
  console.debug('[Claude] Attempting to extract JSON from:', text.substring(0, 200));
  try { 
    const parsed = JSON.parse(text);
    console.debug('[Claude] Direct JSON parse succeeded');
    return parsed;
  } catch {}
  
  const m = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (m) {
    try { 
      const parsed = JSON.parse(m[1]);
      console.debug('[Claude] JSON from code block succeeded');
      return parsed;
    } catch {}
  }
  
  const b = text.match(/\{[\s\S]*\}/);
  if (b) {
    try { 
      const parsed = JSON.parse(b[0]);
      console.debug('[Claude] JSON from braces succeeded');
      return parsed;
    } catch {}
  }
  
  console.error('[Claude] Failed to extract JSON, throwing error');
  throw new Error('Unable to parse JSON from Claude response');
};

export const resolveUnmappedFieldsWithClaude = async (
  mappings: FieldMapping[],
  apiKey: string
): Promise<FieldMapping[]> => {
  if (!apiKey || apiKey.trim() === '') throw new Error('API key is required');

  const problematic = mappings.filter(m => m.confidence === MappingConfidence.NONE || m.confidence === MappingConfidence.LOW);
  if (problematic.length === 0) {
    console.debug('[Claude] No problematic mappings to resolve');
    return mappings;
  }

  const fieldDescriptions = problematic.map(m => ({ header: m.originalHeader, samples: m.sampleValues.join(', ') }));

  const prompt = `You are a data engineering expert specializing in the RESO Data Dictionary.\n\nReturn a JSON array of objects with properties: header, resoField (string or null), confidence (High|Medium|Low).\n\nColumns:\n${JSON.stringify(fieldDescriptions, null, 2)}`;

  console.debug('[Claude] Starting Claude API call');

  try {
    console.debug('[Claude] Fetching from Anthropic Messages API');
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    console.debug('[Claude] Response status:', resp.status);

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('[Claude] API error response:', errorText);
      throw new Error(`Claude API error ${resp.status}: ${errorText}`);
    }

    const data = await resp.json();
    console.debug('[Claude] Raw response:', JSON.stringify(data).substring(0, 300));

    const content = data?.content?.[0]?.text || '';
    console.debug('[Claude] Extracted content:', content.substring(0, 300));

    if (!content) {
      console.warn('[Claude] No content in response, returning original mappings');
      return mappings;
    }

    const parsed = extractJson(content);
    console.debug('[Claude] Parsed suggestions count:', (parsed || []).length);

    return mappings.map(m => {
      const suggestion = (parsed || []).find((s: any) => s.header === m.originalHeader);
      if (suggestion && suggestion.resoField) {
        console.debug(`[Claude] Mapping ${m.originalHeader} -> ${suggestion.resoField}`);
        return { ...m, targetField: suggestion.resoField, confidence: suggestion.confidence === 'High' ? MappingConfidence.HIGH : MappingConfidence.MEDIUM };
      }
      return m;
    });
  } catch (error) {
    console.error('[Claude] mapping error:', error);
    console.warn('[Claude] API mapping failed, returning original mappings');
    return mappings;
  }
};

export default { resolveUnmappedFieldsWithClaude };
