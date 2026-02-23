# Plan: Componentes estáticos, NutriScore, CSS cleanup, Test skeletons y Guión del instructor

---

## Contexto

El workshop está funcionalmente completo (5 iteraciones, 14 tests). Este plan aborda las últimas mejoras antes de la entrega:

1. **Bug NutriScore en vista tarjeta**: En iteraciones 2-3, NutriScore se muestra en card view (incorrecto). La vista tarjeta NUNCA debe mostrar NutriScore.
2. **Componentes estáticos pre-cocinados**: Dar a los asistentes ProductCard y ProductDetail como componentes estáticos (sin props, sin hooks, texto hardcoded) en master, listos para dinamizar en su iteración correspondiente.
3. **NutriScore sin label visible**: Eliminar "Nutriscore: " como texto visible. Solo aria-label para testing. En ProductDetail, solo la letra alineada abajo a la derecha.
4. **Limpieza CSS**: Eliminar reglas CSS sin usar en todos los archivos.
5. **Test skeletons**: `it.todo()` en master para guiar a los asistentes.
6. **Guión del instructor**: `INSTRUCTOR.md` en raíz, en español.

---

## Estado actual de master (verificado)

| Archivo | Estado |
|---------|--------|
| `Home.tsx` | Solo `<h1>Hello World!</h1>` |
| `Home.test.tsx` | 1 test: "should render correctly the home" |
| `ProductCard.tsx` | **NO EXISTE** (solo CSS) |
| `ProductCard.css` | Existe con estilos card + list completos |
| `ProductDetail.tsx` | **NO EXISTE** (solo CSS) |
| `ProductDetail.css` | Existe con estilos completos |
| `NutriScore.tsx` | Existe con prop `showLabel` |
| `CategoryDetail.test.tsx` | **NO EXISTE** |
| `NotFound.test.tsx` | 1 test básico |

---

## Fase 1: Cambios en master

### 1.1 Fix NutriScore component

**Archivo:** `src/components/nutri-score/NutriScore.tsx`

Cambios:
- Eliminar prop `showLabel` y su interfaz
- Añadir `aria-label={`Nutriscore: ${score}`}` al `<span>`
- Mantener solo la letra como contenido visible

```tsx
// ANTES
export const NutriScore = ({ score, showLabel = false }: NutriScoreProps) => (
  <span className={classNames('nutri-score', `nutri-score--${score.toLowerCase()}`)}>
    {showLabel && 'Nutriscore: '}
    {score}
  </span>
)

// DESPUÉS
interface NutriScoreProps {
  score: string
}

export const NutriScore = ({ score }: NutriScoreProps) => (
  <span
    className={classNames('nutri-score', `nutri-score--${score.toLowerCase()}`)}
    aria-label={`Nutriscore: ${score}`}
  >
    {score}
  </span>
)
```

### 1.2 Static ProductCard (componente pre-cocinado)

**Crear:** `src/components/product-card/ProductCard.tsx` y `src/components/product-card/index.ts`

Requisitos:
- Un solo card estático con datos realistas del fixture (primer producto: "Aceitunas verdes rellenas de anchoa Hacendado", 3,00 €, imagen real)
- Sin props, sin hooks, sin imports de tipos
- Solo vista card (sin NutriScore, sin description)
- Usa las clases CSS de `.product-card--card` ya existentes
- NO se renderiza en Home.tsx (es solo un archivo pre-cocinado listo para que el asistente lo importe)

```tsx
import './ProductCard.css'

export const ProductCard = () => {
  return (
    <article className="product-card product-card--card">
      <div className="product-card__image-wrapper">
        <img
          className="product-card__image"
          src="/images/aceitunas-manzanilla-rellenas-anchoa-hacendado-pack-3-22910.jpg"
          alt="Aceitunas verdes rellenas de anchoa Hacendado"
        />
      </div>
      <div className="product-card__content">
        <h3 className="product-card__name">
          Aceitunas verdes rellenas de anchoa Hacendado
        </h3>
        <div className="product-card__footer">
          <span className="product-card__price">3,00 €</span>
        </div>
      </div>
    </article>
  )
}
```

### 1.3 Static ProductDetail (componente pre-cocinado)

