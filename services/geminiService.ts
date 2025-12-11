import { RESO_STANDARD_FIELDS } from "../constants";
import { FieldMapping, MappingConfidence, MappingSource } from "../types";

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
  throw new Error('Unable to parse JSON from Gemini response');
};

export const resolveUnmappedFieldsWithAI = async (
  mappings: FieldMapping[],
  apiKey: string
): Promise<FieldMapping[]> => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API key is required');
  }

  const problematic = mappings.filter(m => m.confidence === MappingConfidence.NONE || m.confidence === MappingConfidence.LOW);
  if (problematic.length === 0) return mappings;

  const fieldDescriptions = problematic.map(m => ({ header: m.originalHeader, samples: m.sampleValues.join(', ') }));

  const prompt = `You are a data engineering expert specializing in the RESO Data Dictionary.\n\nReturn a JSON array of objects with properties: header, resoField (string or null), confidence (High|Medium|Low).\n\nColumns:\n${JSON.stringify(fieldDescriptions, null, 2)}`;

  try {
    console.debug('[Gemini] Starting API call to Google Generative AI');
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    console.debug('[Gemini] API response status:', resp.status);

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || `HTTP ${resp.status}`;
      console.error('[Gemini] API error:', errorMsg);
      throw new Error(`Gemini API error: ${errorMsg}`);
    }

    const data = await resp.json();
    console.debug('[Gemini] Raw response received, extracting text');

    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!content) {
      console.warn('[Gemini] No content in response');
      return mappings;
    }

    console.debug('[Gemini] Parsing JSON from response');
    const parsed = extractJson(content);
    console.debug('[Gemini] Parsed', (parsed || []).length, 'suggestions');

    return mappings.map(m => {
      const suggestion = (parsed || []).find((s: any) => s.header === m.originalHeader);
      if (suggestion && suggestion.resoField) {
        console.debug(`[Gemini] Mapping ${m.originalHeader} -> ${suggestion.resoField}`);
        return { ...m, targetField: suggestion.resoField, confidence: suggestion.confidence === 'High' ? MappingConfidence.HIGH : MappingConfidence.MEDIUM, source: MappingSource.AI };
      }
      return m;
    });

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[Gemini] Critical error:", errorMsg);
    console.error("[Gemini] Full error:", error);
    throw new Error(`Gemini API failed: ${errorMsg}`);
  }
};

export default { resolveUnmappedFieldsWithAI };