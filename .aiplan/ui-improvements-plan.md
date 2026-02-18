# Plan: UI Improvements - Logo, NutriScore, Footer

## Contexto

El workshop está completo (5 iteraciones, 13 tests, visual-fixes-v2 aplicado). Este plan
implementa un lote de mejoras UI: logo de Mercadona en cabecera, extracción del componente
NutriScore a componente reutilizable, logo clicable con test dedicado, y footer disclaimer
para demos.

**Decisiones tomadas:**
- NutriScore: badge simple (extraer a componente, mantener visual actual de pill coloreada)
- Logo clicable: test dedicado nuevo en iteration-3-solution
- Footer: sin test, solo para demo

---

## F0: Cambios en master

### F0.1 Logo Mercadona en Navigation
- [x] Reemplazar `<h1 className="navigation__title">TDD Workshop</h1>` por `<img>`
- [x] Usar `<img src="/mercadona-logo.svg" alt="Mercadona" className="navigation__logo" />`
- [x] Añadir CSS: `.navigation__logo { max-width: 230px; height: auto; }`
- [x] Eliminar `.navigation__title` del CSS (ya no se usa)

**Archivos:**
- `src/components/navigation/Navigation.tsx`
- `src/components/navigation/Navigation.css`

### F0.2 Footer disclaimer en App
- [x] Añadir `<footer>` después de `<main>` en `app.tsx`
- [x] Texto: "La información de los productos ha sido generada con IA y no refleja datos reales. Solo con fines de testing."
- [x] Crear estilos en `src/styles/globals.css` (estilo discreto, gris, centrado, font-size small)

**Archivos:**
- `src/app.tsx`
- `src/styles/globals.css` (añadir estilos de `.disclaimer`)

### F0.3 Commit y verificación
- [x] `npm run typecheck && npm run lint && npm test` en master
- [ ] Verificar visualmente que el logo se muestra correctamente
- [x] Commit

---

## F1: Cascade master → todas las ramas

Merge en cadena. En cada paso resolver conflictos si los hay.

- [x] `master` → `iteration-1-start`
- [x] `iteration-1-start` → `iteration-1-solution`
- [x] `iteration-1-solution` → `iteration-2-start`
- [x] `iteration-2-start` → `iteration-2-solution`
- [x] `iteration-2-solution` → `iteration-3-start`
- [x] `iteration-3-start` → `iteration-3-solution`
- [x] `iteration-3-solution` → `iteration-4-start`
- [x] `iteration-4-start` → `iteration-4-solution`
- [x] `iteration-4-solution` → `iteration-5-start`
- [x] `iteration-5-start` → `iteration-5-solution`

**Conflictos esperados:**
- `app.tsx` en iter-3+ (master tiene `<>header+main+footer</>`, iter-3+ tiene `<AppRoutes />`).
  Resolución: mover footer a `RootLayout.tsx` en iter-3+.

**Verificación por rama:** `npm run typecheck && npm test` tras cada merge.

---

## F2: Componente NutriScore en iteration-2-solution

### F2.1 Crear componente
- [x] Crear `src/components/nutri-score/NutriScore.tsx`
- [x] Crear `src/components/nutri-score/NutriScore.css` (mover estilos de nutriscore desde ProductCard.css)
- [x] Crear `src/components/nutri-score/index.ts` (barrel export)

**NutriScore.tsx:**
```tsx
import classNames from 'classnames'
import './NutriScore.css'

interface NutriScoreProps {
  score: string
  showLabel?: boolean
}

export const NutriScore = ({ score, showLabel = false }: NutriScoreProps) => (
  <span className={classNames('nutri-score', `nutri-score--${score.toLowerCase()}`)}>
    {showLabel && 'Nutriscore: '}{score}
  </span>
)
```

**NutriScore.css** (extraído de ProductCard.css):
```css
.nutri-score {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-white);
  text-transform: uppercase;
}

.nutri-score--a { background-color: #038141; }
.nutri-score--b { background-color: #85bb2f; }
.nutri-score--c { background-color: #fecb02; color: var(--color-text); }
.nutri-score--d { background-color: #ee8100; }
.nutri-score--e { background-color: #e63e11; }
```