**Crear:** `src/components/product-detail/ProductDetail.tsx` y `src/components/product-detail/index.ts`

Requisitos:
- Datos hardcoded del mismo producto (Aceitunas)
- Sin props, sin hooks
- Estructura de `<dialog open>` + overlay
- Incluye NutriScore como letra sola, alineada abajo a la derecha
- Botón cerrar estático (sin callback)
- NO se renderiza en ninguna página

```tsx
import { NutriScore } from 'components/nutri-score'
import './ProductDetail.css'

export const ProductDetail = () => {
  return (
    <>
      <div className="product-detail__overlay" />
      <dialog open className="product-detail">
        <div className="product-detail__content">
          <button className="product-detail__close" aria-label="Cerrar">
            ×
          </button>
          <img
            src="/images/aceitunas-manzanilla-rellenas-anchoa-hacendado-pack-3-22910.jpg"
            alt="Aceitunas verdes rellenas de anchoa Hacendado"
            className="product-detail__image"
          />
          <h2 className="product-detail__name">
            Aceitunas verdes rellenas de anchoa Hacendado
          </h2>
          <p className="product-detail__price">3,00 €</p>
          <p className="product-detail__description">
            Aceitunas verdes rellenas con anchoas de calidad. Perfectas para el aperitivo.
          </p>
          <div className="product-detail__nutriscore">
            <NutriScore score="D" />
          </div>
        </div>
      </dialog>
    </>
  )
}
```

### 1.4 CSS cleanup

**Reglas a eliminar (verificadas como sin usar):**

**`ProductCard.css`:**
- `.product-card--card .product-card__reference` - no se renderiza en ningún componente
- `.product-card--list .product-card__reference` - no se renderiza en ningún componente
- `.product-card__nutriscore` y variantes `--a/b/c/d/e` - DUPLICADO del NutriScore.css; el componente NutriScore usa sus propias clases

**`ProductDetail.css`:**
- `.product-detail__header` - no se usa en el componente (ni estático ni dinámico)
- `.product-detail__image-wrapper` - no se usa (la imagen va directamente)
- `.product-detail__info` - no se usa
- `.product-detail__meta` - no se usa
- `.product-detail__reference` - no se usa
- `.product-detail__nutriscore-badge` y variantes color `--a/b/c/d/e` - DUPLICADO, el NutriScore real usa NutriScore.css
- MANTENER: `.product-detail__nutriscore` (contenedor para alinear el badge a la derecha)

**`Home.css`:**
- MANTENER TODO: aunque Home.tsx actual es "Hello World", estas clases se usarán en las iteraciones

**`CategoryDetail.css`:**
- MANTENER TODO: mismo razonamiento

**`NutriScore.css`:**
- Sin cambios (todo en uso)

**Modificar `ProductDetail.css`** para que `.product-detail__nutriscore` alinee a la derecha:
```css
.product-detail__nutriscore {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}
```

**Nota:** Durante la implementación, usar la skill `frontend-design` para verificar el CSS y detectar reglas adicionales sin usar.

### 1.5 Test skeletons (it.todo)

**Archivo:** `src/pages/home/__tests__/Home.test.tsx`

- MANTENER el test existente: `should render correctly the home`
- Añadir skeletons con `it.todo()` agrupados por `describe` por iteración

```tsx
import { screen, render } from '@testing-library/react'
import { App } from 'app'

it('should render correctly the home', () => {
  render(<App />)
  const homeTitle = screen.getByRole('heading', { name: 'Hello World!' })
  expect(homeTitle).toBeInTheDocument()
})

describe('Iteración 1 - Listado de categorías', () => {
  it.todo('should render the list of categories in the navigation')
})

describe('Iteración 2 - Listado de productos', () => {
  it.todo('should display the products with their prices correctly formatted')
})

describe('Iteración 4 - Toggle card/list view', () => {
  it.todo('should not display product descriptions and nutriscore in card view')
  it.todo('should display product descriptions and nutriscore when switching to list view')
  it.todo('should hide product descriptions and nutriscore when switching back to card view')
})

describe('Iteración 5 - Modal de producto', () => {
  it.todo('should open a dialog with product details when clicking a product')
  it.todo('should close the dialog when clicking close button')
})
```

