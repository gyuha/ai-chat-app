import { useEffect, useState } from 'react';
import { useNavigate } from '@/lib/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { useChatStore } from '@/stores/chat';
import { useChatListStore } from '@/stores/chatList';
import { useAuthStore } from '@/stores/auth';
import { chatApi } from '@/lib/api/chat';
import type { ChatMessage } from '@/lib/api/chat';

export default function ChatPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { currentChatId, messages, addMessage, setMessages, isLoading, setLoading, setError, clearError, setCurrentChat } = useChatStore();
  const { chats, setChats, updateChat } = useChatListStore();
  const [inputValue, setInputValue] = useState('');

  // 인증 확인
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 채팅 목록 조회
  const { data: chatsData } = useQuery({
    queryKey: ['chats'],
    queryFn: chatApi.getChats,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (chatsData) {
      setChats(chatsData);
    }
  }, [chatsData, setChats]);

  // 채팅 상세 조회
  const { data: chatDetail } = useQuery({
    queryKey: ['chat', currentChatId],
    queryFn: () => chatApi.getChat(currentChatId!),
    enabled: !!currentChatId && isAuthenticated,
  });

  useEffect(() => {
    if (chatDetail) {
      setMessages(chatDetail.messages);
    }
  }, [chatDetail, setMessages]);

  // 메시지 전송
  const sendMessageMutation = useMutation({
    mutationFn: chatApi.sendMessage,
    onSuccess: (data) => {
      addMessage(data.message);
      updateChat(data.chatId, { updatedAt: new Date().toISOString() });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error) => {
      setError('메시지 전송에 실패했습니다.');
      console.error('Send message error:', error);
    },
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    clearError();

    // 사용자 메시지 즉시 추가
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMessage);

    setLoading(true);
    try {
      await sendMessageMutation.mutateAsync({ message });
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChat(null);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChat(chatId);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-secondary border-r">
        <div className="p-4">
          <Button variant="outline" className="w-full justify-start" onClick={handleNewChat}>
            + 새 채팅
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4">
            <div className="text-sm text-muted-foreground mb-2">채팅 목록</div>
            <div className="space-y-1">
              {chats.map((chat) => (
                <Card
                  key={chat.id}
                  className={`p-2 text-sm cursor-pointer ${
                    currentChatId === chat.id ? 'bg-tertiary border-0' : 'hover:bg-tertiary/50'
                  }`}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <div className="font-medium truncate">{chat.title}</div>
                  <div className="text-xs text-muted-foreground">{chat.messageCount}개의 메시지</div>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p className="text-lg mb-2">새로운 대화를 시작하세요</p>
                <p className="text-sm">AI에게 어떤 질문이든 물어보세요.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <Card
                    className={`max-w-[80%] p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground border-0'
                        : 'bg-secondary border'
                    }`}
                  >
                    {message.content}
                  </Card>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <Card className="max-w-[80%] p-3 bg-secondary border">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                  </div>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                type="text"
                className="flex-1"
                placeholder="메시지를 입력하세요..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                전송
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
