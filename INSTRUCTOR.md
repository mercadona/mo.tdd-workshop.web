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

Al arrancar, mostrar `src/pages/home/__tests__/Home.test.tsx` y `src/pages/category-detail/__tests__/CategoryDetail.test.tsx`. Los `it.todo()` son el mapa del workshop: cada test que pasarán de TODO a verde.

Ejecutar `npm test` para mostrar la lista de todos pendientes desde el inicio.

---

## Iteración 1 — Listado de categorías (~20 min)

### Qué van a construir

Un hook personalizado `useCategories()` que hace fetch a `/categories` y devuelve la lista. El componente `Navigation` lo consume y renderiza un `<nav>` con la lista de categorías.

El handler MSW para `/categories` ya está pre-cocinado en `src/mocks/handlers.ts`.

### Test de referencia

```tsx
// src/pages/home/__tests__/Home.test.tsx
it('should render the list of categories in the navigation', async () => {
  render(<App />)
  const nav = screen.getByRole('navigation')
  const categoryList = await within(nav).findByRole('list')
  const categories = within(categoryList).getAllByRole('listitem')
  expect(categories).toHaveLength(3)
  expect(within(nav).getByText('Fruta y verdura')).toBeVisible()
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

Handler MSW para `/products`. Dinamizar el `ProductCard` estático que ya existe para recibir props. Formatear precio con `Intl.NumberFormat`. Crear un `ProductMother` para los tests.

El `ProductCard` estático ya está en `src/components/product-card/ProductCard.tsx` — el asistente lo modifica para aceptar una prop `product`.

### Test de referencia

```tsx
it('should display the products with their prices correctly formatted', async () => {
  render(<App />)
  const productCard = await screen.findByRole('article', {
    name: 'Aceitunas verdes rellenas de anchoa Hacendado',
  })
  expect(within(productCard).getByText('3,00 €')).toBeVisible()
})
```

### Ciclo TDD esperado

1. **Rojo:** test falla porque no hay products en la app
2. **Verde:** handler MSW + hook `useProducts()` + dinamizar `ProductCard` con props
3. **Refactor:** extraer función `formatPrice()` si hay duplicación; crear `ProductMother`

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
- **Object Mother** vs fixtures JSON: el Mother permite crear productos con overrides para tests específicos.
- **Card view:** sin descripción, sin NutriScore. Solo imagen + nombre + precio.

### Solución de referencia

Rama: `iteration-2-solution`

Archivos clave:
- `src/components/product-card/ProductCard.tsx`
- `src/hooks/useProducts.ts`
- `src/test/mothers/ProductMother.ts`
- `src/mocks/handlers.ts` (añadir handler `/products`)

### Errores frecuentes

- Olvidar `aria-labelledby` → `findByRole('article', { name })` no encuentra el elemento
- Usar `toLocaleString()` en vez de `Intl.NumberFormat` → resultado puede variar por entorno
- Añadir NutriScore en card view (se corrige en iteración 4)

---

## Iteración 3 — Navegación y routing (~25 min)

### Qué van a construir

Handler MSW para `/categories/:slug`. React Router con `Link`, `NavLink` y `useParams`. La página `CategoryDetail` con su hook `useCategoryWithProducts`. Helper DSL `clickCategory()`.

### Tests de referencia

```tsx
// src/pages/category-detail/__tests__/CategoryDetail.test.tsx

it('should navigate to the category page and display the category title', async () => {
  render(<App />)
  const user = userEvent.setup()
  await screen.findByText('Fruta y verdura')
  await clickCategory(user, 'Fruta y verdura')
  expect(await screen.findByRole('heading', { name: 'Fruta y verdura' })).toBeVisible()
})

it('should display a not found message when the category does not exist', async () => {
  window.history.pushState({}, '', '/categories/non-existent-slug')
  render(<App />)
  expect(await screen.findByText(/categoría no encontrada/i)).toBeVisible()
})

it('should highlight the active category in the navigation', async () => {
  render(<App />)
  const user = userEvent.setup()
  await clickCategory(user, 'Fruta y verdura')
  expect(screen.getByRole('link', { name: 'Fruta y verdura', current: 'page' })).toBeVisible()
})

