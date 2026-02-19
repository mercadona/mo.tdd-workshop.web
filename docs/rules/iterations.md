# Guía de Iteraciones

## Handlers MSW

Pre-cocinados en master:
- `GET /categories` → lista de categorías

Los asistentes crean:
- `GET /products` → Iteración 2
- `GET /categories/:slug` → Iteración 3
- `GET /products/:id` → Iteración 5

## Iteración 1 — Listado de categorías
- Fetch de categorías en componente
- Refactor a `useCategories()` hook
- Test: `should render the list of categories in the navigation`

## Iteración 2 — Listado de productos
- Handler MSW para `/products`
- `<ProductCard />` dinámico (el estático ya existe en master como punto de partida)
- Formateo con `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })`
- ProductMother en tests
- Test: `should display the products with their prices correctly formatted`

## Iteración 3 — Navegación y routing
- Handler MSW para `/categories/:slug`
- Links con React Router (`Link`, `NavLink`, `useParams`)
- Helper `clickCategory()` en tests
- Test: `should navigate to the category page and display the category title`

## Iteración 4 — Toggle card/list view
- `ViewModeContext` con Provider + hook `useViewMode()`
- Integración del `<Toggle />` pre-cocinado
- Renderizado condicional: card (sin descripción, sin NutriScore) vs list (con ambos)
- Helper `toggleViewMode()` en tests
- **NutriScore solo en list view** — nunca en card view
- Tests verifican presencia/ausencia de descripciones y NutriScore (user-oriented, no aria-checked)

## Iteración 5 — Modal con dialog nativo
- `<ProductDetail />` dinámico (el estático ya existe en master como punto de partida)
- `<dialog open>` sin refs — controlado por el padre
- Helper `clickProduct()` en tests
- Tests: apertura y cierre del dialog
- NutriScore en el modal: `getByLabelText(/Nutriscore: X/i)` — usa aria-label, no texto visible

## APIs nativas a enseñar

**Intl.NumberFormat (Iteración 2):**
```typescript
new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price)
```

**Dialog nativo (Iteración 5):**
```tsx
// Patrón correcto: controlado por el padre, sin refs
{selectedProduct && <ProductDetail product={selectedProduct} onClose={...} />}

// En el componente hijo:
<dialog open className="product-detail">...</dialog>
```