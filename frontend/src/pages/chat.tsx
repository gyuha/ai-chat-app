import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export default function ChatPage() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-secondary border-r">
        <div className="p-4">
          <Button variant="outline" className="w-full justify-start">
            + 새 채팅
          </Button>
        </div>
        <div className="p-4">
          <div className="text-sm text-muted-foreground mb-2">채팅 목록</div>
          <div className="space-y-1">
            <Card className="p-2 bg-tertiary border-0 text-sm cursor-pointer">
              AI 채팅 앱 개발 질문
            </Card>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Card className="max-w-[80%] p-3 bg-primary text-primary-foreground border-0">
                안녕하세요! OpenRouter API를 사용하여 AI 채팅 앱을 개발 중입니다.
              </Card>
            </div>
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-3 bg-secondary border">
                반갑습니다! AI 채팅 앱 개발을 도와드리겠습니다. 어떤 부분부터 시작하고 싶으신가요?
              </Card>
            </div>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              type="text"
              className="flex-1"
              placeholder="메시지를 입력하세요..."
            />
            <Button>
              전송
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
