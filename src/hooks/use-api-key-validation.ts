import { useMutation } from '@tanstack/react-query';

import {
  type OpenRouterModel,
  type ValidationErrorKind,
  validateOpenRouterApiKey,
} from '@/lib/openrouter-client';

export type ApiKeyValidationResult = {
  kind: 'success';
  models: OpenRouterModel[];
};

export type ApiKeyValidationFailure = {
  kind: ValidationErrorKind;
  models: [];
};

export type ApiKeyValidationState =
  | ApiKeyValidationFailure
  | ApiKeyValidationResult;

export function useApiKeyValidation() {
  return useMutation({
    mutationFn: async (apiKey: string): Promise<ApiKeyValidationState> => {
      try {
        const result = await validateOpenRouterApiKey(apiKey);

        return {
          kind: 'success',
          models: result.models,
        };
      } catch (error) {
        let kind: ValidationErrorKind = 'transient';

        if (error instanceof Error && 'kind' in error) {
          kind =
            error.kind === 'invalid_credentials'
              ? 'invalid_credentials'
              : 'transient';
        }

        return {
          kind,
          models: [],
        };
      }
    },
  });
}
