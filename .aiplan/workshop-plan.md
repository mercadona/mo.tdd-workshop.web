# Plan: TDD Workshop - Implementación Completa

## Contexto

Este repositorio es la base de un workshop práctico de TDD con React. El objetivo es preparar:
1. La rama `master` como punto de partida "cocinado" para los asistentes
2. 10 ramas de soluciones (`iteration-X-start` / `iteration-X-solution`) para las 5 iteraciones

Actualmente `master` es un esqueleto mínimo (React + Vite + Router + Tests básicos). Falta: MSW, componentes base, CSS, tipos, y toda la infraestructura que los asistentes necesitan como punto de partida.

---

## Fase 0: Preparar rama `master` (punto de partida para asistentes)

### 0.1 Instalar MSW ✅ COMPLETADO
- [x] `npm install msw --save-dev`
- [x] Crear `src/mocks/handlers.ts` con handlers pre-cocinados:
  - `GET /categories` → devuelve lista de categorías (handler completo con fixtures)
  - **NO** incluir handlers de productos (los crean los asistentes en las iteraciones 2 y 5)
- [x] Crear `src/mocks/browser.ts` (setupWorker para dev)
- [x] Crear `src/mocks/server.ts` (setupServer para tests)
- [x] Integrar MSW en `setupTests.ts` (beforeAll/afterEach/afterAll)
- [x] Integrar MSW browser worker en `src/index.tsx` (solo en dev)

### 0.2 Definir tipos ✅ COMPLETADO
- [x] Crear `src/types/index.ts` con interfaces:
  ```typescript
  interface Category { id: number; displayName: string; slug: string }
  interface Product { id: number; slug: string; displayName: string; nutriscore: string; image: string; thumbnail: string; price: number; referenceFormat: string; categoryId: number; description?: string }
  ```

### 0.3 Crear datos mock (fixtures)

**✅ Completado en sesión anterior**

- [x] **Fixtures de categorías** (`src/mocks/categories-fixtures.json`):
  - 3 categorías: "Fruta y verdura", "Cereales", "Aperitivos"
  - Cada categoría tiene: `id`, `displayName`, `slug`

- [x] **Fixtures de productos** (`src/mocks/products-fixtures.json`):
  - 24 productos en total (8 por categoría)
  - Campos: `id`, `slug`, `displayName`, `nutriscore`, `image`, `thumbnail`, `price`, `referenceFormat`, `categoryId`
  - Distribución:
    - Fruta y verdura (categoryId: 1): 8 productos
    - Cereales (categoryId: 7): 8 productos
    - Aperitivos (categoryId: 15): 8 productos

- [x] **Imágenes de productos** (`public/images/`):
  - 48 archivos de imagen (24 productos × 2 versiones)
  - Cada producto tiene: versión normal + thumbnail (`_thumb.jpg`)
  - Imágenes reales de productos Mercadona

**Nota:** Las fixtures están listas para usar en los handlers MSW que se crearán progresivamente:
- Handler de categorías: Fase 0 (master)
- Handler de productos: Iteración 2 (los asistentes lo crean)
- Handlers de detalle: Iteraciones 3 y 5

### 0.4 Componentes base (solo UI, sin lógica) ✅ COMPLETADO
- [x] `src/components/Navigation/Navigation.tsx` + `index.ts`
  - Componente visual con nav, logo/título del workshop
  - Sin lógica de categorías (eso se hace en iteración 1)
- [x] `src/components/Toggle/Toggle.tsx` + `index.ts`
  - Componente switch visual (Card/List)
  - Props: `checked`, `onChange`, label
  - Sin conexión a Context (eso se hace en iteración 4)

### 0.5 CSS completo (BEM) ✅ COMPLETADO
- [x] Estilos globales / variables CSS (`src/styles/globals.css` creado e importado en index.tsx)
- [x] `Navigation.css` - estilos del nav (creado e importado)
- [x] `Toggle.css` - estilos del switch
- [x] `ProductCard.css` - estilos para modo Card Y modo List (ambos listos)
- [x] `ProductDetail.css` - estilos para el modal/dialog
- [x] `Home.css` - layout de la página principal
- [x] `CategoryDetail.css` - layout de página de categoría

### 0.6 Routing esquelético ✅ COMPLETADO
- [x] Añadir ruta `/categories/:slug` en Routes.tsx (con componente placeholder)
- [x] Actualizar `paths.ts` con la nueva ruta
- [x] Crear `src/pages/category-detail/CategoryDetail.tsx` (placeholder vacío)

