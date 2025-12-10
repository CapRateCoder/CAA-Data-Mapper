import Fuse from 'fuse.js';
import { FieldMapping, MappingConfidence, MappingSource } from '../types';
import { RESO_STANDARD_FIELDS } from '../constants';

export const generateInitialMappings = (
  headers: string[], 
  dataSample: any[]
): FieldMapping[] => {
  
  // Configure Fuse.js for fuzzy matching against the full 1700+ field list
  const fuse = new Fuse(RESO_STANDARD_FIELDS, {
    keys: ['StandardName', 'DisplayName'], // Search across these keys
    threshold: 0.3, // Lower threshold for stricter matching initially
    includeScore: true,
  });

  return headers.map((header) => {
    const cleanHeader = header.trim();
    let targetField: string | null = null;
    let confidence = MappingConfidence.NONE;
    let source = MappingSource.MANUAL;

    // 1. Exact Match Check (Case Insensitive)
    const exactMatch = RESO_STANDARD_FIELDS.find(
      f => f.StandardName.toLowerCase() === cleanHeader.toLowerCase() || 
           f.DisplayName.toLowerCase() === cleanHeader.toLowerCase()
    );

    if (exactMatch) {
      return {
        id: header,
        originalHeader: header,
        targetField: exactMatch.StandardName,
        confidence: MappingConfidence.HIGH,
        source: MappingSource.EXACT,
        sampleValues: dataSample.slice(0, 3).map(row => row[header])
      };
    }

    // 2. Fuzzy Match Check
    const fuzzyResults = fuse.search(cleanHeader);
    
    if (fuzzyResults.length > 0 && fuzzyResults[0].score !== undefined) {
      const bestMatch = fuzzyResults[0];
      // Score is 0 to 1, lower is better
      if (bestMatch.score < 0.2) {
        targetField = bestMatch.item.StandardName;
        confidence = MappingConfidence.HIGH;
        source = MappingSource.FUZZY;
      } else if (bestMatch.score < 0.4) {
        targetField = bestMatch.item.StandardName;
        confidence = MappingConfidence.MEDIUM;
        source = MappingSource.FUZZY;
      } else if (bestMatch.score < 0.6) {
        targetField = bestMatch.item.StandardName;
        confidence = MappingConfidence.LOW;
        source = MappingSource.FUZZY;
      }
    }

    // 3. Common MLS Aliases (Heuristics)
    if (!targetField || confidence === MappingConfidence.LOW) {
       const h = cleanHeader.toLowerCase();
       // Bed/Bath logic
       if (h.match(/^beds?$/) || h === 'br') { targetField = 'BedroomsTotal'; confidence = MappingConfidence.HIGH; source = MappingSource.FUZZY; }
       else if (h.match(/^baths?$/) || h === 'ba') { targetField = 'BathroomsTotalInteger'; confidence = MappingConfidence.HIGH; source = MappingSource.FUZZY; }
       else if (h.match(/^sqft$/) || h.match(/^sq.?ft.?$/)) { targetField = 'LivingArea'; confidence = MappingConfidence.MEDIUM; source = MappingSource.FUZZY; }
       else if (h === 'dom' || h === 'adom') { targetField = 'DaysOnMarket'; confidence = MappingConfidence.HIGH; source = MappingSource.FUZZY; }
       else if (h.match(/mls.?#/) || h === 'mls_id' || h === 'mlsid') { targetField = 'ListingId'; confidence = MappingConfidence.HIGH; source = MappingSource.FUZZY; }
       else if (h.match(/zip/) || h === 'postal') { targetField = 'PostalCode'; confidence = MappingConfidence.HIGH; source = MappingSource.FUZZY; }
       else if (h === 'subdivision') { targetField = 'SubdivisionName'; confidence = MappingConfidence.HIGH; source = MappingSource.FUZZY; }
       else if (h === 'remarks' || h === 'description') { targetField = 'PublicRemarks'; confidence = MappingConfidence.MEDIUM; source = MappingSource.FUZZY; }
    }

    return {
      id: header,
      originalHeader: header,
      targetField: targetField,
      confidence: confidence,
      source: source,
      sampleValues: dataSample.slice(0, 3).map(row => row[header])
    };
  });
};