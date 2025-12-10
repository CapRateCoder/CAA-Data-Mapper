import { FieldMapping, MappingConfidence } from '../types';

const extractJson = (text: string) => {
  try { return JSON.parse(text); } catch {}
  const m = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (m) {
    try { return JSON.parse(m[1]); } catch {}
  }
  const b = text.match(/\{[\s\S]*\}/);
  if (b) {
    try { return JSON.parse(b[0]); } catch {}
  }
  throw new Error('Unable to parse JSON from Claude response');
};

export const resolveUnmappedFieldsWithClaude = async (
  mappings: FieldMapping[],
  apiKey: string
): Promise<FieldMapping[]> => {
  if (!apiKey || apiKey.trim() === '') throw new Error('API key is required');

  const problematic = mappings.filter(m => m.confidence === MappingConfidence.NONE || m.confidence === MappingConfidence.LOW);
  if (problematic.length === 0) return mappings;

  const fieldDescriptions = problematic.map(m => ({ header: m.originalHeader, samples: m.sampleValues.join(', ') }));

  const prompt = `You are a data engineering expert specializing in the RESO Data Dictionary.\n\nReturn a JSON array of objects with properties: header, resoField (string or null), confidence (High|Medium|Low).\n\nColumns:\n${JSON.stringify(fieldDescriptions, null, 2)}`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        model: 'claude-2.1',
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.0
      })
    });

    const data = await resp.json();
    const content = data?.completion || data?.completion?.text || data?.response || '';
    const parsed = extractJson(content);

    return mappings.map(m => {
      const suggestion = (parsed || []).find((s: any) => s.header === m.originalHeader);
      if (suggestion && suggestion.resoField) {
        return { ...m, targetField: suggestion.resoField, confidence: suggestion.confidence === 'High' ? MappingConfidence.HIGH : MappingConfidence.MEDIUM };
      }
      return m;
    });
  } catch (error) {
    console.error('Claude mapping error:', error);
    return mappings;
  }
};

export default { resolveUnmappedFieldsWithClaude };
