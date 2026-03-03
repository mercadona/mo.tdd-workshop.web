# Guión del instructor — TDD Workshop

## Antes de empezar

### Setup del entorno

Requisitos previos:
- Node.js 20+ y npm 10+
- Git

```bash
git clone <repo-url>
cd mo.tdd-workshop.web
npm install
npm test    # verificar que el único test pasa
npm start   # verificar que la app arranca en localhost:5173
```

### Cómo mostrar las ramas solución

Cada iteración tiene su rama solución:
```bash
git checkout iteration-1-solution   # solución de referencia de iter 1
git checkout iteration-2-solution   # acumulativa: iter 1 + iter 2
# ...
git checkout master                 # volver al punto de partida
```

Los asistentes trabajan en su propia rama desde `master`. **No modificar master durante el workshop.**

### Explicar los it.todo() como guía

Al arrancar, mostrar `src/pages/home/__tests__/Home.test.tsx` y `src/pages/category-detail/__tests__/CategoryDetail.test.tsx`. Los `it.todo()` están agrupados en `describe` por iteración — son el mapa del workshop: cada test que pasarán de TODO a verde.

Ejecutar `npm test` para mostrar la lista de todos pendientes desde el inicio.

---

## Iteración 1 — Listado de categorías (~20 min)

### Qué van a construir

Un hook personalizado `useCategories()` que hace fetch a `/categories` y devuelve la lista. El componente `Navigation` lo consume y renderiza un `<nav>` con la lista de categorías.

El handler MSW para `/categories` ya está pre-cocinado en `src/mocks/handlers.ts`.

### Test de referencia

```tsx
// src/pages/home/__tests__/Home.test.tsx
describe('Iteración 1 - Listado de categorías', () => {
  it('should render the list of categories in the navigation', async () => {
    render(<App />)
    const nav = screen.getByRole('navigation')
    const categoryList = await within(nav).findByRole('list')
    const categories = within(categoryList).getAllByRole('listitem')
    expect(categories).toHaveLength(3)
    expect(within(nav).getByText('Fruta y verdura')).toBeVisible()
  })
})
```

### Ciclo TDD esperado

1. **Rojo:** el test falla porque `Navigation` no existe o no renderiza categorías
2. **Verde mínimo:** fetch directo en el componente con `useEffect` + `useState`
3. **Refactor:** extraer `useCategories()` hook — el test sigue verde sin cambios

### Puntos clave a remarcar

- `findByRole` es asíncrono (espera a que aparezca el elemento). `getByRole` fallaría porque el fetch es async.
- `within(nav).findByRole('list')` garantiza que buscamos dentro del nav, no en toda la página.
- Verificar un ejemplo representativo (`'Fruta y verdura'`) en lugar de los 3 — los tests no son exhaustivos.
- El refactor a custom hook no rompe ningún test: eso es la garantía del refactor.

### Solución de referencia

Rama: `iteration-1-solution`

Archivos clave:
- `src/hooks/useCategories.ts`
- `src/components/navigation/Navigation.tsx`

### Errores frecuentes

- Usar `getByRole` en lugar de `findByRole` → test falla intermitentemente
- No usar `within(nav)` → test falla si hay otra lista en la página
- Crear el hook antes de que el test lo requiera (viola TDD)

---

## Iteración 2 — Listado de productos (~25 min)

### Qué van a construir

Handler MSW para `/products`. Dinamizar el `ProductCard` estático que ya existe para recibir props. Formatear precio con `Intl.NumberFormat`.

El `ProductCard` estático ya está en `src/components/product-card/ProductCard.tsx` — el asistente lo modifica para aceptar una prop `product`.

### Test de referencia

```tsx
describe('Iteración 2 - Listado de productos', () => {
  it('should display the products with their prices correctly formatted', async () => {
    render(<App />)
    const productCard = await screen.findByRole('article', {
      name: 'Aceitunas verdes rellenas de anchoa Hacendado',
    })
    expect(within(productCard).getByText('3,00 €')).toBeVisible()
  })
})
```

### Ciclo TDD esperado

1. **Rojo:** test falla porque no hay products en la app
2. **Verde mínimo:** handler MSW + fetch directo en `Home` con `useEffect`/`useState` + dinamizar `ProductCard` con props
3. **Refactor:** extraer `useProducts()` hook (igual que en iter-1 se extrajo `useCategories`); extraer `formatPrice()` si hay duplicación

### Puntos clave a remarcar

