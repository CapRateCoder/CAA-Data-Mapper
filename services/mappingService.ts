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
    threshold: 0.15, // Lower threshold = stricter matching (0 is perfect, 1 is no match)
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

    // 2. Alias-based exact matches (case-insensitive synonyms)
    // These map common MLS header variations directly to RESO fields with HIGH confidence.
    const aliasMap: Record<string, string[]> = {
      StandardStatus: ['status', 'active', 'active under contract', 'canceled', 'closed', 'expired', 'pending', 'withdrawn'],
      LivingArea: ['square footage', 'gla', 'size sf', 'sizesf', 'building size', 'gross living area', 'sqft', 'square feet', 'living area'],
      ClosePrice: ['selling price', 'close price', 'sold price', 'soldprice', 'closing price', 'closingprice', 'sale price', 'sp'],
      BedroomsTotal: ['bedrooms', 'br', 'beds', 'bed'],
      BathroomsFull: ['fbths', 'full baths', 'fullba'],
      BathroomHalfs: ['hbths', 'halfba', 'half baths'],
      BathroomsTotalInteger: ['bathrooms', 'total baths', 'bath', 'baths'],
      ListingId: ['mls#', 'mls #', 'mls_id', 'mlsid'],
      StructureType: ['style code'],
      CloseDate: ['selling date', 'sold date', 'solddate', 'closing date', 'close date'],
      CumulativeDaysOnMarket: ['cdom'],
      ListPrice: ['listing price', 'list price', 'listprice', 'asking price', 'lp'],
      DaysOnMarket: ['dom', 'days on market', 'market days']
    };

    const headerLower = cleanHeader.toLowerCase();
    for (const [std, aliases] of Object.entries(aliasMap)) {
      for (const a of aliases) {
        if (headerLower === a.toLowerCase()) {
          targetField = std;
          confidence = MappingConfidence.HIGH;
          source = MappingSource.FUZZY;
          break;
        }
      }
      if (targetField) break;
    }

    // 3. Fuzzy Match Check (runs only if alias did not produce a HIGH match)
    // Score is 0 to 1, lower is better. Only MEDIUM/LOW from fuzzy; HIGH reserved for exact matches and strong aliases.
    if (!targetField) {
      const fuzzyResults = fuse.search(cleanHeader);
      if (fuzzyResults.length > 0 && fuzzyResults[0].score !== undefined) {
        const bestMatch = fuzzyResults[0];
        if (bestMatch.score < 0.2) {
          // Very good fuzzy match, but still not as reliable as exact or aliasing
          targetField = bestMatch.item.StandardName;
          confidence = MappingConfidence.MEDIUM;
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
    }

    // 3. Common MLS Aliases (Heuristics) — HIGH confidence only for highly reliable patterns
    if (!targetField || confidence === MappingConfidence.LOW) {
       const h = cleanHeader.toLowerCase();
       // Exact or near-exact common abbreviations get HIGH; others get MEDIUM
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