# Prácticas de Testing

## Filosofía: Tests agnósticos de implementación

- Los tests no deben saber sobre detalles de implementación (routers, providers, contexts)
- Un `<Link>` es un anchor para el test: se clickea normalmente sin saber que usa React Router
- `render(<App />)` debe funcionar tal cual — NO crear custom renders con wrappers
- Simular comportamiento de usuario real: click en link → `user.click()`, URL directa → `window.history.pushState()`

## Prácticas generales

- **Renderizar siempre `<App />` completo** (no aislar componentes)
- **No usar `data-testid`** → usar roles semánticos y queries accesibles
- **NO usar `describe` cuando el test está en su propio archivo** — el nombre del archivo ya indica qué se testea. Solo usar `describe` cuando múltiples componentes se testean en un mismo archivo
- **Verificar ejemplos representativos, no todos los datos:**
  ```typescript
  expect(categories).toHaveLength(3)
  expect(screen.getByText('Fruta y verdura')).toBeVisible() // solo 1 ejemplo
  ```
- **Crear helpers DSL** para mejorar legibilidad: `clickCategory()`, `toggleViewMode()`, `clickProduct()`
- **Verificar datos de fixtures antes de escribir assertions** para evitar tests que fallan por datos incorrectos
- **Usar patrón Object Mother** para fixtures de datos

## findBy* vs getBy* en helpers

```typescript
// ✅ Correcto — espera a que el elemento aparezca
export const clickProduct = async (user: UserEvent, name: string) => {
  const productCard = await screen.findByRole('article', { name })
  await user.click(productCard)
}

// ❌ Incorrecto — falla si el elemento no está inmediatamente
export const clickProduct = async (user: UserEvent, name: string) => {
  const productCard = screen.getByRole('article', { name })
  await user.click(productCard)
}
```

## Simular navegación directa a URL

```typescript
it('should handle 404 for invalid URL', async () => {
  window.history.pushState({}, '', '/categories/non-existent')
  render(<App />)
  expect(await screen.findByText(/not found/i)).toBeVisible()
})
```

NO usar `MemoryRouter` ni `initialEntries`. El test debe funcionar con la app real.

## Testing semántico y accesibilidad

- **`aria-labelledby`** en cards/articles para vincular con su heading:
  ```typescript
  const headingId = `product-heading-${id}`
  <article aria-labelledby={headingId}>
    <h3 id={headingId}>{displayName}</h3>
  </article>
  ```

- **Buscar por nombre accesible** en lugar de `.closest()`:
  ```typescript
  const productCard = await screen.findByRole('article', {
    name: 'Aceitunas verdes rellenas de anchoa Hacendado',
  })
  ```

- **Usar `within`** cuando el contenido puede repetirse en múltiples elementos:
  ```typescript
  const productCard = await screen.findByRole('article', { name: 'Producto X' })
  expect(within(productCard).getByText('3,00 €')).toBeVisible()
  expect(within(productCard).getByLabelText(/Nutriscore: D/i)).toBeVisible()
  ```
  NO usar `getAllByText()[0]` como workaround.

- **NutriScore:** usar `getByLabelText(/Nutriscore: X/i)` — el componente usa `aria-label`, no texto visible

- **Evitar non-null assertions** (`productCard!`) — buscar por queries semánticas

## Testing user-oriented vs implementation details (Iteración 4)

**❌ MAL — testear detalles internos:**
```typescript
expect(toggle).toHaveAttribute('aria-checked', 'false')
expect(productCard).toHaveClass('product--list')
```

**✅ BIEN — testear comportamiento visible:**
```typescript
// Verificar presencia/ausencia de descripciones y NutriScore
expect(screen.queryByText(/descripción/)).not.toBeInTheDocument()
await toggleViewMode(user)
expect(screen.getByText(/descripción/)).toBeVisible()
expect(within(productCard).getByLabelText(/Nutriscore: D/i)).toBeVisible()
```

Si cambia la implementación (Toggle → button, clases CSS), el test no se rompe.
