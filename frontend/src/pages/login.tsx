import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">AI Chat App</CardTitle>
            <CardDescription>로그인하여 시작하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  이메일
                </label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  비밀번호
                </label>
                <Input
                  type="password"
                  placeholder="•••••••••"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
              >
                로그인
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                계정이 없으신가요?{' '}
                <a href="#" className="text-primary hover:underline">
                  회원가입
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
