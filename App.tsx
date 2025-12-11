import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { MappingTable } from './components/MappingTable';
import { ApiKeySettings } from './components/ApiKeySettings';
import { FieldMapping } from './types';
import { generateInitialMappings } from './services/mappingService';
import { resolveUnmappedFieldsWithAI } from './services/aiService';
import { Database, Wand2, Download, RefreshCw, ArrowLeft } from 'lucide-react';
import Papa from 'papaparse';
import { APP_VERSION } from './constants';

function App() {
  const [step, setStep] = useState<'upload' | 'map' | 'complete'>('upload');
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [usageCount] = useState<number>(4521);
  const [apiKey, setApiKey] = useState<string>('');
  const [llmProvider, setLlmProvider] = useState<string>(() => localStorage.getItem('selected_llm') || 'gemini');
  const [aiError, setAiError] = useState<string>(''); 
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [conflictHeaders, setConflictHeaders] = useState<string[]>([]);

  const handleDataLoaded = (headers: string[], data: any[]) => {
    const initial = generateInitialMappings(headers, data);
    setMappings(initial);
    setRawData(data);
    setStep('map');
  };

  const handleUpdateMapping = (id: string, newTarget: string) => {
    setMappings(prev => prev.map(m => 
      m.id === id ? { ...m, targetField: newTarget } : m
    ));
    // Clear duplicate warning when user edits mappings
    setDuplicateWarning(null);
  };

  const handleMagicFix = async () => {
    if (!apiKey) {
      setAiError(`Please configure your ${llmProvider} API key in the settings above.`);
      return;
    }

    setIsProcessingAI(true);
    setAiError('');
    try {
      const improvedMappings = await resolveUnmappedFieldsWithAI(mappings, llmProvider, apiKey);
      setMappings(improvedMappings);
    } catch (error: any) {
      console.error('AI mapping error:', error);
      setAiError(error.message || 'Failed to process with AI. Please check your API key and try again.');
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleExport = () => {
    if (mappings.length === 0 || rawData.length === 0) return;
    // Detect duplicate target field names (multiple columns mapped to same RESO field)
    const targetMap = new Map<string, string[]>();
    mappings.forEach(m => {
      if (m.targetField) {
        const arr = targetMap.get(m.targetField) || [];
        arr.push(m.originalHeader);
        targetMap.set(m.targetField, arr);
      }
    });

    const duplicates = Array.from(targetMap.entries()).filter(([, arr]) => arr.length > 1);
    if (duplicates.length > 0) {
      // Build a readable warning message
      const parts = duplicates.map(([target, headers]) => `"${target}" <- ${headers.join(', ')}`);
      const message = `Duplicate target fields detected: ${parts.join(' ; ')}. Please resolve duplicates before exporting.`;
      setDuplicateWarning(message);
      // Save flattened conflicting original headers so the table can highlight them
      const headersList = duplicates.flatMap(([, headers]) => headers);
      setConflictHeaders(headersList);
      // scroll to first conflict row if present
      setTimeout(() => {
        const first = headersList[0];
        if (!first) return;
        const id = `mapping-row-${first.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
      // don't proceed with export
      return;
    }

    const mappedData = rawData.map(row => {
      const newRow: Record<string, any> = {};
      mappings.forEach(mapping => {
        if (mapping.targetField) {
          newRow[mapping.targetField] = row[mapping.originalHeader];
        }
      });
      return newRow;
    });

    const csv = Papa.unparse(mappedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'reso_harmonized_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setStep('upload');
    setMappings([]);
    setRawData([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 dark:text-slate-100 relative transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">CAA Data Field Mapper</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">MLS Data Standardization Tool</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">v{APP_VERSION}</p>
            </div>
          </div>
          {step === 'map' && (
            <div className="flex space-x-3">
               <button 
                onClick={reset}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Start Over</span>
              </button>
              <button 
                onClick={handleMagicFix}
                disabled={isProcessingAI}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
              >
                {isProcessingAI ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span>{isProcessingAI ? 'Thinking...' : 'AI Auto-Map'}</span>
              </button>
              <button 
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Floating duplicate warning (visible even when scrolled) */}
      {duplicateWarning && (
        <div className="fixed right-4 top-20 z-50 max-w-lg w-96">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm text-yellow-800 dark:text-yellow-300">{duplicateWarning}</div>
              <button onClick={() => { setDuplicateWarning(null); setConflictHeaders([]); }} className="text-yellow-600 dark:text-yellow-200 hover:underline text-xs">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'upload' && (
          <div className="max-w-xl mx-auto mt-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Harmonize your MLS Data</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">Upload your raw MLS export file to instantly map it to the RESO Data Dictionary standard using our smart fuzzy matching and AI.</p>
            </div>
            
            <ApiKeySettings onLLMConfigChange={(provider, key) => { setLlmProvider(provider); setApiKey(key); }} />
            
            <FileUpload onDataLoaded={handleDataLoaded} />
            
            {/* Stats Cards */}
            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">500+</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">MLS Systems Supported</div>
              </div>
               <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">AI</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Powered Field Mapping</div>
              </div>
               <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">100%</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">CAA Community Tool</div>
              </div>
            </div>
          </div>
        )}

        {step === 'map' && (
          <div className="space-y-6">
            <ApiKeySettings onLLMConfigChange={(provider, key) => { setLlmProvider(provider); setApiKey(key); }} />
            
            {aiError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-300">{aiError}</p>
              </div>
            )}
            {duplicateWarning && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">{duplicateWarning}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Review Column Mappings</h2>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {mappings.filter(m => m.targetField).length} / {mappings.length} Columns Mapped
              </div>
            </div>
            <MappingTable mappings={mappings} onUpdateMapping={handleUpdateMapping} conflictHeaders={conflictHeaders} />
          </div>
        )}
      </main>
      
      {/* Discreet Footer ID */}
      <div className="w-full py-2 text-center select-none opacity-40 hover:opacity-100 transition-opacity absolute bottom-0">
        <span className="text-[10px] text-slate-400 font-mono">
          ID: {usageCount}
        </span>
      </div>
    </div>
  );
}

export default App;