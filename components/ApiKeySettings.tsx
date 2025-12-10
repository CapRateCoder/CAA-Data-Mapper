import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, X } from 'lucide-react';

interface ApiKeySettingsProps {
  onLLMConfigChange: (provider: string, apiKey: string) => void;
}

const PROVIDERS = [
  { id: 'gemini', label: 'Google Gemini', helpUrl: 'https://aistudio.google.com/app/apikey' },
  { id: 'openai', label: 'OpenAI (ChatGPT)', helpUrl: 'https://platform.openai.com/account/api-keys' },
  { id: 'claude', label: 'Anthropic (Claude)', helpUrl: 'https://console.anthropic.com/' }
];

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ onLLMConfigChange }) => {
  const [showSettings, setShowSettings] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string>(() => localStorage.getItem('selected_llm') || 'gemini');
  const [keys, setKeys] = useState<Record<string, string>>(() => ({
    gemini: localStorage.getItem('gemini_api_key') || '',
    openai: localStorage.getItem('openai_api_key') || '',
    claude: localStorage.getItem('claude_api_key') || ''
  }));
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState<Record<string, boolean>>({ gemini: !!keys.gemini, openai: !!keys.openai, claude: !!keys.claude });

  useEffect(() => {
    // Notify parent of current selection and key if present
    const key = keys[selectedProvider as keyof typeof keys] || '';
    onLLMConfigChange(selectedProvider, key);
  }, []); // run once on mount

  const handleProviderChange = (p: string) => {
    setSelectedProvider(p);
    localStorage.setItem('selected_llm', p);
    const key = keys[p as keyof typeof keys] || '';
    onLLMConfigChange(p, key);
  };

  const handleKeyChange = (p: string, value: string) => {
    setKeys(prev => ({ ...prev, [p]: value }));
    setIsSaved(prev => ({ ...prev, [p]: false }));
  };

  const handleSave = (p: string) => {
    const value = keys[p as keyof typeof keys] || '';
    if (!value.trim()) return;
    localStorage.setItem(`${p}_api_key`, value.trim());
    setIsSaved(prev => ({ ...prev, [p]: true }));
    onLLMConfigChange(p, value.trim());
    setTimeout(() => setShowSettings(false), 800);
  };

  const handleClear = (p: string) => {
    setKeys(prev => ({ ...prev, [p]: '' }));
    localStorage.removeItem(`${p}_api_key`);
    setIsSaved(prev => ({ ...prev, [p]: false }));
    onLLMConfigChange(p, '');
  };

  const providerMeta = PROVIDERS.find(pr => pr.id === selectedProvider) || PROVIDERS[0];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Key className="w-4 h-4" />
          API Key Settings
        </button>
      </div>

      {showSettings && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            {PROVIDERS.map(pr => (
              <label key={pr.id} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="llm-provider"
                  checked={selectedProvider === pr.id}
                  onChange={() => handleProviderChange(pr.id)}
                />
                <span className="ml-1">{pr.label}</span>
              </label>
            ))}
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">Select your preferred LLM provider and enter its API key. Keys are stored locally in your browser.</p>
            <p className="text-xs">
              Get a key from{' '}
              <a href={providerMeta.helpUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                {providerMeta.label}
              </a>
              . Your key is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={keys[selectedProvider as keyof typeof keys]}
                onChange={(e) => handleKeyChange(selectedProvider, e.target.value)}
                placeholder={`Enter your ${providerMeta.label} API key...`}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button onClick={() => handleSave(selectedProvider)} disabled={!keys[selectedProvider as keyof typeof keys]?.trim() || isSaved[selectedProvider as keyof typeof isSaved]} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2">
              {isSaved[selectedProvider as keyof typeof isSaved] ? (<><Check className="w-4 h-4" />Saved</>) : 'Save'}
            </button>

            {keys[selectedProvider as keyof typeof keys] && (
              <button onClick={() => handleClear(selectedProvider)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2">
            <strong>Privacy Note:</strong> Your API keys are stored only in your browser's `localStorage` and are used directly to call the chosen LLM from your browser. Keys are not transmitted to our servers by this app.
          </div>
        </div>
      )}
    </div>
  );
};
