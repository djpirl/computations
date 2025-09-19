import React, { useState } from 'react';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  loading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, loading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onGenerate(prompt.trim());
    }
  };

  const examples = [
    'Calculate 20% tax on price',
    'Format full name from first and last name',
    'Calculate age from birth date',
    'Convert temperature from Celsius to Fahrenheit',
    'Extract domain from email address'
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Describe Your Computation
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want the function to do..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={!prompt.trim() || loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Code'}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Examples:</h3>
        <div className="space-y-1">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
              disabled={loading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};