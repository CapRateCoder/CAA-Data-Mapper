import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, X } from 'lucide-react';

interface ApiKeySettingsProps {
  onApiKeyChange: (apiKey: string) => void;
  hasApiKey: boolean;
}

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ onApiKeyChange, hasApiKey }) => {
  const [showSettings, setShowSettings] = useState(!hasApiKey);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on mount
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      onApiKeyChange(savedKey);
      setIsSaved(true);
    }
  }, [onApiKeyChange]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      onApiKeyChange(apiKey.trim());
      setIsSaved(true);
      setTimeout(() => setShowSettings(false), 1000);
    }
  };

  const handleClear = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
    onApiKeyChange('');
    setIsSaved(false);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Key className="w-4 h-4" />
          API Key Settings
          {hasApiKey && !showSettings && (
            <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
              Configured
            </span>
          )}
        </button>
      </div>

      {showSettings && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">Enter your Gemini API key to enable AI-powered field mapping.</p>
            <p className="text-xs">
              Get your API key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Google AI Studio
              </a>
              . Your key is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setIsSaved(false);
                }}
                placeholder="Enter your Gemini API key..."
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={!apiKey.trim() || isSaved}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : (
                'Save'
              )}
            </button>

            {apiKey && (
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2">
            <strong>Privacy Note:</strong> Your API key is stored only in your browser's local storage and is used directly 
            to call the Gemini API from your browser. It is never transmitted to or stored on our servers.
          </div>
        </div>
      )}
    </div>
  );
};
