import React, { useState, useEffect } from 'react';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('configuration');
  const [apiKey, setApiKey] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState('');

  // Load current API key on mount
  useEffect(() => {
    const currentKey = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
    setApiKey(currentKey);
  }, []);

  const testConnection = async () => {
    if (!apiKey.trim()) {
      setConnectionStatus('error');
      setConnectionMessage('Please enter an API key first');
      return;
    }

    if (!apiKey.startsWith('pplx-')) {
      setConnectionStatus('error');
      setConnectionMessage('API key should start with "pplx-". Please check your key format.');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');
    setConnectionMessage('Testing connection...');

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'sonar-medium',
          messages: [
            {
              role: 'user',
              content: 'Hello'
            }
          ],
          max_tokens: 10
        })
      });

      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', response.headers);

      if (response.ok) {
        setConnectionStatus('success');
        setConnectionMessage('? Connection successful! Your API key is valid and working.');
      } else if (response.status === 401) {
        setConnectionStatus('error');
        setConnectionMessage('? Invalid API key. Please check your Perplexity API key.');
      } else if (response.status === 429) {
        setConnectionStatus('error');
        setConnectionMessage('?? Rate limit exceeded. Your API key is valid but you may have exceeded your quota.');
      } else if (response.status === 400) {
        const errorText = await response.text();
        console.log('400 Error Details:', errorText);
        setConnectionStatus('error');
        setConnectionMessage(`? Bad Request (400): ${errorText.substring(0, 100)}... Check API key format.`);
      } else {
        const errorText = await response.text();
        console.log('Error Details:', errorText);
        setConnectionStatus('error');
        setConnectionMessage(`? Connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionStatus('error');
      setConnectionMessage(`? Network error: ${error.message}. Check your internet connection.`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const copyApiKeyToClipboard = () => {
    const envContent = `VITE_PERPLEXITY_API_KEY=${apiKey}`;
    navigator.clipboard.writeText(envContent).then(() => {
      alert('API key configuration copied to clipboard! Paste it into your .env.local file.');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard. Please copy manually.');
    });
  };

  const saveSettings = () => {
    if (!apiKey.trim()) {
      alert('Please enter an API key first.');
      return;
    }

    // Show detailed instructions for saving the API key
    const instructions = `To save your API key permanently:

1. Open your .env.local file in the project root folder:
   ${window.location.origin.replace('http://localhost:5173', 'C:\\crmcp\\apps\\frontend\\.env.local')}

2. Add or update this line:
   VITE_PERPLEXITY_API_KEY=${apiKey}

3. Save the file and restart your dev server:
   npm run dev

4. Refresh this page to load the new API key

Your API key will then be available automatically!`;

    if (confirm(instructions + '\n\nWould you like to copy the configuration line to your clipboard?')) {
      copyApiKeyToClipboard();
    }
  };

  const tabs = [
    { id: 'configuration', label: 'API Configuration', icon: '??' },
    { id: 'appearance', label: 'Appearance', icon: '??' },
    { id: 'preferences', label: 'Preferences', icon: '??' },
    { id: 'about', label: 'About', icon: '??' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">??</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          </div>
          
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              ?
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'configuration' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">?? Perplexity AI Integration</h4>
                  <p className="text-blue-700 text-sm">
                    Configure your Perplexity API key to enable real-time AI responses with web search capabilities.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Perplexity API Key
                    </label>
                    <div className="space-y-2">
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      />
                      <p className="text-xs text-gray-500">
                        Your API key should start with "pplx-". Get one from{' '}
                        <a href="https://perplexity.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          perplexity.ai
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={testConnection}
                      disabled={isTestingConnection || !apiKey.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {isTestingConnection ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          ?? Test Connection
                        </>
                      )}
                    </button>

                    <button
                      onClick={saveSettings}
                      disabled={!apiKey.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ?? Save Instructions
                    </button>
                  </div>

                  {/* Connection Status */}
                  {connectionStatus !== 'idle' && (
                    <div className={`p-4 rounded-lg ${
                      connectionStatus === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-800' 
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                      <div className="flex items-start gap-2">
                        <span>{connectionStatus === 'success' ? '?' : '?'}</span>
                        <div>
                          <div className="font-medium">
                            {connectionStatus === 'success' ? 'Connection Successful' : 'Connection Failed'}
                          </div>
                          <p className="text-sm mt-1">{connectionMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Debug Information */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">?? Debug Information</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Current API Key:</strong> {apiKey ? `${apiKey.substring(0, 8)}...` : 'Not set'}</p>
                      <p><strong>Environment Variable:</strong> {import.meta.env.VITE_PERPLEXITY_API_KEY ? 'Loaded' : 'Not found'}</p>
                      <p><strong>Key Format Valid:</strong> {apiKey.startsWith('pplx-') ? '? Yes' : '? Should start with pplx-'}</p>
                    </div>
                  </div>

                  {/* Usage Information */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">?? API Usage Information</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Elite Coder:</strong> Uses sonar-pro model for production-ready code</li>
                      <li>• <strong>System Architect:</strong> Uses sonar-pro for comprehensive designs</li>
                      <li>• <strong>Tech Researcher:</strong> Uses sonar-pro with web search enabled</li>
                      <li>• <strong>Speed Demon:</strong> Uses sonar-small for rapid responses</li>
                      <li>• <strong>Coordinator:</strong> Uses sonar-medium for general assistance</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">?? Appearance Settings</h4>
                  <p className="text-purple-700 text-sm">
                    Customize the look and feel of your CodePilot workspace.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Light Theme</option>
                      <option>Dark Theme</option>
                      <option>Auto (System)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">?? Workspace Preferences</h4>
                  <p className="text-orange-700 text-sm">
                    Configure your development environment preferences.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Auto-save Files</label>
                      <p className="text-xs text-gray-500">Automatically save changes as you type</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">?? About CodePilot</h4>
                  <p className="text-gray-700 text-sm">
                    Your intelligent development workspace powered by AI.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Version</h5>
                      <p className="text-gray-600">1.0.0</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Build</h5>
                      <p className="text-gray-600">2025.01.01</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