- **ProductCard ya existe como estático:** el asistente no crea desde cero, sino que dinamiza. Esto es intencional — igual que en el trabajo real.
- **`aria-labelledby`:** el `<article>` necesita nombre accesible para que `findByRole('article', { name: '...' })` funcione:
  ```tsx
  const headingId = `product-heading-${id}`
  <article aria-labelledby={headingId}>
    <h3 id={headingId}>{displayName}</h3>
  </article>
  ```
- **Intl.NumberFormat:**
  ```typescript
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price)
  // → "3,00 €"
  ```
- **Card view:** sin descripción. Solo imagen + nombre + precio.

### Solución de referencia

Rama: `iteration-2-solution`

Archivos clave:
- `src/components/product-card/ProductCard.tsx`
- `src/hooks/useProducts.ts`
- `src/mocks/handlers.ts` (añadir handler `/products`)

### El test "Hello World"

Al dinamizar `Home` para mostrar productos, el `<h1>Hello World!</h1>` desaparecerá y el test `should render correctly the home` fallará. Es esperado — el asistente puede borrarlo sin problema.

### Errores frecuentes

- Olvidar `aria-labelledby` → `findByRole('article', { name })` no encuentra el elemento
- Usar `toLocaleString()` en vez de `Intl.NumberFormat` → resultado puede variar por entorno

---

## Iteración 3 — Navegación y routing (~25 min)

### Qué van a construir

Dos handlers MSW (`/categories/:slug` y `/categories/:slug/products`). React Router con `Link`, `NavLink` y `useParams`. La página `CategoryDetail`. El hook `useCategoryWithProducts`. Helper DSL `clickCategory()`.

### Tests de referencia

```tsx
// src/pages/category-detail/__tests__/CategoryDetail.test.tsx
describe('Iteración 3 - Navegación y routing', () => {
  it('should navigate to the category page and display the category title', ...)
  it('should show the category products', ...)
  it('should navigate to home when clicking the logo [OPTIONAL]', ...)
  it('should highlight the active category in the navigation [OPTIONAL]', ...)
  it('should display a not found message when the category does not exist [OPTIONAL]', ...)
})
```

### Ciclo TDD esperado

1. **Test 1 — Rojo:** falla porque no hay ruta `/categories/:slug` ni `CategoryDetail`
   **Verde mínimo:** dos handlers MSW + añadir `<Link>` en Navigation + crear ruta + crear `CategoryDetail` con `useCategoryWithProducts` + `useParams`
2. **Test 2 — Rojo:** falla porque `CategoryDetail` no muestra productos
   **Verde:** `useCategoryWithProducts` hace dos fetches: primero `GET /categories/:slug`, luego `GET /categories/:slug/products`
   **Refactor:** el hook ya encapsula ambos fetches y el manejo de 404
3. **Test 3 OPTIONAL:** añadir `<Link>` en el logo
4. **Test 4 OPTIONAL:** cambiar `<Link>` a `<NavLink>` — `aria-current="page"` lo pone React Router automáticamente
5. **Test 5 OPTIONAL:** añadir comprobación de `response.ok` → renderizar mensaje de error

### Puntos clave a remarcar

- **Dos endpoints separados** — la categoría y sus productos son recursos distintos:
  ```typescript
  http.get('/categories/:slug', ({ params }) => {
    const category = categoriesFixtures.find(c => c.slug === params.slug)
    if (!category) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(category)
  }),
  http.get('/categories/:slug/products', ({ params }) => {
    const category = categoriesFixtures.find(c => c.slug === params.slug)
    if (!category) return new HttpResponse(null, { status: 404 })
    const products = productsFixtures.filter(p => p.categoryId === category.id)
    return HttpResponse.json(products)
  }),
  ```

- **`useCategoryWithProducts`** hace los dos fetches en secuencia:
  ```typescript
  const fetchCategory = async () => {
    const response = await fetch(`/categories/${slug}`)
    if (!response.ok) { setNotFound(true); return }
    setCategory(await response.json())
    const productsResponse = await fetch(`/categories/${slug}/products`)
    setProducts(await productsResponse.json())
  }
  ```

- **`clickCategory` como helper DSL** — usa `findByRole` (async) porque las categorías cargan vía MSW:
  ```typescript
  export const clickCategory = async (user: UserEvent, name: string) => {
    const link = await screen.findByRole('link', { name })
    await user.click(link)
  }
  ```

- **Simular navegación directa** (test del 404):
  ```typescript
  window.history.pushState({}, '', '/categories/non-existent-slug')
  render(<App />)
  ```
  NO usar `MemoryRouter` ni `initialEntries` — el test funciona con la app real.