**Archivo:** `src/pages/category-detail/__tests__/CategoryDetail.test.tsx` (CREAR)

```tsx
describe('Iteración 3 - Navegación y routing', () => {
  it.todo('should navigate to the category page and display the category title')
  it.todo('should display a not found message when the category does not exist')
  it.todo('should highlight the active category in the navigation')
  it.todo('should navigate to home when clicking the logo')
})

describe('Iteración 5 - Modal de producto desde categoría', () => {
  it.todo('should open a dialog with product details when clicking a product from category')
  it.todo('should close the dialog when clicking close button from category')
})
```

**Archivo:** `src/pages/not-found/__tests__/NotFound.test.tsx`
- MANTENER el test existente tal cual (ya funciona)
- No añadir it.todo (la página NotFound se crea en iteración 3 en vivo)

### 1.6 Guión del instructor

**Crear:** `INSTRUCTOR.md` en la raíz del proyecto

Estructura:
```markdown
# Guión del instructor - TDD Workshop

## Antes de empezar
- Setup del entorno (requisitos, clone, npm install, npm start)
- Cómo mostrar las ramas solución
- Explicar los it.todo() como guía de lo que van a construir

## Iteración 1 — Listado de categorías (~20 min)
### Qué van a construir
### Ciclo TDD esperado
### Puntos clave a remarcar
### Solución de referencia (rama: iteration-1-solution)
### Errores frecuentes

## Iteración 2 — Productos y formateo (~25 min)
### Qué van a construir
### Ciclo TDD esperado
### Puntos clave a remarcar
  - Intl.NumberFormat
  - ProductMother pattern
  - El ProductCard estático ya existe, solo dinamizar
### Solución de referencia (rama: iteration-2-solution)
### Errores frecuentes

## Iteración 3 — Navegación y routing (~25 min)
### Qué van a construir
### Ciclo TDD esperado
### Puntos clave a remarcar
  - Handler MSW para /categories/:slug
  - React Router (Link, NavLink, useParams)
  - DSL helpers en tests
### Solución de referencia (rama: iteration-3-solution)
### Errores frecuentes

## Iteración 4 — Toggle card/list view (~20 min)
### Qué van a construir
### Ciclo TDD esperado
### Puntos clave a remarcar
  - Context API pattern
  - Testing user-oriented (no verificar aria-checked)
  - NutriScore solo en list view
### Solución de referencia (rama: iteration-4-solution)
### Errores frecuentes

## Iteración 5 — Modal con dialog nativo (~20 min)
### Qué van a construir
### Ciclo TDD esperado
### Puntos clave a remarcar
  - <dialog> nativo con atributo open
  - Componente controlado (padre maneja estado)
  - El ProductDetail estático ya existe, solo dinamizar
### Solución de referencia (rama: iteration-5-solution)
### Errores frecuentes

## Cierre
- Retrospectiva con asistentes
- Recursos y siguientes pasos
```

**Nota:** El contenido detallado de cada sección se escribirá durante la implementación, analizando el código de cada rama solución.

### 1.7 Commits en master

Agrupar en **3 commits** lógicos:

1. **Commit M1:** "Fix NutriScore, add static pre-cooked components, clean up unused CSS"
   - NutriScore.tsx (remove showLabel, add aria-label)
   - ProductCard.tsx + index.ts (estático)
   - ProductDetail.tsx + index.ts (estático)
   - CSS cleanup (ProductCard.css, ProductDetail.css)

2. **Commit M2:** "Add test skeletons with it.todo for workshop iterations"
   - Home.test.tsx (añadir describes + it.todo)
   - CategoryDetail.test.tsx (crear con it.todo)

3. **Commit M3:** "Add instructor guide"
   - INSTRUCTOR.md

---

## Fase 2: Cascade merge a todas las ramas

### 2.0 Safety: backup tags

```bash
for branch in iteration-{1..5}-{start,solution}; do
  git tag backup/$branch $branch
done
```

### 2.1 Cascade paso a paso

El cascade sigue la cadena lineal: master → iter-1-start → iter-1-solution → iter-2-start → ... → iter-5-solution.

#### Step C1: master → iteration-1-start

