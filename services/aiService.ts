import { FieldMapping } from '../types';
import { resolveUnmappedFieldsWithAI as resolveWithGemini } from './geminiService';
import { resolveUnmappedFieldsWithOpenAI } from './openaiService';
import { resolveUnmappedFieldsWithClaude } from './claudeService';

export const resolveUnmappedFieldsWithAI = async (
  mappings: FieldMapping[],
  provider: string,
  apiKey: string
): Promise<FieldMapping[]> => {
  switch (provider) {
    case 'openai':
      return await resolveUnmappedFieldsWithOpenAI(mappings, apiKey);
    case 'claude':
      return await resolveUnmappedFieldsWithClaude(mappings, apiKey);
    case 'gemini':
    default:
      return await resolveWithGemini(mappings, apiKey);
  }
};

export default { resolveUnmappedFieldsWithAI };