- **NavLink y `aria-current`:** React Router pone `aria-current="page"` automáticamente en el link activo. Testing Library lo consulta con `{ current: 'page' }`.

### Solución de referencia

Rama: `iteration-3-solution`

Archivos clave:
- `src/pages/category-detail/CategoryDetail.tsx`
- `src/hooks/useCategoryWithProducts.ts`
- `src/components/navigation/Navigation.tsx`
- `src/test/helpers.ts`
- `src/mocks/handlers.ts`

### Errores frecuentes

- Usar `<Link>` en vez de `<NavLink>` → el test de `aria-current` falla
- Usar `getByRole` en vez de `findByRole` en el helper → click en elemento que aún no existe
- Usar `MemoryRouter` en tests → rompe el patrón agnóstico de implementación
- Devolver `{ ...category, products }` en un solo endpoint → no coincide con la arquitectura esperada

---

## Iteración 4 — Toggle card/list view (~20 min)

### Qué van a construir

`ViewModeContext` con `ViewModeProvider` + `useViewMode()`. Integrar el componente `Toggle` pre-cocinado. Renderizado condicional en `ProductCard`: descripción solo en list view.

### Tests de referencia

```tsx
describe('Iteración 4 - Toggle card/list view', () => {
  it('should display product descriptions when switching to list view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('article', { name: 'Aceitunas verdes rellenas de anchoa Hacendado' })
    expect(screen.queryByText(/Aceitunas verdes rellenas con anchoas de calidad/)).not.toBeInTheDocument()
    await toggleViewMode(user)
    expect(screen.getByText(/Aceitunas verdes rellenas con anchoas de calidad/)).toBeVisible()
  })

  it('should hide product descriptions when switching back to card view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('article', { name: 'Aceitunas verdes rellenas de anchoa Hacendado' })
    await toggleViewMode(user)
    expect(screen.getByText(/Aceitunas verdes rellenas con anchoas de calidad/)).toBeVisible()
    await toggleViewMode(user)
    expect(screen.queryByText(/Aceitunas verdes rellenas con anchoas de calidad/)).not.toBeInTheDocument()
  })
})
```

### Ciclo TDD esperado

1. **Test 1 — Rojo:** falla porque no existe el Toggle ni mecanismo para cambiar a list view
   **Verde:** crear `ViewModeContext` + `ViewModeProvider` + `useViewMode()` + integrar `Toggle` + renderizado condicional en `ProductCard`
2. **Test 2 — Verde de facto:** pasa automáticamente al completar el test 1 si el Context funciona correctamente

### Puntos clave a remarcar

- **Context API, patrón mínimo:**
  ```tsx
  // src/context/ViewModeContext.tsx
  type ViewMode = 'card' | 'list'
  const ViewModeContext = createContext<{ viewMode: ViewMode; toggleViewMode: () => void } | null>(null)

  export const ViewModeProvider = ({ children }: { children: ReactNode }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('card')
    return (
      <ViewModeContext.Provider value={{ viewMode, toggleViewMode: () => setViewMode(v => v === 'card' ? 'list' : 'card') }}>
        {children}
      </ViewModeContext.Provider>
    )
  }
  ```

- **No SOLO testear detalles de implementación:**
  ```typescript
  // ✅ BIEN — verifica lo que ve el usuario
  expect(screen.queryByText(/descripción/)).not.toBeInTheDocument()

  // ADICIONAL — comprobar el estado accesible del Toggle
  expect(toggle).toHaveAttribute('aria-checked', 'false')

  // ❌ MAL — Testear la clase del ProductCard en lugar del contenido
  expect(productCard).toHaveClass('product--list')
  ```

- **`toggleViewMode` como helper DSL:**
  ```typescript
  export const toggleViewMode = async (user: UserEvent) => {
    const toggle = screen.getByRole('switch')
    await user.click(toggle)
  }
  ```

- **Renderizado condicional consistente:**
  ```tsx
  {isListView && description && <p className="product-card__description">{description}</p>}
  ```

### Solución de referencia

Rama: `iteration-4-solution`

Archivos clave:
- `src/context/ViewModeContext.tsx`
- `src/hooks/useViewMode.ts`
- `src/components/product-card/ProductCard.tsx`
- `src/test/helpers.ts` (añadir `toggleViewMode`)

### Errores frecuentes

- Testear `aria-checked` del Toggle en vez de la visibilidad del contenido
- No envolver `<App />` con el Provider (error: context es null)

---

## Iteración 5 — Modal con dialog nativo (~20 min)

### Qué van a construir

Dinamizar el `ProductDetail` estático. El padre (`Home`, `CategoryDetail`) controla la visibilidad con estado local — sin fetch adicional, el producto ya está disponible. Helper DSL `clickProduct()`.