### 0.7 HTML base ✅ COMPLETADO
- [x] Integrar `<Navigation />` en el layout de App
- [x] Estructura HTML semántica (header, main, etc.)
- [x] Crear componente `<Layout />` para centralizar estilos comunes (max-width, padding)
- [x] Refactorizar Home.css y CategoryDetail.css para eliminar duplicación

### 0.8 Verificación de Fase 0 ✅ COMPLETADO
- [x] `npm test` → tests existentes siguen pasando
- [x] `npm run typecheck` → sin errores de tipos
- [x] `npm run lint` → sin errores de linting
- [x] `npm start` → la app arranca y muestra el layout base
- [x] Commit y tag del estado de master

---

## Modelo de ramas: qué va en cada una

| Rama | Contenido |
|------|-----------|
| `iteration-X-start` | Código de iteraciones anteriores resueltas. **SIN tests, SIN implementación nueva, SIN handlers MSW nuevos**. Los asistentes escriben TODO. |
| `iteration-X-solution` | Ciclo TDD completo: test (ROJO) + implementación (VERDE) + refactor. Incluye Object Mothers, DSL helpers, handlers MSW, y todo el código que los asistentes deberían escribir. |

### Filosofía de handlers MSW

- `GET /categories` → único handler pre-cocinado en master (los asistentes lo tienen como referencia)
- `GET /products` → lo crean los asistentes (iteración 2). En master se proporcionan las fixtures de productos pero NO el handler
- `GET /categories/:slug` → lo crean los asistentes (iteración 3). NO se proporciona en `-start`
- `GET /products/:id` → lo crean los asistentes (iteración 5, dialog). NO se proporciona en `-start`

### Object Mothers y DSL helpers

Siempre en `-solution`, nunca en `-start`. Son parte del aprendizaje TDD.

---

## Fase 1: Iteración 1 - Listado de categorías

**Concepto:** Fetch de categorías + custom hook
**Ramas:** `iteration-1-start`, `iteration-1-solution`

> **Nota:** Los asistentes parten de `iteration-1-start` (= master) y escriben ellos mismos los tests y la implementación. Las ramas `solution` son las que mostramos como referencia. No proporcionamos tests, ni siquiera `it` vacíos.

### 1.0 Crear rama `iteration-1-start` ✅ COMPLETADO
- [x] Crear rama desde master: `git checkout -b iteration-1-start`
- [x] Push rama (snapshot limpio, sin tests ni implementación)

### 1.1 Test (ROJO) — solo en `iteration-1-solution` ✅ COMPLETADO
- [x] Crear `src/pages/home/__tests__/Home.test.tsx` (ampliar el existente):
  ```typescript
  it('should render the list of categories on initial load', async () => {
    render(<App />)

    const categoryList = await screen.findByRole('list')
    const categories = within(categoryList).getAllByRole('listitem')

    expect(categories).toHaveLength(3)
    expect(screen.getByText('Fruta y verdura')).toBeVisible()
  })
  ```
- [x] Verificar que el test falla (ROJO)

### 1.2 Implementación (VERDE) ✅ COMPLETADO
- [x] Implementar fetch de categorías directamente en `Home.tsx`:
  - `useState` + `useEffect` para fetch a `/categories` con async/await
  - Renderizar `<ul>` con `<li>` por cada categoría
- [x] Verificar que el test pasa (VERDE)

### 1.3 Refactor ✅ COMPLETADO
- [x] Extraer lógica a `src/hooks/useCategories.ts`:
  ```typescript
  export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([])
    useEffect(() => { fetch('/categories')... }, [])
    return { categories }
  }
  ```
- [x] Home.tsx usa `useCategories()` en lugar de lógica inline
- [x] Tests siguen en verde

### 1.4 Crear rama solución ✅ COMPLETADO
- [x] Commit todo el trabajo (tests + implementación + refactor)
- [x] `git checkout -b iteration-1-solution`
- [x] Push rama solución

### 1.5 Verificación ✅ COMPLETADO
- [x] `npm test` → pasa
- [x] `npm run typecheck` → OK
- [x] `npm run lint` → OK

### 1.6 Ciclo 2: Mover categorías a Navigation ✅ COMPLETADO
- [x] **Test (ROJO):** Actualizar test para buscar categorías dentro del `<nav>`
- [x] **Implementación (VERDE):** Mover `useCategories()` de Home a Navigation
- [x] **Refactor:** Código ya limpio, no necesita cambios
- [x] Verificación completa (tests, typecheck, lint)
- [x] Commit y push

