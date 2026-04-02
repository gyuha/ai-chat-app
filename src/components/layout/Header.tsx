// src/components/layout/Header.tsx
import { useChat } from '../../context/ChatContext';

const FREE_MODELS = [
  { id: 'google/gemma-3-4b-it:free', name: 'Gemma 3 4B (Free)' },
  { id: 'google/gemma-3-12b-it:free', name: 'Gemma 3 12B (Free)' },
];

export function Header() {
  const { state, setModel, showApiKeyModal } = useChat();
  const { selectedModel, apiKey } = state;

  return (
    <header className="h-14 px-4 flex items-center justify-between border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        {!apiKey && (
          <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
            API 키 필요
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => showApiKeyModal(true)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="API 키 설정"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>
        <select
          value={selectedModel}
          onChange={e => setModel(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {FREE_MODELS.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
