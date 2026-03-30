import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock global fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Import after mocking
import { fetchFreeModels } from "../services/openrouter-api";

describe("fetchFreeModels", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should filter only free models (pricing.prompt === '0' && pricing.completion === '0')", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            id: "model-free-1",
            name: "Free Model 1",
            pricing: { prompt: "0", completion: "0" },
            context_length: 4096,
            description: "A free model",
          },
          {
            id: "model-paid-1",
            name: "Paid Model 1",
            pricing: { prompt: "0.001", completion: "0.002" },
            context_length: 8192,
            description: "A paid model",
          },
          {
            id: "model-free-2",
            name: "Another Free Model",
            pricing: { prompt: "0", completion: "0" },
            context_length: 2048,
          },
          {
            id: "model-partial-free",
            name: "Partial Free",
            pricing: { prompt: "0", completion: "0.001" },
            context_length: 4096,
          },
        ],
      }),
    });

    const result = await fetchFreeModels();

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("model-free-2"); // sorted by name: "Another Free Model" comes first
    expect(result[1].id).toBe("model-free-1");
    expect(result[0].name).toBe("Another Free Model");
    expect(result[1].name).toBe("Free Model 1");
    expect(result[1].contextLength).toBe(4096);
    expect(result[1].description).toBe("A free model");
  });

  it("should throw an error when API response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(fetchFreeModels()).rejects.toThrow(
      "모델 목록을 불러올 수 없습니다",
    );
  });

  it("should sort models by name in ascending order", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            id: "z-model",
            name: "Z Model",
            pricing: { prompt: "0", completion: "0" },
          },
          {
            id: "a-model",
            name: "A Model",
            pricing: { prompt: "0", completion: "0" },
          },
        ],
      }),
    });

    const result = await fetchFreeModels();

    expect(result[0].name).toBe("A Model");
    expect(result[1].name).toBe("Z Model");
  });

  it("should use id as name fallback when name is missing", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            id: "no-name-model",
            pricing: { prompt: "0", completion: "0" },
          },
        ],
      }),
    });

    const result = await fetchFreeModels();

    expect(result[0].name).toBe("no-name-model");
  });
});
