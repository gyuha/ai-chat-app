import { useState, useEffect } from 'react';
import { Button } from '../ui/button';

interface ChatSettingsProps {
  chatId?: string;
  systemPrompt?: string | null;
  onUpdate: (systemPrompt: string) => Promise<void>;
}

export function ChatSettings({ chatId, systemPrompt: initialSystemPrompt, onUpdate }: ChatSettingsProps) {
  const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSystemPrompt(initialSystemPrompt || '');
  }, [initialSystemPrompt]);

  const handleSave = async () => {
    if (!chatId) return;

    setIsSaving(true);
    try {
      await onUpdate(systemPrompt);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update system prompt:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSystemPrompt(initialSystemPrompt || '');
    setIsEditing(false);
  };

  if (!chatId) return null;

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        System Prompt {isEditing ? '▼' : '▶'}
      </button>

      {isEditing && (
        <div className="p-4 space-y-2">
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="이 대화에 사용할 시스템 프롬프트를 설정하세요..."
            rows={4}
            maxLength={2000}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {systemPrompt.length}/2000
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
