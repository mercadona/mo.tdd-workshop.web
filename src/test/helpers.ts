import { screen } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'

export const clickCategory = async (user: UserEvent, name: string) => {
  const link = screen.getByRole('link', { name })
  await user.click(link)
}

export const toggleViewMode = async (user: UserEvent) => {
  const toggle = screen.getByRole('switch')
  await user.click(toggle)
}

export const clickProduct = async (user: UserEvent, name: string) => {
  const productCard = await screen.findByRole('article', { name })
  await user.click(productCard)
}
