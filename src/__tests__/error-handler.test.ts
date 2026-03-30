import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

import { toast } from "sonner";
import { handleApiError } from "../lib/error-handler";

describe("handleApiError", () => {
  beforeEach(() => {
    vi.mocked(toast.error).mockClear();
  });

  it("should show rate limit toast for 429 status", () => {
    const error = new Error("Rate limited") as Error & { status?: number };
    error.status = 429;

    handleApiError(error);

    expect(toast.error).toHaveBeenCalledWith("요청이 너무 많습니다", {
      description: "잠시 후 다시 시도해주세요.",
    });
  });

  it("should show API key invalid toast for 401 status", () => {
    const error = new Error("Unauthorized") as Error & { status?: number };
    error.status = 401;

    handleApiError(error);

    expect(toast.error).toHaveBeenCalledWith("API 키가 유효하지 않습니다", {
      description: "설정에서 API 키를 확인해주세요.",
    });
  });

  it("should show generic error toast for other errors", () => {
    const error = new Error("네트워크 오류가 발생했습니다") as Error & {
      status?: number;
    };

    handleApiError(error);

    expect(toast.error).toHaveBeenCalledWith("오류가 발생했습니다", {
      description: "네트워크 오류가 발생했습니다",
    });
  });

  it("should handle non-Error objects", () => {
    handleApiError("some string error");

    expect(toast.error).toHaveBeenCalledWith("오류가 발생했습니다", {
      description: "알 수 없는 오류가 발생했습니다.",
    });
  });
});