### F2.2 Refactor ProductCard
- [x] Reemplazar el `<span>` de nutriscore por `<NutriScore score={nutriscore} />`
- [x] Eliminar estilos `.product-card__nutriscore*` de `ProductCard.css`

**En iter-2 (badge siempre visible):**
```tsx
<NutriScore score={nutriscore} />
```

**Archivos:**
- `src/components/nutri-score/NutriScore.tsx` (nuevo)
- `src/components/nutri-score/NutriScore.css` (nuevo)
- `src/components/nutri-score/index.ts` (nuevo)
- `src/components/product-card/ProductCard.tsx` (refactor)
- `src/components/product-card/ProductCard.css` (eliminar estilos nutriscore)

### F2.3 Verificación y commit
- [x] `npm run typecheck && npm test` en iteration-2-solution
- [x] Commit

---

## F3: Cascade iteration-2-solution → ramas siguientes

- [x] `iteration-2-solution` → `iteration-3-start`
- [x] `iteration-3-start` → `iteration-3-solution`
- [x] `iteration-3-solution` → `iteration-4-start`
- [x] `iteration-4-start` → `iteration-4-solution`
- [x] `iteration-4-solution` → `iteration-5-start`
- [x] `iteration-5-start` → `iteration-5-solution`

**Conflictos esperados:**
- `ProductCard.tsx` en iter-4+ (iter-4 usa `showLabel` con `isListView`).
  Resolución: usar `<NutriScore score={nutriscore} showLabel />` en la versión condicional.
- `ProductCard.css` en todas: los estilos nutriscore se eliminaron, resolver a favor de la eliminación.

**Verificación:** `npm run typecheck && npm test` tras cada merge.

---

## F4: Logo clicable + test en iteration-3-solution

### F4.1 Link en el logo
- [x] En `Navigation.tsx` de iter-3-solution, envolver el logo en `<Link to="/">`
- [x] Añadir CSS para que el link no tenga estilos de anchor

```tsx
import { Link, NavLink } from 'react-router-dom'

// Dentro del JSX:
<Link to="/" className="navigation__logo-link">
  <img src="/mercadona-logo.svg" alt="Mercadona" className="navigation__logo" />
</Link>
```

**CSS:**
```css
.navigation__logo-link {
  display: inline-flex;
  align-items: center;
}
```

### F4.2 Test dedicado
- [x] Añadir test en `src/pages/category-detail/__tests__/CategoryDetail.test.tsx`
  (archivo donde viven los tests de navegación en iter-3)

```typescript
it('should navigate to home when clicking the logo', async () => {
  const user = userEvent.setup()
  render(<App />)

  await clickCategory(user, 'Fruta y verdura')
  await screen.findByRole('heading', { name: 'Fruta y verdura' })

  const logo = screen.getByRole('link', { name: 'Mercadona' })
  await user.click(logo)

  expect(screen.queryByRole('heading', { name: 'Fruta y verdura' })).not.toBeInTheDocument()
  expect(await screen.findByText('Fruta y verdura')).toBeVisible()
})
```

El test:
1. Navega a una categoría (para estar fuera de home)
2. Clickea el logo (link con alt="Mercadona")
3. Verifica que ya no está en la página de categoría (no heading de categoría)
4. Verifica que vuelve a home (categorías visibles como enlaces, no como heading)

**Nota:** En master el logo NO es clicable (Navigation está fuera del Router).
Solo en iter-3+ donde RootLayout está dentro del Router se añade el `<Link>`.

### F4.3 Verificación y commit
- [x] `npm run typecheck && npm test` en iteration-3-solution
- [x] Commit

---

## F5: Cascade iteration-3-solution → ramas siguientes

- [x] `iteration-3-solution` → `iteration-4-start`
- [x] `iteration-4-start` → `iteration-4-solution`
- [x] `iteration-4-solution` → `iteration-5-start`
- [x] `iteration-5-start` → `iteration-5-solution`

**Verificación:** `npm run typecheck && npm test` tras cada merge.

---

## F6: NutriScore en ProductDetail (iteration-5-solution)

### F6.1 Integrar NutriScore en ProductDetail
- [x] Añadir `<NutriScore score={product.nutriscore} showLabel />` en `ProductDetail.tsx`
- [x] Eliminar los estilos duplicados `.product-detail__nutriscore-badge--*` de `ProductDetail.css`
  (ya no se necesitan, el componente trae sus propios estilos)

