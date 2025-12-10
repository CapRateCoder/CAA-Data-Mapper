export enum MappingConfidence {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  NONE = 'None'
}

export enum MappingSource {
  EXACT = 'Exact Match',
  FUZZY = 'Fuzzy Match',
  AI = 'AI Suggestion',
  MANUAL = 'Manual'
}

export interface FieldMapping {
  id: string;
  originalHeader: string;
  targetField: string | null;
  confidence: MappingConfidence;
  source: MappingSource;
  sampleValues: string[];
}

export interface ResoFieldDefinition {
  StandardName: string;
  DisplayName: string;
  SimpleDataType?: string;
  Definition?: string;
  ResourceName?: string;
}

export interface UploadedData {
  headers: string[];
  rows: any[];
}