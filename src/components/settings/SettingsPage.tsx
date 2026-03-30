import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApiKeyInput } from "./ApiKeyInput";
import { ModelSelector } from "./ModelSelector";
import { SystemPromptInput } from "./SystemPromptInput";

export function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col overflow-auto px-4 py-8 md:px-6 xl:py-10">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-base font-semibold leading-tight">설정</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">OpenRouter API 키</CardTitle>
          </CardHeader>
          <CardContent>
            <ApiKeyInput />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">기본 모델</CardTitle>
          </CardHeader>
          <CardContent>
            <ModelSelector />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">시스템 프롬프트</CardTitle>
          </CardHeader>
          <CardContent>
            <SystemPromptInput />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