it('should navigate to home when clicking the logo', async () => {
  render(<App />)
  const user = userEvent.setup()
  await clickCategory(user, 'Fruta y verdura')
  await user.click(screen.getByRole('link', { name: 'Mercadona' }))
  expect(screen.queryByRole('heading', { name: 'Fruta y verdura' })).not.toBeInTheDocument()
})
```

### Ciclo TDD esperado

1. **Test 1 (navegar a categoría):** añadir `<Link>` en Navigation, crear ruta `/categories/:slug`, crear `CategoryDetail` básico
2. **Test 2 (404):** añadir manejo de error 404 en `useCategoryWithProducts`
3. **Test 3 (navlink activo):** cambiar `<Link>` a `<NavLink>` — `aria-current="page"` lo pone React Router automáticamente
4. **Test 4 (logo a home):** añadir `<Link>` en el logo

### Puntos clave a remarcar

- **`clickCategory` como helper DSL:**
  ```typescript
  // src/test/helpers.ts
  export const clickCategory = async (user: UserEvent, name: string) => {
    const link = screen.getByRole('link', { name })
    await user.click(link)
  }
  ```
  Hace los tests más legibles y el nombre del helper documenta la intención.

- **Simular navegación directa** (test del 404):
  ```typescript
  window.history.pushState({}, '', '/categories/non-existent-slug')
  render(<App />)
  ```
  NO usar `MemoryRouter` ni `initialEntries` — el test funciona con la app real.

- **NavLink y `aria-current`:** React Router pone `aria-current="page"` automáticamente en el link activo. Testing Library lo consulta con `{ current: 'page' }`.

- **Handler MSW para slug:**
  ```typescript
  http.get('/categories/:slug', ({ params }) => {
    const category = categoriesFixtures.find(c => c.slug === params.slug)
    if (!category) return new HttpResponse(null, { status: 404 })
    const products = productsFixtures.filter(p => p.categoryId === category.id)
    return HttpResponse.json({ ...category, products })
  })
  ```

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
- No esperar `await screen.findByText('Fruta y verdura')` antes de `clickCategory` → click en elemento que aún no existe
- Usar `MemoryRouter` en tests → rompe el patrón agnóstico de implementación

---

## Iteración 4 — Toggle card/list view (~20 min)

### Qué van a construir

`ViewModeContext` con `ViewModeProvider` + `useViewMode()`. Integrar el componente `Toggle` pre-cocinado. Renderizado condicional en `ProductCard`: descripción y NutriScore solo en list view.

### Tests de referencia

```tsx
it('should not display product descriptions and nutriscore in card view', async () => {
  render(<App />)
  await screen.findByRole('article', { name: /aceitunas/i })
  expect(screen.queryByText(/aceitunas verdes rellenas con anchoas/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/Nutriscore: D/i)).not.toBeInTheDocument()
})

it('should display product descriptions and nutriscore when switching to list view', async () => {
  const user = userEvent.setup()
  render(<App />)
  const productCard = await screen.findByRole('article', { name: /aceitunas/i })
  await toggleViewMode(user)
  expect(screen.getByText(/aceitunas verdes rellenas con anchoas/i)).toBeVisible()
  expect(within(productCard).getByLabelText(/Nutriscore: D/i)).toBeVisible()
})

it('should hide product descriptions and nutriscore when switching back to card view', async () => {
  const user = userEvent.setup()
  render(<App />)
  await screen.findByRole('article', { name: /aceitunas/i })
  await toggleViewMode(user)
  expect(screen.getByText(/aceitunas verdes rellenas con anchoas/i)).toBeVisible()
  await toggleViewMode(user)
  expect(screen.queryByText(/aceitunas verdes rellenas con anchoas/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/Nutriscore: D/i)).not.toBeInTheDocument()
})
```

### Ciclo TDD esperado

1. **Test 1 (card view sin descripción/nutriscore):** puede pasar si ProductCard ya no los renderiza — verificar el estado actual
2. **Test 2 (list view con descripción/nutriscore):** crear Context + Provider + `useViewMode()` + integrar Toggle + renderizado condicional en ProductCard
3. **Test 3 (volver a card view):** si el Context ya funciona, este test pasa solo

### Puntos clave a remarcar

- **Context API, patrón mínimo:**
  ```tsx
  // src/context/ViewModeContext.tsx
  type ViewMode = 'card' | 'list'
  const ViewModeContext = createContext<{ viewMode: ViewMode; toggleViewMode: () => void } | null>(null)

  export const ViewModeProvider = ({ children }: { children: ReactNode }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('card')
    return (
      <ViewModeContext.Provider value={{ viewMode, toggle: () => setViewMode(v => v === 'card' ? 'list' : 'card') }}>
        {children}
      </ViewModeContext.Provider>
    )
  }
  ```

- **No testear detalles de implementación:**
  ```typescript
  // ❌ MAL — depende de la implementación del Toggle
  expect(toggle).toHaveAttribute('aria-checked', 'false')
  expect(productCard).toHaveClass('product--list')

  // ✅ BIEN — verifica lo que ve el usuario
  expect(screen.queryByLabelText(/Nutriscore: D/i)).not.toBeInTheDocument()
  ```

- **`toggleViewMode` como helper DSL:**
  ```typescript
  export const toggleViewMode = async (user: UserEvent) => {
    const toggle = screen.getByRole('switch')
    await user.click(toggle)
  }
  ```

- **NutriScore usa `aria-label`, no texto visible:**
  ```tsx
  <span aria-label={`Nutriscore: ${score}`} className={...}>{score}</span>
  ```
  Por eso se testea con `getByLabelText(/Nutriscore: D/i)`, no con `getByText`.

- **Renderizado condicional consistente:**
  ```tsx
  {isListView && description && <p>{description}</p>}
  {isListView && nutriscore && <NutriScore score={nutriscore} />}
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
- Añadir NutriScore fuera del bloque `{isListView && ...}`
- No envolver `<App />` con el Provider (error: context es null)
- Usar `getByText(/Nutriscore/)` en vez de `getByLabelText(/Nutriscore/)` → el texto no está en el DOM

