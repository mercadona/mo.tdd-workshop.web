import { screen } from '@testing-library/react'
import { wrap } from 'wrapito'

import { App } from 'app'

import { clickLogin } from './helpers'

it('should render correctly the login page', () => {
  wrap(App).atPath('/login').mount()

  const loginTitle = screen.getByRole('button', { name: 'Login' })

  expect(loginTitle).toBeInTheDocument()
})

it('should login user', async () => {
  wrap(App)
    .atPath('/login')
    .withNetwork([
      {
        path: '/user/123',
        responseBody: {
          username: 'pepe',
        },
      },
    ])
    .mount()

  const loginButton = screen.getByRole('button', { name: 'Login' })

  expect(loginButton).toBeInTheDocument()

  await clickLogin()

  expect('/api/user/123').toHaveBeenFetched()
})
