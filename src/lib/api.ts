const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';

export interface KeyValidationResult {
  valid: boolean;
  error?: string;
}

export async function validateApiKey(apiKey: string): Promise<KeyValidationResult> {
  try {
    const response = await fetch(`${OPENROUTER_API_BASE}/auth/key`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return { valid: true };
    }

    // Try to parse error response
    let errorMessage = 'Invalid API key';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error?.message || errorData.error || errorMessage;
    } catch {
      // Response wasn't JSON, use default message
    }

    return { valid: false, error: errorMessage };
  } catch (err) {
    return { valid: false, error: 'Network error - please check your connection and try again' };
  }
}