El `ProductDetail` estático ya está en `src/components/product-detail/ProductDetail.tsx` — igual que con `ProductCard` en iter 2.

### Tests de referencia

```tsx
describe('Iteración 5 - Modal de producto', () => {
  it('should open a dialog with product details when clicking a product', async () => {
    const user = userEvent.setup()
    render(<App />)
    await clickProduct(user, 'Aceitunas verdes rellenas de anchoa Hacendado')
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText('Aceitunas verdes rellenas de anchoa Hacendado')).toBeVisible()
    expect(within(dialog).getByText('3,00 €')).toBeVisible()
    expect(within(dialog).getByText(/Aceitunas verdes rellenas con anchoas de calidad/)).toBeVisible()
  })

  it('should close the dialog when clicking close button', async () => {
    const user = userEvent.setup()
    render(<App />)
    await clickProduct(user, 'Aceitunas verdes rellenas de anchoa Hacendado')
    await screen.findByRole('dialog')
    await user.click(screen.getByRole('button', { name: /cerrar/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
```

### Ciclo TDD esperado

1. **Test 1 — Rojo:** falla porque no hay `onClick` en `ProductCard` ni `ProductDetail` dinámico
   **Verde:** añadir prop `onClick?: () => void` a `ProductCard` + estado `selectedProduct` en `Home` + dinamizar `ProductDetail`
   No hay endpoint nuevo — `handleProductClick(product)` recibe el objeto ya disponible y lo pone en estado
2. **Test 2 — Rojo:** falla porque el dialog no se puede cerrar
   **Verde:** añadir `onClose` prop + botón cerrar en `ProductDetail`
3. **Repetir Rojo-Verde para `CategoryDetail`:** mismos tests con `clickCategory` + `clickProduct`

### Puntos clave a remarcar

- **Sin fetch — el producto ya está disponible:**
  ```typescript
  // src/hooks/useProductDialog.ts
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)  // no fetch — el objeto ya está en el padre
  }
  ```
  El clic en la card pasa el objeto `product` directamente al estado. No se necesita ningún endpoint nuevo.

- **`<dialog open>` sin refs — patrón declarativo:**
  ```tsx
  // ❌ DON'T — imperativo con refs
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => { if (product) dialogRef.current?.showModal() }, [product])

  // ✅ DO — el padre renderiza condicionalmente
  {selectedProduct && <ProductDetail product={selectedProduct} onClose={handleClose} />}
  ```
  El dialog no está en el DOM cuando no se usa → los tests no necesitan mocks.

- **`clickProduct` como helper DSL:**
  ```typescript
  export const clickProduct = async (user: UserEvent, name: string) => {
    const productCard = await screen.findByRole('article', { name })
    await user.click(productCard)
  }
  ```
  Usa `findByRole` (asíncrono) porque los productos se cargan por fetch.

- **Botón cerrar** necesita nombre accesible: `aria-label="Cerrar"` → se encuentra con `getByRole('button', { name: /cerrar/i })`.

### Solución de referencia

Rama: `iteration-5-solution`

Archivos clave:
- `src/components/product-detail/ProductDetail.tsx`
- `src/hooks/useProductDialog.ts`
- `src/pages/home/Home.tsx`
- `src/pages/category-detail/CategoryDetail.tsx`
- `src/test/helpers.ts` (añadir `clickProduct`)

### Errores frecuentes

- Usar `showModal()` con refs → el test de RTL no puede interactuar con el dialog
- No usar `await` en `clickProduct` → falla si los productos no han cargado aún
- Pasar `isOpen` como prop al dialog en vez de renderizado condicional
- Olvidar `aria-label="Cerrar"` en el botón → `getByRole('button', { name: /cerrar/i })` no lo encuentra
- Intentar hacer fetch a `/products/:id` para abrir el modal — innecesario

---

## Cierre

### Retrospectiva con asistentes (~10 min)

Preguntas para la discusión:
- ¿Qué fue lo más diferente de escribir el test antes que el código?
- ¿En qué momento el test os dio información útil sobre el diseño del componente?
- ¿Cuándo fue más fácil refactorizar sabiendo que los tests os cubrían?

### Recursos y siguientes pasos

- [Testing Library — queries](https://testing-library.com/docs/queries/about)
- [MSW — Request handlers](https://mswjs.io/docs/network-behavior/rest)
- [React Router — Hooks](https://reactrouter.com/en/main/hooks/use-params)
- [MDN — HTMLDialogElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [MDN — Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
