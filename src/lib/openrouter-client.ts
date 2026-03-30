const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models';
const OPENROUTER_TITLE = 'OpenRouter Chat';

type OpenRouterPricing = {
  completion?: string;
  prompt?: string;
};

export type OpenRouterModel = {
  id: string;
  name?: string;
  pricing?: OpenRouterPricing;
};

type OpenRouterModelsResponse = {
  data?: OpenRouterModel[];
};

export type ValidationErrorKind = 'invalid_credentials' | 'transient';

export class OpenRouterValidationError extends Error {
  kind: ValidationErrorKind;

  constructor(kind: ValidationErrorKind, message: string) {
    super(message);
    this.kind = kind;
    this.name = 'OpenRouterValidationError';
  }
}

function getOpenRouterHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-OpenRouter-Title': OPENROUTER_TITLE,
  };
}

function isFreeModel(model: OpenRouterModel) {
  return (
    model.pricing?.prompt === '0' && model.pricing?.completion === '0'
  );
}

export function filterFreeModels(models: OpenRouterModel[]) {
  return models.filter(isFreeModel);
}

function toValidationError(error: unknown): OpenRouterValidationError {
  if (error instanceof OpenRouterValidationError) {
    return error;
  }

  return new OpenRouterValidationError(
    'transient',
    '일시적인 문제로 모델 목록을 확인하지 못했습니다.',
  );
}

export async function fetchOpenRouterModels(apiKey: string) {
  let response: Response;

  try {
    response = await fetch(OPENROUTER_MODELS_URL, {
      headers: getOpenRouterHeaders(apiKey),
      method: 'GET',
    });
  } catch {
    throw new OpenRouterValidationError(
      'transient',
      '일시적인 문제로 모델 목록을 확인하지 못했습니다.',
    );
  }

  if (response.status === 401 || response.status === 403) {
    throw new OpenRouterValidationError(
      'invalid_credentials',
      '입력한 키로 모델 목록을 불러오지 못했습니다.',
    );
  }

  if (!response.ok) {
    throw new OpenRouterValidationError(
      'transient',
      '일시적인 문제로 모델 목록을 확인하지 못했습니다.',
    );
  }

  const payload = (await response.json()) as OpenRouterModelsResponse;

  if (!Array.isArray(payload.data) || payload.data.length === 0) {
    throw new OpenRouterValidationError(
      'invalid_credentials',
      '입력한 키로 모델 목록을 불러오지 못했습니다.',
    );
  }

  return payload.data;
}

export async function fetchFreeOpenRouterModels(apiKey: string) {
  const models = await fetchOpenRouterModels(apiKey);

  return filterFreeModels(models);
}

export async function validateOpenRouterApiKey(apiKey: string) {
  try {
    const models = await fetchFreeOpenRouterModels(apiKey);

    return {
      models,
    };
  } catch (error) {
    throw toValidationError(error);
  }
}
