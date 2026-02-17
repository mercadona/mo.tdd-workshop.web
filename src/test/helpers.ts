import { screen } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'

export const clickCategory = async (user: UserEvent, name: string) => {
  const link = screen.getByRole('link', { name })
  await user.click(link)
}
