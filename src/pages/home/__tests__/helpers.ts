import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const goToHome = () => {
  const user = userEvent.setup()
  return user.click(screen.getByRole('link', { name: 'Home' }))
}

const goToLogin = () => {
  const user = userEvent.setup()
  return user.click(screen.getByRole('link', { name: 'Login' }))
}

export { goToHome, goToLogin }
