import type { Assertion, AsymmetricMatchersContaining } from 'vitest'

interface CustomMatchers<ReturnType = unknown> {
  toHaveBeenFetched(): ReturnType
  toHaveBeenFetchedTimes(times: number): ReturnType
  toHaveBeenFetchedWith(body: object): ReturnType
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
