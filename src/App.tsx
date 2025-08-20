import React, { useState, useCallback, useMemo } from 'react';
import { FileText, Upload, RotateCcw, Eye, Copy, Sun, Moon } from 'lucide-react';
import { DiffResult, compareLinesWithWords } from './utils/diffUtils';

function App() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const diffResult = useMemo(() => {
    if (!leftText && !rightText) return null;
    return compareLinesWithWords(leftText, rightText);
  }, [leftText, rightText]);

  const handleFileUpload = useCallback((side: 'left' | 'right') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.js,.ts,.jsx,.tsx,.html,.css,.json,.md,.py,.java,.cpp,.c,.xml,.yaml,.yml';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (side === 'left') {
            setLeftText(content);
          } else {
            setRightText(content);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  const handleClear = useCallback(() => {
    setLeftText('');
    setRightText('');
  }, []);

  const handleCopy = useCallback((side: 'left' | 'right') => {
    const text = side === 'left' ? leftText : rightText;
    navigator.clipboard.writeText(text);
  }, [leftText, rightText]);

  const renderDiffLines = (lines: any[], side: 'left' | 'right') => {
    return lines.map((line, index) => {
      let bgColor = '';
      let borderColor = '';
      
      if (line.type === 'added') {
        bgColor = side === 'right' ? (isDarkMode ? 'bg-green-900/30' : 'bg-green-50') : (isDarkMode ? 'bg-gray-800' : 'bg-gray-50');
        borderColor = side === 'right' ? (isDarkMode ? 'border-l-4 border-green-400' : 'border-l-4 border-green-500') : '';
      } else if (line.type === 'removed') {
        bgColor = side === 'left' ? (isDarkMode ? 'bg-green-900/30' : 'bg-green-50') : (isDarkMode ? 'bg-gray-800' : 'bg-gray-50');
        borderColor = side === 'left' ? (isDarkMode ? 'border-l-4 border-green-400' : 'border-l-4 border-green-500') : '';
      } else if (line.type === 'modified') {
        bgColor = isDarkMode ? 'bg-green-900/30' : 'bg-green-50';
        borderColor = isDarkMode ? 'border-l-4 border-green-400' : 'border-l-4 border-green-500';
      }

      const shouldShow = side === 'left' ? 
        (line.type !== 'added') : 
        (line.type !== 'removed');

      if (!shouldShow) return null;

      return (
        <div key={index} className={`flex ${bgColor} ${borderColor} min-h-[24px]`}>
          {showLineNumbers && (
            <div className={`flex-shrink-0 w-12 px-2 py-1 text-xs border-r select-none ${
              isDarkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100'
            }`}>
              {line.lineNumber || ''}
            </div>
          )}
          <div className={`flex-1 px-3 py-1 text-sm font-mono whitespace-pre-wrap break-words ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {line.content}
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b shadow-sm transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
              }`}>
                <FileText className={`w-6 h-6 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Dhwani Diff Checker</h1>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Is that same?</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 inline mr-1" />
                ) : (
                  <Moon className="w-4 h-4 inline mr-1" />
                )}
                {isDarkMode ? 'Light' : 'Dark'}
              </button>
              <button
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showLineNumbers
                    ? (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700')
                    : (isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                }`}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                Line Numbers
              </button>
              <button
                onClick={handleClear}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <RotateCcw className="w-4 h-4 inline mr-1" />
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Input Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className={`rounded-lg border transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between p-3 border-b transition-colors duration-200 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Text 1</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy('left')}
                  className={`p-1.5 rounded transition-colors ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleFileUpload('left')}
                  className={`p-1.5 rounded transition-colors ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Upload file"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              placeholder="Paste your first text here or upload a file..."
              className={`w-full h-64 p-3 font-mono text-sm border-none resize-none focus:outline-none focus:ring-2 focus:ring-inset rounded-b-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-green-500' 
                  : 'bg-white text-gray-900 placeholder-gray-400 focus:ring-green-500'
              }`}
            />
          </div>

          <div className={`rounded-lg border transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between p-3 border-b transition-colors duration-200 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Text 2</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy('right')}
                  className={`p-1.5 rounded transition-colors ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleFileUpload('right')}
                  className={`p-1.5 rounded transition-colors ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Upload file"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              placeholder="Paste your second text here or upload a file..."
              className={`w-full h-64 p-3 font-mono text-sm border-none resize-none focus:outline-none focus:ring-2 focus:ring-inset rounded-b-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-green-500' 
                  : 'bg-white text-gray-900 placeholder-gray-400 focus:ring-green-500'
              }`}
            />
          </div>
        </div>

        {/* Diff Results */}
        {diffResult && (
          <>
            {/* Visual Diff */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div className={`rounded-lg border overflow-hidden transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className={`px-4 py-2 border-b transition-colors duration-200 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <h3 className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Text 1</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {renderDiffLines(diffResult.leftLines, 'left')}
                </div>
              </div>

              <div className={`rounded-lg border overflow-hidden transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className={`px-4 py-2 border-b transition-colors duration-200 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <h3 className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Text 2</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {renderDiffLines(diffResult.rightLines, 'right')}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className={`rounded-lg border p-6 transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Difference Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className={`p-4 rounded-lg border transition-colors duration-200 ${
                  isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
                }`}>
                  <div className={`text-2xl font-bold ${
                    isDarkMode ? 'text-green-400' : 'text-green-700'
                  }`}>{diffResult.stats.added}</div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-green-300' : 'text-green-600'
                  }`}>Lines Added</div>
                </div>
                <div className={`p-4 rounded-lg border transition-colors duration-200 ${
                  isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
                }`}>
                  <div className={`text-2xl font-bold ${
                    isDarkMode ? 'text-green-400' : 'text-green-700'
                  }`}>{diffResult.stats.removed}</div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-green-300' : 'text-green-600'
                  }`}>Lines Removed</div>
                </div>
                <div className={`p-4 rounded-lg border transition-colors duration-200 ${
                  isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
                }`}>
                  <div className={`text-2xl font-bold ${
                    isDarkMode ? 'text-green-400' : 'text-green-700'
                  }`}>{diffResult.stats.modified}</div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-green-300' : 'text-green-600'
                  }`}>Lines Modified</div>
                </div>
              </div>

              <div className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p>
                  <span className="font-medium">Total changes:</span> {diffResult.stats.added + diffResult.stats.removed + diffResult.stats.modified} lines
                </p>
                <p className="mt-1">
                  <span className="font-medium">Similarity:</span> {diffResult.stats.similarity}% match
                </p>
              </div>
            </div>
          </>
        )}

        {/* Legend */}
        <div className={`mt-6 rounded-lg border p-4 transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h4 className={`font-medium mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Legend</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className={`w-4 h-4 border rounded mr-2 ${
                isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'
              }`}></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Added lines</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 border rounded mr-2 ${
                isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'
              }`}></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Removed lines</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 border rounded mr-2 ${
                isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'
              }`}></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Modified lines</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;