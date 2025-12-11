import { GoogleGenAI, Type } from "@google/genai";
import { RESO_STANDARD_FIELDS } from "../constants";
import { FieldMapping, MappingConfidence, MappingSource } from "../types";

export const resolveUnmappedFieldsWithAI = async (
  mappings: FieldMapping[],
  apiKey: string
): Promise<FieldMapping[]> => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API key is required');
  }

  console.debug('[Gemini] Initializing GoogleGenAI SDK');
  const ai = new GoogleGenAI({ apiKey });
  console.debug('[Gemini] SDK initialized successfully');
  // Filter for fields that are unmapped or low confidence
  const problematicMappings = mappings.filter(
    (m) => m.confidence === MappingConfidence.NONE || m.confidence === MappingConfidence.LOW
  );

  if (problematicMappings.length === 0) return mappings;

  // Prepare context for Gemini
  const fieldDescriptions = problematicMappings.map(m => ({
    header: m.originalHeader,
    samples: m.sampleValues.join(", ")
  }));

  const resoCandidates = RESO_STANDARD_FIELDS.map(f => f.StandardName).join(", ");

  const prompt = `
    You are a data engineering expert specializing in Real Estate Standards Organization (RESO) Data Dictionary.
    
    I have a list of MLS column headers and sample data that I need to map to the standard RESO field names.
    
    Available RESO Standard Fields: ${resoCandidates}

    Columns to map:
    ${JSON.stringify(fieldDescriptions, null, 2)}

    Return a JSON array where each object contains "header" and "resoField". 
    If you are confident, set "confidence" to "High" or "Medium". 
    If you cannot determine a mapping, return null for "resoField".
  `;

  try {
    console.debug('[Gemini] Starting generateContent call with model gemini-2.5-flash');
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              header: { type: Type.STRING },
              resoField: { type: Type.STRING, nullable: true },
              confidence: { type: Type.STRING }
            }
          }
        }
      }
    });

    console.debug('[Gemini] Response received, parsing JSON');
    const aiSuggestions = JSON.parse(response.text);
    console.debug('[Gemini] Parsed', aiSuggestions.length, 'suggestions');

    // Merge AI suggestions back into mappings
    return mappings.map(m => {
      const suggestion = aiSuggestions.find((s: any) => s.header === m.originalHeader);
      if (suggestion && suggestion.resoField) {
        return {
          ...m,
          targetField: suggestion.resoField,
          confidence: suggestion.confidence === "High" ? MappingConfidence.HIGH : MappingConfidence.MEDIUM,
          source: MappingSource.AI
        };
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