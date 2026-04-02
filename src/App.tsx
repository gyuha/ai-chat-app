// src/App.tsx
import { ChatProvider } from './context/ChatContext';
import { Sidebar } from './components/layout/Sidebar';
import { ChatArea } from './components/layout/ChatArea';

function App() {
  return (
    <ChatProvider>
      <div className="flex h-screen bg-white text-gray-900">
        <Sidebar />
        <ChatArea />
      </div>
    </ChatProvider>
  );
}

export default App;
