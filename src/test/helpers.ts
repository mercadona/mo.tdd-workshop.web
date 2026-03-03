import { screen } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'

export const clickCategory = async (user: UserEvent, name: string) => {
  const link = await screen.findByRole('link', { name })
  await user.click(link)
}