```tsx
import { NutriScore } from 'components/nutri-score'

// Dentro del JSX, después de price:
{product.nutriscore && <NutriScore score={product.nutriscore} showLabel />}
```

### F6.2 Verificación y commit
- [x] `npm run typecheck && npm test` en iteration-5-solution
- [x] Commit

---

## F7: Push y verificación final

- [x] Push de todas las ramas
- [ ] Verificar que CI pasa (si hay)
- [ ] Revisión visual rápida de:
  - master: logo + footer visible
  - iter-3: logo clicable → home
  - iter-2: NutriScore badge en ProductCard
  - iter-4: NutriScore con label en list view
  - iter-5: NutriScore en ProductDetail modal

---

## Resumen de archivos afectados

| Archivo | Rama origen | Cambio |
|---------|-------------|--------|
| `src/components/navigation/Navigation.tsx` | master | Logo `<img>` reemplaza `<h1>` |
| `src/components/navigation/Navigation.css` | master | Estilos logo, eliminar title |
| `src/app.tsx` | master | Footer disclaimer |
| `src/styles/globals.css` | master | Estilos disclaimer |
| `src/components/nutri-score/NutriScore.tsx` | iter-2-solution | Componente nuevo |
| `src/components/nutri-score/NutriScore.css` | iter-2-solution | Estilos extraídos |
| `src/components/nutri-score/index.ts` | iter-2-solution | Barrel export |
| `src/components/product-card/ProductCard.tsx` | iter-2-solution | Usa `<NutriScore>` |
| `src/components/product-card/ProductCard.css` | iter-2-solution | Eliminar estilos nutriscore |
| `src/components/navigation/Navigation.tsx` | iter-3-solution | Link en logo |
| `src/components/navigation/Navigation.css` | iter-3-solution | Estilos logo-link |
| `CategoryDetail.test.tsx` | iter-3-solution | Test logo → home |
| `src/pages/routes/RootLayout.tsx` | iter-3-solution+ | Footer (merge conflict) |
| `src/components/product-detail/ProductDetail.tsx` | iter-5-solution | Integra `<NutriScore>` |
| `src/components/product-detail/ProductDetail.css` | iter-5-solution | Eliminar estilos duplicados |

---

## Notas de contexto para implementación

**Estructura de routing (importante para el logo clicable):**
- **master**: `app.tsx` tiene `<>header+main</>` con Navigation FUERA del Router
- **iter-3+**: `app.tsx` tiene solo `<AppRoutes />`, con `RootLayout.tsx` DENTRO del Router
- Por eso el `<Link>` en el logo solo es posible desde iter-3 en adelante

**NutriScore actual:**
- iter-2: badge siempre visible (solo letra), usa template literal para clase CSS
- iter-4: badge condicional solo en list view, muestra "Nutriscore: X"
- iter-5 ProductDetail: NO tiene nutriscore (CSS skeleton existe pero no se usa)

---

## Retrospectiva

### Aprendizajes
- Los merge cascades en cadena son mecánicos pero requieren atención: cada conflicto en Navigation.tsx o ProductCard.tsx tiene un patrón claro (combinar ambas versiones)
- El footer en iter-3+ va en RootLayout, no en app.tsx (la app ya delegó todo al router)
- El test del logo clicable necesita `await screen.findByText(...)` antes de `clickCategory` (mismo patrón que los otros tests de navegación — las categorías son async)
- Import relativo `../../types` en ProductDetail.tsx: corregido de paso a import absoluto

### Fricciones
- Al inicio de la sesión olvidé actualizar el plan mientras avanzaba — el usuario lo señaló y se corrigió el hábito durante la sesión
- CLAUDE.md generó conflicto de merge en iter-1-start: resuelto a favor de master (versión más actualizada)

### Decisiones de código
- `NutriScore` con `showLabel` prop cubre los tres casos: badge solo (iter-2), badge con label (iter-4 list view, iter-5 modal)
- No se añadió lógica extra en iter-5 para el `../../types` — era un fix obvio de calidad

### CLAUDE.md
- Sin cambios necesarios: las convenciones ya cubren todo lo implementado
