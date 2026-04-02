// src/components/layout/Header.tsx
import { useChat } from '../../context/ChatContext';

const FREE_MODELS = [
  { id: 'openrouter/free-models', name: 'Free Models' },
];

export function Header() {
  const { state, setModel } = useChat();
  const { selectedModel } = state;

  return (
    <header className="h-14 px-4 flex items-center justify-end border-b border-gray-200 bg-white">
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
    </header>
  );
}
