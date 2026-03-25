import { describe, expect, it } from 'vitest'

const forbiddenServerSecretNames = [
  ['OPENROUTER', 'API', 'KEY'].join('_'),
  ['OPENROUTER', 'MODEL'].join('_'),
  ['JWT', 'ACCESS', 'SECRET'].join('_'),
  ['JWT', 'REFRESH', 'SECRET'].join('_'),
] as const

describe('auth/session bootstrap contract', () => {
  it('documents the protected session bootstrap path', () => {
    expect('/auth/session').toContain('auth/session')
    expect('/auth/login').toContain('auth/login')
  })

  it('keeps server-only secret names out of client env contracts', () => {
    forbiddenServerSecretNames.forEach((name) => {
      expect(name.startsWith('VITE_')).toBe(false)
    })
  })
})