### 1.7 Retrospectiva de Fase 1 ✅ COMPLETADO
- [x] Identificar aprendizajes de la sesión
- [x] Actualizar CLAUDE.md con mejores prácticas:
  - Flujo estricto de ramas (crear `-solution` antes de codificar)
  - Data fetching con async/await (sin try/catch)
  - Testing: ejemplos representativos vs verificar todos los datos
  - Comentarios solo cuando sean necesarios
  - Retrospectiva obligatoria al final de cada fase
- [x] Commit y push de mejoras

---

## Fase 2: Iteración 2 - Listado de productos + formateo + Object Mother ✅ COMPLETADO

**Concepto:** Componente ProductCard, Intl.NumberFormat, patrón Object Mother
**Ramas:** `iteration-2-start`, `iteration-2-solution`

### 2.0 Crear rama `iteration-2-start` ✅ COMPLETADO
- [x] `git checkout -b iteration-2-start` (desde iteration-1-solution)
- [x] Push rama (snapshot limpio, sin tests ni implementación de esta iteración)

### 2.1 Crear handler MSW — solo en `iteration-2-solution` ✅ COMPLETADO
- [x] Añadir handler `GET /products` en handlers.ts (los asistentes crean este handler)
  - Devuelve lista de productos con price, name, description, image, categoryId
  - Usa las fixtures de productos proporcionadas en master

### 2.2 Crear Object Mother — solo en `iteration-2-solution` ✅ COMPLETADO
- [x] `src/test/mothers/ProductMother.ts` creado con patrón de factory

### 2.3 Test (ROJO) — solo en `iteration-2-solution` ✅ COMPLETADO
- [x] Test en Home que verifica productos con precios formateados
- [x] Test usa `aria-labelledby` para encontrar article por su heading
- [x] Test usa `within` para verificar precio dentro del contexto del producto específico

### 2.4 Implementación (VERDE) ✅ COMPLETADO
- [x] `src/components/ProductCard/ProductCard.tsx`:
  - Muestra nombre, precio formateado con `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })`
  - Muestra imagen y nutriscore
  - `aria-labelledby` vinculado al heading para accesibilidad
  - NO muestra descripción (eso es para modo List en iteración 4)
- [x] Fetch de productos en Home con async/await
- [x] Renderizar lista de `<ProductCard />`

### 2.5 Refactor ✅ COMPLETADO
- [x] Extraer `src/hooks/useProducts.ts`
- [x] Función `formatPrice` extraída en ProductCard
- [x] Tests siguen en verde

### 2.6 Crear rama solución ✅ COMPLETADO
- [x] Commit todo el trabajo (handler + tests + implementación + refactor)
- [x] Push rama `iteration-2-solution`

### 2.7 Verificación ✅ COMPLETADO
- [x] `npm test` → pasa
- [x] `npm run typecheck` → OK
- [x] `npm run lint` → OK

### 2.8 Retrospectiva de Fase 2 ✅ COMPLETADO
- [x] Identificar aprendizajes de la sesión
- [x] Actualizar CLAUDE.md con nueva sección "Testing Semántico y Accesibilidad":
  - Usar `aria-labelledby` para vincular article con heading
  - Buscar elementos por su nombre accesible (NO usar `.closest()`)
  - Usar `within` para verificar contenido en contexto específico
  - Evitar non-null assertions en tests
- [x] Commit y push de mejoras

---

## Fase 3: Iteración 3 - Navegación y routing + helpers DSL ✅ COMPLETADO

**Concepto:** React Router links, página de categoría, helpers de testing
**Ramas:** `iteration-3-start`, `iteration-3-solution`

### 3.0 Crear rama `iteration-3-start` ✅ COMPLETADO
- [x] Desde iteration-2-solution
- [x] Push rama (snapshot limpio, sin tests ni implementación de esta iteración)

### 3.1 Crear handler MSW — solo en `iteration-3-solution` ✅ COMPLETADO
- [x] `GET /categories/:slug` → devuelve categoría con sus productos
- [x] El handler debe devolver **404** para slugs que no coincidan con ninguna categoría

### 3.2 Crear helpers de testing (DSL) — solo en `iteration-3-solution` ✅ COMPLETADO
- [x] `src/test/helpers.ts`:
  ```typescript
  export const clickCategory = async (user: UserEvent, name: string) => {
    const link = screen.getByRole('link', { name })
    await user.click(link)
  }
  ```

### 3.3 Tests (ROJO) — solo en `iteration-3-solution` ✅ COMPLETADO
- [x] Tests de navegación exitosa a categoría
- [x] Test de caso 404 con mensaje de error
- [x] Uso de helper `clickCategory()`
- [x] Uso de `window.history.pushState()` para test de URL directa

