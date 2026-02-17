import type { Category } from 'types'

export const CategoryMother = {
  create: (overrides?: Partial<Category>): Category => ({
    id: 1,
    slug: 'fruta-y-verdura',
    displayName: 'Fruta y verdura',
    ...overrides,
  }),
}
