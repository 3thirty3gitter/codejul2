import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, ExternalLink, Eye, EyeOff, Smartphone, Tablet, Monitor, AlertCircle } from 'lucide-react';

interface LivePreviewProps {
  files: Array<{
    id: string;
    name: string;
    content: string;
    path: string;
    lastModified: Date;
  }>;
  selectedFileId?: string;
}

export default function LivePreview({ files, selectedFileId }: LivePreviewProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Find the main entry file (index.html, App.tsx, etc.)
  const findEntryFile = useCallback(() => {
    // Priority order for entry files
    const entryPriority = ['index.html', 'app.html', 'main.html', 'App.tsx', 'App.jsx', 'app.tsx', 'app.jsx', 'index.tsx', 'index.jsx'];
    
    for (const fileName of entryPriority) {
      const file = files.find(f => f.name.toLowerCase() === fileName.toLowerCase());
      if (file) return file;
    }
    
    // Fallback to first HTML file
    const htmlFile = files.find(f => f.name.endsWith('.html'));
    if (htmlFile) return htmlFile;
    
    // Fallback to first React file
    const reactFile = files.find(f => f.name.endsWith('.tsx') || f.name.endsWith('.jsx'));
    if (reactFile) return reactFile;
    
    return null;
  }, [files]);

  // Generate preview content based on file types
  const generatePreviewContent = useCallback(() => {
    const entryFile = findEntryFile();
    if (!entryFile) return null;

    try {
      if (entryFile.name.endsWith('.html')) {
        return generateHTMLPreview(entryFile);
      } else if (entryFile.name.endsWith('.tsx') || entryFile.name.endsWith('.jsx')) {
        return generateReactPreview(entryFile);
      }
      return null;
    } catch (error) {
      setErrors([`Preview generation error: ${error.message}`]);
      return null;
    }
  }, [files, findEntryFile]);

  const generateHTMLPreview = (entryFile: any) => {
    let htmlContent = entryFile.content;
    
    // Find and inject CSS files
    const cssFiles = files.filter(f => f.name.endsWith('.css'));
    const cssInjections = cssFiles.map(css => `<style>\n${css.content}\n</style>`).join('\n');
    
    // Find and inject JS files
    const jsFiles = files.filter(f => f.name.endsWith('.js') && !f.name.includes('node_modules'));
    const jsInjections = jsFiles.map(js => `<script>\n${js.content}\n</script>`).join('\n');
    
    // Inject CSS and JS into HTML
    if (htmlContent.includes('</head>')) {
      htmlContent = htmlContent.replace('</head>', `${cssInjections}\n</head>`);
    }
    
    if (htmlContent.includes('</body>')) {
      htmlContent = htmlContent.replace('</body>', `${jsInjections}\n</body>`);
    }
    
    // Add error handling and live reload
    const enhancedHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodePilot Live Preview</title>
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .codepilot-error {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #ff4444;
            color: white;
            padding: 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
        }
    </style>
    ${cssInjections}
</head>
<body>
    ${htmlContent.replace(/<\/?(!DOCTYPE|html|head|body)[^>]*>/gi, '')}
    
    <script>
        window.onerror = function(msg, url, lineNo, columnNo, error) {
            console.error('Error: ' + msg + ' Script: ' + url + ' Line: ' + lineNo + ' Column: ' + columnNo + ' StackTrace: ' + error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'codepilot-error';
            errorDiv.textContent = 'Error: ' + msg;
            document.body.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
            return false;
        };
        
        ${jsFiles.map(js => js.content).join('\n')}
    </script>
</body>
</html>`;
    
    return enhancedHTML;
  };

  const generateReactPreview = (entryFile: any) => {
    // Basic React to HTML transformation
    const reactContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodePilot React Preview</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .codepilot-error {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #ff4444;
            color: white;
            padding: 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        const { useState, useEffect, useRef } = React;
        
        // Transform and execute React component
        try {
            ${entryFile.content.replace(/export default/g, 'const App =')}
            
            ReactDOM.render(React.createElement(App), document.getElementById('root'));
        } catch (error) {
            console.error('React Error:', error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'codepilot-error';
            errorDiv.textContent = 'React Error: ' + error.message;
            document.body.appendChild(errorDiv);
        }
    </script>
</body>
</html>`;
    
    return reactContent;
  };

  // Update preview when files change
  useEffect(() => {
    if (autoRefresh && files.length > 0) {
      const content = generatePreviewContent();
      if (content) {
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setLastRefresh(new Date());
        setErrors([]);
        
        // Cleanup previous URL
        return () => URL.revokeObjectURL(url);
      }
    }
  }, [files, autoRefresh, generatePreviewContent]);

  const refreshPreview = () => {
    setIsLoading(true);
    setTimeout(() => {
      const content = generatePreviewContent();
      if (content) {
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setLastRefresh(new Date());
        setErrors([]);
      }
      setIsLoading(false);
    }, 100);
  };

  const openInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  const getDeviceStyles = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const entryFile = findEntryFile();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-800">Live Preview</h2>
            {entryFile && (
              <span className="text-sm text-gray-500">({entryFile.name})</span>
            )}
          </div>
          
          {errors.length > 0 && (
            <div className="flex items-center gap-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{errors.length} error(s)</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Device Preview Modes */}
          <div className="flex items-center bg-white rounded-lg border border-gray-200">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 rounded-l-lg transition-colors ${
                previewMode === 'desktop' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`p-2 transition-colors ${
                previewMode === 'tablet' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 rounded-r-lg transition-colors ${
                previewMode === 'mobile' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Control Buttons */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              autoRefresh
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
          >
            {autoRefresh ? 'Auto' : 'Manual'}
          </button>

          <button
            onClick={refreshPreview}
            disabled={isLoading}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            title="Refresh Preview"
          >
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            title={showPreview ? 'Hide Preview' : 'Show Preview'}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Hide' : 'Show'}
          </button>

          <button
            onClick={openInNewTab}
            disabled={!previewUrl}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            title="Open in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
            Open
          </button>
        </div>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Preview Errors</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-4">
        {!showPreview ? (
          <div className="text-center text-gray-500">
            <EyeOff className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <div className="text-lg font-semibold mb-2">Preview Hidden</div>
            <div className="text-sm">Click "Show" to enable live preview</div>
          </div>
        ) : !entryFile ? (
          <div className="text-center text-gray-500">
            <Play className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <div className="text-lg font-semibold mb-2">No Preview Available</div>
            <div className="text-sm">Create an HTML, JSX, or TSX file to see live preview</div>
            <div className="text-xs mt-2 text-gray-400">
              Supported: index.html, App.tsx, App.jsx, main.html
            </div>
          </div>
        ) : !previewUrl ? (
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-lg font-semibold mb-2">Generating Preview...</div>
            <div className="text-sm">Processing your code for live preview</div>
          </div>
        ) : (
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden mx-auto transition-all duration-300"
            style={getDeviceStyles()}
          >
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>Last refresh: {lastRefresh.toLocaleTimeString()}</span>
          {entryFile && <span>Entry: {entryFile.name}</span>}
          <span>Mode: {previewMode}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span>{files.length} files loaded</span>
          {autoRefresh && <span className="text-green-600">? Auto-refresh enabled</span>}
        </div>
      </div>
    </div>
  );
}
