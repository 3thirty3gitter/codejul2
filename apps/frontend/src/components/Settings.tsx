import React, { useState } from "react";

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    theme: 'dark',
    fontSize: '14',
    autoSave: true,
    aiModel: 'gpt-4',
    githubToken: '',
    openaiKey: ''
  });

  const handleSave = () => {
    localStorage.setItem('codepilot-settings', JSON.stringify(settings));
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#2d2d30',
        color: 'white',
        width: '600px',
        maxHeight: '80vh',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #454545',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>?? CodePilot Settings</h2>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: 'none',
            color: '#cccccc',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #454545'
        }}>
          {['general', 'editor', 'ai', 'integrations'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#007acc' : 'transparent',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', maxHeight: '400px', overflow: 'auto' }}>
          {activeTab === 'general' && (
            <div>
              <h3>General Settings</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label>Theme:</label>
                <select 
                  value={settings.theme}
                  onChange={(e) => setSettings({...settings, theme: e.target.value})}
                  style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div>
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.autoSave}
                    onChange={(e) => setSettings({...settings, autoSave: e.target.checked})}
                  /> Auto-save files
                </label>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              <h3>AI Configuration</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label>AI Model:</label>
                <select 
                  value={settings.aiModel}
                  onChange={(e) => setSettings({...settings, aiModel: e.target.value})}
                  style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3">Claude 3</option>
                </select>
              </div>
              <div>
                <label>OpenAI API Key:</label>
                <input 
                  type="password"
                  value={settings.openaiKey}
                  onChange={(e) => setSettings({...settings, openaiKey: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    marginTop: '0.25rem',
                    background: '#1e1e1e',
                    border: '1px solid #454545',
                    color: 'white'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid #454545',
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'flex-end'
        }}>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: '1px solid #454545',
            color: '#cccccc',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>Cancel</button>
          <button onClick={handleSave} style={{
            background: '#007acc',
            border: 'none',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}
