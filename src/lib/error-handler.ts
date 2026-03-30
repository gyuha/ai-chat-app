import { toast } from "sonner";

export function handleApiError(error: unknown) {
  const err = error as Error & { status?: number };

  if (err.status === 429) {
    toast.error("요청이 너무 많습니다", {
      description: "잠시 후 다시 시도해주세요.",
    });
  } else if (err.status === 401) {
    toast.error("API 키가 유효하지 않습니다", {
      description: "설정에서 API 키를 확인해주세요.",
    });
  } else {
    toast.error("오류가 발생했습니다", {
      description:
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
    });
  }
}
