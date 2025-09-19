import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeDisplayProps {
  code: string;
  functionName: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, functionName }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Generated Code</h2>
        <p className="text-sm text-gray-600 mt-1">Function: {functionName}</p>
      </div>
      
      <div className="p-6">
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <Editor
            height="300px"
            language="typescript"
            value={code}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible'
              }
            }}
            theme="vs"
          />
        </div>
        
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Copy Code
          </button>
          <button
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Save Function
          </button>
        </div>
      </div>
    </div>
  );
};