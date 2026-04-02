// src/components/modals/ApiKeyModal.tsx
import { useState, FormEvent } from 'react';
import { useChat } from '../../context/ChatContext';
import { validateApiKey } from '../../lib/api';

export function ApiKeyModal() {
  const { state, dispatch, setApiKey } = useChat();
  const { isValidating, error } = state;
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedKey = inputValue.trim();

    if (!trimmedKey) {
      dispatch({ type: 'SET_API_KEY_ERROR', payload: 'Please enter an API key' });
      return;
    }

    dispatch({ type: 'SET_API_KEY_VALIDATING', payload: true });
    dispatch({ type: 'SET_API_KEY_ERROR', payload: '' });

    const result = await validateApiKey(trimmedKey);

    if (result.valid) {
      setApiKey(trimmedKey);
    } else {
      dispatch({ type: 'SET_API_KEY_ERROR', payload: result.error || 'Invalid API key' });
    }
  };

  return (
    // D-03: Modal overlay - blocks main UI until valid API key entered (no backdrop close)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter Your API Key</h2>
        <p className="text-sm text-gray-600 mb-4">
          To use this chat app, you need an OpenRouter API key. Get one for free at{' '}
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            openrouter.ai/keys
          </a>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="sk-or-..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              disabled={isValidating}
            />
            {/* D-04: Error message when API key is invalid */}
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isValidating}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              isValidating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isValidating ? 'Validating...' : 'Connect'}
          </button>
        </form>
      </div>
    </div>
  );
}
