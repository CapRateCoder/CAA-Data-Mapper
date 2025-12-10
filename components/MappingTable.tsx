import React, { useState, useMemo } from 'react';
import { FieldMapping, MappingConfidence, MappingSource } from '../types';
import { RESO_STANDARD_FIELDS } from '../constants';
import { Check, AlertTriangle, BrainCircuit, Search, ChevronDown, Plus, RotateCcw, XCircle } from 'lucide-react';

interface MappingTableProps {
  mappings: FieldMapping[];
  onUpdateMapping: (id: string, newTarget: string) => void;
}

const ConfidenceBadge: React.FC<{ confidence: MappingConfidence; source: MappingSource }> = ({ confidence, source }) => {
  const styles = {
    [MappingConfidence.HIGH]: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    [MappingConfidence.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    [MappingConfidence.LOW]: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
    [MappingConfidence.NONE]: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
  };

  const Icon = source === MappingSource.AI ? BrainCircuit : 
               confidence === MappingConfidence.HIGH ? Check : 
               confidence === MappingConfidence.NONE ? AlertTriangle : Search;

  return (
    <div className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[confidence]}`}>
      <Icon className="w-3 h-3" />
      <span>{confidence}</span>
    </div>
  );
};

const ResoCombobox: React.FC<{ 
  value: string | null; 
  originalValue: string;
  onChange: (val: string) => void; 
}> = ({ value, originalValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredFields = useMemo(() => {
    if (!search) return RESO_STANDARD_FIELDS.slice(0, 100);
    const lower = search.toLowerCase();
    return RESO_STANDARD_FIELDS.filter(f => 
      f.StandardName.toLowerCase().includes(lower) || 
      f.DisplayName.toLowerCase().includes(lower)
    ).slice(0, 100);
  }, [search]);

  const selectedField = RESO_STANDARD_FIELDS.find(f => f.StandardName === value);
  
  let displayLabel = 'Select a RESO Field...';
  let isCustom = false;

  if (selectedField) {
    displayLabel = selectedField.StandardName;
  } else if (value) {
    displayLabel = value;
    isCustom = true;
  }

  return (
    <div className="relative w-full group">
      <div 
        className={`flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md cursor-pointer bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm hover:border-blue-400 focus:outline-none transition-colors ${
          !value ? 'border-red-300 dark:border-red-900/50 ring-1 ring-red-100 dark:ring-red-900/20' : 'border-slate-300 dark:border-slate-600'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col truncate text-left">
          <span className={`truncate font-medium ${!value ? 'text-slate-400 dark:text-slate-500 italic' : ''} ${isCustom ? 'text-purple-600 dark:text-purple-400' : ''}`}>
            {displayLabel}
          </span>
          {selectedField && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {selectedField.DisplayName}
            </span>
          )}
          {isCustom && (
            <span className="text-[10px] text-purple-500 dark:text-purple-400 truncate">
              Custom Field Mapping
            </span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-[400px] mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-2xl max-h-96 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <input
              autoFocus
              type="text"
              placeholder="Search standard fields or type custom name..."
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="overflow-y-auto flex-1 p-1">
             {/* Custom Actions Section */}
             <div className="mb-1 pb-1 border-b border-slate-100 dark:border-slate-700">
               {search && (
                 <div 
                  className="px-3 py-2 text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-md cursor-pointer flex items-center font-medium"
                  onClick={() => { onChange(search); setIsOpen(false); setSearch(''); }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Use custom: "{search}"
                </div>
               )}

               <div 
                  className="px-3 py-2 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md cursor-pointer flex items-center font-medium"
                  onClick={() => { onChange(originalValue); setIsOpen(false); }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Keep Original: "{originalValue}"
                </div>

                <div 
                  className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md cursor-pointer flex items-center font-medium"
                  onClick={() => { onChange(''); setIsOpen(false); }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  -- Do Not Import (Skip) --
                </div>
             </div>

             {/* Standard Fields Section */}
             <div className="pt-1">
                <div className="px-3 pb-1 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  RESO Standard Fields
                </div>
                {filteredFields.map((field) => (
                  <div
                    key={field.StandardName}
                    className={`px-3 py-2 text-sm cursor-pointer rounded-md transition-colors ${
                      value === field.StandardName 
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100' 
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    onClick={() => { onChange(field.StandardName); setIsOpen(false); }}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-medium truncate mr-2">{field.StandardName}</span>
                      {field.ResourceName && (
                        <span className="text-[10px] text-slate-400 uppercase flex-shrink-0 border border-slate-200 dark:border-slate-600 px-1 rounded">
                          {field.ResourceName}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{field.DisplayName}</div>
                  </div>
                ))}
                {filteredFields.length === 0 && !search && (
                   <div className="px-3 py-8 text-sm text-slate-400 text-center italic">
                     Type above to find fields...
                   </div>
                )}
             </div>
          </div>
        </div>
      )}
      
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export const MappingTable: React.FC<MappingTableProps> = ({ mappings, onUpdateMapping }) => {
  return (
    <div className="overflow-visible border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm bg-white dark:bg-slate-900">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/4">Original Column</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/4">Sample Data</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/3">Target Field (RESO / Custom)</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confidence</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
          {mappings.map((mapping) => (
            <tr key={mapping.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                {mapping.originalHeader}
              </td>
              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="max-w-xs truncate font-mono text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded" title={mapping.sampleValues.join(', ')}>
                   {mapping.sampleValues.join(', ')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <ResoCombobox 
                  value={mapping.targetField}
                  originalValue={mapping.originalHeader} 
                  onChange={(newVal) => onUpdateMapping(mapping.id, newVal)} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ConfidenceBadge confidence={mapping.confidence} source={mapping.source} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};