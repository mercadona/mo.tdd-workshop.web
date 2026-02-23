# TDD Workshop — React

Un workshop práctico para aprender Test-Driven Development construyendo una mini-app de Mercadona paso a paso.

---

## ¿Qué vas a hacer?

Partirás de una aplicación con una sola página ("Hello World") e irás añadiendo funcionalidad iteración a iteración, siempre siguiendo el ciclo **Rojo → Verde → Refactor**:

1. Escribe un test que falla (**rojo**)
2. Implementa el mínimo código para que pase (**verde**)
3. Limpia sin romper nada (**refactor**)

Los tests están escritos de antemano como `it.todo()`. Tu trabajo es implementarlos uno a uno.

---

## Setup

### Opción A — CodeSandbox (sin instalar nada)

Abre el proyecto en CodeSandbox y empieza directamente.

### Opción B — Local

Requisitos: Node.js 20+ y npm 10+

```bash
git clone <repo-url>
cd mo.tdd-workshop.web
npm install
npm test       # los tests en watch mode
npm start      # la app en localhost:5173
```

---

## Cómo trabajar

Abre `src/pages/home/__tests__/Home.test.tsx` y `src/pages/category-detail/__tests__/CategoryDetail.test.tsx`. Verás algo así:

```ts
it.todo('should render the list of categories in the navigation')
it.todo('should display the products with their prices correctly formatted')
// ...
```

Cada `it.todo` es una iteración. Para implementarlo:

1. Cambia `it.todo('...')` por `it('...', async () => { ... })` y escribe el test
2. Ejecuta los tests — debe fallar en rojo
3. Implementa el código mínimo para que pase
4. Refactoriza si hay algo que limpiar

---

## Las 5 iteraciones

### Iteración 1 — Listado de categorías

Fetch de categorías desde la API y renderizado en la navegación.

**Se proporciona:** handler MSW para `GET /categories` ya configurado en `src/mocks/handlers.ts`.

```
✓ should render the list of categories in the navigation
```

### Iteración 2 — Listado de productos

Productos en la home con precios formateados en euros.

**Se proporciona:** `ProductCard` como componente estático en `src/components/product-card/` — solo hay que dinamizarlo para que acepte props.

```
✓ should display the products with their prices correctly formatted
```

### Iteración 3 — Navegación y routing

Navegación entre categorías con React Router. Manejo de rutas no encontradas.

**Se proporciona:** estructura de rutas con `RootLayout` y `AppRoutes` en `src/pages/routes/`, y la página `CategoryDetail` vacía en `src/pages/category-detail/`.

```
✓ should navigate to the category page and display the category title
✓ should display a not found message when the category does not exist
✓ should highlight the active category in the navigation
✓ should navigate to home when clicking the logo
```

### Iteración 4 — Toggle card/list view

Estado global con Context API para alternar entre vista tarjeta y vista lista.

**Se proporciona:** componente `Toggle` listo para usar en `src/components/toggle/`.

```
✓ should not display product descriptions and nutriscore in card view
✓ should display product descriptions and nutriscore when switching to list view
✓ should hide product descriptions and nutriscore when switching back to card view
```

### Iteración 5 — Modal de producto

Dialog nativo del navegador para mostrar el detalle de un producto.

**Se proporciona:** `ProductDetail` como componente estático en `src/components/product-detail/` — igual que con `ProductCard` en la iteración 2, solo hay que dinamizarlo.

```
✓ should open a dialog with product details when clicking a product
✓ should close the dialog when clicking close button
✓ should open a dialog with product details when clicking a product from category
✓ should close the dialog when clicking close button from category
```

---

## Stack

- React 19 + TypeScript
- Vitest + React Testing Library
- MSW (Mock Service Worker) para mockear la API
- React Router
- CSS con metodología BEM

---

## Comandos

```bash
npm test          # tests en watch mode
npm run typecheck # comprobación de tipos
npm start         # servidor de desarrollo
npm run build     # build de producción
```