### 3.4 Implementación (VERDE) ✅ COMPLETADO
- [x] Convertir categorías en `<Link to={/categories/${slug}}>` en Navigation
- [x] Implementar `CategoryDetail.tsx`:
  - Fetch de `/categories/:slug`
  - Muestra título + productos de esa categoría
  - Manejo del caso 404: mostrar mensaje "categoría no encontrada" cuando el slug no existe
- [x] Usar `useParams()` de React Router
- [x] Refactor arquitectónico: RootLayout con Outlet pattern

### 3.5 Refactor ✅ COMPLETADO
- [x] Extraer hook `useCategoryWithProducts(slug)`
- [x] CategoryMother en tests
- [x] RootLayout con patrón Outlet para layouts compartidos
- [x] Tests siguen en verde

### 3.6 Crear rama solución ✅ COMPLETADO
- [x] Commit todo el trabajo (handler + tests + implementación + refactor)
- [x] Push rama `iteration-3-solution`

### 3.7 Verificación ✅ COMPLETADO
- [x] Tests (5/5 passing)
- [x] Typecheck → OK
- [x] Lint → OK

---

## Fase 4: Iteración 4 - Estado global con Context API (Card/List view)

**Concepto:** Context API, testing user-oriented (NO implementation details)
**Ramas:** `iteration-4-start`, `iteration-4-solution`

### 4.0 Crear rama `iteration-4-start` ✅ COMPLETADO
- [x] Desde iteration-3-solution
- [x] Push rama (snapshot limpio, sin tests ni implementación de esta iteración)

### 4.1 Crear helper de testing — solo en `iteration-4-solution` ✅ COMPLETADO
- [x] `toggleViewMode()` en `src/test/helpers.ts`

### 4.2 Tests (ROJO) — User-oriented — solo en `iteration-4-solution` ✅ COMPLETADO
- [x] Tests creados verificando comportamiento visible al usuario
- [x] Inicialmente (modo Card): NO hay descripciones ni nutriscore
- [x] Después de toggle (modo List): SÍ hay descripciones y nutriscore
- [x] Toggle de vuelta a Card: oculta descripciones y nutriscore
- [x] Tests usan `within(productCard)` para contexto específico
- [x] **Enfoque user-oriented:** Tests verifican presencia/ausencia de descripciones y nutriscore, NO detalles de implementación

### 4.3 Implementación (VERDE) ✅ COMPLETADO
- [x] `src/context/ViewModeContext.tsx` creado con ViewModeProvider
- [x] `src/hooks/useViewMode.ts` creado
- [x] App wrappeado con `<ViewModeProvider>`
- [x] `<Toggle />` conectado al context en RootLayout
- [x] En `<ProductCard />`: renderizado condicional de `description` y `nutriscore` según viewMode
- [x] Uso de `classnames` para clases CSS dinámicas
- [x] Indicador visual/textual del modo actual en el toggle ("Vista como tarjeta" / "Vista como lista")
- [x] Campo `description` añadido a todos los productos en fixtures

### 4.4 Refactor ✅ COMPLETADO
- [x] Código ya limpio, no requiere refactorización adicional
- [x] Tests siguen en verde (8/8 passing)

### 4.5 Crear rama solución ✅ COMPLETADO
- [x] Commit todo el trabajo (context + tests + implementación + refactor)
- [x] Push rama `iteration-4-solution`

### 4.6 Verificación ✅ COMPLETADO
- [x] Tests → 8/8 passing
- [x] Typecheck → OK
- [x] Lint → OK

---

## Fase 5: Iteración 5 - Modal con `<dialog>` nativo ✅ COMPLETADO

**Concepto:** Elemento `<dialog>` nativo controlado por estado del padre
**Ramas:** `iteration-5-start`, `iteration-5-solution`

### 5.0 Crear rama `iteration-5-start` ✅ COMPLETADO
- [x] Desde iteration-4-solution
- [x] Push rama (snapshot limpio, sin tests ni implementación de esta iteración)

### 5.1 Crear helper de testing — solo en `iteration-5-solution` ✅ COMPLETADO
- [x] `clickProduct()` en `src/test/helpers.ts`

### 5.2 Tests (ROJO) — solo en `iteration-5-solution` ✅ COMPLETADO
- [x] Test: `should open a dialog with product details when clicking a product`
- [x] Test: `should close the dialog when clicking close button`
- [x] Helper usa `findByRole` (async) para esperar productos

