import { screen } from '@testing-library/react'
import { wrap } from 'wrapito'

import { App } from 'app'

import { goToHome, goToLogin } from './helpers'

it('should render correctly the header', () => {
  wrap(App).atPath('/').mount()

  const header = screen.getByRole('banner')

  expect(header).toContainElement(screen.getByRole('img', { name: 'Home' }))
})

it('should go to the login page', async () => {
  wrap(App).atPath('/').mount()

  await goToLogin()

  expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
})

it('should go to the home page', async () => {
  wrap(App)
    .atPath('/')
    .withNetwork({
      path: '/home/',
      responseBody: [
        {
          id: 1,
          name: 'Expresso Hacendado',
        },
      ],
    })
    .debugRequests()
    .mount()

  await goToLogin()
  goToHome()

  expect(await screen.findByText('Expresso Hacendado')).toBeInTheDocument()
})
