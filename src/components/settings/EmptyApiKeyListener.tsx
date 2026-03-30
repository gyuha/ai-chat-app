import { Key } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function EmptyApiKeyListener() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <Key className="h-12 w-12 text-muted-foreground" />
      <h2 className="text-lg font-semibold text-foreground">API 키가 필요합니다</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        OpenRouter API 키를 등록해야 채팅을 시작할 수 있습니다.
      </p>
      <Button asChild>
        <Link to="/settings">API 키 등록하러 가기</Link>
      </Button>
    </div>
  );
}
