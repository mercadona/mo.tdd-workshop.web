# mo.boilerplate.react-vite

## Create a new repo with the Boilerplate content

Follow the following link and fill the form with the name of your new project

https://github.com/mercadona/mo.boilerplate.react-vite/generate

## Setup your local environment

Create a `.env.local` file under `config/env/` directory. You can take this as an starting point:

```dotenv
VITE_APP_WEBSITE_NAME='LOCAL | Boilerplate'
VITE_APP_ENV='LOCAL'
VITE_APP_VERSION=vLocal

# API
VITE_API_HOST='//boilerplate.sta.monline/api'

# Elastic APM
VITE_ELASTIC_APM_HOST=//apm-elasticsearch.sta.monline

# Kibana
VITE_KIBANA_HOST=https://logstash-http-input.sta.monline
```

### Troubleshooting

#### Network overlap

Run the following script and follow the instructions printed in the console to remove network collisions

https://github.com/mercadona/mo.tools.devtools/blob/master/docker_network_overlap.sh

## Running locally

### Install

You need `node` and `npm` installed in your system. Please, use [nvm](https://github.com/nvm-sh/nvm) or [asdf](https://asdf-vm.com/) to install the proper Node version.

Install the project dependencies:

```bash
npm install
```

### Start local server

Runs the app in development mode:

```bash
npm start
```

### Run the unit test

Runs the test watcher in an interactive mode:

```bash
npm test
```

Take a look at the available commands under `npm test`

# Dependency Management

This project uses [Dependabot](https://docs.github.com/en/code-security/dependabot) to keep its dependencies up to date.

Dependabot is configured to group dependency updates into separate pull requests based on the following categories:

- **React**: Includes `react`, `react-dom`, and related `@types` packages.
- **Vite**: Includes `vite` and `@vitejs/*` packages.
- **ESLint**: Includes `eslint` and ESLint-related plugins.
- **Testing**: Includes `@testing-library/*`, `vitest`, and `jsdom`.

This grouping strategy helps to streamline the process of reviewing and merging dependency updates.

# CI/CD

This project uses [GitHub Actions](https://github.com/mercadona/github-actions) for CI/CD.

## Pull Request Workflow

On every pull request to `master`, the following checks are performed:

- **Linting**: Checks the code for style errors.
- **Typecheck**: Checks the code for type errors.
- **Unit tests**: Runs the unit tests.

You can see the status of these checks on the pull request page.

## Release Workflow

On every push to `master`, a new release is created and deployed to the stable environment.

This workflow uses the `mercadona/github-actions/.github/workflows/create-frontend-release.yml` reusable workflow. This workflow performs the following steps:

1.  **Calculates the next version:** It calculates the next version number based on the number of commits in the repository. It also generates a Docker image tag that includes the version number, the git hash, and the current date.
2.  **Builds the application for staging:** It installs the dependencies and builds the application for the staging environment.
3.  **Builds and pushes a Docker image for staging:** It builds a Docker image with the staging version of the application and pushes it to the container registry.
4.  **Publishes the release in the staging metadata:** It sends a request to the metadata service to register the new release in the staging environment.
5.  **Builds the application for production:** It builds the application for the production environment.
6.  **Builds and pushes a Docker image for production:** It builds a Docker image with the production version of the application and pushes it to the container registry.
7.  **Publishes the release in the production metadata:** It sends a request to the metadata service to register the new release in the production environment.
8.  **Publishes the release in GitHub:** It creates a new release in GitHub with the calculated version number and generates the release notes automatically.

# Deployment

The deployment of this application is done through the manifests located in the [mercadona.online.gke](https://github.com/mercadona/mercadona.online.gke) repository.

It is important that the Docker image used for the deployment comes from the `prod-mercadona` Google Cloud project.

The image name in the manifest must match the `application_name` parameter in the `create-release.yml` reusable workflow. The image tag is a template variable that is replaced by the latest tag during the deployment process. Here is an example of how the image should be referenced in the manifest:

```yaml
image: eu.gcr.io/prod-mercadona/mo-boilerplate-react-vite:${parameters["image_tag"]}
```

# Routing Setup (`createBrowserRouter`)

The project has been migrated from `BrowserRouter` to **`createBrowserRouter`** (React Router v7+).

This migration improves **readability**, **maintainability**, and **testability**, while unlocking modern React Router features like **data loading**, **actions**, and **error boundaries**.

---

## Overview

- Routes are now defined using a **configuration object** instead of JSX children.
- The router instance is created via `createBrowserRouter()` and provided using `<RouterProvider>`.
- A new `RootLayout` has been introduced for global layout and provider management.
- Feature Flags (FFs) can be handled either via a reusable `FeatureFlagRoute` component or inline logic with `useMemo`.

---

## Example: Base Router Setup

```tsx
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'

import { Home } from '../home'
import { Login } from '../login'
import { NotFound } from '../not-found'
import { PATHS } from '../paths'
import { RootLayout } from './components/RootLayout'

const routesConfig: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { index: true, path: PATHS.HOME, element: <Home /> },
      { path: PATHS.LOGIN, element: <Login /> },
      { path: PATHS.NOT_FOUND, element: <NotFound /> },
    ],
  },
]

const router = createBrowserRouter(routesConfig)

export const Routes = () => {
  return <RouterProvider router={router} />
}
```

## RootLayout

A **`RootLayout`** has been added as the app’s root layout.
This is where we can add **global providers, contexts, toasts, etc.** that should apply to **all views** in the app.

```tsx
export const RootLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
```

### Feature Flags in Routes

When integrating **feature flags (FFs)** in the routing layer, there are two valid approaches depending on where the conditional rendering logic should live.

---

#### ✅ Option 1 — Dedicated `FeatureFlagRoute` component

This approach keeps the router creation **outside** the React component (the recommended pattern) and delegates the feature flag logic to a dedicated wrapper component.

```tsx
type FeatureFlagRouteProps = {
  flag: FeatureFlag
  element: ReactNode
  fallback: ReactNode
}

export const FeatureFlagRoute = ({
  flag,
  element,
  fallback,
}: FeatureFlagRouteProps) => {
  const isForbidden = useFlag(flag)
  return <>{isForbidden ? fallback : element}</>
}
```

Usage Example:

```tsx
const routesConfig: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        path: PATHS.HOME,
        element: <Home />,
      },
      {
        path: PATHS.LOGIN,
        element: (
          <FeatureFlagRoute
            element={<Login />}
            fallback={<LoginLegacy />}
            flag="NEW_DASHBOARD"
          />
        ),
      },
      {
        path: PATHS.NOT_FOUND,
        element: <NotFound />,
      },
    ],
  },
]

const router = createBrowserRouter(routesConfig)

export const Routes = () => {
  return <RouterProvider router={router} />
}
```

**Pros:**

- Keeps createBrowserRouter() defined once at the module level (best practice).
- Keeps FF logic encapsulated and reusable across routes.

**Cons:**

- Slightly more boilerplate if many routes depend on flags.

#### ⚙️ Option 2 — Handle FF logic internally before creating the router

This approach defines createBrowserRouter() inside the Routes component using useMemo, so that the router reads the current flag state at render time.

```tsx
export const Routes = () => {
  const isFFNewLoginEnabled = useFlag('FF_NEW_LOGIN_ENABLED')

  const router = useMemo(() => {
    const routesConfig: RouteObject[] = [
      {
        element: <RootLayout />,
        children: [
          {
            index: true,
            path: PATHS.HOME,
            element: <Home />,
          },
          {
            path: PATHS.LOGIN,
            element: isFFNewLoginEnabled ? <Login /> : <LoginLegacy />,
          },
          {
            path: PATHS.NOT_FOUND,
            element: <NotFound />,
          },
        ],
      },
    ]

    return createBrowserRouter(routesConfig)
  }, [isFFNewLoginEnabled])

  return <RouterProvider router={router} />
}
```

---

### When `createBrowserRouter()` is executed outside the component

If your project uses **Wrapito** for testing, you’ll need to adjust its configuration when `createBrowserRouter()` is executed **outside** the React component (on module import).

When the router is created at module scope, it becomes bound to the **current `window.history` state** at that exact moment.
During tests, Wrapito modifies `window.history` before mounting the app (via `replaceState`), but React Router does **not** detect this change because no `popstate` event is emitted.

As a result, tests that rely on `atPath(...)` or simulated navigations may fail.

---

✅ **Fix:**
Trigger a `popstate` event after updating the URL so React Router can detect the navigation:

```ts
changeRoute: (path: string) => {
  window.history.replaceState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }))
},
```

### Why this happens

- `createBrowserRouter()` reads the current location/session history when it’s created.
- `window.history.replaceState()` updates the URL but **does not** trigger a `popstate` event.
- React Router listens for navigation changes only through its internal history observer or `popstate` events.
- If the router instance was created **before** `replaceState()` runs, it won’t automatically re-sync with the new state.

By manually dispatching the `popstate` event, the router correctly picks up the simulated navigation during tests.

---

💡 **Note:**
This behavior is only relevant when the router is instantiated **outside** the component.
If the router is created **inside** the `Routes` component (e.g., via `useMemo`), it reads the latest history state automatically and does **not** require this workaround.
