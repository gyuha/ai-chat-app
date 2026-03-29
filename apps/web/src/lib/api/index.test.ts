import { describe, expect, it } from 'vitest';

import { getApiBaseUrl } from './index';

describe('getApiBaseUrl', () => {
  it('returns internal API base url by default', () => {
    expect(getApiBaseUrl()).toBe('/api/v1');
  });
});
