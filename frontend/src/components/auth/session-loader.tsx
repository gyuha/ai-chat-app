import { Spinner } from "@/components/ui/spinner";

type SessionLoaderProps = {
  message?: string;
};

export function SessionLoader({
  message = "세션을 확인하고 있습니다.",
}: SessionLoaderProps) {
  return (
    <section className="session-loader-shell">
      <div className="session-loader">
        <Spinner label="세션 확인 중" />
        <p className="auth-copy">{message}</p>
      </div>
    </section>
  );
}
