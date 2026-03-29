import type { ModelOption } from '@repo/contracts';

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

const request = async <T>(path: string): Promise<T> => {
  const response = await fetch(path, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${path}`);
  }

  return response.json() as Promise<T>;
};

export const fetchHealth = () => request<HealthResponse>('/api/v1/health');
export const fetchModels = () => request<ModelOption[]>('/api/v1/models');

export const getApiBaseUrl = (input?: string) => input ?? '/api/v1';
