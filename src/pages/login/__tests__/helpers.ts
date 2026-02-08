import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export const clickLogin = () => {
  const user = userEvent.setup()
  return user.click(screen.getByRole('button', { name: 'Login' }))
}
