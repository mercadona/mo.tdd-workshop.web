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
git clone git@github.com:mercadona/mo.tdd-workshop.web.git
cd mo.tdd-workshop.web
npm install
npm test       # los tests en watch mode
npm start      # la app en localhost:5173
```

---

## Cómo trabajar

Abre `src/pages/home/__tests__/Home.test.tsx` y `src/pages/category-detail/__tests__/CategoryDetail.test.tsx`. Verás los tests agrupados por iteración:

```ts
describe('Iteración 1 - Listado de categorías', () => {
  it.todo('should render the list of categories in the navigation')
})

describe('Iteración 2 - Listado de productos', () => {
  it.todo('should display the products with their prices correctly formatted')
})
// ...
```

Para implementar un test:

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

<details>
<summary>¿Necesitas más ayuda?</summary>

El HTML esperado en la navegación:

```html
<ul class="navigation__list">
  <li class="navigation__list-item">Fruta y verdura</li>
  <li class="navigation__list-item">Cereales</li>
  <li class="navigation__list-item">Aperitivos</li>
</ul>
```

</details>

---

### Iteración 2 — Listado de productos

Productos en la home con precios formateados en euros.

**Se proporciona:** `ProductCard` como componente estático en `src/components/product-card/` — solo hay que dinamizarlo para que acepte props. En `src/mocks/` tienes `products-fixtures.json` con los datos que usará tu handler.

En card view **no** deben aparecer la descripción del producto.

```
✓ should display the products with their prices correctly formatted
```

<details>
<summary>¿Necesitas más ayuda?</summary>

Para formatear el precio en euros con `Intl`:

```ts
new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
}).format(price)
```

</details>

---

### Iteración 3 — Navegación y routing

Navegación entre categorías con React Router.

**Se proporciona:** estructura de rutas con `RootLayout` y `AppRoutes` en `src/pages/routes/`, y la página `CategoryDetail` vacía en `src/pages/category-detail/`.

```
✓ should navigate to the category page and display the category title
✓ should show the category products
✓ should navigate to home when clicking the logo [OPTIONAL]
✓ should highlight the active category in the navigation [OPTIONAL]
✓ should display a not found message when the category does not exist [OPTIONAL]
```

<details>
<summary>¿Necesitas más ayuda?</summary>

Para enlazar a una categoría desde la navegación:

```tsx
// Opción simple
to={`/categories/${category.slug}`}

// Opción con generatePath (más robusta)
to={generatePath(PATHS.CATEGORY_DETAIL, { slug: category.slug })}
```

Para que el link activo tenga estilos, usa `NavLink` con `classNames`:

```tsx
<NavLink
  to={`/categories/${category.slug}`}
  className={({ isActive }) =>
    classNames('navigation__link', {
      'navigation__link--active': isActive,
    })
  }
>
  {category.displayName}
</NavLink>
```

Para navegar directamente a una URL en un test sin pasar por la home:

```ts
window.history.pushState({}, '', '/categories/fruta-y-verdura')
render(<App />)
```

Para manejar el `404` correctamente, comprueba `response.ok` antes de parsear el body:

```ts
const response = await fetch(`/categories/${slug}`)
if (!response.ok) // manejar error
const data = await response.json()
```

</details>

---

### Iteración 4 — Toggle card/list view

Estado global con Context API para alternar entre vista tarjeta y vista lista.

**Se proporciona:** componente `Toggle` listo para usar en `src/components/toggle/`.

En list view deben aparecer las descripciones de los productos. En card view no.

```
✓ should display product descriptions when switching to list view
✓ should hide product descriptions when switching back to card view
```

<details>
<summary>¿Necesitas más ayuda?</summary>

El `ViewModeProvider` que necesitas crear:

```tsx
type ViewMode = 'card' | 'list'

interface ViewModeContextType {
  viewMode: ViewMode
  toggleViewMode: () => void
}

const ViewModeContext = createContext<ViewModeContextType | null>(null)

export const ViewModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const toggleViewMode = () =>
    setViewMode((prev) => (prev === 'card' ? 'list' : 'card'))

  return (
    <ViewModeContext.Provider value={{ viewMode, toggleViewMode }}>
      {children}
    </ViewModeContext.Provider>
  )
}

export const useViewMode = () => {
  const context = useContext(ViewModeContext)
  if (!context) throw new Error('useViewMode must be used within a ViewModeProvider')
  return context
}
```

Cuando el viewMode es `list`, la clase del contenedor de productos cambia:

```tsx
// card view
<section className="home__products-grid">

// list view
<section className="home__products-list">
```

</details>

---

### Iteración 5 — Modal de producto

Dialog nativo del navegador para mostrar el detalle de un producto.

**Se proporciona:** `ProductDetail` como componente estático en `src/components/product-detail/` — igual que con `ProductCard` en la iteración 2, solo hay que dinamizarlo para que reciba un `Product` como prop.

```
✓ should open a dialog with product details when clicking a product
✓ should close the dialog when clicking close button
✓ should close the dialog when clicking outside the modal [OPTIONAL]
✓ should close the dialog when pressing ESC key [OPTIONAL]
```

<details>
<summary>¿Necesitas más ayuda?</summary>

El modal solo debe renderizarse cuando hay un producto seleccionado — nunca con una prop `isOpen`:

```tsx
{selectedProduct && (
  <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
)}
```

Para cerrar el modal al pulsar ESC:

```tsx
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') onClose()
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [onClose])
```

</details>

---

## Tipos

```ts
interface Category {
  id: number
  displayName: string
  slug: string
}

interface Product {
  id: number
  displayName: string
  image: string
  price: number
  categoryId: number
  description?: string
}
```

---

## API mock (MSW)

Los endpoints están mockeados con MSW. No hay servidor real.

### Pre-cocinado

| Endpoint | Respuesta | Disponible desde |
|----------|-----------|-----------------|
| `GET /categories` | `Category[]` | master (ya funciona) |

### Por implementar

| Endpoint | Respuesta | Iteración |
|----------|-----------|-----------|
| `GET /products` | `Product[]` | 2 |
| `GET /categories/:slug` | `Category` o `404` | 3 |
| `GET /categories/:slug/products` | `Product[]` o `404` | 3 |

Los fixtures están en `src/mocks/`: `categories-fixtures.json` (3 categorías) y `products-fixtures.json` (24 productos, 8 por categoría).

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