```bash
git checkout iteration-1-start
git merge master
```

**Conflictos esperados:** Mínimos o ninguno. NutriScore.tsx cambia limpiamente. ProductCard/ProductDetail son archivos nuevos (no conflict). Test skeletons son archivos nuevos o ampliados.

**Verificar:** `npm test` pasa.

#### Step C2: iteration-1-start → iteration-1-solution

```bash
git checkout iteration-1-solution
git merge iteration-1-start
```

**Conflictos esperados:**
- `Home.test.tsx`: El test real de categorías (iter-1) vs los skeletons de master. **Resolución:** Mantener test real de iter-1 + mantener it.todo de iter-2,4,5. Eliminar el `describe('Iteración 1')` con it.todo y el test trivial "Hello World" (ya no aplica).

**Verificar:** `npm test` pasa.

#### Step C3: iteration-1-solution → iteration-2-start

```bash
git checkout iteration-2-start
git merge iteration-1-solution
```

Debería ser fast-forward o merge limpio.

#### Step C4: iteration-2-start → iteration-2-solution (CRÍTICO)

```bash
git checkout iteration-2-solution
git merge iteration-2-start
```

**Conflictos esperados:**
1. **`ProductCard.tsx`**: Estático (master) vs dinámico (iter-2 con NutriScore en card view). **Resolución:** Tomar versión dinámica de iter-2 PERO eliminar `<NutriScore score={nutriscore} />` del render (fix del bug: card view nunca muestra nutriscore).
2. **`ProductCard/index.ts`**: Trivial - misma estructura.
3. **`NutriScore.tsx`**: Tomar versión de master (aria-label, sin showLabel).
4. **`Home.test.tsx`**: Mantener tests reales de iter-2 + it.todo de iter-4,5. Eliminar describes de iter-1 y iter-2 con it.todo.

**Verificar:** `npm test` pasa. NutriScore NO aparece en la vista de productos.

#### Step C5: iteration-2-solution → iteration-3-start

```bash
git checkout iteration-3-start
git merge iteration-2-solution
```

Fast-forward o merge limpio.

#### Step C6: iteration-3-start → iteration-3-solution (CRÍTICO)

```bash
git checkout iteration-3-solution
git merge iteration-3-start
```

**Conflictos esperados:**
1. **`ProductCard.tsx`**: Tomar versión sin NutriScore (misma que iter-2 corregida). Iter-3 no modifica ProductCard.
2. **`CategoryDetail.test.tsx`**: Skeletons (master) vs tests reales (iter-3). **Resolución:** Mantener tests reales de iter-3. Mantener it.todo del describe de iter-5 (modal desde categoría). Eliminar el describe de iter-3 con it.todo.
3. **`Home.test.tsx`**: Misma resolución que iter-2.

**Verificar:** `npm test` pasa.

#### Step C7: iteration-3-solution → iteration-4-start

```bash
git checkout iteration-4-start
git merge iteration-3-solution
```

Fast-forward o merge limpio.

#### Step C8: iteration-4-start → iteration-4-solution (CRÍTICO - cambio de assertions)

```bash
git checkout iteration-4-solution
git merge iteration-4-start
```

**Conflictos esperados:**
1. **`ProductCard.tsx`**: Iter-4-start (sin NutriScore) vs iter-4-solution (con NutriScore condicional + showLabel). **Resolución:** Tomar versión de iter-4 con NutriScore condicional PERO eliminar `showLabel` (ya no existe como prop):
   ```tsx
   {isListView && nutriscore && <NutriScore score={nutriscore} />}
   ```
2. **`Home.test.tsx`**: **Actualizar TODAS las assertions de NutriScore:**
   ```tsx
   // ANTES
   expect(screen.queryByText(/Nutriscore: D/)).not.toBeInTheDocument()
   expect(within(productCard).getByText(/Nutriscore: D/)).toBeVisible()

   // DESPUÉS
   expect(within(productCard).queryByLabelText(/Nutriscore: D/i)).not.toBeInTheDocument()
   expect(within(productCard).getByLabelText(/Nutriscore: D/i)).toBeVisible()
   ```
3. **`NutriScore.tsx`**: Tomar versión de master.