---

## Iteración 5 — Modal con dialog nativo (~20 min)

### Qué van a construir

Handler MSW para `/products/:id`. Dinamizar el `ProductDetail` estático. El padre (`Home`, `CategoryDetail`) controla la visibilidad con estado. Helper DSL `clickProduct()`.

El `ProductDetail` estático ya está en `src/components/product-detail/ProductDetail.tsx` — igual que con `ProductCard` en iter 2.

### Tests de referencia

```tsx
// Home.test.tsx
it('should open a dialog with product details when clicking a product', async () => {
  const user = userEvent.setup()
  render(<App />)
  await clickProduct(user, 'Aceitunas verdes rellenas de anchoa Hacendado')
  const dialog = await screen.findByRole('dialog')
  expect(within(dialog).getByText('Aceitunas verdes rellenas de anchoa Hacendado')).toBeVisible()
  expect(within(dialog).getByText('3,00 €')).toBeVisible()
  expect(within(dialog).getByLabelText(/Nutriscore: D/i)).toBeVisible()
})

it('should close the dialog when clicking close button', async () => {
  const user = userEvent.setup()
  render(<App />)
  await clickProduct(user, 'Aceitunas verdes rellenas de anchoa Hacendado')
  await screen.findByRole('dialog')
  await user.click(screen.getByRole('button', { name: /cerrar/i }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
```

### Ciclo TDD esperado

1. **Test 1 (abrir dialog):** añadir `onClick` a `ProductCard`, estado `selectedProduct` en `Home`, handler MSW `/products/:id`, dinamizar `ProductDetail`
2. **Test 2 (cerrar dialog):** añadir `onClose` prop y botón cerrar en `ProductDetail`
3. **Repetir para CategoryDetail:** misma lógica, test similar

### Puntos clave a remarcar

- **`<dialog open>` sin refs — patrón declarativo:**
  ```tsx
  // ❌ DON'T — imperativo con refs
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => { if (product) dialogRef.current?.showModal() }, [product])

  // ✅ DO — declarativo, el padre controla con renderizado condicional
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

- **NutriScore en el modal** se testea igual que en list view: `getByLabelText(/Nutriscore: D/i)`.

- **Botón cerrar** necesita nombre accesible: `aria-label="Cerrar"` → se encuentra con `getByRole('button', { name: /cerrar/i })`.

- **MSW handler para producto individual:**
  ```typescript
  http.get('/products/:id', ({ params }) => {
    const product = productsFixtures.find(p => p.id === Number(params.id))
    if (!product) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(product)
  })
  ```

### Solución de referencia

Rama: `iteration-5-solution`

Archivos clave:
- `src/components/product-detail/ProductDetail.tsx`
- `src/hooks/useProductDialog.ts`
- `src/pages/home/Home.tsx`
- `src/pages/category-detail/CategoryDetail.tsx`
- `src/test/helpers.ts` (añadir `clickProduct`)
- `src/mocks/handlers.ts` (añadir handler `/products/:id`)

### Errores frecuentes

- Usar `showModal()` con refs → el test de RTL no puede interactuar con el dialog
- No usar `await` en `clickProduct` → falla si los productos no han cargado aún
- Pasar `isOpen` como prop al dialog en vez de renderizado condicional
- Olvidar `aria-label="Cerrar"` en el botón → `getByRole('button', { name: /cerrar/i })` no lo encuentra

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