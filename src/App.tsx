// src/App.tsx
import { ChatProvider, useChat } from './context/ChatContext';
import { Sidebar } from './components/layout/Sidebar';
import { ChatArea } from './components/layout/ChatArea';
import { ApiKeyModal } from './components/modals/ApiKeyModal';

function AppContent() {
  const { state } = useChat();

  // D-03: Show API key modal when no key is set OR when modal is explicitly shown
  const showApiKeyModal = !state.apiKey || state.showApiKeyModal;

  return (
    <div className="flex h-screen bg-white text-gray-900">
      <Sidebar />
      <ChatArea />
      {showApiKeyModal && <ApiKeyModal />}
    </div>
  );
}

function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
}

export default App;