### 5.3 Implementación (VERDE) ✅ COMPLETADO
- [x] Handler MSW `GET /products/:id` con manejo de 404
- [x] `src/components/ProductDetail/ProductDetail.tsx`:
  - Props: `product` (Product), `onClose` (callback)
  - Usa `<dialog open>` (no refs, no métodos imperativos)
  - Renderizado controlado por padre con `&&` condicional
  - Muestra: nombre, precio, descripción, imagen
  - Botón cerrar con aria-label
- [x] ProductCard: prop `onClick` opcional, cursor pointer condicional
- [x] Home: estado `selectedProduct`, fetch en `handleProductClick`, renderizado condicional del dialog

### 5.4 Refactor ✅ COMPLETADO
- [x] No refactorizar (no hay duplicación todavía)
- [x] Tests siguen en verde (10/10)

### 5.5 Crear rama solución ✅ COMPLETADO
- [x] Commit todo el trabajo (handler + tests + implementación)
- [x] Push rama `iteration-5-solution`

### 5.6 Verificación final ✅ COMPLETADO
- [x] `npm test` → 10/10 tests pasan
- [x] `npm run typecheck` → OK
- [x] `npm run lint` → OK (+ fix de formato)

### 5.7 Retrospectiva ✅ PENDIENTE
- [ ] Identificar aprendizajes y fricciones de la sesión
- [ ] Actualizar CLAUDE.md con mejoras

---

## Archivos clave a modificar/crear

| Archivo | Fase | Acción |
|---------|------|--------|
| `package.json` | 0 | Añadir MSW |
| `src/mocks/handlers.ts` | 0 (categories), 2 (products), 3 (categories/:slug), 5 (products/:id) | Crear + ampliar handlers |
| `src/mocks/browser.ts` | 0 | Crear |
| `src/mocks/server.ts` | 0 | Crear |
| `setupTests.ts` | 0 | Integrar MSW server |
| `src/index.tsx` | 0 | Integrar MSW browser |
| `src/types/index.ts` | 0 | Crear interfaces |
| `src/components/Navigation/` | 0 | Crear componente base |
| `src/components/Toggle/` | 0 | Crear componente base |
| `src/app.tsx` | 0 | Añadir Navigation al layout |
| `src/pages/routes/Routes.tsx` | 0 | Añadir ruta categoría |
| `src/pages/paths.ts` | 0 | Añadir path categoría |
| `src/pages/home/Home.tsx` | 1, 2 | Categorías + Productos |
| `src/hooks/useCategories.ts` | 1 | Crear |
| `src/hooks/useProducts.ts` | 2 | Crear |
| `src/components/ProductCard/` | 2 | Crear |
| `src/test/mothers/ProductMother.ts` | 2 | Crear |
| `src/test/helpers.ts` | 3 | Crear DSL helpers |
| `src/pages/category-detail/` | 3 | Implementar |
| `src/test/mothers/CategoryMother.ts` | 3 | Crear |
| `src/context/ViewModeContext.tsx` | 4 | Crear |
| `src/hooks/useViewMode.ts` | 4 | Crear |
| `src/components/ProductDetail/` | 5 | Crear |

---

## Resumen de ramas

```
master                    ← Punto de partida cocinado (Fase 0)
│                            Handler único: GET /categories + fixtures de productos
│
├── iteration-1-start     ← = master (sin cambios)
├── iteration-1-solution  ← Tests + categorías + useCategories hook
│
├── iteration-2-start     ← = iteration-1-solution (sin infra extra)
├── iteration-2-solution  ← Handler GET /products + Tests + ProductCard + Intl + ProductMother + useProducts
│
├── iteration-3-start     ← = iteration-2-solution (sin infra extra)
├── iteration-3-solution  ← Handler GET /categories/:slug + Tests (incl. 404) + Links + CategoryDetail + DSL helpers
│
├── iteration-4-start     ← = iteration-3-solution (sin infra extra)
├── iteration-4-solution  ← Tests + ViewModeContext + Toggle conectado + toggleViewMode helper
│
├── iteration-5-start     ← = iteration-4-solution (sin infra extra)
└── iteration-5-solution  ← Handler GET /products/:id + Tests + ProductDetail dialog + clickProduct helper
```

---

## Verificación end-to-end

Para cada rama `-solution`:
1. `npm test` → todos los tests pasan
2. `npm run typecheck` → sin errores
3. `npm run lint` → sin errores
4. `npm start` → app funcional visualmente

Para cada rama `-start`:
1. `npm test` → tests existentes (de iteraciones anteriores) pasan
2. `npm run typecheck` → sin errores
3. No hay tests nuevos de la iteración actual