**Verificar:** `npm test` pasa. NutriScore solo visible en list view.

#### Step C9: iteration-4-solution → iteration-5-start

```bash
git checkout iteration-5-start
git merge iteration-4-solution
```

Fast-forward o merge limpio.

#### Step C10: iteration-5-start → iteration-5-solution (CRÍTICO)

```bash
git checkout iteration-5-solution
git merge iteration-5-start
```

**Conflictos esperados:**
1. **`ProductDetail.tsx`**: Estático (master) vs dinámico (iter-5 con showLabel). **Resolución:** Tomar versión dinámica PERO eliminar `showLabel` de NutriScore. Envolver NutriScore en div para alineación derecha:
   ```tsx
   {product.nutriscore && (
     <div className="product-detail__nutriscore">
       <NutriScore score={product.nutriscore} />
     </div>
   )}
   ```
2. **`ProductCard.tsx`**: Merge del `onClick` prop de iter-5 con la versión corregida de iter-4. **Resolución:** Mantener `onClick` + mantener NutriScore condicional sin showLabel.
3. **`Home.test.tsx`**: Actualizar assertions de NutriScore en tests de dialog:
   ```tsx
   // ANTES
   expect(within(dialog).getByText(/Nutriscore: D/)).toBeVisible()

   // DESPUÉS
   expect(within(dialog).getByLabelText(/Nutriscore: D/i)).toBeVisible()
   ```
4. **`CategoryDetail.test.tsx`**: Mantener tests reales de iter-5, eliminar it.todo sobrantes.
5. **`ProductDetail/index.ts`**: Trivial.

**Verificar:** `npm test` pasa (14 tests).

### 2.2 Push de todas las ramas

```bash
git push --all origin
```

---

## Fase 3: Verificación global

### Checks en cada rama

Para cada rama, ejecutar:
```bash
git checkout <branch>
npm test
npm run typecheck
```

### Verificaciones visuales (opcional)

- `master`: `npm start` → ver página "Hello World" sin errores
- `iteration-5-solution`: `npm start` → verificar:
  - Card view: sin NutriScore, sin descripción
  - List view: con NutriScore (solo letra, sin label "Nutriscore:"), con descripción
  - Modal: con NutriScore alineado abajo derecha (solo letra, sin label)

---

## Fase 4: Retrospectiva

- [x] Revisar si hay decisiones nuevas que documentar en CLAUDE.md
- [x] Confirmar que este plan refleja el estado completado

---

## Archivos críticos

| Archivo | Acción |
|---------|--------|
| `src/components/nutri-score/NutriScore.tsx` | Modificar: eliminar showLabel, añadir aria-label |
| `src/components/product-card/ProductCard.tsx` | Crear estático en master; resolver conflictos en iter-2/3/4/5 |
| `src/components/product-card/ProductCard.css` | Limpiar CSS sin usar (.reference, .nutriscore duplicados) |
| `src/components/product-detail/ProductDetail.tsx` | Crear estático en master; resolver conflicto en iter-5 |
| `src/components/product-detail/ProductDetail.css` | Limpiar CSS sin usar, ajustar .nutriscore para alinear derecha |
| `src/pages/home/__tests__/Home.test.tsx` | Añadir it.todo en master; actualizar assertions NutriScore en iter-4/5 |
| `src/pages/category-detail/__tests__/CategoryDetail.test.tsx` | Crear con it.todo en master; resolver conflictos en iter-3/5 |
| `INSTRUCTOR.md` | Crear nuevo en master |

---

## Orden de ejecución (resumen)

1. ✅ Checkout master
2. ✅ Fase 1.1-1.4: NutriScore + componentes estáticos + CSS cleanup → Commit M1
3. ✅ Fase 1.5: Test skeletons → Commit M2
4. ✅ Backup tags
5. ✅ Cascade merge C1-C10 con resoluciones documentadas arriba
6. ✅ Verificación global (npm test en todas las ramas — 14 tests en iter-5-solution, todo verde)
7. ✅ Push all
8. ✅ Retrospectiva + reestructuración CLAUDE.md (807 → 78 líneas, reglas en .claude/rules/ y docs/rules/)
9. ✅ INSTRUCTOR.md → Commit M3