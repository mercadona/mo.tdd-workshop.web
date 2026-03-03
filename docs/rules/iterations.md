# Guía de Iteraciones

## Handlers MSW

Pre-cocinados en master (con stubs comentados como guía):
- `GET /categories` → lista de categorías *(activo desde el inicio)*

Los asistentes crean:
- `GET /products` → Iteración 2
- `GET /categories/:slug` → Iteración 3 (devuelve solo el objeto `Category`)
- `GET /categories/:slug/products` → Iteración 3 (devuelve `Product[]` de esa categoría)

La Iteración 5 **no añade ningún endpoint nuevo** — el modal usa el objeto `product` ya disponible en el estado del padre.

## Iteración 1 — Listado de categorías
- Fetch de categorías en componente
- Refactor a `useCategories()` hook
- Test: `should render the list of categories in the navigation`

## Iteración 2 — Listado de productos
- Handler MSW para `GET /products`
- `<ProductCard />` dinámico (el estático ya existe en master como punto de partida)
- Formateo con `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })`
- ProductMother en tests
- Test: `should display the products with their prices correctly formatted`

## Iteración 3 — Navegación y routing
- Dos handlers MSW: `GET /categories/:slug` y `GET /categories/:slug/products`
- `useCategoryWithProducts(slug)` → hace dos fetches separados, devuelve `{ category, products, notFound }`
- Links con React Router (`Link`, `NavLink`, `useParams`)
- Helper `clickCategory()` en tests (usa `findByRole` — async, porque las categorías cargan via MSW)
- Tests obligatorios: navegar a categoría + mostrar productos
- Tests opcionales: logo vuelve a home, categoría activa en nav, 404

## Iteración 4 — Toggle card/list view
- `ViewModeContext` con Provider + hook `useViewMode()`
- Integración del `<Toggle />` pre-cocinado
- Renderizado condicional en `ProductCard`: card (sin descripción) vs list (con descripción)
- Helper `toggleViewMode()` en tests
- Tests verifican presencia/ausencia de descripciones (user-oriented, no clases CSS ni aria-checked)

## Iteración 5 — Modal con dialog nativo
- `<ProductDetail />` dinámico (el estático ya existe en master como punto de partida)
- `useProductDialog()` → `{ selectedProduct, handleProductClick, handleClose }`
  - `handleProductClick(product: Product)` — recibe el objeto completo, sin fetch
  - `handleClose()` → pone `selectedProduct` a `null`
- El padre renderiza condicionalmente: `{selectedProduct && <ProductDetail product={selectedProduct} onClose={handleClose} />}`
- `<dialog open>` sin refs — controlado por el padre
- Helper `clickProduct()` en tests
- Tests: apertura (verifica nombre + precio + descripción) y cierre del dialog

## APIs nativas a enseñar

**Intl.NumberFormat (Iteración 2):**
```typescript
new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price)
```

**Dialog nativo (Iteración 5):**
```tsx
// Patrón correcto: controlado por el padre, sin refs
{selectedProduct && <ProductDetail product={selectedProduct} onClose={handleClose} />}

// En el componente hijo:
<dialog open className="product-detail">...</dialog>
```